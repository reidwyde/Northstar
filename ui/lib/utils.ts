import {
  DependencyRanks,
  Waypoint,
  ConstellationLayout,
  WaypointPosition,
  WaypointLink,
} from '../lib/types';

/**
 * Calculate dependency ranks for waypoints based on unblocks relationships
 * A waypoint's rank is the maximum rank of its dependencies + 1
 * 
 * @param waypoints - Array of waypoints for a specific quest
 * @returns Map of waypoint ID to its calculated rank
 */
export const getWaypointDependencyRanks = (waypoints: Waypoint[]): DependencyRanks => {
  const ranks: { [waypointId: string]: number } = {};
  
  // Helper function to calculate rank recursively with memoization
  const calculateRank = (waypointId: string): number => {
    if (ranks[waypointId] !== undefined) {
      return ranks[waypointId];
    }
    
    // Find all waypoints that this waypoint depends on (waypoints that unblock this one)
    const dependencies = waypoints.filter(w => w.unblocks.includes(waypointId));
    
    if (dependencies.length === 0) {
      // No dependencies, rank 0
      ranks[waypointId] = 0;
    } else {
      // Rank is max rank of dependencies + 1
      const maxDependencyRank = Math.max(...dependencies.map(dep => calculateRank(dep.id)));
      ranks[waypointId] = maxDependencyRank + 1;
    }
    
    return ranks[waypointId];
  };
  
  // Calculate ranks for all waypoints
  waypoints.forEach(waypoint => {
    calculateRank(waypoint.id);
  });
  
  return ranks;
};

/**
 * Calculate column positions for waypoints within their rank groups
 * 
 * @param waypoints - Array of waypoints for a specific quest
 * @param ranks - Pre-calculated rank map from getWaypointDependencyRanks
 * @returns Map of waypoint ID to its column position within its rank
 */
export const getWaypointColumns = (
  waypoints: Waypoint[],
  ranks: DependencyRanks,
): { [waypointId: string]: number } => {
  const columns: { [waypointId: string]: number } = {};
  
  // Group waypoints by rank
  const rankGroups: { [rank: number]: string[] } = {};
  Object.entries(ranks).forEach(([waypointId, rank]) => {
    if (!rankGroups[rank]) {
      rankGroups[rank] = [];
    }
    rankGroups[rank].push(waypointId);
  });
  
  // Assign columns within each rank
  Object.entries(rankGroups).forEach(([rank, waypointIds]) => {
    waypointIds.forEach((waypointId, index) => {
      columns[waypointId] = index;
    });
  });
  
  return columns;
};

/**
 * Simple rank and column layout algorithm for waypoints
 * Uses waypoint.unblocks to determine dependencies and calculate positions
 * 
 * @param waypoints - Array of waypoints for a specific quest
 * @returns Complete layout with positions and links for constellation rendering
 */
export const simpleRankAndCol = (waypoints: Waypoint[]): ConstellationLayout => {
  const ranks = getWaypointDependencyRanks(waypoints);
  const columns = getWaypointColumns(waypoints, ranks);
  
  // Calculate screen positions
  const HORIZONTAL_SPACING = 150;
  const VERTICAL_SPACING = 120;
  const OFFSET_X = 100;
  const OFFSET_Y = 100;
  
  const positions: { [waypointId: string]: WaypointPosition } = {};
  
  waypoints.forEach(waypoint => {
    const rank = ranks[waypoint.id] || 0;
    const column = columns[waypoint.id] || 0;
    const x = column * HORIZONTAL_SPACING + OFFSET_X;
    const y = rank * VERTICAL_SPACING + OFFSET_Y;
    
    positions[waypoint.id] = {
      waypointId: waypoint.id,
      x,
      y,
      rank,
      column,
    };
  });
  
  // Calculate links based on waypoint.unblocks relationships
  const links: WaypointLink[] = [];
  
  waypoints.forEach(waypoint => {
    waypoint.unblocks.forEach(unblockedWaypointId => {
      const sourcePos = positions[waypoint.id];
      const targetPos = positions[unblockedWaypointId];
      
      if (sourcePos && targetPos) {
        links.push({
          sourceId: waypoint.id,
          targetId: unblockedWaypointId,
          x1: sourcePos.x,
          y1: sourcePos.y,
          x2: targetPos.x,
          y2: targetPos.y,
        });
      }
    });
  });
  
  return {
    positions,
    links,
  };
};