var Wave = new Phaser.State();

// reglage du jeu

// hauteur de saut
Wave.jump_hero_1_height = 1000;
Wave.jump_hero_2_height = 1000;
Wave.jump_hero_1_height_on_floor = 600;
Wave.jump_hero_2_height_on_floor = 600;

// cadence de tir 
Wave.fireRate = 200;
Wave.firing_timer_boss = 0; 
Wave.firing_timer = 0;
Wave.firing_timer_2 = 0 ;
Wave.nextFire = 0;
Wave.nextFire_2 = 0;
// tir
Wave.fire_left_1 = false;
Wave.fire_left_2 = false;
Wave.fire_right_1 = false;
Wave.fire_right_2 = false;
//ennemi
Wave.timer_ennemi_spawn_1 = 1000;
Wave.timer_ennemi_spawn_2 = 800;
Wave.timer_ennemi_spawn_3 = 1000;
Wave.timer_ennemi_spawn_4 = 800;
Wave.speed_ennemi = 100;
Wave.nb_ennemi = 500;
// variable de jeu
Wave.world_width  = 1800;
Wave.world_height = 1000;
Wave.w_state = 0;
Wave.ennemi_pool = [];

//move
Wave.right_move_1 = false;
Wave.right_move_2 = false;
Wave.left_move_1 = false;
Wave.left_move_2 = false;
Wave.speed_left_hero_1 = 10;
Wave.speed_left_hero_2 = 10;
Wave.speed_right_hero_1 = 10;
Wave.speed_right_hero_2 = 10;
Wave._hero_1 = 10;
Wave.stop_hero_2 = 10;

//ennemi
Wave.next_ennemi_1 = 0;
Wave.next_ennemi_2 = 5;
Wave.next_ennemi_3 = 0;
Wave.next_ennemi_4 = 5;
Wave.move_enemi_ok = false;
Wave.ennemi_count = 0;
Wave.ennemi_right; 
Wave.ennemi2_right; 
Wave.ennemi3_left;
Wave.ennemi4_left;
Wave.living_ennemi_1_left = [];
Wave.living_ennemi_1_right = [];
Wave.living_ennemi_2_left = [];
Wave.living_ennemi_2_right = [];
Wave.bullets_ennemi_1_left;
Wave.bullets_ennemi_1_right;
Wave.bullets_ennemi_2_left;
Wave.bullets_ennemi_2_right;
Wave.firing_timer=0;

//sauts
Wave.jump_ready_1 = true;
Wave.jump_ready_2 = false;
Wave.jump_ready_1_floor = false;
Wave.jump_ready_2_floor = true;
// sprite anim
Wave.sprite_anim_hero1_left= false;
Wave.sprite_anim_hero1_right= false;
Wave.sprite_anim_hero1_fire_right= false;
Wave.sprite_anim_hero1_fire_left= false;

Wave.sprite_anim_hero2_left= false;
Wave.sprite_anim_hero2_right= false;
Wave.sprite_anim_hero2_fire_right= false;
Wave.sprite_anim_hero2_fire_left= false;

Wave.preload = function() {
	var locations = ['Assets/fond.jpg',
					 'Assets/passerelle.png',
					 'Assets/plot.png',
					 'Assets/fire.png',
					 'Assets/boss.png',
					 'Assets/obstacle_1.jpg',
					 'Assets/fire-1.png',
					 'Assets/bomb.png',
					 'Assets/ennemi_right.png',
					 'Assets/ennemi_left.png'
	]
		names    = ['fond',
					'passerelle',
					'plot',
					'fire',
					'boss',
					'obstacle_1',
					'fire-1',
					'bomb',
					'ennemi_right',
					'ennemi_left',
		];

	for (var i = 0; i < locations.length; i++){
		App.game.load.image(names[i], locations[i]);
	}
	App.game.load.spritesheet("soldat_1", "Assets/soldat_1.png", 120, 117, 30);
	App.game.load.spritesheet("soldat_2", "Assets/soldat_2.png", 120, 117, 30);
	App.game.load.audio('Game_fire',["Assets/fire.wav", "Assets/fire.ogg"] );
	App.game.load.audio('Game_sound',["Assets/wave.wav"] );
	App.game.load.audio('Game_hit',["Assets/hit.wav"] );
},



