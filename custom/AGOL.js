define(["dojo/_base/declare", "dijit/_WidgetBase","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin", "dijit/layout/ContentPane", "dojo/topic", "custom/imw", "dojo/_base/lang", "dijit/form/TextBox",
"esri/arcgis/OAuthInfo", "dojo/dom-construct", "esri/IdentityManager", "esri/arcgis/Portal", "dojo/keys", "dojo/dom-style", "dojo/topic", "dojo/text!./AGOL/AGOL.html"], 
function(declare, _widgetBase, _templated, _widgetsInTemplate, contentPane, topic, imw, lang, textBox,
oAuthInfo, domConstruct, esriId, arcgisPortal, keys, domStyle, topic, template){
    imw.css(require.toUrl("/custom/AGOL/AGOL.css"));
    return declare([_widgetBase, _templated, _widgetsInTemplate], {
        baseClass:"customAGOL",
        templateString:template,
        constructor:function(){
        
        },
        postMixInProperties:function(){
            lang.mixin(this, this.params);
        },
        postCreate:function(){
        },
        _createPortalInterface:function(portal){
            console.log(this);
            domConstruct.destroy(this.LoginOverlay);
            domStyle.set(this.itemInterface, {"display":"block"});
            this.user.innerHTML=portal.fullName;
            var bmObject="";
            portal.portal.queryGroups({q:portal.portal.basemapGalleryGroupQuery}).then(function(data){
                bmObject={id:data.results[0].id, owner:data.results[0].owner, title:data.results[0].title};
            });
            topic.subscribe("get/portal/BasemapGalleryGroup", function(){
                topic.publish("return/portal/BasemapGalleryGroup",bmObject);
            });
            globalPortal=portal;
        },
        _login:function(){
            var portal=new arcgisPortal.Portal(this.pUrl.get("value")).signIn().then(lang.hitch(this, function(data){
                lang.hitch(this, this._createPortalInterface(data));
            }));
        },
        _onKeyPress:function(evt){
            switch(evt.charOrCode){
                case keys.ENTER:
                return this._login();
            }
        }
    });
});
