var Game = new Phaser.State();

// reglage du jeu

//debug
Game.debug = false;
Game.disable_colision = false;

// nombre d'entité
Game.nb_obstacle = 50;
Game.nb_wall = 10;
Game.nb_ennemi = 20;
Game.nb_boss = 20;
Game.nb_life_1 = 7;
Game.nb_life_2 = 5;

// vitesse de deplacement
Game.speed_hero_1 = 10;
Game.speed_hero_2 = 10;
Game.stop_hero_1 = 10;
Game.stop_hero_2 = 10;

// hauteur de saut
Game.jump_hero_1_height = 1000;
Game.jump_hero_2_height = 1000;
Game.jump_hero_1_height_on_floor = 600;
Game.jump_hero_2_height_on_floor = 600;

// cadence de tir 
Game.fireRate = 100;
Game.firing_timer_boss = 0; 
Game.firing_timer = 0;
Game.firing_timer_2 = 0 ;
Game.nextFire = 0;
Game.nextFire_2 = 0;
Game.nextFire_boss = 0;
Game.nextFire_bomb = 0;
Game.fireRate_bomb = 100;

//variable de jeu
Game.world_height = 1000;
Game.world_width = 30000;
Game.hero_1;
Game.hero_2;
Game.ennemi_1;
Game.ennemi_2
Game.bullets_1;
Game.bullets_2;
Game.bomb;
Game.move_1 = false;
Game.move_2 = false;
Game.move_1_left = false;
Game.move_2_left = false;

//ennemis
Game.position_boss;
Game.position_bos_2;
Game.ennemi_boss;
Game.ennemi_boss_2;
Game.boss_pool=[];
Game.boss_pool_2=[];

//tirs
Game.living_ennemi_1 = [];
Game.living_ennemi_2 = [];
Game.living_ennemi_boss = [];
Game.living_ennemi_boss_2 = [];
Game.is_fire_1 = false;
Game.is_fire_2 = false;
Game.bomber_reverse = false;

//sauts
Game.jump_ready_1 = true;
Game.jump_ready_2 = false;
Game.jump_ready_1_floor = false;
Game.jump_ready_2_floor = true
// life
Game.life_pool= [];
Game.life_pool_2=[];
//modes
Game.support_mode_1 = false;
Game.attack_mode_1 = true;
Game.support_mode_2 = false;
Game.attack_mode_2 = true;
Game.move_1_left = false;

// spriteanim
Game.sprite_anim_hero1_left= false;
Game.sprite_anim_hero1_right= false;
Game.sprite_anim_hero1_fire_right= false;
Game.sprite_anim_hero1_fire_left= false;

Game.sprite_anim_hero2_left= false;
Game.sprite_anim_hero2_right= false;
Game.sprite_anim_hero2_fire_right= false;
Game.sprite_anim_hero2_fire_left= false;


Game.sprite_anim_support1_aimant_right= false;
Game.sprite_anim_support1_aimant_left= false;
Game.sprite_anim_support1_bomb_right= false;
Game.sprite_anim_support1_bomb_left= false;

Game.sprite_anim_support2_aimant_right= false;
Game.sprite_anim_support2_aimant_left= false;
Game.sprite_anim_support2_shield_right= false;
Game.sprite_anim_support2_shield_left= false;


Game.preload = function() {
	var locations = ['Assets/fond.jpg',
					 'Assets/fond_2.jpg',
					 'Assets/passerelle.png',
					 'Assets/plot.png',
					 'Assets/fire.png',
					 'Assets/boss.png',
					 'Assets/obstacle_1.png',
					 'Assets/fire-1.png',
					 'Assets/bomb.png',
					 'Assets/ennemi.png',
					 'Assets/wall_1.png',
					 'Assets/wall_2.png']
		names    = ['bg1',
					'bg2',
					'passerelle',
					'plot',
					'fire',
					'boss',
					'obstacle_1',
					'fire-1',
					'bomb',
					'ennemi',
					'wall_1',
					'wall_2'];

	for (var i = 0; i < locations.length; i++){
		App.game.load.image(names[i], locations[i]);
	}
	App.game.load.spritesheet("soldat_1", "Assets/soldat_1.png", 120, 117, 30);
	App.game.load.spritesheet("support_1", "Assets/support_1.png", 120, 117, 44);
	App.game.load.spritesheet("soldat_2", "Assets/soldat_2.png", 120, 117, 30);
	App.game.load.spritesheet("support_2", "Assets/support_2.png", 120, 117, 44);
	App.game.load.spritesheet("life_1", "Assets/life.png", 50, 50, 2);
	App.game.load.spritesheet("life_2", "Assets/life.png", 50, 50, 2);
	App.game.load.audio('Game_sound',["Assets/Drev_-_Engage.wav", "Assets/Drev_-_Engage.ogg"] );
	App.game.load.audio('Game_fire',["Assets/fire.wav", "Assets/fire.ogg"] );
	App.game.load.audio('Game_aimant',["Assets/aimmant.wav"] );
	App.game.load.audio('Game_shield',["Assets/shield.wav"] );
	App.game.load.audio('Game_fire-boss',["Assets/laser.wav"] );
	App.game.load.audio('Game_bomb',["Assets/bomb.wav"] );
	App.game.load.audio('Game_hit',["Assets/hit.wav"] );
	App.game.load.audio('Game_switch',["Assets/switch.wav"] );
},



Game.create = function() {

	App.game.physics.startSystem(Phaser.Physics.ARCADE);
	Game.bg = App.game.add.sprite(0, 0, "bg1");
	Game.bg = App.game.add.sprite(15000, 0, "bg2");
	App.game.sound.play('Game_sound',0.4,true);

	// définition du world
	Game.world  = App.game.world.setBounds(0, 0, Game.world_width, Game.world_height );
	

	// integration des hero
	Game.support_1 = App.game.add.sprite(0, Game.world_height-650, "support_1");
	Game.support_1.kill();
	Game.support_2 = App.game.add.sprite(0, Game.world_height-150, "support_2");
	Game.support_2.kill();
	Game.hero_1 = App.game.add.sprite(10, Game.world_height-650, "soldat_1");
	Game.hero_2 = App.game.add.sprite(10, Game.world_height-150, "soldat_2");

	// vies
	Game.life_create(Game.nb_life_1,Game.nb_life_2);

	//  animate spritesheet


	Game.support_1.animations.add("walk_right", [0,1,2,3,4,5,6,7], 18, false);
	Game.support_1.animations.add("walk_left", [  43, 42, 41, 40, 39, 38, 37, 36  ], 18, false);
	Game.support_1.animations.add("aimant_right", [  9, 10, 11, 12, 13, 14, ], 18, false);
	Game.support_1.animations.add("aimant_left", [  35, 34, 33, 32, 31, 30, ], 18, false);
	Game.support_1.animations.add("bomb_right", [  15,16,17,18,19,20,21], 15, false);
	Game.support_1.animations.add("bomb_left", [ 28,27,26,25,24,23,22 ], 18, false);

	
	Game.hero_1.animations.add("walk_right", [0,1,2,3,4,5,6,7], 18, false);
	Game.hero_1.animations.add("walk_left", [ 29, 28, 27, 26, 25, 24, 23, 22 ], 18, false);
	Game.hero_1.animations.add("fire_right", [8,9,10,11,12,13,14,],25, false);
	Game.hero_1.animations.add("fire_left", [21,20,19,18,17,16,15], 25, false);
	
	Game.hero_2.animations.add("walk_right", [0,1,2,3,4,5,6,7], 18, false);
	Game.hero_2.animations.add("walk_left", [ 29, 28, 27, 26, 25, 24, 23, 22 ], 18, false);
	Game.hero_2.animations.add("fire_right", [8,9,10,11,12,13,14,],25, false);
	Game.hero_2.animations.add("fire_left", [21,20,19,18,17,16,15], 25, false);

	Game.support_2.animations.add("walk_right", [0,1,2,3,4,5,6,7], 18, false);
	Game.support_2.animations.add("walk_left", [  43, 42, 41, 40, 39, 38, 37, 36  ], 18, false);
	Game.support_2.animations.add("aimant_right", [  9, 10, 11, 12, 13, 14, ], 18, false);
	Game.support_2.animations.add("aimant_left", [  35, 34, 33, 32, 31, 30, ], 18, false);
	Game.support_2.animations.add("shield_right", [  21,20,19,18,17,16,15], 15, false);
	Game.support_2.animations.add("shield_left", [ 28,27,26,25,24,23,22 ], 18, false);

	//integration de la passerelle
	Game.passerelle_create();


	// integration des obstacles aleatoire
	Game.obstacles_create(Game.nb_obstacle);
	Game.wall_create(Game.nb_wall);

	// integration des enemies
	Game.ennemi_create(Game.nb_ennemi);
	Game.boss_create(Game.nb_boss);
    	
// integration accessoire
	
	// integration des bullet
	Game.bullet_create();
	Game.bullet_ennemi_create();
	Game.bullet_boss_create();

    //integration des bombes
    Game.bomb_create();

	//pad
	
	App.game.input.gamepad.start();
	Game.pad1 = App.game.input.gamepad.pad1;
	Game.pad2 = App.game.input.gamepad.pad2;


	// creation de la camera
	
	Game.camera = App.game.camera;

	
	Game.anchor_camera(Game.hero_1);
	Game.anchor_camera(Game.hero_2);

 	
 	// Definition des corps physic
	App.game.physics.enable([Game.hero_1, Game.hero_2, Game.support_1,	Game.support_2 ], Phaser.Physics.arcade);
	
	Game.anchor_center(Game.hero_1);
	Game.hero_1.body.gravity.set(0, 2500);
	Game.hero_1.body.width = 10;
	Game.anchor_center(Game.support_1);
	Game.support_1.body.gravity.set(0, 2500);
	Game.support_1.body.width = 10;
	
	Game.anchor_center(Game.hero_2);
	Game.hero_2.body.gravity.set(0, 2500);
	Game.hero_2.body.width = 10;
	Game.anchor_center(Game.support_2);
	Game.support_2.body.gravity.set(0, 2500);
	Game.support_2.body.width = 10;
	//chrono
	Game.chrono();

}

