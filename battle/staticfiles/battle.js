const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: 600,
    backgroundColor: '#363333',
    scene: {
        create: function () {
            this.add.text(window.innerWidth / 2, 280, 'Hello, Phaser!', { font: '24px Arial', fill: '#ffffff' });
        }
    }
};

const game = new Phaser.Game(config);