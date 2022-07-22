
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.fov = 90;
camera.zoom = 0.8;
camera.updateProjectionMatrix();
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// scene handle 
let scene = null;
let beforeSceneId = null;
let beforeScene = null;
let cube;
let cubeId;

// camera handle 
var lat = 0;
var lon = 0;
var let = 0;
var onPointerDownMouseX = 0;
var onPointerDownMouseY = 0;
var onPointerDownLon = 0;
var onPointerDownLat = 0;
var phi = 0;
var theta = 0;

function newscene() {
    if (scene != null) {
        beforeSceneId = scene.name;
        scene = new THREE.Scene();
        scene.name = beforeSceneId == 'scene1' ? 'scene2' : 'scene1';
    } else {
        scene = new THREE.Scene();
        scene.name = 'scene1';
    }
    console.log(scene)
    let geometry = new THREE.SphereGeometry(500, 60, 40);
    let defaultImage = scene.name == 'scene1' ? 'asset/img0.jpg' : 'asset/img1.jpg';
    const texture = new THREE.TextureLoader().load(defaultImage);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    geometry.scale(- 1, 1, 1);
    scene.add(mesh);
    addSceneChangeCube();
    if (scene.name == 'scene2') {
        lat = 0;
        lon = lon - 100;
    }else{
        lat = 0;
        lon = lon +100;
    }
    setTimeout(() => {
        document.body.removeAttribute('id');
    }, 1200);
}
// create scene
newscene();



// cube add to scene

function addSceneChangeCube() {
    const cubeGeo = new THREE.BoxGeometry(4, 4, 4);
    const cubeMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    cube = new THREE.Mesh(cubeGeo, cubeMat);
    let x,y,z;
    x = scene.name == 'scene2' ? 5 : -50;
    y = scene.name == 'scene2' ? 20 : -10;
    z = scene.name == 'scene2' ? -60 : 0;
    cube.position.set(x,y,z);
    console.log(scene.name)
    scene.add(cube);
    cubeId = cube.id;
}




////add cube by clicking
function addCube(x, y, z) {
    console.log(x, y, z)
    const cubesGeo = new THREE.SphereGeometry(15, 32, 16);
    let color = [0xffff00, 0xffff, 0xfff0f0, 0x80FF00, 0x8000FF, 0x0080FF];
    var item = color[Math.floor(Math.random() * color.length)];
    const cubesMat = new THREE.MeshBasicMaterial({ color: item, wireframe: true });
    const cubes = new THREE.Mesh(cubesGeo, cubesMat);
    cubes.position.set(x, y, z);
    scene.add(cubes);
}


/// camera handle

document.addEventListener('pointerdown', onPointerDown);

function onPointerDown(event) {

    if (event.isPrimary === false) return;

    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

}
function onPointerMove(event) {

    if (event.isPrimary === false) return;
    lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
    lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;

}

function onPointerUp(event) {

    if (event.isPrimary === false) return;
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
}


/// select object in scene
const mousepos = new THREE.Vector2();
const rayCaster = new THREE.Raycaster();

window.addEventListener('click', function (e) {
    mousepos.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousepos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    select(e);
})

function select(e) {
    rayCaster.setFromCamera(mousepos, camera);
    const intersect = rayCaster.intersectObjects(scene.children, true);
    // console.log(intersect);
    // console.log(cubeId);
    // console.log(lon,lat);
    // camera.position.lerpVectors(camera.position, intersect[ 0 ].point, 0.5)
    if (e.ctrlKey) {
        addCube(intersect[0].point.x, intersect[0].point.y, intersect[0].point.z);
    }
    for (let i = 0; i < intersect.length; i++) {
        if (intersect[i].object.id == cubeId) {
            intersect[i].object.material.color.set(0xFF0000);
            document.body.id ="faded";
            setTimeout(() => {
                newscene();
            }, 500);
        }
    }
}

/////////add obj

// const mous = new THREE.Vector2();
// const intersectionPoint = new THREE.Vector3();
// const planeNormal = new THREE.Vector3();
// const plane = new THREE.Plane();

// window.addEventListener("mousemove",function(e){
//     mous.x = (e.clientX / window.innerWidth) * 2 - 1;
//     mous.y = -(e.clientY / window.innerHeight) * 2 + 1;
//     planeNormal.copy(camera.position).normalize();
//     plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
//     rayCaster.setFromCamera(mous, camera);
//     rayCaster.ray.intersectPlane(plane, intersectionPoint);
// })

// window.addEventListener('click', function (e) {
//    const SphereGeo = new THREE.SphereGeometry(0.125,30,30);
//    const material = new THREE.MeshBasicMaterial({ color: 0xFFEA00 });
//    const newSphere = new THREE.Mesh(SphereGeo, material);
//    scene.add(newSphere);
//    newSphere.position.copy(intersectionPoint);  
// })



// animation  and update sceene
const oldY = cube.position.y;
function animate(time) {

    requestAnimationFrame(animate);
    update();
    cube.position.y = oldY + Math.abs(Math.sin(time / 5));
}
function update() {
    // lon += 0.1;
    lat = Math.max(- 85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    const x = 500 * Math.sin(phi) * Math.cos(theta);
    const y = 500 * Math.cos(phi);
    const z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(x, y, z);
    renderer.render(scene, camera);
}

animate();