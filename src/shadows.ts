// shadows
// we activate shadowMap on renderer
/// in our case (we have very simple scene)
/// we `castShadow` from a sphere
/// and plane should `receiveShadow`

// works only with PointLight, DirectionalLight, SpotLight (you must `castShadow` from it)

// after we do all of mentioned, the shadow will be visible.
// but it won't look to good, we need to optimize it
// and there is a lot we did

// we set most of the optimization on DirectionalLight instance
// but also we set some on renderer

import * as THREE from "three";
import { FontLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";
import GUI from "lil-gui";

/**
 * @description Debug UI - lil-ui
 */
const gui = new GUI({
  width: 340,
  title: "My Debugging",
  closeFolders: false,
});

// gui.hide();

const debugObject = {
  color: "#90315f",
  subdivisions: 1,
  //
  // spin: () => {},
};

const sizes = {
  // width: 800,
  width: window.innerWidth,
  // height: 600,
  height: window.innerHeight,
};

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
  // -------------------------------------------------------

  const scene = new THREE.Scene();

  // ------  LIGHTS
  // --------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff);

  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

  directionalLight.position.set(2, 2, -1);

  scene.add(directionalLight);

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.2,
    "purple"
  );
  // scene.add(directionalLightHelper);
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // ------ MATERIAL ------
  const material = new THREE.MeshStandardMaterial();
  material.roughness = 0.7;

  // --------------------------------------------------------------
  // ------ GEOMETRIES ------
  const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const planeGeo = new THREE.PlaneGeometry(5, 5);

  // --------------------------------------------------------------
  // ------ MESHES ------
  const sphere = new THREE.Mesh(sphereGeo, material);
  // sphere.position.x = -1.5;
  const plane = new THREE.Mesh(planeGeo, material);
  plane.rotation.x = -Math.PI * 0.5; // this is -90deg
  plane.position.y = -0.65;

  //  ---------------------- SHADOWS RELATED ----------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------

  directionalLight.castShadow = true;

  sphere.castShadow = true;

  plane.receiveShadow = true;

  console.log({ shadow: directionalLight.shadow }); // DirectionalLightShadow instance
  // we will take `mapSize` (Vector2 instance) from it (a resolution of the render)
  // but watch for performance issues if your shadow takes too much space (If I ubderstood corectly)

  // shadow will not have as rough edges as it did, after we set these
  directionalLight.shadow.mapSize.width = 1024; // we must use power of two (like 512x512)
  directionalLight.shadow.mapSize.height = 1024;

  //LIKE I DIDD WE CAN SET near AND far FOR THE SHADOW MAP CAMERA (**** AN INSTANCE OF OrthographicCamera ****)
  //  WE ARE TALKING ABOUT CAMERA THAT IS A IN POINT OF VIEW OF THE LIGHT, LIKE THE LIGHT SURFACE)
  console.log({ directionalLightCamera: directionalLight.shadow.camera });

  // we used camera helper (few lines bellow) for the camera of the shadow for directional light so we can debug
  // or set `near` and `far` values
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 6;

  // we can set amplitude (top, bottom, up, down) (we are alo using helper for the camera to see what is changed)
  // I would say we are limiting the surface where shadow will apear when we do this
  directionalLight.shadow.camera.top = 2;
  directionalLight.shadow.camera.bottom = -2;
  directionalLight.shadow.camera.right = 2;
  directionalLight.shadow.camera.left = -2;
  // after this above, shadow will look better, so by reducing amplitude we will have better looking shadow

  // controling blur of the shadow
  directionalLight.shadow.radius = 10; // shadow will apear blured around edges

  // We added a helper for mentioned camera (to set near, far, amplitude(left,right, top,bottom) )

  const directionalLightCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
  );
  scene.add(directionalLightCameraHelper);
  // after you tweak lights camera values you can comment this out
  directionalLightCameraHelper.visible = false;

  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------

  scene.add(sphere, plane);
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  //  gui
  const lightsFolder = gui.addFolder("Lights");
  lightsFolder
    .add(directionalLight, "intensity")
    .min(0)
    .max(1)
    .step(0.001)
    .name("Directionl Light intensity");
  lightsFolder
    .add(ambientLight, "intensity")
    .min(0)
    .max(1)
    .step(0.001)
    .name("Ambient Light intensity");
  lightsFolder
    .add(directionalLight.position, "x")
    .min(-2)
    .max(2)
    .step(0.001)
    .name("x dirLight");
  lightsFolder
    .add(directionalLight.position, "y")
    .min(-2)
    .max(2)
    .step(0.001)
    .name("y dirLight");
  lightsFolder
    .add(directionalLight.position, "z")
    .min(-2)
    .max(2)
    .step(0.001)
    .name("z dirLight");

  const materialFolder = gui.addFolder("Material");
  materialFolder.add(material, "metalness").min(0).max(1).step(0.001);
  materialFolder.add(material, "roughness").min(0).max(1).step(0.001);
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,

    0.1,
    100
  );

  camera.position.z = 3;
  camera.position.x = 1;
  camera.position.y = 1;
  scene.add(camera);

  const axHelp = new THREE.AxesHelper(4);
  axHelp.setColors("red", "green", "blue");
  // scene.add(axHelp);

  const orbit_controls = new OrbitControls(camera, canvas);
  // orbit_controls.enabled = false
  orbit_controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // more than 2 is unnecessary

  // ------ ACTIVTING SHADOW MAPS ------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  renderer.shadowMap.enabled = true;

  // shadow algorythms
  //  BasicShadowMap  ---   perfoant but lousy quality
  //  PCFShadowMap  ---smoother but less perfomant (default)
  //  PCFSoftShadowMap  --- less perfomant but softer edges
  //  VSMShadowMap  --- less perfomant, more constraints, can have unexpected results
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // renderer.shadowMap.type = THREE.VSMShadowMap;
  // renderer.shadowMap.type = THREE.BasicShadowMap;

  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------

  renderer.setSize(sizes.width, sizes.height);

  renderer.render(scene, camera);

  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // toggle debug ui on key `h`
  window.addEventListener("keydown", (e) => {
    if (e.key === "h") {
      gui.show(gui._hidden);
    }
  });

  // ------------- Animation loop ------------------
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // for dumping to work
    orbit_controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();

  // ------------------------------------------------------
  // --------------- handle resize ------------------------
  window.addEventListener("resize", (e) => {
    console.log("resizing");
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // ------------------------------------------------------
  // ----------------- enter fulll screen with double click

  window.addEventListener("dblclick", () => {
    console.log("double click");

    // handling safari
    const fullscreenElement =
      // @ts-ignore webkit
      document.fullscreenElement || document.webkitFullScreenElement;
    //

    // if (!document.fullscreenElement) {
    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        // go fullscreen
        canvas.requestFullscreen();

        // @ts-ignore webkit
      } else if (canvas.webkitRequestFullScreen) {
        // @ts-ignore webkit
        canvas.webkitRequestFullScreen();
      }
    } else {
      // @ts-ignore
      if (document.exitFullscreen) {
        document.exitFullscreen();

        // @ts-ignore webkit
      } else if (document.webkitExitFullscreen) {
        // @ts-ignore webkit
        document.webkitExitFullscreen();
      }
    }
  });
}
