const sections = [
	{
		name: 'root',
		paths: [ '/' ],
		module: 'calypso/root',
		group: 'root',
		enableLoggedOut: true,
	},
	{
		name: 'sites',
		paths: [ '/sites' ],
		module: 'calypso/my-sites',
		group: 'sites',
	},
	{
		name: 'customize',
		paths: [ '/customize' ],
		module: 'calypso/my-sites/customize',
		group: 'sites',
	},
	{
		name: 'account',
		paths: [ '/me/account' ],
		module: 'calypso/me/account',
		group: 'me',
	},
	{
		name: 'account-close',
		paths: [ '/me/account/close', '/me/account/closed' ],
		module: 'calypso/me/account-close',
		group: 'me',
	},
	{
		name: 'concierge',
		paths: [ '/me/concierge', '/me/quickstart' ],
		module: 'calypso/me/concierge',
		group: 'me',
	},
	{
		name: 'happychat',
		paths: [ '/me/chat' ],
		module: 'calypso/me/happychat',
		group: 'me',
	},
	{
		name: 'notification-settings',
		paths: [ '/me/notifications' ],
		module: 'calypso/me/notification-settings',
		group: 'me',
	},
	{
		name: 'privacy',
		paths: [ '/me/privacy' ],
		module: 'calypso/me/privacy',
		group: 'me',
	},
	{
		name: 'purchases',
		paths: [ '/me/purchases', '/me/billing', '/payment-methods/add-credit-card' ],
		module: 'calypso/me/purchases',
		group: 'me',
	},
	{
		name: 'security',
		paths: [ '/me/security' ],
		module: 'calypso/me/security',
		group: 'me',
	},
	{
		name: 'site-blocks',
		paths: [ '/me/site-blocks' ],
		module: 'calypso/me/site-blocks',
		group: 'me',
	},
	// This should be the last section for `/me` paths as it would otherwise have precedence over
	// the other sub `/me/*` sections when resolving the requested path
	{
		name: 'me',
		paths: [ '/me' ],
		module: 'calypso/me',
		group: 'me',
	},
	{
		name: 'activity',
		paths: [ '/activity-log' ],
		module: 'calypso/my-sites/activity',
		group: 'sites',
	},
	{
		name: 'site-purchases',
		paths: [ '/purchases' ],
		module: 'calypso/my-sites/purchases',
		group: 'sites',
	},
	{
		name: 'media',
		paths: [ '/media' ],
		module: 'calypso/my-sites/media',
		group: 'sites',
	},
	{
		name: 'people',
		paths: [ '/people' ],
		module: 'calypso/my-sites/people',
		group: 'sites',
	},
	{
		name: 'plugins',
		paths: [ '/plugins' ],
		module: 'calypso/my-sites/plugins',
		group: 'sites',
	},
	{
		name: 'marketplace',
		paths: [ '/marketplace' ],
		module: 'calypso/my-sites/marketplace',
		group: 'sites',
	},
	{
		name: 'pages',
		paths: [ '/pages' ],
		module: 'calypso/my-sites/pages',
		group: 'sites',
	},
	{
		name: 'posts',
		paths: [ '/posts' ],
		module: 'calypso/my-sites/posts',
		group: 'sites',
	},
	{
		name: 'settings-performance',
		paths: [ '/settings/performance' ],
		module: 'calypso/my-sites/site-settings/settings-performance',
		group: 'sites',
	},
	{
		name: 'settings-writing',
		paths: [ '/settings/writing', '/settings/taxonomies', '/settings/podcasting' ],
		module: 'calypso/my-sites/site-settings/settings-writing',
		group: 'sites',
	},
	{
		name: 'settings-discussion',
		paths: [ '/settings/discussion' ],
		module: 'calypso/my-sites/site-settings/settings-discussion',
		group: 'sites',
	},
	{
		name: 'settings-security',
		paths: [ '/settings/security' ],
		module: 'calypso/my-sites/site-settings/settings-security',
		group: 'sites',
	},
	{
		name: 'settings-jetpack',
		paths: [ '/settings/jetpack' ],
		module: 'calypso/my-sites/site-settings/settings-jetpack',
		group: 'sites',
	},
	{
		name: 'settings',
		paths: [ '/settings' ],
		module: 'calypso/my-sites/site-settings',
		group: 'sites',
	},
	{
		name: 'marketing',
		paths: [ '/marketing', '/sharing' ],
		module: 'calypso/my-sites/marketing',
		group: 'sites',
	},
	{
		name: 'jetpack-connect',
		paths: [ '/jetpack' ],
		module: 'calypso/jetpack-connect',
		enableLoggedOut: true,
	},
	{
		name: 'purchase-product',
		paths: [ '/purchase-product' ],
		module: 'calypso/my-sites/purchase-product',
		enableLoggedOut: true,
	},
	{
		name: 'signup',
		paths: [ '/start' ],
		module: 'calypso/signup',
		enableLoggedOut: true,
		isomorphic: true,
	},
	{
		name: 'stats',
		paths: [ '/stats' ],
		module: 'calypso/my-sites/stats',
		group: 'sites',
		trackLoadPerformance: true,
	},
	{
		name: 'google-my-business',
		paths: [ '/google-my-business' ],
		module: 'calypso/my-sites/google-my-business',
		group: 'sites',
	},
	// Since we're using find() and startsWith() on paths, 'themes' needs to go before 'theme',
	// or it'll be falsely associated with the latter section.
	{
		name: 'themes',
		paths: [ '/themes', `/([a-z]{2,3}|[a-z]{2}-[a-z]{2})/themes`, '/design' ],
		module: 'calypso/my-sites/themes',
		enableLoggedOut: true,
		group: 'sites',
		isomorphic: true,
		title: 'Themes',
	},
	{
		name: 'theme',
		paths: [ '/theme', `/([a-z]{2,3}|[a-z]{2}-[a-z]{2})/theme` ],
		module: 'calypso/my-sites/theme',
		enableLoggedOut: true,
		group: 'sites',
		isomorphic: true,
		title: 'Themes',
		trackLoadPerformance: true,
	},
	{
		name: 'domains',
		paths: [ '/domains' ],
		module: 'calypso/my-sites/domains',
		group: 'sites',
	},
	{
		name: 'incoming-redirect',
		paths: [ '/incoming-redirect' ],
		module: 'calypso/incoming-redirect',
		enableLoggedOut: true,
	},
	{
		name: 'email',
		paths: [ '/email' ],
		module: 'calypso/my-sites/email',
		group: 'sites',
	},
	{
		name: 'inbox',
		paths: [ '/inbox' ],
		module: 'calypso/my-sites/email',
		group: 'sites',
	},
	{
		name: 'checkout',
		paths: [ '/checkout' ],
		module: 'calypso/my-sites/checkout',
		group: 'sites',
		enableLoggedOut: true,
	},
	{
		name: 'plans',
		paths: [ '/plans' ],
		module: 'calypso/my-sites/plans',
		group: 'sites',
		trackLoadPerformance: true,
	},
	{
		name: 'accept-invite',
		paths: [ '/accept-invite' ],
		module: 'calypso/my-sites/invites',
		enableLoggedOut: true,
	},
	{
		name: 'earn',
		paths: [ '/earn', '/ads' ],
		module: 'calypso/my-sites/earn',
		group: 'sites',
	},
	{
		name: 'mailing-lists',
		paths: [ '/mailing-lists/unsubscribe' ],
		module: 'calypso/mailing-lists',
		enableLoggedOut: true,
		group: 'me',
	},
	// this MUST be the first section for /read paths so subsequent sections under /read can override settings
	{
		name: 'reader',
		paths: [ '/read' ],
		module: 'calypso/reader',
		group: 'reader',
		trackLoadPerformance: true,
	},
	{
		name: 'reader',
		paths: [
			'/read/feeds/[^\\/]+',
			'/read/blogs/[^\\/]+',
			'/read/a8c',
			'/read/p2',
			'/recommendations',
		],
		module: 'calypso/reader',
		group: 'reader',
		trackLoadPerformance: true,
	},
	{
		name: 'reader',
		paths: [ '/read/feeds/[^\\/]+/posts/[^\\/]+', '/read/blogs/[^\\/]+/posts/[^\\/]+' ],
		module: 'calypso/reader/full-post',
		group: 'reader',
		trackLoadPerformance: true,
	},
	{
		name: 'reader',
		paths: [ '/discover' ],
		module: 'calypso/reader/discover',
		group: 'reader',
		trackLoadPerformance: true,
	},
	{
		name: 'reader',
		paths: [ '/following' ],
		module: 'calypso/reader/following',
		group: 'reader',
	},
	{
		name: 'reader',
		paths: [ '/tags', '/tag' ],
		module: 'calypso/reader/tag-stream',
		group: 'reader',
		trackLoadPerformance: true,
	},
	{
		name: 'reader',
		paths: [ '/activities' ],
		module: 'calypso/reader/liked-stream',
		group: 'reader',
		trackLoadPerformance: true,
	},
	{
		name: 'reader',
		paths: [ '/read/search', '/recommendations' ],
		module: 'calypso/reader/search',
		group: 'reader',
		trackLoadPerformance: true,
	},
	{
		name: 'reader',
		paths: [ '/read/list' ],
		module: 'calypso/reader/list',
		group: 'reader',
	},
	{
		name: 'reader',
		paths: [ '/read/conversations' ],
		module: 'calypso/reader/conversations',
		group: 'reader',
		trackLoadPerformance: true,
	},
	{
		name: 'help',
		paths: [ '/help' ],
		module: 'calypso/me/help',
		enableLoggedOut: true,
		group: 'me',
	},
	{
		name: 'auth',
		paths: [ '/api/oauth/token' ],
		module: 'calypso/auth',
		enableLoggedOut: true,
	},
	{
		name: 'posts-custom',
		paths: [ '/types' ],
		module: 'calypso/my-sites/types',
		group: 'sites',
	},
	{
		name: 'comments',
		paths: [ '/comments', '/comment' ],
		module: 'calypso/my-sites/comments',
		group: 'sites',
	},
	{
		name: 'preview',
		paths: [ '/view' ],
		module: 'calypso/my-sites/preview',
		group: 'sites',
	},
	{
		name: 'domain-connect-authorize',
		paths: [ '/domain-connect' ],
		module: 'calypso/my-sites/domains/domain-management/domain-connect',
	},
	{
		name: 'gutenberg-editor',
		paths: [ '/block-editor', '/site-editor', '/post', '/page', '/edit' ],
		module: 'calypso/gutenberg/editor',
		group: 'gutenberg',
		trackLoadPerformance: true,
		enableLoggedOut: true,
	},
	{
		name: 'import',
		paths: [ '/import' ],
		module: 'calypso/my-sites/importer',
		group: 'sites',
	},
	{
		name: 'export',
		paths: [ '/export' ],
		module: 'calypso/my-sites/exporter',
		group: 'sites',
	},
	{
		name: 'migrate',
		paths: [ '/migrate' ],
		module: 'calypso/my-sites/migrate',
		group: 'sites',
	},
	{
		name: 'devdocs',
		paths: [ '/devdocs' ],
		module: 'calypso/devdocs',
		enableLoggedOut: true,
	},
	{
		name: 'home',
		paths: [ '/home' ],
		module: 'calypso/my-sites/customer-home',
		group: 'sites',
		trackLoadPerformance: true,
	},
	{
		name: 'hosting',
		paths: [ '/hosting-config' ],
		module: 'calypso/my-sites/hosting',
		group: 'sites',
	},
	{
		name: 'backup',
		paths: [ '/backup' ],
		module: 'calypso/my-sites/backup',
		group: 'sites',
	},
	{
		name: 'scan',
		paths: [ '/scan' ],
		module: 'calypso/my-sites/scan',
		group: 'sites',
	},
	{
		name: 'jetpack-cloud',
		paths: [ '/', '/landing', '/settings' ],
		module: 'calypso/jetpack-cloud',
		group: 'jetpack-cloud',
		enableLoggedOut: true,
	},
	{
		name: 'jetpack-cloud-settings',
		paths: [ '/settings' ],
		module: 'calypso/jetpack-cloud/sections/settings',
		group: 'jetpack-cloud',
	},
	{
		name: 'jetpack-cloud-auth',
		paths: [ '/connect', '/connect/oauth/token' ],
		module: 'calypso/jetpack-cloud/sections/auth',
		group: 'jetpack-cloud',
		enableLoggedOut: true,
	},
	{
		name: 'jetpack-cloud-pricing',
		paths: [ '/pricing', '/[^\\/]+/pricing', '/plans', '/[^\\/]+/plans' ],
		module: 'calypso/jetpack-cloud/sections/pricing',
		group: 'jetpack-cloud',
		enableLoggedOut: true,
		links: [
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap',
			},
		],
	},
	{
		name: 'jetpack-search',
		paths: [ '/jetpack-search' ],
		module: 'calypso/my-sites/jetpack-search',
		group: 'sites',
	},
	{
		name: 'jetpack-cloud-partner-portal',
		paths: [ '/partner-portal' ],
		module: 'calypso/jetpack-cloud/sections/partner-portal',
		group: 'jetpack-cloud',
	},
	{
		name: 'woocommerce-installation',
		paths: [ '/woocommerce-installation' ],
		module: 'calypso/my-sites/woocommerce',
		group: 'woocommerce-installation',
	},
	{
		name: 'woocommerce',
		paths: [ '/store' ],
		module: 'calypso/my-sites/store',
		group: 'sites',
	},
];

module.exports = sections;