//--------------------------------------------------------------update---------------------------------------------

Game.update = function(){
	if ( Game.support_mode_1 === true && Game.support_mode_2 === true && Game.support_1.body.x > Game.support_2.body.x ){
		Game.camera.follow(Game.support_1);
	}
	if ( Game.support_mode_1 === true &&  Game.support_mode_2 === true && Game.support_1.body.x < Game.support_2.body.x ){
		Game.camera.follow(Game.support_2);
	}
	if ( Game.attack_mode_1 === true && Game.attack_mode_2 === true && Game.hero_1.body.x > Game.hero_2.body.x ){
		Game.camera.follow(Game.hero_1);
	}
	if ( Game.attack_mode_1 === true &&  Game.attack_mode_2 === true && Game.hero_1.body.x < Game.hero_2.body.x ){
		Game.camera.follow(Game.hero_2);
	}
	if ( Game.support_mode_1 === true &&  Game.attack_mode_2 === true && Game.support_1.body.x > Game.hero_2.body.x ){
		Game.camera.follow(Game.support_1);
	}
	if ( Game.attack_mode_1 === true &&  Game.support_mode_2 === true && Game.hero_1.body.x > Game.support_2.body.x ){
		Game.camera.follow(Game.hero_1);
	}
	if ( Game.support_mode_2 === true &&  Game.attack_mode_1 === true && Game.support_2.body.x > Game.hero_1.body.x ){
		Game.camera.follow(Game.support_2);
	}
	if ( Game.attack_mode_2 === true &&  Game.support_mode_1 === true && Game.hero_2.body.x > Game.support_1.body.x ){
		Game.camera.follow(Game.hero_2);
	}



	//aniamtion
	Game.animate_sprite();
	
	//move
	Game.move();
	Game.stop_move();




	//jump
	Game.jump();
	Game.ready_to_jump_1_floor();
	Game.ready_to_jump_2_floor();

	// activation des modes
	Game.support();
	Game.atack();

	// mecanique de tir
	Game.bullet_reset();
	Game.bomb_reset();

	// Gestion des ennemis
    Game.fire_ennemi();
    Game.firing_boss(Game.nb_boss);

    // lose
    Game.lose_3();
    //win
    Game.win();
	
	// Gestion des collisions

	//hero + obstacle  + wall
	
	if ( Game.disable_colision === false){
		Game.collide(Game.hero_1, Game.obstacle_grp1);
		Game.collide(Game.hero_1, Game.obstacle_grp2);
		Game.collide(Game.hero_2, Game.obstacle_grp1);
		Game.collide(Game.hero_2, Game.obstacle_grp2);
		Game.collide(Game.hero_1, Game.wall_grp1);
		Game.collide(Game.hero_2, Game.wall_grp2);

		Game.collide(Game.support_1, Game.obstacle_grp1);
		Game.collide(Game.support_1, Game.obstacle_grp2);
		Game.collide(Game.support_2, Game.obstacle_grp1);
		Game.collide(Game.support_2, Game.obstacle_grp2);
		Game.collide(Game.support_1, Game.wall_grp1);
		Game.collide(Game.support_2, Game.wall_grp2);

		//bullet hero + ennemi
		Game.collide(Game.bomb, Game.passerelle_grp, Game.destroy_ground);
		Game.collide(Game.bullets_1, Game.ennemi_grp_1, Game.kill_ennemi);
		Game.collide(Game.bullets_1, Game.ennemi_grp_2, Game.kill_ennemi);
		Game.collide(Game.bullets_2, Game.ennemi_grp_2,Game.kill_ennemi);
		Game.collide(Game.bullets_2, Game.ennemi_grp_1,Game.kill_ennemi);

		//hero + ennemi
		Game.collide(Game.hero_1, Game.ennemi_grp_1);
		Game.collide(Game.hero_2, Game.ennemi_grp_2);
		Game.collide(Game.hero_1, Game.ennemi_grp_2);
		Game.collide(Game.hero_2, Game.ennemi_grp_1);
		Game.collide(Game.hero_1, Game.bullets_ennemi_1, Game.hit_hero_1);
		Game.collide(Game.hero_1, Game.bullets_ennemi_2, Game.hit_hero_1);
		Game.collide(Game.hero_2, Game.bullets_ennemi_2, Game.hit_hero_2);
		Game.collide(Game.hero_2, Game.bullets_ennemi_1, Game.hit_hero_2);

		Game.collide(Game.support_1, Game.ennemi_grp_1);
		Game.collide(Game.support_2, Game.ennemi_grp_2);
		Game.collide(Game.support_1, Game.ennemi_grp_2);
		Game.collide(Game.support_2, Game.ennemi_grp_1);
		Game.collide(Game.support_1, Game.bullets_ennemi_1, Game.hit_hero_1);
		Game.collide(Game.support_1, Game.bullets_ennemi_2, Game.hit_hero_1);
		Game.collide(Game.support_2, Game.bullets_ennemi_2, Game.hit_hero_2);
		Game.collide(Game.support_2, Game.bullets_ennemi_1, Game.hit_hero_2);

		//hero + bullet boss
		Game.collide(Game.hero_1, Game.bullets_boss, Game.lose_1);
		Game.collide(Game.hero_2, Game.bullets_boss_2, Game.lose_2);
		Game.collide(Game.hero_1, Game.bullets_boss_2, Game.lose_1);
		Game.collide(Game.hero_2, Game.bullets_boss, Game.lose_2);
		Game.collide(Game.support_1, Game.bullets_boss, Game.lose_1);
		Game.collide(Game.support_1, Game.bullets_boss_2, Game.lose_1);
		Game.collide(Game.support_2, Game.bullets_boss, Game.lose_2);
		Game.collide(Game.support_2, Game.bullets_boss_2, Game.lose_2);
	}
	//hero + passerelle
	Game.collide(Game.hero_1, Game.passerelle_grp, Game.ready_to_jump_1);
	Game.collide(Game.hero_2, Game.passerelle_grp, Game.ready_to_jump_2);

	Game.collide(Game.support_1, Game.passerelle_grp, Game.ready_to_jump_1);
	Game.collide(Game.support_2, Game.passerelle_grp, Game.ready_to_jump_2);
	//corps fixe	
	Game.hero_1.body.collideWorldBounds = true;
	Game.hero_2.body.collideWorldBounds = true;
	Game.support_1.body.collideWorldBounds = true;
	Game.support_2.body.collideWorldBounds = true;

}

