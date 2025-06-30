import {
  Quest,
  DependencyRanks,
  QuestConstellationScreenProps,
  Waypoint,
  Node,
  DrawerParamList,
} from '../lib/types';

export const getDependencyRank = (quest: Quest): DependencyRanks => {
  const dependencyRanks: DependencyRanks = {};

  // Initialize all nodes with rank 0
  quest.nodes.forEach((node) => {
    dependencyRanks[node.id] = 0;
  });

  // Iteratively assign ranks until no changes are made
  let changed = true;
  while (changed) {
    changed = false;

    for (const link of quest.links) {
      const sourceRank = dependencyRanks[link.source];
      const targetRank = dependencyRanks[link.target];

      // If target's rank needs to be updated
      if (targetRank <= sourceRank) {
        dependencyRanks[link.target] = sourceRank + 1;
        changed = true;
      }
    }
  }

  return dependencyRanks;
};

export const getColumns = (
  quest: Quest,
  ranks: Record<string, number>,
): Record<string, number> => {
  const columns: Record<string, number> = {};
  const rankGroups: Record<number, string[]> = {};

  // Group nodes by their rank
  quest.nodes.forEach((node) => {
    const rank = ranks[node.id];
    if (!rankGroups[rank]) {
      rankGroups[rank] = [];
    }
    rankGroups[rank].push(node.id);
  });

  // Assign column numbers within each rank group
  Object.entries(rankGroups).forEach(([rank, nodeIds]) => {
    nodeIds.forEach((nodeId, index) => {
      columns[nodeId] = index + 1; // Column numbers start at 1
    });
  });

  return columns;
};

export const mapQuestToWaypoints = (quest: Quest): Waypoint[] => {
  const ranks = getDependencyRank(quest);
  const columns = getColumns(quest, ranks);

  return quest.nodes.map((node) => ({
    ...node,
    text: node?.text ?? node.id,
    selected: false,
    rank: ranks[node.id],
    column: columns[node.id],
    created: new Date(),
    lastModified: new Date(),
    tags: [],
    blocks: [],
    blockedBy: [],
    northstarObjectID: node.northstarObjectID,
  }));
};
