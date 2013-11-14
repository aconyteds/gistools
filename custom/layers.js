define(["dojo/_base/declare", "custom/imw", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ArcGISImageServiceLayer", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/FeatureLayer", "esri/layers/KMLLayer", 
"esri/layers/OpenStreetMapLayer", "esri/layers/WMSLayer", "esri/layers/WMTSLayer", "dojo/topic", "dojo/_base/lang", "dojo/request/xhr", "dijit/_WidgetBase", "dojo/_base/array"],
function(declare, imw, dynamicLayer, imageLayer, tiledLayer, featureLayer, kmlLayer, osmLayer, wmsLayer, wmtsLayer,  topic, lang, xhr, _widgetBase, array){
    return declare([_widgetBase],{
        layers:[],
        postMixInProperties:function(params){
            lang.mixin(this, params);
        },
        postCreate:function(){
            topic.subscribe("new/Layer", lang.hitch(this,function(url, params, type, source){
                if (type!=="basemap") {
                    var lyr=this.buildLayer(url, params||null, type||null);
                    console.log(lyr);
                    this.map.addLayer(lyr.layer);
                }
                else
                    this.layers.push({layer:url, type:type, params:params, src:source});
            }));
            topic.subscribe("get/Layer/type", lang.hitch(this, function(type){
                var LYRS=array.map(this.layers, function(lyr){
                    if(lyr.type==type)
                        return lyr;
                });
                console.log(LYRS);
                topic.publish("return/Layer/type", LYRS);
            }));
            topic.subscribe("get/Layer/index", lang.hitch(this, function(index){
                var LYRS=this.layers[index];
                topic.publish("return/Layer/index", LYRS);
            }));
        },
        _layerType:function(type){
            switch(type.toLowerCase())
            {
                case "tiled":
                    return tiledLayer;
                case "wms":
                    return wmsLayer;
                case "kml":
                    return kmlLayer;
                case "feature":
                    return featureLayer;
                default:
                    return dynamicLayer;
            }
        },
        _getType:function(url){
            if(url.search("rest/services")!==-1){
                xhr(url+"?f=json", {handleAs:"json"}).then(function(data){
                    if(data.tileInfo)
                        return "tiled";
                    else if (data.type.search("Feature")!==-1)
                        return "feature";
                    else
                        return "dynamic";
                    console.log(data);
                },function(err){
                    console.log(err);
                });
            }
            else if(url.search("?request=GetCapabilities&service=WMS")!==-1){
                return "wms";
            }
        },
        buildLayer:function(url, params, type){
            console.log(arguments);
            if(!type)
                type=this._getType(url);
            this.layers.push({layer:new this._layerType(type)({url:url}, params||null), type:type});
            return imw.top(this.layers);
        }
    });
});