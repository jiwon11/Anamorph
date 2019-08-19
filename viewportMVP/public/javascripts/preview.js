const gltfPreview = document.querySelector('#gltfPreview');
var gltfUrl, camera, controls;
var uploadDataGltf = document.getElementById('gltfInp').files;
for(var i=0; i<uploadDataGltf.length;i++) {
  if((uploadDataGltf[i]['name'].match(/\.(gltf|glb)$/))) {
    gltfUrl = uploadDataGltf[i]['name'];
  }
}
const width  = 1280;//window.innerWidth;
const height = 720;//window.innerHeight;

var modelduration = 0;
var playtime = 0;
// Create renderer, add to DOM
const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(width, height);
renderer.setClearColor("#1f1f1f", 1.0);
gltfPreview.appendChild(renderer.domElement);

// Create scenes, create and add cameras, create and add lights
const scene  = new THREE.Scene();
const light  = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const grid   = new THREE.GridHelper(50,50);

var blobs = {};
var gltfName;
for(var i=0; i<uploadDataGltf.length;i++) {
  if(uploadDataGltf[i]['name'].match(/\.(gltf|glb)$/)) {
    blobs[`${uploadDataGltf[i]['name']}`] = uploadDataGltf[i];
    gltfName = uploadDataGltf[i]['name'];
  } else {
    blobs[`${uploadDataGltf[i]['webkitRelativePath']}`] = uploadDataGltf[i];
  }
}

var files_length = Object.keys(blobs).length;
if(files_length===1) {
  gltfUrl = URL.createObjectURL(blobs[gltfName]);
  var gltfLoader = new THREE.GLTFLoader();
} else {
  var relativePath = uploadDataGltf[0].webkitRelativePath;
  var folder = relativePath.split("/");
  const rootPath = folder[0];

  const manager = new THREE.LoadingManager();
  var objectURLs = [];
  manager.setURLModifier(( url ) => {
  var normalizedURL = url.replace('./',`${rootPath}/`);
  bloburl = URL.createObjectURL( blobs[ normalizedURL ] );
  objectURLs.push( bloburl );
    return bloburl;
    });
    var gltfLoader = new THREE.GLTFLoader(manager);
}

gltfLoader.setCrossOrigin('anonymous');
THREE.DRACOLoader.setDecoderPath( '../draco/' );
gltfLoader.setDRACOLoader( new THREE.DRACOLoader() );
THREE.DRACOLoader.getDecoderModule();
gltfLoader.load(gltfUrl,(gltf) => {
  console.log(gltf);
  if(document.getElementById('assetTitle').value.length === 0) {
    document.getElementById('assetTitle').value = gltf.asset.extras.title;
  }
  document.getElementById('assetAuthor').value = gltf.asset.extras.author;
  const object = gltf.scene;
  object.castShadow = true;
  object.receiveShadow =  true;
  if (gltf.cameras && gltf.cameras.length){
    camera = gltf.cameras[0];
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    }else{
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 0, 15, 25 );
    controls = new THREE.OrbitControls(camera, renderer.domElement);
  }
  controls.userPan = false;
  controls.userPanSpeed = 0.0;
  controls.maxDistance = 10000.0;
  controls.minDistance = 1.0;
  controls.maxPolarAngle = Math.PI * 1;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 1.0;
  controls.screenSpacePanning = true;
  controls.update();
  camera.lookAt(object.position);
  skeleton = new THREE.SkeletonHelper( object );
  skeleton.visible = false;
  scene.add( skeleton );
  const animations = gltf.animations;
  if (animations && animations.length) {
    var i;
    mixer = new THREE.AnimationMixer(object);
    for (i = 0; i < animations.length; i ++ ) {
      modelduration = animations[i].duration;
      mixer.clipAction(animations[i]).play();
    }     
  }
  scene.add(object);
  objectURLs.forEach( ( url ) => URL.revokeObjectURL( url ) );
});

const clock  = new THREE.Clock();
let mixer;
stats = new Stats();
stats.domElement.style.position="absolute";
stats.domElement.style.float="left";
stats.domElement.style.display="inline";
stats.domElement.style.zi=1000;
stats.domElement.classList.add("stats");
stats.domElement.style.left='0px';
gltfPreview.appendChild( stats.domElement );

const animation = () => {
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.render(scene, camera);
  if (mixer) {
    mixer.update(clock.getDelta());
    mixer._actions[0]; // accessor of model's animation(AnimationAction) :: paused: false, repetitions: Infinity control 
    stats.update();
  }
  requestAnimationFrame(animation);
};
animation();