//--------------------------------------------------------------fonction---------------------------------------------

//stockage des fonctions
Game.render = function(){
	if (Game.debug === true){
		App.game.debug.body(Game.hero_1);
		App.game.debug.body(Game.hero_2);
	}
}
Game.kill_ennemi = function(ennemi, bullet){
	bullet.kill();
	ennemi.kill();
}
// Création des entités
Game.life_create = function(nb1,nb2){
	Game.life_1 = App.game.add.group();
	Game.life_2 = App.game.add.group();

	Game.life_1.physicsBodyType = Phaser.Physics.ARCADE;
	Game.life_2.physicsBodyType = Phaser.Physics.ARCADE;
	Game.life_1.enableBody = true;
	Game.life_2.enableBody = true;

	var x_life_1=0;
	var x_life_2=0;
	for ( var i = 0; i<nb1; i++){	
		Game.life_pool[i] = Game.life_1.create(x_life_1*60, Game.world_height-1000, "life_1");
		x_life_1++;
	}
	for (var i = 0; i < nb2; i++) {
		Game.life_pool_2[i] = Game.life_2.create(x_life_2*60, Game.world_height-470, "life_2");
		x_life_2++;
	};
}
Game.ennemi_create = function(nb){
	Game.ennemi_grp_1 = this.add.group();
    Game.ennemi_grp_1.enableBody = true;
    Game.ennemi_grp_2 = this.add.group();
    Game.ennemi_grp_2.enableBody = true;

	for (var i = 0; i< nb; i++) {
    	var ennemi_space = Math.round(Math.random()*1000);
    	var x_alea1 = Math.round(Math.random()*ennemi_space*1000);
    	var x_alea2 = Math.round(Math.random()*ennemi_space*1000);
    	Game.ennemi_1 = Game.ennemi_grp_1.create( x_alea1+1000, Game.world_height-600, 'ennemi');
		Game.ennemi_1.anchor.setTo(0.5, 0.5);
		Game.ennemi_1.body.moves = false;
		Game.ennemi_2 = Game.ennemi_grp_2.create( x_alea2+1000, Game.world_height-100, 'ennemi');
		Game.ennemi_2.anchor.setTo(0.5, 0.5);
		Game.ennemi_2.body.moves = false;
		
    }
}
Game.boss_create = function(nb_boss){
    Game.ennemi_boss_grp = App.game.add.group();
    Game.ennemi_boss_grp.enableBody = true;
    Game.ennemi_boss_grp.physicsBodyType = Phaser.Physics.ARCADE;
    Game.ennemi_boss_grp_2 = App.game.add.group();
    Game.ennemi_boss_grp_2.enableBody = true;
    Game.ennemi_boss_grp_2.physicsBodyType = Phaser.Physics.ARCADE;

    for ( var i = 0; i< nb_boss; i++ ) {
    	var ennemi_space = Math.round(Math.random()*1000);
    	var x_alea1 = Math.round(Math.random()*ennemi_space*1000);
    	var x_alea2 = Math.round(Math.random()*ennemi_space*1000);
	
    	Game.boss_pool[i] = Game.ennemi_boss_grp.create( x_alea1+1000, Game.world_height-720, 'boss');	
    	Game.boss_pool_2[i] = Game.ennemi_boss_grp_2.create( x_alea2+1000, Game.world_height-210, 'boss');		
  	}
 
}
Game.obstacles_create = function(nb){
	Game.obstacle_grp1 					= this.add.group();
	Game.obstacle_grp1.enableBody 		= true ;
	Game.obstacle_grp2 					= this.add.group();
	Game.obstacle_grp2.enableBody 		= true ;
	for ( var i = 0; i<nb; i++){
		var space_obstacle = Math.round(Math.random()*10000)+10000;
		var x_alea1 = Math.round(Math.random()*space_obstacle);
		var x_alea2 = Math.round(Math.random()*space_obstacle);
		var obstacle_1 = Game.obstacle_grp1.create( x_alea1,Game.world_height-570,"obstacle_1" );
		var obstacle_2 = Game.obstacle_grp2.create( x_alea2,Game.world_height-50,"obstacle_1" );
		obstacle_1.body.immovable=true;
		obstacle_2.body.immovable=true;
	}
}
Game.wall_create = function(nb){
	
	Game.wall_grp1 						= this.add.group();
	Game.wall_grp1.enableBody 			= true ;
	Game.wall_grp2 						= this.add.group();
	Game.wall_grp2.enableBody 			= true ;
	for ( var i = 0; i<nb; i++){
		var ennemi_space = Math.round(Math.random()*100);
		var x_alea1 = Math.round(Math.random()*ennemi_space*1000);
		var x_alea2 = Math.round(Math.random()*ennemi_space*1000);
		var y_alea1 = Math.round(Math.random());
		var y_alea2 = Math.round(Math.random());

		if ( y_alea1 === 1 ) {
			var wall_1 = Game.wall_grp1.create( x_alea1+ 1000,-100,"wall_1" );
		}
		else{
			var wall_1 = Game.wall_grp1.create( x_alea1+ 1000,500,"wall_1" );
		}
		if ( y_alea2 === 1 ) {
			var wall_2 = Game.wall_grp2.create( x_alea2+ 1000,-100,"wall_2" );
		}
		else {
			var wall_2 = Game.wall_grp2.create( x_alea2+ 1000,500,"wall_2" );
		}
			
		wall_1.body.immovable = true;
		wall_2.body.immovable = true;
	}
}
Game.passerelle_create = function(){
	Game.passerelle_grp = this.add.group();
	Game.passerelle_grp.enableBody 		= true ;

	for ( var i = 0; i < Game.world_width; i+=50){
		var passerelle_group = Game.passerelle_grp.create( i,Game.world_height/2-25,"passerelle" );
		passerelle_group.body.immovable=true;
	}
}
Game.bullet_create = function(){
	Game.bullets_1 = App.game.add.group();
    Game.bullets_1.enableBody = true;
    Game.bullets_1.physicsBodyType = Phaser.Physics.ARCADE;
    Game.bullets_1.createMultiple(1000, 'fire-1');
    Game.bullets_1.setAll('checkWorldBounds', true);
    Game.bullets_1.setAll('outOfBoundsKill', true);
    Game.sprite_bullet_1 = App.game.add.sprite(Game.hero_1.x, Game.hero_1.y, 'fire-1');
    Game.sprite_bullet_1.kill();

    Game.bullets_2 = App.game.add.group();
    Game.bullets_2.enableBody = true;
    Game.bullets_2.physicsBodyType = Phaser.Physics.ARCADE;
    Game.bullets_2.createMultiple(1000, 'fire-1');
    Game.bullets_2.setAll('checkWorldBounds', true);
    Game.bullets_2.setAll('outOfBoundsKill', true);
    Game.sprite_bullet_2 = App.game.add.sprite(Game.hero_2.x, Game.hero_2.y, 'fire-1');
    Game.sprite_bullet_2.kill();
}
Game.bullet_ennemi_create = function(){
    Game.bullets_ennemi_1 = App.game.add.group();
    Game.bullets_ennemi_1.enableBody = true;
    Game.bullets_ennemi_1.physicsBodyType = Phaser.Physics.ARCADE;
    Game.bullets_ennemi_1.createMultiple(50, 'plot');
    Game.bullets_ennemi_1.setAll('checkWorldBounds', true);
    Game.bullets_ennemi_1.setAll('outOfBoundsKill', true);

    Game.bullets_ennemi_2 = App.game.add.group();
    Game.bullets_ennemi_2.enableBody = true;
    Game.bullets_ennemi_2.physicsBodyType = Phaser.Physics.ARCADE;
    Game.bullets_ennemi_2.createMultiple(50, 'plot');
    Game.bullets_ennemi_2.setAll('checkWorldBounds', true);
    Game.bullets_ennemi_2.setAll('outOfBoundsKill', true);
}
Game.bullet_boss_create = function(){
	
	Game.bullets_boss = App.game.add.group();
    Game.bullets_boss.enableBody = true;
    Game.bullets_boss.physicsBodyType = Phaser.Physics.ARCADE;
    Game.bullets_boss.createMultiple(50, 'fire');
    Game.bullets_boss.setAll('checkWorldBounds', true);
   	Game.bullets_boss.setAll('outOfBoundsKill', true);



    Game.bullets_boss_2 = App.game.add.group();
    Game.bullets_boss_2.enableBody = true;
    Game.bullets_boss_2.physicsBodyType = Phaser.Physics.ARCADE;
    Game.bullets_boss_2.createMultiple(50, 'fire');
    Game.bullets_boss_2.setAll('checkWorldBounds', true);
   	Game.bullets_boss_2.setAll('outOfBoundsKill', true);

}
Game.bomb_create = function(){
	Game.bomb = App.game.add.group();
    Game.bomb.enableBody = true;
    Game.bomb.physicsBodyType = Phaser.Physics.ARCADE;
    Game.bomb.createMultiple(1, 'bomb');
    Game.bomb.setAll('checkWorldBounds', true);
    Game.bomb.setAll('outOfBoundsKill', true);
    Game.sprite_bomb = App.game.add.sprite(Game.support_1.x, Game.support_1.y, 'bomb');
    Game.sprite_bomb.kill();
}

