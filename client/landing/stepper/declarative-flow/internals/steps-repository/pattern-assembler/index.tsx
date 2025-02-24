import { StepContainer } from '@automattic/onboarding';
import { useDispatch, useSelect } from '@wordpress/data';
import { useTranslate } from 'i18n-calypso';
import { useState, useRef, useEffect } from 'react';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { recordTracksEvent } from 'calypso/lib/analytics/tracks';
import { requestActiveTheme } from 'calypso/state/themes/actions';
import { useSite } from '../../../../hooks/use-site';
import { useSiteIdParam } from '../../../../hooks/use-site-id-param';
import { useSiteSlugParam } from '../../../../hooks/use-site-slug-param';
import { SITE_STORE, ONBOARD_STORE } from '../../../../stores';
import PatternAssemblerPreview from './pattern-assembler-preview';
import PatternLayout from './pattern-layout';
import PatternSelectorLoader from './pattern-selector-loader';
import { encodePatternId, createCustomHomeTemplateContent } from './utils';
import type { Step } from '../../types';
import type { Pattern } from './types';
import type { DesignRecipe, Design } from '@automattic/design-picker/src/types';
import './style.scss';

const PatternAssembler: Step = ( { navigation } ) => {
	const translate = useTranslate();
	const [ showPatternSelectorType, setShowPatternSelectorType ] = useState< string | null >( null );
	const [ header, setHeader ] = useState< Pattern | null >( null );
	const [ footer, setFooter ] = useState< Pattern | null >( null );
	const [ sections, setSections ] = useState< Pattern[] >( [] );
	const [ sectionPosition, setSectionPosition ] = useState< number | null >( null );
	const incrementIndexRef = useRef( 0 );
	const [ scrollToSelector, setScrollToSelector ] = useState< string | null >( null );
	const { goBack, goNext, submit, goToStep } = navigation;
	const { setThemeOnSite, runThemeSetupOnSite, createCustomTemplate } = useDispatch( SITE_STORE );
	const reduxDispatch = useReduxDispatch();
	const { setPendingAction } = useDispatch( ONBOARD_STORE );
	const selectedDesign = useSelect( ( select ) => select( ONBOARD_STORE ).getSelectedDesign() );
	const site = useSite();
	const siteSlug = useSiteSlugParam();
	const siteId = useSiteIdParam();
	const siteSlugOrId = siteSlug ? siteSlug : siteId;

	useEffect( () => {
		// Require to start the flow from the first step
		if ( ! selectedDesign ) {
			goToStep?.( 'goals' );
		}
	}, [] );

	const getPatterns = () =>
		[ header, ...sections, footer ].filter( ( pattern ) => pattern ) as Pattern[];

	const trackEventPatternAdd = ( patternType: string ) => {
		recordTracksEvent( 'calypso_signup_bcpa_pattern_add_click', {
			pattern_type: patternType,
		} );
	};

	const trackEventPatternSelect = ( {
		patternType,
		patternId,
	}: {
		patternType: string;
		patternId: number;
	} ) => {
		recordTracksEvent( 'calypso_signup_bcpa_pattern_select_click', {
			pattern_type: patternType,
			pattern_id: patternId,
		} );
	};

	const trackEventContinue = () => {
		const patterns = getPatterns();
		recordTracksEvent( 'calypso_signup_bcpa_continue_click', {
			pattern_ids: patterns.map( ( { id } ) => id ).join( ',' ),
			pattern_names: patterns.map( ( { name } ) => name ).join( ',' ),
			pattern_count: patterns.length,
		} );
		patterns.forEach( ( { id, name } ) => {
			recordTracksEvent( 'calypso_signup_bcpa_pattern_final_select', {
				pattern_id: id,
				pattern_name: name,
			} );
		} );
	};

	const getDesign = () =>
		( {
			...selectedDesign,
			recipe: {
				...selectedDesign?.recipe,
				header_pattern_ids: header ? [ encodePatternId( header.id ) ] : undefined,
				pattern_ids: sections.filter( Boolean ).map( ( pattern ) => encodePatternId( pattern.id ) ),
				footer_pattern_ids: footer ? [ encodePatternId( footer.id ) ] : undefined,
			} as DesignRecipe,
		} as Design );

	const setScrollToSelectorByPosition = ( position: number ) => {
		const patternPosition = header ? position + 1 : position;
		setScrollToSelector(
			`.wp-site-blocks > .wp-block-group > :nth-child( ${ patternPosition + 1 } )`
		);
	};

	const addSection = ( pattern: Pattern ) => {
		incrementIndexRef.current++;
		if ( sectionPosition !== null ) {
			setSections( [
				...sections.slice( 0, sectionPosition ),
				{
					...pattern,
					key: sections[ sectionPosition ].key,
				},
				...sections.slice( sectionPosition + 1 ),
			] );
			setScrollToSelectorByPosition( sectionPosition );
		} else {
			setSections( [
				...( sections as Pattern[] ),
				{
					...pattern,
					key: `${ incrementIndexRef.current }-${ pattern.id }`,
				},
			] );
			setScrollToSelectorByPosition( sections.length );
		}
	};

	const deleteSection = ( position: number ) => {
		setSections( [ ...sections.slice( 0, position ), ...sections.slice( position + 1 ) ] );
	};

	const moveDownSection = ( position: number ) => {
		const section = sections[ position ];
		setSections( [
			...sections.slice( 0, position ),
			...sections.slice( position + 1, position + 2 ),
			section,
			...sections.slice( position + 2 ),
		] );
	};

	const moveUpSection = ( position: number ) => {
		const section = sections[ position ];
		setSections( [
			...sections.slice( 0, position - 1 ),
			section,
			...sections.slice( position - 1, position ),
			...sections.slice( position + 1 ),
		] );
	};

	const onSelect = ( pattern: Pattern | null ) => {
		if ( pattern ) {
			if ( 'header' === showPatternSelectorType ) {
				setHeader( pattern );
			}
			if ( 'footer' === showPatternSelectorType ) {
				setFooter( pattern );
			}
			if ( 'section' === showPatternSelectorType ) {
				addSection( pattern );
			}

			if ( showPatternSelectorType ) {
				trackEventPatternSelect( {
					patternType: showPatternSelectorType,
					patternId: pattern.id,
				} );
			}
		}
		setShowPatternSelectorType( null );
	};

	const onBack = () => {
		const patterns = getPatterns();
		recordTracksEvent( 'calypso_signup_bcpa_back_click', {
			has_selected_patterns: patterns.length > 0,
			pattern_count: patterns.length,
		} );

		goBack?.();
	};

	const getSelectedPattern = () => {
		if ( 'header' === showPatternSelectorType ) {
			return header;
		}
		if ( 'footer' === showPatternSelectorType ) {
			return footer;
		}
		if ( 'section' === showPatternSelectorType && sectionPosition !== null ) {
			return sections[ sectionPosition ];
		}

		return null;
	};

	const stepContent = (
		<div className="pattern-assembler__wrapper">
			<div className="pattern-assembler__sidebar">
				<PatternSelectorLoader
					showPatternSelectorType={ showPatternSelectorType }
					onSelect={ onSelect }
					onBack={ () => setShowPatternSelectorType( null ) }
					selectedPattern={ getSelectedPattern() }
				/>
				{ ! showPatternSelectorType && (
					<PatternLayout
						header={ header }
						sections={ sections }
						footer={ footer }
						onAddHeader={ () => {
							trackEventPatternAdd( 'header' );
							setShowPatternSelectorType( 'header' );
						} }
						onReplaceHeader={ () => {
							setShowPatternSelectorType( 'header' );
							setScrollToSelector( null );
						} }
						onDeleteHeader={ () => {
							setHeader( null );
							setScrollToSelector( null );
						} }
						onAddSection={ () => {
							trackEventPatternAdd( 'section' );
							setSectionPosition( null );
							setShowPatternSelectorType( 'section' );
							setScrollToSelectorByPosition( sections.length );
						} }
						onReplaceSection={ ( position: number ) => {
							setSectionPosition( position );
							setShowPatternSelectorType( 'section' );
						} }
						onDeleteSection={ ( position: number ) => {
							deleteSection( position );
							setScrollToSelectorByPosition( position - 1 );
						} }
						onMoveUpSection={ ( position: number ) => {
							moveUpSection( position );
							setScrollToSelectorByPosition( position - 1 );
						} }
						onMoveDownSection={ ( position: number ) => {
							moveDownSection( position );
							setScrollToSelectorByPosition( position + 1 );
						} }
						onAddFooter={ () => {
							trackEventPatternAdd( 'footer' );
							setShowPatternSelectorType( 'footer' );
							setScrollToSelectorByPosition( sections.length );
						} }
						onReplaceFooter={ () => {
							setShowPatternSelectorType( 'footer' );
							setScrollToSelectorByPosition( sections.length );
						} }
						onDeleteFooter={ () => {
							setFooter( null );
							setScrollToSelector( null );
						} }
						onContinueClick={ () => {
							if ( siteSlugOrId ) {
								const design = getDesign();
								const stylesheet = design.recipe!.stylesheet!;
								const theme = stylesheet?.split( '/' )[ 1 ] || design.theme;

								setPendingAction( () =>
									// We have to switch theme first. Otherwise, the unique suffix might append to
									// the slug of newly created Home template if the current activated theme has
									// modified Home template.
									setThemeOnSite( siteSlugOrId, theme, undefined, false )
										.then( () =>
											createCustomTemplate(
												siteSlugOrId,
												stylesheet,
												'home',
												translate( 'Home' ),
												createCustomHomeTemplateContent( stylesheet, !! header, !! footer )
											)
										)
										.then( () => runThemeSetupOnSite( siteSlugOrId, design ) )
										.then( () => reduxDispatch( requestActiveTheme( site?.ID || -1 ) ) )
								);

								trackEventContinue();

								submit?.();
							}
						} }
					/>
				) }
			</div>
			<PatternAssemblerPreview
				header={ header }
				sections={ sections }
				footer={ footer }
				scrollToSelector={ scrollToSelector }
			/>
		</div>
	);

	return (
		<StepContainer
			stepName="pattern-assembler"
			hideBack={ showPatternSelectorType !== null }
			goBack={ onBack }
			goNext={ goNext }
			isHorizontalLayout={ false }
			isFullLayout={ true }
			hideSkip={ true }
			stepContent={ stepContent }
			recordTracksEvent={ recordTracksEvent }
			stepSectionName={ showPatternSelectorType ? 'pattern-selector' : undefined }
		/>
	);
};

export default PatternAssembler;
