export const quests = [
  {
    id: 'a7f8b3e2-9d14-4c8a-b7e3-2f6d8a9c1e5b',
    name: 'northstar-frontend',
    type: 'quest',
    lastModified: new Date('2025-01-13T17:00:00.000Z')
  },
  {
    id: 'e4b7c9f1-3a8d-42e6-9f7b-8c5a2d1e4f3a', 
    name: 'northstar-backend',
    type: 'quest',
    lastModified: new Date('2025-01-13T17:30:00.000Z')
  }
];

export const tagTypes = [
  {
    id: '9f3a8b7c-2e5d-4a1f-8b9c-7e4a2d5f8b1c',
    name: 'location',
    type: 'tagType',
    lastModified: new Date('2025-01-13T16:00:00.000Z')
  }
];

export const tags = [
  {
    id: '5d8a3f9b-7c2e-4b6a-9f3d-8c1e5a7b4f2d',
    name: 'home',
    type: 'tag',
    tagTypeId: '9f3a8b7c-2e5d-4a1f-8b9c-7e4a2d5f8b1c',
    lastModified: new Date('2025-01-13T16:30:00.000Z')
  }
];

export const waypoints = [
  {
    id: 'f2e9a6b4-8c7d-4f1e-a3b5-9d2f6e8a4c7b',
    questIds: ['a7f8b3e2-9d14-4c8a-b7e3-2f6d8a9c1e5b'],
    name: 'Setup React Project',
    description: 'Initialize React project with TypeScript',
    unblocks: ['8b3c7f2e-6d9a-4e1b-9c5f-3a7e8d2b4f6c'],
    tags: [],
    completed: false,
    lastModified: new Date('2025-01-13T18:30:00.000Z')
  },
  {
    id: '8b3c7f2e-6d9a-4e1b-9c5f-3a7e8d2b4f6c',
    questIds: ['a7f8b3e2-9d14-4c8a-b7e3-2f6d8a9c1e5b'],
    name: 'waypoint creation form',
    description: 'Build form UI for creating new waypoints',
    unblocks: ['d4f8a9c2-1e7b-4d3a-8f6e-9b2c5a1d7f4e'],
    tags: [],
    completed: false,
    lastModified: new Date('2025-01-13T19:15:00.000Z')
  },
  {
    id: 'd4f8a9c2-1e7b-4d3a-8f6e-9b2c5a1d7f4e',
    questIds: ['a7f8b3e2-9d14-4c8a-b7e3-2f6d8a9c1e5b'],
    name: 'quest swiping navigation',
    description: 'Implement swipe gestures for quest navigation',
    unblocks: [],
    tags: [],
    completed: false,
    lastModified: new Date('2025-01-13T20:00:00.000Z')
  },
  {
    id: '2c4e8f9a-1b6d-4a7e-9c3f-5d8a2e4b7c9f',
    questIds: ['e4b7c9f1-3a8d-42e6-9f7b-8c5a2d1e4f3a'],
    name: 'calendar integration',
    description: 'Integrate calendar functionality for scheduling and events',
    unblocks: [],
    tags: [],
    completed: false,
    lastModified: new Date('2025-01-13T21:00:00.000Z')
  },
  {
    id: '7b9e3f2a-5c8d-4e1b-a6f4-9d7c2a5e8b1f',
    questIds: ['e4b7c9f1-3a8d-42e6-9f7b-8c5a2d1e4f3a'],
    name: 'email integration',
    description: 'Implement email sending and receiving capabilities',
    unblocks: [],
    tags: [],
    completed: false,
    lastModified: new Date('2025-01-13T21:30:00.000Z')
  },
  {
    id: '4f8c2e9b-7a5d-4b3e-8f1c-6a9d4e7b2c5f',
    questIds: ['e4b7c9f1-3a8d-42e6-9f7b-8c5a2d1e4f3a'],
    name: 'file import',
    description: 'Build functionality to import files from various sources',
    unblocks: ['1e6a9c4f-8b7d-4e2a-9f5c-3b8e1a6d4c7f'],
    tags: [],
    completed: false,
    lastModified: new Date('2025-01-13T22:00:00.000Z')
  },
  {
    id: '1e6a9c4f-8b7d-4e2a-9f5c-3b8e1a6d4c7f',
    questIds: ['e4b7c9f1-3a8d-42e6-9f7b-8c5a2d1e4f3a'],
    name: 'file export',
    description: 'Build functionality to export files to various formats',
    unblocks: [],
    tags: [],
    completed: false,
    lastModified: new Date('2025-01-13T22:30:00.000Z')
  }
];