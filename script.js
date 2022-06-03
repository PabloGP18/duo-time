console.log('Hello World')
window.requestAnimationFrame(main)
const canvas = document.getElementById('myCanvas');
// const c = canvas.getContext('2d');
let FPS = 7;
let timeLastFrameWasDrawn;
class GameElement {
    constructor(size, position) {
        this.size = size;
        this.position = position;
    }
    setPositionX(x) {
        this.position.x = x;
    }
    getPositionX() {
        return this.position.x;
    }
    setPositionY(y) {
        this.position.y = y;
    }
    getPositionY() {
        return this.position.y;
    }
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }
    getPosition() {
        return this.position;
    }
    setWidth(width) {
        this.size.width = width;
    }
    getWidth() {
        return this.size.width;
    }
    setHeight(height) {
        this.size.height = height;
    }
    getHeight() {
        return this.size.height;
    }

}
class SnakePiece extends GameElement {
    constructor(size, position) {
        super(size, position)
    }

}
class Snake {
    constructor(SnakeHead) {
        this.body = [];
        this.head = SnakeHead;
        this.color = 'orange';
        this.body.push(this.head)
        this.snakePieceSize = this.head.size;
        this.direction = {
            x: 0, y: 0
        }
        this.speed = 1;
    }
    setDirection(direction) {
        switch (direction) {
            case 'up':
                if (this.direction.y > 0) return
                this.direction = {
                    x: 0, y: -1
                };
                break;
            case 'down':
                if (this.direction.y < 0) return
                this.direction = {
                    x: 0, y: 1
                };
                break;
            case 'left':
                if (this.direction.x > 0) return
                this.direction = {
                    x: -1, y: 0
                }
                break;
            case 'right':
                if (this.direction.x < 0) return
                this.direction = {
                    x: 1, y: 0
                }
                break;
            default:
                this.direction = {
                    x: 0, y: 0
                }
                break;
        }
    }
    updatePosition() {

        this.updateHeadPosition();
    }
    updateHeadPosition() {
        this.head.position.x += this.head.getWidth() * this.direction.x * this.speed;
        this.head.position.y += this.head.getHeight() * this.direction.y * this.speed;
    }
    updateBodyPosition(prevPiece, pieceToUpdate) {
        if (this.body.length <= 1) return;
        // pieceToUpdate.position.x = prevPiece.position.x - (pieceToUpdate.size.width * this.direction.y);
        // pieceToUpdate.position.y = prevPiece.position.y - (pieceToUpdate.size.height * this.direction.y);
        // for (let i = 1; i < this.body.length; i++) {
        //     this.body[i].position.x = this.body[i - 1].position.x - (this.body[i].size.width * this.direction.x);
        //     this.body[i].position.y = this.body[i - 1].position.y - (this.body[i].size.height * this.direction.y);
        // }
    }
    addBodyPart() {
        const newPartsize = {
            width: this.head.size.width,
            height: this.head.size.height
        }
        const newPartPosition = {
            x: this.head.position.x,
            y: this.head.position.y
        }
        const newPart = new SnakePiece(newPartsize, newPartPosition);
        this.body.push(newPart)
    }
}
class Apple extends GameElement {
    constructor(size, position) {
        super(size, position)
        this.color = 'red';
        this.isEaten = false;
    }
}
class gameBoard {
    constructor(canvasElement, amountOfTiles) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.gameOver = false;
        this.gamePieceSize = {
            width: (this.canvas.width / amountOfTiles),
            height: (this.canvas.height / amountOfTiles)
        }
        this.snakeStartingPosition = {
            x: (this.gamePieceSize.width),
            y: (this.gamePieceSize.height)
        }
        this.init()
    }
    init() {
        this.createNewSnake()
        this.setControls()
        this.createApple()
    }
    update() {
        if (this.checkGameOver()) {
            this.gameOver = true;
            return
        };
        this.checkForAppleCollision()
        if (this.apple.isEaten) {
            this.createApple();
            this.addSnakeBodyPart();
        }
        this.snake.updatePosition()
        if (this.snake.body.length <= 1) return;
        for (let i = 1; i < this.snake.body.length; i++) {
            this.snake.updateBodyPosition(this.snake.body[i - 1], this.snake.body[i])
            this.drawBodyPiece(this.snake.body[i])

        }
    }
    draw() {
        if (this.checkGameOver()) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawSnakeHead()
        this.drawApple()
        if (this.snake.body.length < 1) return;
        for (let i = 1; i < this.snake.body.length; i++) {
            this.drawBodyPiece(this.snake.body[i])
        }
        this.snake.addBodyPart();
        this.snake.body.shift();

    }
    createNewSnake() {
        const snakeHead = new SnakePiece(this.gamePieceSize, this.snakeStartingPosition);
        this.snake = new Snake(snakeHead)
    }
    createApple() {
        // const randX = Math.floor(Math.random() * this.amountOfTiles)
        // const randY = Math.floor(Math.random() * this.amountOfTiles)
        const randX = Math.floor(Math.random() * (this.canvas.width / this.gamePieceSize.width)) * this.gamePieceSize.width;
        const randY = Math.floor(Math.random() * (this.canvas.height / this.gamePieceSize.height)) * this.gamePieceSize.height;
        const newApple = new Apple(this.snake.head.size, { x: randX, y: randY });
        this.apple = newApple;
    }
    drawApple() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.apple.getPositionX(), this.apple.getPositionY(), this.apple.getWidth(), this.apple.getHeight())
    }
    checkForAppleCollision() {
        if ((Math.floor(this.snake.head.position.x) === Math.floor(this.apple.position.x)) &&
            (Math.floor(this.snake.head.position.y) === Math.floor(this.apple.position.y))) {
            this.apple.isEaten = true;
        }
    }
    setControls() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.snake.setDirection('up')
                    break;
                case 'ArrowRight':
                    this.snake.setDirection('right')
                    break;
                case 'ArrowDown':
                    this.snake.setDirection('down')
                    break;
                case 'ArrowLeft':
                    this.snake.setDirection('left')
                    break;
            }
        })
    }
    drawSnakeHead() {
        this.ctx.fillStyle = this.snake.color;
        this.ctx.fillRect(this.snake.head.getPositionX(), this.snake.head.getPositionY(), this.snake.head.getWidth(), this.snake.head.getHeight());
    }
    drawSnakeBody() {
        if (this.snake.body.length <= 1) return
        this.ctx.fillStyle = 'blue';
        for (let i = 1; i < this.snake.body.length; i++) {
            this.ctx.fillRect(this.snake.body[i].position.x, this.snake.body[i].position.y, this.snake.body[i].size.width, this.snake.body[i].size.height)
        }
    }
    drawBodyPiece(piece) {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(piece.position.x, piece.position.y, piece.size.width, piece.size.height)
    }
    addSnakeBodyPart() {
        this.snake.addBodyPart();
    }
    checkGameOver() {
        if (Math.floor(this.snake.head.position.x) >= Math.floor(this.canvas.width)) {
            return true;
        } else if (Math.floor(this.snake.head.position.y) >= Math.floor(this.canvas.height)) {
            return true
        } else if (Math.floor(this.snake.head.position.y) <= Math.floor(-1)) {
            return true
        } else if (Math.floor(this.snake.head.position.x) <= Math.floor(-1)) {
            return true
        } else if (this.checkForBodyCollision()) {
            return true;
        } else {
            return false;
        }

    }
    checkForBodyCollision() {
        let collision = false;
        for (let i = 2; i < this.snake.body.length; i++) {
            if (this.snake.head.position.x === this.snake.body[i].position.x - this.snake.head.size.width &&
                this.snake.head.position.y === this.snake.body[i].position.y - this.snake.head.size.height)
                collision = true
        }
        return false;
    }
}
const myGame = new gameBoard(canvas, 20)
function main(delta) {

    window.requestAnimationFrame(main)
    const secondsSinceLastRan = (delta - timeLastFrameWasDrawn) / 1000;
    if (secondsSinceLastRan < 1 / FPS) return;
    myGame.update()
    myGame.draw()

    timeLastFrameWasDrawn = delta;
}
cPosT = canvas.getBoundingClientRect().top;
cPosB = canvas.getBoundingClientRect().bottom;
window.onscroll = () => {
    if (!myGame.gameOver) {
        window.scroll(0, cPosB + 5000);
    }
};
const favoColor = document.getElementsByClassName('favoColor')[0];
const oldColor = favoColor.innerText;
favoColor.addEventListener('mouseover', () => {
    favoColor.firstElementChild.innerText = '-I like all colors equally-'
    favoColor.getElementsByClassName('amongUs')[0].src = 'https://wallpapers.gg/wp-content/uploads/2017/06/Rainbow-01.png'
})
favoColor.addEventListener('mouseleave', () => {
    favoColor.firstElementChild.innerText = oldColor;
})

