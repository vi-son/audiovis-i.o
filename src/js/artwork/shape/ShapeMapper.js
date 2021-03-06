import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { utils } from "@vi.son/components";
const { mobileCheck } = utils;
// Local imports
import totemLogic, { MAPPINGS } from "../logic.totem.js";

class ShapeMapper {
  constructor() {
    this._scene = new THREE.Scene();

    this._isMobile = mobileCheck();

    this._defaultColor = new THREE.Color(0x7a7a7a);
    this._highlightColor = new THREE.Color(0x323045);
    this._selectedColor = new THREE.Color(0x2b13ff);

    this._selectedShape = null;
    this._mouseDown = false;

    this._onSelect = (type, mapping) => {
      totemLogic.actions.mapCurrentSampleTo(type, mapping);
    };
    this._onHover = (shape) => totemLogic.actions.setHint(shape);

    // Light
    var light = new THREE.HemisphereLight(0xffffff, 0x666666, 2.0);
    light.position.set(0, 10, 0);
    this._scene.add(light);

    this._createShapes();
  }

  _createShapes() {
    const material = new THREE.MeshLambertMaterial({
      color: this._defaultColor,
      opacity: 0,
      transparent: true,
    });
    // Cube
    const cubeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    this._cube = new THREE.Mesh(cubeGeometry, material.clone());
    this._cube.name = "Würfel";
    if (this._isMobile) {
      this._cube.position.set(0.4, 1.2, 0);
    }
    this._cubeTween = new TWEEN.Tween(this._cube.material).to(
      { opacity: 1 },
      100
    );
    // Sphere
    const sphereGeometry = new THREE.SphereBufferGeometry(0.26, 32, 32);
    this._sphere = new THREE.Mesh(sphereGeometry, material.clone());
    if (this._isMobile) {
      this._sphere.position.set(-0.4, 1.2, 0);
    } else {
      this._sphere.position.set(-0.75, 0, 0);
    }
    this._sphere.name = "Kugel";
    this._sphereTween = new TWEEN.Tween(this._sphere.material).to(
      { opacity: 1 },
      150
    );
    // Cone
    const coneGeometry = new THREE.ConeGeometry(0.2, 0.5, 30);
    this._cone = new THREE.Mesh(coneGeometry, material.clone());
    if (this._isMobile) {
      this._cone.position.set(0.4, 0.6, 0);
    } else {
      this._cone.position.set(0.75, 0, 0);
    }
    this._cone.name = "Kegel";
    this._coneTween = new TWEEN.Tween(this._cone.material).to(
      { opacity: 1 },
      120
    );
    // Cylinder
    const cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32);
    this._cylinder = new THREE.Mesh(cylinderGeometry, material.clone());
    if (this._isMobile) {
      this._cylinder.position.set(-0.4, 0.6, 0);
    } else {
      this._cylinder.position.set(-0.75, 0.75, 0);
    }
    this._cylinder.name = "Zylinder";
    this._cylinderTween = new TWEEN.Tween(this._cylinder.material).to(
      { opacity: 1 },
      180
    );
    // Icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(0.25, 0);
    this._icosahedron = new THREE.Mesh(icosahedronGeometry, material.clone());
    if (this._isMobile) {
      this._icosahedron.position.set(0.4, 0, 0);
    } else {
      this._icosahedron.position.set(0.0, 0.75, 0);
    }
    this._icosahedron.name = "Ikosaeder";
    this._icosahedronTween = new TWEEN.Tween(this._icosahedron.material).to(
      { opacity: 1 },
      190
    );
    // Octahedron
    const octahedronGeometry = new THREE.OctahedronGeometry(0.25, 0);
    this._octahedron = new THREE.Mesh(octahedronGeometry, material.clone());
    if (this._isMobile) {
      this._octahedron.position.set(-0.4, 0, 0);
    } else {
      this._octahedron.position.set(0.75, 0.75, 0);
    }
    this._octahedron.name = "Oktaeder";
    this._octahedronTween = new TWEEN.Tween(this._octahedron.material).to(
      { opacity: 1 },
      100
    );

    this._group = new THREE.Group();
    if (this._isMobile) {
      this._group.position.y = -0.5;
    } else {
      this._group.position.y = -0.5;
    }
    this._group.add(this._sphere);
    this._group.add(this._cube);
    this._group.add(this._cone);
    this._group.add(this._cylinder);
    this._group.add(this._icosahedron);
    this._group.add(this._octahedron);

    this._scene.add(this._group);
  }

  get scene() {
    return this._scene;
  }

  get raycastables() {
    return this._group.children;
  }

  fadeIn() {
    this._cubeTween.start();
    this._sphereTween.start();
    this._coneTween.start();
    this._cylinderTween.start();
    this._icosahedronTween.start();
    this._octahedronTween.start();
  }

  handleRaycast(hit) {
    if (hit.length > 0) {
      const { object } = hit[0];
      if (this._selectedShape && object.name === this._selectedShape.name)
        return;
      const toColor = {
        r: this._highlightColor.r,
        g: this._highlightColor.g,
        b: this._highlightColor.b,
      };
      new TWEEN.Tween(object.material.color).to(toColor, 100).start();
      this._onHover(object.name);
      if (this._mouseDown) {
        this._selectedShape = object;
        this._onSelect(MAPPINGS.SHAPE, this._selectedShape.name);
      }
    } else {
      this._group.children.forEach((object) => {
        if (this._selectedShape && this._selectedShape.name === object.name) {
          return;
        }
        const toColor = {
          r: this._defaultColor.r,
          g: this._defaultColor.g,
          b: this._defaultColor.b,
        };
        new TWEEN.Tween(object.material.color).to(toColor, 100).start();
      });
      if (this._selectedShape) {
        const toColor = {
          r: this._selectedColor.r,
          g: this._selectedColor.g,
          b: this._selectedColor.b,
        };
        new TWEEN.Tween(this._selectedShape.material.color)
          .to(toColor, 100)
          .start();
      }
    }
  }

  handlePointerDown() {
    this._mouseDown = true;
  }

  handlePointerUp() {
    this._mouseDown = false;
  }

  handlePointerMove() {}

  update(deltaTime) {
    // Cube
    if (this._cube !== this._selectedShape) {
      this._cube.rotation.x += deltaTime * 0.1;
      this._cube.rotation.y += deltaTime * 0.09;
      this._cube.rotation.z += deltaTime * 0.085;
    }
    // Cone
    if (this._cone !== this._selectedShape) {
      this._cone.rotation.x -= deltaTime * 0.21;
    }
    // Cylinder
    if (this._cylinder !== this._selectedShape) {
      this._cylinder.rotation.x -= deltaTime * 0.25;
    }
    // Icosahedron
    if (this._icosahedron !== this._selectedShape) {
      this._icosahedron.rotation.y += deltaTime * 0.05;
      this._icosahedron.rotation.z += deltaTime * 0.175;
    }
    // Octahedron
    if (this._octahedron !== this._selectedShape) {
      this._octahedron.rotation.z -= deltaTime * 0.175;
      this._octahedron.rotation.y += deltaTime * 0.275;
    }
  }
}

export default ShapeMapper;
