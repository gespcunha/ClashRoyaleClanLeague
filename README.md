# ClashRoyale Clan League
This is a simple command line application to run a **ClashRoyale league** in your clan. The available criterias are explained below. There isn't a fixed number of fixtures so you can do how many you want.
The "database" is a ```csv file```.

## Requirements
- [NodeJS](https://nodejs.org/)

## How to use
If it's the first time, execute ```npm install request``` and ```npm install chalk```.
Open a command line in the root folder of the project and execute the command in **Command to execute**.

## Command to execute
```
node control
```
  
### Criteria
- **leaderboard** - 
Data about the general leaderboard of all players.

-  **win_rates** - 
Win rate percentage over the last 10 wars.

- **participations** - 
Number of participations over the last 10 wars.

- **donations** - 
Number of donations during the week. Resets from sunday to monday.

- **collected_cards** -
Collected cards average over the last 10 wars.

- **trophies** - 
Number of trophies.

### Read | Write
- **read** - 
Creates a file named "Fixture" showing the fixture results.

- **write** - 
Updates the file with general data with a fixture's result. In case of criteria = leaderboard, the file sets 0 points to all players (starts the league).

## Clan tag
To change the clan tag open the file ```utils.js``` and change the value of the variable ```CLAN_TAG```.

## Points values
To change the values of points corresponding to each **criteria**, open the file ```clash-web-api.js``` and change the values under the comment ```POINTS TO EACH CRITERIA```.