const animal = document.getElementsByClassName('animal')[0];
const oldAni = animal.firstElementChild.innerText;
animal.addEventListener('mouseover', () => {
    animal.firstElementChild.innerText = '-I do not have Favorites- Tough if I did it would certainly not be dogs. Keep your dog away from me please <3'
    animal.getElementsByClassName('dogs')[0].src = 'https://cdn.modernghana.com/images/content/1018201735214_dog1.jpg'
})
animal.addEventListener('mouseleave', () => {
    animal.firstElementChild.innerText = oldAni;
})
const sport = document.getElementsByClassName('sport')[0];
const oldSport = sport.innerText;
sport.addEventListener('mouseover', () => {
    sport.firstElementChild.innerText = 'I do not sport'
    sport.getElementsByClassName('sportpic')[0].src = 'https://image-cdn.neatoshop.com/styleimg/59314/none/gray/default/353538-20;1495253846x.jpg'
})
sport.addEventListener('mouseleave', () => {
    sport.firstElementChild.innerText = oldSport;
})
const fictcharacter = document.getElementsByClassName('fictcharacter')[0];
const oldfictcharacter = fictcharacter.innerText;
fictcharacter.addEventListener('mouseover', () => {
    fictcharacter.firstElementChild.innerText = 'I like Doctor Strange, Because he thrived to do right by others, his way of helping was taken away. yet within losing all hope he found the courage to keep learnign new things so that once more he could be a helping hand'
    fictcharacter.getElementsByClassName('characterpic')[0].src = 'https://i.pinimg.com/originals/33/a4/54/33a4541188becbb8666e9bcf75a3834a.jpg'
})
fictcharacter.addEventListener('mouseleave', () => {
    fictcharacter.firstElementChild.innerText = oldfictcharacter;
})
const favoCeleb = document.getElementsByClassName('favoceleb')[0];
const oldCeleb = favoCeleb.innerText;
favoCeleb.addEventListener('mouseover', () => {
    favoCeleb.firstElementChild.innerText = 'When you pray for rain, Deal with the mud!'
    favoCeleb.getElementsByClassName('celebpic')[0].src = 'https://img.huffingtonpost.com/asset/59232fe42000003200cb202e.jpeg?cache=vGn14L3GUr&ops=1778_1000'
})
favoCeleb.addEventListener('mouseleave', () => {
    favoCeleb.firstElementChild.innerText = oldCeleb;
})
const challT = document.getElementsByClassName('challenge')[0].firstElementChild;
const oldChallT = challT.innerText;
challT.addEventListener('mouseover', () => {
    challT.innerText = 'Gotta lose the game to unlock scrolling,Use arrowkeys to move, eat the red squares to grow, hit the sides to lose';
})
challT.addEventListener('mouseleave', () => {
    challT.innerText = oldChallT;
})