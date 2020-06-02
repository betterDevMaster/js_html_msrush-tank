var lose_2 = new Phaser.State();

lose_2.text = "",

lose_2.preload = function(){
	var 	locations 	= 	[	""],
									
			names		=	[	""];
	
	for (var i = 0; i < locations.length; i++){
		App.game.load.image(names[i], locations[i]);
	}
},	
		  
lose_2.create = function() {

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
 
lose_2.update = function() {

	
	if(App.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
		App.game.state.start("Wave", true, true);
		Wave.w_state = 0;
		Wave.ennemi_count = 0;
		Wave.timer_ennemi_spawn_1 = 1000;
		Wave.timer_ennemi_spawn_2 = 800;
		Wave.timer_ennemi_spawn_3 = 1000;
		Wave.timer_ennemi_spawn_4 = 800;
		Wave.speed_ennemi = 100;
		Wave.fireRate = 200;

	}
};
