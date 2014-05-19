chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	var traktAPIKey = "";
	var traktPassword = "";
	var traktUser = "";
	
    if (changeInfo.status === 'complete') {
		chrome.tabs.get(tabId, function(tab){
			
			//Get the show info - need the ID to save the episode later
			var searchQuery = "http://api.trakt.tv/search/shows.json/" + traktAPIKey + "?query=";
			var findShow = function(name, season, episode) {
				var processedName = name.replace(" ", "+");
				var req = new XMLHttpRequest();
				req.open("GET", searchQuery+processedName, true);
				req.onload = saveEpisode.bind(this, season, episode);
				req.send(null);
			};
			
			//Save the episode in Trakt as seen
			var checkinURI = "http://api.trakt.tv/show/episode/seen/" + traktAPIKey;
			var saveEpisode = function(season, episode, response) {
				var shows = JSON.parse(response.target.responseText);
				var show = shows[0];
				var checkinShow = {
					"username": traktUser,
					"password": traktPassword,
					"imdb_id": show.imdb_id,
					"tvdb_id": show.tvdb_id,
					"title": show.title,
					"year": show.year,
					"episodes": [
						{
						"season": season,
						"episode": episode
						}
					]
				};
				//No need to keep track of whether it was saved or not, no error message handling implemented yet
				var xhr = new XMLHttpRequest();
				xhr.open("POST", checkinURI, true);
				xhr.onload = function (response2){};
				xhr.send(JSON.stringify(checkinShow));				
			};
			
			//BBC iPlayer - format of the tab title: "BBC iPlayer - NameOfShow - Series X: Episode Y" 
			if(tab.url.indexOf("iplayer")!=-1 && tab.url.indexOf("episode")!=-1) {
				//Parse series information
				var title = tab.title.split("-");
				var seriesTitle = title[1].trim();
				var otherInfo = title[2].split(":");
				var seasonNumber = 1;
				var episode = null;
				if(otherInfo.length>1){
					//There is a season number
					var season = otherInfo[0].trim().split(" ");
					seasonNumber = parseInt(season[1]);
					episode = otherInfo[1].trim().split(" ");
				} else {
					episode = otherInfo[0].trim().split(" ");
				} 
				var episodeNumber = parseInt(episode[1]);
				
				findShow(seriesTitle, seasonNumber, episodeNumber);

			}
			else if(tab.url.indexOf("channel4")!=-1 && tab.url.indexOf("4od")!=-1) {
			//Channel 4 - episode data returned from content script
				chrome.tabs.sendMessage(tab.id, {method: "getChannel4SeriesName"}, function(response) {

					findShow(response.series, response.season, response.episode);

				});
			}
						
		});
	}
});