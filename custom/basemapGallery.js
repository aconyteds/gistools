define(["custom/imw", "esri/dijit/BasemapGallery", "esri/dijit/Basemap","dojo/_base/array", "esri/dijit/BasemapLayer","dojo/_base/declare", "dojo/dom-construct", "dojo/topic", "dojo/_base/lang", "dijit/_WidgetBase", 
"dijit/layout/ContentPane"], 
function(imw, basemapGallery, basemap, array, basemapLayer, declare, domConstruct, topic, lang, _widgetBase, contentPane){
	return declare([_widgetBase],{
        basemaps:[],
        bmGallery:null,
        postMixInProperties:function(){
            imw.getRemoteValue("portal/BasemapGalleryGroup", lang.hitch(this, function(data){
                if(data)
                    lang.mixin(this.params, {basemapsGroup: data[0]});
            }));
        },
        postCreate:function(){
            var hold=domConstruct.create("div", {style:this.sytle});
            domConstruct.place(hold,this.domNode);
            this.bmGallery=new basemapGallery(this.params, hold);
            this.bmGallery.startup();
            var bms=[];
            imw.getRemoteValue("layer/type", lang.hitch(this, function(arr){
                array.map(arr, lang.hitch(this, function(bm){
                    bms.push(this.createBasemap(bm[0]));
                }));
            }), "basemap");
            this.basemaps=bms;
            array.map(this.basemaps, lang.hitch(this, function(bm){
                this.bmGallery.add(bm);
            }));
            topic.subscribe("new/basemap", lang.hitch(this, function(bm){
                this.bmGallery.add(this.createBasemap(bm));
            }));
        },
        createBasemap:function(bm){
            return new basemap({
                layers:[typeof(bm.layer)=="string"?new basemapLayer({url:bm.layer}):array.forEach(bm.layer, function(lyr){return new basemapLayer({url:lyr});})],
                title:bm.src.params.title,
                thumbnailUrl:bm.src.params.thumbnail
            });
        }
	});	
});