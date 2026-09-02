const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y:500 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'static/images/background.jpg');
    this.load.image('hero', 'static/images/hero.jpg')
    };

function create(): {
    this.background = this.add.tileSprite(0, 0, 12000, this.game.config.height, 'background').setOrigin(0, 0);
    this.ground = this.physics.add.staticGroup();
    this.ground.create(6000, this.game.config.height, 'ground').setSize(12000, 35).setVisible(false);
    this.player = this.physics.add.sprite(100, 500, 'hero'); //Координаты появления героя
    this.player.setScale(0,07); //Уменьшаем картинку героя
    this.player.body.setSize(2000, 3000).setOffset(500, 0); //уменьшим размер ее коллайдерат и зададим смещение коллайдера относительно левого верхнего угла
    this.physics.add.collider(this.player, this.ground); //коллайдер между героем и землёй

};


function update(): {
    // пока пусто, потом добавим логику
}