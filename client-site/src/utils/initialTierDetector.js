// Initial Tier Detector - Fast synchronous tier decision BEFORE server connection
// This prevents the flash of wrong tier on page load

/**
 * Quickly detect the best initial tier based on immediately available browser APIs
 * This runs synchronously BEFORE rendering to avoid Tier D -> Tier A flash
 * Strategy: Start optimistic (prefer higher tiers) unless we detect problems
 * @returns {string} Initial tier ('A', 'B', 'C', or 'D')
 */
export function detectInitialTier() {
  const metrics = {
    online: navigator.onLine,
    memoryAvailable: false,
    memoryGB: 0,
    cores: navigator.hardwareConcurrency || 2,
    connectionType: 'unknown'
  };

  // Check memory if available
  if (performance.memory) {
    const totalGB = performance.memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
    metrics.memoryAvailable = true;
    metrics.memoryGB = totalGB;
  }

  // Check connection type
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    metrics.connectionType = connection.effectiveType || 'unknown';
  }

  // Decision Logic: Start optimistic, only downgrade if we detect real problems
  
  // TIER A: Modern device with good specs (DEFAULT for modern browsers)
  // - Good memory (>2GB heap limit)
  // - Multi-core processor (4+ cores)
  // - Good connection (4g or unknown - we assume good if we can't detect)
  if (
    metrics.online &&
    (metrics.memoryGB > 2 || !metrics.memoryAvailable) && // Assume good if we can't detect
    metrics.cores >= 4 &&
    (metrics.connectionType === '4g' || 
     metrics.connectionType === 'unknown' || 
     metrics.connectionType === 'wifi')
  ) {
    console.log('🚀 Initial Tier Decision: A (Excellent configuration detected)');
    return 'A';
  }

  // TIER B: Moderate device or slower connection
  // - Decent memory (>1GB) OR can't detect
  // - 2+ cores
  // - Any connection type (3g, slow-2g, etc.)
  if (
    metrics.online &&
    (metrics.memoryGB > 1 || !metrics.memoryAvailable) &&
    metrics.cores >= 2
  ) {
    console.log('⚡ Initial Tier Decision: B (Good configuration detected)');
    return 'B';
  }

  // TIER C: Low-end device but still online
  // - Limited memory OR single core
  // - But still connected
  if (metrics.online) {
    console.log('💡 Initial Tier Decision: C (Basic configuration detected)');
    return 'C';
  }

  // TIER D: Offline or severe constraints
  console.log('🔋 Initial Tier Decision: D (Offline or emergency mode)');
  return 'D';
}

/**
 * Get a user-friendly description of why this tier was chosen
 * @param {string} tier - The tier ('A', 'B', 'C', 'D')
 * @returns {string} Description
 */
export function getInitialTierReason(tier) {
  const reasons = {
    'A': 'Excellent device with modern capabilities',
    'B': 'Good device with solid performance',
    'C': 'Basic device - optimized for efficiency',
    'D': 'Offline mode - essential features only'
  };
  return reasons[tier] || 'Unknown';
}

/**
 * Check if we should wait for server decision or trust local detection
 * Use this to decide whether to show a loading state
 * @returns {boolean} True if local detection is reliable
 */
export function isLocalDetectionReliable() {
  // If we can detect memory and cores, we're confident in our decision
  const hasMemoryAPI = !!performance.memory;
  const hasCoresAPI = !!navigator.hardwareConcurrency;
  const hasConnectionAPI = !!(navigator.connection || navigator.mozConnection || navigator.webkitConnection);
  
  return hasMemoryAPI && hasCoresAPI;
}
