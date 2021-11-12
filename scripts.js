import * as THREE from './build/three.module.js';
import { OrbitControls } from './js/OrbitControls.js';
import { RGBELoader } from './js/RGBELoader.js';
import { GLTFLoader } from './js/GLTFLoader.js';
import Stats from './js/stats.module.js';
import { GUI } from './js/dat.gui.module.js';
import { RectAreaLightHelper } from './js/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from './js/RectAreaLightUniformsLib.js';
import { FlakesTexture } from './js/FlakesTexture.js';
import { EffectComposer } from './js/postprocessing/EffectComposer.js';
import { RenderPass } from './js/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './js/postprocessing/UnrealBloomPass.js';



let scene, camera, renderer, control, duck;
let container1, conteiner2, conteiner3, conteiner4;
let sun;
let timer;
let mixer,bark;
let  ringDisk ;
let stats;



init();


function init(){
	scene = new THREE.Scene();

	
	container1 = new THREE.Object3D();  //Block for visible rings
	conteiner2 = new THREE.Object3D();  //Ligtht block fot mobile vertion
	conteiner3 = new THREE.Object3D();	//Block for rectangle ligth
	conteiner4 = new THREE.Object3D();	//Global block
	scene.add(container1, conteiner3, conteiner4,conteiner2);


	addRec(0,0,0,0);
	addRec(0,0,-8,Math.PI);
	addRec(0,-4,-4,Math.PI/2);
	addRec(0,4,-4,-Math.PI/2);
    RectAreaLightUniformsLib.init(); //Rectangle area ligth init

	conteiner3.rotation.set(0,-Math.PI/2,0);
	conteiner3.position.set(-4,0,0);
	container1.add(conteiner3);
	//container1.position.y=20; 

	


	
	camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 0, 5 );
	camera.lookAt(0,0,0);
	

	const container = document.getElementById( 'canvas' );


	renderer = new THREE.WebGLRenderer( { alpha:false, antialias: false } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	

	
	control = new OrbitControls(camera, renderer.domElement);
	
	control.update();
	

	const hdri = new RGBELoader();
	const cubeloader = new THREE.CubeTextureLoader();
	hdri.load( './img/global_env_2.hdr', function ( texture ) { //load hdri for model
	//cubeloader.load( ['./img/cubemap/px.jpg', './img/cubemap/nx.jpg', './img/cubemap/py.jpg', './img/cubemap/ny.jpg', './img/cubemap/pz.jpg','./img/cubemap/nz.jpg'], function ( texture ) { //load hdri for model
		//FAKE
		texture.mapping = THREE.EquirectangularReflectionMapping;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapP = THREE.RepeatWrapping;
		let geo = new THREE.SphereGeometry(2, 256,96);
		let mat = new THREE.MeshStandardMaterial({
			envMap: texture,
			color: 0xffffff,
			metalness:1,
			roughness: 0.16
			
		});
		let mm = new THREE.Mesh(geo, mat);
		scene.add(mm);
	})

	
	stats = new Stats();
	document.body.appendChild( stats.dom );


	animate();
}


function animate(){
	render();
	control.update();
	stats.update();
	requestAnimationFrame(animate);	
}


function render(){


	timer = Date.now() * 0.00003;
	

	container1.rotation.x+= 0.01;
	container1.rotation.y+= 0.01;
	

	container1.rotation.z += 0.0011;

	
	renderer.render(scene, camera);
	
}

//Add rectangle ligth block side
function addRec(x,y,z,r){
	const rectLight = new THREE.RectAreaLight( 0xffffff, 5, 1, 8 );
	rectLight.position.set(x, y, z );
	rectLight.rotation.set(r, 0,0 );
	conteiner3.add(rectLight);

	//const rectLightHelper = new RectAreaLightHelper( rectLight );
	//rectLight.add( rectLightHelper );
}
