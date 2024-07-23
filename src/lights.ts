// in this exercise we will learn about lights
// and keep in mind that lights are costly for performance
// if you want to add light to every city light scene, it will be very bad, you will reach a limit
// ad as few lights as possible
// Ambient and Hemisphere don't cost that much, then we have directional and point light as moderate cost
// spot and rectangulatr light are high cost

// some helpers for the lights that ar not on the THREE are available in
// three/examples/jsm/helpers/

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

gui.hide(); //

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
  const ambientLight = new THREE.AmbientLight("blanchedalmond", 0.09);

  // const ambientLight = new THREE.AmbientLight();

  // ambientLight.color = new THREE.Color(0xffffff);
  // ambientLight.color = new THREE.Color("crimson");
  // ambientLight.intensity = 30;
  // ambientLight.intensity = 0.5;

  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.5);
  // scene.add(directionalLight);

  directionalLight.position.set(3, 0.65, 0);
  // directionalLight.position.set(1, 0.25, 0);

  const directLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.5,
    "teal"
  );

  scene.add(directLightHelper);

  // good for effect if you have sky above and grss at a floor
  const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);

  // first remove, directional and ambient light to see full effect of this light
  scene.add(hemisphereLight);

  // hemisphereLight.position.y = 2;

  const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphereLight,
    1,
    "purple"
  );

  scene.add(hemisphereLightHelper);

  const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
  /* pointLight.position.x = 1;
  pointLight.position.y = -0.5;
  pointLight.position.z = 1; */
  pointLight.position.set(1, -0.5, 1);
  scene.add(pointLight);

  const pointLightHelper = new THREE.PointLightHelper(pointLight);

  scene.add(pointLightHelper);

  // it's like a light for photoshoot set
  // works only with mesh normal material or mesh phisical material
  // comment adding of other lights to better see effect of this one
  const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
  scene.add(rectAreaLight);

  // and we can move the light
  rectAreaLight.position.set(0, 0, 1.5);
  // we cen define that look at some position
  rectAreaLight.lookAt(new THREE.Vector3(0, 0.1, 0.2));

  const spotLight = new THREE.SpotLight(
    0x78ff00,
    0.5,
    10,
    Math.PI * 0.1,
    0.25,
    1
  );

  spotLight.position.set(0, 2, 3);
  scene.add(spotLight);

  const spotlightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotlightHelper);

  // to rotate spotligt (this is not usial, it is only characteristical to spolite)
  // we need to add spotlight target (a Object3D instance) to the scene
  scene.add(spotLight.target); // now we can animate spotLight.target

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // ------ MATERIAL ------
  const material = new THREE.MeshStandardMaterial();
  material.roughness = 0.4;

  // --------------------------------------------------------------
  // ------ GEOMETRIES ------
  const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const cubeGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
  const torusGeo = new THREE.TorusGeometry(0.3, 0.2, 32, 64);
  const planeGeo = new THREE.PlaneGeometry(5, 5);
  // --------------------------------------------------------------
  // ------ MESHES ------
  const sphere = new THREE.Mesh(sphereGeo, material);
  sphere.position.x = -1.5;
  const cube = new THREE.Mesh(cubeGeo, material);
  const torus = new THREE.Mesh(torusGeo, material);
  torus.position.x = 1.5;
  const plane = new THREE.Mesh(planeGeo, material);
  plane.rotation.x = -Math.PI * 0.5; // this is -90deg
  plane.position.y = -0.65;

  scene.add(sphere, cube, torus, plane);
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  //  gui
  gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

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
  scene.add(axHelp);

  const orbit_controls = new OrbitControls(camera, canvas);
  // orbit_controls.enabled = false
  orbit_controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  // handle pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // more than 2 is unnecessary

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

    // sphere.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;
    cube.rotation.y = 0.1 * elapsedTime;

    // sphere.rotation.x = -0.15 * elapsedTime;
    torus.rotation.x = -0.15 * elapsedTime;
    cube.rotation.x = -0.15 * elapsedTime;

    //

    if (spotLight.target.isObject3D) {
      // console.log(spotLight.target);

      spotLight.target.position.x = Math.sin(elapsedTime * Math.PI * 0.3);
    }

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
