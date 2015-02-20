game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;

		// loads level 1 in play.js so that it will show up on your screen
		me.levelDirector.loadLevel("level01");

		//loads the plyer so that it will show up when you run it
		var player = me.pool.pull("player", 0, 420, {});
		// adds player to the world
		me.game.world.addChild(player, 5);

		var player = me.pool.pull("Player2", 0, 420, {});
		// adds player to the world
		me.game.world.addChild(player, 5);

		//generates game mangaer in play.js
		var gamemanager = me.pool.pull("GameManager", 0, 0, {});
		//adds game manager into the game/world
		me.game.world.addChild(gamemanager, 0);

		//binds the right key for movement
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		//binds the left key for movement
		me.input.bindKey(me.input.KEY.LEFT, "left");
		// binds the space bar for jumping
		me.input.bindKey(me.input.KEY.SPACE, "jump");
		//binds the attack key for attack
		me.input.bindKey(me.input.KEY.A, "attack");
		



		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
		//plays background music
		me.audio.playTrack("Zelda Main Theme Song");
		
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});
