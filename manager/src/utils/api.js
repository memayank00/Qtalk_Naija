(function() {
	window.admin = {
		login: window._env.adminPath + "login-admin",
		logout: window._env.adminPath + "logout-admin",
		profile: window._env.adminPath + "my-profile",
		forgotPassword: window._env.adminPath + "forgot-password",
		resetPassword: window._env.adminPath + "reset-password",
		changePassword: window._env.adminPath + "admin-change-password",
		upadteAdminProfile: window._env.adminPath + "update-profile",
		/*user*/
		getUsers: window._env.adminPath + "get-users",
		deleteUser: window._env.adminPath + "delete-user",
		
		/*users cluster view*/
		getActiveUser: window._env.adminPath + "get-active-user",

		// ROLE
		addEditRole: window._env.adminPath + "add-edit-role",
		getRoles: window._env.adminPath + "get-roles",
		getARole: window._env.adminPath + "get-a-role",

		// USER/ADMIN MANGEMENT
		addEditUser: window._env.adminPath + "add-edit-admin",
		//getUsers: window._env.adminPath + "get-admins",
		getAUser: window._env.adminPath + "get-a-admin",
		getRolesOptions: window._env.adminPath + "get-roles-options",

		//CUSTOMER MANGEMENT
		upsertCustomer: window._env.adminPath + "upsert-user",
		getCustomers: window._env.adminPath + "get-users",
		getACustomer: window._env.adminPath + "get-a-user",

		//Pages<==>Blogs<===>Email
		getCMS: window._env.adminPath + "get-cms",
		upsertCMS: window._env.adminPath + "upsert-cms",
		getaCMS: window._env.adminPath + "get-a-cms",
		deleteCMS: window._env.adminPath + "delete-a-cms",
		importCMS:window._env.adminPath +"upload-cms-csv",

		//Profile
		changeUserAvtar: window._env.adminPath + "change-admin-avtar",

		//Notifications
		getNotifications: window._env.adminPath + "get-notifications",

		//metaData IP<==>Taxes
		addEditMetaData: window._env.adminPath + "add-edit-metadata",
		getMetaData: window._env.adminPath + "get-metadata",

		validateSession: window._env.adminPath + "validate-session",
		requestAccess: window._env.adminPath + "request-access",
		verifyAccessToken: window._env.adminPath + "verify-access-token",

		// Feedback
		getFeedbacks: window._env.adminPath + "get-feedbacks",
		getAFeedback: window._env.adminPath + "get-a-feedback",
		replyFeedback: window._env.adminPath + "reply-feedback",

		// Test
		getTests: window._env.adminPath + "get-tests",
		getATest: window._env.adminPath + "get-a-test",
		upsertTest: window._env.adminPath + "upsert-test",

		//payment
		getPayments: window._env.adminPath + "get-charges",
		getAPayment: window._env.adminPath + "get-a-charge",

		// logs
		getLoginLogs: window._env.adminPath + "get-login-logs",
		getAuditLogs: window._env.adminPath + "get-audit-logs",
		getAccessLogs: window._env.adminPath + "get-access-logs",
		getAAccessLogs: window._env.adminPath + "get-a-access-logs",
		trackActivity: window._env.adminPath + "track-activity",
		exportAuditLogs: window._env.adminPath + "export-audit-logs",
		exportAccessLogs: window._env.adminPath + "export-access-logs",
		exportLoginLogs: window._env.adminPath + "export-login-logs",

		//revisions
		restoreRevision: window._env.adminPath + "restore-revision",

		//Reports
		// Admin<====>Customer
		adminCustomerCsv: window._env.adminPath + "export-admin-customer-csv",
		getanOfferList: window._env.adminPath + "get-an-offer-list",
		getanOfferView:window._env.adminPath + "get-offer-view",
		

		//MARKET_MANAGEMENT
		addMarket: window._env.adminPath + "add-new-market",
		getmarketList: window._env.adminPath + "get-market-list",
		getmarketView: window._env.adminPath + "get-market-view",
		EditMarket: window._env.adminPath + "edit-market",
		importMarkets:window._env.adminPath + "upload-market",

		//PROPERTY MANAGEMENT
		addProperty: window._env.adminPath + "add-new-property",
		getpropertyList: window._env.adminPath + "get-property-list",
		removeBlogImage: `${window._env.adminPath}remove-blog-image`,

		//REview Management
		gerReviewList: window._env.adminPath + "review-list",
		getReviewView: window._env.adminPath + "review-view",

		//out of Market 
		gerOutMarketList: window._env.adminPath + "get-out-market-list",
		gerOutMarketView: window._env.adminPath + "get-out-of-market-view",

		//career management
		careerList: window._env.adminPath + "career-list",
		careerView: window._env.adminPath + "career-view",

		/* froala images */

		uploadImagesFlo: window._env.adminPath + "floala_image_upload",
		deleteImagesFro:window._env.adminPath + "floala_image_delete",

		/* faq category */
		faqCategoryList: window._env.adminPath + "faq-category-list",
		faqCategoryAdd:window._env.adminPath + "faq-category-add",
		faqQuestionCount:window._env.adminPath + "faq_category_count",
		faqQuestionDeleteUpdate:window._env.adminPath + "faq_category_update_and_delete",
		
		/* social */

		socicalUpdateAdd:window._env.adminPath + "edit_save_social_cms",

		/* sitemap */
		sitemapUpsert:window._env.adminPath + "upsert-sitemap",
		sitemaplisting:window._env.adminPath +"sitemap-listing",
		onesitemap:window._env.adminPath +"geta-site-map",
		syncData:window._env.adminPath + "dynamic-sitemap-routes",

		/* Property Details */
            
		upsertPropertDetails:window._env.adminPath+"upsert-property-detail",
		listPropertDetails:window._env.adminPath+"list-property-detail",
		getPropertDetails:window._env.adminPath+"get-property-detail",
		/* Agent */
		upsertAgent:window._env.adminPath+"upsert-agent",
		getAgentList:window._env.adminPath+"get-agent-list",
		getAgentDetail:window._env.adminPath+"get-agent-detail",
		agentsDynamic:window._env.adminPath+"agent-property-list",
	};
})();