Wave.create = function() {
	App.game.physics.startSystem(Phaser.Physics.ARCADE);

	// définition du world
	Wave.world  = App.game.world.setBounds(0, 0, Wave.world_width, Wave.world_height );

	// création du hero
	App.game.sound.play('Game_sound', 0.4,true)
	Wave.bg = App.game.add.sprite( 0,0,"fond");
	Wave.hero_1 = App.game.add.sprite(Wave.world_width/2, Wave.world_height-650, "soldat_1");
	Wave.hero_2 = App.game.add.sprite(Wave.world_width/2, Wave.world_height-150, "soldat_2");

	//animate spritesheet

	Wave.hero_1.animations.add("walk_right", [0,1,2,3,4,5,6,7], 18, false);
	Wave.hero_1.animations.add("walk_left", [ 29, 28, 27, 26, 25, 24, 23, 22 ], 18, false);
	Wave.hero_1.animations.add("fire_right", [8,9,10,11,12,13,14,],15, false);
	Wave.hero_1.animations.add("fire_left", [21,20,19,18,17,16,15], 15, false);
	
	Wave.hero_2.animations.add("walk_right", [0,1,2,3,4,5,6,7], 18, false);
	Wave.hero_2.animations.add("walk_left", [ 29, 28, 27, 26, 25, 24, 23, 22 ], 18, false);
	Wave.hero_2.animations.add("fire_right", [8,9,10,11,12,13,14,],15, false);
	Wave.hero_2.animations.add("fire_left", [21,20,19,18,17,16,15], 15, false);

	
	//integration de la passerelle
	Wave.passerelle_create(Wave.world_height/2-25);
	Wave.ground_create(Wave.world_height);


	//Création des bullets
	Wave.bullet_create();
	Wave.bullet_ennemi_create();

	//Création des ennemis
	Wave.ennemi_create(Wave.nb_ennemi);
	


	//pad
	App.game.input.gamepad.start();
	Wave.pad1 = App.game.input.gamepad.pad1;
	Wave.pad2 = App.game.input.gamepad.pad2;

	//corps physic
	App.game.physics.enable([Wave.hero_1, Wave.hero_2], Phaser.Physics.arcade);
	
	Wave.anchor_center(Wave.hero_1);
	Wave.hero_1.body.gravity.set(0, 2500);
	Wave.hero_1.body.width = 10;
	
	Wave.anchor_center(Wave.hero_2);
	Wave.hero_2.body.gravity.set(0, 2500);
	Wave.hero_2.body.width = 10;

}

//--------------------------------------------------------------update---------------------------------------------

Wave.update = function(){

	//sprite anim
	Wave.animate_sprite();
	//been
	Wave.switch_wave(2,4,8,20,100);
	//move
	Wave.move_ennemi();

	Wave.right_move();
	Wave.left_move();
	Wave.exit_right();
	Wave.direcly_bullet();
	//jump
	Wave.jump();
	Wave.ready_to_jump_1_floor();
	Wave.ready_to_jump_2_floor();

	// mecanique de tir
	Wave.fire_1(50);
	Wave.fire_2(50);
	Wave.bullet_reset();

	

	//hero + passerelle
	Wave.collide(Wave.hero_1, Wave.passerelle_grp, Wave.ready_to_jump_1);
	Wave.collide(Wave.hero_1, Wave.ground_grp, Wave.ready_to_jump_1);
	Wave.collide(Wave.hero_2, Wave.passerelle_grp, Wave.ready_to_jump_2);
	Wave.collide(Wave.hero_2, Wave.ground_grp, Wave.ready_to_jump_2);
	// hero + ennemi 
	Wave.collide(Wave.hero_1, Wave.ennemi_grp_1_right, Wave.lose);
	Wave.collide(Wave.hero_1, Wave.ennemi_grp_2_right, Wave.lose);
	Wave.collide(Wave.hero_1, Wave.ennemi_grp_1_left, Wave.lose);
	Wave.collide(Wave.hero_1, Wave.ennemi_grp_2_left, Wave.lose);
	Wave.collide(Wave.hero_2, Wave.ennemi_grp_1_right, Wave.lose);
	Wave.collide(Wave.hero_2, Wave.ennemi_grp_2_right, Wave.lose);
	Wave.collide(Wave.hero_2, Wave.ennemi_grp_1_left, Wave.lose);
	Wave.collide(Wave.hero_2, Wave.ennemi_grp_2_left, Wave.lose);
	//bulet ennemi
	Wave.collide(Wave.bullets_1, Wave.ennemi_grp_1_right, Wave.kill_ennemi);
	Wave.collide(Wave.bullets_1, Wave.ennemi_grp_2_right, Wave.kill_ennemi);
	Wave.collide(Wave.bullets_1, Wave.ennemi_grp_1_left, Wave.kill_ennemi);
	Wave.collide(Wave.bullets_1, Wave.ennemi_grp_2_left, Wave.kill_ennemi);
	Wave.collide(Wave.bullets_2, Wave.ennemi_grp_1_right, Wave.kill_ennemi);
	Wave.collide(Wave.bullets_2, Wave.ennemi_grp_2_right, Wave.kill_ennemi);
	Wave.collide(Wave.bullets_2, Wave.ennemi_grp_1_left, Wave.kill_ennemi);
	Wave.collide(Wave.bullets_2, Wave.ennemi_grp_2_left, Wave.kill_ennemi);

	Wave.collide(Wave.bullets_ennemi_1_left, Wave.hero_1, Wave.lose);
	Wave.collide(Wave.bullets_ennemi_1_right, Wave.hero_1, Wave.lose);
	Wave.collide(Wave.bullets_ennemi_2_left, Wave.hero_1, Wave.lose);
	Wave.collide(Wave.bullets_ennemi_2_right, Wave.hero_1, Wave.lose);
	Wave.collide(Wave.bullets_ennemi_1_left, Wave.hero_2, Wave.lose);
	Wave.collide(Wave.bullets_ennemi_1_left, Wave.hero_2, Wave.lose);
	Wave.collide(Wave.bullets_ennemi_2_right, Wave.hero_2, Wave.lose);
	Wave.collide(Wave.bullets_ennemi_2_left, Wave.hero_2, Wave.lose);
	// corps fixe


}

