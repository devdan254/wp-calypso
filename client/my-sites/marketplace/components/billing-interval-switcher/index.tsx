import styled from '@emotion/styled';
import { useTranslate } from 'i18n-calypso';
import FormLabel from 'calypso/components/forms/form-label';
import FormRadio from 'calypso/components/forms/form-radio';
import { PluginAnnualSaving } from 'calypso/my-sites/plugins/plugin-saving';
import { IntervalLength } from './constants';
import type { FunctionComponent } from 'react';

type PluginAnnualSavingLabelProps = {
	isSelected: boolean;
};

const PluginAnnualSavingLabelMobile = styled.span< PluginAnnualSavingLabelProps >`
	color: ${ ( props ) =>
		props.isSelected ? 'var( --studio-white-100 )' : 'var( --studio-green-60 )' };
`;

const BillingIntervalSwitcherContainer = styled.div`
	display: flex;
	margin-top: -4px;
	margin-bottom: 16px;
`;

const RadioButton = styled( FormRadio )`
	&:checked:before {
		background-color: var( --studio-gray-80 );
	}
`;

const RadioButtonLabel = styled( FormLabel )`
	color: var( --studio-gray-60 );

	&:first-child {
		margin-right: 15px;
	}
`;

type Props = {
	onChange: ( selectedValue: 'MONTHLY' | 'ANNUALLY' ) => void;
	billingPeriod: IntervalLength;
	compact: boolean;
	plugin?: {
		variations?: {
			yearly?: { product_slug?: string; product_id?: number };
			monthly?: { product_slug?: string; product_id?: number };
		};
	};
};

const BillingIntervalSwitcher: FunctionComponent< Props > = ( props: Props ) => {
	const { billingPeriod, onChange, plugin } = props;

	const translate = useTranslate();
	const monthlyLabel = translate( 'Monthly' );
	const annualLabel = translate( 'Annually' );

	return (
		<BillingIntervalSwitcherContainer>
			<RadioButtonLabel>
				<RadioButton
					className="billing-interval-switcher__monthly-option"
					checked={ billingPeriod === IntervalLength.MONTHLY }
					onChange={ () => onChange( IntervalLength.MONTHLY ) }
					label={ monthlyLabel }
				/>
			</RadioButtonLabel>
			<RadioButtonLabel>
				<RadioButton
					className="billing-interval-switcher__yearly-option"
					checked={ billingPeriod === IntervalLength.ANNUALLY }
					onChange={ () => onChange( IntervalLength.ANNUALLY ) }
					label={
						<>
							{ annualLabel }
							<PluginAnnualSaving plugin={ plugin }>
								{ ( annualSaving: { saving: string | null } ) =>
									annualSaving.saving && (
										<PluginAnnualSavingLabelMobile isSelected={ false }>
											&nbsp;(-{ annualSaving.saving })
										</PluginAnnualSavingLabelMobile>
									)
								}
							</PluginAnnualSaving>
						</>
					}
				/>
			</RadioButtonLabel>
		</BillingIntervalSwitcherContainer>
	);
};

export default BillingIntervalSwitcher;
