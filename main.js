import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { Octree } from "three/examples/jsm/Addons.js";
import { Capsule } from "three/examples/jsm/Addons.js";

// Create a scene
const scene = new THREE.Scene();
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const canvas = document.getElementById("experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

// Physics related variables
const GRAVITY = 30;
const CAPSULE_RADIUS = 0.35;
const CAPSULE_HEIGHT = 10.0;
const JUMP_HEIGHT = 10;
const MOVE_SPEED = 2;

let character = {
  instance: null,
  isMoving: false,
  spawnPosition: new THREE.Vector3(0, 0, 0),
};

let targetRotation = 0;

const colliderOctree = new Octree();
const playerCollider = new Capsule(
  new THREE.Vector3(0, CAPSULE_RADIUS, 0),
  new THREE.Vector3(0, CAPSULE_HEIGHT, 0),
  CAPSULE_RADIUS,
);

let playerOnFloor = false;
let playerVelocity = new THREE.Vector3();

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.95;

const modalContent = {
  ProjectOne: {
    title: "Project One",
    content: "This is project one. It does nice things.",
    link: "https://github.com/brianignacio5/planning",
  },
  ProjectTwo: {
    title: "Project Two",
    content: "This is project two. It does even nicer things.",
    link: "https://github.com/brianignacio5/video-chat-frontend",
  },
  ProjectThree: {
    title: "Project Three",
    content: "This is project three. It does the nicest things.",
    link: "https://github.com/brianignacio5/customers-app",
  },
};

const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalProjectDescription = document.querySelector(
  ".modal-project-description",
);
const modalExitButton = document.querySelector(".modal-exit-button");
const modalProjectVisitButton = document.querySelector(
  ".modal-project-visit-button",
);

function showModal(project) {
  if (!modalContent[project]) return;
  modalTitle.textContent = modalContent[project].title;
  modalProjectDescription.textContent = modalContent[project].content;
  if (modalContent[project].link) {
    modalProjectVisitButton.href = modalContent[project].link;
    modalProjectVisitButton.classList.remove("hidden");
  } else {
    modalProjectVisitButton.classList.add("hidden");
  }
  modal.classList.toggle("hidden");
}

function hideModal() {
  modal.classList.toggle("hidden");
}

let intersectObject = "";
const intersectObjects = [];
const intersectObjectsNames = [
  "Car",
  "ProjectOne",
  "ProjectTwo",
  "ProjectThree",
];

const loader = new GLTFLoader();

loader.load(
  "/Portfolio.glb",
  function (glb) {
    glb.scene.traverse(function (child) {
      if (intersectObjectsNames.includes(child.name)) {
        intersectObjects.push(child);
      }
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
      if (child.name === "Char1") {
        character.spawnPosition.copy(child.position);
        character.instance = child;
        playerCollider.start
          .copy(child.position)
          .add(new THREE.Vector3(0, CAPSULE_RADIUS, 0));
        playerCollider.end
          .copy(child.position)
          .add(new THREE.Vector3(0, CAPSULE_HEIGHT, 0));
      }
      if (child.name === "Collider") {
        colliderOctree.fromGraphNode(child);
        child.visible = false;
      }
    });
    scene.add(glb.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  },
);

const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.castShadow = true;
sun.position.set(15, 20, 0); // 15, 20 ,0
sun.target.position.set(10, 0, 0);
sun.shadow.mapSize.width = 4096;
sun.shadow.mapSize.height = 4096;
sun.shadow.camera.left = -30;
sun.shadow.camera.right = 30;
sun.shadow.camera.top = 45;
sun.shadow.camera.bottom = -45;
sun.shadow.normalBias = 0.2;
scene.add(sun);

const light = new THREE.AmbientLight(0x404040, 5); // soft white light
scene.add(light);

const aspectRatio = sizes.width / sizes.height;

const camera = new THREE.OrthographicCamera(
  -20 * aspectRatio,
  20 * aspectRatio,
  20,
  -20,
  1,
  1000,
);

camera.position.x = -25;
camera.position.y = 20;
camera.position.z = 25;
const cameraOffset = new THREE.Vector3(
  camera.position.x,
  camera.position.y,
  camera.position.z,
);
camera.zoom = 2;
camera.updateProjectionMatrix();

function onResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  const aspectRatio = sizes.width / sizes.height;
  camera.left = -20 * aspectRatio;
  camera.right = 20 * aspectRatio;
  camera.top = 20;
  camera.bottom = -20;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

let isCharacterReady = true;

function jumpCharacter(meshID) {
  if (!isCharacterReady) return;

  const mesh = scene.getObjectByName(meshID);
  const jumpHeight = 2;
  const jumpDuration = 0.5;

  const t1 = gsap.timeline();

  t1.to(
    mesh.position,
    {
      y: mesh.position.y + jumpHeight,
      duration: jumpDuration / 2,
      yoyo: true,
      repeat: 1,
    },
    0,
  );
}

function onClick(event) {
  if (intersectObject !== "") {
    if (["Car"].includes(intersectObject)) {
      jumpCharacter(intersectObject);
    } else {
      showModal(intersectObject);
    }
  }
}

function respawnPlayer() {
  character.instance.position.copy(character.spawnPosition);
  playerCollider.start
    .copy(character.spawnPosition)
    .add(new THREE.Vector3(0, CAPSULE_RADIUS, 0));
  playerCollider.end
    .copy(character.spawnPosition)
    .add(new THREE.Vector3(0, CAPSULE_HEIGHT, 0));

  playerVelocity.set(0, 0, 0);
  character.isMoving = false;
}

function playerCollisions() {
  const result = colliderOctree.capsuleIntersect(playerCollider);

  playerOnFloor = false;

  if (result) {
    playerOnFloor = result.normal.y > 0;
    playerCollider.translate(result.normal.multiplyScalar(result.depth));

    if (playerOnFloor) {
      character.isMoving = false;
      playerVelocity.x = 0;
      playerVelocity.z = 0;
    }
  }
}

function updatePlayer() {
  if (!character.instance) return;

  if (character.instance.position.y < -20) {
    respawnPlayer();
    return;
  }

  if (!playerOnFloor) {
    playerVelocity.y -= GRAVITY * 0.035;
  }

  playerCollider.translate(playerVelocity.clone().multiplyScalar(0.035));

  playerCollisions();

  character.instance.position.copy(playerCollider.start);
  character.instance.position.y -= CAPSULE_RADIUS;

  let rotationDiff =
    ((((targetRotation - character.instance.rotation.y) % (2 * Math.PI)) +
      3 * Math.PI) %
      (2 * Math.PI)) -
    Math.PI;
  let finalRotation = character.instance.rotation.y + rotationDiff;

  character.instance.rotation.y = THREE.MathUtils.lerp(
    character.instance.rotation.y,
    finalRotation,
    0.1,
  );
}

function onKeydown(event) {
  if (event.key.toLowerCase() === "r") {
    respawnPlayer();
    return;
  }
  if (character.isMoving) {
    return;
  }

  switch (event.key.toLowerCase()) {
    case "w":
    case "arrowup":
      playerVelocity.z -= MOVE_SPEED;
      targetRotation = 0;

      break;
    case "s":
    case "arrowdown":
      playerVelocity.z += MOVE_SPEED;
      targetRotation = Math.PI;
      break;
    case "a":
    case "arrowleft":
      playerVelocity.x -= MOVE_SPEED;
      targetRotation = -Math.PI / 2;
      break;
    case "d":
    case "arrowright":
      playerVelocity.x += MOVE_SPEED;
      targetRotation = Math.PI / 2;
      break;
    default:
      break;
  }
  playerVelocity.y = JUMP_HEIGHT;
  character.isMoving = true;
}
modalExitButton.addEventListener("click", hideModal);
window.addEventListener("resize", onResize);
window.addEventListener("click", onClick);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("keydown", onKeydown);

function animate() {
  updatePlayer();

  if (character.instance) {
    const targetCameraPosition = new THREE.Vector3(
      character.instance.position.x + cameraOffset.x,
      cameraOffset.y,
      character.instance.position.z + cameraOffset.z,
    );
    camera.position.copy(targetCameraPosition);
    camera.lookAt(
      character.instance.position.x,
      camera.position.y - cameraOffset.y,
      character.instance.position.z,
    );
  }

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(intersectObjects, true);

  if (intersects.length > 0) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
    intersectObject = "";
  }

  for (let i = 0; i < intersects.length; i++) {
    intersectObject = intersects[0].object.parent.name;
  }

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
