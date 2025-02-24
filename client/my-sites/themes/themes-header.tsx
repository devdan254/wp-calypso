import { translate } from 'i18n-calypso';
import FormattedHeader from 'calypso/components/formatted-header';
import InlineSupportLink from 'calypso/components/inline-support-link';
import ScreenOptionsTab from 'calypso/components/screen-options-tab';
import InstallThemeButton from './install-theme-button';

import './themes-header.scss';

interface ThemesHeaderProps {
	isReskinned?: boolean;
}

const ThemesHeader: React.FC< ThemesHeaderProps > = ( { isReskinned } ) => {
	return (
		<div className="themes__header">
			<ScreenOptionsTab wpAdminPath="themes.php" />
			{ isReskinned ? (
				<div className="themes__page-heading">
					<h1>{ translate( 'Themes' ) }</h1>
					<p className="page-sub-header">
						{ translate(
							'Select or update the visual design for your site. {{learnMoreLink}}Learn more{{/learnMoreLink}}.',
							{
								components: {
									learnMoreLink: <InlineSupportLink supportContext="themes" showIcon={ false } />,
								},
							}
						) }
					</p>
				</div>
			) : (
				<FormattedHeader
					brandFont
					className="themes__page-heading"
					headerText={ translate( 'Themes' ) }
					subHeaderText={ translate(
						'Select or update the visual design for your site. {{learnMoreLink}}Learn more{{/learnMoreLink}}.',
						{
							components: {
								learnMoreLink: <InlineSupportLink supportContext="themes" showIcon={ false } />,
							},
						}
					) }
					align="left"
					hasScreenOptions
				/>
			) }
			<div className="themes__install-theme-button-container">
				<InstallThemeButton />
			</div>
		</div>
	);
};

export default ThemesHeader;
