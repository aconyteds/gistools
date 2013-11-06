define(["dojo/dom-construct", "dojox/layout/Dock", "dijit/layout/LayoutContainer", "dijit/layout/ContentPane", "dijit/form/DropDownButton", "dojo/_base/declare",
        "dijit/_WidgetBase","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin", "dojox/timing","dijit/Menu",  "dijit/MenuItem", "dijit/PopupMenuItem", "dijit/CheckedMenuItem",
        "dijit/RadioMenuItem", "dijit/DropDownMenu", "dojo/_base/lang", "dijit/registry", "dojo/on", "dojo/dom-class", "dojo/_base/fx", "dojo/fx/Toggler", "dojo/query", "custom/imw",
        "dojo/_base/array","custom/popup","dojo/text!./windows/windows.html"],
		function(domConstruct, dock, layoutContainer, contentPane, dropDownButton, declare,
				_widgetBase, _templatedMixin, _widgetsInTemplateMixin, time, menu, menuItem, popupMenuItem, checkedMenuItem,
				radioMenuItem, dropDownMenu, lang, registry, on, domClass, fx, toggler, query, imw,
				array, popup, template){
	imw.css("./custom/windows/windows.css");
	imw.css("//js.arcgis.com/3.7/js/dojo/dojox/layout/resources/ResizeHandle.css");
	return declare([_widgetBase, _templatedMixin, _widgetsInTemplateMixin],{
		templateString:template,
		baseClass:"windows",
		_locked:true,
		_modifyHeight:function(val)
        {
            this.set("style", "height:"+val);
            this.getParent().resize();
        },
        constructor:function(params){
        	this._map=params.map;
        	this._appConfig=params.appConfig;
        	this._mapConfig=params.mapConfig;
        	this._tools=params.tools;
        },
		postCreate:function(){
			this.dock.startup();
			this._createTimePiece();
			this.mainPane.resize();
			this.mainBtn.set("menu", this.mainMenu);
			this._initShrink();
			this._initAppConfig(this._appConfig);
			this._initMapConfig(this._mapConfig);
			this._initToolConfig(this._tools);
		},
		_initAppConfig:function(items){
			var theme=new menu();
			var themeNames=[];
			array.map(items.themes, function(t){
				themeNames.push(t.name);
				 on(new radioMenuItem({label:t.name.charAt(0).toUpperCase()+t.name.substring(1), group:"themeDoctor", checked:t["default"]}).placeAt(theme), "change", function(flag){
					 if(flag){domClass.remove(document.body, themeNames);domClass.add(document.body,t.name);}});
			});
            new popupMenuItem({label:"Theme", popup:theme}).placeAt(this.appMenu);
            on(new checkedMenuItem({label:"Lock Taskbar", checked:this._locked}).placeAt(this.appMenu), "change", lang.hitch(this, function(flag){this._locked=flag; this._lockEvent.remove(); if(!flag){this._modifyHeight("3px");}}));
            if(items.leftPane)
            	new checkedMenuItem({label:"Left Pane", checked:true, onChange:lang.hitch([this, items.leftPane], function(flag){this[0].getParent()[flag?"addChild":"removeChild"](this[1]);})}).placeAt(this.appMenu);
		},
		_initMapConfig:function(items){
			if(items.ovw)
            	on(new checkedMenuItem({checked:true, label:"Overview Map"}).placeAt(this.mapMenu),"change",function(flag){
            		fx[flag?"fadeIn":"fadeOut"]({node:query(".ovwController")[0], duration:1}).play();
            		fx[flag?"fadeIn":"fadeOut"]({node:query(".ovwContainer")[0], duration:1}).play();
            	});
            if(this._map.isZoomSlider)
                on(new checkedMenuItem({label:"Zoom Slider", checked:this._map.isZoomSlider}).placeAt(this.mapMenu), "change", lang.hitch(this, function(flag){
                	console.log(this); this._map[flag?"showZoomSlider":"hideZoomSlider"]();}));
            if(this._map.isPanArrows)
                on(new checkedMenuItem({label:"Nav Buttons", checked:this._map.isPanArrows}).placeAt(this.mapMenu), "change", lang.hitch(this, function(flag){
                	flag?this.map.showPanArrows():this.map.hidePanArrows();}));
            if(this._map._ogol)
            {
                var logo=new toggler({node:this._map._ogol});
                on(new checkedMenuItem({label:"Logo", checked:true}).placeAt(this.mapMenu), "change", function(flag){flag?logo.show():logo.hide();});
            }
            if(query(".esriAttribution").length)
            {
                var attribution=new toggler({node:query(".esriAttribution")[0]});
                on(new checkedMenuItem({label:"Nav Info", checked:true}).placeAt(mapMenu), "change", function(flag){flag?attribution.show():attribution.hide();});
            }			
		},
		_initToolConfig:function(items){
			array.map(items, lang.hitch(this, function(itm){
				lang.mixin(itm, {dock:this.dock});
				new this._tool({label:itm.label, opt:itm}).placeAt(this.toolMenu);
			}));			
		},
		_tool:declare([menuItem],{
			onClick:function(){
				console.log(this.opt);
				if(!registry.byId(this.opt.id))
				{
					require([this.opt.src], lang.hitch(this, function(typ){
						var source=new typ(this.opt.params);
						(new popup({id:this.opt.id, title:this.opt.label, style:"top:50%; left:50%;", dockable:true, dockTo:this.opt.dock,
							content:source}).placeAt(document.body)).startup();
						if(source.startup)
							source.startup();
					}));
				}
				else
					registry.byId(this.opt.id).show();
			}
		}),
		_initShrink:function()
        {
			on(this.mainBtn, "click", lang.hitch(this, function(){
				var temp=this._locked;
				this._locked=true;
				this._lockEvent=on(this.mainBtn, "blur", lang.hitch(this, function(){
					this._lockEvent.remove();
					if(!temp){
						this._locked=false;
						}
					}));
				}));
            on(this.domNode, "mouseout", lang.hitch(this, function(){if(!this._locked){this._modifyHeight("3px");}}));
            on(this.domNode, "mouseover", lang.hitch(this, function(){this._modifyHeight("30px");}));     
        },
		_createTimePiece:function(){
            var clock = new contentPane({class:"clock", width:"75px"});
            var t =new time.Timer(1000);
            t.onTick=function(){
                clock.setContent(new Date().toLocaleTimeString());
            };
            t.start();
            this.clockContainer.addChild(clock);
        }
	});
});

