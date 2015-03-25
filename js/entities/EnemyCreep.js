game.EnemyCreep = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
        image: "creep1",
        width: 32,
        height: 64,
        spritewidth: "32",
        spriteheight: "64",
        
        getShape: function(){
            return (new me.Rect(0, 0, 32, 64)).toPolygon();
        }
        
     }]);
       
        this.health = game.data.enemyCreepHealth;
        this.alwaysUpdate = true;
        
        //this.attacking let us know if the enemy is currently attacking
	this.attacking = false;

	//keep track of when the creep last attack anything
	this.lastAttacking = new Date().getTime();
	//keep track of last time our creep hit anything
	this.lastHit = new Date().getTime();

	this.now = new Date().getTime();        
        
        this.body.setVelocity(game.data.creepMoveSpeed, 20);
        this.type = "EnemyCreep";
        
        this.renderable.addAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");     
    },
    
    loseHealth: function(damage){
	this.health = this.health - damage;
    },
    
    update: function(delta){
        
	if(this.health <= 0){
	//if the creep less than 0 than remove/kill the creep
	me.game.world.removeChild(this);
      }
        //refresh every time
        this.now = new Date().getTime();
        
        //enable the creep to move to the left
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        
        //check for collision, if true activate collideHandler function
	me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        // creep fall to the ground
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    collideHandler: function(response)
	{
	//whatever the creep is running to
	if(response.b.type === 'PlayerBase'){
            //set attacking mode
            this.attacking = true;
	    //set timer when was the lasttime we're attacking
	    this.lastAttacking = this.now;

	    this.body.vel.x = 0;
	    //keep moving the creep to the right to maintain its position
	    this.pos.x = this.pos.x + 1;
	    //check that it has been at least 1 second since the creep
            //hit the base
	    if (this.now - this.lastHit >= game.data.enemyCreepAttackTimer) {
	    //update the lastHit timer
	    this.lastHit = this.now;
	    //make the player base call its loseHealth function
            // and passes it a damage of 1
	    response.b.loseHealth(game.data.enemyCreepAttack);
	   }
	}
        else if(response.b.type === 'PlayerEntity'){
            //response.b is the player
            //difference position of the creep and pos of player
            var xdif = this.pos.x - response.b.pos.x;
             //set attacking mode
            this.attacking = true;
	    //set timer when was the lasttime we're attacking
	    this.lastAttacking = this.now;

	    if (xdif > 0) {
	    //keep moving the creep to the right to maintain its position
	    this.pos.x = this.pos.x + 1;
	    this.body.vel.x = 0;
	    }     
            
	    //check another time
	    if (this.now - this.lastHit >= game.data.enemyCreepAttackTimer && xdif > 0) {
	    //if it's been more than a second, then attack again
	    this.lastHit = this.now;
	    //call the function to make our player lose some health
	    response.b.loseHealth(game.data.enemyCreepAttack);
	   }
        }
    }    
});
        


