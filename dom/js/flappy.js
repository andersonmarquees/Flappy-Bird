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

function Bird(heightPlay) {
    let fly = false

    this.element = createNewElement('img', 'passaro')
    this.element.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => fly = true
    window.onkeyup = e => fly = false

    this.animation = () => {
        const newY = this.getY() + (fly ? 8 : -5)
        const maxHeight = heightPlay - this.element.clientHeight

        if (newY <= 0) {
            this.setY(0)
        }else if (newY >= maxHeight) {
            this.setY(maxHeight)
        }else {
            this.setY(newY)
        }
    }
    this.setY(heightPlay / 2)
}

function Progress() {
    this.element = createNewElement('span', 'progresso')

    this.updatePoints = points => {
            this.element.innerHTML = points
    }
    this.updatePoints(0)
}

function overlapping(elementA, elementB) {
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}

function collision(bird, barriers) {
    let collision = false

    barriers.pares.forEach(parBarriers => {
        if(!collision) {
            const up = parBarriers.up.element
            const down = parBarriers.down.element
            collision = overlapping(bird.element, up) || overlapping(bird.element, down)
        }
    })
    return collision
}

function FlappyBird() {
    let points = 0

    const areaPlay = document.querySelector('[wm-flappy]')
    const height = areaPlay.clientHeight
    const width = areaPlay.clientWidth

    const progress = new Progress()
    const barriers = new Barriers(height, width, 200, 400,
        () => progress.updatePoints(++points) )
    const bird = new Bird(height)

    areaPlay.appendChild(progress.element)
    areaPlay.appendChild(bird.element)
    barriers.pares.forEach(par => areaPlay.appendChild(par.element))

    this.start = () => {
        const temp = setInterval(() => {
            barriers.animation()
            bird.animation()

            if(collision(bird, barriers)) {
                clearInterval(temp)
            }
        }, 20)
    }
}
new FlappyBird().start()