//--------------------------------------------------------------fonction---------------------------------------------

//creation des entitées
Wave.passerelle_create = function(y){
	Wave.passerelle_grp = this.add.group();
	Wave.passerelle_grp.enableBody 		= true ;

	for ( var i = 0; i < Wave.world_width; i+=50){
		var passerelle_group = Wave.passerelle_grp.create( i,y,"passerelle" );
		passerelle_group.body.immovable=true;
	}
}
Wave.ground_create = function(y){
	Wave.ground_grp = this.add.group();
	Wave.ground_grp.enableBody 		= true ;

	for ( var i = 0; i < Wave.world_width; i+=50){
		var ground_group = Wave.ground_grp.create( i,y,"obstacle_1" );
		ground_group.body.immovable=true;
	}
}
Wave.bullet_create = function(){
	Wave.bullets_1 = App.game.add.group();
    Wave.bullets_1.enableBody = true;
    Wave.bullets_1.physicsBodyType = Phaser.Physics.ARCADE;
    Wave.bullets_1.createMultiple(500, 'fire-1');
    Wave.bullets_1.setAll('checkWorldBounds', true);
    Wave.bullets_1.setAll('outOfBoundsKill', true);
    Wave.sprite_bullet_1 = App.game.add.sprite(Wave.hero_1.x, Wave.hero_1.y, 'fire-1');
    Wave.sprite_bullet_1.kill();

    Wave.bullets_2 = App.game.add.group();
    Wave.bullets_2.enableBody = true;
    Wave.bullets_2.physicsBodyType = Phaser.Physics.ARCADE;
    Wave.bullets_2.createMultiple(500, 'fire-1');
    Wave.bullets_2.setAll('checkWorldBounds', true);
    Wave.bullets_2.setAll('outOfBoundsKill', true);
    Wave.sprite_bullet_2 = App.game.add.sprite(Wave.hero_2.x, Wave.hero_2.y, 'fire-1');
    Wave.sprite_bullet_2.kill();
}


