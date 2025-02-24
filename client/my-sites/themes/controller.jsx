import debugFactory from 'debug';
import { logServerEvent } from 'calypso/lib/analytics/statsd-utils';
import trackScrollPage from 'calypso/lib/track-scroll-page';
import performanceMark from 'calypso/server/lib/performance-mark';
import { requestThemes, requestThemeFilters } from 'calypso/state/themes/actions';
import { DEFAULT_THEME_QUERY } from 'calypso/state/themes/constants';
import { getThemeFilters, getThemesForQuery } from 'calypso/state/themes/selectors';
import { getAnalyticsData } from './helpers';
import LoggedOutComponent from './logged-out';

const debug = debugFactory( 'calypso:themes' );

export function getProps( context ) {
	const { tier, filter, vertical } = context.params;

	const { analyticsPath, analyticsPageTitle } = getAnalyticsData( context.path, context.params );

	const boundTrackScrollPage = function () {
		trackScrollPage( analyticsPath, analyticsPageTitle, 'Themes' );
	};

	return {
		tier,
		filter,
		vertical,
		analyticsPageTitle,
		analyticsPath,
		search: context.query.s,
		pathName: context.pathname,
		trackScrollPage: boundTrackScrollPage,
	};
}

export function loggedOut( context, next ) {
	performanceMark( context, 'themesLoggedOut' );
	if ( context.isServerSide && Object.keys( context.query ).length > 0 ) {
		// Don't server-render URLs with query params
		return next();
	}

	const props = getProps( context );

	context.primary = <LoggedOutComponent { ...props } />;
	next();
}

export function fetchThemeData( context, next ) {
	if ( ! context.isServerSide || context.cachedMarkup ) {
		debug( 'Skipping theme data fetch' );
		return next();
	}
	performanceMark( context, 'fetchThemeData' );

	const siteId = 'wpcom';
	const query = {
		search: context.query.s,
		tier: context.params.tier,
		filter: [ context.params.filter, context.params.vertical ].filter( Boolean ).join( ',' ),
		page: 1,
		number: DEFAULT_THEME_QUERY.number,
	};

	const themes = getThemesForQuery( context.store.getState(), siteId, query );

	logServerEvent( 'themes', {
		name: `ssr.get_themes_fetch_cache.${ themes ? 'hit' : 'miss' }`,
		type: 'counting',
	} );

	if ( themes ) {
		debug( 'found theme data in cache' );
		return next();
	}

	context.store.dispatch( requestThemes( siteId, query, context.lang ) ).then( next ).catch( next );
}

export function fetchThemeFilters( context, next ) {
	if ( context.cachedMarkup ) {
		debug( 'Skipping theme filter data fetch' );
		return next();
	}
	performanceMark( context, 'fetchThemeFilters' );

	const { store } = context;
	const hasFilters = Object.keys( getThemeFilters( store.getState() ) ).length > 0;

	logServerEvent( 'themes', {
		name: `ssr.get_theme_filters_fetch_cache.${ hasFilters ? 'hit' : 'miss' }`,
		type: 'counting',
	} );

	if ( hasFilters ) {
		debug( 'found theme filters in cache' );
		return next();
	}

	const unsubscribe = store.subscribe( () => {
		if ( Object.keys( getThemeFilters( store.getState() ) ).length > 0 ) {
			unsubscribe();
			return next();
		}
	} );
	store.dispatch( requestThemeFilters( context.lang ) );
}

// Legacy (Atlas-based Theme Showcase v4) route redirects

export function redirectSearchAndType( { res, params: { site, search, tier } } ) {
	const target = '/themes/' + [ tier, site ].filter( Boolean ).join( '/' ); // tier before site!
	if ( search ) {
		res.redirect( `${ target }?s=${ search }` );
	} else {
		res.redirect( target );
	}
}

export function redirectFilterAndType( { res, params: { site, filter, tier } } ) {
	let parts;
	if ( filter ) {
		parts = [ tier, 'filter', filter, site ];
	} else {
		parts = [ tier, site ];
	}
	res.redirect( '/themes/' + parts.filter( Boolean ).join( '/' ) );
}

export function redirectToThemeDetails( { res, params: { site, theme, section } }, next ) {
	// Make sure we aren't matching a site -- e.g. /themes/example.wordpress.com or /themes/1234567
	if ( theme.includes( '.' ) || Number.isInteger( parseInt( theme, 10 ) ) ) {
		return next();
	}
	let redirectedSection;
	if ( section === 'support' ) {
		redirectedSection = 'setup';
	}
	res.redirect( '/theme/' + [ theme, redirectedSection, site ].filter( Boolean ).join( '/' ) );
}
