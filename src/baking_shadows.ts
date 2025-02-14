// baking shadows
// we need to disable shadowMap on rendered, we enbled earlier. This will disable drop shadow
// than we used baked shadow we build in blender

// problem with this is it is very static, moving meshes won't move or project shadow
// so if you hve static project, where you don't have moving meshes that should project shadow
// use this
// othervise don't

// but we can have other soution where we would use another texture of some simple shadow
// load that texture on other plane we would hover just a bit above plane
// we would move object and a mentioned plane as  group (or we can move one and and an another without group but make
// sure we are moving them at the same time) to produce shadow effect
// we would use alphaMap to load a texture
// also don't forget that material needs to be transparent in this case

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

  // loading the shadow texture

  const textureLoader = new THREE.TextureLoader();
  const bakedShadowTexture = textureLoader.load(
    // we will ad this to the material of our plane mesh
    "/baked_shadow/baked.jpg"
  );

  const simpleShadowTexture = textureLoader.load(
    "/baked_shadow/simple_shadow.jpg"
  );

  // ------  LIGHTS
  // --------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);

  directionalLight.position.set(2, 2, -1);

  scene.add(directionalLight);

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.2,
    "purple"
  );
  // scene.add(directionalLightHelper);

  const spotLight = new THREE.SpotLight(0xffffff, 0.9, 10, Math.PI * 0.3);

  spotLight.position.set(0, 2, 2);

  scene.add(spotLight);
  scene.add(spotLight.target);

  const pointLight = new THREE.PointLight(0xffffff, 0.3);
  scene.add(pointLight);

  pointLight.position.set(-1, 1, 0);

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
  const plane = new THREE.Mesh(
    planeGeo,
    material
    // new THREE.MeshBasicMaterial({ map: bakedShadowTexture })
  );
  plane.rotation.x = -Math.PI * 0.5; // this is -90deg
  plane.position.y = -0.65;

  //
  const sphereShadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      alphaMap: simpleShadowTexture,
    })
  );

  sphereShadowPlane.rotation.x = -Math.PI * 0.5;
  sphereShadowPlane.position.y = plane.position.y + 0.01;

  //  ---------------------- SHADOWS RELATED ----------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  pointLight.castShadow = true;

  spotLight.castShadow = true;

  directionalLight.castShadow = true;

  // ---------------------------------
  sphere.castShadow = true;

  plane.receiveShadow = true;

  console.log({ shadow: directionalLight.shadow });
  // ---------------------------------------------------------

  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;

  pointLight.shadow.camera.near = 0.1;
  pointLight.shadow.camera.far = 5;

  // ---------------------------------------------------------

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.fov = 30;

  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 6;

  // --------------------------------------------

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  console.log({ directionalLightCamera: directionalLight.shadow.camera });

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 6;

  directionalLight.shadow.camera.top = 2;
  directionalLight.shadow.camera.bottom = -2;
  directionalLight.shadow.camera.right = 2;
  directionalLight.shadow.camera.left = -2;

  directionalLight.shadow.radius = 10;

  // --------------------------------------------------------

  const directionalLightCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
  );
  scene.add(directionalLightCameraHelper);
  directionalLightCameraHelper.visible = false;

  const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  scene.add(spotLightCameraHelper);

  spotLightCameraHelper.visible = false;

  const pointLightCameraHelper = new THREE.CameraHelper(
    pointLight.shadow.camera
  );
  scene.add(pointLightCameraHelper);

  pointLightCameraHelper.visible = false; // after we set near, far, mapSize we can do this

  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------

  scene.add(sphere, plane, sphereShadowPlane);
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
    .add(spotLight, "intensity")
    .min(0)
    .max(1)
    .step(0.001)
    .name("Spot Light intensity");
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
  lightsFolder
    .add(spotLight.position, "x")
    .min(-2)
    .max(2)
    .step(0.001)
    .name("x spotLight");
  lightsFolder
    .add(spotLight.position, "y")
    .min(-2)
    .max(2)
    .step(0.001)
    .name("y spotLight");
  lightsFolder
    .add(spotLight.position, "z")
    .min(-2)
    .max(2)
    .step(0.001)
    .name("z spotLight");

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

  // ------ SHADOW MAPS ------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // renderer.shadowMap.enabled = true;
  renderer.shadowMap.enabled = false;

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

    //--------------------------------------------------------------
    // updating sphere and plane that represent shadow -----
    sphere.position.x = sphereShadowPlane.position.x =
      Math.sin(elapsedTime) * 1.5;
    sphere.position.z = sphereShadowPlane.position.z =
      Math.cos(elapsedTime) * 1.5;

    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));
    // insted of doing this (I did this)
    // sphereShadowPlane.scale.setScalar(Math.abs(Math.sin(elapsedTime * 3)));
    // author of the workhop used opacity
    sphereShadowPlane.material.opacity = (1 - sphere.position.y) * 0.7;
    // sphereShadowPlane.material.opacity = (1 - sphere.position.y) * 0.3;
    //--------------------------------------------------------------
    //--------------------------------------------------------------

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
