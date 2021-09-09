//############### ajax function definitions ###################
var ajax = {};
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }

    xhr.setRequestHeader('crossDomain', true);
    // xhr.setRequestHeader('Authorization', "Bearer " + accessToken);
    // xhr.setRequestHeader('Accept', "application/json");
    return xhr;
};

ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    var x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

ajax.get = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), async)
};



//############### Load Map function definitions ###################
var CountryGeos = [];
ajax.get('vendors/json/countryBorders.geo.json', {}, function(data) {
    data = JSON.parse(data);
    CountryGeos = data.features;
    for(i=0; i<data.features.length; i++)
    {
      obj = data.features[i];
      district_boundary.addData(obj); //adding each feature to district_boundary
      countries_tab +=
        '<a href="#" code="'+obj.properties.iso_a2 +'" >' +
        obj.properties.name + "</a>"; // adding countries in the list
    }
    
    countries_tab += "</tbody></table>";
    document.getElementById('country_list').innerHTML = countries_tab;
    addCountryTdHandlers();

    addCountryMarkerClusters();
    district_boundary.setStyle(polystyle); //setting style for country boundries
});


//Enabling map
let map = L.map("map", {
  attributionControl: false,
  fullscreenControl: {
      pseudoFullscreen: false
  }
}).setView([0, 0], 1.5);


//Adding basemap
let layer = new L.StamenTileLayer("toner");
map.addLayer(layer);


//---> added for map single click
map.options.singleClickTimeout = 250;
map.on('singleclick',function ( e ) {
  var mapurl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+e.latlng.lat + "," + e.latlng.lng+"&key=AIzaSyD6Cx1cmZX5lyQON7PCLwJLK36QpLI0SUo";
  ajax.get(mapurl, {}, function(data) {
      data = JSON.parse(data);
      //console.log(data);
      bFound = false;
      for( i=0; i<data.results.length; i++)
      {
        temp = data.results[i];
        for( j=0; j<temp.address_components.length; j++)
        {
          //console.log(temp.address_components[j]);
          if( temp.address_components[j].types[0]=='country' )
          {
            zoomTo(temp.address_components[j].short_name);            
            L.popup().setLatLng( e.latlng )
            .setContent( '<p>You are <code>clicked</code> at ' + temp.address_components[j].long_name )
            .openOn( map );
            bFound = true;
            break;
          }
        }
        if(bFound) return;
      }
  });

} );

var group = L.featureGroup().addTo(map);
var circle = L.circle([51.505, -0.09], 1000).addTo(group).on('singleclick', function(ev) {
	L.DomEvent.stop(ev);
	L.popup().setLatLng( ev.latlng )
		.setContent( '<p>Circle <code>singleclick</code> at ' + ev.latlng )
		.openOn( map );
});
circle.options.singleClickTimeout = 250;
//<---

//Declaring countries table
let countries_tab = "";

//Declaring country_boundry
let district_boundary = new L.geoJson();
district_boundary.addTo(map); //adding country_boundry to map


//Define style
function polystyle(feature) {
  return {
    fillColor: "green",
    weight: 2,
    opacity: 1,
    color: "white", //Outline color
    fillOpacity: 0.7,
  };
}


// Description: A Leaflet control that search markers/features location by custom property.
function getSelectedBoundsCenterLatLng() {
  var bounds = map.getBounds(),
    southWest = bounds.getSouthWest(),
    northEast = bounds.getNorthEast(),
    lngSpan = northEast.lng - southWest.lng,
    latSpan = northEast.lat - southWest.lat;

  return new L.LatLng(
      southWest.lat + latSpan * Math.random(),
      southWest.lng + lngSpan * Math.random());
}


//Setting and adding highlight info
let highlight_boundary = new L.geoJson();
highlight_boundary.addTo(map);

//Higlight style
function highstyle(feature) {
  return {
    fillColor: "blue",
    weight: 2,
    opacity: 1,
    color: "white", //Outline color
    fillOpacity: 0.7,
  };
}

