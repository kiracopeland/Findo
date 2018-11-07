//global variables 
var map;
var noTweetMatch = false;
var noLocationMatch = false;
var noTweetsContainLocationMatch = false;

//counters used to check if all valiadation checks were successful
var inputCheck1 = false; 
var inputCheck2 = false;

$(document).ready(function(){
	
	//clear local storage if the html page isn't the results page - this is to avoid conflicts
	var htmlTitle = document.title;
	if (htmlTitle !== "Findo - Results") {
		if (htmlTitle == "Findo - Error") {
			var retrieveString = JSON.parse(window.localStorage.getItem('errorType'));
			
			//error screen specific messages
			if (retrieveString == "noTweetMatch") {
				$("#primaryError").append("Oops, we couldn't find any Tweets that matched your topic");
				$("#errorMessage").append("Make sure to double check your spelling, or maybe enter in a more generic topic");
			} else if (retrieveString == "noLocationMatch") {
				$("#primaryError").append("Oops, we couldn't find the location you specified");
				$("#errorMessage").append("Make sure to double check your spelling, or try entering in more details");
				
			} else if (retrieveString == "noTweetsContainLocationMatch") {
				$("#primaryError").append("Oops, we couldn't find any Tweets within your specified location");
				$("#errorMessage").append("Make sure your spelling is correct, or try entering a more generic location or topic");
			}
		}
		localStorage.clear();
	} else {
		//get the data from local storage and place them in a variable
		var retrieveString = JSON.parse(window.localStorage.getItem('resultTransfer'));
		
		//seperate the array into seperate variables again
		var retrievedUserTopic = retrieveString[0];
		var retrievedUserLocation = retrieveString[1];
		localStorage.removeItem("resultTransfer");
		
		//place the retrieved variables in the correct input elements to be used for further searches
		var retrievedInputTopic = $(".resultTopic");
		var retrievedInputLocation = $(".resultLocation");
		retrievedInputTopic.val(retrievedUserTopic);
		retrievedInputLocation.val(retrievedUserLocation);
		
		//start the process of geocoding
		geocoding();
	};
	
	$("input[name='find']").click(function() {
			//clear any error handling styles to avoid user confusion and conflict
		
			//for the topic labels on the index page
			$(".labelTopic").removeClass("errorLabel");
			$("input[name='topic']").removeClass("errorInput");
			
			//for the location labels on the results page
			$(".resultLabelLocation").removeClass("errorLabel");
			$("input[name='location']").removeClass("errorInput");
		
			//for the topic labels on the index page
			$(".labelLocation").removeClass("errorLabel");
			$("input[name='location']").removeClass("errorInput");
			
			//for the location labels on the results page
			$(".resultLabelLocation").removeClass("errorLabel");
			$("input[name='location']").removeClass("errorInput");
	
			//target the topic input element and check if it is empty
    		var userTopic = $("input[name='topic']").val();
			if ((userTopic) == '') {
			//input classes that will make the label appear, and change the visual elements of the input area
			
				//for the labels on the index page
				$(".labelTopic").addClass("errorLabel");
				$("input[name='topic']").addClass("errorInput");
			
				//for the labels on the results page
				$(".resultLabelTopic").addClass("errorLabel");
				$("input[name='topic']").addClass("errorInput");
			
				//if the input element is empty, prevent the form from submitting
				event.preventDefault();
			} else {
				inputCheck1 = true;
			};
    
			//target the location input element and check if it is empty
    		var userLocation = $("input[name='location']").val();
    		if ((userLocation) == '') {
				//input classes that will make the label appear, and change the visual elements of the input area
			
				//for the labels on the index page
				$(".labelLocation").addClass("errorLabel");
				$("input[name='location']").addClass("errorInput");
			
				//for the labels on the results page
				$(".resultLabelLocation").addClass("errorLabel");
				$("input[name='location']").addClass("errorInput");
				
				//if the input element is empty, prevent the form from submitting
				event.preventDefault();
			} else {
			inputCheck2 = true;
			}
	
			validationCheck();
	
			function validationCheck() {
				if (inputCheck1 == true && inputCheck2 == true) {
					//store both variables into localStorage using the JSON.stringify method and allow the form to submit
				
					//store both answers in an array
					var resultTransfer = [userTopic, userLocation];
					//stringify array into JSON data so it can be stored in localStorage
					var resultStringJson = JSON.stringify(resultTransfer);
					//send the array to local storage and continue with default event
					window.localStorage.setItem('resultTransfer', resultStringJson);
				} else {
					event.preventDefault();
				}
			}
		}
	)
	
	//Geocoding function
	var localMapLat;
	var localMapLong;
	
	function geocoding() {
		if (retrievedUserLocation == "Canberra") {
			var localMapLat = -35.343784;
			var localMapLong = 149.082977;
		} else if (retrievedUserLocation == "Sydney") {
			var localMapLat = -33.865143;
			var localMapLong = 151.209900;
		} else {
			var noTweetMatch = false;
			var noLocationMatch = true;
			var noTweetsContainLocationMatch = false;
			tweetError(noTweetMatch, noLocationMatch, noTweetsContainLocationMatch)
		}
			//google maps
		map = new google.maps.Map(document.getElementById('googleMap'), {
			center: {lat: localMapLat, lng: localMapLong},
			zoom: 13,
			disableDefaultUI: true,
            zoomControl: true,
			styles: [
				{
        			"featureType": "all",
        			"elementType": "labels.text.fill",
        			"stylers": [
						{"saturation": 36},
            			{"color": "#333333"},
            			{"lightness": 40}
        			]
				},
    			{
        			"featureType": "all",
					"elementType": "labels.text.stroke",
        			"stylers": [
            			{"visibility": "on"},
            			{"color": "#ffffff"},
            			{"lightness": 16}
        			]
				},
    			{
        			"featureType": "all",
        			"elementType": "labels.icon",
        			"stylers": [
            			{"visibility": "off"}
        			]
    			},
    			{
        			"featureType": "administrative",
        			"elementType": "geometry.fill",
        			"stylers": [
            			{"color": "#ffffff"},
            			{"lightness": 20}
        			]
    			},
    			{
					"featureType": "administrative",
        			"elementType": "geometry.stroke",
        			"stylers": [
            			{"color": "#fefefe"},
            			{"lightness": 17},
            			{"weight": 1.2}
        			]
    			},
    			{
        			"featureType": "landscape",
        			"elementType": "geometry",
        			"stylers": [
            			{"color": "#f5f5f5"},
            			{"lightness": 20}
        			]
    			},
    			{
        			"featureType": "landscape.man_made",
        			"elementType": "geometry",
        			"stylers": [
            			{"color": "#e6e6e6"}
        			]
    			},
    			{
 					"featureType": "poi",
        			"elementType": "geometry",
        			"stylers": [
            			{"color": "#f5f5f5"},
            			{"lightness": 21}
        			]
    			},
    			{
					"featureType": "poi.park",
        			"elementType": "geometry",
        			"stylers": [
            			{"color": "#dadada"}
        			]
    			},
    			{
        			"featureType": "road.highway",
        			"elementType": "geometry.fill",
        			"stylers": [
            			{"color": "#acacac"},
            			{"lightness": 17}
        			]
    			},
    			{
        			"featureType": "road.highway",
        			"elementType": "geometry.stroke",
        			"stylers": [
            			{"lightness": 29},
            			{"weight": 0.2},
            			{"color": "#ffffff"}
        			]
    			},
    			{
        			"featureType": "road.arterial",
        			"elementType": "geometry",
        			"stylers": [
            			{"color": "#bcbcbc"},
            			{"lightness": 18}
        			]
    			},
    			{
        			"featureType": "road.arterial",
        			"elementType": "geometry.stroke",
        			"stylers": [
            			{"color": "#f3f3f3"}
        			]
				},
    			{
        			"featureType": "road.local",
        			"elementType": "geometry",
        			"stylers": [
            			{"color": "#ffffff"},
            			{"lightness": 16}
        			]
    			},
    			{
        			"featureType": "road.local",
        			"elementType": "geometry.stroke",
        			"stylers": [
            			{"color": "#d7d7d7"}
        			]
    			},
    			{
        			"featureType": "transit.line",
        			"elementType": "geometry.fill",
        			"stylers": [
            			{"color": "#ffffff"}
        			]
   				},
    			{
        			"featureType": "transit.station.airport",
        			"elementType": "labels.icon",
        			"stylers": [
            			{"color": "#000000"}
					]
    			},
    			{
        			"featureType": "transit.station.bus",
        			"elementType": "labels.icon",
        			"stylers": [
            			{"color": "#ff0000"}
        			]
				},
    			{
        			"featureType": "transit.station.rail",
        			"elementType": "labels.icon",
        			"stylers": [
            			{"color": "#000000"}
        			]
    			},
    			{
        			"featureType": "water",
        			"elementType": "geometry",
        			"stylers": [
            			{"color": "#989898"},
            			{"lightness": 17}
        			]
    			}
			]
		}
	)
		embedTweets();
	}
	
	//Embed Tweets function
	function embedTweets() {
		//compare the user's topic against the array's list and collect those that match
		//go through the array until you hit the layer that cycles through each individual
		var arrayLength = individualTweets.individuals;
		//create a manual counter that cycles through the array via index number
		var arrayCount = 0;
		//create a manual counter keeps count of the number of approved matches
		var successCount = 0;
		//the array that will store all the tweets with matching topics
		var correctTweetsID = [];
		
		//forEach loop that controls matching user topic to tweets
		arrayLength.forEach(function() {
			//store the variable that grabs the individual Tweets
			var currentTweet = arrayLength[arrayCount];
			//cycle through the array to find the id 
			var idCompare = arrayLength[arrayCount].id;
			//compare the user entered topic with the array to see if there is a match
			if (idCompare == retrievedUserTopic) {
				//if it is, store that entry in var correctTweetsID for the next load of processing
				correctTweetsID.push(currentTweet);
				//add to the success counter to prevent the error message from appearing
				successCount++;
			}
			//add to counter so the forEach method moves down the array
			arrayCount++;
		})
		//compare to see if there were no matches
		if (successCount == 0) {
			//if the counter is 0, immediately go to error handling function
			var noTweetMatch = true;
			var noLocationMatch = false;
			var noTweetsContainLocationMatch = false;
			tweetError(noTweetMatch, noLocationMatch, noTweetsContainLocationMatch);
		}
		var secondSuccessCounter = 0;
		var idCounter = 0;
		var comfirmedCorrectTweets = [];
		//a forEach function that makes sure the tweets gathered are the same location as the one the user specified
		correctTweetsID.forEach(function() {
			//get the location element of the array element
			var currentCorrectTweetsID = correctTweetsID[idCounter].location;
			//if the location of the tweet is the same as the location the user entered, store that tweet and it's data in an array to be used for appending
			if (currentCorrectTweetsID == retrievedUserLocation) {
				//push the matching element to the new array
				comfirmedCorrectTweets.push(correctTweetsID[idCounter]);
				
				secondSuccessCounter++;
			} 
			//add one to the counter so the forEach loop cycles through the entire array
			idCounter++;
		})
		if (secondSuccessCounter == 0) {
			
			var noTweetMatch = false;
			var noLocationMatch = false;
			var noTweetsContainLocationMatch = true;
			tweetError(noTweetMatch, noLocationMatch, noTweetsContainLocationMatch);
		}
		
		var loopCounter = 0;
		comfirmedCorrectTweets.forEach(function() {
			var finalAppend = $(".tweetInformation").append('<div class="tweetBox"' + '</div>');
			finalAppend.append('<p class="username">' + comfirmedCorrectTweets[loopCounter].username +'</p>');
			finalAppend.append('<p class="at">' + comfirmedCorrectTweets[loopCounter].at + '</p>');
			finalAppend.append('<img class="profile" src=" ' + comfirmedCorrectTweets[loopCounter].profile +' "/>');
			finalAppend.append('<p class="tweet">' + comfirmedCorrectTweets[loopCounter].tweet +'</p>');
			
			if (comfirmedCorrectTweets[loopCounter].image !== "") {
				finalAppend.append('<img class="tweetImages" src="' + comfirmedCorrectTweets[loopCounter].image + ' "/>');
			} else {
				finalAppend.append('<div class="noTweetImages"' + '</div>');
			}
			
			loopCounter++;
			
			var combinedCoord = comfirmedCorrectTweets[loopCounter].position;
			var matchLat = combinedCoord[0];
			var matchLong = combinedCoord[1];
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(matchLat, matchLong),
				icon: 'images/Custom_Marker.png',
				map: map
			})
				marker.setMap(map);
			});
	}
	
	function tweetError(noTweetMatch, noLocationMatch, noTweetsContainLocationMatch) {
		
	//error handling for results page
	if (noTweetMatch == true) {
		//occurs if no Tweets match the user's inputted topic
		//clear any local storage to avoid conflicts
		localStorage.clear();
		//varaiable that will be stored in local storage to control what error message appears on error.html
		var errorType = "noTweetMatch";
		var sendError = JSON.stringify(errorType);
		//send the error message to localStorage and redirect user to error.html
		window.localStorage.setItem('errorType', sendError);
		window.location.href = "error.html";
	} else if (noLocationMatch == true) {
		//occurs if no Locations match the user's inputted topic
		//clear any local storage to avoid conflicts
		localStorage.clear();
		//varaiable that will be stored in local storage to control what error message appears on error.html
		var errorType = "noLocationMatch";
		var sendError = JSON.stringify(errorType);
		//send the error message to localStorage and redirect user to error.html
		window.localStorage.setItem('errorType', sendError);
		window.location.href = "error.html";
	} else if (noTweetsContainLocationMatch == true) {
		//occurs if no Locations match the user's inputted topic
		//clear any local storage to avoid conflicts
		localStorage.clear();
		//varaiable that will be stored in local storage to control what error message appears on error.html
		var errorType = "noTweetsContainLocationMatch";
		var sendError = JSON.stringify(errorType);
		//send the error message to localStorage and redirect user to error.html
		window.localStorage.setItem('errorType', sendError);
		window.location.href = "error.html";
	}
	}
});