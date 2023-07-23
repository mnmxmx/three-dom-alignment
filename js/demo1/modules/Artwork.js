
import * as THREE from "three"
import Object from "./Object"
import controls from "./Controls"

import gsap from "gsap"

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

        this.isCameraFixed = false;

        this.cameraZ = 300;

        this.time = 0;
        this.delta = 0;

        this.dammy = {
            value: 0
        }

        this.init();
    }

    calcPercent(progress, min, max){
        return min + (max - min) * progress;
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

        this.$grids = document.querySelectorAll(".gridBoxColumn");

        const progressesColumn = [0.25, 0.5, 0.75, 1];
        const progressesRow = [1/3, 2/3, 1]
        const progressesRowInit = [Math.random(), Math.random(), Math.random(), Math.random()]

        const tl = gsap.timeline({repeat: -1});

        tl
        .to(this.dammy, 12, {
            value: 1,
            ease: "none",
            onUpdate: () => {
                let count = 0;
                for(let i = 0; i < progressesColumn.length; i++){
                    const $grid = this.$grids[i];
                    const radian = Math.cos(2 * (this.dammy.value * 2.0 + progressesColumn[i]) * Math.PI) * 0.5 + 0.5;
                    const percent = this.calcPercent(radian, 10, 40) + "%";
                    $grid.style.width = percent

                    for(let j = 0; j < progressesRow.length; j++){
                        const $item = this.$targets[count];
                        const radian = Math.cos(2 * (this.dammy.value * 2.0 + progressesRow[j] + progressesRowInit[i]) * Math.PI) * 0.5 + 0.5;
                        const percent = this.calcPercent(radian, 10, 56.6666666666666666666666666) + "%";
                        $item.style.height = percent;

                        count++;
                    }
                }

            }
        })

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
        let scale;

        if(this.isCameraFixed){
            this.camera.position.set(0, 0, this.cameraZ);
            scale = this.cameraZ / z
        } else {
            this.camera.position.set(0, 0, z);
            scale = 1
        }

        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();

    }


    update(){
        const delta = this.clock.getDelta();
        this.delta = delta;
        // this.time += this.delta;

        
        for(let i = 0; i < this.objects.length; i++){
            this.objects[i].resize(this.dimensions.x, this.dimensions.y, 1);
        }

        for(let i = 0; i < this.objects.length; i++){
            this.objects[i].update(this.dammy.value);
        }

        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
    }

    loop(){
        this.update();

        window.requestAnimationFrame(this.loop.bind(this));
    }
}