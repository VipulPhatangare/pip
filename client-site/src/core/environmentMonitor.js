// Core Environment Monitoring System
// Detects battery, network, CPU, FPS, memory, and bandwidth

export class EnvironmentMonitor {
  constructor() {
    this.metrics = {
      battery: 100,
      batteryCharging: true,
      networkType: '4g',
      networkDownlink: 10,
      bandwidth: 1000, // KB/s
      cpuCores: 4,
      cpuScore: 100,
      fps: null, // Don't assume FPS until measured
      memory: 4096, // MB
      memoryUsed: 1024,
      online: true
    };
    
    this.listeners = new Set();
    this.isMonitoring = false;
    this.fpsFrames = [];
    this.lastFpsCheck = Date.now();
    this.fpsInitialized = false;
    this.isPageVisible = !document.hidden;
    this.lastValidFps = 60; // Store last good FPS value
  }

  // Battery API
  async initBatteryMonitoring() {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        this.updateMetric('battery', Math.round(battery.level * 100));
        this.updateMetric('batteryCharging', battery.charging);

        battery.addEventListener('levelchange', () => {
          this.updateMetric('battery', Math.round(battery.level * 100));
        });

        battery.addEventListener('chargingchange', () => {
          this.updateMetric('batteryCharging', battery.charging);
        });
      } catch (error) {
        console.warn('Battery API not available:', error);
      }
    }
  }

  // Network Information API
  initNetworkMonitoring() {
    if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      const updateNetwork = () => {
        this.updateMetric('networkType', connection.effectiveType || '4g');
        this.updateMetric('networkDownlink', connection.downlink || 10);
      };

      updateNetwork();
      connection.addEventListener('change', updateNetwork);
    }

    // Online/Offline detection
    window.addEventListener('online', () => this.updateMetric('online', true));
    window.addEventListener('offline', () => this.updateMetric('online', false));
    this.updateMetric('online', navigator.onLine);
  }

  // CPU Capability Estimation
  async initCPUMonitoring() {
    const cores = navigator.hardwareConcurrency || 4;
    this.updateMetric('cpuCores', cores);

    // CPU benchmark - measure how fast we can execute operations
    const benchmark = () => {
      const start = performance.now();
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(i);
      }
      const duration = performance.now() - start;
      
      // Score: lower duration = better CPU (normalize to 0-100)
      const score = Math.max(0, Math.min(100, 100 - (duration / 10)));
      this.updateMetric('cpuScore', Math.round(score));
    };

    benchmark();
    setInterval(benchmark, 30000); // Re-benchmark every 30 seconds
  }

  // FPS Monitoring using requestAnimationFrame
  initFPSMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = (currentTime) => {
      frameCount++;
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Only update FPS if page is visible
        // When hidden, browsers throttle requestAnimationFrame causing false 0 FPS readings
        if (this.isPageVisible && fps > 0) {
          // Set FPS on first valid measurement
          if (!this.fpsInitialized) {
            console.log(`📊 FPS Initial Measurement: ${fps} FPS (frames: ${frameCount})`);
            this.fpsInitialized = true;
            this.lastValidFps = Math.max(fps, 30); // Ensure minimum 30 FPS on first reading
            this.updateMetric('fps', this.lastValidFps);
          } else {
            console.log(`📊 FPS Update: ${fps} FPS (frames: ${frameCount})`);
            this.lastValidFps = fps;
            this.updateMetric('fps', fps);
          }
        } else if (!this.isPageVisible) {
          // Page is hidden - preserve last valid FPS instead of reporting 0
          console.log(`📊 FPS Preserved: ${this.lastValidFps} FPS (page hidden)`);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }

      if (this.isMonitoring) {
        requestAnimationFrame(measureFPS);
      }
    };

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
      if (this.isPageVisible) {
        console.log('👁️ Page visible - resuming FPS monitoring');
        // Reset timing on visibility change to get accurate measurement
        frameCount = 0;
        lastTime = performance.now();
      } else {
        console.log(`👁️ Page hidden - preserving last FPS: ${this.lastValidFps}`);
      }
    });

    console.log('📊 FPS Monitoring initialized (measuring in 1 second...)');
    requestAnimationFrame(measureFPS);
  }

  // Memory Monitoring
  initMemoryMonitoring() {
    const updateMemory = () => {
      if (performance.memory) {
        const usedMB = Math.round(performance.memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(performance.memory.jsHeapSizeLimit / 1048576);
        this.updateMetric('memory', totalMB);
        this.updateMetric('memoryUsed', usedMB);
      } else {
        // Fallback estimation
        this.updateMetric('memory', 4096);
        this.updateMetric('memoryUsed', 1024);
      }
    };

    updateMemory();
    setInterval(updateMemory, 5000);
  }

  // Bandwidth Measurement using fetch timing
  async measureBandwidth() {
    try {
      // Fetch a small test resource (1x1 pixel image as data URL for offline support)
      const testData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const startTime = performance.now();
      
      await fetch(testData);
      
      const duration = performance.now() - startTime;
      const sizeKB = 0.1; // Approximate size
      const bandwidthKBps = (sizeKB / duration) * 1000;
      
      this.updateMetric('bandwidth', Math.round(bandwidthKBps * 100) / 100);
    } catch (error) {
      console.warn('Bandwidth measurement failed:', error);
      this.updateMetric('bandwidth', 500); // Default fallback
    }
  }

  // Start monitoring all metrics
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    this.initBatteryMonitoring();
    this.initNetworkMonitoring();
    this.initCPUMonitoring();
    this.initFPSMonitoring();
    this.initMemoryMonitoring();
    
    // Measure bandwidth periodically
    this.measureBandwidth();
    setInterval(() => this.measureBandwidth(), 30000);
  }

  // Stop monitoring
  stopMonitoring() {
    this.isMonitoring = false;
  }

  // Update a metric and notify listeners
  updateMetric(key, value) {
    if (this.metrics[key] !== value) {
      this.metrics[key] = value;
      this.notifyListeners();
    }
  }

  // Subscribe to metric changes
  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.metrics); // Immediately call with current metrics
    
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.metrics));
  }

  // Get current metrics snapshot
  getMetrics() {
    return { ...this.metrics };
  }

  // Force update all metrics
  forceUpdate() {
    this.notifyListeners();
  }
}

// Singleton instance
export const environmentMonitor = new EnvironmentMonitor();
