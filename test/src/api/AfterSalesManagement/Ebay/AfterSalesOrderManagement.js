import http from '@/http';
import { getSessionStorage } from '@/utils/storage';

export function getMainList(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/ebay_after_sales_order/get_list', params);
}

export function postReview(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_after_sales_order/review', params);
}

export function signRefund(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_after_sales_order/sign_refund', params);
}

export function getLogs(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/ebay_after_sales_order/showlog', params);
}

export function setAfterReason(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_after_sales_order/after_reason', params);
}

export function delItem(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_after_sales_order/destroy', params);
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
    window.open('/api/aftersales/ebay_after_sales_order/get_download?' + str, '_self');
}
