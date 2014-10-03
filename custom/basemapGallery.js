define(["custom/imw", "esri/dijit/BasemapGallery", "esri/dijit/Basemap","dojo/_base/array", "esri/dijit/BasemapLayer","dojo/_base/declare", "dojo/dom-construct", "dojo/topic", "dojo/_base/lang", "dijit/_WidgetBase", 
"dijit/layout/ContentPane"], 
function(imw, basemapGallery, basemap, array, basemapLayer, declare, domConstruct, topic, lang, _widgetBase, contentPane){
	return declare([_widgetBase],{
        basemaps:[],
        bmGallery:null,
        postCreate:function(){
            var bms=[];
            imw.getRemoteValue("layers/type", lang.hitch(this, function(arr){
                console.log(arr);
                array.map(arr, lang.hitch(this, function(bm){
                    bms.push(this.createBasemap(bm));
                }));
            }), "basemap");
            this.basemaps=bms;
            var hold=domConstruct.create("div", {style:this.sytle});
            domConstruct.place(hold,this.domNode) 
            this.bmGallery=new basemapGallery(this.params, hold).startup();
            //this.bmGallery.startup();
            array.map(this.basemaps, lang.hitch(this, function(bm){
                console.log(bm);
                this.basemapGallery.add(bm);
            }));
            topic.subscribe("new/basemap", lang.hitch(this, function(bm){
                this.bmGallery.add(this.createBasemap(bm));
            }));
        },
        createBasemap:function(bm){
            return new basemap({
                layers:[typeof(bm.url)=="string"?new basemapLayer({url:bm.url}):array.forEach(bm.url, function(lyr){return new basemapLayer({url:lyr});})],
                title:bm.src.title,
                thumbnail:bm.src.thumbnail||""
            });
        }
	});	
});