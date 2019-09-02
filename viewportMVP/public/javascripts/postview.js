var zipfile = document.getElementById('zipfile').value;
zipfile = JSON.parse(zipfile);
console.log(zipfile);

function convertDataURIToBinary(dataURI) {
  var raw = atob(dataURI);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));
  for(var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

var blobs = {};
for(var i=0;i<zipfile.length;i++){
  console.log(zipfile[i].name);
  var type;
  var blob;
  if(zipfile[i].type.match(/(jpeg|jpg|png)$/)){
    type = zipfile[i].type;
    var data = convertDataURIToBinary(zipfile[i].data);
    blob = URL.createObjectURL(new Blob([data],{type:type}));
    blobs[zipfile[i].name] = blob;
  } else {
    type = '';
    if(zipfile[i].type.match(/(bin)$/)){
      var data = convertDataURIToBinary(zipfile[i].data);
      blob = URL.createObjectURL(new Blob([data],{type:type}));
      blobs[zipfile[i].name] = blob;
    } else {
      blob = URL.createObjectURL(new Blob([atob(zipfile[i].data)],{type:type}));
      blobs[zipfile[i].name] = blob;
    }
  }
}
console.log(blobs);

  var gltfUrl;
  var folderName;
  var gltfName;
  for(var element in blobs) {
    if((element.match(/\.(gltf|glb)$/))) {
      gltfName = element;
      var fullname = element.split("/");
      folderName = fullname[0];
      gltfUrl = fullname[fullname.length - 1];
    }
  }
  console.log(`GLTF : ${gltfUrl}`);
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

  const renderer = new THREE.WebGLRenderer({alpha:true, preserveDrawingBuffer: true});
  renderer.setSize(width, height);
  renderer.setClearColor("#1f1f1f", 1.0);
  viewer.appendChild(renderer.domElement);
  
  //Create scenes, create and add cameras, create and add lights
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000 );
  camera.position.set(30,30,30);
  const light  = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  const grid   = new THREE.GridHelper(50,50);
  var gltfLoader;
  var files_length = Object.keys(blobs).length;
  const manager = new THREE.LoadingManager();
  var objectURLs = [];
  if(files_length===1) {
    gltfName = blobs[gltfName];
    gltfLoader = new THREE.GLTFLoader();
  } else {
      manager.setURLModifier(( url ) => {
        console.log(`gltfLoader Manager's url : ${url}`);
        console.log(`Containing a URL representing uri's blobs : ${blobs[ url ]}`);
        bloburl = blobs[ url ];
        objectURLs.push( bloburl );
      return bloburl;
      });
      gltfLoader = new THREE.GLTFLoader(manager);
  }

  gltfLoader.setCrossOrigin('anonymous');
  THREE.DRACOLoader.setDecoderPath( '../draco/' );
  gltfLoader.setDRACOLoader( new THREE.DRACOLoader() );
  THREE.DRACOLoader.getDecoderModule();
  gltfLoader.load(gltfName,(gltf) => {
    console.log(gltf);
    const object = gltf.scene;
    object.castShadow = true;
    object.receiveShadow = true;
    if(object.position.x ===0&&object.position.y===0&&object.position.z===0) {
      object.position.set(0,-7,0);
      grid.position.set(0,-7,0);
    }
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
    objectURLs.forEach( ( url ) => URL.revokeObjectURL( url ) );
  });
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

  const clock  = new THREE.Clock();
  let mixer;
  stats = new Stats();
  stats.domElement.style.position="absolute";
  stats.domElement.style.float="left";
  stats.domElement.style.display="inline";
  stats.domElement.style.zi=1000;
  stats.domElement.classList.add("stats");
  stats.domElement.style.left='0px';
  viewer.appendChild( stats.domElement );

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
  
  function startAt(startTime) {
    startTime = Number(startTime);
    mixer._actions[0].reset();
    mixer.update(startTime);
  }

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

    stats.update();
  }

  requestAnimationFrame(animation);

  };
  animation();