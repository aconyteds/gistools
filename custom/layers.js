define(["dojo/_base/declare", "custom/imw", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ArcGISImageServiceLayer", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/FeatureLayer", "esri/layers/KMLLayer", 
"esri/layers/OpenStreetMapLayer", "esri/layers/WMSLayer", "esri/layers/WMTSLayer", "dojo/topic", "dojo/_base/lang", "dojo/request/xhr", "dijit/_WidgetBase", "dojo/_base/array", "dojo/Deferred","esri/request", "dojo/promise/all",
"dojo/on"],
function(declare, imw, dynamicLayer, imageLayer, tiledLayer, featureLayer, kmlLayer, osmLayer, wmsLayer, wmtsLayer,  topic, lang, xhr, _widgetBase, array, Deferred, esriRequest, all, on){
    return declare([_widgetBase],{
        layers:[],
        postMixInProperties:function(params){
            lang.mixin(this, params);
        },
        postCreate:function(){
            on(this.params.map, "layer-add", function(layer){
                topic.publish("map/Layer/add", layer.layer);
    		});
    		on(this.params.map, "layer-remove", function(layer){
                topic.publish("map/Layer/remove", layer.layer);
    		});
    		on(this.params.map, "update-start", function(){
                topic.publish("map/update/start", this);
    		});
    		on(this.params.map, "update-end", function(){
                topic.publish("map/update/end", this);
    		});
            topic.subscribe("new/Layer", lang.hitch(this, function(url, params, type, source){
                if (type!=="basemap") {
                    this.buildLayer(url, params||null, type||null);
                }
                else
                {
                    this.layers.push({layer:url, type:type, params:params, src:source});
                    topic.publish("new/Basemap", imw.top(this.layers));
                }
            }));
            topic.subscribe("get/Layer/type", lang.hitch(this, function(type){
                var LYRS=array.map(this.layers, function(lyr){
                    if(lyr.type==type)
                        return lyr;
                });
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
                case "image":
                    return imageLayer;
                default:
                    return dynamicLayer;
            }
        },
        _retrieveServiceJSON:function(serviceURL) {
                var svcJSONdeferred, svcReq;
                svcJSONdeferred = new Deferred();
        
                svcReq = new esriRequest({
                    url: serviceURL, 
                    content: {f:'pjson'},
                    callbackParamName: 'callback',
                });
        
                svcReq.then(function (results){
                    svcJSONdeferred.resolve(results);
                });
        
                return svcJSONdeferred.promise;
        },
        _getType:function(result){
            var type="dynamic";
            //console.log(result);
            if(result.url.search("rest/services")!==-1){//ESRI REST service types
                if ((result.type && result.type.search("Feature Layer")!==-1) || result.url.search("FeatureServer")!==-1)
                    type="feature";
                else if((result.serviceDataType && result.serviceDataType.search("Image")!==-1) || result.url.search("ImageServer")!==-1)
                    type="image";
                else if(result.singleFusedMapCache)
                    type="tiled";
            }
            else if(result.url.search("?request=GetCapabilities&service=WMS")!==-1){//WMS Service Types pulls from SOAP via AGS
                type="wms";
            }
            return type;
        },
        buildLayer:function(url, params, type){
            if(!type){
                all([this._retrieveServiceJSON(url)]).then(lang.hitch(this,function(result){
                    lang.mixin(result[0], {url:url});
                    type=this._getType(result[0]);
                    //console.log(type);
                    this.layers.push({layer:new this._layerType(type)(url, params||null), type:type});
                    this.map.addLayer(imw.top(this.layers).layer);
                }));
            }
            else{//all needed attributes are known, create layer and attach to map
                this.layers.push({layer:new this._layerType(type)(url, params||null), type:type});
                this.map.addLayer(imw.top(this.layers).layer);
            }
        }
    });
});