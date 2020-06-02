var App = {

	game : "",

	
	launch : function() {
		window.onload = function() {		
			App.game = new Phaser.Game(1800, 1000, 
				Phaser.AUTO,
				'gameContainer' 
			);
			
			// App.game.state est le stateManager du jeu !
			App.game.state.add("Menu", Menu);
			App.game.state.add("lose", lose);
			App.game.state.add("lose_2", lose_2);
			App.game.state.add("Game", Game);
			App.game.state.add("Wave", Wave);
			App.game.state.start("Menu");
		};
	}
};