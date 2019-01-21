import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';


class TermsCond extends Component {
  constructor(props){
    super(props);
    /** defining state for component */
    this.state = {
      isLoading:false,
      isLoadingTests:false,
    };

  }
  componentDidMount(){
    window.scroll(0,0)
  }

  render() {
    const {content,tests} =this.state;
    const {match} = this.props;
    return (
      <div className="App">
       <div className="aboutBanner">
          <div className="container">
            <div className="aboutBanInn">
              <div className="aboutBanBx">TRACKINGAPP TERMS AND CONDITIONS</div>
              {/* <div className="breatcrum_Outer">
                  <Breadcrumb tag="nav">
                    <BreadcrumbItem tag="a">Home</BreadcrumbItem>
                    <BreadcrumbItem tag="a">Terms And Conditions</BreadcrumbItem>
                  </Breadcrumb>
              </div>   */}
            </div>
          </div>
        </div>
        <section className="aboutsection">
            <div className="container">
              <ListGroup>
                <ListGroupItem>
                <ListGroupItemHeading>AGREEMENT TERMS</ListGroupItemHeading>
                  <ListGroupItemText>
                  The following terms and conditions govern the use of the TrackingApp website and all content, services and products available at or through the website. The Website is owned and operated by TrackingApp Limited Liability Company. The Website is offered subject to your acceptance without modification of all of the terms and conditions contained herein and all other operating rules, policies (including, without limitation, TrackingApp`s Privacy Policy and procedures that may be published from time to time on this Site by TrackingApp (collectively, the “Agreement”).
                  </ListGroupItemText>
                  <ListGroupItemText>
                    Please read this Agreement carefully before accessing or using TrackingApp’s websites, or its products and services. By accessing or using any part of its sites, you agree to become bound by the terms and conditions of this agreement. If you do not agree to all the terms and conditions of this agreement, then you may choose not to access the Website or use any of TrackingApp’s services. If these terms and conditions are considered an offer by TrackingApp, acceptance is expressly limited to these terms.
                  </ListGroupItemText>
                  <ListGroupItemText>
                  The Website is available only to individuals who are at least 13 years old. By using the Website or downloading the App, you represent and warrant that you are of legal age to form a binding contract with Company in your state of residence and meet all of the preceding eligibility requirements. If you do not meet all of these requirements, you must not access, download or use the Website or the App.
                  </ListGroupItemText>
                  <ListGroupItemText>
                  By accessing or using the services owned or operated by TrackingApp LLC whether through its software application or website, you are accepting and agree to be bound by the terms and conditions set forth herein (“Terms”).
                    </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>CHANGES TO TERMS AND CONDITIONS</ListGroupItemHeading>
                  <ListGroupItemText>
                  TrackingApp reserves the right to modify the Terms at its discretion. If you choose to continue to use the Services after these Terms have been modified, you have agreed to be bound by the modified Terms. If you do not agree to be bound by the modified Terms, then you may choose to opt out of your continued use of its Services. Because our Services may continue to evolve, these Services may change or be discontinued at any time and without notice, at the sole discretion of TrackingApp.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>DOWNLOADING OUR APP</ListGroupItemHeading>
                  <ListGroupItemText>
                  Upon downloading TrackingApp’s App from the Apple App Store, Google Play or other app store, users acknowledge and agree to the following: 
                  <ul className="privacyList">
                    <li>i. These Terms bind the TrackingApp and the User and are not part of any agreement with any App Store. TrackingApp maintains sole ownership of, and responsibility for, its App.</li>
                    <li>ii. Any App Store has no obligation to furnish maintenance or support services with respect to TrackingApp’s App, nor handle any warranty claims.</li>
                    <li>iii. Any and all App Store(s) are not responsible for addressing any claims you may have relating to TrackingApp’s mobile App, including product liability claims, consumer protection claims, intellectual property infringement claims, or any other claim that TrackingApp’s mobile Apps fail to conform with any applicable legal or regulatory requirement.</li>
                  </ul>
                  </ListGroupItemText>
                  <ListGroupItemText>
                  User expressly understands and acknowledges that App Stores are third-party beneficiary of these Terms and have the right to enforce these Terms as it deems appropriate in support of its agreements between the App Stores and its subscribers/users. Compliance with any and all App Stores’ terms of service remain obliged by and between the user and the App Store and do not include TrackingApp and its products and services unless expressly set forth herein.
                    </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>CREATING AN ACCOUNT</ListGroupItemHeading>
                  <ListGroupItemText>
                  To access the Website or the App or some of the resources they offer, you may be asked to provide certain registration details or other information. It is a condition of your use of the App that all the information you provide on the App is correct, current and complete. You agree that all information you provide to register or through the use of any interactive features on the App, is governed by our Privacy Policy, and you consent to all actions we take concerning your information consistent with our Privacy Policy. 
                  </ListGroupItemText>
                  <ListGroupItemText>
                  If you choose, a username, password or any other piece of information as part of our security procedures, you must treat such information as confidential, and you must not disclose it to any other person or entity. You also acknowledge that your account is personal to you and agree not to provide any other person with access to the App.
                    </ListGroupItemText>
                    <ListGroupItemText>
                    You agree to notify us immediately of any unauthorized access to or use of your username or password or any other breach of security. You should use particular caution when accessing your account from a public or shared computer or network so that others are not able to view or record your password or other personal information. We have the right to disable any username, password or another identifier, whether chosen by you or provided by us, at any time in our sole discretion. Including if, in our opinion, you have violated any provision of these Terms of Use. 
                    </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>ACCESSING THE WEBSITE AND THE APP, AND ACCOUNT SECURITY</ListGroupItemHeading>
                  <ListGroupItemText>
           <p> We reserve the right to withdraw or amend the Website or the App, and any service or material we provide on the Website or the App, in our sole discretion without notice. The company may from time to time in its sole discretion develop and provide updates to the App, which may include upgrades, bug fixes, patches, other error corrections, and new features (collectively, “Updates”). Updates may also modify or delete in their entirety certain features and functionality. You agree that Company has no obligation to provide any Updates or to continue to provide or enable any particular features or functionality. We will not be liable if for any reason all or any part of the App is unavailable at any time or for any period. From time to time, we may restrict access to some parts of the Website or the App, or the entire Website or the App, to users, including registered users. You are responsible for:</p>
                  <ul className="privacyList">
                    <li>Making all arrangements necessary for you to have access to, download, install and use the App.</li>
                    <li>Ensuring that all persons who access the App through a mobile device are aware of these Terms and Conditions, and comply with them.</li>
                  </ul>
                  </ListGroupItemText>
                </ListGroupItem>

                <ListGroupItem>
                  <ListGroupItemHeading>ALERTS AND NOTIFICATIONS</ListGroupItemHeading>
                  <ListGroupItemText>
                  As part of TrackingApp’s Services, users may (if enabled) receive push notifications, text messages, alerts, emails, or other types of messages directly sent to through the App’s (“Push Notifications”). You have control over all push notification settings and can opt in or out of these through your settings.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>INTELLECTUAL PROPERTY RIGHTS </ListGroupItemHeading>
                  <ListGroupItemText>
                  The Website, the App and their entire contents, features and functionality (including but not limited to all information, software, text, displays, images, video and audio, and the design, selection and arrangement thereof), except for User Contents (which are licensed to Company pursuant to the User Contents section below), are owned by Company, its licensor or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws.
                  </ListGroupItemText>
                  <ListGroupItemText>
                  These Terms and conditions permit you to use the mobile Application – TrackingApp for your personal, non-commercial use only. Concerning the App and subject to these Terms of Use, Company grants you a limited, non-exclusive and nontransferable license to: 
                  <ul className="privacyList">
                    <li>download, install and use the App for your personal, non-commercial use on a single mobile device owned or otherwise controlled by you (“Mobile Device”) strictly in accordance with these Terms and Conditions, and any end user license agreement or other agreement related to the Mobile Device or applications between you and any third party; and</li>
                    <li>download and use on such Mobile Device the content and services made available in or otherwise accessible through the App, strictly by these Terms of Use and any end user license agreement or other agreement related to the Mobile applications.</li>
                  </ul>
                  </ListGroupItemText>
                  <ListGroupItemText>
                  You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store or transmit any of the material on the Website or the App, except as follows: 
                  <ul className="privacyList">
                    <li>Your Mobile Device may temporarily store copies of such materials in RAM or similar format incidental to your accessing and viewing those materials. </li>
                    <li>You may store files that are automatically cached by your Web browser for display enhancement purposes.</li>
                    <li>You may print or download one copy of a reasonable number of pages of the Website for your own personal, non-commercial use and not for further reproduction, publication or distribution.</li>
                    <li>If we provide social media features with certain content, you may take such actions as are enabled by such features.</li>
                  </ul>
                    </ListGroupItemText>
                    <ListGroupItemText>
                    You must not:
                    <ul className="privacyList">
                    <li>Modify copies of any materials from the Website or the App.</li>
                    <li>Modify, translate, adapt, or otherwise create derivative works or improvements of the App.</li>
                    <li>Reverse engineer, disassemble, decompile, decode or otherwise attempt to derive or gain access to the source code of the Website, the App or any part thereof. </li>
                    <li>Use any illustrations, photographs, video or audio sequences or any graphics separately from the accompanying text. </li>
                    <li>Delete or alter any copyright, trademark or other proprietary rights notices from copies of materials from this site. If you print, copy, modify, download or otherwise use or provide any other person with access to any part of the Website, or the App in breach of these Terms and Conditions, your right to use the App will cease immediately and you must, at our option, return or destroy any copies of the materials you have made.</li>
                  </ul>
                    </ListGroupItemText>
                    <ListGroupItemText>
                    No right, title or interest in or to the App or any content on the App is transferred to you, and The Company reserves all rights not expressly granted.
                    </ListGroupItemText>
                    <ListGroupItemText>
                    Any use of the Website or the App not expressly permitted by these Terms and Conditions is a breach of these Terms and Conditions and may violate copyright, trademark and other laws.
                    </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>TRADEMARKS</ListGroupItemHeading>
                  <ListGroupItemText>
                  The Company name; “TrackingApp”, the Company logo and all related names, logos, product and service names, designs and slogans are trademarks of the Company or its affiliates or licensors. You must not use such marks without the prior written permission of The Company.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>PROHIBITED USES</ListGroupItemHeading>
                  <ListGroupItemText>
                  You may use the Website and the App – TrackingApp only for lawful purposes and by these Terms and Conditions. You agree not to use the Website or the App:
                 <ul className="privacyList">
                 <li>a. In any way that violates any applicable federal, state, local or international law or regulation (including, without limitation, any laws regarding the export of data or software to and from the US or other countries) Including, but not limited to GDPR compliance.</li>
                 <li>b. To exploit, harming or attempting to exploit or harm minors in any way by exposing them to inappropriate content, asking for personally identifiable information or otherwise.</li>
                 <li>c. To send, knowingly receive, upload, download, use or re-use any material which does not comply with the Content Standards set out in these Terms and Conditions.</li>
                 <li>d. To transmit, or procure the sending of, any advertising or promotional material, including any “junk mail”, “chain letter” or “spam” or any other similar solicitation.</li>
                 <li>e. To impersonate or attempt to impersonate TrackingApp, our employee, another user or any other person or entity (including, without limitation, by using e-mail addresses associated with any of the preceding).</li>
                 <li>f. To engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of the App, or which, as determined by us, may harm Company or users of the App or expose them to liability. </li>
                 <li>g. To use the Website or the App in any manner that could disable, overburden, damage, or impair the site or interfere with any other party’s use of the App.</li>
                 <li>h. To use any robot, spider or another automatic device, process or means to access the Website or the App for any purpose, including monitoring or copying any of the material on the Website or the App.</li>
                 <li>i. To use any manual process to monitor or copy any of the material on the Website or the App or for any other unauthorized purpose without our prior written consent.</li>
                 <li>j. To use any device, software or routine that interferes with the proper working of the Website or the App.</li>
                 <li>k. To introduce any viruses, Trojan horses, worms, logic bombs or other material which is malicious or technologically harmful.</li>
                 <li>l. To attack the App via a denial-of-service attack or a distributed denial-of-service attack.</li>
                 </ul>
                  </ListGroupItemText>
                  
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>ILLEGAL, FRAUDULENT OR ILLEGITIMATE BEHAVIOR </ListGroupItemHeading>
                  <ListGroupItemText>
                  Illegal, fraudulent or illegitimate behavior undermines the trust on which the TrackingApp platform is based, and TrackingApp LLC will seek to enforce its rights to the full extent of the law or in equity. In addition to any other rights and remedies available to TrackingApp LLC by law or equity, the Company may suspend or deactivate any account(s) associated with this type of illegal or illegitimate activity, including without limitation fraud, abusing promotions, for purposes of circumventing or attempting to circumvent Company’s messaging tools or platform; 
                  </ListGroupItemText>
                  <ListGroupItemText>
                  Notwithstanding the preceding, nothing in these Terms and Conditions shall be interpreted to prevent Users from communicating offline or off the App for legal and illegal purposes.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>TERMINATION </ListGroupItemHeading>
                  <ListGroupItemText>
                  We have the right to:
                  <ul className="privacyList">
                    <li>Take any action with respect to any User that we deem necessary or appropriate in our sole discretion, including if we believe that such User violates the Terms of Use, including the Content Standards, infringes any intellectual property right or another right of any person or entity, threatens the personal safety of users of the App or the public or could create liability for Company.</li>
                    <li>Take appropriate legal action, including without limitation, refer to law enforcement, for any illegal or unauthorized use of the App.</li>
                    <li>Terminate or suspend your access to all or part of App for any or no reason, including without limitation, any violation of these Terms and conditions. Without limiting the preceding, we have the right to fully cooperate with any law enforcement authorities or court order requesting or directing us to disclose the identity or other information of anyone posting any materials on or through the App.</li>
                    </ul>
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>CONTENT STANDARDS</ListGroupItemHeading>
                  <ListGroupItemText>
                  These content standards apply to all User Contents. User Contents must in their entirety comply with all applicable federal, state, local and international laws and regulations. User Contents must not: Be false or likely to deceive any person, promote any illegal activity, or advocate, promote or assist any unlawful act, cause annoyance, inconvenience or needless anxiety or be likely to upset, embarrass, alarm or annoy any other person, impersonate any person, or misrepresent your identity or affiliation with any person or Organization or involve commercial activities or sales, such as contests, sweepstakes and other sales promotions, barter or advertising. 
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>LINKS FROM THE SITE</ListGroupItemHeading>
                  <ListGroupItemText>
                  If our Website or the App contains links to other sites and resources provided by third parties, these links are provided for your convenience only. We have no control over the contents of those sites or resources and accept no responsibility for them or for any loss or damage that may arise from your use of them. If you decide to access any of the third party websites linked to the Website or the App, you do so entirely at your own risk and subject to the terms and conditions of use for such websites.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>DISCLAIMER OF WARRANTY </ListGroupItemHeading>
                  <ListGroupItemText>
                  TrackingApp agrees to employ reasonable efforts to correct any discovered defects in the App or website. However, the user assumes any and all risk associated with their use. TrackingApp’s Website, App and Services are provided on an “as is” and “as available” basis and without any representation, warranty or guarantee that the App and Services will be provided uninterrupted, error-free, virus-free, or that defects can or will be corrected. To the maximum extent permitted by applicable law, we disclaim all warranties regarding the app and service, whether express, implied, or statutory, including the warranties of title, merchantability, fitness for any particular purpose, or non-infringement. If applicable law requires any warranties with respect to our App or Services, all such warranties are limited in duration to thirty (30) days from the date of your first use or the minimum duration allowed by law.
All implied warranties of merchantability or fitness for a particular purpose with respect of the products are limited to the duration of the applicable express warranty. All other express or implied conditions, representations and warranties, including any implied warranty of non-infringement, are disclaimed. Some jurisdictions do not allow limitations on how long an implied warranty lasts; please review the applicable consumer laws in your jurisdiction for further clarity. This warranty provides specific legal rights; others may be available to users depending upon jurisdiction.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>LIMITATION ON LIABILITY </ListGroupItemHeading>
                  <ListGroupItemText>
                  IN NO EVENT WILL TRACKINGAPP LLC ITS AFFILIATES OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE WEBSITE, THE APP, ANY WEBSITES LINKED TO EITHER THE WEBSITE OR THE APP, OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT OR OTHERWISE, EVEN IF FORESEEABLE. THE PRECEDING DOES NOT AFFECT ANY LIABILITY WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
                  </ListGroupItemText>
                 
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>INDEMNIFICATION</ListGroupItemHeading>
                  <ListGroupItemText>
                  You agree to indemnify, protect and hold harmless to TrackingApp LLC, our subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms of Use or the documents they incorporate by reference or your infringement of any law or the rights of a third-party.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>SEVERABILITY </ListGroupItemHeading>
                  <ListGroupItemText>
                  In the case that any provision of these Terms of Service is discovered to be unlawful, null or unenforceable, such provision shall notwithstanding be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be viewed to be cut off from these Terms of Service, such determination shall not affect the credibility and enforceability of any other remaining provisions.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>YOUR COMMENTS AND CONCERNS </ListGroupItemHeading>
                  <ListGroupItemText>
                  All other feedback, comments, requests for technical support and other communications relating to the Application should be directed to <a href="mailto:help@trackingapp.com">help@trackingapp.com</a>
                  </ListGroupItemText>
                </ListGroupItem>
              




              </ListGroup>             
            </div>
        </section>
      </div>
    );
  }

}
export default connect()(TermsCond);
