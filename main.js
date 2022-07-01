import * as THREE from 'three'
import { MeshBasicMaterial } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';


const scene = new THREE.Scene();

 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight , 0.1 , 1000);


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha:false,
  antialias:true
});

const controls = new OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI / 2.1;
controls.enableDamping = true;   
controls.dampingFactor = 0.25;
controls.enableZoom = false

renderer.setPixelRatio(window.devicePixelRatio)

renderer.setSize(window.innerWidth,window.innerHeight);

renderer.toneMapping = THREE.LinearToneMapping
renderer.toneMappingExposure = 1.5
renderer.shadowMap = true

camera.position.set(4,4,-4);

camera.lookAt(-6,0,0)


const pl = new THREE.PointLight(0xffffff ,0.5,10)
pl.position.y = 1
pl.castShadow = true
scene.add(pl)



const al = new THREE.PointLight(0xffffff ,0.4,20)
al.position.y = 1
al.castShadow = true
scene.add(al)

const loader = new GLTFLoader()
loader.load('/house/house.gltf',(gltf)=>{
  const home = gltf.scene
  home.castShadow = true; 
  home.children.map(n=>{
    n.castShadow = true
    n.receiveShadow = true
  })
  scene.add(home)
  document.getElementById("loading").innerText = ""
  document.getElementById("info").innerText = "DRAG TO VIEW AROUND"
})


const starVertices = []
for (let i = 0;i < 1000000;i++){
  const x = (Math.random() - 0.5) * 90
  const y = Math.random() * 80
  const z = (Math.random() - 0.5) * 90
  starVertices.push(x,y,z)
}
const starGeometry = new THREE.SphereGeometry(30)

const starMaterial = new THREE.MeshBasicMaterial({color:0xffffff})

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices,3))

const stars = new THREE.Points(starGeometry,starMaterial)
scene.add(stars)



const moon = new THREE.Mesh(new THREE.SphereGeometry(1),new MeshBasicMaterial({color:0xffffff}))
moon.position.set(50,30,-50)
scene.add(moon)


const composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

const imagePass = new UnrealBloomPass( new THREE.Vector2(1024*4,1024*4),0.3);
//composer.addPass( imagePass );



const tick = () =>{

  window.requestAnimationFrame(tick)

  

  controls.update()
  

  composer.render();
}
tick()

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}