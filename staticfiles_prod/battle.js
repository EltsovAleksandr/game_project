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
	/*const bgWidth = 12000;
	const bgHeight = this.game.config.height;
	this.background = this.add.tileSprite(0, 0, bgWidth, bgHeight, 'background').setOrigin(0, 0);*/
this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background')
    .setOrigin(0, 0)
    .setScrollFactor(0);

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
	this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

// Слушает прыжок по 1 нажатию
	/*this.input.keyboard.on('keyboard-SPACE', () => {
		if (this.player.body.blocked.down) {
			this.player.setVelocityY(-1050);
		}
	})*/

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
		//this.popup.setPosition(this.cameras.main.scrollX + this.scale.width / 2, game.config.height / 2);
		this.setPopupVisible(true)
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
// --- Замените весь блок создания popup на этот: ---

    localStorage.setItem("score", this.score);

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // 1. Темный фон окна
    this.popupBg = this.add.rectangle(centerX, centerY, this.scale.width + 100, this.scale.height, 0x000000, 0.8)
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .setDepth(1000);

    // 2. Текст сообщения
    this.popupText = this.add.text(centerX, centerY - 70, 'Конец игры. Чтобы сохранить результат, войдите или зарегистрируйтесь.', {
        fontSize: '20px',
        color: '#fff',
        align: 'center'
    })
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0)
    .setDepth(1001);

    // Вспомогательная функция для кнопок без контейнера
    const createMenuButton = (scene, x, y, width, height, textStr, callback) => {
        const bg = scene.add.rectangle(x, y, width, height, 0x444444)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setDepth(1001)
            .setInteractive({ useHandCursor: true });

        const txt = scene.add.text(x, y, textStr, {
            fontSize: '18px',
            color: '#ffffff'
        })
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .setDepth(1002);

        bg.on('pointerdown', callback);
        bg.on('pointerover', () => bg.setFillStyle(0x666666));
        bg.on('pointerout', () => bg.setFillStyle(0x444444));

        return [bg, txt];
    };

    // 3. Создаем кнопки, привязанные к центру экрана
    const [btnRegBg, btnRegText] = createMenuButton(this, centerX, centerY + 10, 200, 42, 'Регистрация', () => {
        localStorage.setItem("score", this.score);
        window.location.href = '/register/';
    });

    const [btnLoginBg, btnLoginText] = createMenuButton(this, centerX, centerY + 65, 200, 42, 'Вход', () => {
        console.log('Кнопка вход отработала');
        localStorage.setItem("score", this.score);
        window.location.href = '/login/';
    });

    const [btnRestBg, btnRestText] = createMenuButton(this, centerX, centerY + 120, 200, 42, 'Заново', () => {
        this.scene.restart();
    });

    // Сохраняем группу всех элементов попапа для удобного показа/скрытия
    this.popupElements = [
        this.popupBg,
        this.popupText,
        btnRegBg, btnRegText,
        btnLoginBg, btnLoginText,
        btnRestBg, btnRestText
    ];

    // Функция для переключения видимости
    this.setPopupVisible = (visible) => {
        this.popupElements.forEach(el => el.setVisible(visible));
    };

    // Скрываем окно на старте
    this.setPopupVisible(false);

}

function update () {

	// В update():
	this.background.tilePositionX = this.cameras.main.scrollX * 0.3; // эффект параллакса
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
		//this.popup.setPosition(this.cameras.main.scrollX + this.scale.width / 2, game.config.height / 2);
		this.setPopupVisible(true);
	}

}