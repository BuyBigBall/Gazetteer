#Gazetteer
Check Upgraded Gazetteer Version Here: The Gazetteer

Description:
This application is envisaged as a “mobile first“ website that will operate equally well on desktop computers. It will provide profiling for all countries through the presentation of demographic, climatic, geographical and other data. This application will make extensive use of third party API's.

Workflow:
I Used PHP enabled Web server, called XAMPP to develop the application on my Local machine, Macbook.
I then deployed the application Live publicly on IONOS Web Hosting Service.

Watch Project Demo Video By Clicking Below Image:

Watch the Demo

Live Link: Gazetteer

Design & Development Life Cycle:
     

Technologies & Tools I used for this project 🛠️
Front-end -> HTML, CSS, BootStrap, Javascript, JQuery, Leaflet

Web Development Technique -> AJAX

Back-end -> PHP (Used To return Only Data)

Third Party Free API's

List Of Countries and their demographics
Covid
Weather
Global News
Free Logo Maker -> Logo

Free Favicons -> Favicon

Free Icons Fontawesome

Minified CSS & JS -> Minify

Domain Registration, Web Hosting at -> IONOS

How I solved one of many errors I encountered during application development
On Local machine, On loading, the application displayed the position of the user device on the map but once I deployed live on the domain, I encountered the following problems. I almost spent a week on this particular issue but managed to find a solution at the end.

Issue Log:
A popup window with an error message saying: Could not get your position on http://thegazetteer.co.uk/

Found a similar issue on Stackoverflow: https://stackoverflow.com/questions/37192827/getcurrentposition-doesnt-work-once-deployed

Found out Google Chrome is no longer supports geolocation on insecure origins.

So, I did further research and found this https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins and came to know that I must use HTTPS:// if I want to use geolocation.

Console Warning: [Deprecation] getCurrentPosition() and watchPosition() no longer work on insecure origins. To use this feature, you should consider switching your application to a secure origin, such as HTTPS. See https://goo.gl/rStTGz for more details.

So, I secured the website with SSL certificate: https://thegazetteer.co.uk/,

But it threw another error on the console - "Mixed Content" warnings occur when an HTTPS page is asked to load a resource over HTTP

That’s because I used http://maps.stamen.com/js/tile.stamen.js?v1.3.0 to load map which Is unsecured and I can’t use it on https connection.

So, I refer http://maps.stamen.com/#terrain/12/37.7706/-122.3782 documentation and I found the following information at the bottom of the site,

SSL

If you'd like to display these map tiles on a website that requires HTTPS, use our tile SSL endpoint by replacing  http://tile.stamen.com  with https://stamen-tiles.a.ssl.fastly.net => Doesn't work

Multiple subdomains can be also be used: https://stamen-tiles-{S}.a.ssl.fastly.net => Doesn't work

JavaScript can be loaded from https://stamen-maps.a.ssl.fastly.net/js/tile.stamen.js => Worked but doesn't render the names of the geographical areas on the map.

If you need protocol-agnostic URLs, use //stamen-tiles-{s}.a.ssl.fastly.net/ as that endpoint will work for both SSL and non-SSL connections. => Don’t know how to use this

I carried on looking for solution and finally found this https://github.com/stamen/maps.stamen.com/issues/120

One developer suggested to download the actual file from https://raw.githubusercontent.com/stamen/maps.stamen.com/master/js/tile.stamen.js and put it in the project folder.

BOOM!!! Success.......Finally.

References I used 🙏🙏🙏
Google
