import GUI from "lil-gui";
import * as THREE from "three"

class Controls{
  constructor(){
    this.gui = null
    this.borderRadius = 20
  }

  init(){
    this.gui = new GUI();
    this.gui.add(this, "borderRadius", 0, 100);
  }
}

export default new Controls();