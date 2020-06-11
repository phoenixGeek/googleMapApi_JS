var map;
var service;
var rectangle;
var timer;

// init Callback function when page is rendering

function initMap() {

    // initialize();


    //  additional practices using google map api


    // var map = new google.maps.Map(document.getElementById('map'), {
    //     center: { lat: -33.866, lng: 151.196 },
    //     zoom: 15
    // });

    // var request = {
    //     placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    // };

    // var infowindow = new google.maps.InfoWindow();
    // var service = new google.maps.places.PlacesService(map);

    // service.getDetails(request, function (place, status) {
    //     console.log(place)
    //     if (status === google.maps.places.PlacesServiceStatus.OK) {
    //         var marker = new google.maps.Marker({
    //             map: map,
    //             position: place.geometry.location
    //         });
    //         google.maps.event.addListener(marker, 'click', function () {
    //             infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
    //                 'Place ID: ' + place.place_id + '<br>' +
    //                 place.formatted_address + '</div>');
    //             infowindow.open(map, this);
    //         });
    //     }
    // });



    // This example creates circles on the map, representing populations in North
    // America.

    // First, create an object containing LatLng and population for each city.
    var citymap = {
        chicago: {
            center: { lat: 41.878, lng: -87.629 },
            population: 2714856
        },
        newyork: {
            center: { lat: 40.714, lng: -74.005 },
            population: 8405837
        },
        losangeles: {
            center: { lat: 34.052, lng: -118.243 },
            population: 3857799
        },
        vancouver: {
            center: { lat: 49.25, lng: -123.1 },
            population: 603502
        }
    };

    // Create the map.
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: 37.090, lng: -95.712 },
        mapTypeId: 'terrain'
    });

    // Construct the circle for each value in citymap.
    // Note: We scale the area of the circle based on the population.
    for (var city in citymap) {
        console.log("here", city)
        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: citymap[city].center,
            radius: Math.sqrt(citymap[city].population) * 100
        });
    }

}

