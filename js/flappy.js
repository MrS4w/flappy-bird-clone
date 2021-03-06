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

function Barriers(height, width, space, distance, showScore) {
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
            if (acrossMiddle) showScore()
        })
    }
}

function Bird(gameHeight) {
    let flying = false;
    this.element = newElement('img', 'bird')
    this.element.src = 'img/bird.png'

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => flying = true
    window.onkeyup = e => flying = false

    this.move = () => {
        const newY = this.getY() + (flying ? 7 : -4)
        const maxHeight = gameHeight - this.element.clientHeight

        if (newY <= 0) {
            this.setY(0)
        } else if (newY >= maxHeight) {
            this.setY(maxHeight)
        } else {
            this.setY(newY)
        }
    }

    this.setY(gameHeight / 2)
}

function Progress() {
    this.element = newElement('span', 'progress')
    this.updateScore = score => {
        this.element.innerHTML = score
    }
    this.updateScore(0)
}

function hasOverlap(element1, element2) {
    const elementA = element1.getBoundingClientRect()
    const elementB = element2.getBoundingClientRect()

    const horizontal = elementA.left - elementA.width >= elementB.left
        && elementB.left + elementB.width >= elementA.left
    const vertical = elementA.top + elementA.height >= elementB.top
        && elementB.top + elementB.height >= elementA.top
    return horizontal && vertical
}

function overlapped(bird, barriers) {
    let overlapped = false
    barriers.doubleBarrier.forEach(doubleBarrier => {
        if (!overlapped) {
            const topBarrier = doubleBarrier.topBarrier.element
            const bottomBarrier = doubleBarrier.bottomBarrier.element
            overlapped = hasOverlap(bird.element, topBarrier) || hasOverlap(bird.element, bottomBarrier)

        }
    })
    return overlapped
}

function FlappyBird() {
    let score = 0

    const gameArea = document.querySelector('[flappy]')
    const height = gameArea.clientHeight
    const width = gameArea.clientWidth

    const progress = new Progress()
    const barriers = new Barriers(height, width, 200, 400, () => progress.updateScore(++score))
    const bird = new Bird(height)

    gameArea.appendChild(progress.element)
    gameArea.appendChild(bird.element)
    barriers.doubleBarrier.forEach(bar => gameArea.appendChild(bar.element))

    this.start = () => {
        const timer = setInterval(() => {
            barriers.move()
            bird.move()
            if (overlapped(bird, barriers)) {
                clearInterval(timer)
            }
        }, 20)
    }
}

new FlappyBird().start()