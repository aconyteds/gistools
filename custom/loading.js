define(["dojo/_base/declare", "custom/imw", "dojo/_base/lang", "dojo/topic", "dojo/on", "dojo/_base/array", "dojo/_base/fx", "dojo/dom-style", 
"dijit/_WidgetBase","dijit/_TemplatedMixin",
"dojo/text!./loading/loading.html"], 
function(declare,  imw, lang, topic, on, array, fx, domstyle, _widgetBase, _templated, template){
    imw.css("./custom/loading/loading.css");
    return declare([_widgetBase, _templated], {
        templateString: template,
        loadingImgPath: require.toUrl("./custom/loading/loading.gif"),
        _subscribes:[],
        _counter:0,
        _fadeAnim:null,
        postCreate:function(){
            this._subscribes.push(topic.subscribe("map/update/start", lang.hitch(this, function(){
                this._incrimentCounter(1);
            })));
            this._subscribes.push(topic.subscribe("map/update/end", lang.hitch(this, function(){
                this._incrimentCounter(0);
            })));
            this._fadeAnim=fx.fadeOut({node:this.domNode, duration:500, end:lang.hitch(this, function(){domstyle.set(this.domNode, "display", "none");})});
        },
        destroy:function(){
            while(this._subscribes.length > 0){
                this.__subscribes.pop().remove();
            }
        },
        _incrimentCounter:function(amount){
            this._counter=amount;
            if(this._counter===0){
                this._fadeAnim.play(0, true);
            } else {
                if(this._fadeAnim.status() === "playing"){
                    this._fadeAnim.stop(false);
                }
                domstyle.set(this.domNode, "display", "");
                domstyle.set(this.domNode, "opacity", "1.0");
            }
        }
    });
});