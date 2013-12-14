define(["dojo/_base/declare", "dijit/ProgressBar", "custom/imw", "dojo/_base/lang", "dojo/topic", "dojo/on", "dojo/_base/fx", "dojo/dom-style", "dojo/Stateful"], 
function(declare, ProgressBar, imw, lang, topic, on, fx, domstyle, stateful){
    //imw.css("./custom/loading/loading.css");
    return declare([ProgressBar], {
        state:declare([stateful], {
            val:0,
            totVal:1,
            _valSetter:function(l){
                this.val=l;
            },
            _valGetter:function(){
                return this.val;
            },
            _totValGetter:function(){
                return this.totVal;
            },
            _totValSetter:function(l){
                this.totVal=l;
            },
            zeroVal:function(){
                this.set("val", 0);
                this.set("totVal", 0);
            },
            addVal:function(){
                this.set("val", this.get("val")+1);
                this.set("totVal", this.get("totVal")+1);
            },
            subVal:function(){
                if(this.get("val")-1 <=0)
                    this.zeroVal();
                this.set("val", this.get("val")-1);
            }
        }),
        postCreate:function(){
            var lyrs = new this.state();
            this.set("style", "pointer-events:none");
            topic.subscribe("map/update/start", lang.hitch(this, function(){
                lyrs.addVal();
            }));
            topic.subscribe("map/update/end", lang.hitch(this, function(){
                lyrs.subVal();
            }));
            topic.subscribe("map/Layer/add", lang.hitch(this, function(layer){
                var signal=on(layer, "update-start", lang.hitch(this, function(){
                    lyrs.addVal();
                    on.once(layer, "update-end", lang.hitch(this, function(){
                        lyrs.subVal();
                    }));
                }));
                var lyrRemove=topic.subscribe.once("map/Layer/remove", lang.hitch(this, function(layer){
                        signal.remove();
                        lyrRemove.remove();
                }));
            }));
            lyrs.watch("val", lang.hitch(this, function(name, ovalue, nvalue){
                if(nvalue===0 && nvalue==lyrs.get("totVal"))//reset
                    this.set("value", 100);
                if(nvalue!==0 && nvalue>ovalue && nvalue==lyrs.get("totVal"))
                    this.set("value", 0);
                else if(nvalue<ovalue && lyrs.get("totVal")!==0)
                    this.set("value", 100/lyrs.get("totVal"));
                switch(this.get("value")){
                    case 0:
                        fx.fadeIn({node:this.domNode, beforeBegin:function(){domstyle.set(this.node, "display", "inherit");}}).play();
                        break;
                    case 100:
                        fx.fadeOut({node:this.domNode, end:lang.hitch(this.domNode, function(){domstyle.set(this, "display", "none");})}).play();
                        break;
                }
            }));
            this.watch("value", function(n,o,v){
                if(v==100)
                    lyrs.zeroVal();
            });
        }
    });
});