Wave.ennemi_create = function(nb){
	Wave.ennemi_grp_1_left = this.add.group();
    Wave.ennemi_grp_1_left.enableBody = true;

    Wave.ennemi_grp_2_left = this.add.group();
    Wave.ennemi_grp_2_left.enableBody = true;
   
    Wave.ennemi_grp_1_right = this.add.group();
    Wave.ennemi_grp_1_right.enableBody = true;
    
    Wave.ennemi_grp_2_right =this.add.group();
    Wave.ennemi_grp_2_right.enableBody = true;

	for ( var i = 0; i < nb; i++) {
		var y_alea1 = Math.round(Math.random()*500);
		var y_alea2 = Math.round(Math.random()*500)+500;

		
		Wave.ennemi_1_right = Wave.ennemi_grp_1_right.create( -500, y_alea1, 'ennemi_left');
		Wave.ennemi_1_right.body.immovable = true;	
		Wave.ennemi_1_left = Wave.ennemi_grp_1_left.create(Wave.world_width+500, y_alea1, 'ennemi_right');
		Wave.ennemi_1_left.body.immovable = true;
		Wave.ennemi_2_right = Wave.ennemi_grp_2_right.create( -500, y_alea2, 'ennemi_left');
		Wave.ennemi_2_right.body.immovable = true;
		Wave.ennemi_2_left = Wave.ennemi_grp_2_left.create( Wave.world_width+500, y_alea2, 'ennemi_right');
		Wave.ennemi_2_left.body.immovable = true;
    }
    Wave.move_enemi_ok = true;
}
Wave.bullet_ennemi_create = function(){
    Wave.bullets_ennemi_1_left = App.game.add.group();
    Wave.bullets_ennemi_1_left.enableBody = true;
    Wave.bullets_ennemi_1_left.physicsBodyType = Phaser.Physics.ARCADE;
    Wave.bullets_ennemi_1_left.createMultiple(20, 'plot');
    Wave.bullets_ennemi_1_left.setAll('checkWorldBounds', true);
    Wave.bullets_ennemi_1_left.setAll('outOfBoundsKill', true);

    Wave.bullets_ennemi_1_right = App.game.add.group();
    Wave.bullets_ennemi_1_right.enableBody = true;
    Wave.bullets_ennemi_1_right.physicsBodyType = Phaser.Physics.ARCADE;
    Wave.bullets_ennemi_1_right.createMultiple(20, 'plot');
    Wave.bullets_ennemi_1_right.setAll('checkWorldBounds', true);
    Wave.bullets_ennemi_1_right.setAll('outOfBoundsKill', true);

    Wave.bullets_ennemi_2_right = App.game.add.group();
    Wave.bullets_ennemi_2_right.enableBody = true;
    Wave.bullets_ennemi_2_right.physicsBodyType = Phaser.Physics.ARCADE;
    Wave.bullets_ennemi_2_right.createMultiple(20, 'plot');
    Wave.bullets_ennemi_2_right.setAll('checkWorldBounds', true);
    Wave.bullets_ennemi_2_right.setAll('outOfBoundsKill', true);

    Wave.bullets_ennemi_2_left = App.game.add.group();
    Wave.bullets_ennemi_2_left.enableBody = true;
    Wave.bullets_ennemi_2_left.physicsBodyType = Phaser.Physics.ARCADE;
    Wave.bullets_ennemi_2_left.createMultiple(20, 'plot');
    Wave.bullets_ennemi_2_left.setAll('checkWorldBounds', true);
    Wave.bullets_ennemi_2_left.setAll('outOfBoundsKill', true);
}

Wave.pool_ennemi = function(nb1,nb2){
	Wave.ennemi_right = Wave.ennemi_grp_1_right.getRandom(nb1, nb2);
	Wave.ennemi2_right = Wave.ennemi_grp_2_right.getRandom(nb1, nb2);
	Wave.ennemi3_left = Wave.ennemi_grp_1_left.getRandom(nb1, nb2);
	Wave.ennemi4_left = Wave.ennemi_grp_2_left.getRandom(nb1, nb2);

		
}
Wave.switch_wave = function(nb1,nb2,nb3,nb4,nb5){
	if ( Wave.ennemi_count === nb1*4){
		Wave.w_state = 1;
		console.log('vague 2')
	}
	if ( Wave.ennemi_count === nb2*4 ){
		Wave.w_state = 2;
		console.log('vague 3')
	}
	if ( Wave.ennemi_count === nb3*4 ){
		Wave.w_state = 3;
		console.log('vague 4')
	}
	if ( Wave.ennemi_count === nb4*4 ){
		Wave.w_state = 4;
		console.log('vague 5')
	}
	if ( Wave.ennemi_count === nb5*4 ){
		Wave.w_state = 5;
		console.log('vague 6')
	}
}

