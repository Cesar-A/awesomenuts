game.PlayerEntity = me.Entity.extend({

	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "player",
			width: 64,  
			height: 64,
			spritewidth: "64",
			spriteheight: "64",
			
			getShape: function(){
				
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);

		//move 5 units to the right
		this.body.setVelocity(5, 20 );
		//keep track of which direction your character is going 
		this.facing = "right";
		//keep track of what time it is for the game
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.lastAttack = new Date().getTime();//haven't use the attack variable yet

		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);

		//Animation for character attack
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

		this.renderable.setCurrentAnimation("idle");

	},

	update: function(delta){
		//every time we call update, we need to change this.now keep time up to date
		this.now = new Date().getTime();

		if(me.input.isKeyPressed("right")) {
			
			//me.timer.tick makes the movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.facing = "right";
			this.flipX(true);
			
		}	
		//if press left play moving left
		else if(me.input.isKeyPressed("left")){
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			// moving right to false
			this.facing = "left";
			this.flipX(false);
		}
		else
		{
			this.body.vel.x = 0;
		}	

		
		//make a new if statement focus on jumping
		    if(me.input.isKeyPressed("jump") && !this.jumping && !this.falling){
		    	this.body.vel.y -= this.body.accel.y * me.timer.tick;
		    	this.body.jumping = true;// allow player to jump
		     }
   

		if(me.input.isKeyPressed("attack")){

			if(!this.renderable.isCurrentAnimation("attack")){
		
				// goes back to idle animation
				this.renderable.setCurrentAnimation("attack", "idle");
				// not wherever we left off when we switch to another animation 
				this.renderable.setAnimationFrame();
			}
		}

	else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){

		if(!this.renderable.isCurrentAnimation("walk")){
			this.renderable.setCurrentAnimation("walk");
		}
	 }
	 else if(!this.renderable.isCurrentAnimation("attack"))
	 {
	 	this.renderable.setCurrentAnimation("idle");
	 }
	  
		//passing the parameter into the collidHandler
		me.collision.check(this, true, this.collideHandler.bind(this), true);

		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;

	},

	collideHandler: function(response){
		//response.a response our player, b whatever we collide with
		if(response.b.type === 'EnemyBaseEntity'){
			//ydif the difference between my player y position and base y position
			var ydif = this.pos.y - response.b.pos.y;
			var xdif = this.pos.x - response.b.pos.x;

			//make player fall on top of the tower
			if(ydif < -40 && xdif < 70 && xdif > -35){
				this.body.falling = false;
				this.body.vel.y = - 1;
			}
			else if(xdif > -30 && this.facing === 'right' && (xdif < 0)){
				this.body.vel.x = 0;// first stop my player from moving 
				this.pos.x = this.pos.x - 1; // then moving him backward
			}
			//make player moves left
			else if(xdif < 70 && this.facing === 'left' && xdif > 0){
				this.body.vel.x = 0;
				this.pos.x = this.pos.x + 1;
			}
			//if we're attacking and we're making contact with the base, lose health
			if(this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= 1000){
				//checking repeatedly
				this.lastHit = this.now;
				response.b.loseHealth();
			}

		 }
	  }	
});

game.PlayerBaseEntity = me.Entity.extend({
		init: function(x, y, settings){
			this._super(me.Entity, 'init', [x, y, {
				image: "tower",
				width: 100,
				height: 100,
				spritewidth: "100",
				spriteheight: "100",

				getShape: function(){
					//lower the number to 70 base not hovering
					return (new me.Rect(0, 0, 100, 70)).toPolygon();
				}
			}])
                    
			this.broken = false;
			this.health = 10;
			this.alwaysUpdate = true;
			this.body.onCollision = this.onCollision.bind(this);

			this.type = "PlayerBaseEntity";

			this.renderable.addAnimation("idle", [0]);
			this.renderable.addAnimation("broken", [1])
			this.renderable.setCurrentAnimation("idle");
		},

		update:function(delta){
			if(this.health <= 0){
				this.broken = true;
				this.renderable.setCurrentAnimation("broken");
			}
			this.body.update(delta);

			this._super(me.Entity, "update", [delta]);
			return true;
		},

		onCollision: function(){

		}
});


game.EnemyBaseEntity = me.Entity.extend({
		init : function(x, y, settings){
			this._super(me.Entity, 'init', [x, y, {
				image: "tower",
				width: 100,
				height: 100,
				spritewidth: "100",
				spriteheight: "100",

				getShape: function(){
					return (new me.Rect(0, 0, 100, 70)).toPolygon();
				}

			}])
			this.broken = false;
			this.health = 10;
			this.alwaysUpdate = true;
			this.body.onCollision = this.onCollision.bind(this);

			this.type = "EnemyBaseEntity";

			this.renderable.addAnimation("idle", [0]);
			this.renderable.addAnimation("broken", [1])
			this.renderable.setCurrentAnimation("idle");


		},

		update:function(delta){
			if(this.health <= 0){
				this.broken = true;
				this.renderable.setCurrentAnimation("broken");
			}
			this.body.update(delta);

			this._super(me.Entity, "update", [delta]);
			return true;
		},

		onCollision: function(){
			
		},

		//attack the base one time to destroy it or kill it		
		loseHealth: function(){
			this.health--;
		}
});


