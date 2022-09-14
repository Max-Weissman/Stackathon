import * as PIXI from "pixi.js"
const lodash = require('lodash');

import hitCow from './CollisionCow'
import hitTree from './CollisionTree'
import PrincessMovement from './PrincessMovement'
import CowMovement from './CowMovement'
import grid from './TreeMapper'

let size = grid.length

const Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    TextureCache = PIXI.utils.TextureCache,
    TextStyle = PIXI.TextStyle,
    Text = PIXI.Text

const app = new Application({width: size * 32, height: size * 32, translucent: true})

const game = new Container()
const lose = new Container()
const win = new Container()

const rend = app.renderer

rend.backgroundColor = "0x23dc5c"

// rend.autoDensity = true
// rend.resize(512,512)

document.body.appendChild(app.view)


loader.onProgress.add(loadProgressHandler)

loader
  .add(["NinjaAdventure/Actor/Characters/Princess/SpriteSheet.png",
  "NinjaAdventure/Actor/Characters/OldMan2/SpriteSheet.png",
  "NinjaAdventure/Actor/Animals/Cow/SpriteSheetWhite.png",
  "NinjaAdventure/Actor/Animals/Cow/SpriteSheetWhiteSide.png",
  "NinjaAdventure/Backgrounds/Tilesets/TilesetNature.png",
  "NinjaAdventure/Backgrounds/Tilesets/TilesetHouse.png"])
  .load(setup);
  
function loadProgressHandler(loader, resource){
  console.log(loader.progress)
  console.log(resource.url)
  console.log(resource.error)
}

let princess,OldMan,cow, house,trees,state

function setup() {
  const princessTexture = TextureCache["NinjaAdventure/Actor/Characters/Princess/SpriteSheet.png"];
  const OldManTexture = TextureCache["NinjaAdventure/Actor/Characters/OldMan2/SpriteSheet.png"];
  const CowTexture = TextureCache["NinjaAdventure/Actor/Animals/Cow/SpriteSheetWhite.png"];
  // const CowTextureSide = TextureCache["NinjaAdventure/Actor/Animals/Cow/SpriteSheetWhiteSide.png"];
  const TreeTexture = TextureCache["NinjaAdventure/Backgrounds/Tilesets/TilesetNature.png"]
  const TreeTexture2 = lodash.cloneDeep(TreeTexture) //Need to clone the tileset because you cant import the same one twice
  const Shrub1 = lodash.cloneDeep(TreeTexture)
  const Shrub2 = lodash.cloneDeep(TreeTexture)
  const Shrub3 = lodash.cloneDeep(TreeTexture)
  const Shrub4 = lodash.cloneDeep(TreeTexture)
  const Shrub5 = lodash.cloneDeep(TreeTexture)
  const HouseTexture = TextureCache["NinjaAdventure/Backgrounds/Tilesets/TilesetHouse.png"]
  
  const small = new Rectangle(0, 0, 16, 16);
  const treeFrame = new Rectangle(0, 0, 32, 32)
  const treeFrame2 = new Rectangle(32, 0, 32, 32)
  const houseFrame = new Rectangle(8, 80, 32, 32)
  const shrubFrame1 = new Rectangle(0, 160, 16, 16)
  const shrubFrame2 = new Rectangle(16, 160, 16, 16)
  const shrubFrame3 = new Rectangle(32, 160, 16, 16)
  const shrubFrame4 = new Rectangle(48, 160, 16, 16)
  const shrubFrame5 = new Rectangle(64, 160, 16, 16)
  
  princessTexture.frame = small
  OldManTexture.frame = small
  CowTexture.frame = small
  // CowTextureSide.frame = small
  HouseTexture.frame = houseFrame
  TreeTexture.frame = treeFrame
  Shrub1.frame = shrubFrame1
  Shrub2.frame = shrubFrame2
  Shrub3.frame = shrubFrame3
  Shrub4.frame = shrubFrame4
  Shrub5.frame = shrubFrame5
  TreeTexture2.frame = treeFrame2
  
  princess = new Sprite(princessTexture);
  OldMan = new Sprite(OldManTexture);
  cow = new Sprite(CowTexture)
  house = new Sprite(HouseTexture)
  
  princess.x = 10
  princess.y = 10
  princess.vx = 0
  princess.vy = 0
  princess.anchor.set(0.5,0.5)
  
  OldMan.x = 100
  OldMan.y = 100
  
  cow.x = (size - 0.7) * 32
  cow.y = (size - 1) * 32
  cow.vx = 0
  cow.vy = 0
  
  house.x = (size - 1) * 32
  house.y = (size - 1) * 32
  
  
  PrincessMovement(princess,princessTexture)
  CowMovement(cow,CowTexture,null,princess,size)
  
  game.addChild(cow)
  game.addChild(house)
  game.addChild(OldMan)
  
  trees = []
  let treesTexture = [TreeTexture,TreeTexture2]
  let shrubsTexture = [Shrub1,Shrub2,Shrub3,Shrub4,Shrub5]
  
  for (let i = 0; i < size * size; i++){
    let plant = new Sprite(shrubsTexture[Math.round(Math.random() * 4)])
    plant.x = Math.floor(Math.random() * 32) * size
    plant.y = Math.floor(Math.random() * 32) * size
    game.addChild(plant)
  }
  
  for (let i = 0; i < grid.length; i ++){ //placing all the trees as a grid
    const row = grid[i]
    for (let j = 0; j < row.length; j++){
      const cell = row[j]
      if (cell === '1'){
        let tree= new Sprite(treesTexture[Math.round(Math.random())])
        tree.x = j * 32
        tree.y = i * 32
        game.addChild(tree)
        trees.push(tree)
      }
    }
  }
  
  game.addChild(princess)
  
  const style = new TextStyle({
    fontFamily: "fantasy",
    fontSize: 64
  });
  const halfway = size * 32 /2
  
  let messageLose = new Text("You lose", style)
  messageLose.position.set(halfway,halfway)
  messageLose.anchor.set(0.5,0.5)
  
  let messageWin = new Text("You win", style)
  messageWin.position.set(halfway,halfway)
  messageWin.anchor.set(0.5,0.5)
  
  lose.addChild(messageLose)
  lose.visible = false //initially not visible
  
  win.addChild(messageWin)
  win.visible = false
  
  app.stage.addChild(game)
  app.stage.addChild(lose)
  app.stage.addChild(win)
 
  console.log(messageLose)
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
  if (hitCow(princess,cow) && !win.visible){ //show game over screen if princess touches cow
    game.visible = false
    lose.visible = true
  }
  if (princess.x > (size - 1) * 32 && princess.y > (size - 1) * 32){ //show win screen if reach bottom right corner of maze
    game.visible = false
    win.visible = true
  }
  trees.forEach(tree => {
    if (hitTree(princess,tree)){ //Stops princess from moving into the trees
      princess.x -= princess.vx
      princess.y -= princess.vy
    }
  })
  if (princess.x < 0){ //stay in bounds
    princess.x = 0
  }
  if (princess.y < 0){
    princess.y = 0
  }
  if (princess.x > size * 32){ 
    princess.x = size * 32
  }
  if (princess.y > size * 32){
    princess.y = size * 32
  }
  if (cow.x < 0){
    cow.x = 0
  }
  if (cow.y < 0){
    cow.y = 0
  }
  if (cow.x > size * 32 - 16){
    cow.x = size * 32 - 16
  }
  if (cow.y > size * 32 - 16){
    cow.y = size * 32 - 16
  }
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