// deplacement
Game.move = function(){
	if ( Game.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1 ){
		if ( Game.camera.x >  0.1 ){
			Game.life_1.x = Game.camera.x;
			Game.life_2.x = Game.camera.x;
		}
		Game.sprite_anim_hero1_right = true;

		Game.move_1 = true;
		Game.move_1_left = false
		Game.support_1.body.x += Game.speed_hero_1;
		Game.hero_1.body.x += Game.speed_hero_1;


	}
	else{
		Game.sprite_anim_hero1_right = false;
	}

	if ( Game.pad2.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){
		if ( Game.camera.x >  0.1 ){
			Game.life_1.x = Game.camera.x;
			Game.life_2.x = Game.camera.x;
		}
		Game.move_2 = true;
		Game.move_2_left = false;

		Game.sprite_anim_hero2_right = true;
		Game.support_2.body.x += Game.speed_hero_2;
		Game.hero_2.body.x += Game.speed_hero_2;


	}
	else{
		Game.sprite_anim_hero2_right = false;
	}

}
Game.stop_move = function(){
	if ( Game.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1 ){
		if ( Game.camera.x >  0.1 ){
			Game.life_1.x = Game.camera.x;
			Game.life_2.x = Game.camera.x;
		}
		Game.sprite_anim_hero1_left = true;
		Game.move_1 = false
		Game.move_1_left = true;
		Game.hero_1.body.x -= Game.stop_hero_1;
		Game.support_1.body.x -= Game.stop_hero_1;
	}
	else{
		Game.sprite_anim_hero1_left = false;
	}
	if ( Game.pad2.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
		if ( Game.camera.x >  0.1 ){
			Game.life_1.x = Game.camera.x;
			Game.life_2.x = Game.camera.x;
		}
		Game.hero_2.body.x -= Game.stop_hero_2;
		Game.support_2.body.x -= Game.speed_hero_2;
		Game.move_2 = false;
		Game.move_2_left = true;
		Game.sprite_anim_hero2_left = true;
	}
	else{
		Game.sprite_anim_hero2_left = false;
	}

}
//animation
Game.animate_sprite = function(){
	if( Game.sprite_anim_hero1_right === true && Game.attack_mode_1 === true){
		Game.hero_1.animations.play('walk_right');
	}
	if( Game.sprite_anim_hero1_left === true && Game.attack_mode_1 === true){
		Game.hero_1.animations.play('walk_left');
	}
	if (Game.sprite_anim_hero1_fire_right === true &&  Game.attack_mode_1 === true){
		Game.hero_1.animations.play('fire_right');
	}
	if (Game.sprite_anim_hero1_fire_left === true && Game.attack_mode_1 === true){
		Game.hero_1.animations.play('fire_left');
	}
	if (Game.sprite_anim_hero1_right === true && Game.support_mode_1 === true){
		Game.support_1.animations.play('walk_right');
	}
	if (Game.sprite_anim_hero1_left === true && Game.support_mode_1 === true){
		Game.support_1.animations.play('walk_left');
	}
	if (Game.sprite_anim_support1_aimant_right === true ){
		Game.support_1.animations.play('aimant_right');
	}
	if (Game.sprite_anim_support1_aimant_left === true ){
		Game.support_1.animations.play('aimant_left');
	}
	if (Game.sprite_anim_support1_bomb_right === true ){
		Game.support_1.animations.play('bomb_right');
	}
	if (Game.sprite_anim_support1_bomb_left === true ){
		Game.support_1.animations.play('bomb_left');
	}

	if( Game.sprite_anim_hero2_right === true && Game.attack_mode_2 === true){
		Game.hero_2.animations.play('walk_right');
	}
	if( Game.sprite_anim_hero2_left === true && Game.attack_mode_2 === true){
		Game.hero_2.animations.play('walk_left');
	}
	if (Game.sprite_anim_hero2_right === true && Game.support_mode_2 === true){
		Game.support_2.animations.play('walk_right');
	}
	if (Game.sprite_anim_hero2_left === true && Game.support_mode_2 === true){
		Game.support_2.animations.play('walk_left');
	}
	if (Game.sprite_anim_hero2_fire_right === true &&  Game.attack_mode_2 === true){
		Game.hero_2.animations.play('fire_right');
	}
	if (Game.sprite_anim_hero2_fire_left === true && Game.attack_mode_2 === true){
		Game.hero_2.animations.play('fire_left');
	}
	if (Game.sprite_anim_support2_aimant_right === true ){
		Game.support_2.animations.play('aimant_right');
	}
	if (Game.sprite_anim_support2_aimant_left === true ){
		Game.support_2.animations.play('aimant_left');
	}
	if (Game.sprite_anim_support2_shield_right === true ){
		Game.support_2.animations.play('shield_right');
	}
	if (Game.sprite_anim_support2_shield_left === true ){
		Game.support_2.animations.play('shield_left');
	}

}

