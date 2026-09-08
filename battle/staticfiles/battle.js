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
	this.load.image('coin', 'static/images/coin.jpg');
	this.load.image('arch', 'static/images/arch.jpg');
}

function create () {
// Фон на всю ширину и высоту сцены
	const bgWidth = 12000;
	const bgHeight = this.game.config.height;
	this.background = this.add.tileSprite(0, 0, bgWidth, bgHeight, 'background').setOrigin(0, 0);


//Земля
	this.ground = this.physics.add.staticGroup();
	this.ground.create(6000, this.game.config.height, 'ground').setSize(12000, 35).setVisible(false);

//Арка
	this.add.image(11500, game.config.height - 200, 'arch').setScale(0.08);

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
	this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
	this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

// Слушает прыжок по 1 нажатию
	this.input.keyboard.on('keyboard-SPACE', () => {
		if (this.player.body.blocked.down) {
			this.player.setVelocityY(-1050);
		}
	})

// Настройки физики
	this.physics.world.setBounds(0, 0, 12000, game.config.height); // Граница физического мира
	this.player.setCollideWorldBounds(true); // Запрет игроку выходить за пределы физического мира
	this.cameras.main.setBounds(0, 0, 12000, game.config.height); // Ограничение камеры
	this.cameras.main.startFollow(this.player); // Камера автоматом за игроком





// Создаем врага
	this.enemies = this.physics.add.group({
		key: 'enemy', 						  // ключ картинки, загруженной в preload()
		repeat: 6,  						  // сколько дополнительных врагов добавить (всего 7 с учётом первого)
		setXY: {x: 1000, y: 640, stepX: 1500} // координаты размещения и шаг по X
	});
	this.physics.add.collider(this.enemies, this.ground); // Cоздаём коллайдер между врагами и землёй


// Умемньшаем размер врагов и задаем размер их коллайдера
	this.enemies.children.iterate(function (enemy) {
		enemy.setScale(0.02);
		enemy.body.setSize(4000, 3500);
		enemy.body.setOffset(500, 1000);
	});

// Добавляем столкновение с игроком
	this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
		player.setTint(0xff0000); // Меняем цвет игрока при столкновении
		this.physics.pause(); // Останавливаем физику
		this.popup.setPosition(this.cameras.main.scrollX + this.scale.width / 2, game.config.height / 2);
		this.popup.setVisible(true)
	});



// Создаем монеты
	this.coinsTop = this.physics.add.group({
		key: 'coin',
		repeat: 13,
		setXY: {x: 500, y: 250, stepX: 800}
	});

	this.coinsBottom = this.physics.add.group({
		key: 'coin',
		repeat: 8,
		setXY: {x: 900, y: 450, stepX: 800}
	});

	this.coinsTop.children.iterate((coin) => {
		coin.setScale(0.012);
		coin.body.allowGravity = false;
	});

	this.coinsBottom.children.iterate((coin) => {
		coin.setScale(0.012);
		coin.body.allowGravity = false;
	});


	this.score = 0;
	this.physics.add.collider(this.player, this.coinsTop, (player, coin) => {
		coin.disableBody(true, true); /* Отключает физику объекта и скрывает его с экрана
		 							     Первый true — отключает физику монетки (она больше не участвует в столкновениях).
  										 Второй true — делает монетку невидимой (удаляет с экрана).*/
		this.score += 1;
		console.log(this.score);
	});
	this.physics.add.collider(this.player, this.coinsBottom, (player, coin) => {
		coin.disableBody(true, true);
		this.score += 1;
		console.log(this.score);
	});
// Создаем кнопку
// Окно регистрация - вход
	localStorage.setItem("score", this.score);
	// Фон и текст
	this.popupBg = this.add.rectangle(0, 0, game.config.width + 100, game.config.height, 0x000000, 0.8);
	this.popupText = this.add.text(0, -60, 'Конец игры. Чтобы сохранить результат, войдите или зарегистрируйтесь.', {fontsize: '24px', color: '#fff'}).setOrigin(0.5);

	// Кнопка Регистрация
	this.btnRegister = this.add.text(0, 20, 'Регистрация', { fontSize: '18px', backgroundColor: '#444', color: '#fff', padding: { x: 10, y: 10 } })
    .setOrigin(0.5);

	// Кнопка Вход
	this.btnLogin = this.add.text(0, 70, 'Вход', { fontSize: '18px', backgroundColor: '#444', color: '#fff'/*, padding: { x: 10, y: 10 }*/ })
	.setOrigin(0.5);


	// Кнопка рестарт
	this.btnRestart = this.add.text(0, 120, 'Заново', {
		fontsize: '18px',
		backgroundColor: '#444',
		color: '#fff'
	})
	.setOrigin(0.5); // Центрируем текст

	this.input.enableDebug(this.btnRegister);
	this.input.enableDebug(this.btnLogin);
	this.input.enableDebug(this.btnRestart);
	// Объединяем в контейнер
	 this.popup = this.add.container(this.cameras.main.ScrollX + this.scale.width / 2, game.config.height / 2, [ /*this.add.container(x, y, [элементы]) — объединяет все части окна.  [popupBg, popupText, btnRestart] — всё, что мы хотим показать вместе.*/
		 this.popupBg,
		 this.popupText,
		 this.btnLogin,
		 this.btnRegister,
		 this.btnRestart,
	 ]) ;
	 this.btnRegister
		.setInteractive()
    	.on('pointerdown', () => {
			localStorage.setItem("score", this.score);
			window.location.href = '/register/';});

	 this.btnLogin
		.setInteractive({ useHandCursor: true })
   		.on('pointerdown', () => {
		   console.log('Кнопка вход отработала');
		   localStorage.setItem("score", this.score);
		   window.location.href = '/login/';});

	 this.btnRestart
		.setInteractive() // Делаем кнопку кликабельной
		.on('pointerdown', () => this.scene.restart()); // Что делать при клике. В данном случае — перезапустить сцену

	this.popup.setScrollFactor(0);
    this.popup.setPosition(this.scale.width / 2, game.config.height / 2);


	this.popup.setVisible(false) // Скрываем окно

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
	else if (this.cursors.right.isDown) {
		this.player.setVelocityX(360); // Двигаемся вправо
		this.player.flipX = false; // Поворачиваем картинку игрока вправо
	} else {
		this.player.setVelocityX(0); //Останавливаемся
	}

	// Проверяем стоит ли игрок на чем то твердом, для возможности прыгнуть
	if (this.cursors.space.isDown && this.player.body.blocked.down) {
		this.player.setVelocityY(-600);
	}

	// Финал игры
	if (this.player.x >= 11000) {
		this.physics.pause();
		this.popup.setPosition(this.cameras.main.scrollX + this.scale.width / 2, game.config.height / 2);
		this.popup.setVisible(true);
	}

}