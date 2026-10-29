// ceasul din hero - arata ora din Iasi si daca sala e deschisa acum
( function () {
	'use strict';

	var ceasuri = document.querySelectorAll( '.fg-ceas' );
	if ( ! ceasuri.length || ! window.Intl ) {
		return;
	}

	// [deschide, inchide] in minute de la 00:00, index 0 = duminica
	var program = [
		[ 480, 1260 ], // dum 08-21
		[ 360, 1380 ], // lun 06-23
		[ 360, 1380 ],
		[ 360, 1380 ],
		[ 360, 1380 ],
		[ 360, 1380 ], // vin
		[ 480, 1260 ]  // sam 08-21
	];
	var zile = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

	// ora din Iasi, nu cea de pe calculatorul vizitatorului
	var format = new Intl.DateTimeFormat( 'en-US', {
		timeZone: 'Europe/Bucharest',
		weekday: 'short',
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23'
	} );

	function doua( n ) {
		return ( n < 10 ? '0' : '' ) + n;
	}

	function ora( minute ) {
		return doua( Math.floor( minute / 60 ) ) + ':' + doua( minute % 60 );
	}

	function acum() {
		var parti = {};
		format.formatToParts( new Date() ).forEach( function ( p ) {
			parti[ p.type ] = p.value;
		} );
		return {
			zi: zile[ parti.weekday ],
			ora: parseInt( parti.hour, 10 ) % 24, // unele browsere dau 24 in loc de 00
			minut: parseInt( parti.minute, 10 )
		};
	}

	function actualizeaza() {
		var t = acum();
		var minute = t.ora * 60 + t.minut;
		var azi = program[ t.zi ];
		var deschis = minute >= azi[ 0 ] && minute < azi[ 1 ];
		var stare = deschis ? 'Deschis acum' : 'Închis acum';
		var detalii;

		if ( deschis ) {
			detalii = 'Închidem la ' + ora( azi[ 1 ] );
		} else if ( minute < azi[ 0 ] ) {
			detalii = 'Deschidem azi la ' + ora( azi[ 0 ] );
		} else {
			detalii = 'Deschidem mâine la ' + ora( program[ ( t.zi + 1 ) % 7 ][ 0 ] );
		}

		ceasuri.forEach( function ( ceas ) {
			var cifre = ceas.querySelector( '.fg-ceas__ora' );
			var text = ceas.querySelector( '.fg-ceas__stare' );

			if ( cifre ) {
				cifre.innerHTML = doua( t.ora ) + '<span class="fg-ceas__puncte">:</span>' + doua( t.minut );
				cifre.setAttribute( 'aria-label', 'Ora în Iași: ' + doua( t.ora ) + ':' + doua( t.minut ) );
			}
			if ( text ) {
				text.innerHTML = '<strong>' + stare + '</strong><br>' + detalii;
			}
			ceas.classList.toggle( 'is-deschis', deschis );
			ceas.classList.toggle( 'is-inchis', ! deschis );
		} );
	}

	actualizeaza();
	setInterval( actualizeaza, 10000 ); // 10 sec e destul
	// console.log( 'ceas ok' );
} )();
