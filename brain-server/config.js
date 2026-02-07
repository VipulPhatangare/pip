// Tier Thresholds and Constants
export const TIERS = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D'
};

export const TIER_INFO = {
  [TIERS.A]: {
    name: 'Abundance Mode',
    bundleSize: 500,
    description: 'Full-featured rich UI with animations',
    constraints: {
      disableAnimations: false,
      minimalRendering: false,
      offlineMode: false
    }
  },
  [TIERS.B]: {
    name: 'Constraint Mode',
    bundleSize: 250,
    description: 'Optimized lightweight UI',
    constraints: {
      disableAnimations: false,
      minimalRendering: false,
      offlineMode: false
    }
  },
  [TIERS.C]: {
    name: 'Minimal Mode',
    bundleSize: 100,
    description: 'Core functionality only',
    constraints: {
      disableAnimations: true,
      minimalRendering: true,
      offlineMode: false
    }
  },
  [TIERS.D]: {
    name: 'Survival Mode',
    bundleSize: 30,
    description: 'Plain HTML fallback',
    constraints: {
      disableAnimations: true,
      minimalRendering: true,
      offlineMode: true
    }
  }
};

// Tier Decision Thresholds
export const THRESHOLDS = {
  // Tier A: Optimal conditions
  A: {
    battery: 50,
    networkTypes: ['4g', '5g'],
    fps: 45,
    cpuScore: 60,
    memoryUsagePercent: 75,
    online: true
  },
  
  // Tier B: Moderate constraints
  B: {
    battery: 25,
    fps: 30,
    cpuScore: 40,
    memoryUsagePercent: 85,
    online: true
  },
  
  // Tier C: Severe constraints
  C: {
    battery: 10,
    fps: 15,
    cpuScore: 20,
    memoryUsagePercent: 95,
    online: true
  }
};

export const DECISION_WEIGHTS = {
  battery: 0.25,
  network: 0.20,
  cpu: 0.20,
  fps: 0.15,
  memory: 0.15,
  online: 0.05
};
