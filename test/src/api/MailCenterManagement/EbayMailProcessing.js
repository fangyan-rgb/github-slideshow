import http from '@/http';
import http2 from '@/http/noLoading';

export function getMailData(params = {}) {
    params = {...params};
    return http.getAjax('/emails/ebay_inbox/create', params);
}

export function setMailRemark(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_inbox/set_remark', params);
}

export function setMailSubjectRemark(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_inbox/set_subject_remark', params);
}

export function delTag(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_inbox/del_tag', params);
}

export function tagReply(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_inbox/reply', params);
}

export function sendMailData(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_inbox_reply/store', params);
}

export function confirmMailData(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_inbox_reply/confirm', params);
}

export function getShortcutKey(params = {}) {
    params = {...params};
    return http.getAjax('/emails/ebay_inbox/get_id_name_shortcut_key', params);
}

export function getPrevNext(params = {}) {
    params = {...params};
    return http.getAjax('/emails/ebay_inbox/get_prev_next_id_by_list', params);
}
