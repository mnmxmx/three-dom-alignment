import * as THREE from "three"

import vertexShader from "../../glsl/plane.vert";
import fragmentShader from "../../glsl/plane.frag";
import controls from "./Controls"

export default class Object{
  constructor(boxSize){
    this.boxSize = boxSize;

    this.uniforms = {
      uTime: {
        value: Math.random() * 10
      },
      uResolution: {
        value: new THREE.Vector2(this.boxSize, this.boxSize)
      },
      uNoiseScale: {
        value: Math.random()
      },
      uColor1: {
        value: new THREE.Color(0xff94bd)
      },
      uColor2: {
        value: new THREE.Color(0xfed462)
      },
      uBorderRadius: {
        value: 0
      }
    }
    this.init();
  }

  init(){
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(this.boxSize, this.boxSize),
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: this.uniforms,
        transparent: true
      })
    );
  }

  update(delta, heightRatio){
    this.uniforms.uTime.value += delta;
    // this.$target.style.borderRadius = controls.borderRadius + "px"
    this.uniforms.uBorderRadius.value = controls.borderRadius * heightRatio;
  }
}