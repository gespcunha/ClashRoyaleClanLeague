# ClashRoyale Clan League
This is a simple command line application to run a **ClashRoyale league** in your clan. The available criterias are explained below. There isn't a fixed number of fixtures so you can do how many you want. The "database" is an ```excel file```.

## Requirements
- [NodeJS](https://nodejs.org/)

## How to use
- Open a command line in the root folder of the project.
- If it's the first time running the program, execute ```npm install```.
- Execute the command ```node control```.
  
### Criteria
- **Leaderboard** - 
Data about the general leaderboard of all players.

- **Donations** - 
Number of donations during the week. Resets from sunday to monday.

- **Trophies** - 
Number of trophies.

- **Win rates** - 
Win rate percentage over the last 10 wars.

- **Participations** - 
Number of participations over the last 10 wars.

- **Average of collected cards** -
Collected cards average over the last 10 wars.

- **Missed collections or wars** -
Each player's number of missed collection battles or war battles.

- **Add a point to players that won the last war** -
Adds a point (doesn't count as a fixture, so it doesn't add a game to the leaderboard).

### Read | Write
- **Read** - 
Creates a file named "Fixture" showing the fixture results.

- **Write** - 
Updates the file with general data with a fixture's result. In case of *criteria = leaderboard*, the file sets 0 points to all players (starts the league).

## Clan tag
To change the clan tag open the file ```utils.js``` and change the value of the variable ```CLAN_TAG```.

## Points values
To change the values of points corresponding to each **criteria**, open the file ```points.js``` and change the values under the comment ```POINTS TO EACH CRITERIA```.