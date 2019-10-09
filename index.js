const board = document.querySelector("#board")
const controls = document.querySelector("#controls")
const form = document.querySelector("#form")
let toggleAmortization = true
let targetTiles;
let nextId = 0
let last = 0;

let prevTile;



NodeList.prototype.slice = Array.prototype.slice

const gridLength = 30
const gridHeight = 15

function reset(){
  targetTiles = null
  board.innerHTML = ""
  last = 0
  createGrid(gridLength, gridHeight)
}

function createGrid(length, height){

  for (let i=0; i < length; i++){
    for (let j=0; j < height; j++){

      const isFilled = Math.random() > 0.5 ? " filled" : ""

      board.insertAdjacentHTML("beforeend", `
        <div class="tile${isFilled}" data-action="flip" data-x=${j} data-y=${i}></div>
      `)
    }
  }
}

controls.addEventListener("click", function(e){
  if(e.target.dataset.action === "reset") {
    reset()
  } else if(e.target.dataset.action === "amortize"){
    if (toggleAmortization){
      e.target.innerText = "AMORTIZE!"
    } else {
      e.target.innerText = "UN-AMORTIZE!"
    }

    toggleAmortization = !toggleAmortization
    
  }
})

board.addEventListener("click", function(e){

  

  if (e.target.className !== "tile array-slot"){
    if(e.target.dataset.action === "flip"){
      if(e.shiftKey){
        e.target.className = "tile linked-list"

        const newVal = Math.round(Math.random()*1000)
        nextId++
        e.target.innerHTML = `
          address: ${nextId}
          <br>
          value: ${newVal}
          <br>
          <span>next: null<span>
        `
        if (prevTile){
          // drawLine(prevTile, e.target)
          prevTile.querySelector("span").innerText = `next: ${nextId}`
        } 
        prevTile = e.target
        return
      }

      if(e.target.className === "tile"){
        e.target.className = "tile filled"
        e.target.innerText = ""
      } else {
        e.target.className = "tile"
        e.target.innerText = ""
      }
    }
  }
})

// function drawLine(prev, next){
//   console.log("drawing", prev.offsetLeft)
//   console.log("drawing", prev.offsetTop)

//   const width = Math.abs(next.offsetLeft - prev.offsetLeft)
//   const height = Math.abs(next.offsetTop - prev.offsetTop)

//   const tileWidth = prev.offsetWidth
//   const tileHeight = prev.offsetHeight

//   board.insertAdjacentHTML("beforeend",`
//     <svg width="${width+(tileWidth/2)}" height="${height+(tileHeight/2)}" style="position: absolute;"><line x1="0" y1="0" x2="500" y2="500" stroke="black"/></svg>

//   `)

// }

form.addEventListener("submit", function(e){
  e.preventDefault()
  const input = e.target.input.value
  const values = input.split(",")
  let length = values.length
  if (toggleAmortization){
    let powerOfTwo = 1

    while(powerOfTwo < length){
      powerOfTwo = powerOfTwo*2
    }
    length = powerOfTwo
  }
  
  if (targetTiles){
    resetTiles()
  }

  const success = findNext(length)

  if (success){
    targetTiles.forEach((tile,index) => {
      tile.innerText = values[index] || ""
      tile.className += " array-slot"
    })
  } else {
    alert(`Couldn't find enough memory for ${length} thang(s)!!`)
  }
})

function findNext(count){
  const tiles = document.querySelectorAll(".tile")
  // let start = null;
  let index = null;

  for(let i = toggleAmortization ? 0 : last; i<tiles.length; i++){
    if(tiles[i].className === "tile"){
      let j = i
      while(tiles[j].className === "tile" && (j-i) < count){
        j++
        if(!tiles[j])
          break
      }
      if ((j-i) === count){
        // start = tiles[i]
        index = i
        break
      }
    }
  }

  last = index + count

  if (index === null){
    return false
  }

  targetTiles = tiles.slice(index, index+count)
  return true
}

function resetTiles(){
  targetTiles.forEach(tile => {
    tile.className = "tile"
    tile.innerText = ""
  })
}

createGrid(gridLength, gridHeight)



