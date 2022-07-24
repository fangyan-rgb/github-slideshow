import http from '@/http';
import { getSessionStorage } from '@/utils/storage';

export function getMessageCenterList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/amazon_message/get_list', params);
}

export function getHeaderSelect(params = {}) {
    params = {...params};
    return http.getAjax('/emails/amazon_message/get_header_select', params);
}

export function getLogs(params = {}) {
    params = {...params};
    return http.getAjax('/emails/amazon_message/show_log', params);
}

export function addRead(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_message/read', params);
}

export function tagReply(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_message/reply', params);
}

export function addClass(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_message/mail_category', params);
}

export function addkefu(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_message/distribution_user', params);
}

export function dataOutput(params = {}) {
    params.uid = JSON.parse(getSessionStorage('userInfo')).uid;
    params.staff_code = JSON.parse(getSessionStorage('userInfo')).staff_code;
    let str = '';
    for (let key in params) {
        let val = params[key] === 0 ? 0 : (params[key] || '');
        if( val !== '' ){
            if( Array.isArray(val) ){
                val.forEach(e => {
                    str = str ? `${str}&${key}[]=${e}` : `${key}[]=${e}`;
                });
            }else{
                str = str ? `${str}&${key}=${val}` : `${key}=${val}`;
            }
        }
    }
    window.open('/api/emails/amazon_message/download?' + str, '_self');
}

export function logOutput(params = {}) {
    params.uid = JSON.parse(getSessionStorage('userInfo')).uid;
    let str = '';
    for (let key in params) {
        let val = params[key] === 0 ? 0 : (params[key] || '');
        if( val !== '' ){
            if( Array.isArray(val) ){
                val.forEach(e => {
                    str = str ? `${str}&${key}[]=${e}` : `${key}[]=${e}`;
                });
            }else{
                str = str ? `${str}&${key}=${val}` : `${key}=${val}`;
            }
        }
    }
    window.open('/api/emails/amazon_message/download_log?' + str, '_self');
}
