define(["dojo/_base/declare","esri/dijit/Bookmarks", "dijit/_WidgetBase", "dojo/dom-construct"],function(declare, bookmarks, _widgetBase, domConstruct){
    return declare([_widgetBase], {
        postCreate:function(){
            /*var hold=domConstruct.create("div", {style:this.params.style});
            domConstruct.place(hold, this.domNode);
            console.log(this);*/
            new bookmarks(this.params, this.domNode);
        }
    });
});