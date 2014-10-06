define(["dojo/dom-construct", "dojox/layout/Dock", "dijit/layout/LayoutContainer", "dijit/layout/ContentPane", "dijit/form/DropDownButton", "dojo/_base/declare",
        "dijit/_WidgetBase","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin", "dojox/timing","dijit/Menu",  "dijit/MenuItem", "dijit/PopupMenuItem", "dijit/CheckedMenuItem",
        "dijit/RadioMenuItem", "dijit/DropDownMenu", "dojo/_base/lang", "dijit/registry", "dojo/on", "dojo/dom-class", "dojo/_base/fx", "dojo/fx/Toggler", "dojo/query", "custom/imw",
        "dojo/_base/array","custom/popup","custom/searchBar", "dojo/dom-style", "dojo/text!./windows/windows.html"],
		function(domConstruct, dock, layoutContainer, contentPane, dropDownButton, declare,
				_widgetBase, _templatedMixin, _widgetsInTemplateMixin, time, menu, menuItem, popupMenuItem, checkedMenuItem,
				radioMenuItem, dropDownMenu, lang, registry, on, domClass, fx, toggler, query, imw,
				array, popup, searchBar, domStyle, template){
	imw.css("./custom/windows/windows.css");
	imw.css("//js.arcgis.com/3.10/js/dojo/dojox/layout/resources/ResizeHandle.css");
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
                    this._map[flag?"showZoomSlider":"hideZoomSlider"]();}));
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
                on(new checkedMenuItem({label:"Nav Info", checked:true}).placeAt(this.mapMenu), "change", function(flag){flag?attribution.show():attribution.hide();});
            }			
		},
		_initToolConfig:function(items){
			array.map(items, lang.hitch(this, function(itm){
				lang.mixin(itm, {dock:this.dock});
				lang.mixin(itm.params, {map:this._map});
				var tool=new this._tool({label:itm.label, opt:itm}).placeAt(this.toolMenu);
				if(itm.pinned)
                    tool.createPopup();
			}));			
		},
		_tool:declare([menuItem],{
            createPopup:function(){
				if(!registry.byId(this.opt.id))
				{
					require([this.opt.src], lang.hitch(this, function(typ){
						var hold=domConstruct.create("div", this.opt.popup);
                        var source=new typ(this.opt.params, hold);
						var pup=new popup({id:this.opt.id, title:this.opt.label, style:"top:100px; left:100px;", dockable:true, dockTo:this.opt.dock, content:hold}).placeAt(document.body);
						domStyle.set(pup.containerNode, this.opt.popup);
						pup.startup();
						if(source.startup)
							source.startup();
					}));
				}
				else
					registry.byId(this.opt.id).show().resize();
			},
			onClick:function(){this.createPopup();}
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
                clock.set("content", new Date().toLocaleTimeString());
            };
            t.start();
            this.clockContainer.addChild(clock);
        }
	});
});