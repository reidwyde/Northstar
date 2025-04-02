# Northstar 
Find Your Way 

## Features

### App Features


- star shape should be a random polygon with some diamondicity to it
- name of each star should be next to it 
- pinch to zoom
- button to manipulate window so current row is in the bottom middle
- constellation layout should be automatic: each node goes in the row of max(node.children.row) + 1 (or current row if no children)
- styling on selected node should be better: want a corona instead of a hard line
- press on the node should bring up the node details panel from the side 
- node details panel should tell you the parents and children 
- node details panel should let you set parents / children
- node details panel should let you change the name and description 
- parents and children should be colored in some kind of way when a star is selected
- connecting edges should be stronger when a star is selected


- **Derived List**: Show a list derived from a JSON file
- **LLM Integration**: Connect an LLM and have it decompose nodes into smaller dependencies/edit nodes
- **Speech-to-Text Workflow**: Implement a speech-to-text to LLM workflow, so you can just tell the assistant what to do
- **Node Properties**: Add expected time to execution and due date properties to nodes
- **Desktop Version**: Create a desktop version of the app
- **Text Message Prompting**: Send text messages with prompts for tasks
- **Time Sensitive Quests**: Add deadlines to quests and have them prompt the user automatically
- **Data Sync**: Have the user's data sync to their cloud storage so it can sync across their account
- **Requests Feature**: Implement a requests feature, where users can submit requests automatically
- **Migration Feature**: Create an app that takes in a list from somewhere else, uses an LLM to structure it and convert it into a graph
- **Event Automation**: Automatically schedule quests in the calendar for when you have time
- **Automated Quest Decomposition**: Automatically decompose quests if you haven't done anything in a long time on a quest
- **Long Term Tracking**: Figure out when you're available/productive and check off quests based on other AI stuff

### Build Process

- **Apple Developer Account**: Get an Apple Developer account ($99)
- **Real Build**: Make a real build so you can load it onto your phone
- **Run without Dev Server**: Be able to run the app without the dev server (figure out the build pipeline)

### Resources

- [Expo Build Setup](https://docs.expo.dev/build/setup/)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/create-a-build/)
