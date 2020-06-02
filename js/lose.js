var lose = new Phaser.State();

lose.text = "",

lose.preload = function(){
	var 	locations 	= 	[	""],
									
			names		=	[	""];
	
	for (var i = 0; i < locations.length; i++){
		App.game.load.image(names[i], locations[i]);
	}
},	
		  
lose.create = function() {

	var	 style 	= { 	font	: "100px Arial", 
								fill		: "#ffffff", 
								align	: "center" 
							};
						
	var	 style2 	= { 	font	: "28px Arial",
							fill		: "#ffffff",
							};
	
	var	press 			= App.game.add.text(850, 450, 'Press enter for restart' , style2);
	text 				= App.game.add.text(850, 300, 'Game over', style);	  
	
	text.anchor.set(0.5,0.5);
	press.anchor.set(0.5,0.5);

},
 
lose.update = function() {

	
	if(App.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
		App.game.state.start("Game", true, true);
		Game.nb_life_1 = 5;
		Game.nb_life_2 = 5;
		Game.rasee();
	}
};
