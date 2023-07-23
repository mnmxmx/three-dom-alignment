import GUI from "lil-gui";
import * as THREE from "three"

class Controls{
  constructor(){
    this.gui = null
    this.borderRadius = 100
  }

  init(){
    // this.gui = new GUI();
    // this.gui.add(this, "borderRadius", 0, 200);
  }
}

export default new Controls();