import {
  DependencyRanks,
  Waypoint,
  ConstellationLayout,
  WaypointPosition,
  WaypointLink,
} from './types';

export interface LayoutDimensions {
  screenWidth: number;
  screenHeight: number;
  padding?: number;
}

/**
 * Calculate dependency ranks for waypoints based on unblocks relationships
 * A waypoint's rank is the maximum rank of its dependencies + 1
 * 
 * @param waypoints - Array of waypoints for a specific quest
 * @returns Map of waypoint ID to its calculated rank
 */
export const calculateWaypointRanks = (waypoints: Waypoint[]): DependencyRanks => {
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
 * Calculate smart column positions for waypoints within their rank groups
 * Uses algorithm that prefers vertical alignment for direct dependencies
 * 
 * @param waypoints - Array of waypoints for a specific quest
 * @param ranks - Pre-calculated rank map from calculateWaypointRanks
 * @returns Map of waypoint ID to its column position within its rank
 */
export const calculateWaypointColumns = (
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
  
  // Get sorted ranks (lowest to highest)
  const sortedRanks = Object.keys(rankGroups)
    .map(r => parseInt(r))
    .sort((a, b) => a - b);
  
  // Start with rank 0 - assign columns by simple index
  if (sortedRanks.length > 0) {
    const rank0Waypoints = rankGroups[sortedRanks[0]];
    rank0Waypoints.forEach((waypointId, index) => {
      columns[waypointId] = index;
    });
  }
  
  // For each subsequent rank, try to align waypoints with their dependencies
  for (let i = 1; i < sortedRanks.length; i++) {
    const currentRank = sortedRanks[i];
    const currentWaypoints = rankGroups[currentRank];
    const usedColumns = new Set<number>();
    
    // First pass: try to align waypoints with single dependencies
    currentWaypoints.forEach(waypointId => {
      const waypoint = waypoints.find(w => w.id === waypointId);
      if (!waypoint) return;
      
      // Find dependencies (waypoints that unblock this one)
      const dependencies = waypoints.filter(w => w.unblocks.includes(waypointId));
      
      // If this waypoint has exactly one dependency, try to align it
      if (dependencies.length === 1) {
        const depColumn = columns[dependencies[0].id];
        if (depColumn !== undefined && !usedColumns.has(depColumn)) {
          columns[waypointId] = depColumn;
          usedColumns.add(depColumn);
        }
      }
    });
    
    // Second pass: assign remaining waypoints to unused columns
    let nextAvailableColumn = 0;
    currentWaypoints.forEach(waypointId => {
      if (columns[waypointId] === undefined) {
        // Find next available column
        while (usedColumns.has(nextAvailableColumn)) {
          nextAvailableColumn++;
        }
        columns[waypointId] = nextAvailableColumn;
        usedColumns.add(nextAvailableColumn);
        nextAvailableColumn++;
      }
    });
  }
  
  return columns;
};

/**
 * Calculate optimal spacing based on screen dimensions and number of waypoints
 * 
 * @param dimensions - Screen dimensions and padding
 * @param maxColumns - Maximum number of columns needed
 * @param maxRanks - Maximum number of ranks needed
 * @returns Optimal horizontal and vertical spacing
 */
export const calculateOptimalSpacing = (
  dimensions: LayoutDimensions,
  maxColumns: number,
  maxRanks: number,
): { horizontalSpacing: number; verticalSpacing: number; offsetX: number; offsetY: number } => {
  const padding = dimensions.padding || 50;
  const circleRadius = 20;
  const minSpacing = circleRadius * 3; // Minimum spacing between waypoint centers
  
  // Calculate available space
  const availableWidth = dimensions.screenWidth - (padding * 2);
  const availableHeight = dimensions.screenHeight - (padding * 2);
  
  // Calculate spacing that fits within screen
  const idealHorizontalSpacing = maxColumns > 1 ? availableWidth / (maxColumns - 1) : availableWidth / 2;
  const idealVerticalSpacing = maxRanks > 1 ? availableHeight / (maxRanks - 1) : availableHeight / 2;
  
  // Ensure minimum spacing for readability
  const horizontalSpacing = Math.max(idealHorizontalSpacing, minSpacing);
  const verticalSpacing = Math.max(idealVerticalSpacing, minSpacing);
  
  // Center horizontally, but anchor to bottom for rank 0
  const totalWidth = (maxColumns - 1) * horizontalSpacing;
  const totalHeight = (maxRanks - 1) * verticalSpacing;
  
  const offsetX = padding + (availableWidth - totalWidth) / 2;
  // For Y, start from bottom with padding (rank 0 should be near bottom)
  const offsetY = availableHeight - totalHeight - padding;
  
  return {
    horizontalSpacing,
    verticalSpacing,
    offsetX: Math.max(offsetX, padding),
    offsetY: Math.max(offsetY, padding),
  };
};

/**
 * Screen-aware constellation layout algorithm for waypoints
 * Uses waypoint.unblocks to determine dependencies and calculates positions
 * that fit within the provided screen dimensions
 * 
 * @param waypoints - Array of waypoints for a specific quest
 * @param dimensions - Screen dimensions for responsive layout
 * @returns Complete layout with positions and links for constellation rendering
 */
export const calculateConstellationLayout = (
  waypoints: Waypoint[],
  dimensions: LayoutDimensions,
): ConstellationLayout => {
  if (waypoints.length === 0) {
    return { positions: {}, links: [] };
  }
  
  const ranks = calculateWaypointRanks(waypoints);
  const columns = calculateWaypointColumns(waypoints, ranks);
  
  // Find layout bounds
  const maxRank = Math.max(...Object.values(ranks));
  const maxColumn = Math.max(...Object.values(columns));
  const numRanks = maxRank + 1;
  const numColumns = maxColumn + 1;
  
  // Calculate optimal spacing for screen
  const spacing = calculateOptimalSpacing(dimensions, numColumns, numRanks);
  
  const positions: { [waypointId: string]: WaypointPosition } = {};
  
  waypoints.forEach(waypoint => {
    const rank = ranks[waypoint.id] || 0;
    const column = columns[waypoint.id] || 0;
    
    // Calculate screen positions with responsive spacing
    const x = column * spacing.horizontalSpacing + spacing.offsetX;
    // Flip Y-axis: higher ranks appear at top, rank 0 at bottom
    const y = (maxRank - rank) * spacing.verticalSpacing + spacing.offsetY;
    
    positions[waypoint.id] = {
      waypointId: waypoint.id,
      x,
      y,
      rank,
      column,
    };
  });
  
  // Calculate links with edge-to-edge positioning
  const links: WaypointLink[] = [];
  const CIRCLE_RADIUS = 20; // Should match circle radius in ConstellationView
  
  waypoints.forEach(waypoint => {
    waypoint.unblocks.forEach(unblockedWaypointId => {
      const sourcePos = positions[waypoint.id];
      const targetPos = positions[unblockedWaypointId];
      
      if (sourcePos && targetPos) {
        // Calculate line from edge of source circle to edge of target circle
        const dx = targetPos.x - sourcePos.x;
        const dy = targetPos.y - sourcePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          // Unit vector in direction from source to target
          const unitX = dx / distance;
          const unitY = dy / distance;
          
          // Start from edge of source circle (moving toward target)
          const x1 = sourcePos.x + unitX * CIRCLE_RADIUS;
          const y1 = sourcePos.y + unitY * CIRCLE_RADIUS;
          
          // End at edge of target circle (coming from source)
          const x2 = targetPos.x - unitX * CIRCLE_RADIUS;
          const y2 = targetPos.y - unitY * CIRCLE_RADIUS;
          
          links.push({
            sourceId: waypoint.id,
            targetId: unblockedWaypointId,
            x1,
            y1,
            x2,
            y2,
          });
        }
      }
    });
  });
  
  return {
    positions,
    links,
  };
};