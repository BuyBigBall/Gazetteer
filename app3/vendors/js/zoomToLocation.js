if (navigator.geolocation) // Check if this is available in older browsers
    navigator.geolocation.getCurrentPosition(function (position) { // Success callback function
            //console.log(position);
            //const latitude = position.coords.latitude;
            const {
                latitude
            } = position.coords; // Destructuring 
            //const longitude = position.coords.longitude;
            const {
                longitude
            } = position.coords; // Destructuring
            // console.log(latitude, longitude); 
            // console.log(`https://www.google.co.uk/maps/@${latitude},${longitude}`);

            // Set latitude and longitude values dynamically by storing in an array variable. 
            const coords = [latitude, longitude];


            // Creating a marker and a popup and add it to the map
            L
                .marker(coords)
                .addTo(map)
                .bindPopup("<h6 class='text-center'><a href='https://www.google.co.uk/maps/@${latitude},${longitude}' target='_blank'>Your'e Here!</a></h6>")
                .openPopup();

            // Respond to User events

            map.setView(coords, 15);

        },
        function () { // Error callback function
            alert("Could not get your position!");
        })