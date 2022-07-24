import http from '@/http';

export function getInboxList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/amazon_inbox/get_list', params);
}

export function getHeaderSelect(params = {}) {
    params = {...params};
    return http.getAjax('/emails/Amazon_inbox/get_header_select', params);
}

export function delMails(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_inbox/destroy', params);
}

export function getLogs(params = {}) {
    params = {...params};
    return http.getAjax('/emails/amazon_inbox/show_log', params);
}

export function addStar(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_message/make_star', params);
}

export function addRead(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_inbox/read', params);
}

export function tagReply(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_inbox/reply', params);
}

export function getClass(params = {}) {
    params = {...params};
    return http.getAjax('/dispute/dispute_list/cate_list', params);
}

export function getTag(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/config_tag/get_list', params);
}

export function addTag(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_inbox/add_tag', params);
}

export function addClass(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_inbox/mail_category', params);
}

export function getkefu(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/account_sales/get_list', params);
}

export function addkefu(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_inbox/distribution_user', params);
}
