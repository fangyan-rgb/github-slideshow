import http from '@/http';

export function getMainList(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_message_filter_rule/get_list', params);
}

export function delItem(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_message_filter_rule/delete', params);
}

export function addItem(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_message_filter_rule/add', params);
}

export function updateItem(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_message_filter_rule/update', params);
}

export function getCategoryOptionList(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_message_filter_rule/auto_category_option_list', params);
}
