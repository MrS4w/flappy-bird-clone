function newElement(tagName, className) {
    const element = document.createElement(tagName)
    element.className = className
    return element
}

function Barrier(reverse = false) {
    this.element = newElement('div', 'barrier')

    const border = newElement('div', 'barrier-border')
    const body = newElement('div', 'barrier-body')
    this.element.appendChild(reverse ? body : border)
    this.element.appendChild(reverse ? border : body)

    this.setHeight = height => body.style.height = `${height}px`
}

function DoubleBarrier(height, space, x) {
    this.element = newElement('div', 'barriers')

    this.topBarrier = new Barrier(true)
    this.bottomBarrier = new Barrier(false)

    this.element.appendChild(this.topBarrier.element)
    this.element.appendChild(this.bottomBarrier.element)

    this.randomSpace = () => {
        const topHeight = Math.random() * (height - space)
        const bottomHeight = height - space - topHeight
        this.topBarrier.setHeight(topHeight)
        this.bottomBarrier.setHeight(bottomHeight)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.randomSpace()
    this.setX(x)
}

function Barriers(height, width, space, distance, notifyPoint) {
    this.doubleBarrier = [
        new DoubleBarrier(height, space, width),
        new DoubleBarrier(height, space, width + distance),
        new DoubleBarrier(height, space, width + distance * 2),
        new DoubleBarrier(height, space, width + distance * 3)
    ]

    const movement = 3
    this.move = () => {
        this.doubleBarrier.forEach(barriers => {
            barriers.setX(barriers.getX() - movement)
            if (barriers.getX() < -barriers.getWidth()) {
                barriers.setX(barriers.getX() + distance * this.doubleBarrier.length)
                barriers.randomSpace()
            }

            const middle = width / 2
            const acrossMiddle = barriers.getX() + movement >= middle && barriers.getX() < middle
            if (acrossMiddle) notifyPoint()
        })
    }
}

const barriers = new Barriers(550, 1200, 200, 400)
const gameArea = document.querySelector('[flappy]')
barriers.doubleBarrier.forEach(barriers => gameArea.appendChild(barriers.element))
setInterval(() => {
    barriers.move()
}, 20)