var Player = {
	marker: null,
	timer:  null,
	speed:  500,

	initialize: function( position, style_id ) {
		if( style_id == undefined ) style_id = DEFAULT_PLAYER_ID;

		this.marker = new google.maps.Marker({
			position: position,
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 2,
				fillColor: '#248EFF',
				strokeColor: '#248EFF',
				strokeWeight: 4
			}
		});
	},

	move: function( path ) {
		this.marker.setPosition( path );
	},

	stop: function() {
		clearInterval( this.timer );
	}

}
