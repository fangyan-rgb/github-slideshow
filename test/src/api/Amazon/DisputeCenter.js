import http from '@/http';
import { getSessionStorage } from '@/utils/storage';

export function getDisputeCenterList(params = {}) {
    params = {...params};
    return http.getAjax('/dispute/dispute_list/dispute_list', params);
}

export function addAppeal(params = {}) {
    params = {...params};
    return http.postAjax('/dispute/dispute_list/complain', params);
}

export function getQuickParameterList(params = {}) {
    params = {...params};
    return http.getAjax('/dispute/dispute_list/get_count_nums', params);
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
    window.open('/api/dispute/dispute_list/get_download?' + str, '_self');
}
