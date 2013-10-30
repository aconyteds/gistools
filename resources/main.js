var main={
	map:null,
	config:null
};

require(["esri/map",'dojo/_base/xhr', "dojo/parser","dojo/dom-construct", "dojo/_base/array", "dojo/_base/lang", "dijit/layout/BorderContainer", "dijit/layout/ContentPane","dojo/domReady!"], 
function (Map, xhr, parser,domConstruct,array, lang, borderContainer, contentPane) 
{
	esri.config.defaults.io.proxyUrl = "//iwilson.esri.com/proxy/proxy.jsp";
	xhr.get({url:"config/config.json", handleAs:"json",load: function(data)
	{
		array.map(data.css, function(file)
		{
			domConstruct.create("link",{rel:"stylesheet", type:"text/css", href:file}, document.getElementsByTagName('head')[0]);
		});
		main.config=data;
	}}).then(function(data)
	{
		var layout=new borderContainer({gutters:false}, "layout");
		layout.startup();
		new contentPane({region:"center"}, "mapContainer");
		main.map= new Map("map", data.map);	
		if(data.ovw)
		{
			require(["custom/overview"], function(overview){
				lang.mixin(data.ovw, {map:main.map});
				var ovw=new overview(data.ovw);
				ovw.startup();
				ovw.initDblClickHandler();
			});
		}
		require(["custom/windows"], function(bar)
		{			
			(new bar({region:"bottom", height:"30px", appConfig:{
				leftPane:new contentPane({region:"left", splitter:true, content:"PANE"}).placeAt(layout)},
				map:main.map,
				mapConfig:{},
				tools:data.tools}).placeAt(layout)).buildMenu({
				ovw:data.ovw||null
			});			
		});		
	});
});

