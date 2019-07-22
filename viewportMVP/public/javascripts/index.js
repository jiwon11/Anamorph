// get width, height
const anime_button = document.getElementById('anime_button');
const processNow = document.getElementById('processNow');
const webViewer = document.querySelector('.webViewer');
const animeName = document.querySelector('#animeName');
const viewer = document.querySelector('.viewer');
const timeSlider = document.querySelector('#timeSlider');
const infor = document.querySelector('.infor');
const width  = 1280;//window.innerWidth;
const height = 720;//window.innerHeight;

var modelduration = 0;
var playtime = 0;
// Create renderer, add to DOM
const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(width, height);
renderer.setClearColor("#1f1f1f", 1.0);
viewer.appendChild(renderer.domElement);
webViewer.appendChild(viewer);


// Create scenes, create and add cameras, create and add lights
const scene  = new THREE.Scene();
function showbg() {
  scene.background = new THREE.TextureLoader().load('https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg');
}
function nonshowbg() {
  scene.background = null;
}
const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000 );
camera.position.set(30,30,30);
const light  = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);


const grid   = new THREE.GridHelper(50,50);


var loader = new THREE.GLTFLoader();
const url = model;
loader.setCrossOrigin();


loader.load(url, (data) => {
  const gltf = data;
  const object = gltf.scene;
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
  timeSlider.max=modelduration.toFixed(2);
});

function showSkeleton() {
  skeleton.visible = true;
}
function nonShowSkeleton() {
  skeleton.visible = false;
}
function showGrid() {
  scene.add(grid);
  grid.visible = true;
}
function nonShowGrid() {
  grid.visible = false;
}
function modifyTimeScale(timeScale) {
  mixer.timeScale = timeScale;
}
// OrbitControls Add
const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.userPan = false;
controls.userPanSpeed = 0.0;
controls.maxDistance = 10000.0;
controls.minDistance = 1.0;
controls.maxPolarAngle = Math.PI * 1;
controls.autoRotate = false;
controls.autoRotateSpeed = 1.0;
controls.screenSpacePanning = true;

//Now that the controls.autoRotate = true; the camera will automatically rotate. 
//Mouse drag and arrow keys are also available.

const clock  = new THREE.Clock();
let mixer;
stats = new Stats();
stats.domElement.style.position="absolute";
stats.domElement.style.float="left";
stats.domElement.style.display="inline";
stats.domElement.style.zIndex=1000;
stats.domElement.classList.add("stats");
stats.domElement.style.left='0px';
viewer.appendChild( stats.domElement );

function startAt(startTime) {
  startTime = Number(startTime);
  mixer._actions[0].reset();
  mixer.update(startTime);
}
// rendering
const animation = () => {
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.render(scene, camera);
  controls.update();
  if (mixer) {
    mixer.update(clock.getDelta());
    // mixer._actions[0] --> accessor of model's animation(AnimationAction) :: paused: false, repetitions: Infinity control 
    var processTime = mixer._actions[0].time;
    animeName.innerHTML = `Animation : ${mixer._actions[0]._clip.name}`;
    if(anime_button.value==='pause') {
      anime_button.addEventListener('click', function () {
        mixer._actions[0].paused=true;
        anime_button.value="restart";
        anime_button.innerHTML = `<i class="play circle icon"></i>`;
      });
    } else {
      anime_button.addEventListener('click', function () {
        mixer._actions[0].paused=false;
        anime_button.value="pause";
        anime_button.innerHTML = `<i class="pause circle icon"></i>`;
      });
    }
    if(processTime.toFixed(2)<10){
      processNow.innerHTML = `0${processTime.toFixed(2)} / ${modelduration.toFixed(2)}`;
    } else {
      processNow.innerHTML = `${processTime.toFixed(2)} / ${modelduration.toFixed(2)}`;
    }
    timeSlider.value=processTime.toFixed(2);
    console.log();
    stats.update();
  }

  requestAnimationFrame(animation);
  
  };
  animation();

  