function initialize() {

    // Create new google map object with no draggable, no zoomable, no extra infos

    var myLocation = new google.maps.LatLng(34.241, -118.5277);
    map = new google.maps.Map(document.getElementById('map'), {

        center: myLocation,
        zoom: 16,
        draggable: false,
        zoomable: false,
        styles: [
            {
                "featureType": "poi",
                "stylers": [
                    { "visibility": "off" }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },

            {
                "featureType": "administrative.neighborhood",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
    });

    var request = {
        location: myLocation,
        radius: '900',
        types: ["park"]
    };

    // Create a searching place service object and do search the places

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

}

function callback(results, status) {

    var savedResults = results;
    var nameArr = [];

    if (status == google.maps.places.PlacesServiceStatus.OK) {

        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            nameArr.push(results[i].name)
        }
    }

    let step = 1;
    let answerFlag = false;
    let correctCnt = 0;
    let incorrectCnt = 0;
    var start = new Date();

    // build Timer which is updated every seconds

    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");
    var totalSeconds = 0;
    timer = setInterval(setTime, 1000);

    function setTime() {
        ++totalSeconds;
        secondsLabel.innerHTML = pad(totalSeconds % 60);
        minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        }
        else {
            return valString;
        }
    }

    // Add double click listener  to map board

    map.addListener('dblclick', function (mapsMouseEvent) {

        // Get the latitude and longitude of clicked point
        let latitude = mapsMouseEvent.latLng.lat();
        let longitude = mapsMouseEvent.latLng.lng();

        var rectangleItem = 'rectangle' + step;

        // Create a rectangle object which will be proved right or wrong
        rectangleItem = new google.maps.Rectangle();
        let currentQuestion = $("#question" + step).text();
        // get the boundary of current questioned place
        let filteredInfo = savedResults.filter(savedResult => savedResult.name === currentQuestion);
        let bounds = filteredInfo[0].geometry.viewport;
        let fillColor;
        let strokeColor;
        if (latitude < bounds.Ya.j && latitude > bounds.Ya.i && longitude < bounds.Ua.j && longitude > bounds.Ua.i) {
            fillColor = "#87C147";
            strokeColor = "#87C147";
            answerFlag = true;
        } else {
            fillColor = "#FF0000";
            strokeColor = "#FF0000";
            answerFlag = false;
        }
        // check if the clicked point is inside in the boundary or not, if true display green rectangle, else false , blue rectangle

        rectangleItem.setOptions({
            strokeColor: strokeColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: fillColor,
            fillOpacity: 0.35,
            map: map,
            geodesic: true,
            bounds: bounds
        });
        // check if mouse click event occurred above rectangle area

        google.maps.event.addListener(rectangleItem, 'dblclick', function () {
            rectangleItem = 'rectangle' + step;
            rectangleItem = new google.maps.Rectangle();
            let currentQuestion = $("#question" + step).text();
            let filteredInfo = savedResults.filter(savedResult => savedResult.name === currentQuestion);
            let bounds = filteredInfo[0].geometry.viewport;

            if (latitude < bounds.Ya.j && latitude > bounds.Ya.i && longitude < bounds.Ua.j && longitude > bounds.Ua.i) {
                fillColor = "#87C147";
                strokeColor = "#87C147";
                answerFlag = true;
            } else {
                fillColor = "#FF0000";
                strokeColor = "#FF0000";
                answerFlag = false;
            }

            rectangleItem.setOptions({
                strokeColor: strokeColor,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: fillColor,
                fillOpacity: 0.35,
                map: map,
                geodesic: true,
                bounds: bounds
            });
        });

        // display correct answer and incorrect answer alert in case of answer is right or wrong respectively

        $('.button')[0].disabled = false;
        if (answerFlag) {
            correctCnt++;
            $('#answer' + step).children()[0].style.display = "block";
            $('#answer' + step).children()[1].style.display = "none";
        } else {
            incorrectCnt++;
            $('#answer' + step).children()[1].style.display = "block";
            $('#answer' + step).children()[0].style.display = "none";
        }

        // if you answer all those 5 questions, finish the quiz game and display the finished modal, elapsed time in min, sec format

        if (step === 5) {

            setTimeout(() => {

                document.getElementById("modal").style.display = 'block';
                $('#correctCnt').text(correctCnt);
                $('#incorrectCnt').text(incorrectCnt);
                var elapsed = new Date() - start;
                var seconds = Math.round(elapsed / 1000);
                var minutes = Math.round(seconds / 60);
                let sec = 0;
                let min = 0;
                sec = TrimSecondsMinutes(seconds);
                min = TrimSecondsMinutes(minutes);

                function TrimSecondsMinutes(elapsed) {
                    if (elapsed >= 60)
                        return TrimSecondsMinutes(elapsed - 60);
                    return elapsed;
                }
                $("#min").text(min);
                $("#sec").text(sec);
                clearInterval(timer)
            }, 1000);
            document.getElementsByClassName("button")[0].style.display = "none";

        }

    });

    // display the first question which was fetched randomly

    var display = document.getElementById("question1");
    var questionTracker = [];
    do {
        var randomQuestion = Math.floor(Math.random() * nameArr.length);
    } while (existingQuestions());

    display.innerHTML = '<p>' + nameArr[randomQuestion] + '</p>';
    questionTracker.push(randomQuestion);

    // check if the question was already display and if yes, don't display again

    function existingQuestions() {
        for (var i = 0; i < questionTracker.length; i++) {
            if (questionTracker[i] === randomQuestion) {
                return true;
            }
        }
        return false;
    }

    $(document).ready(function () {


        $(".button").on("click", function () {
            $('.button')[0].disabled = true;
            step++;
            $('#question' + step).css("display", "block");
            $('#caption' + step).css("display", "block");
            var display = document.getElementById("question" + step);
            do {
                var randomQuestion = Math.floor(Math.random() * nameArr.length);
            } while (existingQuestions());

            display.innerHTML = '<p>' + nameArr[randomQuestion] + '</p>';
            questionTracker.push(randomQuestion)

            function existingQuestions() {
                for (var i = 0; i < questionTracker.length; i++) {
                    if (questionTracker[i] === randomQuestion) {
                        return true;
                    }
                }
                return false;
            }

        });
    });

}

function createMarker(place) {

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    // google.maps.event.addListener(marker, "dblclick", function (mapsMouseEvent) {

    //     var infoWindow = new google.maps.InfoWindow({ position: mapsMouseEvent.latLng });
    //     infoWindow.close();
    //     infoWindow.setContent(place.name);
    //     infoWindow.open(map);

    // });

}