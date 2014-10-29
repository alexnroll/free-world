var Map = {
	// instance variables
	main_map:    null,
	action_mode: "move",
	players:     {},
	timer:       null,

	// initialization map method
	initialize: function() {
		var options = {
			// zoom
			zoom:      16,
			minZoom:   16,
			maxZoom:   18,
			// position
			center:    new google.maps.LatLng(48.87318, 2.36200),
			// actions
			draggable: false,
			// controls
			panControl:        false,
			scaleControl:      false,
			streetViewControl: false,
			zoomControl:       true
		};
		this.main_map = new google.maps.Map( document.getElementById( MAP_CANVAS_ID ), options );

		var _this = this;

		/*********************************************/
		/*                 listeners                 */
		/*********************************************/
		google.maps.event.addListener(this.main_map, 'click', function( event ) {
			_this._event_click( event );
		});

		return this.main_map;
	},

	set_style: function( style_id ) {
		if( style_id == undefined ) style_id = DEFAULT_STYLE_ID;
		var style = new google.maps.StyledMapType( MAP_STYLES[ style_id ], {name: style_id} );
		this.main_map.mapTypes.set( style_id, style );
		this.main_map.setMapTypeId( style_id );
	},


	/*********************************************/
	/*                  ACTIONS                  */
	/*********************************************/

	add_player: function( player, player_id ) {
		player.marker.setMap( this.main_map );
		this.players[player_id] = player;
	},

	move_player: function( player, from, to )
	{
		// Construct travel request
		var request = {
			origin: from,
			destination: to,
			travelMode: google.maps.TravelMode[ "WALKING" ]
		};
		var _this = this;
		// Request travel route to google api
		this.direction_service().route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {

				// Set direction to main_map
				_this.direction_renderer().setDirections(response);
				_this.route( true );

				// Loop in route segments
				var legs = response.routes[0].legs;
				for( var i = 0; i < legs.length; i++ )
				{
					if (i == 0)
					{
						var pos = 0;
						var steps = legs[i].steps;
						var paths = [];
						for(var y = 0; y < steps.length; y ++)
							paths = paths.concat( steps[y].path );

						// Create timer to move player along steps
						var timer = setInterval(function(){
							player.move( paths[ pos ] );
							_this.main_map.setCenter( paths[pos] );

							if( (pos + 1) == paths.length )
							{
								_this.route( false );
								clearInterval( timer );
							}

							pos ++;
						}, player.speed);
					}
				}
			}
		});
	},


	/*********************************************/
	/*                  EVENTS                   */
	/*********************************************/
	_event_click: function( event )
	{
		this.move_player( this.players['me'], this.players['me'].marker.getPosition(), event.latLng );
	},


	/*********************************************/
	/*                 SERVICES                  */
	/*********************************************/
	direction_service: function(){
		if( this._direction_service == undefined )
			this._direction_service  = new google.maps.DirectionsService();
		return this._direction_service
	},

	direction_renderer: function(){
		if( this._direction_renderer == undefined )
		{
			this._direction_renderer = new google.maps.DirectionsRenderer({
				suppressMarkers: true,
				preserveViewport: true
			});
		}
		return this._direction_renderer;
	},

	route: function( value ) {
		if( value )
			this._direction_renderer.setMap( this.main_map );
		else
			this._direction_renderer.setMap( null );
	},


	/*********************************************/
	/*                 HELPERS                   */
	/*********************************************/
	rad: function(x) {
	  return x * Math.PI / 180;
	},

	getDistance: function(p1, p2) {
	  var R = 6378137;
	  var dLat = this.rad(p2.lat() - p1.lat());
	  var dLong = this.rad(p2.lng() - p1.lng());
	  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	    Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
	    Math.sin(dLong / 2) * Math.sin(dLong / 2);
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	  var d = R * c;
	  return d;
	}
}

map = Object.create( Map );
