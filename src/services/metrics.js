class MetricsService {
  constructor() {
    this.metrics = {
      activeConnections: 0,
      totalConnections: 0,
      activeStreams: 0,
      totalStreams: 0,
      errors: 0,
      streamStats: new Map()
    };
  }

  incrementConnections() {
    this.metrics.activeConnections++;
    this.metrics.totalConnections++;
  }

  decrementConnections() {
    this.metrics.activeConnections--;
  }

  incrementStreams() {
    this.metrics.activeStreams++;
    this.metrics.totalStreams++;
  }

  decrementStreams() {
    this.metrics.activeStreams--;
  }

  incrementErrors() {
    this.metrics.errors++;
  }

  updateStreamStats(streamId, stats) {
    this.metrics.streamStats.set(streamId, {
      ...stats,
      timestamp: new Date().toISOString()
    });
  }

  getMetrics() {
    return {
      ...this.metrics,
      streamStats: Object.fromEntries(this.metrics.streamStats),
      timestamp: new Date().toISOString()
    };
  }
}

export const metrics = new MetricsService();