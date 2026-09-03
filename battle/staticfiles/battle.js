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
    this.load.image('hero', 'static/images/hero.png');
}

function create() {
// Фон на всю ширину и высоту сцены
    const bgWidth = 12000;
    const bgHeight = this.game.config.height;
    this.background = this.add.tileSprite(0, 0, bgWidth, bgHeight, 'background').setOrigin(0, 0);
//Земля
    this.ground = this.physics.add.staticGroup();
    this.ground.create(6000, this.game.config.height, 'ground').setSize(12000, 35).setVisible(false);
//Игрок
    this.player = this.physics.add.sprite(100, 500, 'hero'); //Координаты появления героя
    this.player.setScale(0.05); //Уменьшаем картинку героя
    //this.player.setCollideWorldBounds(True);
//Коллайдер игрока
    this.player.body.setSize(2750, 3500).setOffset(550, 300); //уменьшим размер ее коллайдерат и зададим смещение коллайдера относительно левого верхнего угла
//Коллизии
    this.physics.add.collider(this.player, this.ground); //коллайдер между героем и землёй
// Обработка ввода с клавиатуры
    this.cursors = this.input.keyboard.createCursorKeys();
// Добавления Escape и Пробела
    this.escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
// Слушает прыжок по 1 нажатию
    this.input.keyboard.on('keyboard-SPACE', () => {
        if (this.player.body.blocked.down) {
            this.player.setVelocityY(-500);
        }
    });
};


function update() {
    // Проверка какая клавиша нажата
    if (this.cursors.left.isDown) {
        console.log('Нажата стрелка ВЛЕВО');
    }
    if (this.cursors.right.isDown) {
        console.log('Нажата стрелка ВПРАВО');
    }
    if (this.cursors.up.isDown) {
        console.log('Нажата стрелка ВВЕРХ');
    }
    if (this.cursors.down.isDown) {
        console.log('Нажата стрелка ВНИЗ');
    }
    // Добавляем движение игрока
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);   // движение влево
        this.player.flipX = true;         // Поворачиваем картинку игрока влево
    }
    if (this.cursors.right.isDown) {
        this.player.setVelocityX(160); // Двигаемся вправо
        this.player.flipX = false; // Поворачиваем картинку игрока вправо
    }
    else {
        this.player.setVelocityX(0); //Останавливаемся
    }

    // Проверяем стоит ли игрок на чем то твердом, для возможности прыгнуть
    if (this.cursors.space.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-500);
    }


}