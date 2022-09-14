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

const start = new Container()
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
  "NinjaAdventure/Backgrounds/Tilesets/TilesetHouse.png",
  "NinjaAdventure/Backgrounds/Tilesets/TilesetFloorDetail.png"])
  .load(setup);
  
function loadProgressHandler(loader, resource){
  console.log(loader.progress)
  console.log(resource.url)
  console.log(resource.error)
}

let begin,princess,OldMan,cow,house,gemsFast,gemsSlow,gemSpeed,trees,state

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
  const Gem1 = lodash.cloneDeep(TreeTexture)
  const Gem2 = lodash.cloneDeep(TreeTexture)
  const HouseTexture = TextureCache["NinjaAdventure/Backgrounds/Tilesets/TilesetHouse.png"]
  const Floor = TextureCache["NinjaAdventure/Backgrounds/Tilesets/TilesetFloorDetail.png"]
  
  const small = new Rectangle(0, 0, 16, 16);
  const treeFrame = new Rectangle(0, 0, 32, 32)
  const treeFrame2 = new Rectangle(32, 0, 32, 32)
  const houseFrame = new Rectangle(8, 80, 32, 32)
  const shrubFrame1 = new Rectangle(0, 160, 16, 16)
  const shrubFrame2 = new Rectangle(16, 160, 16, 16)
  const shrubFrame3 = new Rectangle(32, 160, 16, 16)
  const shrubFrame4 = new Rectangle(48, 160, 16, 16)
  const shrubFrame5 = new Rectangle(64, 160, 16, 16)
  const gemFrame1 = new Rectangle(0, 240, 16, 16)
  const gemFrame2 = new Rectangle(16, 240, 16, 16)
  const floorFrame = new Rectangle(48, 40, 16, 8)
  
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
  Gem1.frame = gemFrame1
  Gem2.frame = gemFrame2
  Floor.frame = floorFrame
  
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
  
  gemSpeed = 1
  
  
  PrincessMovement(princess,princessTexture)
  CowMovement(cow,CowTexture,princess,size)
  
  game.addChild(cow)
  game.addChild(house)
  game.addChild(OldMan)
  
  gemsFast = []
  gemsSlow = []
  let shrubPosition = {}
  trees = []
  
  let shrubsTexture = [Shrub1,Shrub2,Shrub3,Shrub4,Shrub5,Gem1,Gem2]
  let treesTexture = [TreeTexture,TreeTexture2]
  
  for (let i = 0; i < size * size; i++){
    let num = Math.round(Math.random() * 6)
    let plant = new Sprite(shrubsTexture[num])
    plant.x = Math.floor(Math.random() * size * 2) * 16
    plant.y = Math.floor(Math.random() * size * 2) * 16
    let overlap = true
    while(overlap){ //Make sure that no shrubs/gems are overlapping
      if (shrubPosition[plant.x.toString() + plant.y.toString()]){
        plant.x = Math.floor(Math.random() * size * 2) * 16
        plant.y = Math.floor(Math.random() * size * 2) * 16
      }
      else {
        overlap = false
      }
    }
    game.addChild(plant)
    shrubPosition[plant.x.toString() + plant.y.toString()] = true
    if (num === 5){
      gemsSlow.push(plant)
    }
    else if (num === 6){
      gemsFast.push(plant)
    }
  }
  
  for (let i = 0; i < size * 2; i++){
    for (let j = 0; j < size * 2; j++){
      if (Math.random() > 0.3){
        let floor = new Sprite(Floor)
        floor.x = i * 16
        floor.y = j * 16
        if (!shrubPosition[floor.x.toString() + floor.y.toString()]){
            game.addChild(floor)
        }
      }
    }
  }
  
  for (let i = 0; i < size; i ++){ //placing all the trees as a grid
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
  const style2 = new TextStyle({
    fontFamily: "fantasy",
    fontSize: 54,
    align: "center",
    dropShadow: true,
    dropShadowColor: "green"
  });
  const style3 = new TextStyle({
    fontFamily: "fantasy",
    fontSize: 20,
    align: "center",
    dropShadow: true,
    dropShadowColor: "grey"
  });
  const halfway = size * 32 /2
  
  let messageLose = new Text("You lose", style)
  messageLose.position.set(halfway,halfway)
  messageLose.anchor.set(0.5,0.5)
  
  let messageWin = new Text("You win", style)
  messageWin.position.set(halfway,halfway)
  messageWin.anchor.set(0.5,0.5)
  
  let instructions = new Text("Use the arrow keys to move\nReach the arch at the end of the forest\nWatch out for the cow", style3)
  instructions.position.set(halfway,halfway * 0.3)
  instructions.anchor.set(0.5,0.5)
  
  let title = new Text("Princess Pixi\n Escape the Dread Cowboy!!", style2)
  title.position.set(halfway,halfway * 0.8)
  title.anchor.set(0.5,0.5)
  
  begin = new Text("Start", style)
  begin.position.set(halfway,halfway * 1.3)
  begin.anchor.set(0.5,0.5)
  
  start.addChild(instructions)
  start.addChild(title)
  start.addChild(begin)
  
  game.visible = false
  
  lose.addChild(messageLose)
  lose.visible = false //initially not visible
  
  win.addChild(messageWin)
  win.visible = false
  
  app.stage.addChild(start)
  app.stage.addChild(game)
  app.stage.addChild(lose)
  app.stage.addChild(win)
  
  state = pause
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

  princess.x += princess.vx * gemSpeed;
  princess.y += princess.vy * gemSpeed;
  
  cow.x += cow.vx;
  cow.y += cow.vy;
  
  if (hitCow(princess,OldMan)){
    console.log('ow') 
  }
  if (hitCow(princess,cow)){ //show game over screen if princess touches cow
    game.visible = false
    lose.visible = true
    state = pause
  }
  if (princess.x > (size - 1) * 32 && princess.y > (size - 1) * 32){ //show win screen if reach bottom right corner of maze
    game.visible = false
    win.visible = true
    state = pause
  }
  trees.forEach(tree => {
    if (hitTree(princess,tree)){ //Stops princess from moving into the trees
      princess.x -= princess.vx * gemSpeed
      princess.y -= princess.vy * gemSpeed
    }
  })
  gemsSlow.forEach(gem => { //when hit a gem change speed and remove the gem
    if (hitCow(princess, gem)){
      if (!gem.hit){
        gemSpeed -= 0.1
      }
      gem.hit = true
      if (gemSpeed < 0){
        gemSpeed = 0
      }
      game.removeChild(gem)
      gem = ''
    }
  })
  gemsFast.forEach(gem => {
    if (hitCow(princess,gem)){
      if (!gem.hit){
        gemSpeed += 0.1
      }
      gem.hit = true
      game.removeChild(gem)
      gem = ''
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

function pause(){
  princess.vx = 0
  princess.vy = 0
  cow.vx = 0
  cow.vy = 0
  begin.interactive = true
  begin.on('click', () => {
    state = play
    game.visible = true
    start.visible = false
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