function makeOffline (box, line) {
	var statusText = document.createElement('p');
	statusText.setAttribute('class', 'alert');
	statusText.innerHTML = 'Offline';

	line.appendChild(statusText);
	box.appendChild(line);
	console.log('End offline');
}

function makeAbsent (box, line) {
	var statusText = document.createElement('p');
	statusText.setAttribute('class', 'alert');
	statusText.innerHTML = 'Account closed.';

	line.appendChild(statusText);
	box.appendChild(line);
	console.log('End absent');
}

function makeLive (box, line, viewers, streamTitle, followers) {
	var streaming = document.createElement('p');
	streaming.setAttribute('class', 'current-stream');
	streaming.innerHTML = streamTitle;

	var statsLine = document.createElement('p');
	statsLine.setAttribute('class', 'stats');

	var viewing = document.createElement('span');
	viewing.setAttribute('class', 'current-viewers');
	viewing.innerHTML = 'Viewers: '+viewers;

	var following = document.createElement('span');
	following.setAttribute('class', 'current-followers');
	following.innerHTML = ' | Followers: '+followers;

	line.appendChild(streaming);
	statsLine.appendChild(viewing);
	statsLine.appendChild(following);
	line.appendChild(statsLine);
	box.appendChild(line);
	console.log('End live');
}

$(document).ready(function() {
	// Stuff to do when page loads
	var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

	channels.forEach(function(channel) {
		var apiURL = 'https://wind-bow.gomix.me/twitch-api/streams/'+channel+'?callback=?';
		$.ajax({
		type: 'GET',
		dataType:'jsonp',
		url: apiURL,
		crossDomain: true,
		cache: false,
			}) // end ajax
		.done(function(json) {
			var box = document.querySelector('.streams-box');
			var url = 'https://www.twitch.tv/'+channel;

			var line = document.createElement('div');
			line.setAttribute('class', 'line');

			var channelTitle = document.createElement('span');
			channelTitle.setAttribute('class', 'channel-title');

			var channelLink = document.createElement('a');
			channelLink.setAttribute('href', url);
			channelLink.innerHTML = channel;

			channelTitle.appendChild(channelLink)
			line.appendChild(channelTitle);
			console.log(channel, url);

			if (json.stream == null) {
				var status = 'offline';
				makeOffline(box, line);
			} else if (json.stream == undefined) {
				var status = 'absent';
				makeAbsent(box, line);
			} else {
				var status = 'live';
				var viewers = json.stream.viewers; // people watching
				var streamTitle = json.stream.channel.status;
				var followers = json.stream.channel.followers; //followers
				var preview = json.stream.preview.large; // live line background
				line.setAttribute('style', 'background-image:url('+preview+')');
				makeLive(box, line, viewers, streamTitle, followers);
			} // end status = live
		}) // end done
		.fail(function(json) {
			console.log('fail');
		});
	}); // end forEach

}); // end document ready