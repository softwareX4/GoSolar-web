<template>
	<section>
		<div>
			<el-row>
				<el-col :span="24">
					<div style="margin-top: 15px;">
						<el-input placeholder="eg:github.com/golang/go" v-model="address" class="input-with-select">
							<el-button slot="append" v-on:click="onSubmit">立即创建</el-button>
						</el-input>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="2">
					<div class="grid-content"> Examples:</div>
				</el-col>
				<el-col :span="2">
					<div class="grid-content ">
						<el-link type="primary">sirupsen/logrus</el-link>
					</div>
				</el-col>
				<el-col :span="2">
					<div class="grid-content ">
						<el-link type="primary">spf13/cobra</el-link>
					</div>
				</el-col>
				<el-col :span="2">
					<div class="grid-content ">
						<el-link type="primary">golang/dep</el-link>
					</div>
				</el-col>
				<el-col :span="2">
					<div class="grid-content ">
						<el-link type="primary">gohugoio/hugo</el-link>
					</div>
				</el-col>
			</el-row>
		</div>
		
		<div id="container">
		<!-- visulization scenen -->
		</div>
	
		<div class="block" align="right" id="wrap">
			<el-image :src="require('@/assets/metaphor.png')" fit="cover">
				<div slot="placeholder" class="image-slot">
					加载中<span class="dot">...</span>
				</div>
			</el-image>
		</div>

	</section>
</template>

