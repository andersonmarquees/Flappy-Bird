// Function -> Create new element
function createNewElement(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}
function Barrier(reverse = false) {
    this.element = createNewElement('div', 'barreira')

    const border = createNewElement('div', 'borda')
    const body = createNewElement('div', 'corpo')

    this.element.appendChild(reverse ? body : border)
    this.element.appendChild(reverse ? border : body)

    this.setHeight = height => body.style.height = `${height}px`
}

function PairOfBarriers(height, open, x) {
    this.element = createNewElement('div', 'par-de-barreiras')

    this.up = new Barrier(true)
    this.down = new Barrier(false)

    this.element.appendChild(this.up.element)
    this.element.appendChild(this.down.element)

    this.sortedOpen = () => {
        const heightUp = Math.random() * (height - open)
        const heightDown = height - open - heightUp

        this.up.setHeight(heightUp)
        this.down.setHeight(heightDown)
    }
    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth
    
    this.sortedOpen()
    this.setX(x)
}
//const b = new PairOfBarriers(700, 350, 400)
//document.querySelector('[wm-flappy]').appendChild(b.element)


function Barriers(height, width, open, space, points) {
    this.pares = [
        new PairOfBarriers(height, open, width),
        new PairOfBarriers(height, open, width + space),
        new PairOfBarriers(height, open, width + space * 2),
        new PairOfBarriers(height, open, width + space * 3)
    ]

    const move = 3

    this.animation = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - move)

            if(par.getX() < -par.getWidth()) {
                par.setX(par.getX() + space * this.pares.length)
                par.sortedOpen()
            }

            const middle = width / 2
            const crossedMiddle = par.getX() + move >= middle && par.getX() < middle
            crossedMiddle && points()
        })
    }
}
const barreiras = new Barriers(700, 1100, 400, 400)
const areaJogo = document.querySelector('[wm-flappy]')
barreiras.pares.forEach(par => areaJogo.appendChild(par.element))
//setInterval(() => {
//    barreiras.animation()
//}, 2)
