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
				scene:null,
				camera:null,
				renderer:null,
				width:null,
				height:null,
				cloud:null,
				intersectsArr:[],
				planetGroup:null,
				chooseMesh:null,
				img:'',
				clock:null,
				FPS:30,
				fresh:null,
				timeS:0,
				K : 5,
				sun: {
				    name: '太阳',
				    R: 50,
				    color:'#FFDEAD',
				},
								
				planet: [ {
								
				    name: '金星',
				    R: 25,
				    color:'#FF8C69',
				    revolutionR: 100,
				}, {
								
				    name: '地球',
				    R: 16,
				    color: '#48D1CC',
				    revolutionR: 150,
				}, ],
								
			}
		},
		methods: {
			//构建初始场景
			initScene:function(){		
				this.clock = new THREE.Clock();				
				this.fresh = 1 / this.FPS;
				
				let container = document.getElementById('container');
				this.scene = new THREE.Scene();
				
				this.width = container.clientWidth;
				this.height = container.clientHeight;
				var k = this.width / this.height;
				var s = 310;
				/* 正交摄像机，left，right，top，bottom，near，far。
								left和right设置的值必须位于摄像机position中x坐标的两侧
								top，bottom位于摄像机position坐标y值两边
								在设置这四个参数的时候，
								left与right之间的距离和top与bottom之间的距离的比例一定要和原始的canvas画布比例相等，
								不然会导致投影的物体形状变形
				 */
				    this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1500);
				    this.camera.position.set(651, 613, 525);
				    this.camera.lookAt(this.scene.position);				
				
				    var point = new THREE.PointLight(0xffffff);
				    point.position.set(400, 200, 300);
				    this.scene.add(point);				
				
				    var ambient = new THREE.AmbientLight(0x444444);
				    this.scene.add(ambient);				
				
				    this.renderer = new THREE.WebGLRenderer({
				        antialias: true
				    });
				    this.renderer.setSize(this.width, this.height);
				    this.renderer.setClearColor(0xF5F5F5, 1);
				    container.appendChild(this.renderer.domElement);
					this.initPlanet();
					
			},
			initPlanet:function(){											
				this.cloud = this.cloudFun();
				this.scene.add(this.cloud);
				
				var sun = this.createSphereMesh(this.sun.R, this.sun.color);
				sun.name = this.sun.name;
				this.intersectsArr.push(sun);
				this.scene.add(sun);
				
				this.planetGroup = new THREE.Group();
				 this.scene.add(this.planetGroup);
				
				this.planet.forEach((obj) => {
				    var planet = null;
				    if (obj.ring) {
				        planet =  this.createringPlanetMesh(obj.sphere.R, obj.sphere.color, obj.ring.r, obj.ring.color)
				    } else {
				        planet =  this.createSphereMesh(obj.R, obj.color);
				    }
				    planet.revolutionR = obj.revolutionR;
					console.log(obj);
				    planet.angle = 2 * Math.PI * Math.random();
				    planet.name = obj.name;
				    this.planetGroup.add(planet);
				    this.intersectsArr.push(planet);
					 planet.position.set(planet.revolutionR * Math.sin(planet.angle), 0, planet.revolutionR * Math.cos(planet.angle));
						console.log(planet.position);
						var line =  this.circle(planet.position.x,planet.position.z,planet.revolutionR);
						this.scene.add(line);	
					console.log(planet);
				});
				
				this.img = document.createElement("img");
				document.body.appendChild(this.img)
				this.img.style.position = 'absolute';
				this.img.style.display = 'block';
				
								
			},
			animate : function(){			
				this.render();
			}, 
			
			 render() {
			    //sun.rotation.y += 0.01;
			    var interval = this.clock.getDelta();
			     this.timeS =  this.timeS + interval;
			    if ( this.timeS >  this.fresh) {
			        this.renderer.render(this.scene, this.camera);
			         this.timeS = 0;
			   }/* 
			    this.planetGroup.children.forEach(function(obj) {
			        //以下两行是控制旋转的
			        //obj.rotation.y += 0.01;
			        //obj.angle += 0.005 / obj.revolutionR * 400;
			        obj.position.set(obj.revolutionR * Math.sin(obj.angle), 0, obj.revolutionR * Math.cos(obj.angle));
					
					var line =  this.circle(obj.position.x,obj.position.z,obj.revolutionR);
					this.scene.add(line);
					
			    }) */
			    this.cloud.rotation.x += 0.0002;
			    this.cloud.rotation.y += 0.0002;
			    this.cloud.rotation.z += 0.0002;
							
			    requestAnimationFrame(this.render);
							
			    if (this.chooseMesh) {
			        var worldVector = new THREE.Vector3(
			            this.chooseMesh.position.x,
			            this.chooseMesh.position.y,
			            this.chooseMesh.position.z
			        );
			        var standardVector = worldVector.project(this.camera);
			        var a = this.width / 2;
			        var b = this.height / 2;
			        var x = Math.round(standardVector.x * a + a);
			        var y = Math.round(-standardVector.y * b + b);
							
			        this.img.style.left = x + 'px';
			        this.img.style.top = y  + 10 + 'px';
			    }
			},
			control:function(){
				var controls = new THREE.OrbitControls(this.camera,this.renderer.domElement);
				
				addEventListener('click', this.choose,false);
			},
			
			 choose(event) {
			    this.img.src = '';
			    this.chooseMesh = null;
			    var Sx = event.layerX;
			    var Sy = event.layerY;
							
			    var x = (Sx / this.width) * 2 - 1;
			    var y = -(Sy / this.height) * 2 + 1;
							
			    var raycaster = new THREE.Raycaster();
			    raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
			    var intersects = raycaster.intersectObjects(this.intersectsArr, false);
			    if (intersects.length > 0) {
							
			        console.log(intersects[0].object.name);					
			        this.img.src = require('@/assets/tip.png');
			        this.chooseMesh = intersects[0].object
			    }
			},
							
			 createMesh(geometry, color) {
							
			    var material = new THREE.MeshBasicMaterial({
			        color:color,
			    });
			    var mesh = new THREE.Mesh(geometry, material);
				console.log(mesh.position);
			    return mesh;
			},
							
			 createSphereMesh(R, color) {
			    var geometry = new THREE.SphereGeometry(R, 100, 100);  //球体
			    return  this.createMesh(geometry, color);
			},
							
			 createRingMesh(r, color) {
			    var geometry = new THREE.SphereGeometry(r, 100, 100);							
			    return  this.createMesh(geometry, color);
			},
							
			 createringPlanetMesh(sphere_R, sphere_color, ring_r, ring_color) {
			    var centerMesh   =  this.createSphereMesh(sphere_R,sphere_color);
			    var starLite =  this.createRingMesh(ring_r,  ring_color);
			    var pivotPoint = new THREE.Object3D();
			    pivotPoint.add(starLite);
			    centerMesh.add(pivotPoint);
							
			    return centerMesh;
			},
							
			 circle(cx,cy,r) {
			    var arc = new THREE.ArcCurve(cx,cy, r, 0, 2 * Math.PI, true); // 圆心  半径  起始角度
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
			},
							
			 cloudFun() {
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
			},
			onSubmit() {
				console.log('submit!');
			},
			    
		},
		beforeMount(){
		},
			    mounted () {
				this.initScene();
			      this.animate();
				  this.control();
				  
				  window.onresize = function() {
				      this.renderer.setSize(this.width, this.height);
					  
					  var s = 310;
				      var k = (this.width) / (this.height);
				      this.camera.left = -s * k;
				      this.camera.right = s * k;
				      this.camera.top = s;
				      this.camera.bottom = -s;
				      this.camera.updateProjectionMatrix();
				  }
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
