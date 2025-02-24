import {
	JETPACK_RESET_PLANS,
	PLAN_JETPACK_SECURITY_T1_YEARLY,
	PLAN_JETPACK_SECURITY_T1_MONTHLY,
	PLAN_JETPACK_SECURITY_T2_YEARLY,
	PLAN_JETPACK_SECURITY_T2_MONTHLY,
	JETPACK_BACKUP_ADDON_PRODUCTS,
	getMonthlyPlanByYearly,
	getYearlyPlanByMonthly,
} from '@automattic/calypso-products';
import { SELECTOR_PLANS } from '../constants';
import slugToSelectorProduct from '../slug-to-selector-product';
import type { Duration, SelectorProduct } from '../types';

// Map over all plan slugs and convert them to SelectorProduct types.
export const getPlansToDisplay = ( {
	duration,
	currentPlanSlug,
}: {
	duration: Duration;
	currentPlanSlug: string | null;
} ): SelectorProduct[] => {
	const currentPlanTerms = currentPlanSlug
		? [ getMonthlyPlanByYearly( currentPlanSlug ), getYearlyPlanByMonthly( currentPlanSlug ) ]
		: [];

	let planSlugsToDisplay = SELECTOR_PLANS;

	// When users own a tier 2 security plan, display that instead of the tier 1 plans.
	if (
		currentPlanSlug &&
		[ PLAN_JETPACK_SECURITY_T2_YEARLY, PLAN_JETPACK_SECURITY_T2_MONTHLY ].includes(
			currentPlanSlug
		)
	) {
		const slugReplacements: { [ x: string ]: string } = {
			[ PLAN_JETPACK_SECURITY_T1_YEARLY ]: PLAN_JETPACK_SECURITY_T2_YEARLY,
			[ PLAN_JETPACK_SECURITY_T1_MONTHLY ]: PLAN_JETPACK_SECURITY_T2_MONTHLY,
		};

		planSlugsToDisplay = planSlugsToDisplay.map( ( slug ) => slugReplacements[ slug ] ?? slug );
	}

	const plansToDisplay = planSlugsToDisplay
		.map( slugToSelectorProduct )
		// Remove plans that don't fit the filters or have invalid data.
		.filter(
			( product: SelectorProduct | null ): product is SelectorProduct =>
				!! product &&
				product.term === duration &&
				// Don't include a plan the user already owns, regardless of the term
				! currentPlanTerms.includes( product.productSlug )
		);

	if (
		currentPlanSlug &&
		( JETPACK_RESET_PLANS as ReadonlyArray< string > ).includes( currentPlanSlug )
	) {
		const currentPlanSelectorProduct = slugToSelectorProduct( currentPlanSlug );
		if ( currentPlanSelectorProduct ) {
			return [ currentPlanSelectorProduct, ...plansToDisplay ];
		}
	}

	return plansToDisplay;
};

const removeAddons = ( product: SelectorProduct ) =>
	! ( JETPACK_BACKUP_ADDON_PRODUCTS as ReadonlyArray< string > ).includes( product?.productSlug );

export const getProductsToDisplay = ( {
	duration,
	availableProducts,
	purchasedProducts,
	includedInPlanProducts,
}: {
	duration: Duration;
	availableProducts: SelectorProduct[];
	purchasedProducts: SelectorProduct[];
	includedInPlanProducts: SelectorProduct[];
} ): SelectorProduct[] => {
	const purchasedProductsWithoutAddOn = purchasedProducts.filter( removeAddons );

	const purchasedSlugs = purchasedProductsWithoutAddOn
		?.map( ( p ) => p?.productSlug )
		?.filter( ( slug ) => slug );

	// Products that have not been directly purchased must honor the current filter
	// selection since they exist in both monthly and yearly version.
	const filteredProducts = [ ...includedInPlanProducts, ...availableProducts ]
		// Remove add-on products
		.filter( removeAddons )
		// Remove products that don't match the selected duration
		.filter( ( product ): product is SelectorProduct => product?.term === duration )
		// Remove duplicates (only happens if the site somehow has the same product
		// both purchased and included in a plan, very unlikely)
		.filter( ( product ) => {
			if ( product.productSlug && purchasedSlugs.includes( product.productSlug ) ) {
				return false;
			}

			if ( product.monthlyProductSlug && purchasedSlugs.includes( product.monthlyProductSlug ) ) {
				return false;
			}

			return true;
		} );
	return (
		[ ...purchasedProductsWithoutAddOn, ...filteredProducts ]
			// Make sure we don't allow any null or invalid products
			.filter( ( product ): product is SelectorProduct => !! product )
	);
};

export const isConnectionFlow = (): boolean =>
	/jetpack\/connect\/plans/.test( window.location.href ) ||
	/source=jetpack-connect-plans/.test( window.location.href );

export const isConnectStore = (): boolean => /jetpack\/connect\/store/.test( window.location.href );
