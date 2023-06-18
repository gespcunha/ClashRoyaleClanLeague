# Outdated
The game **Clash Royale** has been updated and some features were removed. This application is no longer usable.

# Why
I started this project during my college degree, in order to learn javascript and test my skills.

# ClashRoyale Clan League
This is a simple command line application to run a **ClashRoyale league** in your clan. The available criterias are explained below. There isn't a fixed number of fixtures so you can do how many you want. The "database" is an ```excel file```.

## Requirements
- [NodeJS](https://nodejs.org/)

## How to use
- Open a command line in the root folder of the project.
- If it's the first time running the program, execute ```npm install``` and ```npm install exceljs``` if the first doesn't work alone.
- Execute the command ```node control```.

## Clan tag
To change the clan tag open the file ```utils.js``` and change the value of the variable ```CLAN_TAG```.
<br/><br/>

## Points values
To change the values of points corresponding to each  **criteria**, open the file ```points.js``` and change the values under the comment ```POINTS TO EACH CRITERIA```.