Wave.move_ennemi = function(){
	if ( Wave.move_enemi_ok === true){
		if ( Wave.w_state === 0){

			Wave.pool_ennemi(0,2);
		}
		//-------
		if ( Wave.w_state === 1){
			Wave.pool_ennemi(0,4);
			Wave.speed_ennemi = 200;
		}
		if ( Wave.w_state === 2){
			Wave.pool_ennemi(0,8);
			Wave.auto_fire_1_left();
			Wave.auto_fire_1_right();
			Wave.auto_fire_2_left();
			Wave.auto_fire_2_right();
			
		}
		if ( Wave.w_state === 3){
			Wave.pool_ennemi(0,20);
			Wave.speed_ennemi = 250;
			Wave.timer_ennemi_spawn_1 = 50;
 			Wave.timer_ennemi_spawn_2 = 50;
			Wave.timer_ennemi_spawn_3 = 50;
			Wave.timer_ennemi_spawn_4 = 50;
			Wave.fireRate = 50;
			
		}
		if ( Wave.w_state === 4){
			Wave.pool_ennemi(0,100);
			Wave.speed_ennemi = 400;
			Wave.timer_ennemi_spawn_1 = 200;
 			Wave.timer_ennemi_spawn_2 = 200;
			Wave.timer_ennemi_spawn_3 = 50;
			Wave.timer_ennemi_spawn_4 = 150;
			Wave.fireRate = 50;
			
		}
		

		if ( Wave.ennemi_grp_1_right.x < Wave.world_width && App.game.time.now > Wave.next_ennemi_1 ){
		
			App.game.physics.arcade.moveToObject( Wave.ennemi_right,Wave.hero_1,Wave.speed_ennemi);
			Wave.next_ennemi_1 = App.game.time.now + Wave.timer_ennemi_spawn_1;
		}

		if (Wave.ennemi_grp_2_right.x < Wave.world_width && App.game.time.now > Wave.next_ennemi_2 ){
			

			App.game.physics.arcade.moveToObject( Wave.ennemi2_right,Wave.hero_2,Wave.speed_ennemi);
			Wave.next_ennemi_2 = App.game.time.now + Wave.timer_ennemi_spawn_2;
		}

		if (Wave.ennemi_grp_1_left.x < Wave.world_width && App.game.time.now > Wave.next_ennemi_3){
			

			App.game.physics.arcade.moveToObject( Wave.ennemi3_left,Wave.hero_1,Wave.speed_ennemi);
			Wave.next_ennemi_3 = App.game.time.now + Wave.timer_ennemi_spawn_3;
		}
		if (Wave.ennemi_grp_2_left.x < Wave.world_width && App.game.time.now > Wave.next_ennemi_4 ){
			

			App.game.physics.arcade.moveToObject( Wave.ennemi4_left,Wave.hero_2,Wave.speed_ennemi);
			Wave.next_ennemi_4 = App.game.time.now + Wave.timer_ennemi_spawn_4;
		}

	}
}
//move

Wave.right_move = function(){
	if ( Wave.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1 ){
		Wave.right_move_1 = true;

		Wave.sprite_anim_hero1_right = true;
		Wave.fire_right_1 = true;
		Wave.fire_left_1 = false;
		Wave.hero_1.body.x += Wave.speed_right_hero_1;
	}
	else{
		Wave.sprite_anim_hero1_right = false;
	}

	if ( Wave.pad2.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){
		Wave.right_move_2 = true;
		Wave.fire_right_2 = true;
		Wave.fire_left_2 = false;
		Wave.sprite_anim_hero2_right = true
		Wave.hero_2.body.x += Wave.speed_right_hero_2;
	}
	else{
		Wave.sprite_anim_hero2_right = false
	}
}
Wave.left_move = function(){
	if ( Wave.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1 ){
		Wave.fire_left_1 = true;
		Wave.fire_right_1 = false;
		Wave.left_move_1 = true;
		Wave.right_move_1 = false;
		Wave.sprite_anim_hero1_left = true;
		Wave.hero_1.body.x -= Wave.speed_left_hero_1;
	}
	else{
		Wave.sprite_anim_hero1_left = false;
	}

	if ( Wave.pad2.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
		Wave.fire_right_2 = false;
		Wave.fire_left_2 = true;
		Wave.sprite_anim_hero2_left = true;
		Wave.right_move_2 = false;
		Wave.left_move_2 = true;
		Wave.hero_2.body.x -= Wave.speed_left_hero_2;
	}
	else{
		Wave.sprite_anim_hero2_left = false;
	}	
}
Wave.exit_right = function(){
	if ( Wave.hero_1.body.x > Wave.world_width ){
		Wave.hero_1.body.y = Wave.world_height-150;
		Wave.hero_1.body.x = 150;
	}
	if ( Wave.hero_1.body.x < 0 ){
		Wave.hero_1.body.y = Wave.world_height-650;
		Wave.hero_1.body.x = Wave.world_width-100;		
	}
	if ( Wave.hero_2.body.x > Wave.world_width ){
		Wave.hero_2.body.y = Wave.world_height-150;
		Wave.hero_2.body.x = 150;
	}
	if ( Wave.hero_2.body.x < 0 ){
		Wave.hero_2.body.y = Wave.world_height-650;
		Wave.hero_2.body.x = Wave.world_width-100;		
	}
}


