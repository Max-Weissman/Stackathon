import {Rectangle} from "pixi.js"

function CowMovement (cow,cowTexture,cowTextureSide) {
  let speed = [[-1,0],[0,-1],[1,0],[0,1]]
  const idledown = new Rectangle(0, 0, 16, 16);
  const movedown = new Rectangle(16, 0, 16, 16);
  const walk = [idledown, movedown]
  let walkCounter = 0
  
  setInterval(function() {
    let direction = Math.floor(Math.random() * 4)
    let velocity = speed[direction]
    cow.vx = velocity[0]
    cow.vy = velocity[1]
    let interval = ''
    interval = setInterval(function() {
      cowTexture.frame = walk[walkCounter]
      if (walkCounter < 1){
        walkCounter++
      }
      else{
        walkCounter = 0
      }
    }, 200)
  }, 100 * Math.floor(Math.random() * 10))
  
        //Left arrow key `release` method
}

export default CowMovement