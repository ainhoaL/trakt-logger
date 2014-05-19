Used this small project to learn about developing chrome extensions.

This chrome extension logs in trakt (http://trakt.tv/) episodes you have watched online in BBC iPlayer or Channel 4.
It will automatically log the episode once you go into the its page, without checking whether you are watching the episode or not. Trying to improve on this area for the future.

BBC iPlayer:
For now it will only understand episodes of tv shows with the title of the page as: "BBC iPlayer - NameOfShow - Season X: Episode Y"

Channel 4:
Only works in the case when the page with the episode says the name of the show and underneath Season X: Episode Y

Will add more formats for both websites, as well as more websites, as I come across them

TO USE THIS EXTENSION:
Add your trakt API key, username and password to backSeries.js

content.js is the content_script that gathers information from the page DOM to send to the background script.
backSeries.js is the background script that handles login the episode into trakt
manifest.json is the chrome extension manifest

