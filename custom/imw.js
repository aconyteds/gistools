define(["dojo/dom-construct"], function(domConstruct){
	return {
		css:function(s){
			domConstruct.create("link",{rel:"stylesheet", type:"text/css", href:s}, document.getElementsByTagName('head')[0]);
		}
	};
});