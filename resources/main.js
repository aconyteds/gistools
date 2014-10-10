require(["esri/map",'dojo/_base/xhr', "dojo/parser","dojo/dom-construct", "dojo/_base/array", "dojo/_base/lang", "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
         "custom/imw", "dojo/dom-attr", "custom/layers", "dojo/topic", "dojo/on", "custom/loading", "dojo/domReady!"], 
function (Map, xhr, parser,domConstruct,array, lang, borderContainer, contentPane, imw, domAttr, layers, topic, on, loading) 
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
		var sub=topic.subscribe("main/layout/resize", function(){
	    	main.layout.resize();
	    });
		new contentPane({region:"center"}, "mapContainer");
		main.map=new Map("map", data.map);
		topic.subscribe("get/map", function(){
			topic.publish("return/map", main.map);
		});
		if(data.loadingIndicator.visible===true)
		{
            var loadingIndicator=new loading().placeAt("mapContainer", "last");
            loadingIndicator.startup();
		}
		if(data.ovw)
		{
			require(["custom/overview"], function(overview){
				lang.mixin(data.ovw, {map:main.map});
                main.ovw=new overview(data.ovw);
				main.ovw.startup();
				main.ovw.initDblClickHandler();
			});
		}
		array.forEach(data.layout, function(item){
			
		});
		if(data.leftPane){
			main.leftPane=
			console.log(main.leftPane);
		}
		require(["custom/windows"], function(bar){	
			main.toolbar=new bar({region:"bottom", height:"30px", appConfig:{
				themes:data.themes},
				map:main.map,
				mapConfig:{ovw:data.ovw||null},
				tools:data.tools}).placeAt(main.layout).startup();
			function parseLayout(a, p, dn){
				array.forEach(a[p], function(item){
					imw.parseContent(item.src, item.params, function(itm){
						dn.addChild(itm);
						if(item.content)
							parseLayout(item, "content", itm);
						if (item.startup){
							itm.startup();
							topic.publish("main/layout/resize", true);
						}
					});
				});
			}
			parseLayout(data, "layout", main.layout);
		});
		
		main.layerHandler=new layers({map:main.map});
	    array.map(data.layers, function(lyr){
            topic.publish("new/layer", lyr.url, lyr.params, lyr.type, lyr);
	    });
	    
		//console.log(main);
	});
});