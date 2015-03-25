//Game Manager is an object not the same as player entity
game.GameTimerManager = Object.extend({
	init: function(x, y, settings){
		this.now = new Date().getTime();
		this.lastCreep = new Date().getTime();
                //pause our game or pause screen
                this.pause = false;

		this.alwaysUpdate = true;

	},

	update: function(){
		this.now = new Date().getTime(); 
                
                this.goldTimerCheck();    
                this.creepTimerCheck();  
        },
                
 //**********goldTimerCheck****************************************************
 
    goldTimerCheck: function(){
        //creep timer, get gold every other kill creep
         if(Math.round(this.now/1000) % 20 === 0 && (this.now - this.lastCreep >= 1000)){
         //add a gold every time we kill a creep
         game.data.gold += 1;
         console.log("Current gold: " + game.data.gold);
         }
    },
    
    creepTimerCheck: function(){
        if(Math.round(this.now/1000) % 10 === 0 && (this.now - this.lastCreep >= 1000)){
	this.lastCreep = this.now;
	var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
	me.game.world.addChild(creepe, 5);
	}
        return true;
    },           
});

game.HeroDeathManager = Object.extend({
   init: function(x, y, settings){
       this.alwaysUpdate = true;
   },
    
    update: function(){
       //check to see if the player is dead
       if(game.data.player.dead){
          //every you die you'll start at the top left of the screen  
          me.game.world.removeChild(game.data.player);
          //change the x to 10 and y to 0 after resetting
          //using the play.js(current state) and looking for the resetPlayer function
          me.state.current().resetPlayer(10, 0);
       }     
       return true;
    }   
 });
 
 game.ExperienceManager = Object.extend({
     init: function(x, y, settings){
        this.alwaysUpdate = true; 
        this.gameover = false;
     },
     
     update: function(){
         if(game.data.win === true && !this.gameover){
             this.gameOver(true);
         }
         else if(game.data.win === false && !this.gameover){
             this.gameOver(false);
         }    
         //console.log("experience" + game.data.exp);
                 
         return true;
      },
      
 //***********gameOver refactoring********************************************
 
    gameOver: function(win){
        if(win){
            game.data.exp += 10;
        }
        else{
            game.data.exp += 1;
        }
        this.gameover = true;
        me.save.exp = game.data.exp;
        //testing purpose only
        me.save.exp = 4;
    }      
 });




































