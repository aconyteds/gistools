define(["dojo/_base/declare", "dijit/_WidgetBase", "dijit/layout/ContentPane", "dojo/topic", "custom/imw", "dojo/_base/lang"], 
    function(declare, _widgetBase, contentPane, topic, imw, lang){
       return declare([_widgetBase, contentPane], {
           _map:null,
           _layers:[],
           constructor:function(){
               this._layers=[];
               this._map=null;
           },
           postMixInProperties:function(){
               imw.getRemoteValue("map", lang.hitch(this, function(a) {
                   this._map=a[0];
               }));
               imw.getRemoteValue("layers", lang.hitch(this, function(a){
                   this._layers=a[0];
               }));
           },
           postCreate:function(){
               //console.log(this);
               topic.subscribe("map/layer/add", function(layer){
                   //console.log(layer);
               });
           },
           _newTOCItem:function(item){
               
           }
       });
});