// sauts
Game.jump = function(){
	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_A) && Game.jump_ready_1 === true && Game.attack_mode_1 === true ){
		Game.hero_1.body.gravity.set(0,2000);
		Game.hero_1.body.y -= 1;
		Game.hero_1.body.velocity.y -= Game.jump_hero_1_height;
		Game.jump_ready_1_floor = false;
		Game.jump_ready_1 = false;
	}
	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_A) && Game.jump_ready_1 === true && Game.support_mode_1 === true ){
		Game.support_1.body.gravity.set(0,2000);
		Game.support_1.body.y -= 1;
		Game.support_1.body.velocity.y -= Game.jump_hero_1_height;
		Game.jump_ready_1_floor = false;
		Game.jump_ready_1 = false;

	}
	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_A) && Game.jump_ready_1_floor === true && Game.jump_ready_1 === false &&  Game.attack_mode_1 === true ){
		Game.hero_1.body.gravity.set(0,2500);
		Game.hero_1.body.y -= 1;
		Game.hero_1.body.velocity.y -= Game.jump_hero_1_height_on_floor;
		Game.jump_ready_1_floor = false;
	}
	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_A) && Game.jump_ready_1_floor === true && Game.jump_ready_1 === false &&  Game.support_mode_1 === true ){
		Game.support_1.body.gravity.set(0,2500);
		Game.support_1.body.y -= 1;
		Game.support_1.body.velocity.y -= Game.jump_hero_1_height_on_floor;
		Game.jump_ready_1_floor = false;

	}
	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_A) && Game.jump_ready_2 === true && Game.attack_mode_2 === true ){
		Game.hero_2.body.gravity.set(0,2000);
		Game.hero_2.body.y -= 1;
		Game.hero_2.body.velocity.y -= Game.jump_hero_2_height;
		Game.jump_ready_2_floor = false;
		Game.jump_ready_2 = false;
	}
	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_A) && Game.jump_ready_2 === true && Game.support_mode_2 === true ){
		Game.support_2.body.gravity.set(0,2000);
		Game.support_2.body.y -= 1;
		Game.support_2.body.velocity.y -= Game.jump_hero_2_height;
		Game.jump_ready_2_floor = false;
		Game.jump_ready_2 = false;
	}
	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_A) && Game.jump_ready_2_floor === true && Game.jump_ready_2 === false &&  Game.attack_mode_2 === true ){
		Game.hero_2.body.gravity.set(0,2500);
		Game.hero_2.body.y -= 1;
		Game.hero_2.body.velocity.y -= Game.jump_hero_2_height_on_floor;
		Game.jump_ready_2_floor = false;
	}
	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_A) && Game.jump_ready_2_floor === true && Game.jump_ready_2 === false &&  Game.support_mode_2 === true ){
		Game.support_2.body.gravity.set(0,2500);
		Game.support_2.body.y -= 1;
		Game.support_2.body.velocity.y -= Game.jump_hero_2_height_on_floor;
		Game.jump_ready_2_floor = false;

	}
}
Game.ready_to_jump_1 = function() {
	Game.jump_ready_1 = true;	
}
Game.ready_to_jump_2 = function() {
	Game.jump_ready_2 = true;
}
Game.ready_to_jump_1_floor = function(){
	if ( Game.hero_1.body.onFloor() && Game.attack_mode_1 === true){
		Game.jump_ready_1_floor = true;
		Game.jump_ready_1 = false;
	}
	if ( Game.support_1.body.onFloor() && Game.support_mode_1 === true){
		Game.jump_ready_1_floor = true;
		Game.jump_ready_1 = false;
	}
}
Game.ready_to_jump_2_floor = function(){
	if ( Game.hero_2.body.onFloor() && Game.attack_mode_2 === true){
		Game.jump_ready_2_floor = true;
		Game.jump_ready_2 = false;
	}
	if ( Game.support_2.body.onFloor() && Game.support_mode_2 === true){
		Game.jump_ready_2_floor = true;
		Game.jump_ready_2 = false;
	}

}
// tirs
Game.fire_1 = function(){

	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_B) && Game.sprite_anim_hero1_right === false ){
		Game.is_fire_1 = true;

		if (App.game.time.now > Game.nextFire && Game.bullets_1.countDead() > 0 && Game.move_1 === true && Game.is_fire_1 === true){
	    	Game.nextFire = App.game.time.now + Game.fireRate;
	    	var bullet = Game.bullets_1.getFirstDead();
	    	bullet.reset(Game.sprite_bullet_1.x+30 , Game.sprite_bullet_1.y+30 );
	    	App.game.sound.play('Game_fire',0.4);
	    	App.game.physics.arcade.moveToXY(bullet, bullet.x+600, Game.hero_1.y, 1500);
	    }
	}
	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_B) && Game.sprite_anim_hero1_left === false ){
		Game.is_fire_1 = true;
		if (App.game.time.now > Game.nextFire && Game.bullets_1.countDead() > 0 && Game.move_1_left === true && Game.is_fire_1 === true){
	    	Game.nextFire = App.game.time.now + Game.fireRate;
	    	var bullet = Game.bullets_1.getFirstDead();
	    	bullet.reset(Game.sprite_bullet_1.x-100 , Game.sprite_bullet_1.y+30 );
	    	App.game.sound.play('Game_fire',0.4);
	    	App.game.physics.arcade.moveToXY(bullet, bullet.x-600, Game.hero_1.y, 1500);
	    }
	}

	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_B) && Game.sprite_anim_hero1_right === true) {
		Game.is_fire_1 = true;
		Game.sprite_anim_hero1_right = false;
		Game.sprite_anim_hero1_fire_right = true;
		Game.sprite_anim_hero1_left = false;

		if (App.game.time.now > Game.nextFire && Game.bullets_1.countDead() > 0 && Game.move_1 === true && Game.is_fire_1 === true){
	    	Game.nextFire = App.game.time.now + Game.fireRate;
	    	var bullet = Game.bullets_1.getFirstDead();
	    	bullet.reset(Game.sprite_bullet_1.x+30 , Game.sprite_bullet_1.y+30 );
	    	App.game.sound.play('Game_fire',0.2);
	    	App.game.physics.arcade.moveToXY(bullet, bullet.x+600, Game.hero_1.y, 1500);
	    }
	}
	else{
		Game.is_fire_1 = false;
		Game.sprite_anim_hero1_fire_right = false;
	}

	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_B) && Game.sprite_anim_hero1_left === true ) {
		Game.is_fire_1 = true;
		Game.sprite_anim_hero1_left = false;
		Game.sprite_anim_hero1_fire_left = true;
		Game.sprite_anim_hero1_right = false;
    	
    	if (App.game.time.now > Game.nextFire && Game.bullets_1.countDead() > 0 && Game.move_1_left === true && Game.is_fire_1 === true){
	    	Game.nextFire = App.game.time.now + Game.fireRate;
	    	var bullet = Game.bullets_1.getFirstDead();
	    	bullet.reset(Game.sprite_bullet_1.x-100, Game.sprite_bullet_1.y+30 );
	    	App.game.sound.play('Game_fire',0.2);
	    	App.game.physics.arcade.moveToXY(bullet, bullet.x-600, Game.hero_1.y, 1500);
    	}
	}
	else{
		
		Game.is_fire_1 = false;
		Game.sprite_anim_hero1_fire_left = false;
	}
}
Game.fire_2 = function(){
	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_B) && Game.sprite_anim_hero2_right === false ){
		Game.is_fire_2 = true;
		if (App.game.time.now > Game.nextFire_2 && Game.bullets_2.countDead() > 0 && Game.move_2 === true && Game.is_fire_2 === true){
	    	Game.nextFire_2 = App.game.time.now + Game.fireRate;
	    	var bullet = Game.bullets_2.getFirstDead();
	    	bullet.reset(Game.sprite_bullet_2.x+30 , Game.sprite_bullet_2.y+30 );
	    	App.game.physics.arcade.moveToXY(bullet, bullet.x+600, Game.hero_2.y, 1500);
	    	App.game.sound.play('Game_fire',0.2);
	    }
	}
	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_B) && Game.sprite_anim_hero2_left === false ){
		Game.is_fire_2 = true;
		if (App.game.time.now > Game.nextFire_2 && Game.bullets_2.countDead() > 0 && Game.move_2_left === true && Game.is_fire_2 === true){
	    	Game.nextFire_2 = App.game.time.now + Game.fireRate;
	    	var bullet = Game.bullets_2.getFirstDead();
	    	bullet.reset(Game.sprite_bullet_2.x-100 , Game.sprite_bullet_2.y+30 );
	    	App.game.physics.arcade.moveToXY(bullet, bullet.x-600, Game.hero_2.y, 1500);
	    	App.game.sound.play('Game_fire',0.2);
	    }
	}

	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_B) && Game.sprite_anim_hero2_right === true) {
		Game.is_fire_2 = true;
		Game.sprite_anim_hero2_right = false;
		Game.sprite_anim_hero2_fire_right = true;
		Game.sprite_anim_hero2_left = false;

		if (App.game.time.now > Game.nextFire_2 && Game.bullets_2.countDead() > 0 && Game.move_2 === true && Game.is_fire_2 === true){
	    	Game.nextFire_2 = App.game.time.now + Game.fireRate;
	    	var bullet = Game.bullets_2.getFirstDead();
	    	bullet.reset(Game.sprite_bullet_2.x+30 , Game.sprite_bullet_2.y+30 );
	    	App.game.physics.arcade.moveToXY(bullet, bullet.x+600, Game.hero_2.y, 1500);
	    	App.game.sound.play('Game_fire',0.2);
	    }
	}
	else{
		Game.is_fire_2 = false;
		Game.sprite_anim_hero2_fire_right = false;
	}

	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_B) && Game.sprite_anim_hero2_left === true ) {
		Game.is_fire_2 = true;
		Game.sprite_anim_hero2_left = false;
		Game.sprite_anim_hero2_fire_left = true;
		Game.sprite_anim_hero2_right = false;
    	
    	if (App.game.time.now > Game.nextFire_2 && Game.bullets_2.countDead() > 0 && Game.move_2_left === true && Game.is_fire_2 === true){
	    	Game.nextFire_2 = App.game.time.now + Game.fireRate;
	    	var bullet = Game.bullets_2.getFirstDead();
	    	bullet.reset(Game.sprite_bullet_2.x-100, Game.sprite_bullet_2.y+30 );
	    	App.game.physics.arcade.moveToXY(bullet, bullet.x-600, Game.hero_2.y, 1500);
	    	App.game.sound.play('Game_fire',0.2);
    	}
	}
	else{
		
		Game.is_fire_2 = false;
		Game.sprite_anim_hero2_fire_left = false;
	}	
}
Game.auto_fire_1 = function(){

    Game.bullet_ennemi_1 = Game.bullets_ennemi_1.getFirstExists(false);
    Game.living_ennemi_1.length=0;

    Game.ennemi_grp_1.forEachAlive(function(ennemi_1){
        Game.living_ennemi_1.push(ennemi_1);
    });


    if (Game.bullet_ennemi_1 && Game.living_ennemi_1.length > 0) {
        
        var random = App.game.rnd.integerInRange(0, Game.living_ennemi_1.length-1);

        // randomly select one of them
        var shooter = Game.living_ennemi_1[random];
        // And fire the bullet from this enemy
        Game.bullet_ennemi_1.reset(shooter.body.x, shooter.body.y);
        
        App.game.physics.arcade.moveToObject(Game.bullet_ennemi_1,Game.hero_1,1000);
        Game.firing_timer = App.game.time.now + 1000;
    }	  
}

