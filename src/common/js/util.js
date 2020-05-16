var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};


	 const colors = [
	  //PACKAGE: 
	  {
	    start: { r: 255, g: 222, b: 173 },
	    end: { r: 255, g: 222, b: 173 }
	  },
	  //FILE: 
	  {
	    start: { r: 255, g: 140, b: 105 },
	    end: { r: 0, g: 0, b: 0 }
	  },
	  //STRUCT: 
	  {
	    start: { r: 32, g: 156, b: 238 },
	    end: { r: 0, g: 0, b: 0 }
	  }]
	;
	
	 const  TYPE = {
					P:1,
					F:2,
					S:3
				};
export default {
	colors,TYPE,
				
	getProportionalColor(start, end, percent) {
	  percent = 1 - percent;
	  const red = (start.r - end.r) * percent + end.r;
	  const green = (start.g - end.g) * percent + end.g;
	  const blue = (start.b - end.b) * percent + end.b;
	
	  return { r: red, g: green, b: blue };
	},
	
    getQueryStringByName: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },



};
