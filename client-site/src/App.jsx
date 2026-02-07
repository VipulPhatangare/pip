// Main App Component - Protean Interface Protocol Client
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProteanRenderer from './core/ProteanRenderer';
import ConsentModal from './components/ConsentModal';
import TierTransition from './components/TierTransition';
import TransitionToast from './components/TransitionToast';
import OfflineIndicator from './components/OfflineIndicator';
import { environmentMonitor } from './core/environmentMonitor';
import { brainClient } from './services/brainClient';
import { useLogStore } from './store/logStore';
import { useFormStore } from './store/formStore';
import { defaultIntent } from './intents/exampleIntents';
import { useTierMemory } from './context/TierMemoryContext';
import { TierProvider } from './context/TierContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { detectInitialTier, getInitialTierReason } from './utils/initialTierDetector';

// Import Real Estate Pages
import HomePage from './components/pages/HomePage';
import PropertiesPage from './components/pages/PropertiesPage';
import PropertyDetailsPage from './components/pages/PropertyDetailsPage';
import BookVisitPage from './components/pages/BookVisitPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import DashboardPage from './components/pages/DashboardPage';
import ContactAgentPage from './components/pages/ContactAgentPage';
import PaymentRequestPage from './components/pages/PaymentRequestPage';
import ProtectedRoute from './components/ProtectedRoute';

const BRAIN_SERVER_URL = import.meta.env.VITE_BRAIN_SERVER_URL || 'http://localhost:3001';

// Track route changes for tier memory
function RouteTracker({ currentRouteRef, tierMemory }) {
  const location = useLocation();
  
  useEffect(() => {
    currentRouteRef.current = location.pathname;
    tierMemory.recordNavigation(location.pathname);
  }, [location, currentRouteRef, tierMemory]);
  
  return null;
}

