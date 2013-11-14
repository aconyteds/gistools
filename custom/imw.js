define(["dojo/dom-construct", "dojo/topic"], function(domConstruct, topic){
	return {
		css:function(s){
			domConstruct.create("link",{rel:"stylesheet", type:"text/css", href:s}, document.getElementsByTagName('head')[0]);
		},
		top:function(a){
            return a[a.length-1];
		},
		getRemoteValue:function(method, callback, prop1, prop2, prop3, prop4)
		{
		    var tempTpc=topic.subscribe("return/"+method, function(){tempTpc.remove(); console.log(arguments); callback(arguments); });
	        topic.publish("get/"+method, prop1, prop2||null, prop3||null, prop4||null);
		}
	};
});