Game.auto_fire_2 = function(){

    Game.bullet_ennemi_2 = Game.bullets_ennemi_2.getFirstExists(false);
    Game.living_ennemi_2.length=0;

    Game.ennemi_grp_2.forEachAlive(function(ennemi_2){
        Game.living_ennemi_2.push(ennemi_2);
    });

    if (Game.bullet_ennemi_2 && Game.living_ennemi_2.length > 0) {
        
        var random_2 = App.game.rnd.integerInRange(0, Game.living_ennemi_2.length-1);

        // randomly select one of them
        var shooter_2  = Game.living_ennemi_2[random_2];
        // And fire the bullet from this enemy
        Game.bullet_ennemi_2.reset(shooter_2.body.x, shooter_2.body.y);

        App.game.physics.arcade.moveToObject(Game.bullet_ennemi_2,Game.hero_2,1000);
        Game.firing_timer_2 = App.game.time.now + 1000;
    }	  
}

Game.auto_fire_boss = function( child, axe, reset){

    Game.bullet_boss = Game.bullets_boss.getFirstExists(false);
    Game.living_ennemi_boss.length=0;
   


	
	for (var i = 0; i< Game.boss_pool.length; i++){
		Game.living_ennemi_boss[i] = Game.boss_pool[i];
	}


    if ( Game.bullet_boss && Game.living_ennemi_boss.length > 0 ) {
        Game.bullet_boss.reset(Game.living_ennemi_boss[child].body.x-150, Game.living_ennemi_boss[child].body.y-reset);
        App.game.physics.arcade.moveToXY(Game.bullet_boss,-600, Game.world_height-axe,2200);
        Game.firing_timer_boss = App.game.time.now + 1000;
  
    }
}
Game.auto_fire_boss_2 = function(child, axe, reset){

	Game.bullet_boss_2 = Game.bullets_boss_2.getFirstExists(false);

	Game.living_ennemi_boss_2.length=0;
	for (var i = 0; i< Game.boss_pool_2.length; i++){
		Game.living_ennemi_boss_2[i] = Game.boss_pool_2[i];
	}
    if ( Game.bullet_boss_2 && Game.living_ennemi_boss_2.length > 0 ) {
        Game.bullet_boss_2.reset(Game.living_ennemi_boss_2[child].body.x-150, Game.living_ennemi_boss_2[child].body.y-reset);
        App.game.physics.arcade.moveToXY(Game.bullet_boss_2,-600, Game.world_height-axe,2200);
        Game.firing_timer_boss = App.game.time.now + 1000;
  
    }	
}

Game.fire_ennemi = function(){
	if ( App.game.time.now > Game.firing_timer && Game.hero_1.body.y < 600  ){
    	Game.auto_fire_1();
    }
    if ( App.game.time.now > Game.firing_timer_2 && Game.hero_2.body.y > 600 ){
    	Game.auto_fire_2();
    }
}

Game.fire_boss = function(child){
	if ( Game.hero_1.body.x > Game.boss_pool[child].body.x -400 && Game.hero_1.body.x < Game.boss_pool[child].body.x || Game.hero_2.body.x > Game.boss_pool[child].body.x -400 && Game.hero_2.body.x < Game.boss_pool[child].body.x ) {
		App.game.sound.play('Game_fire-boss',0.2);
		Game.auto_fire_boss(child, 800, 100);

	}
	if ( Game.hero_1.body.x > Game.boss_pool_2[child].body.x -400 && Game.hero_1.body.x < Game.boss_pool_2[child].body.x || Game.hero_2.body.x > Game.boss_pool_2[child].body.x -400 && Game.hero_2.body.x < Game.boss_pool_2[child].body.x ) {
		App.game.sound.play('Game_fire-boss',0.2);
		Game.auto_fire_boss_2(child,300, 100);

	}

}
Game.firing_boss = function(nb_boss){
	for (var i = 0; i < nb_boss; i++) {
		Game.fire_boss(i);
	};

}

Game.bullet_reset = function() {
	Game.sprite_bullet_1.x = Game.hero_1.x + 10;
	Game.sprite_bullet_1.y = Game.hero_1.y-35;
	Game.is_fire_1 = false;

	Game.sprite_bullet_2.x = Game.hero_2.x + 10;
	Game.sprite_bullet_2.y = Game.hero_2.y-35;
	Game.is_fire_2 = false;
}

Game.bomb_reset = function(){
	Game.sprite_bomb.x = Game.support_1.x + 10;
	Game.sprite_bomb.y = Game.support_1.y-35;
}

