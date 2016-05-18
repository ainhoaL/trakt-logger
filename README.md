##Trakt-Logger
I used this small project to learn about developing chrome extensions.
For now if you want to use it you are gonna have to create your own app in the trakt website. Eventually I will create a website for this app and handle the whole OAuth so anybody can use it with no setup pain.

This chrome extension logs in trakt (http://trakt.tv/) episodes you have watched online in BBC iPlayer, Channel 4, Amazon and Netflix.
It will automatically log the episode once its page loads, without checking whether you are watching the episode or not. Trying to improve on this area for the future so it only logs if the play button was clicked.

BBC iPlayer:
For now it will only understand episodes of tv shows with the title of the page as: "BBC iPlayer - NameOfShow - Season X: Episode Y".

Channel 4:
Working on a fix for Channel 4.

Amazon:
Picks up the episode info from the player data.

Netflix:
Picks up the episode info from the player data.

##How to setup the extension
Register your own app on trakt.tv and generate the needed client_id, client_secret, access_token and refresh_token.
Download the extension files and add that info to backSeries.js
More info on how to generate the ids and tokens in trakt API docs:
http://docs.trakt.apiary.io/#reference/authentication-oauth
Install the extension in your Chrome (You will need to be in developer mode if you want to debug it).

##Files
1. content.js is the content_script that gathers information from the page DOM to send to the background script.
2. backSeries.js is the background script that handles loging the episode into trakt.
3. manifest.json is the chrome extension manifest.
