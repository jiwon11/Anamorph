// get width, height
const anime_button = document.getElementById('anime_button');
const processNow = document.getElementById('processNow');
const webViewer = document.querySelector('.webViewer');
const animeName = document.querySelector('#animeName');
const width  = 1280;//window.innerWidth;
const height = 720;//window.innerHeight;


var modelduration = 0;
var playtime = 0;
// Create renderer, add to DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor("#222222", 1.0);
webViewer.appendChild(renderer.domElement);
const viewer = document.querySelector('canvas');



// Create scenes, create and add cameras, create and add lights
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, width / height, 1, 100 );
camera.position.set(10,10,10);
const light  = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// Create and add meshes

const grid   = new THREE.GridHelper(1000, 500);
scene.add(grid);

const loader = new THREE.GLTFLoader();

const url = 'public/GLTF/scene.gltf';
loader.setCrossOrigin();
loader.load(url, (data) => {
  const gltf = data;
  gltf.scene.scale.set(0.3,0.3,0.3);
  const object = gltf.scene;
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

});

// OrbitControls Add
const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.userPan = false;
controls.userPanSpeed = 0.0;
controls.maxDistance = 10000.0;
controls.minDistance = 1.0;
controls.maxPolarAngle = Math.PI * 0.495;
controls.autoRotate = false;
controls.autoRotateSpeed = 1.0;

//Now that the controls.autoRotate = true; the camera will automatically rotate. 
//Mouse drag and arrow keys are also available.

const clock  = new THREE.Clock();
let mixer;
stats = new Stats();
stats.domElement.style.position="relative";
stats.domElement.style.float="left";
stats.domElement.style.display="inline";
stats.domElement.style.top=`-${height}px`;
webViewer.appendChild( stats.domElement );


// rendering
const animation = () => {
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
    stats.update();
    processNow.innerHTML = `${processTime.toFixed(2)} / ${modelduration.toFixed(2)}`;
  }

  requestAnimationFrame(animation);
  
  };
  animation();

  