//Making to zoom on a country
function zoomTo(iso) {
  country = iso; //$(e).html();
  district_boundary.eachLayer(function (layer) {
    if (layer.feature.properties.iso_a2 == country) {
      highlight_boundary.clearLayers();
      highlight_boundary.addData(layer.feature);
      map.fitBounds(layer.getBounds()); //zoom to country
      highlight_boundary.setStyle(highstyle); // make highlight
      LoadCountryInfo(country); //loading country info
    }
  });
}

//Country Marker Clustering
function addCountryMarkerClusters()
{
  for(i=0; i<CountryGeos.length; i++)
  {
    countrycode = CountryGeos[i].properties.iso_a2;
    countrynum = CountryGeos[i].properties.iso_n3;
    countryname = CountryGeos[i].properties.name;

    polygons = CountryGeos[i].geometry.coordinates;
    var markers = L.markerClusterGroup();
    if(typeof polygons[i] == 'array')
    for(j=0; j<polygons[i].length; j++)
    {
      if(typeof polygons[i][j] == 'array')
      for(k=0; k<polygons[i][j].length; k++)
      {
        if(typeof polygons[i][j][k] == 'array')
        for(l=0; l<polygons[i][j][k].length; l++)
        {
          if(typeof polygons[i][j][k][l] == 'array')
          for(m=0; m<polygons[i][j][k][l].length; m++)
          {
            if(typeof polygons[i][j][k][l][m] == 'array')
            for(n=0; n<polygons[i][j][k][m].length; n++)
            {
              if(typeof polygons[i][j][k][l][m][n] != 'array')
              {
                var a = polygons[i][j][k][l][m];
                var marker = L.marker(new L.LatLng(a[0], a[1]), {});
                markers.addLayer(marker);
                break;
              }
            }
            else
            {
              var a = polygons[i][j][k][l];
              var marker = L.marker(new L.LatLng(a[0], a[1]), {});
              markers.addLayer(marker);
              break;
            }
          }
          else
          {
            var a = polygons[i][j][k];
            var marker = L.marker(new L.LatLng(a[0], a[1]), {});
            markers.addLayer(marker);
            break;
          }
        }
        else
        {
          var a = polygons[i][j];
          var marker = L.marker(new L.LatLng(a[0], a[1]), {});
          markers.addLayer(marker);
          break;
        }
      }
    }
    map.addLayer(markers);
  }
}


//############### Responsive and EventHandler function definitions ###################
var is_smal_size = 768; // screen size = 768px
var is_mobile = false;
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
  // true for mobile device
  is_mobile = true;
  document.getElementById("country_list").style.height = "69vh";
}else{
  // false for not mobile device
  is_mobile = false;
}

// for select dropdown
function ShowDropDownCountry() {
  if(window.screen.width < is_smal_size && is_mobile)
    document.getElementById("country_list").classList.toggle("show");
}
// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.glowing-btn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}





//############## map controller function definition ##############################
// Description: A simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems
L.control.scale().addTo(map);

// Description: A basic zoom control with two buttons (zoom in and zoom out)
// Source: https://leafletjs.com/reference-1.7.1.html#control-zoom
// Implementation: Setting Zoom control (+, -) on the top right of the map
map.zoomControl.setPosition("topright");


// Source:  https://github.com/stefanocudini/leaflet-search
let controlSearch = new L.Control.Search({
  position: "topleft",
  layer: district_boundary, // name of the layer
  initial: true, // search elements only by initial text
  marker: false, // false for hide
  textPlaceholder: "Search...",
  propertyName: "name",
});

// This function will execute, when a country is searched and found on control search bar
controlSearch.on("search:locationfound", function (e) {
  district_boundary.eachLayer(function (layer) {
    if (layer.feature.properties.name == e.text) {
      let iso_a2 = layer.feature.properties.iso_a2;
      highlight_boundary.clearLayers(); //Clears previously selected country
      highlight_boundary.addData(layer.feature); //Adding newly selected country
      map.fitBounds(layer.getBounds()); //Zooming in to country selected
      highlight_boundary.setStyle(highstyle); //Setting style to selected one
      LoadCountryInfo(iso_a2); //Calling LoadCountryInfo function from below to get the country's info
    }
  });
});

