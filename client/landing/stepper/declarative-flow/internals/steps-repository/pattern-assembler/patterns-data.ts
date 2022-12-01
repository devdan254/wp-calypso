import { translate } from 'i18n-calypso';
import type { Pattern } from './types';

const header = translate( 'Header' );
const footer = translate( 'Footer' );
const callToAction = translate( 'Call to action' );
const images = translate( 'Images' );
const list = translate( 'List' );
const numbers = translate( 'Numbers' );
const about = translate( 'About' );
const testimonials = translate( 'Testimonials' );
const links = translate( 'Links' );

// All headers in dotcompatterns
const headerPatterns: Pattern[] = [
	{
		id: 5579,
		name: 'Centered header',
		category: header,
	},
	/*
	Discarded because there is a menu option named Blog
	and for now the blogger flow is not supported
	{
		id: 5608,
		name: 'Centered header with logo and navigation',
		category: header,
	},
	*/
	{
		id: 5582,
		name: 'Simple Header',
		category: header,
	},
	{
		id: 5588,
		name: 'Header with site title and vertical navigation',
		category: header,
	},
	{
		id: 5590,
		name: 'Simple header with image background',
		category: header,
	},
	{
		id: 5593,
		name: 'Simple header with dark background',
		category: header,
	},
	{
		id: 5595,
		name: 'Simple header with image',
		category: header,
	},
	{
		id: 5601,
		name: 'Simple header with tagline',
		category: header,
	},
	{
		id: 5603,
		name: 'Header with site title and menu button',
		category: header,
	},
	{
		id: 5605,
		name: 'Simple header with image',
		category: header,
	},
	{
		id: 7914,
		name: 'Header with button',
		category: header,
	},
];

// All footers in dotcompatterns
// Missing footers in dotcomfsepatterns
const footerPatterns: Pattern[] = [
	{
		id: 5316,
		name: 'Footer with social icons, address, e-mail, and telephone number',
		category: footer,
	},
	{
		id: 5886,
		name: 'Footer with large font size',
		category: footer,
	},
	{
		id: 5883,
		name: 'Footer with credit line and navigation',
		category: footer,
	},
	{
		id: 5888,
		name: 'Footer with navigation and credit line',
		category: footer,
	},
	{
		id: 5877,
		name: 'Centered footer with social links',
		category: footer,
	},
	{
		id: 5873,
		name: 'Simple centered footer',
		category: footer,
	},
	{
		id: 7917,
		name: 'Footer with address, email address, and social links',
		category: footer,
	},
	{
		id: 7485,
		name: 'Footer with newsletter subscription form',
		category: footer,
	},
	{
		id: 1622,
		name: 'Footer with paragraph and links',
		category: footer,
	},
	{
		id: 5047,
		name: 'Footer with navigation, contact details, social links, and subscription form',
		category: footer,
	},
	{
		id: 5880,
		name: 'Footer with background color and three columns',
		category: footer,
	},
];

const sectionPatterns: Pattern[] = [
	{
		id: 7156,
		name: 'Media and text with image on the right',
		category: callToAction,
	},
	{
		id: 7153,
		name: 'Media and text with image on the left',
		category: callToAction,
	},
	{
		id: 7146,
		name: 'Four column list',
		category: callToAction,
	},
	{
		id: 7132,
		name: 'Cover image with left-aligned call to action',
		category: callToAction,
	},
	{
		id: 7159,
		name: 'Cover image with centered text and a button',
		category: callToAction,
	},
	{
		id: 7149,
		name: 'Two column image grid',
		category: images,
	},
	{
		id: 5691,
		name: 'Three logos, heading, and paragraphs',
		category: images,
	},
	{
		id: 7143,
		name: 'Full-width image',
		category: images,
	},
	{
		id: 737,
		name: 'Logos',
		category: images,
	},
	{
		id: 1585,
		name: 'Quote and logos',
		category: images,
	},
	{
		id: 7135,
		name: 'Three columns with images and text',
		category: list,
	},
	{
		id: 789,
		name: 'Numbered List',
		category: list,
	},
	{
		id: 6712,
		name: 'List of events',
		category: list,
	},
	{
		id: 5666,
		name: 'Large numbers, heading, and paragraphs',
		category: numbers,
	},
	{
		id: 462,
		name: 'Numbers',
		category: numbers,
	},
	{
		id: 5663,
		name: 'Large headline',
		category: about,
	},
	{
		id: 7140,
		name: 'Left-aligned headline',
		category: about,
	},
	{
		id: 7138,
		name: 'Centered headline and text',
		category: about,
	},
	{
		id: 7161,
		name: 'Two testimonials side by side',
		category: testimonials,
	},
	{
		id: 1600,
		name: 'Three column text and links',
		category: links,
	},
];

export { headerPatterns, footerPatterns, sectionPatterns };
