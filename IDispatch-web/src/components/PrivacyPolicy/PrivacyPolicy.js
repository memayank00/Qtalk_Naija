import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
/**Components */
//import HomeBanner from './Banner.js';
//import PerformanceCycle from './PerformanceCycle.js';
//import TypeTest from './TypeTest.js';
//import GetStarted from '../GetStarted/GetStarted.js';
//import ResestPassword from '../Popup/ResestPassword';
/**services */
import HTTP from '../../services/http';
import session from '../../services/session';
/**endpoints */
import { getTestsHomePage, getPagesContent} from '../../utils/endpoints';
/**actions */
//import { POPUP } from '../common/actions.js';
/**CSS */
import './PrivacyPolicy.css';
//import ErrorBoundry from "../common/errorBoundry";


class PrivacyPolicy extends Component {
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
              <div className="aboutBanBx">TRACKINGAPP PRIVACY POLICY</div>
              <div className="breatcrum_Outer">
                  <Breadcrumb tag="nav">
                    <BreadcrumbItem tag="a">Home</BreadcrumbItem>
                    <BreadcrumbItem tag="a">Privacy Policy</BreadcrumbItem>
                  </Breadcrumb>
              </div>  
            </div>
          </div>
        </div>
        <section className="aboutsection">
            <div className="container">
              <ListGroup>
                <ListGroupItem>
                <ListGroupItemHeading>PRIVACY NOTICE</ListGroupItemHeading>
                  <ListGroupItemText>
                  This is the privacy notice of TrackingApp website and Mobile Application. The App is owned and operated by TrackingApp Limited Liability Company, a company registered in the United States. In this document, "we", "our", or "us" refer to TrackingApp. This Privacy Policy sets out the basis on which TrackingApp Services collects, processes and uses your personal data. We are committed to protecting your privacy and personal information. Please read this policy carefully to understand our policies and practices regarding your information and how we will treat it. If you do not agree with our policies and practices, your choice is to not access or download or install the App. By accessing or downloading, installing and/or accessing or using the App, you agree to this privacy policy. This policy may change from time to time. Your continued use of the App after we make changes is deemed to be acceptance of those changes, so please check the policy periodically for updates.
                   
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>INTRODUCTION </ListGroupItemHeading>
                  <ListGroupItemText>
                  <p>This policy applies to information we collect:</p>

                  <ul className="privacyList">
                      <li> When you download our mobile application from Apple or Google Play Service,</li>
                      <li>when you, install, register with, access or use the TrackingApp Mobile App or our website;</li>
                      <li>in an email, text, and other electronic messages between you and other user and/or Company via the App;</li>
                      <li>when you interact with our advertising Content on third-party websites and services if those applications or advertising include links to this policy.</li>
                    </ul> 
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>DEFINITION OF PERSONAL INFORMATION</ListGroupItemHeading>
                  <ListGroupItemText>
                  In this Privacy Policy, the term “personal information” means any information relating to an identified or identifiable natural person; an identifiable person is one who can be identified, directly or indirectly, in particular by reference to a name, an identification number, or, in certain circumstances, location information, an IP address or the unique identifier allocated to each TrackingApp Mobile Application or website.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>PERSONAL INFORMATION THAT WE COLLECT</ListGroupItemHeading>
                  <ListGroupItemText>
                    <p>When you register for our Services we will collect and store certain personal information necessary to set up your account with us, such as your first and last name, home address, and email address. We will further generate, and store with your account, a unique identifier allocated to each TrackingApp tracker that will be registered for your account.</p>
                 
                    <p>Whenever you use our Services, we may further collect additional information about your usage of our Services, including by making use of third party web analysis tools, such as your frequency and scope of your use of the Services, the duration of your online sessions, information you read, content that you use or create, advertisements that you view or click on, your communications with other users and third parties, information about the smart device on which you have installed the TrackingApp mobile app, and the geographic location of the computer system or device that you are using to log-into our Services.</p>
                   <p>We will further collect any personal information you may actively provide to our service personnel if you contact our customer support hotline through our Website and/or TrackingApp mobile app.</p>
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>HOW WE USE AND PROCESS YOUR PERSONAL INFORMATION</ListGroupItemHeading>
                  <ListGroupItemText>
           <p> We may use and process your personal information to provide you with support and handle requests and complaints; </p>
                  <ul className="privacyList">
                    <li>To send you updates, notices, and additional information related to the Services;</li>
                    <li>To create anonymous, statistical and aggregated data and reports (i.e., in a form where such data does not enable the identification of a specific user);</li>
                    <li>To comply with any applicable law and assist law enforcement agencies under any applicable law, when we have a good faith belief that our cooperation with the law enforcement agencies is legally mandated or meets the applicable legal standards and procedures;</li>
                    <li>To prevent misappropriation, infringements, identity theft and other illegal activities and misuse of the Services.</li>
                  </ul>
                  </ListGroupItemText>
                </ListGroupItem>

