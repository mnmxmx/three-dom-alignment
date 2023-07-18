
import * as THREE from "three"
import Object from "./Object"
import controls from "./Controls"
export default class Artwork{
    constructor(props){
        this.props = props;
        this.$wrapper = props.$wrapper;
        this.dimensions = new THREE.Vector2();

        this.aspect = 1;
        this.pixelRatio = null;

        this.fov = 52;

        this.objects = []

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, 0.01, 10000);

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

        this.$targets = document.querySelectorAll(".item");


        for(let i = 0; i < this.$targets.length; i++){
            const $target = this.$targets[i]
            this.objects[i] = new Object($target);

            this.scene.add(this.objects[i].plane);
        }
        this.resize();
        this.loop();
    }

    resize(){
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.dimensions.set(width, height);
        this.aspect = width / height;

        this.renderer.setSize(this.dimensions.x, this.dimensions.y);

        let z = height / Math.tan(this.fov * Math.PI / 360) * 0.5;
        this.camera.position.set(0, 0, z);

        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();

        for(let i = 0; i < this.objects.length; i++){
            this.objects[i].resize(width, height);
        }
    }

    update(){
        const delta = this.clock.getDelta();
        this.delta = delta;
        this.time += this.delta;

        for(let i = 0; i < this.objects.length; i++){
            this.objects[i].update(this.delta);
        }

        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
    }

    loop(){
        this.update();

        window.requestAnimationFrame(this.loop.bind(this));
    }
}