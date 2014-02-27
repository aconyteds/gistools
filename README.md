# Training Plan

**Overview:** This application is meant as a tool to keep skills up to date and learn new technologies. 
First and foremost this is a web based application Utilizing [ESRI](http://www.esri.com/) web technologies to create a "one stop shop", fully customizable, user friendly GIS web interface.

## Technologies

* [Esri JS API][]
* [core][]
* [API Documentation][]
* [node][]
* [LESS][]

## Installation:

To install this application, you need a server (Apache, IIS, etc.). Currently Java is not needed for this application to run, but that may change in the future. Simply download the Zip and extract to the desired location on your server.
Modify ./config/config.json for a truly customized experience.

## Development
**Hopes and Dreams:** Here is a list of what I hope to incorporate.
* Web Sockets
* Routing
* Automatic Layer Loading
* Advanced Search Capability
* MCV based upon user, machine, device
* Database integration
* Mobile Optimization
* Incorporate portal functionality

### Node.js

    npm install
    node server [-port xxxx]
    # open browser to http://localhost:xxxx

## Tasks:
1. [x] CSS selection in menu
2. [x] Windows interface
3. [x] Clock
4. [x] Map config menu
5. [x] Overview Map with Basemap Sync
6. [] dojox/FloatingPane maximize/restore button
7. [] Basemap Gallery
8. [x] Layer loader
9. [] Table of contents
10. [x] Dynamic Layer Loading
11. [x] Loading Bar for map pan
12. [] Routing application
13. [] Search Bar
14. [] Identity manager for secured layers
15. [] Figure out how to use CORS better

## Known Bugs:
- **11.19.13** dojox/FloatingPane docking does not work with current version of ESRI js API becuse of typo in dock code
- ~~**11.19.13** Sometimes when a floating pane is opened and the window is resized the floating pane dissapears.~~ 
    - **Fixed 11.20.13:** by modifying the resize function in a custom widget
- **12.14.13** Layers cannot be loaded via HTTP when hosted on cloud 9
- **12.14.13** Basemap Gallery is not working due to http/https issues

### Improvements:
- Loading bar should have a scrolling background to indicate it is still doing something on longer loads

[core]: https://github.com/dojo/dojo
[API Documentation]: http://dojotoolkit.org/api/
[ESRI JS API]: https://developers.arcgis.com/en/javascript/jsapi/
[node]: http://nodejs.org/
[LESS]:http://lesscss.org/