define(["esri/dijit/BasemapGallery", "esri/dijit/Basemap","dojo/_base/array", "esri/dijit/BasemapLayer","dojo/_base/declare", "dojo/dom-construct"], 
		function(basemapGallery, basemap, array, basemapLayer, declare, domConstruct){
	domConstruct.create("link",{rel:"stylesheet", type:"text/css", href:"./custom/basemapGallery/basemapGallery.css"}, document.getElementsByTagName('head')[0]);
	var basemaps=[];
	array.map(main.config.layers, function(data){
		if(data.basemap){
			basemaps.push(new basemap({
				layers:[typeof(data.url)=="string"?new basemapLayer({url:data.url}):array.forEach(data.url, function(lyr){return new basemapLayer({url:lyr});})],
				title:data.title,
				thumbnail:data.thumbnail||""
			}));
		}		
	});
	return declare([basemapGallery],{
	});	
});