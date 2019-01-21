import React from "react";
import { Switch } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import { connect } from "react-redux";
import ReactDOM from "react-dom";

/*import private routes for authenticated users*/
import WithoutLogin from "./withoutLogin";
import PrivateRoute from "./private";
import PermissionRoutes from "./permissionRoutes";
import WhiteListRoute from "./whiteListRoute";

import Login from "../components/login/login";
import ForgotPassword from "../components/login/forgotPassword";
import RequestAccess from "../components/login/requestAccess";
import ResetPassword from "../components/login/resetPassword";

import Dashboard from "../components/dashboard/dashboard";

/**ROLE MANAGMENT */
import RoleManagement from "../components/roleManagment";
import AddRole from "../components/roleManagment/add";

/**USER MANAGMENT */
import UserManagement from "../components/userManagment";
import AddUser from "../components/userManagment/add";
/**USER CLUSTER VIEW */
import UserCluster from "../components/UserCluster";

/**CUSTOMER ROLE MANAGMENT */
import CustomerRoleManagement from "../components/customerRoleMangment";
import CustomerAddRole from "../components/customerRoleMangment/add";

/**EMAIL Managment */
import EmailManagement from "../components/emailMangment";
import EditEmail from "../components/emailMangment/add";

/*Pages Management*/
import _Pages from "../components/pages";
import _Pages_Add from "../components/pages/add";
import importPages from "../components/pages/import";

/*Blogs Management*/
import _Blogs from "../components/blogs";
import _Blogs_Add from "../components/blogs/add";

/*Slider Management*/
import _Slides from "../components/slides";
import _Slides_Add from "../components/slides/add";

/*CMS Blocks Management*/
import _BLOCK from "../components/cms-blocks";
import _BLOCK_Add from "../components/cms-blocks/add";



import Profile from "../components/profile/profile";
import ChangePassword from "../components/changepassword";

/** IP MANAGMENT */
import AddIP from "../components/IpManagement";

/** TAXES */
import Taxes from "../components/taxes";

/** Settings */
import Settings from "../components/settings";

/** Social */
import Social from "../components/social";
import UpsertSocial from "../components/social/add";

/** FAQ */
import FAQ from "../components/FAQ";
import UpsertFAQ from "../components/FAQ/add";

/** Feedback */
import Feedback from "../components/feedback";
import FeedbackResponse from "../components/feedback/reply";

/** Test */
import Test from "../components/test";
import UpsertTest from "../components/test/add";

/** Payment */
import Payment from "../components/payment";
import viewPayment from "../components/payment/view";

/*Logs*/
import Logs_Login from "../components/logs/login/";
import Logs_Audit from "../components/logs/audit/";

/**Access Logs*/
import AccessLogs from "../components/accessLogs";
import ViewAccessLog from "../components/accessLogs/view";

/**Reports*/
import Reports from "../components/reports";

/*import Element*/
import Header from "../components/elements/header";
//import Footer from '../components/elements/footer';
import SideBar from "../components/elements/sidebar";

/** Notifications.... */
import Notifications from "../components/notifications/";
/**404 NOT FOUND */
import NotFound from "../components/404/404";



/**import RoutesValue */
import { RoutesValue } from "../components/common/options";

class AppRouter extends React.Component {
	/**this hook will run after render method */
	componentDidMount() {
		/**to get height of the left sidebar */
		/* let elHeight = document.getElementsByClassName('page-sidebar-menu  page-header-fixed ');
		/**find content side *
		let rightpanel = document.getElementById('rightPanel');
		/**set height of right and left panel equal *
		if (elHeight && elHeight["0"] && elHeight["0"].clientHeight) ReactDOM.findDOMNode(rightpanel).style.height =`${elHeight["0"].clientHeight}px`;   */
	}

