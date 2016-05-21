//TODO: Need to save this externally
var clientId = "";
var clientSecret = "";
var appPIN = "";
var accessToken = "";
var refreshToken = "";
var appVersion = "";
var appDate = "";

const getTokenURI = "https://api-v2launch.trakt.tv/oauth/token";
const searchQueryURI = "http://api-v2launch.trakt.tv/search?query=";
const checkinURI = "https://api-v2launch.trakt.tv/checkin";

//Get the show info - need the ID to save the episode later
function findShow(name, season, episode) {
		var processedName = name.replace(" ", "+");
		var req = createRequest("GET", searchQueryURI+processedName+"&type=show", false);
		req.onload = saveEpisode.bind(this, season, episode);
		req.send(null);
};

//Save the episode in Trakt as seen
function saveEpisode(seasonWatching, episodeWatching, response) {
		var shows = JSON.parse(response.target.responseText);
		//Let's hope the show we wanted is the first one in the list...!
		//TODO: improve on selecting the show from the list of shows!
		var showFound = shows[0];

		var checkinShow = {
				show: {
						title: showFound.show.title
				},
				episode: {
						season: seasonWatching,
						number: episodeWatching
				},
				app_version: appVersion,
				app_date: appDate
		};
		//No need to keep track of whether it was saved or not
		var req = createRequest("POST", checkinURI, true);
		req.onload = function (response){
				if (response.target.status === 403) {
						// User couldn't authenticate -> wrong user or token has expired
						// Let's try to get a new token and save the episode again

						//xhr request to save the episode
						var retrySaveEpisode = function() {
								var req2 = createRequest("POST", checkinURI, true);
								req2.send(JSON.stringify(checkinShow));
						}

						refreshUserToken(retrySaveEpisode);
				}
		};
		req.send(JSON.stringify(checkinShow));
};

function refreshUserToken(retryFunc) {
		var req = createRequest("POST", getTokenURI, false);
		req.onload = getToken.bind(this);
		var body = { refresh_token: refreshToken, client_id: clientId , client_secret: clientSecret, redirect_uri: "urn:ietf:wg:oauth:2.0:oob", grant_type: "refresh_token"};
		req.send(JSON.stringify(body));

		var getToken = function (response) {
				//TODO: Need to save this externally so it lasts longer than the browser session
				accessToken = response.target.access_token;
				refreshToken = response.target.refresh_token;

				//Retry action
				retryFunc();
		}
}

function createRequest(method, uri, authorizationHeader) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, uri, true);
		if (authorizationHeader){
				xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
		}
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("trakt-api-version", "2");
		xhr.setRequestHeader("trakt-api-key", clientId);
		return xhr;
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	if (changeInfo.status === 'complete') {
		chrome.tabs.get(tabId, function(tab){

			//BBC iPlayer - format of the tab title: "BBC iPlayer - NameOfShow - Series X: Episode Y"
			//Can get the data from the tab title
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
			else if(tab.url.indexOf("channel4")!=-1 && tab.url.indexOf("on-demand")!=-1) {
					//TODO: fix channel4 data collection, no episode number in tab title or in the page content!
					var title = tab.title.split("-");
					var seriesTitle = title[0].trim();
					var otherInfo = title[1].trim().split(" ");
					var seasonNumber = 1;
					var episodeNumber = null;
					if(otherInfo.length>2){
							seasonNumber = parseInt(otherInfo[1]);
							episodeNumber = parseInt(otherInfo[3]);
					} else {
							episodeNumber = parseInt(otherInfo[1]);
					}
					//findShow(seriesTitle, seasonNumber, episodeNumber); //TODO: add again when channel4 fixed
			}
			else if (tab.url.indexOf("amazon")!== -1) {
					//Not enough info in the tab title, need to get info from page content
					//Get data via the content script
					chrome.tabs.sendMessage(tab.id, {method: "getAmazonEpisodeInfo"}, function(response) {
							findShow(response.series, response.season, response.episode);
					});
			}
			else if (tab.url.indexOf("netflix")!== -1 && tab.url.indexOf("watch")!== -1) {
					//Not enough info in the tab title, need to get info from page content
					//Get data via the content script
					chrome.tabs.sendMessage(tab.id, {method: "getNetflixEpisodeInfo"}, function(response) {
							findShow(response.series, response.season, response.episode);
					});
			}
		});
	}
});
