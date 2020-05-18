
import * as THREE from 'three'
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


	//释放场景对象占的内存
/*	disposeNode (node)
	{
		if (node instanceof THREE.Mesh)
		{
			if (node.geometry)
			{
				node.geometry.dispose ();
			}

			if (node.material)
			{
				if (node.material instanceof THREE.MeshFaceMaterial)
				{
					$.each (node.material.materials, function (idx, mtrl)
					{
						if (mtrl.map)               mtrl.map.dispose ();
						if (mtrl.lightMap)          mtrl.lightMap.dispose ();
						if (mtrl.bumpMap)           mtrl.bumpMap.dispose ();
						if (mtrl.normalMap)         mtrl.normalMap.dispose ();
						if (mtrl.specularMap)       mtrl.specularMap.dispose ();
						if (mtrl.envMap)            mtrl.envMap.dispose ();
						if (mtrl.alphaMap)          mtrl.alphaMap.dispose();
						if (mtrl.aoMap)             mtrl.aoMap.dispose();
						if (mtrl.displacementMap)   mtrl.displacementMap.dispose();
						if (mtrl.emissiveMap)       mtrl.emissiveMap.dispose();
						if (mtrl.gradientMap)       mtrl.gradientMap.dispose();
						if (mtrl.metalnessMap)      mtrl.metalnessMap.dispose();
						if (mtrl.roughnessMap)      mtrl.roughnessMap.dispose();

						mtrl.dispose ();    // disposes any programs associated with the material
					});
				}
				else
				{
					if (node.material.map)              node.material.map.dispose ();
					if (node.material.lightMap)         node.material.lightMap.dispose ();
					if (node.material.bumpMap)          node.material.bumpMap.dispose ();
					if (node.material.normalMap)        node.material.normalMap.dispose ();
					if (node.material.specularMap)      node.material.specularMap.dispose ();
					if (node.material.envMap)           node.material.envMap.dispose ();
					if (node.material.alphaMap)         node.material.alphaMap.dispose();
					if (node.material.aoMap)            node.material.aoMap.dispose();
					if (node.material.displacementMap)  node.material.displacementMap.dispose();
					if (node.material.emissiveMap)      node.material.emissiveMap.dispose();
					if (node.material.gradientMap)      node.material.gradientMap.dispose();
					if (node.material.metalnessMap)     node.material.metalnessMap.dispose();
					if (node.material.roughnessMap)     node.material.roughnessMap.dispose();

					node.material.dispose ();   // disposes any programs associated with the material
				}
			}
		}
	} , */ // disposeNode

	disposeHierarchy (node, callback)
	{
		for (var i = node.children.length - 1; i >= 0; i--)
		{
			var child = node.children[i];
			this.disposeHierarchy (child, callback);
			callback (child);
		}
	},
    disposeNode (parentObject) {


        parentObject.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                if (node.geometry) {
                    node.geometry.dispose();
                }

                if (node.material) {

                    if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.MultiMaterial) {
                        node.material.materials.forEach(function (mtrl, idx) {
                            if (mtrl.map) mtrl.map.dispose();
                            if (mtrl.lightMap) mtrl.lightMap.dispose();
                            if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                            if (mtrl.normalMap) mtrl.normalMap.dispose();
                            if (mtrl.specularMap) mtrl.specularMap.dispose();
                            if (mtrl.envMap) mtrl.envMap.dispose();

                            mtrl.dispose();    // disposes any programs associated with the material
                        });
                    }
                    else {
                        if (node.material.map) node.material.map.dispose();
                        if (node.material.lightMap) node.material.lightMap.dispose();
                        if (node.material.bumpMap) node.material.bumpMap.dispose();
                        if (node.material.normalMap) node.material.normalMap.dispose();
                        if (node.material.specularMap) node.material.specularMap.dispose();
                        if (node.material.envMap) node.material.envMap.dispose();

                        node.material.dispose();   // disposes any programs associated with the material
                    }
                }
            }
        });
    },


};
