/**  =========================> *|`| % ebay订单列表 % |`|*<======================== **/
import http from '@/http';

// ebay订单列表
export function orderList(params = {}) {
    params = {...params};
    return http.getAjax('/order/ebay_order_list/order_list', params);
}
//批量备注信息
export function batchRemarkInfo(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/batch_remark', params);
}
//作废信息
export function toVoidInfo(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/batch_forever', params);
}
//暂扣信息
export function withhold(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/batch_holdorder', params);
}
//批量作废信息
export function batchToVoid(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/batch_forever', params);
}
//批量暂扣信息
export function batchWithhold(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/batch_holdorder', params);
}
//批量取消暂扣信息
export function batchCancelWithhold(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/batch_canncel', params);
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
//发票详情接口
export function invoiceDetailsInterface(params = {}) {
    params = {...params};
    return http.getAjax('/order/order_invoice/invoice_details', params);
}
//发票提交接口
export function submitInvoiceInterface(params = {}) {
    params = {...params};
    return http.postAjax('/order/order_invoice/add_invoice', params);
}
//日志操作信息
export function journalOperation(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/logs', params);
}
//模板
export function getCommentHeader(params = {}) {
    params = {...params};
    return http.postAjax('/review/ebay_feedback_reply/get_comment_header', params);
}
//谷歌翻译
export function getGoogleTranslate(params = {}) {
    params = {...params};
    return http.postAjax('/emails/Google/Translate_back', params);
}
//模板内容
export function getTemplateDetail(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/mail_template/get_detail', params);
}
//提交留评
export function replyBack(params = {}) {
    params = {...params};
    return http.postAjax('/review/ebay_feedback_reply/reply_back', params);
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
//消息联系/批量消息联系
export function activeContactConfirm(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/active_contact', params);
}

//取消合单
export function cancelMergeOrder(params = {}) {
    params = {...params};
    return http.postAjax('/order/order_edit_erp/cancel_merge_order', params);
}