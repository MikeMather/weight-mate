import constant from './constants';

const Request = {

    post: (route, data) => {
        return fetch(constant.BASE_URL + route, {
            method: "POST",
            headers: {
                'Authorization': 'JWT ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then(res => {
                if (res.ok){
                    return res.json()
                }
            })
    },

    get: (route) => {
        return fetch(constant.BASE_URL + route, {
            method: "GET",
            headers: {
                'Authorization': 'JWT ' + localStorage.getItem('token')
            }
            })
            .then(res => {
                if (res.ok){
                    return res.json()
                }
            })
    },

    delete: (route) => {
        return fetch(constant.BASE_URL + route, {
            method: "DELETE",
            headers: {
                'Authorization': 'JWT ' + localStorage.getItem('token')
            }
            })
            .then(res => {
                if (res.ok){
                    return res.json()
                }
            })
    },

    postWithoutAuth: (route, data) => {
        return fetch(constant.BASE_URL + route, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then(res => {
                if (res.ok){
                    return res.json()
                }
            })
    },

}

export default Request