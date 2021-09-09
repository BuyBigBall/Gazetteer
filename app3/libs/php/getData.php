<?php

// must allow_url_fopen=1 in php.ini
if( ! function_exists("file_get_contents"))
{
	print("<script>alert('allow_url_fopen failed');</script>");
	exit;
}

//@file_get_contents = get_other_url_content
function get_other_url_content($url)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$data = curl_exec($ch);
	//print($url . "\n");
	//print($data); exit;
	curl_close($ch);
	return $data;	
}

$country = $_REQUEST['country'];
$capital = $_REQUEST['capital'];


// //Getting info from restcountries api
// $data = get_other_url_content("https://restcountries.eu/rest/v2/alpha/$country");

// //Attaching data to PHP variables
// $countryHtml = "";
// if($data)
// {
// 	$data = json_decode($data, true);
// 	$country_name = $data['name'];
// 	$capital = $data['capital'];
// 	$population = $data['population'];
// 	$flag = $data['flag'];
// 	$currency = $data['currencies'][0]['name'];
	
// 	//Setting data/html for Modal info	
// 	$countryHtml = "<div class='card text-white bg-info m-10' style='max-width: 100vw;height:78vh'><div class='card-header'><h2>$country_name</h2></div><div class='card-body p-0'><p class='card-text'>";  
// 	$countryHtml .= "<table class='table table-borderless text-white'>";  
// 	$countryHtml .= "<tr><th>Capital</th><td>$capital</td></tr>";  
// 	$countryHtml .= "<tr><th>Population</th><td>$population</td></tr>";  
// 	$countryHtml .= "<tr><th>Flag</th><td><img src='$flag' style='height:50px'></td></tr>";
// 	$countryHtml .= "<tr><th>Currency</th><td>$currency</td></tr>";  
// 	$countryHtml .= "<tr><th>Wikipedia</th><td><a href='https://en.wikipedia.org/wiki/$country' target='#' class='text-dark'>$country</a></td></tr>";  
	  
// 	$countryHtml .= "</table>";
	
// 	$countryHtml .= "<div class='btn-group btn-group-sm' role='group' aria-label='Basic example'><button type='button' class='btn btn-danger m-1' data-toggle='modal' data-target='#coronoModal'><i class='fas fa-shield-virus'></i> Covid</button><button type='button' class='btn btn-success m-1' data-toggle='modal' data-target='#weatherModal'><i class='fas fa-cloud-sun'></i> Weather</button><button type='button' class='btn btn-warning m-1' data-toggle='modal' data-target='#newsModal'> <i class='far fa-newspaper'></i> News</button></div></div></div>";  
// }

// //Getting Covid Info
// $coronaHtml = "";
// $coronoData = get_other_url_content("https://corona.lmao.ninja/v2/countries/$country?yesterday&strict&query");
// if($coronoData)
// {
// 	$coronoData = json_decode($coronoData,true);
// 	$total_cases =  $coronoData['cases'];
// 	$active =  $coronoData['active'];
// 	$recovered =  $coronoData['recovered'];
// 	$deaths =  $coronoData['deaths'];
// 	$todayCases =  $coronoData['todayCases'];
// 	$todayRecovered =  $coronoData['todayRecovered'];
// 	$todayDeaths =  $coronoData['todayDeaths'];
// 	$activePerOneMillion =  $coronoData['activePerOneMillion'];
// 	$recoveredPerOneMillion =  $coronoData['recoveredPerOneMillion'];
	
