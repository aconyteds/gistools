define(["dojo/_base/declare", "dojox/layout/FloatingPane", "dojo/dom-construct"],function(declare, floatingPane, domConstruct){
	domConstruct.create("link",{rel:"stylesheet", type:"text/css", href:"//js.arcgis.com/3.7/js/dojo/dojox/layout/resources/FloatingPane.css"}, document.getElementsByTagName('head')[0]);
	return declare(floatingPane,{
		
	});
});