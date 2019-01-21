import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Panel, PanelGroup } from "react-bootstrap";

/**import RoutesValue */
import { RoutesValue } from "../common/options";

/*import images*/

class SideBar extends Component {
  constructor(props) {
    super(props);
    /*bind this with current class object*/
    this.renderPrivteRoute = this.renderPrivteRoute.bind(this);
    this.renderPublicRoute = this.renderPublicRoute.bind(this);
    this.renderRoute = this.renderRoute.bind(this);
  }

  render() {
    /*if user is not logged in then return empty */
    if (!this.props.isAdminLoggedIn) return null;

    return (
      <div>
        {/* <!-- BEGIN SIDEBAR --> */}
        <div className="page-sidebar-wrapper">
          <div className="page-sidebar navbar-collapse collapse">
            <div className="page-sidebar-menu">
              <PanelGroup accordion id="accordion-example">
                {/* Dashboard */}
                {this.renderRoute("Dashboard", "/", "fa fa-home")}
                {/* Users */}
                {this.renderRoute("Users", "/user", "fa fa-user")}
                {/* {this.renderRoute("Cluster View", "/cluster-view", "fa fa-users")} */}

                {/* Active User */}
                {this.renderPrivteRoute("Active User", "fa fa-users", [
                  {
                    route: "/cluster-view/cluster",
                    value: RoutesValue.MANAGE_ROLE,
                    name: "Cluster View"
                  },
                  {
                    route: "/cluster-view/noncluster",
                    value: RoutesValue.MANAGE_USER,
                    name: "Non-Cluster View"
                  }
                ])}

                {/* Admin Management */}
                {this.renderPrivteRoute("Admin Management", "fa fa-user", [
                  {
                    route: "/role-management",
                    value: RoutesValue.MANAGE_ROLE,
                    name: "Manage Admin Roles"
                  },
                  {
                    route: "/user-management",
                    value: RoutesValue.MANAGE_USER,
                    name: "Manage Admin Users"
                  }
                ])}


                {/*CMS */}
                {this.renderPrivteRoute("CMS", undefined, [
                  {
                    route: "/pages",
                    value: RoutesValue.MANAGE_PAGES,
                    name: "Pages"
                  },
                  {
                    route: "/blogs",
                    value: RoutesValue.MANAGE_BLOGS,
                    name: "Blogs"
                  },
                  {
                    route: "/slides",
                    value: RoutesValue.MANAGE_BLOGS,
                    name: "Press Releases"
                  },
                  {
                    route: "/cms-blocks",
                    value: RoutesValue.MANAGE_BLOGS,
                    name: "CMS Blocks"
                  },
                  {
                    route: "/social",
                    value: RoutesValue.MANAGE_BLOGS,
                    name: "Customer Stories"
                  },
                  {
                    route: "/ads",
                    value: RoutesValue.MANAGE_BLOGS,
                    name: "Photo Gallery"
                  },
                  /*
                                    {
                                        route: "/social",
                                        value: RoutesValue.MANAGE_BLOGS,
                                        name: "Social"
                                    },*/
                  {
                    route: "/reviews",
                    value: RoutesValue.MANAGE_BLOGS,
                    name: "Reviews"
                  },
                  {
                    route: "/faq",
                    value: RoutesValue.MANAGE_BLOGS,
                    name: "FAQ"
                  }
                ])}
              

                {/* Email Templates */}
                {this.renderPrivteRoute("Email Templates", "fa fa-envelope", [
                  {
                    route: "/email-management",
                    value: RoutesValue.MANAGE_ROLE,
                    name: "Email Templates"
                  }
                ])}

                {/* Profile */}
                {this.renderPrivteRoute("Profile", "fa fa-user", [
                  {
                    route: "/profile",
                    value: RoutesValue.PROFILE,
                    name: "Profile"
                  },
                  {
                    route: "/change-password",
                    value: RoutesValue.CHANGE_PASSWORD,
                    name: "Change Password"
                  }
                ])}

                {/*Configurations */}
                {this.renderPrivteRoute("Configurations", "fa fa-cogs", [
                  {
                    route: "/settings",
                    value: RoutesValue.MANAGE_PAGES,
                    name: "Settings"
                  }
                  /*{
                                            route: "/taxes",
                                            value: RoutesValue.MANAGE_BLOGS,
                                            name: "Taxes"
                                        },*/
                  /*  {
                                            route: "/ip-management",
                                            value: RoutesValue.MANAGE_BLOGS,
                                            name: "IP Management"
                                        } */
                ])}

                {/*Reports */}
                {/*this.renderPrivteRoute(
                                    "Reports",
                                    "fa fa-file",
                                    [
                                        {
                                            route: "/reports/customer",
                                            value: RoutesValue.MANAGE_PAGES,
                                            name: "Customer Reports"
                                        },
                                        {
                                            route: "/reports/user",
                                            value: RoutesValue.MANAGE_PAGES,
                                            name: "User Reports"
                                        },
                                        {
                                            route: "/reports/payment",
                                            value: RoutesValue.MANAGE_BLOGS,
                                            name: "Payment Reports"
                                        },
                                        {
                                            route: "/reports/testrequest",
                                            value: RoutesValue.MANAGE_BLOGS,
                                            name: "Test Request Reports"
                                        },
                                        {
                                            route: "/reports/shipping",
                                            value: RoutesValue.MANAGE_BLOGS,
                                            name: "Shipping Reports "
                                        }
                                    ]
                                )*/}

                {/*Logs */}
                {this.renderPrivteRoute("Logs", "fa fa-cog", [
                  {
                    route: "/logs/login",
                    value: RoutesValue.MANAGE_PAGES,
                    name: "Login Logs"
                  },
                  {
                    route: "/logs/access",
                    value: RoutesValue.MANAGE_BLOGS,
                    name: "Access Logs"
                  },
                  {
                    route: "/logs/audit",
                    value: RoutesValue.MANAGE_BLOGS,
                    name: "Audit Logs"
                  }
                ])}

               
              </PanelGroup>
            </div>
          </div>
        </div>
        {/* <!-- END SIDEBAR --> */}
      </div>
    );
  }