// Implementation: Added Search control bar for searching countries on the top left of the map
map.addControl(controlSearch);

//Ajax for loading the country info


// ######### ---> added code 0817
function LoadCountryInfo(name) {
  getCoronaHtml(name);
  getCountryHtml(name);
}

function addDropdownClickHandler()
{
  var dropClickHndler = function() {
    ShowDropDownCountry();
  }
  document.getElementById('dropdowncountry').onclick = dropClickHndler;
  
}
addDropdownClickHandler();

function addCountryTdHandlers() {
  var table = document.getElementById("country_list");
  var cols = table.getElementsByTagName("a");
    for (j = 0; j < cols.length; j++) {
      var currentTd = cols[j];
      var createClickHandler = function(currentTd) {
        if(!currentTd || currentTd==undefined || currentTd=='') return;
          return function() {
          zoomTo(currentTd.getAttribute('code'));          
         };
      };
      currentTd.onclick = createClickHandler(currentTd);
    }
  // }
}


function getCountryHtml(country)
{
  _url = "https://restcountries.eu/rest/v2/alpha/" + country;

  ajax.get(_url, {'country':country}, function(response) {
      try{
          if(response.length>3)
          {
            var output = JSON.parse(response);

            country_name = output.name;
            capital = output.capital;
            population = output.population;
            flag = output.flag;
            currency = output.currencies[0].name;

            countryHtml  = "";
            countryHtml += "<div class='card text-white bg-info m-10' style='max-width: 100vw;height:78vh'><div class='card-header'><h2>"+country_name+"</h2></div><div class='card-body p-0'><p class='card-text'>";  
            countryHtml += "<table class='table table-borderless text-white'>";  
            countryHtml += "<tr><th>Capital</th><td>"+capital+"</td></tr>";  
            countryHtml += "<tr><th>Population</th><td>"+population+"</td></tr>";  
            countryHtml += "<tr><th>Flag</th><td><img src='"+flag+"' style='height:50px'></td></tr>";
            countryHtml += "<tr><th>Currency</th><td>"+currency+"</td></tr>";  
            countryHtml += "<tr><th>Wikipedia</th><td><a href='https://en.wikipedia.org/wiki/"+country+"' target='#' class='text-dark'>"+country+"</a></td></tr>";  
            countryHtml += "</table>";
            countryHtml += "<div class='btn-group btn-group-sm' role='group' aria-label='Basic example'><button type='button' class='btn btn-danger m-1' data-toggle='modal' data-target='#coronoModal'><i class='fas fa-shield-virus'></i> Covid</button><button type='button' class='btn btn-success m-1' data-toggle='modal' data-target='#weatherModal'><i class='fas fa-cloud-sun'></i> Weather</button><button type='button' class='btn btn-warning m-1' data-toggle='modal' data-target='#newsModal'> <i class='far fa-newspaper'></i> News</button></div></div></div>";  
            document.getElementById("country_info").innerHTML = countryHtml;

            getWeatherAndNews(country, capital);
          }
          else{
            console.log( "Response by restcountries.eu is empty");
          }
        }
        catch(exception)
        {
          console.log(exception);
        }
  });

}


