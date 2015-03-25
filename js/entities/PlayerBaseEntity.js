game.PlayerBaseEntity = me.Entity.extend({
    init : function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
             image: "tower",
             width: 100,
             height: 100,
             spritewidth: "100",
             spriteheight: "100",
             
             getShape: function(){
                 //lower to make the base to 70
                 return (new me.Rect(0, 0, 100, 70)).toPolygon();
             }
        }]);
        this.broken = false;
        this.health = game.data.playerBaseHealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        
        this.type = "PlayerBase";
        //not burning animation
        this.renderable.addAnimation("idle", [0]);
        //broken tower
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
        
    },
    // check to see if the tower is broken
    update:function(delta){
        if(this.health <= 0){
            this.broken = true;
            game.data.win = false;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    //loseHealth function
    loseHealth: function(damage){
	//make our base lose a little of health everytime it's being attacked
	this.health = this.health - damage;

    },
    
    onCollision: function(){
        
    }
});