// tirs
Wave.direcly_bullet = function(){
	if ( Wave.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1 &&  Wave.pad1.isDown(Phaser.Gamepad.XBOX360_B)  ){
			Wave.fire_1(-50);
		
	}
	if ( Wave.pad2.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1 &&  Wave.pad2.isDown(Phaser.Gamepad.XBOX360_B)  ){
			Wave.fire_2(-50);	
	}
	if ( Wave.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1 &&  Wave.pad1.isDown(Phaser.Gamepad.XBOX360_B)  ){
			Wave.fire_1(200);
		
	}
	if ( Wave.pad2.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1 &&  Wave.pad2.isDown(Phaser.Gamepad.XBOX360_B)  ){
			Wave.fire_2(200);	
	}
}

Wave.fire_1 = function(yb){
	if ( Wave.pad1.isDown(Phaser.Gamepad.XBOX360_B)  && Wave.fire_right_1 === true ) {
		Wave.sprite_anim_hero1_fire_right = true;
		Wave.sprite_anim_hero1_right = false;
		Wave.is_fire_1 = true;
		

		if (App.game.time.now > Wave.nextFire && Wave.bullets_1.countDead() > 0 && Wave.fire_right_1 === true){
	    	Wave.nextFire = App.game.time.now + Wave.fireRate;
	    	var bullet = Wave.bullets_1.getFirstDead();
	    	bullet.reset(Wave.sprite_bullet_1.x+30, Wave.sprite_bullet_1.y+40 );
	    	App.game.physics.arcade.moveToXY(bullet, bullet.x+600, Wave.hero_1.y+40-yb, 1500);
	    	App.game.sound.play('Game_fire',0.4);
    	}
    }	
    else{
		Wave.sprite_anim_hero1_fire_right = false;
	}
    if ( Wave.pad1.isDown(Phaser.Gamepad.XBOX360_B)  && Wave.fire_left_1 === true ) {
		Wave.sprite_anim_hero1_fire_left = true;
		Wave.sprite_anim_hero1_left = false;
		Wave.is_fire_1 = true;

    	if (App.game.time.now > Wave.nextFire && Wave.bullets_1.countDead() > 0 && Wave.fire_left_1 === true){
	    	Wave.nextFire = App.game.time.now + Wave.fireRate;
	    	var bullet = Wave.bullets_1.getFirstDead();
	    	bullet.reset(Wave.sprite_bullet_1.x-50 , Wave.sprite_bullet_1.y+40 );
	    	App.game.physics.arcade.moveToXY(bullet, bullet.x-600, Wave.hero_1.y+40-yb, 1500);
	    	App.game.sound.play('Game_fire',0.4);
    	}
	}
	else{
		Wave.sprite_anim_hero1_fire_left = false;
	}

}