// accessoir support
Game.switch_mode = function(){
	if ( event.which === 67 && Game.support_mode_1 === true && Game.attack_mode_1 === false){
		App.game.sound.play('Game_switch',0.4);
		Game.attack_mode_1 = true;
		Game.support_mode_1 = false;
		Game.support_1.kill();
		Game.hero_1.revive();
		Game.hero_1.x = Game.support_1.x;
		Game.hero_1.body.x = Game.support_1.body.x;
		Game.hero_1.y = Game.support_1.y;
		Game.hero_1.body.y = Game.support_1.body.y;
		Game.hero_1.body.velocity.y = Game.support_1.body.velocity.y;
	}
	else if ( event.which === 67 && Game.attack_mode_1 === true && Game.support_mode_1 === false ){
		App.game.sound.play('Game_switch',0.4);
		Game.support_mode_1 = true;
		Game.attack_mode_1 = false;
		Game.support_1.revive();
		Game.hero_1.kill();
		Game.support_1.x = Game.hero_1.x;
		Game.support_1.body.x = Game.hero_1.body.x;
		Game.support_1.y = Game.hero_1.y;
		Game.support_1.body.y = Game.hero_1.body.y;
		Game.support_1.body.velocity.y = Game.hero_1.body.velocity.y;
	}
	if ( event.which === 17 && Game.support_mode_2 === true && Game.attack_mode_2 === false){
		App.game.sound.play('Game_switch',0.4);
		Game.attack_mode_2 = true;
		Game.support_mode_2 = false;
		Game.support_2.kill();
		Game.hero_2.revive();
		Game.hero_2.x = Game.support_2.x;
		Game.hero_2.body.x = Game.support_2.body.x;
		Game.hero_2.y = Game.support_2.y;
		Game.hero_2.body.y = Game.support_2.body.y;
		Game.hero_2.body.velocity.y = Game.support_2.body.velocity.y;
	}
	else if ( event.which === 17 && Game.attack_mode_2 === true && Game.support_mode_2 === false ){
		App.game.sound.play('Game_switch',0.4);
		Game.support_mode_2 = true;
		Game.attack_mode_2 = false;
		Game.support_2.revive();
		Game.hero_2.kill();
		Game.support_2.x = Game.hero_2.x;
		Game.support_2.body.x = Game.hero_2.body.x;
		Game.support_2.y = Game.hero_2.y;
		Game.support_2.body.y = Game.hero_2.body.y;
		Game.support_2.body.velocity.y = Game.hero_2.body.velocity.y;
	}
}
Game.bomber = function(gravity){
	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_B) && Game.support_mode_1 === true &&  Game.move_1 === true ){
		Game.sprite_anim_support1_bomb_left = false;
		Game.sprite_anim_support1_bomb_right = true;
		Game.sprite_anim_hero1_right = false;
		if (App.game.time.now > Game.nextFire_bomb && Game.bomb.countDead() > 0){
	    	Game.nextFire_bomb = App.game.time.now + Game.fireRate_bomb;
	    	var bomb = Game.bomb.getFirstDead();
	    	bomb.body.gravity.set(0,gravity);
	    	bomb.reset(Game.sprite_bomb.x , Game.sprite_bomb.y );
	    	App.game.physics.arcade.moveToXY(bomb,bomb.x+600,Game.support_1.y,1000);
	    	App.game.sound.play('Game_bomb',0.4);
    	}
	}
	else{
		Game.sprite_anim_support1_bomb_right = false;

	}
	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_B) && Game.support_mode_1 === true && Game.move_1_left === true ){
		Game.sprite_anim_support1_bomb_left = true;
		Game.sprite_anim_hero1_right = false;
		if (App.game.time.now > Game.nextFire_bomb && Game.bomb.countDead() > 0){
	    	Game.nextFire_bomb = App.game.time.now + Game.fireRate_bomb;
	    	var bomb = Game.bomb.getFirstDead();
	    	bomb.body.gravity.set(0,gravity);
	    	bomb.reset(Game.sprite_bomb.x-100 , Game.sprite_bomb.y );
	    	App.game.physics.arcade.moveToXY(bomb,bomb.x-600,Game.support_1.y,1000);
	    	App.game.sound.play('Game_bomb',0.4);
    	}
	}
	else{
		Game.sprite_anim_support1_bomb_left = false;
	}
}
Game.magnet = function(){	
	
	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_Y) && Game.support_1.body.y < Game.hero_2.body.y && Game.hero_2.alive &&Game.support_mode_1 === true  && Game.move_1 === true  ){
		Game.sprite_anim_support1_aimant_left = false;		
		Game.sprite_anim_hero1_right = false;
		Game.sprite_anim_hero1_left = false;
		Game.sprite_anim_support1_aimant_right = true;

		Game.hero_2.body.y -=50;
		App.game.sound.play('Game_aimant',0.2);


	}
	else if(Game.pad1.isUp(Phaser.Gamepad.XBOX360_Y)){


		Game.sprite_anim_support1_aimant_right = false;
	}
	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_Y) && Game.support_1.body.y < Game.hero_2.body.y && Game.hero_2.alive &&Game.support_mode_1 === true  && Game.move_1_left === true  ){
		Game.sprite_anim_support1_aimant_right = false;		
		Game.sprite_anim_hero1_right = false;
		Game.sprite_anim_hero1_left = false;
		Game.sprite_anim_support1_aimant_left = true;
		Game.hero_2.body.y -=50;
		App.game.sound.play('Game_aimant',0.2);

	}
	else if(Game.pad1.isUp(Phaser.Gamepad.XBOX360_Y)){


		Game.sprite_anim_support1_aimant_left = false;
	}

	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_Y) && Game.support_1.body.y < Game.support_2.body.y && Game.support_2.alive && Game.support_mode_1 === true && Game.move_1 === true  ){

		Game.sprite_anim_hero1_right = false;
		Game.sprite_anim_hero1_left = false;
		Game.sprite_anim_support1_aimant_left = false;	
		Game.sprite_anim_support1_aimant_right = true;	
		Game.support_2.body.y -= 50;
		App.game.sound.play('Game_aimant',0.2);
		Game.bomber_reverse = true;
		

	}
	else if(Game.pad1.isUp(Phaser.Gamepad.XBOX360_Y)){

		Game.bomber_reverse = false;
		Game.sprite_anim_support1_aimant_right = false;
	}


	if ( Game.pad1.isDown(Phaser.Gamepad.XBOX360_Y) && Game.support_1.body.y < Game.support_2.body.y && Game.support_2.alive && Game.support_mode_1 === true && Game.move_1_left === true  ){
		Game.sprite_anim_support1_aimant_right = false;
		Game.sprite_anim_support1_aimant_left = true;
		Game.support_2.body.y -= 50;
		Game.sprite_anim_hero1_right = false;
		Game.sprite_anim_hero1_left = false;
		App.game.sound.play('Game_aimant',0.2);
		
	}
	else if(Game.pad1.isUp(Phaser.Gamepad.XBOX360_Y)){


		Game.sprite_anim_support1_aimant_left = false;
	}


	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_Y) && Game.support_2.body.y < Game.hero_1.body.y && Game.hero_1.alive &&Game.support_mode_2 === true  && Game.move_2 === true  ){
		Game.sprite_anim_support2_aimant_right = true;
		Game.sprite_anim_support2_aimant_left = false;
		Game.hero_1.body.y -=50;
		Game.sprite_anim_hero2_right = false;
		Game.sprite_anim_hero2_left = false;
		App.game.sound.play('Game_aimant',0.2);

	}
	else if(Game.pad2.isUp(Phaser.Gamepad.XBOX360_Y)){


		Game.sprite_anim_support2_aimant_right = false;
	}

	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_Y) && Game.support_2.body.y < Game.hero_1.body.y && Game.hero_1.alive &&Game.support_mode_2 === true  && Game.move_2_left === true  ){
		Game.sprite_anim_support2_aimant_right = false;
		Game.sprite_anim_support2_aimant_left = true;
		Game.hero_1.body.y -=50;
		Game.sprite_anim_hero2_right = false;
		Game.sprite_anim_hero2_left = false;
		App.game.sound.play('Game_aimant',0.2);
		Game.bomber_reverse = true;
	}
	else if(Game.pad2.isUp(Phaser.Gamepad.XBOX360_Y)){
		Game.bomber_reverse = false;

		Game.sprite_anim_support2_aimant_left = false;
	}


	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_Y) && Game.support_2.body.y < Game.support_1.body.y && Game.support_1.alive && Game.support_mode_2 === true && Game.move_2 === true  ){
		Game.sprite_anim_support2_aimant_right = true;
		Game.sprite_anim_support2_aimant_left = false;
		Game.support_1.body.y -= 50;
		Game.sprite_anim_hero2_right = false;
		Game.sprite_anim_hero2_left = false;
		App.game.sound.play('Game_aimant',0.2);
		Game.bomber_reverse = true;
	}
	else if(Game.pad2.isUp(Phaser.Gamepad.XBOX360_Y)){
		Game.bomber_reverse = false;
		Game.sprite_anim_support2_aimant_right = false;
	}


	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_Y) && Game.support_2.body.y < Game.support_1.body.y && Game.support_1.alive && Game.support_mode_2 === true && Game.move_2_left === true  ){
		Game.sprite_anim_support2_aimant_right = false;
		Game.sprite_anim_support2_aimant_left = true;
		Game.sprite_anim_support2_aimant_left = true;
		Game.support_1.body.y -= 50;
		Game.sprite_anim_hero2_right = false;
		Game.sprite_anim_hero2_left = false;
		App.game.sound.play('Game_aimant',0.2);
	}
	else if(Game.pad2.isUp(Phaser.Gamepad.XBOX360_Y)){


		Game.sprite_anim_support2_aimant_left = false;
	}

}
Game.shield = function(){


	if ( Game.pad2.isDown(Phaser.Gamepad.XBOX360_B) &&	Game.support_mode_2 === true && Game.move_2 === true ){
		Game.sprite_anim_hero2_right = false;

		Game.sprite_anim_support2_shield_right = true;
		Game.collide(Game.support_2, Game.bullets_boss, Game.destroy_bullet_boss);
		Game.collide(Game.support_2, Game.bullets_boss_2, Game.destroy_bullet_boss_2);
		App.game.sound.play('Game_shield',0.1);

	}

		
		else{
		song_shield = false;
		Game.sprite_anim_support2_shield_right = false;
	}
}
Game.destroy_bullet_boss = function(){
	for( var i = 0; i < 50 ; i++){
		Game.bullets_boss.getChildAt(i).kill();
	}
	Game.support_2.body.velocity.x = 0
}
Game.destroy_bullet_boss_2 = function(){
	for( var i = 0; i < 50 ; i++){
		Game.bullets_boss_2.getChildAt(i).kill();
	}
	
	Game.support_2.body.velocity.x = 0
}
//modes
Game.support = function(){
	if ( Game.support_mode_1 === true && Game.attack_mode_1 === false || Game.support_mode_2 === true && Game.attack_mode_2 === false  ) {
		if ( Game.bomber_reverse === true){
			Game.bomber(-800);
		}

	}	
	Game.bomber(800);
	Game.magnet();
	Game.shield();
}
Game.atack = function(){
	if ( Game.support_mode_1 === false && Game.attack_mode_1 === true) {
		Game.fire_1();
	}
	if ( Game.support_mode_2 === false && Game.attack_mode_2 === true) {
		Game.fire_2();
	}
}

