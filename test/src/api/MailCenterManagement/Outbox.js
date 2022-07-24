import http from '@/http';

export function getOutboxList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_outbox/get_list', params);
}

export function getDropDownBoxList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_outbox/get_header_select', params);
}

export function delOutboxList(params = {}) {
    params = {...params};
    return http.postAjax('/emails/mail_outbox/destroy', params);
}

export function getLogs(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_outbox/show_log', params);
}

export function getViewMail(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_outbox/over_view', params);
}