Wave.fire_2 = function(yb){
	if ( Wave.pad2.isDown(Phaser.Gamepad.XBOX360_B)  && Wave.fire_right_2 === true ) {
		Wave.sprite_anim_hero2_fire_right = true;
		Wave.sprite_anim_hero2_right = false;
		Wave.is_fire_2 = true;
		

		if (App.game.time.now > Wave.nextFire_2 && Wave.bullets_2.countDead() > 0 && Wave.fire_right_2 === true){
	    	Wave.nextFire_2 = App.game.time.now + Wave.fireRate;
	    	var bullet = Wave.bullets_2.getFirstDead();
	    	bullet.reset(Wave.sprite_bullet_2.x+30, Wave.sprite_bullet_2.y+40 );
	    	App.game.physics.arcade.moveToXY(bullet, bullet.x+600, Wave.hero_2.y+40-yb, 1500);
	    	App.game.sound.play('Game_fire',0.4);
    	}
    }	
    else{
		Wave.sprite_anim_hero2_fire_right = false;
	}
    if ( Wave.pad2.isDown(Phaser.Gamepad.XBOX360_B)  && Wave.fire_left_2 === true ) {
		Wave.sprite_anim_hero2_fire_left = true;
		Wave.sprite_anim_hero2_left = false;
		Wave.is_fire_2 = true;

    	if (App.game.time.now > Wave.nextFire_2 && Wave.bullets_2.countDead() > 0 && Wave.fire_left_2 === true){
	    	Wave.nextFire_2= App.game.time.now + Wave.fireRate;
	    	var bullet = Wave.bullets_2.getFirstDead();
	    	bullet.reset(Wave.sprite_bullet_2.x-50 , Wave.sprite_bullet_2.y+40 );
	    	App.game.physics.arcade.moveToXY(bullet, bullet.x-600, Wave.hero_2.y+40-yb, 1500);
	    	App.game.sound.play('Game_fire',0.4);
    	}
	}
	else{
		Wave.sprite_anim_hero2_fire_left = false;
	}
}
Wave.auto_fire_1_left = function(){

    Wave.bullet_ennemi_1_left = Wave.bullets_ennemi_1_left.getFirstExists(false);
    Wave.living_ennemi_1_left.length=0;

    Wave.ennemi_grp_1_right.forEachExists(function(ennemi_1){
        Wave.living_ennemi_1_left.push(ennemi_1);
    });


    if (Wave.bullet_ennemi_1_left && Wave.living_ennemi_1_left.length > 0) {
        
        var random = App.game.rnd.integerInRange(0, Wave.living_ennemi_1_left.length-4);

        // randomly select one of them
        var shooter = Wave.living_ennemi_1_left[random];
        // And fire the bullet from this enemy
        Wave.bullet_ennemi_1_left.reset(shooter.body.x, shooter.body.y);
        
        App.game.physics.arcade.moveToObject(Wave.bullet_ennemi_1_left,Wave.hero_1,300);
    }


}
Wave.auto_fire_1_right = function(){

    Wave.bullet_ennemi_1_right = Wave.bullets_ennemi_1_right.getFirstExists(false);
    Wave.living_ennemi_1_right.length=0;

    Wave.ennemi_grp_1_right.forEachExists(function(ennemi_2){
        Wave.living_ennemi_1_right.push(ennemi_2);
    });


    if (Wave.bullet_ennemi_1_right && Wave.living_ennemi_1_right.length > 0) {
        
        var random = App.game.rnd.integerInRange(0, Wave.living_ennemi_1_right.length-4);

        // randomly select one of them
        var shooter = Wave.living_ennemi_1_right[random];
        // And fire the bullet from this enemy
        Wave.bullet_ennemi_1_right.reset(shooter.body.x, shooter.body.y);
        
        App.game.physics.arcade.moveToObject(Wave.bullet_ennemi_1_right,Wave.hero_1,300);
    }
}

Wave.auto_fire_2_left = function(){

    Wave.bullet_ennemi_2_left = Wave.bullets_ennemi_2_left.getFirstExists(false);
    Wave.living_ennemi_2_left.length=0;

    Wave.ennemi_grp_2_left.forEachExists(function(ennemi_3){
        Wave.living_ennemi_2_left.push(ennemi_3);
    });


    if (Wave.bullet_ennemi_2_left && Wave.living_ennemi_2_left.length > 0) {
        
        var random = App.game.rnd.integerInRange(0, Wave.living_ennemi_2_left.length-4);

        // randomly select one of them
        var shooter = Wave.living_ennemi_2_left[random];
        // And fire the bullet from this enemy
        Wave.bullet_ennemi_2_left.reset(shooter.body.x, shooter.body.y);
        
        App.game.physics.arcade.moveToObject(Wave.bullet_ennemi_2_left,Wave.hero_2,300);
    }


}
Wave.auto_fire_2_right = function(){
    Wave.bullet_ennemi_2_right = Wave.bullets_ennemi_2_right.getFirstExists(false);
    Wave.living_ennemi_2_right.length=0;

    Wave.ennemi_grp_2_right.forEachExists(function(ennemi_4){
        Wave.living_ennemi_2_right.push(ennemi_4);
    });


    if (Wave.bullet_ennemi_2_right && Wave.living_ennemi_2_right.length > 0) {
        
        var random = App.game.rnd.integerInRange(0, Wave.living_ennemi_2_right.length-4);

        // randomly select one of them
        var shooter = Wave.living_ennemi_2_right[random];
        // And fire the bullet from this enemy
        Wave.bullet_ennemi_2_right.reset(shooter.body.x, shooter.body.y);
        
        App.game.physics.arcade.moveToObject(Wave.bullet_ennemi_2_right,Wave.hero_2,300);
    } 	
}

Wave.bullet_reset = function() {
	if ( Wave.fire_right_1 === true ){
		Wave.sprite_bullet_1.x = Wave.hero_1.x + 23;
		Wave.sprite_bullet_1.y = Wave.hero_1.y-49;
		Wave.is_fire_1 = false;
	}
	if ( Wave.fire_left_1 === true){
		Wave.sprite_bullet_1.x = Wave.hero_1.x - 43;
		Wave.sprite_bullet_1.y = Wave.hero_1.y-49;
		Wave.is_fire_1 = false;

	}
	if ( Wave.fire_right_2 === true ){
		Wave.sprite_bullet_2.x = Wave.hero_2.x + 43;
		Wave.sprite_bullet_2.y = Wave.hero_2.y-49;
		Wave.is_fire_2 = false;
	}
	if ( Wave.fire_left_2 === true ){
		Wave.sprite_bullet_2.x = Wave.hero_2.x - 53;
		Wave.sprite_bullet_2.y = Wave.hero_2.y-49;
		Wave.is_fire_2 = false;
	}
}

