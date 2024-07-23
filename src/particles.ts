// particles can be used to create effects like rain, stars, smoke, dust, fire etc.
// you can have thousands of particles with a reasonable frame rate
// each particle is compose of a plane (two triangles) always facing a camera

// We will be using some new constructors ike Points and PointsMaterial

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

gui.hide(); //

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
  // -------------------------------------------------------

  const scene = new THREE.Scene();

  // -----------------------------------

  const textureLoader = new THREE.TextureLoader();

  // don't use transparent one for this exercise
  // const particleTexture = textureLoader.load("/particles/trnsparent/1.png");
  const particleTexture = textureLoader.load("/particles/1.png");

  // ------  LIGHTS
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
  /**
   * @description Particles
   */

  /**
   * @name Parrticles-Geometry
   */
  // instead of this
  // const particlesGeometry = new THREE.SphereGeometry(1, 32, 32); // each vertex of the geomery will become particle
  // we will use BufferGeometry
  const particlesGeometry = new THREE.BufferGeometry();
  // const count = 50000;
  // const count = 5000; // number of vertices
  // const count = 50000; // number of vertices
  const count = 20000; // number of vertices
  const positions = new Float32Array(count * 3); // every verices is represented with 3 coordinates, that is why we multiply

  for (let i = 0; i < count; i++) {
    // minus 0.5 because we also want negative vlues
    positions[i] = (Math.random() - 0.5) * 10;
    // we will have array with 3 * 500 floating point numbers
    // and when geometry uses these array it bill go through it
    // in a way that every 3 numbers represent coordinate of a vertice
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3) // actually this 3 determines how much numbers to take for a coordinate
  );

  /**
   * @name Particles-Material
   */
  const particlesMaterial = new THREE.PointsMaterial({
    // size: 0.02,
    // sizeAttenuation: true,
  });

  // particlesMaterial.size = 4;
  // particlesMaterial.sizeAttenuation = false;
  // particlesMaterial.size = 0.02;
  particlesMaterial.size = 0.1;
  particlesMaterial.sizeAttenuation = true;
  // particlesMaterial.color = new THREE.Color("crimson");
  particlesMaterial.color = new THREE.Color("#ff88cc");
  // we will see our particles but black is not transparent on particle, so black is overlaping other particle that gets in "square" of particle
  // particlesMaterial.map = particleTexture;
  // so we use texture as alpha map like this
  particlesMaterial.transparent = true;
  particlesMaterial.alphaMap = particleTexture;
  // it's better but not perfect we can still se edges on square of the particle

  // ---------------- multiple ways of fixing mentioned overlap  ---------------------------------

  // ---------- These cause unusual buggs
  // - alpha test   // value between 0 and 1       // can cause unusual bugs
  // particlesMaterial.alphaTest = 0.001;

  // for depth test we aded box mesh
  // - depth test      (if you add new mesh you will have a bug where you'll see prticles behind the mesh as it is transparent)
  // particlesMaterial.depthTest = false;

  // (FIRST SOLUTION CONSIDERED GOOD SOLUTION) (still might have bugs but many times author of the workshop used this solution)
  // - depth write will fix problem of particles being visible behind newly added meshes
  particlesMaterial.depthWrite = false;

  // Blending is also a solution BUT IT WILL IMPACT PERFORMANCE
  // WE use it in combination with        particlesMaterial.depthWrite = false;

  // particlesMaterial.blending = THREE.AdditiveBlending;
  // also add way more particles to test this, above 50 000 for example

  //------------------------------------------------

  /**
   * @name Particles
   */
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);

  scene.add(particles);

  // to see how  dept   solutionss causes mentioned error
  /* scene.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: "purple" })
    )
  ); */

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
