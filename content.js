chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if (request.method == "getChannel4SeriesName"){
		//Channel 4 series - get the info from the title and episode info divs
		var seriesTitle = document.getElementById("brand-split-title").innerText.trim();
		var season = document.getElementById("seriesNo").innerText.trim().split(" ");
		var episode = document.getElementById("episodeNo").innerText.trim().split(" ");
		var seasonNumber = 1;
		var episodeNumber = 1;
		if(season.length == 2){
			seasonNumber = parseInt(season[1]);
		}
		if(episode.length == 2){
			episodeNumber = parseInt(episode[1]);
		}
		sendResponse({series: seriesTitle, season: seasonNumber, episode: episodeNumber});
	}
});