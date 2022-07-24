import http from '@/http';

export function getMainList(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_cancellations/get_list', params);
}

export function getLogs(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_cancellations/show_log', params);
}

export function approveCancel(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_cancellations/approve_cancel', params);
}

export function saveKefu(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_cancellations/update_customer', params);
}