/*define(["dojo/dom", "dojo/dom-class", "dojo/_base/declare", "dojo/dom-construct", "dijit/layout/ContentPane", "dojox/timing","dojo/_base/fx", "dojo/on", "dojo/_base/array","dijit/registry",
        "dijit/form/DropDownButton", "dijit/Menu",  "dijit/MenuItem", "dijit/PopupMenuItem", "dijit/CheckedMenuItem", "dijit/RadioMenuItem", "dijit/MenuSeparator",
        "dojo/_base/lang", "dojo/fx/Toggler", "dojo/query", "dojox/layout/Dock","dojox/layout/FloatingPane", "dijit/layout/LayoutContainer", "custom/popup"],
function(dom, domClass, declare, domConstruct, contentPane, time, fx, on, array, registry,
		dropDownButton, menu, menuItem, popupMenuItem, checkedMenuItem, radioMenuItem, menuSeparator,
		lang, toggler, query, dock, floatingPane, layoutContainer, popup){
	domConstruct.create("link",{rel:"stylesheet", type:"text/css", href:"./custom/windows/windows.css"}, document.getElementsByTagName('head')[0]);
	domConstruct.create("link",{rel:"stylesheet", type:"text/css", href:"//js.arcgis.com/3.7/js/dojo/dojox/layout/resources/ResizeHandle.css"}, document.getElementsByTagName('head')[0]);	
    return declare([contentPane], {
        _menu:new menu({class:"startMenu"}),
        _toolMenu:new menu({}),
        _locked:true,
        _lockEvent:null,
        toolbar:null,
        _modifyHeight:function(val)
        {
            this.set("style", "height:"+val);
            this.getParent().resize();
        },
        postCreate:function(){
            this.set("class", "dijitDialogTitleBar windows");
            var lyt=new layoutContainer({style:"width:100%; height:100%;"}).placeAt(this.domNode);
            lyt.startup();
            new contentPane({region:"left", content:this._initMenu()}).placeAt(lyt);
            var cLyt=new layoutContainer();
            new contentPane({region:"center", content:cLyt}).placeAt(lyt);
            cLyt.startup();
            this.toolbar=new dock({style:"height:100%; vertical-align:center; background:inherit, border:0;"});
            new contentPane({region:"left", content:this.toolbar}).placeAt(cLyt);
            new contentPane({region:"right", content:"SEARCH BAR"}).placeAt(cLyt);
            new contentPane({region:"right", content:this._createTimePiece(), class:"clockContainer"}).placeAt(lyt);
            this._initShrink();
        },
        buildMenu:function(items)
        {
        	//Tools config menu
        	new popupMenuItem({label:"Tools", popup:this._toolMenu}).placeAt(this._menu);
        	this.addToolItems(items.tools);
            //Map Config Menu
            var mapConfigMenu=new menu();
            if(items.ovw)
            	on(new checkedMenuItem({checked:true, label:"Overview Map"}).placeAt(mapConfigMenu),"change",function(flag){
            		fx[flag?"fadeIn":"fadeOut"]({node:query(".ovwController")[0], duration:1}).play();
            		fx[flag?"fadeIn":"fadeOut"]({node:query(".ovwContainer")[0], duration:1}).play();
            	});
            if(this.map.isZoomSlider)
                on(new checkedMenuItem({label:"Zoom Slider", checked:this.map.isZoomSlider}).placeAt(mapConfigMenu), "change", lang.hitch(this, function(flag){ console.log(this); flag?this.map.showZoomSlider():this.map.hideZoomSlider();}));
            if(this.map.isPanArrows)
                on(new checkedMenuItem({label:"Nav Buttons", checked:this.map.isPanArrows}).placeAt(mapConfigMenu), "change", lang.hitch(this, function(flag){flag?this.map.showPanArrows():this.map.hidePanArrows();}));
            if(this.map._ogol)
            {
                var logo=new toggler({node:this.map._ogol});
                on(new checkedMenuItem({label:"Logo", checked:true}).placeAt(mapConfigMenu), "change", function(flag){flag?logo.show():logo.hide();});
            }
            if(query(".esriAttribution").length)
            {
                var attribution=new toggler({node:query(".esriAttribution")[0]});
                on(new checkedMenuItem({label:"Nav Info", checked:true}).placeAt(mapConfigMenu), "change", function(flag){flag?attribution.show():attribution.hide();});
            }
            new popupMenuItem({label:"Map Config", popup:mapConfigMenu}).placeAt(this._menu);
            
            //App Config Menu
            var theme=new menu();
            on(new radioMenuItem({label:"Tundra", group:"themeDoctor", checked:true}).placeAt(theme), "change", function(flag){if(flag){domClass.replace(document.body,"tundra", "claro");}});
            on(new radioMenuItem({label:"Claro", group:"themeDoctor"}).placeAt(theme), "change", function(flag){if(flag){domClass.replace(document.body, "claro", "tundra");}});
            var ncmi=new menu();
            new popupMenuItem({label:"Theme", popup:theme}).placeAt(ncmi);
            on(new checkedMenuItem({label:"Lock Taskbar", checked:this._locked}).placeAt(ncmi), "change", lang.hitch(this, function(flag){this._locked=flag; this._lockEvent.remove(); if(!flag){this._modifyHeight("3px");}}));
            if(items.leftPane)
            	new checkedMenuItem({label:"Left Pane", checked:true, onChange:lang.hitch([this, items.leftPane], function(flag){this[0].getParent()[flag?"addChild":"removeChild"](this[1]);})}).placeAt(ncmi);                    
            new popupMenuItem({label:"App. Config", popup:ncmi}).placeAt(this._menu);
        },
        addToolItems:function(param)
        {
        	array.map(param, lang.hitch(this,function(data){
        		(new this.tool({label:data.label, data:data}).placeAt(this._toolMenu)).initialize(data.pinned);
        	}));
        },
        tool:declare(menuItem,{
        	constructor:function(){
        		on(this, "click",function(){this.openPopup().show();});
        	},
        	initialize:function(flag){
        		if(flag)
        		{
        			this.openPopup();
        			this._currentPopup.minimize();
        		}        			
        	},
        	openPopup:function(){
        		if(!this._currentPopup)
        		{
        			require([this.data.src],lang.hitch(this, function(src){
        				lang.mixin(this.data.params,{map:main.map});
        				var source=new src(this.data.params);
        				this._currentPopup=new popup({label:this.data.label, id:this.data.id, dock:this._toolbar, content:source}).placeAt(document.body);
        				if(source.startup)
        					source.startup();
        				this._currentPopup.startup();
        			}));
        			return this._currentPopup;
        		}
        		else
        			return this._currentPopup;
        	}
        }),
        _initMenu:function()
        {
            var menuBtn=new dropDownButton({label:"start", class:"startBtn", dropDown:this._menu});
            on(menuBtn, "click", lang.hitch(this, function(){var temp=this._locked; this._locked=true;this._lockEvent=on(menuBtn, "blur", lang.hitch(this, function(){ this._lockEvent.remove();if(!temp){this._locked=false;}}));}));
            return menuBtn;
        },
        _createTimePiece:function(){
            var clock = new contentPane({class:"clock", width:"75px"});
            var t =new time.Timer(1000);
            t.onTick=function(){
                clock.setContent(new Date().toLocaleTimeString());
            };
            t.start();
            return clock;
        },
        _initShrink:function()
        { 
            on(this, "mouseout", function(){if(!this._locked){this._modifyHeight("3px");}});
            on(this, "mouseover", function(){this._modifyHeight("30px");});     
        }
    });
});*/