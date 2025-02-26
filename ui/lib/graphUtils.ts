import type {Quest} from './graphTypes';

const generateQuestGraph = ( quests: Quest[] ) => {
  // Sort quests from most recent to oldest
  const sortedQuests = [...quests].sort((a, b) => b.createdAt - a.createdAt);

  // Construct nodes
  const nodes = sortedQuests.map(quest => ({
    id: quest.id,
    title: quest.title,
  }));

  // Construct links (like a stack)
  const links = sortedQuests.slice(1).map((quest, index) => ({
    source: sortedQuests[index].id,
    target: quest.id,
  }));

  return { nodes, links };
};

