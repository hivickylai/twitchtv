function makeOffline(box, line, followedBy) {
	var statsLine = document.createElement('p');
	statsLine.setAttribute('class', 'stats-offline');

	var following = document.createElement('span');
	following.setAttribute('class', 'current-followers');
	following.innerHTML = 'Offline / Followers: '+followedBy;

	statsLine.appendChild(following);
	line.appendChild(statsLine);
	box.appendChild(line);
	console.log('End offline');
}

function makeAbsent(box, line) {
	var statusText = document.createElement('p');
	statusText.setAttribute('class', 'alert');
	statusText.innerHTML = 'Account does not exist.';

	line.appendChild(statusText);
	box.appendChild(line);
	console.log('End absent');
}

function makeLive(box, line, viewers, streamTitle, followers) {
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
	following.innerHTML = ' / Followers: '+followers;

	line.appendChild(streaming);
	statsLine.appendChild(viewing);
	statsLine.appendChild(following);
	line.appendChild(statsLine);
	box.appendChild(line);
	console.log('End live');
}

$(document).ready(function() {
	// Stuff to do when page loads
	var channels = ["brunofin", "comster404", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb"];

	channels.forEach(function(arr) {
		var apiURL = 'https://wind-bow.gomix.me/twitch-api/streams/'+arr+'?callback=?';
		$.ajax({
		type: 'GET',
		dataType:'jsonp',
		url: apiURL,
		crossDomain: true,
		cache: false,
			}) // end ajax
		.done(function(json) {
			var box = document.querySelector('.streams-box');
			var url = 'https://www.twitch.tv/'+arr;

			var line = document.createElement('div');

			var channelTitle = document.createElement('span');

			var channelLink = document.createElement('a');
			channelLink.setAttribute('href', url);
			channelLink.innerHTML = arr;

			channelTitle.appendChild(channelLink)
			line.appendChild(channelTitle);
			console.log(arr, url);

			if (json.stream == null) {
				$.ajax({
				type: 'GET',
				dataType:'jsonp',
				url: 'https://wind-bow.glitch.me/twitch-api/channels/'+arr,
				crossDomain: true,
				cache: false,
				}) // end ajax
				.done(function(json) {
					if (json.error == "Not Found") {
						var status = 'absent';
						console.log(json);
						line.setAttribute('class', 'line offline');
						channelTitle.setAttribute('class', 'channel-offline');
						makeAbsent(box, line);
					} else {
						var status = 'offline';
						line.setAttribute('class', 'line offline');
						channelTitle.setAttribute('class', 'channel-offline');
						var followedBy = json.followers;
						makeOffline(box, line, followedBy);
					}
				});
			} else {
				var status = 'live';
				var viewers = json.stream.viewers; // people watching
				var streamTitle = json.stream.channel.status;
				var followers = json.stream.channel.followers; //followers
				var preview = json.stream.preview.large; // live line background
				channelTitle.setAttribute('class', 'channel-title');
				line.setAttribute('class', 'line live');
				line.setAttribute('style', 'background-image:linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url('+preview+')');
				makeLive(box, line, viewers, streamTitle, followers);
			} // end status = live
		}) // end done
		.fail(function(json) {
			console.log('fail');
		});
	}); // end forEach

// Nav functions
$('#live').on('click', function(e){
	e.preventDefault();
	$('.offline').addClass('hide');
	$('.live').removeClass('hide');
}); // end live nav

$('#offline').on('click', function(e){
	e.preventDefault();
	$('.live').addClass('hide');
	$('.offline').removeClass('hide');
}); // end offline nav

$('#reload').on('click', function(){
	window.location.reload();
}); // end reload nav

// TODO make it possible to add streams to array

$('#add-go').on('click', function(e){
	e.preventDefault();
	var query = document.querySelector('#add-stream').value;
	console.log(query);
	loadStreams(query);
});

// TODO search function: button unhides line with matching id or 'not found'?

}); // end document ready