  renderPrivteRoute(heading, icon = "fa fa-bullseye", array) {
    const { permissionsArray } = this.props;

    return (
      <Panel eventKey={Math.random()}>
        <Panel.Heading>
          <Panel.Title toggle>
            <div>
              <i className={icon} /> &nbsp; {`${heading}`}
              <i className="fa fa-angle-left" style={{ float: "right" }} />
            </div>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body collapsible bsClass="page-sidebar-menu">
          {array.map((e, index) => {
            if (!permissionsArray.includes(e.value)) return null;
            else
              return (
                <p key={index}>
                  <Link to={e.route}>{e.name}</Link>
                </p>
              );
          })}
        </Panel.Body>
      </Panel>
    );
  }

  renderPublicRoute(heading, icon = "fa fa-bullseye", array, omitIcon = false) {
    return (
      <Panel eventKey={Math.random()}>
        <Panel.Heading>
          <Panel.Title toggle>
            <div>
              <i className={icon} /> &nbsp; {`${heading}`}
              {!omitIcon && (
                <i className="fa fa-angle-left" style={{ float: "right" }} />
              )}
            </div>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body collapsible>
          {array.map((e, index) => {
            return (
              <p key={index}>
                <Link to={e.route}>{e.name}</Link>
              </p>
            );
          })}
        </Panel.Body>
      </Panel>
    );
  }

  renderRoute(heading, route, icon = "fa fa-bullseye") {
    return (
      <Panel eventKey={Math.random()} className="no-child">
        <Panel.Body>
          <i className={icon} /> &nbsp;
          <Link to={route}>{heading}</Link>
        </Panel.Body>
      </Panel>
    );
  }
}

/*get props*/
function mapStatesToProps(state) {
  let permissionsArray =
    state.admin && state.admin.permissions ? state.admin.permissions : [];
  return {
    isAdminLoggedIn: state.admin.token ? true : false,
    permissionsArray: permissionsArray
  };
}

export default connect(mapStatesToProps)(SideBar);
