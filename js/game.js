window.onload = function () {
    var tileSize = 80;
    var numRows = 4;
    var numCols = 5;
    var tileSpacing = 10;
    var tilesArray = [];
    var selectedArray = [];
    var playSound;
    var game = new Phaser.Game(500, 500);
    var playGame = function (game) { }
    playGame.prototype = {
        preload: function () {
            game.load.spritesheet("tiles", "img/tiles.png", tileSize, tileSize);
        },
        create: function () {
            this.placeTiles();
        },
        placeTiles: function () {
            var leftSpace = (game.width - (numCols * tileSize) - ((numCols - 1) *
                tileSpacing)) / 2;
            var topSpace = (game.height - (numRows * tileSize) - ((numRows - 1) *
                tileSpacing)) / 2;
            for (var i = 0; i < numRows * numCols; i++) {
                tilesArray.push(Math.floor(i / 2));
            }
            for (i = 0; i < numRows * numCols; i++) {
                var from = game.rnd.between(0, tilesArray.length - 1);
                var to = game.rnd.between(0, tilesArray.length - 1);
                var temp = tilesArray[from];
                tilesArray[from] = tilesArray[to];
                tilesArray[to] = temp;
            }
            for (i = 0; i < numCols; i++) {
                for (var j = 0; j < numRows; j++) {
                    var tile = game.add.button(leftSpace + i * (tileSize +
                        tileSpacing), topSpace + j * (tileSize + tileSpacing),
                        "tiles", this.showTile, this);
                    tile.frame = 10;
                    tile.value = tilesArray[j * numCols + i];
                }
            }
        },
        showTile: function (target) {
            if (selectedArray.length < 2 && selectedArray.indexOf(target) == -1) {
                target.frame = target.value;
                selectedArray.push(target);
                if (selectedArray.length == 2) {
                    game.time.events.add(Phaser.Timer.SECOND, this.checkTiles, this);
                }
            }
        },
        checkTiles: function () {
            if (selectedArray[0].value == selectedArray[1].value) {
                selectedArray[0].destroy();
                selectedArray[1].destroy();
            }
            else {
                selectedArray[0].frame = 10;
                selectedArray[1].frame = 10;
            }
            selectedArray.length = 0;

        }
    }
    var titleScreen = function (game) { }
    titleScreen.prototype = {
        preload: function () {
            game.load.spritesheet("soundicons", "img/soundicons.png", 80, 80);
        },
        create: function () {
            var style = {
                font: "48px Monospace",
                fill: "#00ff00",
                align: "center"
            };
            var text = game.add.text(game.width / 2, game.height / 2 - 100,
                "Crack Alien Code", style);
            text.anchor.set(0.5);
            var soundButton = game.add.button(game.width / 2 - 100,
                game.height / 2 + 100, "soundicons", this.startGame, this);
            soundButton.anchor.set(0.5);
            soundButton = game.add.button(game.width / 2 + 100, game.height /
                2 + 100, "soundicons", this.startGame, this);
            soundButton.frame = 1;
            soundButton.anchor.set(0.5);
        },
        startGame: function (target) {
            if (target.frame == 0) {
                playSound = true;
            }
            else {
                playSound = false;
            }
            game.state.start("PlayGame");
        }
    }
    game.state.add("TitleScreen", titleScreen);
    game.state.add("PlayGame", playGame);
    game.state.start("TitleScreen");
}