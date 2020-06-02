var Menu = new Phaser.State();
var grow = false;
Menu.text = "",

Menu.preload = function(){
	var 	locations 	= 	[	"Assets/bg_Menu.jpg"],
									
			names		=	[	"bg"];
	
	for (var i = 0; i < locations.length; i++){
		App.game.load.image(names[i], locations[i]);
	}
},	
		  
Menu.create = function() {

	var	 style 	= { 	font	: "40px Arial", 
								fill		: "#ffffff", 
								align	: "center" 
							};
						
	var	 style2 	= { 	font	: "28px Arial",
								fill		: "#ffffff",
							};
	
	
	text 				= App.game.add.text(850, 300, 'SeniorDev', style);
	var bg  = App.game.add.sprite(0,0,'bg');
	var	press 			= App.game.add.text(850, 600, 'Press space' , style2);
	
	text.anchor.set(0.5,0.5);
	press.anchor.set(0.5,0.5);

},



 
Menu.update = function() {

	if ( text.fontSize < 70 ) {
		grow = true;
	}
	else if ( text.fontSize > 100 ) {
		grow = false;
	}
	
	if ( grow === true ) {
		
		text.fontSize++;
	}
	else if ( grow === false ) {
		text.fontSize--;
		
	}
	
	if(App.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		App.game.state.start("Game", true, true);

	}
};