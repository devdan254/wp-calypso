/**
 * @jest-environment jsdom
 */

import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { siteColumns } from '../../utils';
import SiteCard from '../index';
import type { SiteData } from '../../types';

describe( '<SiteCard>', () => {
	test( 'should render correctly and expand card on click', () => {
		const rows: SiteData = {
			site: {
				value: {
					blog_id: 1234,
					url: 'test.jurassic.ninja',
					url_with_scheme: 'https://test.jurassic.ninja/',
				},
				error: true,
				type: 'site',
				status: '',
			},
			backup: {
				type: 'backup',
			},
			monitor: { error: '', type: 'monitor', status: '' },
			scan: { threats: 3, type: 'scan', status: 'failed', value: '3 Threats' },
			plugin: { updates: 3, type: 'plugin', status: 'warning', value: '3 Available' },
		};
		const initialState = {};
		const mockStore = configureStore();
		const store = mockStore( initialState );

		const { container } = render(
			<Provider store={ store }>
				<SiteCard rows={ rows } columns={ siteColumns } />
			</Provider>
		);

		const [ expandedContentBeforeClick ] = container.getElementsByClassName(
			'site-card__expanded-content'
		);
		expect( expandedContentBeforeClick ).toBeFalsy();

		const [ header ] = container.getElementsByClassName( 'site-card__title' );

		fireEvent.click( header );

		const [ expandedContent ] = container.getElementsByClassName( 'site-card__expanded-content' );

		expect( expandedContent ).toBeInTheDocument();
	} );
} );
