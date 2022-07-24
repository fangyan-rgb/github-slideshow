import http from '@/http';
import http2 from '@/http/noLoading';

export function getMailData(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_message/detail', params);
}

export function getOrderList(params = {}) {
    params = {...params};
    return http.getAjax('/order/ebay_order_message/get_order_list', params);
}

export function getOrderProItem(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/order_pro_item', params);
}

export function setMailRemark(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_message/remark', params);
}

export function delTag(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_message/delete_tag', params);
}

export function delRemarkInfo(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_details/del_remark', params);
}

export function addNewBatchRemark(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/batch_remark', params);
}

export function addNewShipRemark(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_details/ship_remark', params);
}

export function batchCancelWithhold(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/batch_canncel', params);
}

export function toVoidInfo(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/batch_forever', params);
}

export function withhold(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/batch_holdorder', params);
}

export function getHandleInfo(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_message/get_handle_info', params);
}

export function sendMailData(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_message/reply', params);
}

export function getShortcutKey(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/search_data/get_data/get_tags', params);
}

export function journalOperation(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/logs', params);
}

//模板
export function getCommentHeader(params = {}) {
    params = {...params};
    return http.postAjax('/review/ebay_feedback_reply/get_comment_header', params);
}

//提交留评
export function replyBack(params = {}) {
    params = {...params};
    return http.postAjax('/review/ebay_feedback_reply/reply_back', params);
}

//消息联系/批量消息联系
export function activeContactConfirm(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/active_contact', params);
}

//收款请求弹窗数据
export function collectionInformation(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/ebay_Paypal_invoice_record/create', params);
}

//登记收款弹窗数据
export function registeredReceivablesData(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/ebay_after_sales_receipt/create', params);
}
//取消订单详情
export function cancelTransactionList(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/cancel_transaction_list', params);
}
//取消订单提交
export function cancelTransactionConfirm(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/cancel_transaction', params);
}