function getCoronaHtml(country)
{
  _url = "https://corona.lmao.ninja/v2/countries/"+country+"?yesterday&strict&query";

  ajax.get(_url, {'country':country}, function(response) {
      try{
          if(response.length>3)
          {
            var output = JSON.parse(response);
            total_cases =  output.cases;
            active =  output.active;
            recovered =  output.recovered;
            deaths =  output.deaths;
            todayCases =  output.todayCases;
            todayRecovered =  output.todayRecovered;
            todayDeaths =  output.todayDeaths;
            activePerOneMillion =  output.activePerOneMillion;
            recoveredPerOneMillion =  output.recoveredPerOneMillion;

            coronaHtml  = "";
            coronaHtml += "<table class='table table-borderless' style=font-size:2vh>";
            coronaHtml += "<tr><th>Total cases</th><td>"+total_cases+"</td></tr>";  
            coronaHtml += "<tr><th>Active</th><td>"+active+"</td></tr>";  
            coronaHtml += "<tr><th>Recovered</th><td>"+recovered+"</td></tr>";  
            coronaHtml += "<tr><th>Deaths</th><td>"+deaths+"</td></tr>";  
            coronaHtml += "<tr><th>Today cases</th><td>"+todayCases+"</td></tr>";  
            coronaHtml += "<tr><th>Today Recovered</th><td>"+todayRecovered+"</td></tr>";  
            coronaHtml += "<tr><th>Today Deaths</th><td>"+todayDeaths+"</td></tr>";  
            coronaHtml += "<tr><th>Active per Million</th><td>"+activePerOneMillion+"</td></tr>";  
            coronaHtml += "<tr><th>Recovered per Million</th><td>"+recoveredPerOneMillion+"</td></tr>";  
            coronaHtml += "</table>";  

            document.getElementById("covid_data").innerHTML = coronaHtml; // Sending data to Covid Modal
          }
          else{
            console.log( "Response by restcountries.eu is empty");
          }
        }
        catch(exception)
        {
          console.log(exception);
        }
  });

}

function getWeatherAndNews(country, capital)
{
  //_url = "http://api.openweathermap.org/data/2.5/weather?q="+capital+","+country+"&APPID=4264d96a45968735df7a8073aa680813";
  ajax.post('libs/php/getData.php', {'country':country, 'capital' : capital}, function(response) {
    try{
          if(response.length>0)
          {
            var output = JSON.parse(response);

            weatherHtml = "";
            if(output.weather)
            {
              weatherHtml += "<table class='table table-borderless' style=font-size:2vh>";
              weatherHtml += "<tr><th>Average Temperature</th><td>"+output.weather.average_temp+"</td></tr>";  
              weatherHtml += "<tr><th>Max-Temperature</th><td>"+output.weather.temp_min+"</td></tr>";  
              weatherHtml += "<tr><th>Min-Temperature</th><td>"+output.weather.temp_max+"</td></tr>";  
              weatherHtml += "<tr><th>Pressure</th><td>"+output.weather.pressure+"</td></tr>";  
              weatherHtml += "<tr><th>Humidity cases</th><td>"+output.weather.humidity+"</td></tr>";  
              weatherHtml += "<tr><th>Cloud Percentage</th><td>"+output.weather.cloud_percentage+"</td></tr>";  
              weatherHtml += "<tr><th>Wind Speed</th><td>"+output.weather.wind_speed+"</td></tr>";  
              weatherHtml += "<tr><th>Wind Degrees</th><td>"+output.weather.wind_degree+"</td></tr>"; 
              weatherHtml += "</table>";  
  
              document.getElementById("weather_data").innerHTML = weatherHtml; // Sending data to Weather Modal
            }

            newsHtml = "";
            if(output.news)
            {
              newsHtml = "<table class='table table-borderless' style=font-size:2vh>";
              for(i=0; i<output.news.length; i++)
              {
                newsData = output.news[i];
                data = newsData.title;
                url = newsData.url;
                newsHtml += "<tr><td><i class='far fa-newspaper'></i> <a href='"+url+"' target='#' class='text-primary'>"+data+"</a></td></tr>";
              }
              newsHtml += "</table>";  
              document.getElementById("news_data").innerHTML = newsHtml; // Sending data to News Modal


            }  
            // document.getElementById("news_data").innerHTML = output.news_data; // Sending data to News Modal
          }
          else{
            console.log( "Response is empty");
          }
        }
        catch(exception)
        {
          console.log('response = ' + response);
          console.log(exception);
        }
  });
  
}

document.getElementById('copyright').innerHTML = document.getElementById('copyright').innerHTML + new Date().getFullYear();