<script>
	import * as THREE from 'three'
	import 'three-orbitcontrols'
	export default {
		data() {
			return {
				address: '',
			}
		},
		methods: {
			
			init:function(){
				
				
				    var scene = new THREE.Scene();
				
				    var cloud = cloudFun()
				    scene.add(cloud)
				    var intersectsArr = []
				
				    let Data = data()
				    var sun = createSphereMesh(Data.sun.R, Data.sun.color);
				    sun.name = Data.sun.name;
				    intersectsArr.push(sun)
				    scene.add(sun)
				    var planetGroup = new THREE.Group();
				    scene.add(planetGroup);
				    Data.planet.forEach((obj) => {
				        var planet = null;
				        if (obj.ring) {
				            planet = createringPlanetMesh(obj.sphere.R, obj.sphere.color, obj.ring.r, obj.ring.color)
				        } else {
				            planet = createSphereMesh(obj.R, obj.color);
				        }
				        planet.revolutionR = obj.revolutionR;
				        planet.angle = 2 * Math.PI * Math.random();
				        planet.name = obj.name;
				        planetGroup.add(planet);
				        intersectsArr.push(planet)
				        var line = circle(obj.revolutionR);
				        scene.add(line);
				    })
				
				let container = document.getElementById('container')
				
				var width = container.clientWidth;
				var height = container.clientHeight;
				var k = width / height;
				var s = 310;
				    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1500);
				    camera.position.set(651, 613, 525);
				    camera.lookAt(scene.position);
				
				
				    var point = new THREE.PointLight(0xffffff);
				    point.position.set(400, 200, 300);
				    scene.add(point);
				
				
				    var ambient = new THREE.AmbientLight(0x444444);
				    scene.add(ambient);
				
				
				    var renderer = new THREE.WebGLRenderer({
				        antialias: true
				    });
				    renderer.setSize(width, height);
				    renderer.setClearColor(0xF5F5F5, 1);
				   container.appendChild(renderer.domElement)
				    var chooseMesh = null;
				    let clock = new THREE.Clock();
				    var FPS = 30;
				    var 刷新时间 = 1 / FPS;
				    var timeS = 0;
				    function render() {
				        sun.rotation.y += 0.01;
				        var 渲染间隔 = clock.getDelta();
				        timeS = timeS + 渲染间隔;
				        if (timeS > 刷新时间) {
				            renderer.render(scene, camera);
				            timeS = 0;
				        }
				
				        planetGroup.children.forEach(function(obj) {
				            //以下两行是控制旋转的
				            //obj.rotation.y += 0.01;
				            //obj.angle += 0.005 / obj.revolutionR * 400;
				            obj.position.set(obj.revolutionR * Math.sin(obj.angle), 0, obj.revolutionR * Math.cos(obj.angle));
				        })
				        cloud.rotation.x += 0.0002;
				        cloud.rotation.y += 0.0002;
				        cloud.rotation.z += 0.0002;
				
				        requestAnimationFrame(render);
				
				        if (chooseMesh) {
				            var worldVector = new THREE.Vector3(
				                chooseMesh.position.x,
				                chooseMesh.position.y,
				                chooseMesh.position.z
				            );
				            var standardVector = worldVector.project(camera);
				            var a = container.clientWidth / 2;
				            var b = container.clientHeight / 2;
				            var x = Math.round(standardVector.x * a + a);
				            var y = Math.round(-standardVector.y * b + b);
				
				            img.style.left = x + 'px';
				            img.style.top = y  + 10 + 'px';
				        }
				    }
				    render();
				    var controls = new THREE.OrbitControls(camera,renderer.domElement);

				    var img = document.createElement("img");
				    document.body.appendChild(img)
				    img.style.position = 'absolute';
				    img.style.display = 'block';
				
				    function choose(event) {
				        img.src = '';
				        chooseMesh = null;
				        var Sx = event.layerX;
				        var Sy = event.layerY;
				
				        var x = (Sx / width) * 2 - 1;
				        var y = -(Sy / height) * 2 + 1;
				
				        var raycaster = new THREE.Raycaster();
				        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
				        var intersects = raycaster.intersectObjects(intersectsArr, false);
				        if (intersects.length > 0) {
				
				            console.log(intersects[0].object.name);
				            img.src = require('@/assets/tip.png');
				            chooseMesh = intersects[0].object
				        }
				    }
				    addEventListener('click', choose,false);
				
				    window.onresize = function() {
				        renderer.setSize(container.clientWidth, container.clientHeight);
				        k = (container.clientWidth) / (container.clientHeight);
				        camera.left = -s * k;
				        camera.right = s * k;
				        camera.top = s;
				        camera.bottom = -s;
				        camera.updateProjectionMatrix();
				    };
				
				    function createMesh(geometry, color) {
				
				        var material = new THREE.MeshBasicMaterial({
				            color:color,
				        });
				        var mesh = new THREE.Mesh(geometry, material);
				        return mesh;
				    }
				
				    function createSphereMesh(R, color) {
				        var geometry = new THREE.SphereGeometry(R, 100, 100);  //球体
				        return createMesh(geometry, color);
				    }
				
				    function createRingMesh(r, color) {
				        var geometry = new THREE.SphereGeometry(r, 100, 100);
				
				        return createMesh(geometry, color);
				    }
				
				    function createringPlanetMesh(sphere_R, sphere_color, ring_r, ring_color) {
				        var centerMesh   = createSphereMesh(sphere_R,sphere_color);
				        var starLite = createRingMesh(ring_r,  ring_color);
				        var pivotPoint = new THREE.Object3D();
				        pivotPoint.add(starLite);
				        centerMesh.add(pivotPoint);
				
				        return centerMesh;
				    }
				
				    function circle(r) {
				        var arc = new THREE.ArcCurve(0, 0, r, 0, 2 * Math.PI, true); // 圆心  半径  起始角度
				        // 参数50表示曲线分割成几部分
				        //返回一个vector2对象作为元素组成的数组,如果是3D样条曲面返回的元素是三维向量vector3
				        var points = arc.getPoints(50);
				        var geometry = new THREE.Geometry();
				        //setFromPoints方法的本质：遍历points把vector2转变化vector3
				        geometry.setFromPoints(points);
				        var material = new THREE.LineBasicMaterial({
				            color: 0xDCDCDC
				        });
				        var line = new THREE.LineLoop(geometry, material);
				        line.rotateX(Math.PI / 2);//可以旋转圆弧线
				        return line;
				    }
				
				    function cloudFun() {
				        var geom = new THREE.Geometry();
				        var material = new THREE.ParticleBasicMaterial({
				            size: 0.01,
				            vertexColors: true
				        });
				        var n = 1200;
				        for (var i = 0; i < 3000; i++) {
				            var particle = new THREE.Vector3(
				                (Math.random() - 0.5) * n,
				                (Math.random() - 0.5) * n,
				                (Math.random() - 0.5) * n
				            );
				            geom.vertices.push(particle);
				            let color_k = Math.random();
				            geom.colors.push(new THREE.Color(color_k, color_k, color_k * 0.6));
				        }
				
				        var cloud = new THREE.ParticleSystem(geom, material);
				        return cloud
				    }
				    function data() {
				        let K = 5;
				        return {
				
				            sun: {
				                name: '太阳',
				                R: 10 * K,
				                color:'#FFDEAD',
				            },
				
				            planet: [ {
				
				                name: '金星',
				                R: 5 * K,
				                color:'#FF8C69',
				                revolutionR: 20 * K,
				            }, {
				
				                name: '地球',
				                R: 3.2 * K,
				                color: '#48D1CC',
				                revolutionR: 30 * K,
				            }, ],
				
				        };
				    }
			},
			onSubmit() {
				console.log('submit!');
			},
			    
		},
			    mounted () {
			      this.init()
			    }
	}
</script>


<style>
	 #container {
	    height: 500px;
	  }
	#wrap {
		display: block;
		bottom: 0px;
		right: 10px !important;
		right: 18px;
		width: 400px;
		line-height: 30px;
		position: fixed;
		text-align: center;
	}

	*html {
		overflow-x: auto;
		overflow-y: auto;
	}

	* html #wrap {
		position: absolute;
	}

	.el-row {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.el-col {
		border-radius: 4px;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}

	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
</style>
