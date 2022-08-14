import {Rectangle} from "pixi.js"

function plumin (one, two, size){
  if (one - two < 0){
    return one + two
  }
  else if(one + two > size * 32){
    return one - two
  }
  else{
    if (Math.round(Math.random()) > 0.5){
      return one + two
    }
    else{
      return one - two
    }
  }
}

function CowMovement (cow,cowTexture,princess, size) {
  let speed = [[-1,0],[0,-1],[1,0],[0,1]]
  const idle = new Rectangle(0, 0, 16, 16);
  const move = new Rectangle(16, 0, 16, 16);
  const walkdown = [idle, move]
  const walkleft = [idle,move]
  let walkCounter = 0
  let scuttle = [400,350,300,200,100,50]
  let scuttleCounter = 0
  setInterval(function() {
    let direction = Math.floor(Math.random() * 4)
    let velocity = speed[direction]
    cow.vx = velocity[0] * scuttleCounter / 5
    cow.vy = velocity[1] * scuttleCounter / 5
      setInterval(function() {
        cowTexture.frame = walkdown[walkCounter]
        if (walkCounter < 1){
          walkCounter++
        }
        else{
          walkCounter = 0
        }
      }, scuttle[scuttleCounter])
  }, 100 * Math.floor(Math.random() * 10))
  
  let distances = [2, 3, 4, 6, 10] //fraction of total screen distance between cow and princess
  let times = [5000, 9000, 12000, 15000, 17000] //when to move the cow closer
  
  for (let i = 0; i < distances.length; i++){
    setTimeout(function() {
      scuttleCounter++
      if (Math.abs(princess.x - cow.x) > size * 32 / distances[i]){
        cow.x = plumin(princess.x, size * 32 / distances[i], size)
      }
      if (Math.abs(princess.y - cow.y) > size * 32 / distances[i]){
        cow.y = plumin(princess.y, size * 32 / distances[i], size)
      }
    }, times[i] + 5000)
  }
  
  setTimeout(function() {
    setInterval(function() {
      if (Math.abs(princess.x - cow.x) > size * 32 / 10){
        cow.x = plumin(princess.x, size * 32 / 15, size)
      }
      if (Math.abs(princess.y - cow.y) > size * 32 / 10){
        cow.y = plumin(princess.y, size * 32 / 15, size)
      }
    }, 100)
  }, 23000)
}

export default CowMovement