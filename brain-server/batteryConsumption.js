// Battery Consumption Tracker - Monitors battery drain rate

export class BatteryConsumptionTracker {
  constructor() {
    this.clientHistory = new Map(); // clientId -> battery reading history
  }

  /**
   * Add a battery reading for a client
   */
  addReading(clientId, battery, charging, timestamp) {
    if (!this.clientHistory.has(clientId)) {
      this.clientHistory.set(clientId, []);
    }

    const history = this.clientHistory.get(clientId);
    history.push({ battery, charging, timestamp });

    // Keep only last 10 readings (covers ~50 seconds of data at 5s intervals)
    if (history.length > 10) {
      history.shift();
    }
  }

  /**
   * Calculate battery consumption rate and analyze trend
   */
  getConsumptionRate(clientId) {
    const history = this.clientHistory.get(clientId);

    if (!history || history.length < 2) {
      return {
        rate: 0,
        trend: 'unknown',
        critical: false,
        minutesRemaining: null,
        isCharging: false
      };
    }

    const latest = history[history.length - 1];

    // If charging, battery is not a concern
    if (latest.charging) {
      return {
        rate: 0,
        trend: 'charging',
        critical: false,
        minutesRemaining: null,
        isCharging: true
      };
    }

    // Calculate drain rate over available history
    const first = history[0];
    const last = history[history.length - 1];
    const timeDiffMinutes = (last.timestamp - first.timestamp) / 60000; // Convert to minutes
    const batteryDiff = first.battery - last.battery; // Positive = draining
    
    if (timeDiffMinutes === 0) {
      return {
        rate: 0,
        trend: 'stable',
        critical: false,
        minutesRemaining: null,
        isCharging: last.charging // Use actual charging state from most recent reading
      };
    }

    const rate = batteryDiff / timeDiffMinutes; // % per minute

    // Determine trend
    let trend = 'stable';
    if (rate > 0.5) {
      trend = 'high'; // >0.5%/min = 30%/hour - very concerning
    } else if (rate > 0.3) {
      trend = 'moderate'; // >0.3%/min = 18%/hour - concerning
    } else if (rate > 0.1) {
      trend = 'normal'; // >0.1%/min = 6%/hour - normal usage
    } else if (rate < 0) {
      trend = 'stable'; // Battery level increasing somehow
    }

    // Calculate estimated time remaining
    let minutesRemaining = null;
    if (rate > 0) {
      minutesRemaining = Math.floor(last.battery / rate);
    }

    // Determine if situation is critical
    const critical = (minutesRemaining !== null && minutesRemaining < 30) || last.battery < 5;

    return {
      rate: parseFloat(rate.toFixed(3)),
      trend,
      critical,
      minutesRemaining,
      isCharging: false,
      currentBattery: last.battery
    };
  }

  /**
   * Clear history for a client (on disconnect)
   */
  clearClient(clientId) {
    this.clientHistory.delete(clientId);
  }

  /**
   * Get all clients with their consumption data
   */
  getAllConsumption() {
    const result = {};
    for (const [clientId, history] of this.clientHistory.entries()) {
      if (history.length > 0) {
        result[clientId] = this.getConsumptionRate(clientId);
      }
    }
    return result;
  }
}