// 	//Setting html for Covid Modal
// 	$coronaHtml = "<table class='table table-borderless' style=font-size:2vh>";
// 	$coronaHtml .= "<tr><th>Total cases</th><td>$total_cases</td></tr>";  
// 	$coronaHtml .= "<tr><th>Active</th><td>$active</td></tr>";  
// 	$coronaHtml .= "<tr><th>Recovered</th><td>$recovered</td></tr>";  
// 	$coronaHtml .= "<tr><th>Deaths</th><td>$deaths</td></tr>";  
// 	$coronaHtml .= "<tr><th>Today cases</th><td>$todayCases</td></tr>";  
// 	$coronaHtml .= "<tr><th>Today Recovered</th><td>$todayRecovered</td></tr>";  
// 	$coronaHtml .= "<tr><th>Today Deaths</th><td>$todayDeaths</td></tr>";  
// 	$coronaHtml .= "<tr><th>Active per Million</th><td>$activePerOneMillion</td></tr>";  
// 	$coronaHtml .= "<tr><th>Recovered per Million</th><td>$recoveredPerOneMillion</td></tr>";  
// 	$coronaHtml .= "</table>";  
// }

//Getting Weather Info
$result = array();
$weatherData = get_other_url_content("http://api.openweathermap.org/data/2.5/weather?q=$capital,$country&APPID=4264d96a45968735df7a8073aa680813");
if($weatherData)
{
	$weatherData = json_decode($weatherData, true);
	$average_temp = $weatherData['main']['temp'].' kelvin';
	$temp_min = $weatherData['main']['temp_min'].' kelvin';
	$temp_max = $weatherData['main']['temp_max'].' kelvin';
	$pressure = $weatherData['main']['pressure'].' hPa';
	$humidity = $weatherData['main']['humidity'].' %';
	$cloud_percentage = $weatherData['clouds']['all'].' %';
	$wind_speed = $weatherData['wind']['speed'].' meter/sec';
	$wind_degree = $weatherData['wind']['deg'].' degrees';
	
	$result['weather'] = [
		'average_temp'=>$average_temp,
		'temp_min'=>$temp_min,
		'temp_max'=>$temp_max,
		'pressure'=>$pressure,
		'humidity'=>$humidity,
		'cloud_percentage'=>$cloud_percentage,
		'wind_speed'=>$wind_speed,
		'wind_degree'=>$wind_degree,
	];

	//Setting html for Weather Modal
	// $weatherHtml = "<table class='table table-borderless' style=font-size:2vh>";
	// $weatherHtml .= "<tr><th>Average Temperature</th><td>$average_temp</td></tr>";  
	// $weatherHtml .= "<tr><th>Max-Temperature</th><td>$temp_min</td></tr>";  
	// $weatherHtml .= "<tr><th>Min-Temperature</th><td>$temp_max</td></tr>";  
	// $weatherHtml .= "<tr><th>Pressure</th><td>$pressure</td></tr>";  
	// $weatherHtml .= "<tr><th>Humidity cases</th><td>$humidity</td></tr>";  
	// $weatherHtml .= "<tr><th>Cloud Percentage</th><td>$cloud_percentage</td></tr>";  
	// $weatherHtml .= "<tr><th>Wind Speed</th><td>$wind_speed</td></tr>";  
	// $weatherHtml .= "<tr><th>Wind Degrees</th><td>$wind_degree</td></tr>"; 
	// $weatherHtml .= "</table>";  
}

// Getting News Info 
{

	$newsData = get_other_url_content("http://api.mediastack.com/v1/news?country=$country&access_key=529740f259ac5f9a3db2e50100c43d28");
	//$newsHtml = "";
	if($newsData)
	{
		$newsData = json_decode($newsData, true);
		//$newsHtml = "<table class='table table-borderless' style=font-size:2vh>";
		$newsData = $newsData['data'];
		for ($row = 0; $row < 5; $row++) {
				$data = $newsData[$row]['title'];
				$url = $newsData[$row]['url'];
				$result['news'][] = [
					'title'=>$data,
					'url'=>$url,
				];
				//$newsHtml .= "<tr><td><i class='far fa-newspaper'></i> <a href='$url' target='#' class='text-primary'>$data</a></td></tr>";
			}
		 //$newsHtml .= "</table>";  
	}
}
//echo json_encode(array("countryHtml" => $countryHtml, "covid_data" => $coronaHtml,  "weather_data" => $weatherHtml, "news_data" => $newsHtml));

//Sending data to Javascript 
echo json_encode($result);