chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      	if (request.method == "getChannel4EpisodeInfo"){
          		//Channel 4 series - get the info from the title and episode info divs
          		var seriesTitle = document.getElementsByClassName("multi-line-title")[0].innerText.trim();
          		var seasonAndEpisode = document.getElementsByClassName("odPlayer-title")[0].innerText.trim().split(" ");
          		var seasonNumber = 1;
          		var episodeNumber = 1;
          		if(seasonAndEpisode.length > 2){
          			seasonNumber = parseInt(seasonAndEpisode[1]);
                episodeNumber = parseInt(seasonAndEpisode[3]);
          		} else {
          			episodeNumber = parseInt(seasonAndEpisode[1]);
          		}
          		sendResponse({series: seriesTitle, season: seasonNumber, episode: episodeNumber});
      	}
        else if (request.method === "getAmazonEpisodeInfo") {
              //TODO: fix to get the correct info
              var seriesTitle = document.getElementById("aiv-content-title").childNodes[0].nodeValue.trim();
              var season = document.getElementsByClassName("season-single-dark")[0].innerText.trim().split(" ");
              var episode = document.getElementsByClassName("dv-info")[0].innerText.trim().split(".");
              var seasonNumber = season[1];
              var episodeNumber = episode[0];
              sendResponse({series: seriesTitle, season: seasonNumber, episode: episodeNumber});
        }
        else if (request.method === "getNetflixEpisodeInfo") {

              var seriesInfo = document.getElementsByClassName("player-status")[0];
              var seriesTitle = seriesInfo.childNodes[0].innerText.trim();
              var season = seriesInfo.childNodes[1].innerText.split(" ");
              var seasonNumber = season[1].substring(0, season[1].length - 1);
              var episodeNumber = season[3];
              sendResponse({series: seriesTitle, season: seasonNumber, episode: episodeNumber});
        }
});
