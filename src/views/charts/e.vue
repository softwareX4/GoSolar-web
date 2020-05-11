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
				cube:null,
				cloudMesh:null,
				moonMesh:null,
				EarthGroup:null,
								
			}
		},
		methods: {
			     action() {
			        this.onload();
			        this.run();
			    },
			     onload() {
			        let container=document.getElementById("container");//获取container
			
			         this.scene=new THREE.Scene();//创建场景
			
			         this.camera=new THREE.PerspectiveCamera(45,container.offsetWidth/container.offsetHeight,1,4000);
			         this.camera.position.set(10,10,4.5);//创建相机并设置位置
			
			        //let axe=new THREE.AxesHelper(20);
			        //scene.add(axe);//辅助工具，用于创建相机时，相机找到合适的位置
			
			         this.EarthGroup=new THREE.Group();//创建群组，用来存放地球和大气层
			
			
			        let pointLight=new THREE.PointLight();//创建点光源
			        pointLight.position.set(4,2,4);//设置光源的位置
			        pointLight.intensity=1.5;//设置光强
			         this.scene.add(pointLight);
			
			
			        let geometry=new THREE.SphereGeometry(1,32,32);//创建一个球
			        let textureLoader=new THREE.TextureLoader();
			        let material=new THREE.MeshPhongMaterial({color:0x48D1CC});
			         geometry.computeTangents();//为着色器计算切线
			         this.cube=new THREE.Mesh(geometry,material);//将几何体和材料放到网格中
			        //cube.rotation.x=Math.PI/5;
					this.cube.position.set(1,0,1);
			         this.EarthGroup.add( this.cube);
					 
					 var axisHelper=new THREE.AxisHelper();//每个轴的长度
					 this.scene.add(axisHelper);
					 var line = this.circle(1,1,2);
					 this.EarthGroup.add(line);
			
			        let cloudGeometry=new THREE.SphereGeometry(0.1,32,32);//创建大气层所在的球面
			        let cloudMaterial=new THREE.MeshLambertMaterial({color:0xFF8C69,transparent:true});
			         this.cloudMesh=new THREE.Mesh(cloudGeometry,cloudMaterial);
			         this.EarthGroup.add( this.cloudMesh);
			         this.scene.add( this.EarthGroup);//把群组添加到场景中 
			
			        let moonGeometry=new THREE.SphereGeometry((1/3.7*1.2),32,32);//创建月球
			        let moonMaterial=new THREE.MeshPhongMaterial({color:0xFFDEAD,ambient:0x888888});
			         this.moonMesh=new THREE.Mesh(moonGeometry,moonMaterial);
			        let distance=5;//转换成为地球尺度的单位（把地球当作单位球体）
					/* 
			        var eVector = new THREE.Vector3(
			            this.cube.position.x+1,
			            this.cube.position.y,
			            this.cube.position.z-1
			        );
					this.moonMesh.rotation = eVector;
					 */
					
			         this.moonMesh.position.set(Math.sqrt(distance/2),0,-Math.sqrt(distance/2));//(7.5,0,-7.5)
			         this.moonMesh.rotation.y=Math.PI;
			         this.MoonGroup=new THREE.Group();//创建月球群组，用于存放地球
			         this.MoonGroup.add( this.moonMesh);
			         this.moonMesh.rotation.x=0.089;//向黄道面倾斜
			         this.scene.add( this.MoonGroup);//把群组添加到场景中
			
			
			
			         this.renderer=new THREE.WebGLRenderer({antialias:true});
			         this.renderer.setPixelRatio(window.devicePixelRatio);
			         this.renderer.setSize(container.offsetWidth,container.offsetHeight);
					 
					 this.renderer.setClearColor(0xF5F5F5, 1);
			        container.appendChild( this.renderer.domElement);
			
			        let contorl=new THREE.OrbitControls( this.camera, this.renderer.domElement);//添加鼠标滚动缩放，旋转对象
			
			
			    },
			
			     run() {
			
			        requestAnimationFrame(this.run);
			         //this.cloudMesh.rotation.y+=0.0002;
			         this.cube.rotation.y+=0.0025;
			         this.moonMesh.rotation.y+=0.0025/28;//月球自转28为月球绕地球转的周期
			         this.MoonGroup.rotation.y+=0.1;//月球公转
			         this.renderer.render(this.scene,this.camera);
			
			    },
				
				 circle(cx,cy,r) {
				    var arc = new THREE.ArcCurve(cx, cy, r, 0, 2 * Math.PI, true); // 圆心  半径  起始角度
					
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
				
				//通过x,y,z指定旋转中心，obj是要旋转的对象
			/* 	 changePivot(x,y,z,obj){
				   let wrapper = new THREE.Object3D();
				         wrapper.position.set(x,y,z);
				        wrapper.add(obj);
				        obj.position.set(-x,-y,-z);
				        return wrapper;
				}, */
			    
		},
			    mounted () {
			    this.action();
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
