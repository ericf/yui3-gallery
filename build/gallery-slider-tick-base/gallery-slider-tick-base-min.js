YUI.add("gallery-slider-tick-base",function(b){var a="values";b.SliderTickBase=b.Base.create("gallery-slider-tick-base",b.SliderBase,[],{addTickMarks:function(){var d=this.get(a);if(d){var h=this.rail;var c=this.thumb.getStyle(this._key.dim);c=parseFloat(c)||15;if(this.graphic==null){this.graphic=new b.Graphic({render:h});}this.graphic.removeAllShapes();for(var f=0;f<d.length;f++){var g=d[f];var e=this._valueToOffset(g)+(c/2);this._drawTickMark(e,"#CDCDCD");}}},_drawTickMark:function(d,g){var c=3;var h=2;var e=15;var f=this.graphic.addShape({type:"rect",width:1,height:c,x:d,y:h});f.set("stroke",{color:g,weight:1,opacity:0.5});f.set("fill",{color:g,opacity:0.5});var i=this.graphic.addShape({type:"rect",width:1,height:c,x:d,y:e});i.set("stroke",{color:g,weight:1,opacity:0.5});i.set("fill",{color:g,opacity:0.5});}},{ATTRS:{}});},"gallery-2011.11.30-20-58",{requires:["node","slider-base","graphics"],skinnable:false});