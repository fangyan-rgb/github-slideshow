import http from '@/http';

export function getMainList(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/ebay_customer_complaint/get_list', params);
}

export function postConfirm(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_customer_complaint/confirm', params);
}

export function getLogs(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_customer_complaint/showlog', params);
}

export function postReject(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_customer_complaint/reject', params);
}

export function postDelete(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_customer_complaint/delete', params);
}
