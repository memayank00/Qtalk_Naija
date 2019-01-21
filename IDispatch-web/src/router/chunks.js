import LoadableWrapper from '../router/Loadable.config';


export const HomePage = LoadableWrapper({
	loader: () => import("../components/HomePage/HomePage.js")
});

export const PrivacyPolicy = LoadableWrapper({
	loader: () => import("../components/PrivacyPolicy/PrivacyPolicy.js")
});

export const TermsCond = LoadableWrapper({
	loader: () => import("../components/TermsCond/TermsCond.js")
});

export const Aboutus = LoadableWrapper({
	loader: () => import("../components/Aboutus/Aboutus.js")
});

export const Contactus = LoadableWrapper({
	loader: () => import("../components/Contactus/Contactus.js")
});





