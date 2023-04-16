import Phaser from 'phaser';
import io from 'socket.io-client';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });
    }


    preload() {
        
    }

    create() {
        //this.socket = io('http://localhost:3000');
        this.socket = io('http://192.168.0.110:3000');

        let game_cards = {}  
        
        this.socket.on('struct create', (new_card) => {
            console.log('this: ', this)
            let token = this.add.rectangle(49, 51, new_card.width, new_card.height, 0xff00ff).setInteractive();
            token.name = new_card.id
            console.log('token: ', token)
            this.input.setDraggable(token);
            game_cards[new_card.id] = new_card
        });
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.socket.emit('update card position', gameObject.name, {dragX, dragY})
        });

        this.socket.on('struct update', (gameObject, x, y) => {
            console.log("struct update: ", gameObject.x, x, gameObject.y, y, gameObject.name)
            gameObject.x = x
            gameObject.y = y
        });

        this.socket.on('card_position_update', (card_id, new_coords) => {
            if (card_id in game_cards) {
                const child = this.children.getByName(card_id);
                child.x = new_coords.dragX
                child.y = new_coords.dragY
            }
        })
    }

    update() {

    }
}