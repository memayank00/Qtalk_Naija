import Http from '../services/http';

export function getTaxesCall(data) {
    return new Promise((resolve, reject) => {
        Http.Request("get", window.admin.getTaxes, data.data)
            .then(response => { resolve(response) })
            .catch(error => { reject(error) });
    });
}