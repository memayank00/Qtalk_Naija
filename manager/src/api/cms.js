import Http from '../services/http';

export function getCMSCall(data){
	return new Promise((resolve, reject) => {
		Http.Request("get",window.admin.getCMS, data.data)
		.then(response => {resolve(response)})
		.catch(error => { reject(error)});
	});
}

export function upsertCMSCall(data){
	return new Promise((resolve, reject) => {
		Http.Request("post",window.admin.upsertCMS, data.data)
		.then(response => {resolve(response)})
		.catch(error => { reject(error)});
	});
}

export function deleteCMSCall(data){
	return new Promise((resolve, reject) => {
		Http.Request("put",window.admin.deleteCMS, data.data)
		.then(response => {resolve(response)})
		.catch(error => { reject(error)});
	});
}