// User Consent Modal Component
import React from 'react';
import { Battery, ZapOff, Clock, AlertTriangle } from 'lucide-react';

const ConsentModal = ({ decision, onConsent }) => {
  const { suggestedTier, consumption } = decision;
  
  const tierNames = {
    B: 'Optimized Mode',
    C: 'Minimal Mode',
    D: 'Survival Mode'
  };

  const tierColors = {
    B: 'from-purple-600 to-purple-500',
    C: 'from-pink-600 to-pink-500',
    D: 'from-red-600 to-red-500'
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 
                    flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 
                      rounded-2xl p-6 max-w-md w-full border-2 border-yellow-500 
                      shadow-2xl shadow-yellow-500/20 animate-scale-in">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full 
                          flex items-center justify-center animate-pulse">
            <Battery className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Battery Optimization Available
        </h2>
        
        {/* Message */}
        <p className="text-gray-300 text-center mb-6 text-sm leading-relaxed">
          Your battery is draining at{' '}
          <span className="text-yellow-400 font-bold">
            {consumption.rate.toFixed(1)}% per minute
          </span>
          . {consumption.minutesRemaining && (
            <>
              At this rate, you have approximately{' '}
              <span className="text-yellow-400 font-bold">
                {Math.floor(consumption.minutesRemaining)} minutes
              </span>
              {' '}remaining.
            </>
          )}
        </p>
        
        {/* Info Box */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 space-y-3 border border-gray-700">
          <div className="flex items-start gap-3">
            <ZapOff className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-300">
                Switching to <strong className="text-white">
                  {tierNames[suggestedTier]}
                </strong> can significantly extend your battery life
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-300">
                All your data and form entries will be preserved during the switch
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-300">
                The interface will become simpler but remain fully functional
              </p>
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onConsent('accept')}
            className={`w-full py-3 bg-gradient-to-r ${tierColors[suggestedTier]} 
                       text-white font-bold rounded-lg hover:opacity-90 
                       transition-all duration-200 transform hover:scale-[1.02] 
                       active:scale-95 shadow-lg`}
          >
            Switch to {tierNames[suggestedTier]}
          </button>
          
          <button
            onClick={() => onConsent('deny')}
            className="w-full py-3 bg-gray-700 text-white font-semibold 
                       rounded-lg hover:bg-gray-600 transition-all duration-200
                       transform hover:scale-[1.02] active:scale-95"
          >
            Keep Current Mode
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => onConsent('always-optimize')}
              className="flex-1 py-2 bg-gray-800 text-gray-300 text-xs 
                         rounded hover:bg-gray-700 transition-all duration-200
                         border border-gray-600 hover:border-gray-500"
            >
              Always Optimize
            </button>
            <button
              onClick={() => onConsent('never-optimize')}
              className="flex-1 py-2 bg-gray-800 text-gray-300 text-xs 
                         rounded hover:bg-gray-700 transition-all duration-200
                         border border-gray-600 hover:border-gray-500"
            >
              Never Ask Again
            </button>
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-gray-500 text-xs mt-4">
          You can always change this preference from the dashboard
        </p>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConsentModal;
