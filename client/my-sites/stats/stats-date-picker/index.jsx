import config from '@automattic/calypso-config';
import { localize } from 'i18n-calypso';
import { flowRight, get } from 'lodash';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { withLocalizedMoment } from 'calypso/components/localized-moment';
import {
	getSiteStatsQueryDate,
	isRequestingSiteStatsForQuery,
} from 'calypso/state/stats/lists/selectors';
import { isAutoRefreshAllowedForQuery } from 'calypso/state/stats/lists/utils';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';

import './style.scss';

class StatsDatePicker extends Component {
	static propTypes = {
		date: PropTypes.oneOfType( [ PropTypes.object.isRequired, PropTypes.string.isRequired ] ),
		period: PropTypes.string.isRequired,
		summary: PropTypes.bool,
		query: PropTypes.object,
		statType: PropTypes.string,
		isActivity: PropTypes.bool,
		showQueryDate: PropTypes.bool,
	};

	static defaultProps = {
		showQueryDate: false,
		isActivity: false,
	};

	dateForSummarize() {
		const { query, moment, translate } = this.props;
		const localizedDate = moment();

		switch ( query.num ) {
			case '-1':
				return translate( 'All Time' );

			default:
				return translate( '%(number)s days ending %(endDate)s (Summarized)', {
					context: 'Date range for which stats are being displayed',
					args: {
						// LL is a date localized by momentjs
						number: parseInt( query.num ),
						endDate: localizedDate.format( 'LL' ),
					},
				} );
		}
	}

	dateForDisplay() {
		const { date, moment, period, translate } = this.props;

		// Ensure we have a moment instance here to work with.
		const momentDate = moment.isMoment( date ) ? date : moment( date );
		const localizedDate = moment( momentDate.format( 'YYYY-MM-DD' ) );
		let formattedDate;

		const isNewFeatured = config.isEnabled( 'stats/new-main-chart' );
		// ll is a date localized with abbreviated Month by momentjs
		const weekPeriodFormat = isNewFeatured ? 'll' : 'LL';

		switch ( period ) {
			case 'week':
				formattedDate = translate( '%(startDate)s - %(endDate)s', {
					context: 'Date range for which stats are being displayed',
					args: {
						startDate: localizedDate.startOf( 'week' ).add( 1, 'd' ).format( weekPeriodFormat ),
						endDate: localizedDate.endOf( 'week' ).add( 1, 'd' ).format( weekPeriodFormat ),
					},
				} );
				break;

			case 'month':
				formattedDate = localizedDate.format( 'MMMM YYYY' );
				break;

			case 'year':
				formattedDate = localizedDate.format( 'YYYY' );
				break;

			default:
				// LL is a date localized by momentjs
				formattedDate = localizedDate.format( 'LL' );
		}

		return formattedDate;
	}

	renderQueryDate() {
		const { query, queryDate, moment, translate } = this.props;

		let content;

		if ( ! queryDate || ! isAutoRefreshAllowedForQuery( query ) ) {
			content = null;
		} else {
			const today = moment();
			const date = moment( queryDate );
			const isToday = today.isSame( date, 'day' );

			content = translate( '{{b}}Last update: %(time)s{{/b}} (Updates every 30 minutes)', {
				args: { time: isToday ? date.format( 'LT' ) : date.fromNow() },
				components: {
					b: <span className="stats-date-picker__last-update" />,
				},
			} );
		}

		return (
			<div className="stats-date-picker__refresh-status">
				<span className="stats-date-picker__update-date">{ content }</span>
			</div>
		);
	}

	bindStatusIndicator = ( ref ) => {
		this.statusIndicator = ref;
	};

	render() {
		const isNewFeatured = config.isEnabled( 'stats/new-main-chart' );

		/* eslint-disable wpcalypso/jsx-classname-namespace*/
		const { summary, translate, query, showQueryDate, isActivity } = this.props;
		const isSummarizeQuery = get( query, 'summarize' );

		let sectionTitle = isActivity
			? translate( 'Activity for {{period/}}', {
					components: {
						period: (
							<span className="period">
								<span className="date">
									{ isSummarizeQuery ? this.dateForSummarize() : this.dateForDisplay() }
								</span>
							</span>
						),
					},
					comment: 'Example: "Activity for December 2017"',
			  } )
			: translate( 'Stats for {{period/}}', {
					components: {
						period: (
							<span className="period">
								<span className="date">
									{ isSummarizeQuery ? this.dateForSummarize() : this.dateForDisplay() }
								</span>
							</span>
						),
					},
					context: 'Stats: Main stats page heading',
					comment:
						'Example: "Stats for December 7", "Stats for December 8 - December 14", "Stats for December", "Stats for 2014"',
			  } );

		if ( isNewFeatured ) {
			sectionTitle = (
				<span className="period">
					<span className="date">{ this.dateForDisplay() }</span>
				</span>
			);
		}

		return (
			<div>
				{ summary ? (
					<span>{ sectionTitle }</span>
				) : (
					<div className="stats-section-title">
						<h3>{ sectionTitle }</h3>
						{ showQueryDate && this.renderQueryDate() }
					</div>
				) }
			</div>
		);
	}
}

const connectComponent = connect( ( state, { query, statsType, showQueryDate } ) => {
	const siteId = getSelectedSiteId( state );
	return {
		queryDate: showQueryDate ? getSiteStatsQueryDate( state, siteId, statsType, query ) : null,
		requesting: showQueryDate
			? isRequestingSiteStatsForQuery( state, siteId, statsType, query )
			: false,
	};
} );

export default flowRight( connectComponent, localize, withLocalizedMoment )( StatsDatePicker );
