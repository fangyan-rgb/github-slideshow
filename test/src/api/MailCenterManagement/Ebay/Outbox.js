import http from '@/http';

export function getOutboxList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/ebay_mail_outbox/get_list', params);
}

export function getViewMail(params = {}) {
    params = {...params};
    return http.getAjax('/emails/ebay_mail_outbox/over_view', params);
}

export function getLogs(params = {}) {
    params = {...params};
    return http.getAjax('/emails/ebay_mail_outbox/show_log', params);
}