// anchoring
Game.anchor_center = function(obj) {
	obj.anchor.set(0.5,0.5);
}
Game.anchor_camera = function(obj) {
	obj.anchor.set(2.5,0);
}

// collisions
Game.collide = function(obj1, obj2, func) {
	App.game.physics.arcade.collide(obj1, obj2, func );
}
Game.destroy_ground = function(bomb, ground){
	ground.destroy();
	bomb.kill();
}
Game.hit_hero_1 = function(nb_life,bullet){
	App.game.sound.play('Game_hit',0.8);
	nb_life = Game.nb_life_1-1;
	Game.nb_life_1--;
	for( var i = -1 ; i < Game.nb_life_1; i++){
		Game.life_pool[Game.nb_life_1].destroy();
	}
		

	bullet.destroy();
	Game.hero_1.body.velocity.x=0;
	Game.support_1.body.velocity.x=0;

}
Game.hit_hero_2 = function(nb_life,bullet){
	App.game.sound.play('Game_hit',0.8);
	nb_life = Game.nb_life_2-1;
	Game.nb_life_2--;
	for( var i = -1 ; i < Game.nb_life_2; i++){
		Game.life_pool_2[Game.nb_life_2].destroy();
	}
	bullet.destroy();
	Game.hero_2.body.velocity.x=0;
	Game.support_2.body.velocity.x=0;

}

//state
Game.win = function(){
	if (Game.hero_1.body.x === Game.world_width && Game.hero_2.body.x === Game.world_width ){
		App.game.state.start("Wave", true, true);
		App.game.sound.destroy();
	}
	if(Game.support_1.body.x === Game.world_width && Game.support_2.body.x === Game.world_width){
		App.game.state.start("Wave", true, true);
		App.game.sound.destroy();
	}
	if(Game.support_1.body.x === Game.world_width && Game.hero_2.body.x === Game.world_width){
		App.game.state.start("Wave", true, true);
		App.game.sound.destroy();
	}
	if(Game.support_2.body.x === Game.world_width && Game.hero_1.body.x === Game.world_width){
		App.game.state.start("Wave", true, true);
		App.game.sound.destroy();
	}
}
Game.lose_1 = function(){
	if ( Game.attack_mode_1 === true){
		Game.hero_1.body.velocity.x -=50;
	}
	if ( Game.support_mode_1 === true){
		Game.support_1.body.velocity.x -=50;
	}
	if ( Game.attack_mode_2 === true){
		Game.hero_2.body.velocity.x -=50;
	}
	if ( Game.support_mode_2 === true){
		Game.support_2.body.velocity.x -=50;
	}
	
	if ( Game.hero_1.body.x < 0 || Game.support_1.body.x < 0){
		App.game.state.start("lose", true, true);
		App.game.sound.destroy();

	}
	if ( Game.hero_2.body.x < 0 || Game.support_2.body.x< 0){
		App.game.state.start("lose", true, true);
		App.game.sound.destroy();
	}
	
}
Game.lose_2 = function(){
	if ( Game.attack_mode_1 === true){
		Game.hero_1.body.velocity.x -=50;
	}
	if ( Game.support_mode_1 === true){
		Game.support_1.body.velocity.x -=50;
	}
	if ( Game.attack_mode_2 === true){
		Game.hero_2.body.velocity.x -=50;
	}
	if ( Game.support_mode_2 === true){
		Game.support_2.body.velocity.x -=50;
	}
	
	if ( Game.hero_1.body.x < 0 || Game.support_1.body.x < 0){
		App.game.state.start("lose", true, true);
		App.game.sound.destroy();

	}
	if ( Game.hero_2.body.x < 0 || Game.support_2.body.x< 0){
		App.game.state.start("lose", true, true);
		App.game.sound.destroy();
	}
	
	
}
Game.lose_3 = function(){
	if ( Game.nb_life_1 === 0 || Game.nb_life_2 === 0  ){
		App.game.state.start("lose", true, true);
		App.game.sound.destroy();
	}
	
}

// been
document.addEventListener("keydown", function(event){
	Game.switch_mode();
});

