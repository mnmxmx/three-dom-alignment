import * as THREE from "three"

import vertexShader from "../../glsl/plane.vert";
import fragmentShader from "../../glsl/plane.frag";
import controls from "./Controls"

const colors = [
  0x5c6fff,
  0xc48aff,
  0xff94bd,
  0xa9defe,
  0xfed462
]
export default class Object{
  constructor($target){
    this.$target = $target

    const colorIndex = [0, 1, 2, 3, 4]

    this.scale = 1

    let colorIndex1 = colorIndex.splice(Math.floor(colorIndex.length * Math.random()), 1)[0]
    let colorIndex2 = colorIndex.splice(Math.floor(colorIndex.length * Math.random()), 1)[0]

    this.uniforms = {
      uTime: {
        value: Math.random() * 10
      },
      uResolution: {
        value: new THREE.Vector2()
      },
      uNoiseScale: {
        value: Math.random()
      },
      uColor1: {
        value: new THREE.Color(colors[colorIndex1])
      },
      uColor2: {
        value: new THREE.Color(colors[colorIndex2])
      },
      uBorderRadius: {
        value: controls.borderRadius
      }
    }
    this.init();
  }

  init(){
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: this.uniforms,
        transparent: true
      })
    );
  }

  resize(windowW, windowH, scale){
    this.scale = scale;
    const rect = this.$target.getBoundingClientRect();

    this.plane.scale.set(
      rect.width * scale, rect.height * scale, 1.0
    );

    this.plane.position.set(   
      (rect.left + rect.width * 0.5 - windowW * 0.5) * scale,
      (-rect.top - rect.height * 0.5 + windowH * 0.5) * scale,
      0.0
    );

    this.uniforms.uResolution.value.set(
      rect.width * scale, rect.height * scale
    );
  }

  update(delta){
    this.uniforms.uTime.value += delta;
    this.$target.style.borderRadius = controls.borderRadius + "px"
    this.uniforms.uBorderRadius.value = controls.borderRadius * this.scale;
  }
}