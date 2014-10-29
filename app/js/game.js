/* *******************************
	Bootstrap script for game
	. Initialize variables
	. Load scripts
	. Kickstart game

 ******************************* */

function load_script( src )
{
	var script  = document.createElement('script');
	script.type = 'text/javascript';
	script.src  = src;
	document.body.appendChild(script);
}

// google map
load_script( 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=' + MAP_INITIALIZE_METHOD );
// map styles
load_script( '../js/maps/styles.js' );
// maps functions
load_script( '../js/maps.js' );
load_script( '../js/player.js' );

// initialize Map instance
function initialize_map() {
	map.initialize();
	map.set_style();

	var me = Object.create( Player );
	var me_pos = new google.maps.LatLng(48.87318, 2.36200);
	me.initialize( me_pos );
	map.add_player( me, "me" );
}
