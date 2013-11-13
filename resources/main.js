require(["esri/map",'dojo/_base/xhr', "dojo/parser","dojo/dom-construct", "dojo/_base/array", "dojo/_base/lang", "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
         "custom/imw", "dojo/dom-attr", "custom/layers", "dojo/domReady!"], 
function (Map, xhr, parser,domConstruct,array, lang, borderContainer, contentPane, imw, domAttr, layers) 
{
	xhr.get({url:"config/config.json", handleAs:"json",load: function(data)
	{
		array.map(data.themes, function(theme){
			imw.css(theme.url);
			if(theme["default"])
				domAttr.set(document.body, "class", theme.name);
		});
		array.map(data.css, function(file)
		{
			imw.css(file);
		});
	}}).then(function(data)
	{
	    var main={};
		main.layout=new borderContainer({gutters:false}, "layout");
		main.layout.startup();
		new contentPane({region:"center"}, "mapContainer");
		main.map=new Map("map", data.map);	
		if(data.ovw)
		{
			require(["custom/overview"], function(overview){
				lang.mixin(data.ovw, {map:map});
			    main.ovw=new overview(data.ovw);
				main.ovw.startup();
				main.ovw.initDblClickHandler();
			});
		}
		require(["custom/windows"], function(bar)
		{			
			main.toolbar=new bar({region:"bottom", height:"30px", appConfig:{
				themes:data.themes,
				leftPane:new contentPane({region:"left", splitter:true, content:"PANE"}).placeAt(main.layout)},
				map:main.map,
				mapConfig:{ovw:data.ovw||null},
				tools:data.tools}).placeAt(main.layout);
		});
		main.layerHandler=new layers({map:main.map});
	});
});

