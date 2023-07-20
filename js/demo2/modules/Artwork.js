
import * as THREE from "three"
import Object from "./Object"
import controls from "./Controls"
export default class Artwork{
    constructor(props){
        this.props = props;
        this.$wrapper = props.$wrapper;

        this.aspect = 1;
        this.pixelRatio = null;

        this.fov = 52;

        this.object = null

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, 0.01, 10000);

        this.isCameraFixed = false;

        this.cameraZ = 300;

        this.boxSize = 10 + Math.floor(Math.random() * 10);

        this.time = 0;
        this.delta = 0;

        this.init();
    }

    init(){
        controls.init();
        this.pixelRatio = Math.min(2, window.devicePixelRatio);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        this.$canvas = this.renderer.domElement;
        this.$wrapper.appendChild(this.$canvas);

        this.renderer.setClearColor(0xffffff);
        this.renderer.setPixelRatio(this.pixelRatio);

        this.clock = new THREE.Clock();
        this.clock.start();

        this.$target = document.getElementById("box");
        this.$log = document.getElementById("log");

        this.object = new Object(this.boxSize);
        this.scene.add(this.object.mesh);

        this.resize();
        this.loop();
    }

    resize(){
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.aspect = width / height;
        this.renderer.setSize(width, height);

        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();

        this.updateCameraPosition(width, height);
    }

    updateCameraPosition(windowW, windowH){
        const rect = this.$target.getBoundingClientRect();

        const domHeight = rect.height;
        const objectJHeight = this.boxSize;
        const domWindowAspect = domHeight / windowH;
        const targetH = objectJHeight / domWindowAspect;

        this.heightRatio = objectJHeight / domHeight
        
        let x = (rect.left + rect.width * 0.5) - windowW * 0.5;
        x *= -this.heightRatio;

        let y = (rect.top + rect.height * 0.5) - windowH * 0.5;
        y *= this.heightRatio;

        var z = targetH / Math.tan(this.fov * Math.PI / 360) * 0.5;
        this.camera.position.set(x, y, z);

        this.$log.innerHTML = "";
        this.$log.innerHTML = `boxSize: ${this.boxSize}<br>cameraPosition: {<br>
            &nbsp;&nbsp;x: ${x},<br>&nbsp;&nbsp;y: ${y},<br>&nbsp;&nbsp;z: ${z}<br>}`
    }

    update(){
        const delta = this.clock.getDelta();
        this.delta = delta;
        this.time += this.delta;

        this.$target.style.borderRadius = controls.borderRadius + "px"

        this.object.update(this.delta, this.heightRatio);

        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
    }

    loop(){
        this.update();

        window.requestAnimationFrame(this.loop.bind(this));
    }
}