function App() {
  // Detect initial tier INSTANTLY before rendering to avoid flash
  const initialTier = detectInitialTier();
  
  const [metrics, setMetrics] = useState(environmentMonitor.getMetrics());
  const [currentTier, setCurrentTier] = useState(initialTier);
  const [previousTier, setPreviousTier] = useState(null);
  const [activeIntent] = useState(defaultIntent);
  const [brainConnected, setBrainConnected] = useState(false);
  const [tierHistory, setTierHistory] = useState([initialTier]);
  const [pendingDecision, setPendingDecision] = useState(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showTransitionToast, setShowTransitionToast] = useState(false);
  const [toastProposedTier, setToastProposedTier] = useState(null);
  const [isUserIdle, setIsUserIdle] = useState(false);
  
  // Use ref to track current tier for comparison without causing re-renders
  const currentTierRef = useRef(initialTier);
  
  // Tier memory context for route-based tier persistence
  const tierMemory = useTierMemory();
  
  // Track current route/view
  const currentRouteRef = useRef('/');
  
  // Focus and scroll preservation
  const focusedElementRef = useRef(null);
  const scrollPositionRef = useRef({ x: 0, y: 0 });
  const idleTimerRef = useRef(null);
  const userHasInteracted = useRef(false);
  
  const { logTierChange, logInfo, logWarning } = useLogStore();
  const { setActiveIntent: setStoreIntent } = useFormStore();

  // Detect user idle state for intelligent consent timing
  useEffect(() => {
    const resetIdleTimer = () => {
      userHasInteracted.current = true; // Mark that user has interacted
      setIsUserIdle(false);
      clearTimeout(idleTimerRef.current);
      
      idleTimerRef.current = setTimeout(() => {
        setIsUserIdle(true);
      }, 3000); // 3 seconds of inactivity = idle
    };

    // Listen for user activity
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);

    resetIdleTimer(); // Initialize

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('scroll', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Preserve focus and scroll position before tier transitions
  useEffect(() => {
    // Save focused element
    const saveFocus = () => {
      const activeEl = document.activeElement;
      if (activeEl && activeEl !== document.body) {
        focusedElementRef.current = {
          tagName: activeEl.tagName,
          id: activeEl.id,
          name: activeEl.name,
          type: activeEl.type,
          selectionStart: activeEl.selectionStart,
          selectionEnd: activeEl.selectionEnd,
          value: activeEl.value
        };
      }
    };

    // Save scroll position
    const saveScroll = () => {
      scrollPositionRef.current = {
        x: window.scrollX,
        y: window.scrollY
      };
    };

    // Save every second
    const interval = setInterval(() => {
      saveFocus();
      saveScroll();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Restore focus and scroll after tier transition
  const restoreFocusAndScroll = () => {
    // Restore scroll position
    setTimeout(() => {
      window.scrollTo(scrollPositionRef.current.x, scrollPositionRef.current.y);
    }, 100);

    // Restore focus
    if (focusedElementRef.current) {
      setTimeout(() => {
        const { tagName, id, name, type, selectionStart, selectionEnd, value } = focusedElementRef.current;
        
        let element = null;
        if (id) {
          element = document.getElementById(id);
        } else if (name) {
          element = document.querySelector(`${tagName.toLowerCase()}[name="${name}"]`);
        }

        if (element) {
          element.focus();
          
          // Restore cursor position for text inputs
          if (selectionStart !== undefined && selectionEnd !== undefined) {
            try {
              element.setSelectionRange(selectionStart, selectionEnd);
            } catch (e) {
              // Some elements don't support setSelectionRange
            }
          }
        }
      }, 200);
    }
  };

  // Haptic feedback for tier transitions
  const triggerHaptic = (pattern) => {
    // Vibration API requires user gesture due to browser security policy
    if ('vibrate' in navigator && userHasInteracted.current) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        // Silently fail if vibration is blocked (user hasn't interacted yet)
        // This is expected behavior and not an error
      }
    }
  };

  // Initialize monitoring systems
  useEffect(() => {
    logInfo('Protean Client Site initialized');
    logInfo(`Initial Tier: ${initialTier} - ${getInitialTierReason(initialTier)}`);
    setStoreIntent(activeIntent);
    
    // Initialize demo data for localStorage
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([
        {
          id: 1,
          name: 'Demo User',
          email: 'demo@test.com',
          password: 'demo123',
          phone: '+91 98765 43210',
          createdAt: new Date().toISOString()
        }
      ]));
      logInfo('Demo user created: demo@test.com / demo123');
    }
    
    // Record navigation to initial route
    tierMemory.recordNavigation(currentRouteRef.current);
    
    // Connect to brain server
    brainClient.connect();
    
    // Subscribe to connection status
    const unsubscribeConnection = brainClient.onConnectionChange((connected) => {
      setBrainConnected(connected);
      if (!connected && currentTierRef.current !== 'D') {
        logWarning('Brain server unavailable - switching to Tier D survival mode');
        
        const oldTier = currentTierRef.current;
        currentTierRef.current = 'D';
        
        setPreviousTier(oldTier);
        setTierHistory(prev => [...prev.slice(-4), 'D']);
        setCurrentTier('D');
      }
    });

    // Fallback: stop initializing after 3 seconds even if no decision received
    const initTimeout = setTimeout(() => {
      console.log('⏱️ Initialization timeout - using initial tier');
      setIsInitializing(false);
    }, 3000);

    // Subscribe to tier decisions from brain server
    const unsubscribeTier = brainClient.onTierDecision((decision) => {
      console.log('🧠 Received tier decision from brain server:', {
        tier: decision.tier,
        reason: decision.reason,
        emergency: decision.emergency,
        autoSwitch: decision.autoSwitch,
        currentTier: currentTierRef.current
      });
      
      // Mark initialization complete on first tier decision
      clearTimeout(initTimeout);
      setIsInitializing(false);

      // Check if user consent is required
      if (decision.requiresConsent && !decision.emergency) {
        // Only show consent during idle moments (intelligent timing)
        if (isUserIdle) {
          logInfo(`Battery optimization suggested: Tier ${decision.suggestedTier}`);
          
          // Show transition toast instead of blocking modal
          setToastProposedTier(decision.suggestedTier || decision.tier);
          setShowTransitionToast(true);
          setPendingDecision(decision);
        } else {
          // User is busy, queue for later
          logInfo(`Tier change queued (user active): ${decision.suggestedTier}`);
          setPendingDecision(decision);
        }
        return;
      }

      // Emergency or auto-switch
      if (decision.emergency || decision.autoSwitch !== false) {
        const newTier = decision.tier;
        const oldTier = currentTierRef.current;
        const currentRoute = currentRouteRef.current;
        
        // Check tier memory: prevent downgrade on revisited routes
        const isRevisit = tierMemory.isRouteVisited(currentRoute);
        const minimumTier = tierMemory.getMinimumTier(currentRoute);
        
        // If this route was visited before and new tier is lower, check if should lock
        if (isRevisit && !decision.emergency) {
          const shouldLock = tierMemory.shouldLockTier(currentRoute, newTier);
          
          if (shouldLock) {
            logInfo(`Route memory: Maintaining ${minimumTier} for ${currentRoute} (proposed: ${newTier})`);
            return;
          }
        }
        
        // Only update if tier actually changed
        if (newTier !== oldTier) {
          console.log(`✅ Tier change applied: ${oldTier} → ${newTier}`, {
            reason: decision.reason,
            emergency: decision.emergency,
            route: currentRoute
          });
          
          logTierChange(oldTier, newTier, decision.reason);
          
          // Haptic feedback based on transition type
          if (decision.emergency) {
            triggerHaptic([100, 50, 100, 50, 100]); // Triple strong buzz
          } else if (newTier > oldTier) {
            triggerHaptic([50]); // Single gentle buzz (upgrade)
          } else {
            triggerHaptic([50, 100, 50]); // Double-tap (downgrade)
          }
          
          // Record this tier for the current route
          tierMemory.recordRouteTier(currentRoute, newTier);
          
          // Update ref immediately
          currentTierRef.current = newTier;
          
          // Batch all state updates
          setPreviousTier(oldTier);
          setTierHistory(prev => [...prev.slice(-4), newTier]);
          setCurrentTier(newTier);
        }
      }
    });
    
    // Start environment monitoring
    environmentMonitor.startMonitoring();
    
    // Subscribe to metric changes and send to brain
    const unsubscribeMetrics = environmentMonitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      
      // Send metrics to brain server with current route
      // Don't send metrics when page is hidden (tab switched/minimized)
      if (brainClient.isConnected() && !document.hidden) {
        brainClient.sendMetrics(newMetrics, currentRouteRef.current);
      }
    });

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden && brainClient.isConnected()) {
        // Page became visible - send fresh metrics immediately
        logInfo('Page visible - sending fresh metrics to brain server');
        const currentMetrics = environmentMonitor.getMetrics();
        brainClient.sendMetrics(currentMetrics, currentRouteRef.current);
      } else if (document.hidden) {
        logInfo('Page hidden - pausing metric updates');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearTimeout(initTimeout);
      environmentMonitor.stopMonitoring();
      brainClient.disconnect();
      unsubscribeMetrics();
      unsubscribeTier();
      unsubscribeConnection();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Perform tier switch with focus/scroll preservation and haptic feedback
  const performTierSwitch = (decision) => {
    const newTier = decision.tier;
    const oldTier = currentTierRef.current;
    const currentRoute = currentRouteRef.current;
    
    // Check tier memory: prevent downgrade on revisited routes
    const isRevisit = tierMemory.isRouteVisited(currentRoute);
    const minimumTier = tierMemory.getMinimumTier(currentRoute);
    
    // If this route was visited before and new tier is lower, enforce minimum
    if (isRevisit && !decision.emergency) {
      const shouldLock = tierMemory.shouldLockTier(currentRoute, newTier);
      
      if (shouldLock) {
        logInfo(`Route memory: Maintaining ${minimumTier} for ${currentRoute} (proposed: ${newTier})`);
        return; // Don't downgrade
      }
    }
    
    // Only update if tier actually changed
    if (newTier !== oldTier) {
      logTierChange(oldTier, newTier, decision.reason);
      
      // Trigger haptic feedback
      const isDowngrade = ['A', 'B', 'C', 'D'].indexOf(newTier) > ['A', 'B', 'C', 'D'].indexOf(oldTier);
      if (decision.emergency) {
        triggerHaptic([100, 50, 100, 50, 100]); // Triple vibration for emergency
      } else if (isDowngrade) {
        triggerHaptic([50, 100, 50]); // Double tap for downgrade
      } else {
        triggerHaptic([50]); // Single gentle vibration for upgrade
      }
      
      // Record this tier for the current route
      tierMemory.recordRouteTier(currentRoute, newTier);
      
      // Update ref immediately
      currentTierRef.current = newTier;
      
      // Batch all state updates together
      setPreviousTier(oldTier);
      setTierHistory(prev => [...prev.slice(-4), newTier]);
      setCurrentTier(newTier);
      
      // Restore focus and scroll after transition
      setTimeout(restoreFocusAndScroll, 700);
    }
  };

  // Handle transition toast acceptance
  const handleToastAccept = async () => {
    setShowTransitionToast(false);
    if (toastProposedTier) {
      performTierSwitch(toastProposedTier.decision);
      setToastProposedTier(null);
    }
  };

  // Handle transition toast rejection
  const handleToastReject = () => {
    setShowTransitionToast(false);
    logInfo('User rejected tier optimization');
    setToastProposedTier(null);
    
    // Snooze for 5 minutes
    // (In production, send this to brain server)
  };

  // Handle user consent for battery optimization
  const handleConsent = async (consent) => {
    setShowConsentModal(false);
    logInfo(`User consent: ${consent}`);
    
    try {
      // Send consent to brain server
      const response = await axios.post(`${BRAIN_SERVER_URL}/consent`, {
        clientId: brainClient.getClientId(),
        consent
      });

      // If accepted, switch to suggested tier
      if ((consent === 'accept' || consent === 'always-optimize') && response.data.newTier) {
        const newTier = response.data.newTier;
        const oldTier = currentTierRef.current;
        
        // Only switch if tier actually changed
        if (newTier !== oldTier) {
          logTierChange(oldTier, newTier, `Battery optimization accepted by user`);
          
          // Update ref immediately
          currentTierRef.current = newTier;
          
          // Batch all state updates (React 18 auto-batches in async handlers too)
          setPreviousTier(oldTier);
          setTierHistory(prev => [...prev.slice(-4), newTier]);
          setCurrentTier(newTier);
        }
      }
      
      setPendingDecision(null);
    } catch (error) {
      console.error('Error sending consent:', error);
      logWarning('Failed to send consent to server');
      setPendingDecision(null);
    }
  };

  // Get tier display info
  const getTierInfo = (tier) => {
    const info = {
      'A': { name: 'Abundance Mode', color: '#8b5cf6', desc: 'Heavy 3D animations, full features', bundle: '500KB' },
      'B': { name: 'Constraint Mode', color: '#a855f7', desc: '2D animations, optimized', bundle: '250KB' },
      'C': { name: 'Minimal Mode', color: '#c084fc', desc: 'Essential only, fast loading', bundle: '100KB' },
      'D': { name: 'Survival Mode', color: '#dc2626', desc: 'Plain HTML, offline ready', bundle: '30KB' }
    };
    return info[tier] || info['A'];
  };

  const tierInfo = getTierInfo(currentTier);

  // Show loading state while waiting for initial tier decision
  if (isInitializing) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            🧠
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
            Protean Interface Protocol
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            Analyzing your environment...
          </p>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <TierProvider tier={currentTier} previousTier={previousTier} tierHistory={tierHistory}>
          {/* Track route changes for tier memory */}
          <RouteTracker currentRouteRef={currentRouteRef} tierMemory={tierMemory} />
          
          {/* Navigation Bar */}
          <Navbar />
          
          {/* Offline Status Indicator */}
          <OfflineIndicator isOnline={metrics.online} currentTier={currentTier} />
          
          {/* Transition Toast - Non-intrusive tier change notification */}
          {showTransitionToast && toastProposedTier && (
            <TransitionToast
              proposedTier={toastProposedTier.tier}
              currentTier={currentTier}
              reason={toastProposedTier.reason}
              onAccept={handleToastAccept}
              onReject={handleToastReject}
              onPreview={() => {
                // TODO: Implement preview mode
                logInfo('Preview mode requested');
              }}
              countdownSeconds={10}
            />
          )}
          
          <TierTransition 
            tierKey={currentTier} 
            onTransitionComplete={restoreFocusAndScroll}
          >
            <div style={{ 
              minHeight: '100vh', 
              backgroundColor: '#ffffff',
              position: 'relative'
            }}>
          {/* Main Routes */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected Routes - Requires Login */}
            <Route path="/properties" element={
              <ProtectedRoute>
                <PropertiesPage />
              </ProtectedRoute>
            } />
            <Route path="/property/:id" element={
              <ProtectedRoute>
                <PropertyDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/book-visit/:id" element={
              <ProtectedRoute>
                <BookVisitPage />
              </ProtectedRoute>
            } />
            <Route path="/contact-agent/:id?" element={
              <ProtectedRoute>
                <ContactAgentPage />
              </ProtectedRoute>
            } />
            <Route path="/payment-request/:id" element={
              <ProtectedRoute>
                <PaymentRequestPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            {/* Legacy Protean Form Demo (keep for testing) */}
            <Route path="/demo" element={
              <ProteanRenderer
                tier={currentTier}
                intent={activeIntent}
                metrics={metrics}
                previousTier={previousTier}
              />
            } />
          </Routes>

          {/* User Consent Modal for Battery Optimization */}
          {showConsentModal && pendingDecision && (
            <ConsentModal
              decision={pendingDecision}
              onConsent={handleConsent}
            />
          )}
        </div>
        </TierTransition>
      </TierProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
