const config = {
	type: Phaser.AUTO, width: window.innerWidth, height: 768, physics: {
		default: 'arcade', arcade: {
			gravity: {y: 500}, debug: true
		}
	}, scene: {
		preload: preload, create: create, update: update
	}
};

const game = new Phaser.Game(config);

function preload () {
	this.load.image('background', 'static/images/background.jpg');
	this.load.image('hero', 'static/images/hero.png');
	this.load.image('enemy', 'static/images/enemy.png');
}

function create () {
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

//Коллайдер игрока
	this.player.body.setSize(2750, 3500).setOffset(550, 300); //уменьшим размер ее коллайдерат и зададим смещение коллайдера относительно левого верхнего угла

//Коллизии
	this.physics.add.collider(this.player, this.ground); //коллайдер между героем и землёй

// Обработка ввода с клавиатуры
	this.cursors = this.input.keyboard.createCursorKeys(); //Обработка ввода с клавиатуры

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
			this.player.setVelocityY(-650);
		}
	})

// Настройки физики
	this.physics.world.setBounds(0, 0, 12000, game.config.height); // Граница физического мира
	this.player.setCollideWorldBounds(true); // Запрет игроку выходить за пределы физического мира
	this.cameras.main.setBounds(0, 0, 12000, game.config.height); // Ограничение камеры
	this.cameras.main.startFollow(this.player); // Камера автоматом за игроком



// Создаём фон и текст всплывающего окна
    this.popupBg = this.add.rectangle(400, 300, 300, 200, 0x000000, 0.8); /* Рисуем прямоугольник (фон окна) 400, 300 — координаты по центру экрана.
																		  300, 200 — ширина и высота окна
	  																	  0x000000 — цвет (чёрный)
	  																	  0.8 — прозрачность (80%)*/
    this.popupText = this.add.text(400, 250, 'ИГра окончена', {color: '#'}) // Выводим текст и выравниваем текст по центру

// Создаем кнопку
	this.btRestart = this.add.text(400, 300, 'Заново', { // Создаём кнопку «Заново»
		backgroundColor: '#555',
		color: '#fff'
	})
	.setOrigin(0.5) // Центрируем текст
	.setInteractive() // Делаем кнопку кликабельной
	.on('pointerdown', () => this.scene.restart()); // Что делать при клике. В данном случае — перезапустить сцену


// Объединяем в контейнер
	this.popup = this.add.container(0, 0, [this.popupBg, this.popupText, this.btRestart]); /*this.add.container(x, y, [элементы]) — объединяет все части окна.
                                                                                           0, 0 — контейнер расположен в верхнем левом углу (координаты относительно сцены).
 																					       [popupBg, popupText, btnRestart] — всё, что мы хотим показать вместе.*/
// Создаем врага
	this.enemies = this.physics.add.group({
		key: 'enemy', 						  // ключ картинки, загруженной в preload()
		repeat: 6,  						  // сколько дополнительных врагов добавить (всего 7 с учётом первого)
		setXY: {x: 1000, y: 640, stepX: 1500} // координаты размещения и шаг по X
	});
	this.physics.add.collider(this.enemies, this.ground); // Cоздаём коллайдер между врагами и землёй


// Умемньшаем размер врагов и задаем размер их коллайдера
	this.enemies.children.iterate(function (enemy) {
		enemy.setScale(0.03);
		enemy.body.setSize(4000, 3500);
		enemy.body.setOffset(500, 1000);
	});

// Добавляем столкновение с игроком
	this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
		player.setTint(0xff0000); // Меняем цвет игрока при столкновении
		this.physics.pause(); // Останавливаем физику
	});

	this.popup.setVisible(false); // Скрыть кнопку

}

function update () {
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
	} else {
		this.player.setVelocityX(0); //Останавливаемся
	}

	// Проверяем стоит ли игрок на чем то твердом, для возможности прыгнуть
	if (this.cursors.space.isDown && this.player.body.blocked.down) {
		this.player.setVelocityY(-500);
	}


}