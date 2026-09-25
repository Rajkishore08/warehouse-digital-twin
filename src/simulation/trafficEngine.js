// Traffic & Congestion Monitoring Engine
import { WAREHOUSE_CONFIG } from '../data/warehouseConfig';

export class TrafficEngine {
  constructor() {
    this.aisleTraffic = new Map();
    this.initAisles();
  }

  initAisles() {
    WAREHOUSE_CONFIG.aisles.forEach(aisle => {
      this.aisleTraffic.set(aisle.id, {
        id: aisle.id,
        name: aisle.name,
        x: aisle.x,
        zMin: aisle.zMin,
        zMax: aisle.zMax,
        capacity: aisle.capacity,
        robotCount: 0,
        robots: [],
        averageSpeed: 1.4,
        queueLength: 0,
        trafficDensity: 0.0,
        status: 'normal', // normal, moderate, high, congested, blocked
        isBlocked: false
      });
    });
  }

  update(robots, blockedAisleIds = new Set()) {
    // Reset counters
    this.aisleTraffic.forEach((data, id) => {
      data.robotCount = 0;
      data.robots = [];
      data.averageSpeed = 1.4;
      data.queueLength = 0;
      data.trafficDensity = 0.0;
      data.isBlocked = blockedAisleIds.has(id);
      if (data.isBlocked) {
        data.status = 'blocked';
      } else {
        data.status = 'normal';
      }
    });

    // Determine robot positions relative to aisles
    robots.forEach(robot => {
      if (robot.status === 'charging' || robot.status === 'stopped') return;

      const rx = robot.x;
      const rz = robot.z;

      for (const [aisleId, data] of this.aisleTraffic.entries()) {
        const xDist = Math.abs(rx - data.x);
        const inZ = rz >= data.zMin - 2.5 && rz <= data.zMax + 2.5;

        // Robot is physically inside or entering this aisle
        if (xDist < 2.2 && inZ) {
          data.robotCount++;
          data.robots.push(robot.id);
          break;
        }
      }
    });

    // Calculate metrics and congestion status
    const congestionZones = [];

    this.aisleTraffic.forEach((data, aisleId) => {
      if (data.isBlocked) {
        data.trafficDensity = 1.0;
        data.status = 'blocked';
        return;
      }

      // Density relative to capacity (4 robots)
      data.trafficDensity = Math.min(1.0, data.robotCount / data.capacity);

      if (data.robotCount >= 3 || data.trafficDensity >= 0.75) {
        data.status = 'congested';
        data.averageSpeed = Math.max(0.2, 1.4 * (1 - data.trafficDensity * 0.8));
        data.queueLength = Math.max(0, data.robotCount - 1);
        congestionZones.push({
          aisleId: data.id,
          name: data.name,
          robotCount: data.robotCount,
          density: data.trafficDensity,
          averageSpeed: data.averageSpeed,
          queueLength: data.queueLength
        });
      } else if (data.robotCount === 2 || data.trafficDensity >= 0.5) {
        data.status = 'moderate';
        data.averageSpeed = 1.0;
        data.queueLength = 1;
      } else if (data.robotCount === 1) {
        data.status = 'normal';
        data.averageSpeed = 1.3;
      } else {
        data.status = 'normal';
        data.averageSpeed = 1.5;
      }
    });

    return {
      aisleMetrics: Array.from(this.aisleTraffic.values()),
      congestionZones,
      totalCongestedAisles: congestionZones.length
    };
  }

  getAisleData(aisleId) {
    return this.aisleTraffic.get(aisleId);
  }
}

export const trafficEngineInstance = new TrafficEngine();
