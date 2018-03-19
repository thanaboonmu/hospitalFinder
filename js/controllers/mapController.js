angular.module('starter')
.controller('mapController',function($scope,$cordovaGeolocation,$ionicLoading){
    console.log('mapController start...');

	$scope.initGoogleMap = function(myLatitude,myLongtitude){
		console.log("lat= "+myLatitude);
		console.log("lng= "+myLongtitude);
		var myLatLng = new google.maps.LatLng(myLatitude, myLongtitude);
		var map = new google.maps.Map(document.getElementById('map'), {
			center: myLatLng,
	        zoom: 16
	    });
		var marker = new google.maps.Marker({
			map: map,
			animation: google.maps.Animation.BOUNCE,
			position: myLatLng
		});
		var infowindow = new google.maps.InfoWindow({
			content: 'My current location'		
		});
		marker.addListener('click',function(){
			infowindow.open(map,marker);
		})
		// find nearby
		var requestHospital = {
		    location: myLatLng, // current location
		    radius: 5000, // 5000 meters = 5 kms
		    type: 'hospital', // find hospital
		    keyword: ["(โรงพยาบาล) OR (hospital)"]
		};
		var requestHealth = {
		    location: myLatLng, // current location
		    radius: 5000, // 5000 meters = 5 kms
		    type: 'health', // find clinic
		    keyword: ["(คลินิก) OR (clinic)"]
		};
		var requestPharmacy = {
		    location: myLatLng, // current location
		    radius: 5000, // 5000 meters = 5 kms
		    type: 'pharmacy', // find pharmacy
		    keyword: 'pharmacy'
		};
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(requestHospital, callbackHospital);
		service.nearbySearch(requestHealth, callbackHealth);
		service.nearbySearch(requestPharmacy, callbackPharmacy);

		function callbackHospital(results, status) {
		    if (status == google.maps.places.PlacesServiceStatus.OK) {
		    	createMarkers(results);
			    for (var i = 0; i < results.length; i++) {
			        results[i].distance = google.maps.geometry.spherical.computeDistanceBetween(myLatLng,results[i].geometry.location);
			    }
		        var array = results;
		        array.sort(function(a,b){return a.distance-b.distance;});
		        var infoString = "Name | Distance (km)<br>";
		        for (var i = 0; i < results.length; i++) {
		         	var km = array[i].distance/1000;
		         	infoString += array[i].name + " | " + km.toFixed(2) + "<br>";
		       		console.log(array[i].name + "| " + array[i].types[0] + "| " + array[i].vicinity + "| " + array[i].distance.toFixed(2));
		        }
			    $scope.btnShowHospital = function(){
		        	infowindow.setContent(infoString);
		            infowindow.open($scope.map, marker);
			    } // end btnShowHospital
		    } // end if statusOK
		} // end callbackHospital

		function callbackHealth(results, status) {
		    if (status == google.maps.places.PlacesServiceStatus.OK) {
		    	createMarkers(results);
			    for (var i = 0; i < results.length; i++) {
			        results[i].distance = google.maps.geometry.spherical.computeDistanceBetween(myLatLng,results[i].geometry.location);
			    }
		        var array = results;
		        array.sort(function(a,b){return a.distance-b.distance;});
		        var infoString = "Name | Distance (km)<br>";
		        for (var i = 0; i < results.length; i++) {
		         	var km = array[i].distance/1000;
		         	infoString += array[i].name + " | " + km.toFixed(2) + "<br>";
		       		console.log(array[i].name + "| " + array[i].types[0] + "| " + array[i].vicinity + "| " + array[i].distance.toFixed(2));
		        }
			    $scope.btnShowHealth = function(){
		        	infowindow.setContent(infoString);
		            infowindow.open($scope.map, marker);
			    } // end btnShowHealth
		    } // end if statusOK
		} // end callbackHealth

		function callbackPharmacy(results, status) {
		    if (status == google.maps.places.PlacesServiceStatus.OK) {
		    	createMarkers(results);
			    for (var i = 0; i < results.length; i++) {
			        results[i].distance = google.maps.geometry.spherical.computeDistanceBetween(myLatLng,results[i].geometry.location);
			    }
		        var array = results;
		        array.sort(function(a,b){return a.distance-b.distance;});
		        var infoString = "Name | Distance (km)<br>";
		        for (var i = 0; i < results.length; i++) {
		         	var km = array[i].distance/1000;
		         	infoString += array[i].name + " | " + km.toFixed(2) + "<br>";
		       		console.log(array[i].name + "| " + array[i].types[0] + "| " + array[i].vicinity + "| " + array[i].distance.toFixed(2));
		        }
			    $scope.btnShowPharmacy = function(){
		        	infowindow.setContent(infoString);
		            infowindow.open($scope.map, marker);
			    } // end btnShowPharmacy
		    } // end if statusOK
		} // end callbackPharmacy
		
	    function createMarkers(places) {  // create nearby places' markers
	    	var markers = places.map(function(place, i) {
	          	var placeLoc = place.geometry.location;
	          	var marker = new google.maps.Marker({
	            	map: map,
		            animation: google.maps.Animation.DROP,
		            position: placeLoc,
		            icon: place.icon
	          	});
	          	google.maps.event.addListener(marker, 'click', function() {
		            infowindow.setContent("Name : " + place.name + "<br>" + "Address : " + place.vicinity + "<br>" +
		            "Types : " + place.types[0] + "<br>" + "Distance : " + place.distance.toFixed(2) + "meters" + "<br>");
		            infowindow.open($scope.map, marker);
		        });
		        return marker;
	        });
	       var markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
	    } // end createMarkers
    } // end initGoogleMap

    $scope.btnCurrentLocation = function(){
      	console.log('btnCurrentLocation is pressed');
      	$scope.loading = $ionicLoading.show({
      		content: 'Getting current location...',
      		showBackdrop: false
    	});
	  	var posOptions = {timeout: 10000, enableHighAccuracy : true};
	  	$cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
			var lat = position.coords.latitude;
			var long = position.coords.longitude;
			$scope.initGoogleMap(lat,long);
			$scope.loading.hide();
		}, function(err){
			alert('Unable to get location: ' + error.message);
		});
    } // end btnCurrentLocation

	$scope.initGoogleMap(13.7660, 100.5268); //initialize to Ramathibodi hospital

}); // end mapController


