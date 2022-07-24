import http from '@/http';

export function getMainList(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/ebay_paypal_invoice_record/get_list', params);
}

export function cancelEbayPaypal(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_paypal_invoice_record/cancel', params);
}
