import http from '@/http';
import http2 from '@/http/noLoading';

export function getMailData(params = {}) {
    params = {...params};
    return http.getAjax('/emails/amazon_inbox/create', params);
}

export function sendMailData(params = {}) {
    params = {...params};
    return http.postAjax('/emails/Amazon_reply/store', params);
}

export function confirmMailData(params = {}) {
    params = {...params};
    return http.postAjax('/emails/Amazon_reply/confirm', params);
}

export function getGoogleTranslateV2(params = {}) {
    params = {...params};
    return http2.postAjax('/system_set/General_data/inbox_translate', params);
}

export function setMailRemark(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_inbox/set_remark', params);
}

export function setMailSubjectRemark(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_inbox/set_subject_remark', params);
}

export function delTag(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_inbox/del_tag', params);
}

export function getShortcutKey(params = {}) {
    params = {...params};
    return http.getAjax('/emails/amazon_inbox/get_id_name_shortcut_key', params);
}

export function getOrderList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/amazon_inbox/get_order_list', params);
}

export function getPrevNext(params = {}) {
    params = {...params};
    return http.getAjax('/emails/amazon_inbox/get_prev_next_id_by_list', params);
}

export function addkefu(params = {}) {
    params = {...params};
    return http.postAjax('/emails/amazon_inbox/batch_distribution_user', params);
}

export function obtainReturnCode(params = {}) {
    params = {...params};
    return http.getAjax('/order/order_operation/refund_code', params);
}

export function addNewBatchRemark(params = {}) {
    params = {...params};
    return http.postAjax('/order/order_list/batch_remark', params);
}

export function addNewShipRemark(params = {}) {
    params = {...params};
    return http.postAjax('/order/order_details/ship_remark', params);
}

export function delRemarkInfo(params = {}) {
    params = {...params};
    return http.postAjax('/order/order_details/del_remark', params);
}

export function toVoidInfo(params = {}) {
    params = {...params};
    return http.postAjax('/order/order_list/batch_forever', params);
}

export function withhold(params = {}) {
    params = {...params};
    return http.postAjax('/order/order_list/batch_holdorder', params);
}

export function batchCancelWithhold(params = {}) {
    params = {...params};
    return http.postAjax('/order/order_list/batch_canncel', params);
}

export function invoiceDetailsInterface(params = {}) {
    params = {...params};
    return http.getAjax('/order/order_invoice/invoice_details', params);
}

export function submitInvoiceInterface(params = {}) {
    params = {...params};
    return http.postAjax('/order/order_invoice/add_invoice', params);
}

export function OrderCustomerComplaintInfo(params = {}) {
    params = {...params};
    return http.getAjax('/order/order_operation/get_list', params);
}
