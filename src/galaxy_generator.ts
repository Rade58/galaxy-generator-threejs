import * as THREE from "three";
import { /* FontLoader, */ OrbitControls } from "three/examples/jsm/Addons.js";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
// import gsap from "gsap";
import GUI from "lil-gui";

/**
 * @description Debug UI - lil-ui
 */
const gui = new GUI({
  width: 340,
  title: "My Debugging",
  closeFolders: false,
});

// gui.hide(); //

/* const debugObject = {
  color: "#90315f",
  subdivisions: 1,
  //
  // spin: () => {},
}; */

const sizes = {
  // width: 800,
  width: window.innerWidth,
  // height: 600,
  height: window.innerHeight,
};

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
  const scene = new THREE.Scene();

  // -------------------------------------------------------
  // -------------------------------------------------------

  /**
   * @name Parameters
   */
  const parameters = {
    count: 1000, // prticles count (buffer geometry vertices count)
    size: 0.02, // for PointsMaterial
    // --------------------------------
    radius: 5, // galaxy radius multiplicator
    branches: 3, // how many branches of galaxy user wants
    spin: 1,
    randomness: 0.2,
    randomnessPower: 2,
    //
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
  };
  parameters.count = 100000;
  parameters.size = 0.02;

  /**
   * @name Gui
   */
  gui
    .add(parameters, "count")
    .min(10)
    .max(1000000)
    .step(100)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "size")
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "radius")
    .min(0.01)
    .max(20)
    .step(0.01)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "branches")
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "spin")
    .min(-5)
    .max(5)
    .step(0.01)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "randomness")
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "randomnessPower")
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
  gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

  // for cleanup of old glaxies
  let geometry: THREE.BufferGeometry | null = null;
  let material: THREE.PointsMaterial | null = null;
  let points: THREE.Points | null = null;
  //

  /**
   * @name Galaxy
   */
  function generateGalaxy() {
    // cleanup
    if (points !== null) {
      // not working
      scene.remove(points);
      // use this
      (points as THREE.Points).remove();

      (geometry as THREE.BufferGeometry).dispose();
      (material as THREE.PointsMaterial).dispose();
    }

    //

    console.log("generate galaxy");

    geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3); // *3 because we need 3 coordiantes for every vertice

    // colors
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      // we will not loop for every coordiante, we will loop for every vertice
      const i3 = i * 3; //   this is arrays index basically; in first iter index is 0 in second iter x is 3

      /*      instead of this which will basically crete "space like cube" made from vertices
      // x
      positions[i3 + 0] = (Math.random() - 0.5) * 3; // -0.5   because we also want negative values
      //                                                and times 3 is to limit randomness a bit
      //                                                 we want same "randomnes srule" for x y z
      // y
      positions[i3 + 1] = (Math.random() - 0.5) * 3;
      // z
      positions[i3 + 2] = (Math.random() - 0.5) * 3;
      */
      // we will step by step try to create vertices that will be positioned in a way
      // that it will look like spiral galaxy

      const radius = Math.random() * parameters.radius;

      // x      all particles are on x axes, they formed construction lie line when seening zoomed out
      /* positions[i3 + 0] = radius;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0; */

      // making beanches of laying out particles
      const branchAngle =
        ((i % parameters.branches) / parameters.branches) * Math.PI * 2; // PI * 2 is full crcle
      /* 
      positions[i3 + 0] = Math.cos(branchAngle) * radius;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = Math.sin(branchAngle) * radius; */

      // adding spin angle
      const spinAngle = radius * parameters.spin;

      /* positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;
      */

      // ading randomness

      /* const randomX = (Math.random() - 0.5) * parameters.randomness * radius;
      const randomY = (Math.random() - 0.5) * parameters.randomness * radius;
      const randomZ = (Math.random() - 0.5) * parameters.randomness * radius; */

      // Our ranadomness i too uniform, so adding more randomness with Math.pow
      const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;
      const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;
      const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;

      positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = 0 + randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // color

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);

      colors[0 + i3] = mixedColor.r;
      colors[1 + i3] = mixedColor.g;
      colors[2 + i3] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      // adding colors
      vertexColors: true,
    });

    points = new THREE.Points(geometry, material);

    scene.add(points);
  }

  generateGalaxy();

  // -------------------------------------------------------
  // -------------------------------------------------------

  // -------------------------------------------------------
  // -------------------------------------------------------

  // --------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 30);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  scene.add(pointLight);

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // const material = new THREE.MeshStandardMaterial();
  // material.roughness = 0.4;
  // const cubeGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
  // const cube = new THREE.Mesh(cubeGeo, material);
  // plane.rotation.x = -Math.PI * 0.5; // this is -90deg
  // plane.position.y = -0.65;
  // scene.add(cube);
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

  camera.position.z = 6;
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
