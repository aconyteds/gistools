# Training Plan

**Overview:** This application is meant as a toll to keep skills up to date and learn new technologies. First and foremost this is a GIS application. Utilizing [ESRI][] technologies to build a "one stop shop" application.

## Technologies

* [Esri JS API][]
* [core][]
* [API Documentation][]

## Development

**Hopes and Dreams:** Here is a list of what I hope to incorporate.
* Node.js
* Web Sockets
* Routing
* Automatic Layer Loading
* Advanced Search Capability
* MCV based upon user, machine, device
* Database integration
* Mobile Optimization
* Incorporate portal functionality

## Completed:
* CSS selection in menu
* Windows interface built
* Clock
* Map config menu
* Overview Map with Basemap Sync

### TODO:
* dojox/FloatingPane dock fix with newer versions of Dojo
* Basemap Gallery
* Layer loader
* Table of contents
* Dynamic Layer Loading
* Loading Bar for map pan
* Build Routing application
* Search Bar

### Known Bugs:
* dojox/FloatingPane docking does not work with current version of ESRI js API becuse of typo in dock code
* Sometimes when a floating pane is opened and the window is resized the floating pane dissapears
* 


[ESRI]: http://www.esri.com/
[core]: https://github.com/dojo/dojo
[API Documentation]: http://dojotoolkit.org/api/
[ESRI JS API]: https://developers.arcgis.com/en/javascript/jsapi/