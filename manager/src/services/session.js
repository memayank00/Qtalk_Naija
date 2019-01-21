import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default class Session {
	

	static setSession(cookie, data){
		sessionStorage.setItem(window._env.prefix+cookie, window.btoa(JSON.stringify(data)), { path: '/' });
	}

	static getSession(cookie){
		let data = sessionStorage.getItem(window._env.prefix+cookie);
		return data?JSON.parse(window.atob(data)):'';
	}

	static clearSession(cookie){
		sessionStorage.removeItem(window._env.prefix+cookie);
	}

	static setSessionCookie(cookie, data){
		cookies.set(window._env.prefix+cookie, window.btoa(JSON.stringify(data)), { path: '/' });
	}

	static getSessionCookie(cookie){
		let data = cookies.get(window._env.prefix+cookie);
		return data?JSON.parse(window.atob(data)):'';
	}

	static clearSessionCookie(cookie){
		cookies.remove(window._env.prefix+cookie);
	}
}