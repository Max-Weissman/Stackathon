import * as PIXI from "pixi.js"
const lodash = require('lodash');

import hitCow from './CollisionCow'
import hitTree from './CollisionTree'
import PrincessMovement from './PrincessMovement'
import CowMovement from './CowMovement'
import grid from './TreeMapper'

const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    TextureCache = PIXI.utils.TextureCache

const app = new Application({width: 256, height: 256, translucent: true})

const rend = app.renderer

rend.backgroundColor = "0x23dc5c"

// rend.autoDensity = true
// rend.resize(512,512)
app.resizeTo = window

document.body.appendChild(app.view)

loader.onProgress.add(loadProgressHandler)

loader
  .add(["NinjaAdventure/Actor/Characters/Princess/SpriteSheet.png",
  "NinjaAdventure/Actor/Characters/OldMan2/SpriteSheet.png",
  "NinjaAdventure/Actor/Animals/Cow/SpriteSheetWhite.png",
  "NinjaAdventure/Actor/Animals/Cow/SpriteSheetWhiteSide.png",
  "NinjaAdventure/Backgrounds/Tilesets/TilesetNature.png"])
  .load(setup);
  
function loadProgressHandler(loader, resource){
  console.log(loader.progress)
  console.log(resource.url)
  console.log(resource.error)
}

let princess,OldMan,cow,trees,state

function setup() {
  const princessTexture = TextureCache["NinjaAdventure/Actor/Characters/Princess/SpriteSheet.png"];
  const OldManTexture = TextureCache["NinjaAdventure/Actor/Characters/OldMan2/SpriteSheet.png"];
  const CowTexture = TextureCache["NinjaAdventure/Actor/Animals/Cow/SpriteSheetWhite.png"];
  const CowTextureSide = TextureCache["NinjaAdventure/Actor/Animals/Cow/SpriteSheetWhiteSide.png"];
  const TreeTexture = TextureCache["NinjaAdventure/Backgrounds/Tilesets/TilesetNature.png"]
  const TreeTexture2 = lodash.cloneDeep(TreeTexture) //Need to clone the tileset because you cant import the same one twice
  
  const small = new Rectangle(0, 0, 16, 16);
  const treeFrame = new Rectangle(0, 0, 32, 32)
  const treeFrame2 = new Rectangle(32, 0, 32, 32)
  
  princessTexture.frame = small
  OldManTexture.frame = small
  CowTexture.frame = small
  CowTextureSide.frame = small
  
  TreeTexture.frame = treeFrame
  TreeTexture2.frame = treeFrame2
  
  princess = new Sprite(princessTexture);
  OldMan = new Sprite(OldManTexture);
  cow = new Sprite(CowTexture)
  
  princess.x = 10
  princess.y = 10
  princess.vx = 0
  princess.vy = 0
  princess.anchor.set(0.5,0.5)
  
  OldMan.x = 100
  OldMan.y = 100
  
  cow.x = 20
  cow.y = 20
  cow.vx = 0
  cow.vy = 0
  
  
  PrincessMovement(princess,princessTexture)
  CowMovement(cow,CowTexture,CowTextureSide)
  
  app.stage.addChild(cow)
  app.stage.addChild(OldMan)
  
  trees = []
  let treesTexture = [TreeTexture,TreeTexture2]
  
  for (let i = 0; i < grid.length; i ++){ //placing all the trees as a grid
    const row = grid[i]
    for (let j = 0; j < row.length; j++){
      const cell = row[j]
      if (cell === '1'){
        let tree= new Sprite(treesTexture[Math.round(Math.random())])
        tree.x = j * 32
        tree.y = i * 32
        app.stage.addChild(tree)
        trees.push(tree)
      }
    }
  }
  app.stage.addChild(princess)
 
  
  //Capture the keyboard arrow keys
  
  state = play
  app.ticker.add(() => gameLoop())
}

function gameLoop(delta) {

  //Update the current game state:
  state(delta);
}

function clear(interval){
  console.log(interval)
}

function play(delta) {

  //Move the sprite 1 pixel to the right each frame
  princess.x += princess.vx;
  princess.y += princess.vy;
  
  cow.x += cow.vx;
  cow.y += cow.vy;
  
  if (hitCow(princess,OldMan)){
    console.log('ow') 
  }
  trees.forEach(tree => {
    if (hitTree(princess,tree)){ //Stops princess from moving into the trees
      princess.x -= princess.vx
      princess.y -= princess.vy
    }
  })
}


 // setTimeout(function() {sprite.position.set(100,100)}, 1000);
  // setTimeout(function() {sprite.height = 100
  //   sprite.scale.x = 3
  // }, 2000);
  // setTimeout(function() {sprite.rotation = 10}, 3000);
  // setTimeout(function() {sprite.scale.set(2,2)}, 4000);
  // setTimeout(function() {sprite.pivot.set(50,50)
  //   sprite.rotation = 10
  // }, 5000);
  // setTimeout(function() {sprite.visible = false}, 6000);