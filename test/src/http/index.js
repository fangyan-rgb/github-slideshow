import axios from 'axios';
import qs from 'qs';
import store from '@/store';
import { message } from '../utils/message-box';
import {
    clearSessionStorage,
    getSessionStorage
} from '@/utils/storage';
import CONFIG from '../assets/js/config'
import router from '../router'

const rootApi = CONFIG.PRODUCTION_PATH  + '/api';

const devApiPre = '/api'

let http = axios.create({
    timeout: '50000'
});

let httpFile = axios.create({
    timeout: '50000',
    headers:{
        'Content-Type':'multipart/form-data'
    }
});

let loginLttp = axios.create({
    timeout: '20000',
    headers:{
        'Content-Type':'multipart/form-data'
    }
});

http.interceptors.request.use(config => {
    store.commit('SAVE_LOADING_STATE', true);
    return config;
}, error => {
    console.log(error)
});

http.interceptors.response.use(response => {
    store.commit('SAVE_LOADING_STATE', false);
    return response;
}, error => {
    if (error.response.status === 401) {
        if (process.env.NODE_ENV == 'production') {
            window.parent.postMessage({
                isOut: 1
            }, CONFIG.IN_PRODUCTION_PATH)
        } else {
            window.parent.postMessage({
                isOut: 1
            }, CONFIG.IN_DEVELOPMENT_PATH)
        }
    } else if (error.response.status === 402) {
        if (process.env.NODE_ENV == 'production') {
            window.parent.postMessage({
                isOut: 2
            }, CONFIG.IN_PRODUCTION_PATH)
        } else {
            window.parent.postMessage({
                isOut: 2
            }, CONFIG.IN_DEVELOPMENT_PATH)
        }
    }
});

httpFile.interceptors.request.use(config => {
    store.commit('SAVE_LOADING_STATE', true);
    return config;
}, error => {
    console.log(error)
});

httpFile.interceptors.response.use(response => {
    store.commit('SAVE_LOADING_STATE', false);
    return response;
}, error => {
    if (error.response.status === 401) {
        if (process.env.NODE_ENV == 'production') {
            window.parent.postMessage({
                isOut: 1
            }, CONFIG.IN_PRODUCTION_PATH)
        } else {
            window.parent.postMessage({
                isOut: 1
            }, CONFIG.IN_DEVELOPMENT_PATH)
        }
    } else if (error.response.status === 402) {
        if (process.env.NODE_ENV == 'production') {
            window.parent.postMessage({
                isOut: 2
            }, CONFIG.IN_PRODUCTION_PATH)
        } else {
            window.parent.postMessage({
                isOut: 2
            }, CONFIG.IN_DEVELOPMENT_PATH)
        }
    }
});

http.getAjax = function (url, params) {
    url = url.toLowerCase();
    if (getSessionStorage('userInfo')) {
        if (params) {
            params.uid = JSON.parse(getSessionStorage('userInfo')).uid;
            params.staff_code = JSON.parse(getSessionStorage('userInfo')).staff_code;
        } else {
            params = {}
            params.uid = JSON.parse(getSessionStorage('userInfo')).uid;
            params.staff_code = JSON.parse(getSessionStorage('userInfo')).staff_code;
        }
    }
    if (process.env.NODE_ENV == 'production') {
        if (url.indexOf('login') !== -1) {
            return http.get(CONFIG.PRODUCTION_PATH + url, { params });
        } else {
            return http.get(rootApi + url, { params });
        }
    } else {
        if (url.indexOf('login') !== -1) {
            return http.get(url, { params: params });
        } else {
            return http.get(handlePre(url), { params: params });
        }
    }
};

http.postAjax = function (url, params) {
    if (getSessionStorage('userInfo')) {
        if (params) {
            params.uid = JSON.parse(getSessionStorage('userInfo')).uid;
            params.staff_code = JSON.parse(getSessionStorage('userInfo')).staff_code;
        } else {
            params = {}
            params.uid = JSON.parse(getSessionStorage('userInfo')).uid;
            params.staff_code = JSON.parse(getSessionStorage('userInfo')).staff_code;
        }
    }
    url = url.toLowerCase();
    if (process.env.NODE_ENV == 'production') {
        // 区分登录接口不需要统一加/api前缀
        if (url.indexOf('login') !== -1) {
            return http.post(CONFIG.PRODUCTION_PATH + url, qs.stringify(params));
        } else {
            return http.post(rootApi + url, qs.stringify(params));
        }
    } else {
        return http.post(handlePre(url), qs.stringify(params));
    }
};

http.fileAjax = function (url, params) {
    if (getSessionStorage('userInfo')) {
        if (params) {
            params.append('uid', JSON.parse(getSessionStorage('userInfo')).uid)
        } else {
            params = {}
            params.append('uid', JSON.parse(getSessionStorage('userInfo')).uid)
        }

    }
    url = url.toLowerCase();
    if (process.env.NODE_ENV == 'production') {
        return httpFile.post(rootApi + url, params);
    } else {
        return httpFile.post(handlePre(url), params);
    }
};

var handlePre = (url)=> {
    return devApiPre + url
}

export default http;