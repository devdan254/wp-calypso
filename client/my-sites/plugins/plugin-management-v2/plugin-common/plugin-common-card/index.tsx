import { Gridicon, Card, Button } from '@automattic/components';
import classNames from 'classnames';
import FormInputCheckbox from 'calypso/components/forms/form-checkbox';
import type { Columns, RowFormatterArgs } from '../../types';
import type { SiteDetails } from '@automattic/data-stores';
import type { ReactElement, ReactNode } from 'react';

import './style.scss';

interface Props {
	item: any;
	selectedSite: SiteDetails;
	rowFormatter: ( args: RowFormatterArgs ) => ReactNode;
	columns: Columns;
	hasMoreActions: boolean;
}

export default function PluginCommonCard( {
	item,
	selectedSite,
	rowFormatter,
	columns,
	hasMoreActions,
}: Props ): ReactElement {
	const columnKeys: { [ key: string ]: boolean } = columns.reduce(
		( obj, cur ) => ( { ...obj, [ cur.key ]: true } ),
		{}
	);

	const showLeftContent = columnKeys[ 'plugin' ];

	return (
		<Card className="plugin-common-card__card" compact>
			<div className="plugin-common-card__columns">
				{ showLeftContent && (
					<>
						<div className="plugin-common-card__left-checkbox">
							{ item?.isSelectable && (
								<FormInputCheckbox
									className="plugin-row-formatter__checkbox"
									id={ item.slug }
									onClick={ item.onClick }
									checked={ item.isSelected }
									readOnly={ true }
								/>
							) }
						</div>
						<div className="plugin-common-card__left-content">
							{ item.icon ? (
								<img
									className="plugin-common-card__plugin-icon"
									src={ item.icon }
									alt={ item.name }
								/>
							) : (
								<Gridicon className="plugin-common-card__plugin-icon has-opacity" icon="plugins" />
							) }
						</div>
					</>
				) }
				<div
					className={ classNames( 'plugin-common-card__main-content', {
						'no-padding': ! showLeftContent,
					} ) }
				>
					{ columnKeys[ 'plugin' ] && (
						<div>
							{ rowFormatter( { columnKey: 'plugin', item, isSmallScreen: true } ) }
							<span className="plugin-common-card__overlay"></span>
						</div>
					) }
					{ columnKeys[ 'last-updated' ] && (
						<div className="plugin-common-card__site-data">
							{ rowFormatter( {
								columnKey: 'last-updated',
								item,
								isSmallScreen: true,
							} ) }
						</div>
					) }
					{ ( columnKeys[ 'active' ] || columnKeys[ 'autoupdate' ] ) && (
						<div className="plugin-common-card__toggle-container">
							{ columnKeys[ 'activate' ] && (
								<div>
									{ rowFormatter( {
										columnKey: 'activate',
										item,
										isSmallScreen: true,
										selectedSite,
									} ) }
								</div>
							) }
							{ columnKeys[ 'autoupdate' ] && (
								<div>
									{ rowFormatter( {
										columnKey: 'autoupdate',
										item,
										isSmallScreen: true,
										selectedSite,
									} ) }
								</div>
							) }
						</div>
					) }
					{ columnKeys[ 'sites' ] && (
						<div className="plugin-common-card__site-data">
							{ rowFormatter( {
								columnKey: 'sites',
								item,
								isSmallScreen: true,
							} ) }
						</div>
					) }
					{ columnKeys[ 'update' ] &&
						rowFormatter( {
							columnKey: 'update',
							item,
							isSmallScreen: true,
							className: 'plugin-common-card__update-plugin',
						} ) }
				</div>
				{ hasMoreActions && (
					<div className="plugin-common-card__right-content">
						<Button borderless compact>
							<Gridicon icon="ellipsis" size={ 18 } className="plugin-common-card__all-actions" />
						</Button>
					</div>
				) }
			</div>
		</Card>
	);
}
