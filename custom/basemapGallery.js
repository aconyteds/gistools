define(["custom/imw", "esri/dijit/BasemapGallery", "esri/dijit/Basemap","dojo/_base/array", "esri/dijit/BasemapLayer","dojo/_base/declare", "dojo/dom-construct", "dojo/topic", "dojo/_base/lang", "dijit/_WidgetBase", 
"dijit/layout/ContentPane"], 
function(imw, basemapGallery, basemap, array, basemapLayer, declare, domConstruct, topic, lang, _widgetBase, contentPane){
	return declare([_widgetBase],{
        basemaps:[],
        bmGallery:null,
        postCreate:function(){
            var bms=[];
            imw.getRemoteValue("Layers/type", lang.hitch(this, function(arr){
                //console.log(arr);
                array.map(arr, lang.hitch(this, function(bm){
                    bms.push(this.createBasemap(bm));
                }));
            }), "basemap");
            this.basemaps=bms;
        },
        createBasemap:function(bm){
            return new basemap({
                layers:[typeof(bm.url)=="string"?new basemapLayer({url:bm.url}):array.forEach(bm.url, function(lyr){return new basemapLayer({url:lyr});})],
                title:bm.src.title,
                thumbnail:bm.src.thumbnail||""
            });
        },
        startup:function(){
            this.bmGallery=new basemapGallery(this.params).placeAt(this.domNode);
            this.bmGallery.startup();
            array.map(this.basemaps, lang.hitch(this, function(bm){
                console.log(bm);
                this.basemapGallery.add(bm);
            }));
            topic.subscribe("new/Basemap", lang.hitch(this, function(bm){
                this.basemapGallery.add(this.createBasemap(bm));
            }));
        }
	});	
});