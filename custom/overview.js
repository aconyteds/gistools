define(["esri/dijit/OverviewMap", "dojo/_base/declare", "dojo/on", "dojo/query", "dojo/_base/lang", "dojo/dom-attr"],
		function(overviewMap, declare, on, query, lang, domAttr){
	dojo.create("link",{rel:"stylesheet", type:"text/css", href:"custom/overview/overview.css"}, document.getElementsByTagName('head')[0]);
	return declare(overviewMap,{
		_params:null,
		constructor:function(params){
			this._params=params;
		},
		initDblClickHandler:function(){
			on(query(".ovwHighlight")[0],"dblclick", lang.hitch(this,function(){
				var newParams=lang.mixin(this._params, {"visible":this.get("visible")});
				this.destroy();
				require(["custom/overview"], function(overview){
					var newmap= new overview(newParams);
					newmap.startup();
					newmap.initDblClickHandler();
				});				
			}));
			domAttr.set(query(".ovwHighlight")[0], "title", "Drag To Change The Map Extent, Double Click To Sync With Map"); 
		}
	});	
});
