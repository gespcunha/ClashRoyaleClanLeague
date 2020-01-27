# ClashRoyale Clan League

## Requirements
- [NodeJS](https://nodejs.org/)

## How to use
Open a command line in the root folder of the project and execute one of the commands below.
If it's the first time execute ```npm install```.

## Commands
```
node control <criteria> <show | write>
```
  
### Criteria
- **leaderboard** - 
Data about the general leaderboard of all players.

-  **win_rates** - 
Win rate percentage over the last 10 wars.

- **last_wars** - 
Number of participations over the last 10 wars.

- **donations** - 
Number of donations during the week. Resets from sunday to monday.

- **collected_cards** -
Collected cards average over the last 10 wars.

### Show | Write
- **read** - 
Creates a file named "Fixture" showing the fixture results.

- **write** - 
Updates the file with general file with a fixture's result. In case of criteria = leaderboard, the file sets 0 points to all players.

