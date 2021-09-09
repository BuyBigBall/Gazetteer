# Gazetteer
> <p align="center">Check Upgraded Gazetteer Version Here: <a href="https://github.com/sasigit7/TheGazetteer" alt="The Gazetteer"/>The Gazetteer</a></p>
</p>

## Description: 
> This application is envisaged as a “mobile first“ website that will operate equally well on desktop computers. 
> It will provide profiling for all countries through the presentation of demographic, climatic, geographical and other data. 
> This application will make extensive use of third party API's. 

## Workflow:  
> I Used PHP enabled Web server, called XAMPP to develop the application on my Local machine, Macbook.  
> I then deployed the application Live publicly on IONOS Web Hosting Service. 
> <p align="center">  Watch Project Demo Video By Clicking Below Image: 
[![Watch the Demo](https://i.imgur.com/BtaPZc7.png)](https://youtu.be/nLbIaw5qvDU)
  </p>
<p align="center"> Live Link: <a href="https://thegazetteer.co.uk/" alt="Gazetteer"/>Gazetteer</a></p>

## Design & Development Life Cycle:
<img src="https://user-images.githubusercontent.com/24832458/103209170-56c97800-48fa-11eb-8747-54d127abc90e.png" width="30%"></img> <img src="https://user-images.githubusercontent.com/24832458/103209187-6052e000-48fa-11eb-8135-7e9c33d4cf62.png" width="30%"></img> <img src="https://user-images.githubusercontent.com/24832458/103209196-6779ee00-48fa-11eb-802c-682890b90559.png" width="30%"></img> <img src="https://user-images.githubusercontent.com/24832458/103209203-6b0d7500-48fa-11eb-8a7e-6a943e5d79ec.png" width="30%"></img> <img src="https://user-images.githubusercontent.com/24832458/103209211-6ea0fc00-48fa-11eb-8251-d86edd65e057.png" width="30%"></img> <img src="https://user-images.githubusercontent.com/24832458/103209218-72cd1980-48fa-11eb-840e-cbd8cc4c1723.png" width="30%"></img> 

## Technologies & Tools I used for this project 🛠️
<p> Front-end -> HTML, CSS, BootStrap, Javascript, JQuery, Leaflet </p>
<p> Web Development Technique -> AJAX </p>
<p> Back-end -> PHP (Used To return Only Data) </p>
<p> Third Party Free API's 
<ul>
  <li><a href="https://restcountries.eu">List Of Countries and their demographics</a></li>
  <li><a href="https://corona.imao.ninja">Covid</a></li>
  <li><a href="https://openweathermap.org/api">Weather</a></li>
  <li><a href="https://mediastack.com">Global News</a></li>
</ul>
 </p>
<p> Free Logo Maker -> <a href="https://freelogomkr.com">Logo</a></p>
<p> Free Favicons -> <a href="https://favicon.io/">Favicon</a> </p>
<p> Free Icons <a href="https://fontawesome.com">Fontawesome</a></p>
<p> Minified CSS & JS -> <a href="https://www.minifier.org/">Minify</a> </p>
<p> Domain Registration, Web Hosting at -> <a href="https://www.ionos.co.uk/">IONOS</a></p>

## How I solved one of many errors I encountered during application development 
On Local machine, On loading, the application displayed the position of the user device on the map but once I deployed live on the domain, I encountered the following problems. I almost spent a week on this particular issue but managed to find a solution at the end. 
 ### Issue Log: 
<p> A popup window with an error message saying: Could not get your position on http://thegazetteer.co.uk/ </p>
<p> Found a similar issue on Stackoverflow: https://stackoverflow.com/questions/37192827/getcurrentposition-doesnt-work-once-deployed </p>
<p> Found out Google Chrome is no longer supports geolocation on insecure origins. </p>
<p> So, I did further research and found this https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins and came to know that I must use HTTPS:// if I want to use geolocation. </p>
<p> Console Warning: [Deprecation] getCurrentPosition() and watchPosition() no longer work on insecure origins. To use this feature, you should consider switching your application to a secure origin, such as HTTPS. See https://goo.gl/rStTGz for more details. </p>
<p> So, I secured the website with SSL certificate:  https://thegazetteer.co.uk/,   </p>
<p> But it threw another error on the console - "Mixed Content" warnings occur when an HTTPS page is asked to load a resource over HTTP </p>
<p> That’s because I used http://maps.stamen.com/js/tile.stamen.js?v1.3.0 to load map which Is unsecured and I can’t use it on https connection. </p>
<p> So, I refer http://maps.stamen.com/#terrain/12/37.7706/-122.3782 documentation and I found the following information at the bottom of the site, </p>
<p> SSL </p>
<p> If you'd like to display these map tiles on a website that requires HTTPS, use our tile SSL endpoint by replacing 
http://tile.stamen.com  with https://stamen-tiles.a.ssl.fastly.net  => Doesn't work </p>
<p> Multiple subdomains can be also be used: https://stamen-tiles-{S}.a.ssl.fastly.net => Doesn't work </p>
<p> JavaScript can be loaded from https://stamen-maps.a.ssl.fastly.net/js/tile.stamen.js  => Worked but doesn't render the names of the geographical areas on the map. </p>
<p> If you need protocol-agnostic URLs, use   //stamen-tiles-{s}.a.ssl.fastly.net/  as that endpoint will work for both SSL and non-SSL connections. => Don’t know how to use this </p>
<p> I carried on looking for solution and finally found this https://github.com/stamen/maps.stamen.com/issues/120 </p>
<p> One developer suggested to download the actual file from https://raw.githubusercontent.com/stamen/maps.stamen.com/master/js/tile.stamen.js and put it in the project folder. 
<p> BOOM!!! Success.......Finally. </p>

## References I used 🙏🙏🙏
- <a href="https://www.google.com/">Google</a>





