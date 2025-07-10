# Northstar 
Find Your Way 


Northstar is a synced productivity app for iPhone 





### TODO 

- sync with dynamodb

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


Push notifications:
- turns out you need an apple developer account to get push notifications sent to phone
- what we'll do instead is just sync the state with the database + use an alarm to remind us to check the todo list in the morning
- the lambda will serve data from dynamo 
- the desktop app will be able to push data to dynamo 


other ideas:

Add to northstar a type of tag which is location specific, like "apartment" "driving"
add to northstar inspiring quotes like from the bible and C.S. lewis 
Add to North Star feature: location. When scheduling, need to include the time to get drive from a to b.
Should be able to integrate the google maps api
northstar should be able to propose quests to you 


create an email update list for interested parties

Add Aidan Albritton to the northstar email list 
albrittonaidan83@gmail.com

feature idea: setting (computer / out and about / in the apartment)

feature idea: due date

feature idea: priority level 

feature idea: AI integration that lets you be able to take a picture of a todo list and have it automatically convert to quests

star shape should be a random polygon with some diamondicity to it

name of each star should be next to it 

pinch to zoom

button to manipulate window so current row is in the bottom middle

constellation layout should be automatic: each node goes in the row of max(node.children.row) + 1 (or current row if no children)

styling on selected node should be better: want a corona instead of a hard line

press on the node should bring up the node details panel from the side 

node details panel should tell you the parents and children 

node details panel should let you set parents / children

node details panel should let you change the name and description 

parents and children should be colored in some kind of way when a star is selected

connecting edges should be stronger when a star is selected




agentic integration with the google calendar api  
when it makes a calendar event, it should also have a link on the calendar where if i click on it, it will reschedule the event for the future

good looking transitions between quest constellations 

inspirational quotes plugin 



get an agent set up which can work on this
reproduce the agent in from anthropic using ollama
have that agent be able to make a change to the code


from call with Jim: you want a checkmark that gives you dopamine, and you want an archive of what's been accomplished
put the stuff from the call with brandon onto the graphtodo asana

put northstar server on ec2/ecs
- provision with terraform
- sync todo graphs 
- figure out how we can get a free llm call in the browswer


show a single list 
show a list which is derived from a json
be able to export the quests

make a real build so you can load it onto your phone
be able to run the app without the dev server (figure out the build pipeline)
get apple developer account
this is going to cost 99 dollars, so we're going to wait until we have another day job
https://docs.expo.dev/build/setup/
https://docs.expo.dev/develop/development-builds/create-a-build/

connect an LLM
have the LLM be able to decompose the nodes into smaller dependencies / edit nodes
speech to text to LLM workflow, so you can just tell the assistant what to do 
nodes should have an expected time to execution 
nodes should have an expected due date

desktop version

text message prompting 
should be able to send the user a text with some things they could do 
detects if you're on some dope scroll and sends you a message

time sensitive quests
put a deadline on quest fulfillment and have that prompt the user, automatically add a calendar thing, even multiple calendar things


have the user's data sync to their cloud storage so that it can sync across their account

requests feature
have a button and let the user automatically submit a request

migration feature
app takes in a list from somewhere else, uses an LLM to structure it and convert it into a graph

event automation
automatically schedule quests in the calendar for when you have time
scans text and email and whatsapp and makes quests

automatically decomposes quests
if you haven't done anything in a long time on a quest, it will add simpler starting points

long term tracking
figures out when you're available
figures out when you're productive

checks off quests based on other AI stuff, like you tell it to or it knows from your messages 





### Build Process

- **Apple Developer Account**: Get an Apple Developer account ($99)
- **Real Build**: Make a real build so you can load it onto your phone
- **Run without Dev Server**: Be able to run the app without the dev server (figure out the build pipeline)

### Resources

- [Expo Build Setup](https://docs.expo.dev/build/setup/)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/create-a-build/)