	render() {
		const { isAdminLoggedIn } = this.props;
		return (
			<ConnectedRouter history={this.props.history}>
				<div>
					{this.props.isAdminLoggedIn && <Header />}
					{/* <!-- BEGIN CONTAINER --> */}
					<div className="page-container margin-top-container">
						{/* <SideBar /> */}
						{this.props.isAdminLoggedIn && <SideBar />}
						<div className="page-content-wrapper">
							{/* <!-- BEGIN CONTENT BODY --> */}
							<div
								id="rightPanel"
								className={
									isAdminLoggedIn
										? "page-content min-height1000 "
										: null
								}
							>
								<Switch>
									<WithoutLogin
										exact
										path="/login"
										component={Login}
									/>

									<WhiteListRoute
										exact
										path="/forgot-password"
										component={ForgotPassword}
									/>
									<WhiteListRoute
										exact
										path="/request-access"
										component={RequestAccess}
									/>
									<WhiteListRoute
										exact
										path="/reset-password/:token"
										component={ResetPassword}
									/>

									{/* Dashboard */}
									<PrivateRoute
										exact
										path="/"
										component={Dashboard}
									/>
									<PrivateRoute
										exact
										path="/user"
										component={UserManagement}
									/>
									<PrivateRoute
										exact
										path="/cluster-view/:type"
										component={UserCluster}
									/>
									{/* Profile	 */}
									<PermissionRoutes
										exact
										path="/profile"
										component={Profile}
										permission={RoutesValue.PROFILE}
									/>


									{/*Change Password*/}
									<PermissionRoutes
										exact
										path="/change-password"
										component={ChangePassword}
										permission={RoutesValue.CHANGE_PASSWORD}
									/>

									{/* RoleManagement */}
									<PermissionRoutes
										exact
										path="/role-management"
										component={RoleManagement}
										permission={RoutesValue.MANAGE_ROLE}
									/>
									<PermissionRoutes
										exact
										path="/role-management/add"
										component={AddRole}
										permission={RoutesValue.MANAGE_ROLE}
									/>
									<PermissionRoutes
										exact
										path="/role-management/edit/:id"
										component={AddRole}
										permission={RoutesValue.MANAGE_ROLE}
									/>

									{/* Customer RoleManagement */}
									<PermissionRoutes
										exact
										path="/customer-role-management"
										component={CustomerRoleManagement}
										permission={RoutesValue.MANAGE_ROLE}
									/>
									<PermissionRoutes
										exact
										path="/customer-role-management/add"
										component={CustomerAddRole}
										permission={RoutesValue.MANAGE_ROLE}
									/>
									<PermissionRoutes
										exact
										path="/customer-role-management/edit/:id"
										component={CustomerAddRole}
										permission={RoutesValue.MANAGE_ROLE}
									/>

									{/* UserManagement */}
									<PermissionRoutes
										exact
										path="/user-management"
										component={UserManagement}
										permission={RoutesValue.MANAGE_USER}
									/>
									<PermissionRoutes
										exact
										path="/user-management/add"
										component={AddUser}
										permission={RoutesValue.MANAGE_USER}
									/>
									<PermissionRoutes
										exact
										path="/user-management/edit/:id"
										component={AddUser}
										permission={RoutesValue.MANAGE_USER}
									/>

									
									{/* Email Management */}
									<PermissionRoutes
										exact
										path="/email-management"
										component={EmailManagement}
										permission={RoutesValue.MANAGE_ROLE}
									/>
									<PermissionRoutes
										exact
										path="/email-management/add"
										component={EditEmail}
										permission={RoutesValue.MANAGE_ROLE}
									/>
									<PermissionRoutes
										exact
										path="/email-management/edit/:id"
										component={EditEmail}
										permission={RoutesValue.MANAGE_ROLE}
									/>

									{/* Pages */}
									{/* <PermissionRoutes
										exact
										path="/pages"
										component={_Pages}
										permission={RoutesValue.MANAGE_PAGES}
									/> */}
									<PrivateRoute
										exact
										path="/pages"
										component={_Pages}
									/>
									{/* <PermissionRoutes
										exact
										path="/pages/add"
										component={_Pages_Add}
										permission={RoutesValue.MANAGE_PAGES}
									/> */}
									<PrivateRoute
										exact
										path="/pages/add"
										component={_Pages_Add}
									/>
									<PermissionRoutes
										exact
										path="/pages/edit/:_id"
										component={_Pages_Add}
										permission={RoutesValue.MANAGE_PAGES}
									/>
									<PermissionRoutes
										exact
										path="/pages-import"
										component={importPages}
										permission={RoutesValue.MANAGE_PAGES}
									/>
									

									{/* Blogs */}
									<PermissionRoutes
										exact
										path="/blogs"
										component={_Blogs}
										permission={RoutesValue.MANAGE_BLOGS}
									/>
									<PermissionRoutes
										exact
										path="/blogs/add"
										component={_Blogs_Add}
										permission={RoutesValue.MANAGE_BLOGS}
									/>
									<PermissionRoutes
										exact
										path="/blogs/edit/:_id"
										component={_Blogs_Add}
										permission={RoutesValue.MANAGE_BLOGS}
									/>

									{/* Slides */}
									<PermissionRoutes
										exact
										path="/slides"
										component={_Slides}
										permission={RoutesValue.MANAGE_BLOGS}
									/>
									<PermissionRoutes
										exact
										path="/slides/add"
										component={_Slides_Add}
										permission={RoutesValue.MANAGE_BLOGS}
									/>
									<PermissionRoutes
										exact
										path="/slides/edit/:_id"
										component={_Slides_Add}
										permission={RoutesValue.MANAGE_BLOGS}
									/>


									{/* CMS Blocks */}
									<PermissionRoutes
										exact
										path="/cms-blocks"
										component={_BLOCK}
										permission={RoutesValue.MANAGE_BLOGS}
									/>
									<PermissionRoutes
										exact
										path="/cms-blocks/add"
										component={_BLOCK_Add}
										permission={RoutesValue.MANAGE_BLOGS}
									/>
									<PermissionRoutes
										exact
										path="/cms-blocks/edit/:_id"
										component={_BLOCK_Add}
										permission={RoutesValue.MANAGE_BLOGS}
									/>


									{/* IP Management */}
									<PermissionRoutes
										exact
										path="/ip-management"
										component={AddIP}
										permission={RoutesValue.MANAGE_ROLE}
									/>

									{/* Taxes Management */}
									<PermissionRoutes
										exact
										path="/taxes"
										component={Taxes}
										permission={RoutesValue.MANAGE_ROLE}
									/>

									{/* Settings */}
									<PermissionRoutes
										exact
										path="/settings"
										component={Settings}
										permission={RoutesValue.MANAGE_ROLE}
									/>

									{/* Social */}
									<PermissionRoutes
										exact
										path="/social"
										component={Social}
										permission={RoutesValue.MANAGE_USER}
									/>
									<PermissionRoutes
										exact
										path="/social/add"
										component={UpsertSocial}
										permission={RoutesValue.MANAGE_USER}
									/>
									<PermissionRoutes
										exact
										path="/social/edit/:_id"
										component={UpsertSocial}
										permission={RoutesValue.MANAGE_USER}
									/>

									{/* FAQ */}
									<PermissionRoutes
										exact
										path="/faq"
										component={FAQ}
										permission={RoutesValue.MANAGE_USER}
									/>
									<PermissionRoutes
										exact
										path="/faq/add"
										component={UpsertFAQ}
										permission={RoutesValue.MANAGE_USER}
									/>
									<PermissionRoutes
										exact
										path="/faq/edit/:_id"
										component={UpsertFAQ}
										permission={RoutesValue.MANAGE_USER}
									/>

									{/* FeedBack */}
									<PermissionRoutes
										exact
										path="/feedback"
										component={Feedback}
										permission={RoutesValue.SHORT_FORM_LEAD}
									/>
									<PermissionRoutes
										exact
										path="/feedback/reply/:_id"
										component={FeedbackResponse}
										permission={RoutesValue.SHORT_FORM_LEAD}
									/>

									{/* Tests */}
									<PermissionRoutes
										exact
										path="/test"
										component={Test}
										permission={RoutesValue.MANAGE_USER}
									/>
									<PermissionRoutes
										exact
										path="/test/add"
										component={UpsertTest}
										permission={RoutesValue.MANAGE_USER}
									/>
									<PermissionRoutes
										exact
										path="/test/edit/:_id"
										component={UpsertTest}
										permission={RoutesValue.MANAGE_USER}
									/>

									{/* Payment*/}
									<PermissionRoutes
										exact
										path="/payment"
										component={Payment}
										permission={RoutesValue.MANAGE_USER}
									/>
									<PermissionRoutes
										exact
										path="/payment/action/:_id"
										component={viewPayment}
										permission={RoutesValue.MANAGE_USER}
									/>

									{/* Aceess Logs*/}
									<PermissionRoutes
										exact
										path="/logs/access"
										component={AccessLogs}
										permission={RoutesValue.MANAGE_USER}
									/>
									<PermissionRoutes
										exact
										path="/logs/access/view"
										component={ViewAccessLog}
										permission={RoutesValue.MANAGE_USER}
									/>

									{/* Logs */}
									<PermissionRoutes
										exact
										path="/logs/login"
										component={Logs_Login}
										permission={RoutesValue.MANAGE_USER}
									/>
									<PermissionRoutes
										exact
										path="/logs/audit"
										component={Logs_Audit}
										permission={RoutesValue.MANAGE_USER}
									/>

									{/* User Notifications.... */}
									<PrivateRoute
										exact
										path="/notifications"
										component={Notifications}
									/>
									{/* Reports */}
									<PermissionRoutes
										exact
										path="/reports/:type"
										component={Reports}
										permission={RoutesValue.MANAGE_USER}
									/>
									
								
									
									{/* <PermissionRoutes exact path='/logs/audit' component={Logs_Audit} permission={RoutesValue.MANAGE_USER} /> */}

									<PrivateRoute
										path="*"
										component={NotFound}
									/>
								</Switch>
							</div>
						</div>
					</div>
					{/* <Footer /> */}
				</div>
			</ConnectedRouter>
		);
	}
}

/*get props*/
function mapStatesToProps(state) {
	return {
		isAdminLoggedIn: state.admin.token ? true : false
	};
}

export default connect(mapStatesToProps)(AppRouter);