                <ListGroupItem>
                  <ListGroupItemHeading>OUR USE AND SHARING OF YOUR PERSONAL INFORMATION</ListGroupItemHeading>
                  <ListGroupItemText>
                  <p>We may share your personal information with our third party service providers or affiliates, as authorized by us to collect, process and use your personal information as data processors on our behalf, such as, for instance, cloud based and hosting services, technical service providers, mail carriers, communication agencies and customer support service providers; these parties may be located in countries outside of your jurisdiction, including but not limited to the USA.</p>
                  <p>An updated list of the parties engaged by us for the processing of your personal information may be requested from us at any time.Other than as indicated above, we will not share your personal information with any third parties, unless compelled by law to do so or if you have given your prior consent.</p>
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>OUR USE AND SHARING OF AGGREGATED INFORMATION</ListGroupItemHeading>
                  <ListGroupItemText>
                  We use information about our users’ website activities and usage of our Services (including location information) in anonymous, statistical or aggregated form, i.e., in a form that does not enable the identification of a specific user, to properly operate the Services, to improve the quality of the Services, to enhance your experience, to create new services and features,
                  including customized services, to change or cancel existing content or service, and for further internal, commercial and statistical purposes.
                  We also use anonymous, statistical or aggregated information collected on the Services, in a form that does not enable the identification of a specific user, by posting, disseminating, transmitting or otherwise communicating or making available such information to users of the Services or to our service providers.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>COOKIES</ListGroupItemHeading>
                  <ListGroupItemText>
                  <p>Cookies are small text files that our Services ask to place on your computer’s hard drive and onto your mobile device’s memory. If your browser is set to accept cookies, then your browser adds the text in a small file.</p>
                  <p>We use cookie technology for various purposes, such as to facilitate your use of our Services, e.g., to remember you when you return to our Website, identify you when you sign-in, authenticate your access, enable your use of specific functionalities, keep track of your specified preferences or choices, tailor content to your preferences or geographic region, display personalized browsing history, or provide technical support.</p>
                  <p>We may further use cookies to monitor site usage, conduct research and diagnostics to improve our content, products, and services, and to help us analyze web traffic in general.</p>
                  <p>Cookies also enable us to display interest-based advertising on our Website using information you make available to us when you interact with our sites, content, or services. Interest-based ads are displayed to you based on cookies linked to your online activities.</p>
                  <p>Our cookies expire after they have fulfilled their purpose. Our Services use cookies that expire when you close your browser (i.e., session cookies) or that expire after a set period of time (i.e., persistent cookies). Cookies that are placed by third parties (see below) will have their expiration period determined by the third party, not us.</p>
                  <p>You can decide whether or not to accept cookies. The “Help” feature on most browsers will explain how to prevent your browser from accepting new cookies, how to have the browser notify you when you receive a new cookie, or how to disable cookies altogether. Because cookies allow you to take advantage of many of our online features and functionalities, consider leaving them turned on.</p>
                  <p>While our Website and TrackingApp mobile application at this time do not recognize automated browser signals regarding tracking mechanisms, such as “do not track” instructions, you can generally express your privacy preferences regarding the use of most cookies and similar technologies through your web browser, as indicated above.</p>
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>DISCLOSURE OF YOUR INFORMATION</ListGroupItemHeading>
                  <ListGroupItemText>
                  <p>We may disclose aggregated information about our users and information that does not identify any individual without restriction.  We may disclose personal information that we collect, or you provide as described in this privacy policy:</p>
                 <ul className="privacyList">
                 <li>To contractors, service providers, and other third parties we use to support our business and who are bound by confidentiality obligations to keep personal information confidential and use it only for the purposes for which we disclose it to them.</li>
                 <li>To fulfil the purpose for which you provide it.</li>
                 <li>For any other purpose disclosed by us when you provide the information with your consent.</li>
                 <li>To comply with any court order, law, or legal process, including to respond to any government or regulatory request.</li>
                 <li>To enforce or apply our Terms of Use and other agreements, including for billing and collection purposes.</li>
                 <li>If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of the Company, our customers, or others. This includes exchanging information with other companies and organisations for fraud protection and credit risk reduction.</li>
                 </ul>
                 <p>We strive to provide you with choices regarding the personal information you provide to us. We have created mechanisms to provide you with the following control over your information:  </p>
                 <p>Location Information. You can choose whether or not to allow the App to collect and use real-time information about your mobile device’s location through the device’s privacy settings. If you block the use of location information, some parts of the App may then be inaccessible or not function properly.</p>
                  </ListGroupItemText>
                  
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>CONTROLLING YOUR PERSONAL INFORMATION</ListGroupItemHeading>
                  <ListGroupItemText>
                  You have the right, at any time, to know whether your personal information has been stored and can consult us to learn about their contents and origin, to verify their accuracy or to ask for them to be supplemented, cancelled, updated or corrected, or for their transformation into anonymous format or to block any of your personal information, as well as to oppose their processing for any and all legitimate reasons. Requests should be sent to us at the contact information set out below. 
                  <p>If you request the deletion of your account and your personal information, we will delete such information, however please note we may not delete information from our back-up systems.</p>
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>INFORMATION SECURITY</ListGroupItemHeading>
                  <ListGroupItemText>
                  We implement commercially reasonable systems, applications and procedures to secure your personal information, to minimize the risks of theft, damage, loss of information, or unauthorized access, disclosure, modification or use of information. However, these measures are unable to provide absolute assurance. Therefore, although we take great efforts to protect your personal information, we cannot guarantee and you cannot reasonably expect that our databases will be immune from any wrongdoings, malfunctions, unlawful interceptions or access, or other kinds of abuse and misuse.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>HОW LONG DO WE RETAIN PЕRЅОNАL DАTА? </ListGroupItemHeading>
                  <ListGroupItemText>
                  Wе еndеаvоr to only соllесt personal dаtа thаt are necessary for the purposes fоr whiсh thеу аrе соllесtеd, and tо rеtаin ѕuсh data fоr nо lоngеr thаn iѕ nесеѕѕаrу fоr ѕuсh рurроѕеѕ. Thе length оf time реrѕоnаl dаtа iѕ rеtаinеd, аnd сritеriа for dеtеrmining thаt timе, аrе dependent on thе nаturе of the personal dаtа and thе рurроѕе fоr whiсh it was рrоvidеd. Fоr еxаmрlе, fоr уоur реrѕоnаl dаtа related to mаnаging уоur account (ѕuсh as nаmе, email address, аnd ассоunt соntеnt and preferences) are mаintаinеd for аѕ lоng аѕ they are rеtаinеd bу уоu within уоur ассоunt. Othеr dаtа, ѕuсh as rесоrdѕ оf уоur activity within the application, аrе tурiсаllу mаintаinеd оnlу fоr a ѕhоrt period before bеing аnоnуmizеd оr рѕеudоnуmizеd. Additional infоrmаtiоn mау be рrоvidеd in thе Suррlеmеnt applicable tо the product оr service уоu are using. Yоu mау соntасt Uѕ tо оbtаin аdditiоnаl infоrmаtiоn аbоut rеtеntiоn оf уоur реrѕоnаl data.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>CHANGES TO THIS PRIVACY POLICY</ListGroupItemHeading>
                  <ListGroupItemText>
                  We reserve the right to make changes to this Privacy Policy at any time by giving notice to you on this page and sending an email notice to you if you are a registered user. If you object to any of the changes to this Privacy Policy, you must cease using the Services and may request us to erase your personal information. Unless stated otherwise, the then-current privacy policy applies to all personal information we have about you.
                  <p>If there are any changes to this Privacy Policy, they will be posted on the Website and in the app and sent to the last email address you provided (if applicable). Any changes will be effective immediately after their initial posting or after the email was sent. if we amend this Privacy Policy to comply with legal requirements, the amendments will become effective immediately upon their initial posting, or as required.</p>
                  <p>You agree to be bound by any of the changes made in the terms of this Privacy Policy. Continuing to use the Services after being notified of such changes will indicate your acceptance of the amended terms. If you do not agree with any of the amended terms, you must cease any further use of the Services.</p>
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>CONTACT INFORMATION</ListGroupItemHeading>
                  <ListGroupItemText>
                  To ask questions or comment about this privacy policy and our privacy practices, contact us at <a href="mailto:help@trackingapp.com">help@trackingapp.com</a>
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>GDPR COMPLIANCE</ListGroupItemHeading>
                  <ListGroupItemText>
                  The current Data Protection Directive (officially Directive 95/46/EC) defines an individual’s consent as “any freely given specific and informed indication of his wishes by which the data subject signifies his agreement to personal data relating to him/her being processed.” Personal data must be collected for specified, explicit and legitimate purposes relative to the purposes for which they are processed.
                  </ListGroupItemText>
                  <ListGroupItemText>
                  In regards to GDPR regulations ‘signing-up’ into TrackingApp Mobile Application and Website ensures:
                  <ul className="privacyList">
                  <li>A. Clear indication that the consent of users are unambiguous and involve an explicit affirmative action.</li>
                  <li>B. Users consent are separated from other terms and conditions.</li>
                  <li>C. According to GDPR, our Website and/or Application has no pre-ticked opt-in boxes.</li>
                  <li>D. It requires granular consent for distinct processing operations.</li>
                  <li>E. Your right to withdraw consent at any time is equally guaranteed.</li>
                  </ul>
                    </ListGroupItemText>
                </ListGroupItem>




              </ListGroup>             
            </div>
        </section>
      </div>
    );
  }

}
export default connect()(PrivacyPolicy);
