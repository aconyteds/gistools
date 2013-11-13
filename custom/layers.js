define(["dojo/_base/declare", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ArcGISImageServiceLayer", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/FeatureLayer", "esri/layers/KMLLayer", "esri/layers/OpenStreetMapLayer", 
"esri/layers/WMSLayer", "esri/layers/WMTSLayer", "esri/dijit/BasemapLayer", "dojo/topic", "dojo/_base/lang"],
    function(declare, dynamicLayer, imageLayer, tiledLayer, featureLayer, kmlLayer, osmLayer, wmsLayer, wmtsLayer, basemapLayer, topic, lang){
        return declare({
            constructor:function(params){
                lang.mixin(this, params);
            },
            addLayer:function(url)
            {
                
            },
        });
});