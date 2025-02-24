import wpcom from 'calypso/lib/wp';
import { getCurrentUser, getCurrentUserLocale } from 'calypso/state/current-user/selectors';
import getGroups from 'calypso/state/happychat/selectors/get-groups';
import getSkills from 'calypso/state/happychat/selectors/get-skills';
import { getHelpSelectedSite } from 'calypso/state/help/selectors';

const sign = ( payload ) => wpcom.req.post( '/jwt/sign', { payload: JSON.stringify( payload ) } );

const startSession = () => wpcom.req.post( '/happychat/session' );

export const getHappychatAuth = ( state ) => () => {
	const locale = getCurrentUserLocale( state );

	let groups = getGroups( state );
	let skills = getSkills( state );
	const selectedSite = getHelpSelectedSite( state );

	if ( selectedSite && selectedSite.ID ) {
		groups = getGroups( state, selectedSite.ID );
		skills = getSkills( state, selectedSite.ID );
	}

	const user = getCurrentUser( state );

	if ( ! user ) {
		return Promise.reject(
			'Failed to start an authenticated Happychat session: No current user found'
		);
	}

	const happychatUser = {
		signer_user_id: user.ID,
		locale,
		groups,
		skills,
	};

	return startSession()
		.then( ( { url, session_id, geo_location } ) => {
			happychatUser.geoLocation = geo_location;
			return sign( { user, session_id } ).then( ( signResponse ) => {
				return { url, ...signResponse };
			} );
		} )
		.then( ( { url, jwt } ) => ( { url, user: { jwt, ...happychatUser } } ) )
		.catch( ( e ) => Promise.reject( 'Failed to start an authenticated Happychat session: ' + e ) );
};
