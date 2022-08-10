import * as PIXI from "pixi.js"

const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;

const app = new Application({width: 256, height: 256, translucent: true})

const rend = app.renderer


rend.backgroundColor = 0xFF0000
// rend.autoDensity = true
// rend.resize(512,512)
// app.resizeTo = window

document.body.appendChild(app.view)

loader
  .add("play.png")
  .load(setup);
  

function setup() {
  const sprite = new 
  
  
  Sprite(
    resources["play.png"].texture
  );
  app.stage.addChild(sprite)
 setTimeout(function() {sprite.visible = false}, 1000);
}
