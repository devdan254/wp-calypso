/**
 * @group quarantined
 */

import {
	BrowserManager,
	DataHelper,
	DomainSearchComponent,
	UserSignupPage,
	CartCheckoutPage,
	PlansPage,
	PluginsPage,
	NewUserResponse,
	RestAPIClient,
} from '@automattic/calypso-e2e';
import { Page, Browser } from 'playwright';
import { apiCloseAccount } from '../shared';

declare const browser: Browser;

describe( DataHelper.createSuiteTitle( 'Plugins: a custom domain, a free plugin' ), function () {
	const planName = 'Business';
	const pluginSlug = 'wp-job-manager';
	const testUser = DataHelper.getNewTestUser( {
		usernamePrefix: 'plugin',
	} );

	let page: Page;
	let domainSearchComponent: DomainSearchComponent;
	let cartCheckoutPage: CartCheckoutPage;
	let newUserDetails: NewUserResponse;

	beforeAll( async () => {
		// Because many button/link selectors depden on label texts,
		// we need to make sure the locale is set to English.
		const context = await browser.newContext( { locale: 'en-US' } );
		page = await context.newPage();
	} );

	it( 'Set store cookie and locale', async function () {
		await BrowserManager.setStoreCookie( page );
	} );

	describe( 'Signup from logged-out plugins page', function () {
		it( 'Navigate to the plugin details page', async function () {
			const pluginsPage = new PluginsPage( page );
			await pluginsPage.visitPage( pluginSlug );
			await pluginsPage.clickStartOnboarding();
		} );

		it( 'Start the onboarding process', async function () {
			await page.waitForNavigation( {
				url: DataHelper.getCalypsoURL( '/start/with-plugin', { pluginSlug } ),
			} );
		} );

		it( 'Search for a domain', async function () {
			domainSearchComponent = new DomainSearchComponent( page );
			await domainSearchComponent.search( testUser.username );
		} );

		it( 'Select a free domain', async function () {
			await domainSearchComponent.selectDomain( '.wordpress.com' );
		} );

		it( `Select WordPress.com ${ planName } plan`, async function () {
			const signupPlansPage = new PlansPage( page );
			await signupPlansPage.selectPlan( planName );
		} );

		it( 'Sign up for a WordPress.com account', async function () {
			const userSignupPage = new UserSignupPage( page );
			newUserDetails = await userSignupPage.signup(
				testUser.email,
				testUser.username,
				testUser.password
			);
		} );

		it( 'See secure checkout', async function () {
			cartCheckoutPage = new CartCheckoutPage( page );
			await cartCheckoutPage.validateCartItem( `WordPress.com ${ planName }` );
		} );

		it( 'Enter credit card details', async function () {
			await cartCheckoutPage.enterBillingDetails( DataHelper.getTestPaymentDetails() );
			await cartCheckoutPage.enterPaymentDetails( DataHelper.getTestPaymentDetails() );
		} );

		it( 'Make purchase', async function () {
			await cartCheckoutPage.purchase();
		} );

		it( 'Install plugin', async function () {
			await page.waitForNavigation( {
				url: `**/marketplace/${ pluginSlug }/auto-install/**`,
				timeout: 120 * 1000,
			} );

			await page.waitForNavigation( {
				url: `**/marketplace/thank-you/${ pluginSlug }/**`,
				timeout: 120 * 1000,
			} );
		} );
	} );

	describe( 'Validate the result', function () {
		it( 'Make sure the site is a .wpcomstaging.com', async function () {
			// Sometimes it takes time to update the site URL.
			await page.waitForTimeout( 3000 );

			await page.goto( DataHelper.getCalypsoURL( '/home' ) );
			await page.waitForNavigation( { url: '**/home/**' } );

			const siteUrl = page.url();
			expect( siteUrl ).toContain( '.wpcomstaging.com' );
		} );
	} );

	afterAll( async function () {
		const restAPIClient = new RestAPIClient(
			{
				username: testUser.username,
				password: testUser.password,
			},
			newUserDetails.body.bearer_token
		);

		await apiCloseAccount( restAPIClient, {
			userID: newUserDetails.body.user_id,
			username: newUserDetails.body.username,
			email: testUser.email,
		} );
	} );
} );
