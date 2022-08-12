
import Keyboard from './Keyboard'
import {Rectangle} from "pixi.js"

function PrincessMovement (princess,princessTexture) {
    const left = Keyboard("ArrowLeft"),
          up = Keyboard("ArrowUp"),
          right = Keyboard("ArrowRight"),
          down = Keyboard("ArrowDown");
      let interval = ['','','','']
      let moves = [left,up,right,down]
      let section = [32,16,48,0]
      let speed = [[-1,0],[0,-1],[1,0],[0,1]]
      //Left arrow key `press` method
      for (let i = 0; i < moves.length; i++){
        let direction = moves[i]
        let piece = section[i]
        let velocity = speed[i]
        direction.press = () => {
          //Change the sprite's velocity when the key is pressed
          princess.vx = velocity[0];
          princess.vy = velocity[1];
          const directionward = new Rectangle(piece, 0, 16, 16);
          const directionFront = new Rectangle(piece, 16, 16, 16);
          const directionBack = new Rectangle(piece, 48, 16, 16);
          const walk = [directionward, directionFront, directionward, directionBack]
          princessTexture.frame = directionward
          let walkCounter = 0
          
          interval[i] = setInterval(function() {princessTexture.frame = walk[walkCounter]
            if (walkCounter < 3){
              walkCounter++
            }
            else{
              walkCounter = 0
            }
          }, 200)
          
        };
        //Left arrow key `release` method
        direction.release = () => {
          //If the left arrow has been released, and the right arrow isn't down,
          //and the sprite isn't moving vertically:
          //Stop the sprite
          interval.forEach(direction => clearInterval(direction))
          if (!right.isDown && princess.vy === 0) {
            princess.vx = 0;
          }
          else if (!left.isDown && princess.vy === 0) {
            princess.vx = 0;
          }
          else if (!up.isDown && princess.vx === 0) {
            princess.vy = 0;
          }
          else if (!down.isDown && princess.vx === 0) {
            princess.vy = 0;
          }
        };
      }
}

export default PrincessMovement