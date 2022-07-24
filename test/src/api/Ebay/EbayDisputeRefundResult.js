import http from '@/http';

export function getMainList(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/Ebay_case_refund_record/get_list', params);
}