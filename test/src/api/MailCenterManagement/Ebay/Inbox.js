import http from '@/http';
import { getSessionStorage } from '@/utils/storage';

export function getInboxList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/ebay_inbox/get_list', params);
}

export function addkefu(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_inbox/distribution_user', params);
}

export function addTag(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_inbox/add_tag', params);
}

export function addStar(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_inbox/star', params);
}

export function addRead(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_inbox/read', params);
}

export function getLogs(params = {}) {
    params = {...params};
    return http.getAjax('/emails/ebay_inbox/show_log', params);
}

export function addClass(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_inbox/mail_category', params);
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
    window.open('/api/emails/ebay_inbox/download?' + str, '_self');
}
