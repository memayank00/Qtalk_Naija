import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default class Session {
	
	static set(cookie, data, type = 'session'){
		if (type ==='session'){
			/**set data into session storage */
			sessionStorage.setItem(window._env.app.prefix + cookie, window.btoa(JSON.stringify(data)));
		} else if (type === 'localstorage') {
			/**set data into local storage */
			localStorage.setItem(window._env.app.prefix + cookie, window.btoa(JSON.stringify(data)));
		} else{
			/** set data into cookies */
			cookies.set(window._env.app.prefix + cookie, window.btoa(JSON.stringify(data)), { path: '/' });
		}

		return true;
	}

	static get(cookie, type = 'session'){
		let data;

		if (type === 'session') {
			/** get data from session storage */
			data = sessionStorage.getItem(window._env.app.prefix + cookie);
		} else if (type === 'localstorage') {
			/** get data from local storage */
			data = localStorage.getItem(window._env.app.prefix + cookie);
		} else{
			/** get data from cookies */
			data = cookies.get(window._env.app.prefix + cookie);
		}
		
		return data?JSON.parse(window.atob(data)):'';
	}

	static clear(cookie, type = 'session'){
		if (type === 'session') {
			/** remove data from session storage */
			sessionStorage.removeItem(window._env.app.prefix+cookie);
		} else if (type === 'localstorage') {
			/** remove data from session storage */
			localStorage.removeItem(window._env.app.prefix + cookie);
		} else{
			/** remove data from cookies */
			cookies.remove(window._env.app.prefix + cookie);
		}

		return true;
	}
}