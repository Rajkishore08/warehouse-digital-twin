// Predictive Congestion & Traffic Forecasting Engine (Simulated Predictive Analytics)
import { WAREHOUSE_CONFIG } from '../data/warehouseConfig';

export class PredictiveEngine {
  /**
   * Forecasts upcoming traffic bottlenecks 30-60 seconds ahead
   * @param {Array} robots 
   * @param {Array} aisleMetrics 
   * @returns {Array} List of predicted bottlenecks
   */
  forecastBottlenecks(robots, aisleMetrics) {
    const predictions = [];
    const upcomingAisleLoad = new Map();

    WAREHOUSE_CONFIG.aisles.forEach(a => {
      upcomingAisleLoad.set(a.id, {
        id: a.id,
        name: a.name,
        x: a.x,
        currentCount: 0,
        incomingIn30s: 0,
        incomingRobots: [],
        predictedDensity: 0.0,
        riskLevel: 'LOW'
      });
    });

    // Analyze next 2-4 waypoints for every moving robot
    robots.forEach(robot => {
      if (robot.status === 'charging' || robot.status === 'stopped') return;

      const path = robot.path || [];
      const currentIdx = robot.currentWaypointIndex || 0;
      const upcomingNodes = path.slice(currentIdx, currentIdx + 4);

      // Check which aisles the robot is headed towards
      const visitedAisles = new Set();
      upcomingNodes.forEach(node => {
        if (node.aisleId && upcomingAisleLoad.has(node.aisleId) && !visitedAisles.has(node.aisleId)) {
          visitedAisles.add(node.aisleId);
          const data = upcomingAisleLoad.get(node.aisleId);
          data.incomingIn30s++;
          data.incomingRobots.push(robot.id);
        }
      });
    });

    // Compute predictive risk scores
    upcomingAisleLoad.forEach(data => {
      const metric = aisleMetrics.find(m => m.id === data.id);
      data.currentCount = metric ? metric.robotCount : 0;
      
      const totalAnticipated = data.currentCount + data.incomingIn30s;
      data.predictedDensity = Math.min(1.0, totalAnticipated / 4.0);

      if (totalAnticipated >= 3 && data.currentCount < 3) {
        data.riskLevel = 'HIGH_PREDICTED';
        predictions.push({
          aisleId: data.id,
          name: data.name,
          x: data.x,
          predictedTimeSec: 30,
          confidence: '88%',
          severity: 'HIGH',
          reason: `${data.incomingIn30s} robots converging on ${data.name} in next 30s.`,
          incomingRobots: data.incomingRobots,
          recommendedAction: 'PROACTIVE_REROUTE'
        });
      } else if (totalAnticipated === 2) {
        data.riskLevel = 'MODERATE_PREDICTED';
      }
    });

    return predictions;
  }
}

export const predictiveEngineInstance = new PredictiveEngine();