// collisions
Wave.collide = function(obj1, obj2, func) {
	App.game.physics.arcade.collide(obj1, obj2, func );
}

// sauts
Wave.jump = function(){
	if ( Wave.pad1.isDown(Phaser.Gamepad.XBOX360_A) && Wave.jump_ready_1 === true ){
		Wave.hero_1.body.gravity.set(0,2000);
		Wave.hero_1.body.y -= 1;
		Wave.hero_1.body.velocity.y -= Wave.jump_hero_1_height;
		Wave.jump_ready_1 = false;
		Wave.jump_ready_1_floor = false;
	}

	if ( Wave.pad1.isDown(Phaser.Gamepad.XBOX360_A) && Wave.jump_ready_1_floor === true && Wave.jump_ready_1 === false ){
		Wave.hero_1.body.gravity.set(0,2500);
		Wave.hero_1.body.y -= 1;
		Wave.hero_1.body.velocity.y -= Wave.jump_hero_1_height_on_floor;
		Wave.jump_ready_1_floor = false;
	}
	if ( Wave.pad2.isDown(Phaser.Gamepad.XBOX360_A) && Wave.jump_ready_2 === true ){

		Wave.hero_2.body.gravity.set(0,2000);
		Wave.hero_2.body.y -= 1;
		Wave.hero_2.body.velocity.y -= Wave.jump_hero_2_height;
		Wave.jump_ready_2 = false;
		Wave.jump_ready_2_floor = false;
	}

	if ( Wave.pad2.isDown(Phaser.Gamepad.XBOX360_A) && Wave.jump_ready_2_floor === true && Wave.jump_ready_2 === false ){
		Wave.hero_2.body.y -= 1;
		Wave.hero_2.body.velocity.y -= Wave.jump_hero_2_height_on_floor;
		Wave.jump_ready_2_floor = false;
	}
}
Wave.ready_to_jump_1 = function() {
	Wave.jump_ready_1 = true;	
}
Wave.ready_to_jump_2 = function() {
	Wave.jump_ready_2 = true;
}
Wave.ready_to_jump_1_floor = function(){
	if ( Wave.hero_1.body.onFloor()){
		Wave.jump_ready_1_floor = true;
		Wave.jump_ready_1 = false;
	}
}
Wave.ready_to_jump_2_floor = function(){
	if ( Wave.hero_2.body.onFloor()){
		Wave.jump_ready_2_floor = true;
		Wave.jump_ready_2 = false;
	}
}
Wave.animate_sprite = function(){
	if( Wave.sprite_anim_hero1_right === true){
		Wave.hero_1.animations.play('walk_right');
	}
	if( Wave.sprite_anim_hero1_left === true){
		Wave.hero_1.animations.play('walk_left');
	}
	if (Wave.sprite_anim_hero1_fire_right === true ){
		Wave.hero_1.animations.play('fire_right');
	}
	if (Wave.sprite_anim_hero1_fire_left === true){
		Wave.hero_1.animations.play('fire_left');
	}

	if( Wave.sprite_anim_hero2_right === true ){
		Wave.hero_2.animations.play('walk_right');
	}
	if( Wave.sprite_anim_hero2_left === true ){
		Wave.hero_2.animations.play('walk_left');
	}
	if (Wave.sprite_anim_hero2_fire_right === true){
		Wave.hero_2.animations.play('fire_right');
	}
	if (Wave.sprite_anim_hero2_fire_left === true ){
		Wave.hero_2.animations.play('fire_left');
	}
}
// anchoring
Wave.anchor_center = function(obj) {
	obj.anchor.set(0.5,0.5);
}
Wave.anchor_camera = function(obj) {
	obj.anchor.set(2.5,0);
}
Wave.kill_ennemi = function(ennemi, bullet){
	bullet.kill();
	ennemi.kill();
	Wave.ennemi_count ++;
	console.log(Wave.ennemi_count);
}
//state
Wave.lose = function(){
	App.game.state.start("lose_2", true, true);
	App.game.sound.destroy();
	
}

