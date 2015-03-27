game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;


		//tell what to look at in terms of maps(level01)
		me.levelDirector.loadLevel("level01");

		// build our play by pulling it from the pool
		var player = me.pool.pull("player", 0, 420, {});
		
		// add player to the world
		me.game.world.addChild(player, 5);


		me.input.bindKey(me.input.KEY.RIGHT, "right");
		//press a to attack

		me.input.bindKey(me.input.KEY.LEFT, "left");
		//make the play go left and jump
		me.input.bindKey(me.input.KEY.UP, "jump");

		me.input.bindKey(me.input.KEY.A, "attack");


		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});

