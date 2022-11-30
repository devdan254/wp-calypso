import debugFactory from 'debug';
import { useContext } from 'react';
import { PaymentMethod } from '../../types';
import CheckoutContext from '../checkout-context';

const debug = debugFactory( 'composite-checkout:payment-methods' );

export function usePaymentMethodId(): [ string | null, ( id: string ) => void ] {
	const { paymentMethodId, setPaymentMethodId } = useContext( CheckoutContext );
	if ( ! setPaymentMethodId ) {
		throw new Error( 'usePaymentMethodId can only be used inside a CheckoutProvider' );
	}
	return [ paymentMethodId, setPaymentMethodId ];
}

export function usePaymentMethod(): PaymentMethod | null {
	const { paymentMethodId, setPaymentMethodId } = useContext( CheckoutContext );
	const allPaymentMethods = useAllPaymentMethods();
	if ( ! setPaymentMethodId ) {
		throw new Error( 'usePaymentMethod can only be used inside a CheckoutProvider' );
	}
	if ( ! paymentMethodId ) {
		return null;
	}
	const paymentMethod = allPaymentMethods.find( ( { id } ) => id === paymentMethodId );
	if ( ! paymentMethod ) {
		debug( `No payment method found matching id '${ paymentMethodId }' in`, allPaymentMethods );
		return null;
	}
	return paymentMethod;
}

export function useAllPaymentMethods() {
	const { allPaymentMethods } = useContext( CheckoutContext );
	if ( ! allPaymentMethods ) {
		throw new Error( 'useAllPaymentMethods cannot be used outside of CheckoutProvider' );
	}
	return allPaymentMethods;
}

export function useAvailablePaymentMethodIds(): string[] {
	const { allPaymentMethods, availablePaymentMethodIds } = useContext( CheckoutContext );
	if ( ! allPaymentMethods ) {
		throw new Error( 'useAvailablePaymentMethodIds cannot be used outside of CheckoutProvider' );
	}
	debug( 'Returning available payment methods', availablePaymentMethodIds );
	return availablePaymentMethodIds;
}

export function useTogglePaymentMethod( paymentMethodId: string, available: boolean ): void {
	const { allPaymentMethods, availablePaymentMethodIds, setAvailablePaymentMethodIds } =
		useContext( CheckoutContext );
	if ( ! allPaymentMethods ) {
		throw new Error( 'useTogglePaymentMethod cannot be used outside of CheckoutProvider' );
	}
	const paymentMethod = allPaymentMethods.find( ( { id } ) => id === paymentMethodId );
	if ( ! paymentMethod ) {
		debug( `No payment method found matching id '${ paymentMethodId }' in`, allPaymentMethods );
		return;
	}

	if ( available && ! availablePaymentMethodIds.includes( paymentMethodId ) ) {
		setAvailablePaymentMethodIds( [ ...availablePaymentMethodIds, paymentMethodId ] );
	}

	if ( ! available && availablePaymentMethodIds.includes( paymentMethodId ) ) {
		setAvailablePaymentMethodIds(
			availablePaymentMethodIds.filter( ( id ) => id !== paymentMethodId )
		);
	}
}
