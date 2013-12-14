define(["dojo/_base/declare", "dojox/layout/FloatingPane", "dojo/dom-construct", "dojo/dom-geometry", "custom/imw"],function(declare, floatingPane, domConstruct, domGeometry, imw){
    imw.css("//js.arcgis.com/3.7/js/dojo/dojox/layout/resources/FloatingPane.css");
    imw.css("./custom/popup/popup.css");
	return declare(floatingPane,{
        templatePath: "./custom/popup/popup.html",
		resize: function(/* Object */dim){
            // override: do nothing if passing no dim.
            if (!dim) return;
            // summary:
            //		Size the FloatingPane and place accordingly
            dim = dim || this._naturalState;
            this._currentState = dim;		
            // Variables used for the issue corrections
            // calculate the offset due to the border width
            // borderOffset = borderWidth * 2
            // @see http://www.w3schools.com/jsref/dom_obj_all.asp
            var borderOffset = this.domNode.offsetWidth - this.domNode.clientWidth;
            // get offsetParent node and its location values
            var offsetParent = this.domNode.offsetParent;
            var offsetLocation = {x: 0, y: 0};
            if (offsetParent) {
                var offsetParentLoc = domGeometry.position(offsetParent);
                offsetLocation = {x: offsetParentLoc.x, y: offsetParentLoc.y};
            }
        
            // From the ResizeHandle we only get width and height information
            var dns = this.domNode.style;
            if("t" in dim){ dns.top = dim.t + "px"; }
        //			else if("y" in dim){ dns.top = dim.y + "px"; }		// original line that causes issue #1. DON'T uncomment this line!!!
            else if("y" in dim){ dns.top = (dim.y - offsetLocation.y) + "px"; }		// correction of issue #1. 
            if("l" in dim){ dns.left = dim.l + "px"; }
        //			else if("x" in dim){ dns.left = dim.x + "px"; }		// original line that causes issue #1. DON'T uncomment this line!!!
            else if("x" in dim){ dns.left = (dim.x - offsetLocation.x) + "px"; }	// correction of issue #1.
        //			dns.width = dim.w + "px";		// original line that causes the issue #2
        //			dns.height = dim.h + "px";		// original line that causes the issue #2
            dns.width = (dim.w - borderOffset) + "px";		// correction of issue #2
            dns.height = (dim.h - borderOffset) + "px";		// correction of issue #2
        
            // Now resize canvas
            var mbCanvas = { l: 0, t: 0, w: (dim.w - borderOffset), h: (dim.h - this.focusNode.offsetHeight - borderOffset) };
            domGeometry.setMarginBox(this.canvas, mbCanvas);
        
            // If the single child can resize, forward resize event to it so it can
            // fit itself properly into the content area
            this._checkIfSingleChild();
            if(this._singleChild && this._singleChild.resize){
                this._singleChild.resize(mbCanvas);
            }
        }
	});
});