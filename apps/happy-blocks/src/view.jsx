// Placeholder for view only assets
import './view.scss';
import { render } from '@wordpress/element';
import ViewPricingPlans from './pricing-plans/view';
import { updateForumTopicDate } from './support-content/view';

function renderPricingPlansBlock( el ) {
	const attributes = JSON.parse( el.dataset.attributes ?? '{}' );

	render( <ViewPricingPlans attributes={ attributes } />, el );
}

document.addEventListener( 'DOMContentLoaded', () => {
	document
		.querySelectorAll( '.a8c-happy-tools-pricing-plans-block-placeholder' )
		.forEach( renderPricingPlansBlock );
	document.querySelectorAll( '.wp-block-happy-blocks-forum-topic' ).forEach( updateForumTopicDate );
} );
