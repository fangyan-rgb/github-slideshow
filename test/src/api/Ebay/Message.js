import http from '@/http';
import { getSessionStorage } from '@/utils/storage';

export function getMainList(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_message/get_list', params);
}

export function getLogs(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_message/get_log', params);
}

export function saveTag(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_message/save_tag', params);
}

export function saveKefu(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_message/update_customer', params);
}

export function setStar(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_message/mark_star', params);
}

export function setReply(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_message/update_reply', params);
}

export function dataOutput(params = {}) {
    params.export = 1;
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
    window.open('/api/ebay/ebay_message/get_list?' + str, '_self');
}
