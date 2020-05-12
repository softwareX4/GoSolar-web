<template>
	<section>
		<div>
			<el-row>
				<el-col :span="24">
					<div style="margin-top: 15px;">
						<el-input placeholder="eg:github.com/golang/go" autofocus="true" v-model="address">
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

		<div id="container" v-loading="listLoading">
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
	import {
		getAnalysor,
	} from '../../api/api';
	import Util from '../../common/js/util'

	export default {
		data() {
			return {

				listLoading: false,
				address: 'G:\\AAApersonal\\毕设\\project\\kubernetes-master\\pkg\\controller\\apis',
				root: '',
				scene: null,
				camera: null,
				renderer: null,
				lookPos:null,
				width: null,
				height: null,
				cloud: null,
				intersectsArr: [],
				planetGroup: null,
				chooseMesh: null,
				img: '',
				clock: null,
				FPS: 30,
				fresh: null,
				timeS: 0,
				
				
			}
		},
		methods: {
			//请求后台数据
			onSubmit() {

				let para = {
					path: this.address,
				};
				this.listLoading = true;
				getAnalysor(para).then((res) => {

					let {
						code,
						msg,
						data
					} = res.data;
					this.listLoading = false;
					//NProgress.done();						

					if (code !== 200) {
						this.$message({
							message: msg,
							type: 'error',
						});
					} else {
						this.$message({
							message: '解析成功',
							type: 'success'
						});
						this.root = res.data.data;
						console.log(this.root);
						console.log(this.root.nodeEntity.name);
						
					/* 	var rootGroup = new THREE.Group();
						this.scene.add(rootGroup);
						this.traverse(this.root,rootGroup);
						this.adjustCameraPos(rootGroup); */
						var pivotPoint = new THREE.Object3D();
						this.scene.add(pivotPoint);
						this.traverse(this.root,pivotPoint);
						this.adjustCameraPos(pivotPoint);
					}
				});
			},
			
			init:function(){
				this.initScene();
				this.initPlanet();
				this.render();
				this.control();
			},
			
			//初始化场景组件
			initScene: function() {
				this.clock = new THREE.Clock();
				this.fresh = 1 / this.FPS;
				
				let container = document.getElementById('container');
				this.scene = new THREE.Scene();
				
				this.width = container.clientWidth;
				this.height = container.clientHeight;

				//this.camera = new THREE.PerspectiveCamera(50, 1, 1, 100000);
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
				
			},
			
			
			initPlanet:function(){											
				this.cloud = this.cloudFun();
				this.scene.add(this.cloud);	/* 
				var rootGrouop = new THREE.Group();
				this.scene.add(rootGrouop);
				this.traverse(this.root,rootGrouop); */
				this.adjustCameraPos(this.cloud);
								
			},
			
			//渲染器
			 render : function() {
				 
			    var interval = this.clock.getDelta();
			     this.timeS =  this.timeS + interval;
			    if ( this.timeS >  this.fresh) {
			        this.renderer.render(this.scene, this.camera);
			         this.timeS = 0;
			   }
			   
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
							/* 
				    this.img.style.left = x + 'px';
				    this.img.style.top = y  + 10 + 'px'; */
				}
			},
			
			
			//控制器
			control:function(){
				var controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
				controls.target = this.lookPos;
				this.camera.lookAt(this.lookPos);
				addEventListener('click', this.choose,false);
			},
			choose(event) {
				
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
			        this.chooseMesh = intersects[0].object
			    }
			},
			
			//调整相机的位置使能够看到全部物体
			adjustCameraPos:function(mod){				
				var boxHelper = new THREE.BoxHelper();
				boxHelper.setFromObject(mod);
				var center = boxHelper.geometry.boundingSphere.center;
				var radius = boxHelper.geometry.boundingSphere.radius;
				var cameraPos = new THREE.Vector3(center.x + mod.position.x, center.y + mod.position.y, radius * 2.2 + center.z +
					mod.position.z);
				this.lookPos = new THREE.Vector3(center.x + mod.position.x, center.y + mod.position.y, center.z + mod.position.z);
				this.camera.position.copy(cameraPos);
				
			},
			
			//创建星云
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
			
			
			//行星属性映射
			getColor:function(node){
				var loc = 0;
				if(node.type !== Util.TYPE.P) 
					loc = node.feature.loc;
				var color = Util.getProportionalColor(
				  Util.colors[node.type-1].start,
				  Util.colors[node.type-1].end,
				  Math.min(100, loc / 2000.0)
				);			
				return color;
			},
			
			
			
			//画轨道
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
			
			//创建网格对象
			//color是RGB格式
			createMesh(geometry, color) {
				 
			    var material = new THREE.MeshBasicMaterial({
			        color:new THREE.Color( color.r / 255, color.g / 255, color.b / 255 ),
			    });				
			    var mesh = new THREE.Mesh(geometry, material);
			    return mesh;
			},
			
			//创建球体
			 createSphereMesh(R, color) {
			    var geometry = new THREE.SphereGeometry(R, 100, 100);  //球体
			    return  this.createMesh(geometry, color);
			},
			
			/* 
			//为节点创建行星，若有子节点，加轨道
			//以父节点为中心，返回一个子群
			createchild(parentGroup,node,revolutionR){				
				var color = this.getColor(node.nodeEntity);		
				var methods = node.nodeEntity.type == Util.TYPE.P ? 5 : node.nodeEntity.feature.methods;
				var planet = this.createSphereMesh(methods,color);
				//创建子群
				var planetGroup = new THREE.Group();
				planetGroup.add(planet);
				
				planet.name = node.nodeEntity.name;
				//环绕半径
				planet.revolutionR = revolutionR;
				planet.angle = 2 * Math.PI * Math.random();
				
				
				parentGroup.add(planetGroup);	
							
				planet.position.set(planet.revolutionR * Math.sin(planet.angle), 0, planet.revolutionR * Math.cos(planet.angle));
				console.log(planet.position);
				//if(node.childNodes !== null){					
					var line =  this.circle(planet.position.x,planet.position.z,planet.revolutionR);
					planetGroup.add(line);
				//}
				return planetGroup;
			},
			
			//遍历
			traverse(root,rootGroup){
				var group = this.createchild(rootGroup,root,50);
				rootGroup.add(group);
				if(root.childNodes == null){
					return;
				}
				else{
					root.childNodes.forEach((child) => {
					    this.traverse(child,group);
					});
				}
			}, */
				
			//为节点创建行星，若有子节点，加轨道
			//以父节点为中心，返回一个子群
			createchild(parent,node,revolutionR){				
				var color = this.getColor(node.nodeEntity);		
				var methods = node.nodeEntity.type == Util.TYPE.P ? 2 : node.nodeEntity.feature.methods;
				methods = methods == 0 ? 0.5 : methods;
				var planet = this.createSphereMesh(methods,color);
				
				
				planet.name = node.nodeEntity.name;
				//环绕半径
				planet.revolutionR = revolutionR;
				planet.angle = 2 * Math.PI * Math.random();
				
				parent.add(planet);	
							
				planet.position.set(planet.revolutionR * Math.sin(planet.angle), 0, planet.revolutionR * Math.cos(planet.angle));
				console.log(planet.position);
				if(node.childNodes !== null){					
					var line =  this.circle(planet.position.x,planet.position.z,planet.revolutionR);
					parent.add(line);
				}
				return planet;
			},
			//遍历
			traverse(root,rootPlanet){
				var childPlanet = this.createchild(rootPlanet,root,10);
				rootPlanet.add(childPlanet);
				if(root.childNodes == null){
					return;
				}
				else{
					root.childNodes.forEach((child) => {
					    this.traverse(child,childPlanet);
					});
				}
			},
				
			 

		},
		
		
		mounted() {
			this.init();
			
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
