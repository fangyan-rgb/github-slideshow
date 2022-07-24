import http from '@/http';


//登记收款/aftersales/ebay_after_sales_receipt/store
export function registeredReceivablesInterface(params = {},str) {
    params = {...params};
    return http.postAjax('/aftersales/'+str+'/store', params);
}

//通过交易号获取交易信息
export function TransactionInformation(params = {},str) {
    params = {...params};
    return http.getAjax('/aftersales/'+str+'/get_pay_info', params);
}
//登记收款修改提交
export function editRegisteredReceivablesInterface(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_after_sales_receipt/do_edit', params);
}
//收款请求
export function receiptRequestInterface(params = {},str) {
    params = {...params};
    return http.postAjax('/aftersales/'+str+'/store', params);
}
//获取新建退款单所需信息
export function addNewRefundInfo(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/amazon_refund/get_product_refund_info', params);
}
//售后单修改提交
export function afterSalesOrderEditSubmission(params = {},str) {
    params = {...params};
    return http.postAjax('/aftersales/'+str+'/do_edit', params);
}
//订单详情通过sku获取产品信息
export function proErpSku(params = {},str) {
    params = {...params};
    return http.postAjax('/order/'+str+'/pro_erp', params);
}
//新建售后单通过sku获取产品信息
export function proErpAftersalesSku(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/after_sales_order/get_product_info', params);
}
//获取RMA
export function rmaObtain(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/after_sales_order/get_rma', params);
}
//获取退货编码
export function returnCodeObtain(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/after_sales_order/get_refund_code', params);
}
//搜索paypal交易号信息
export function searchPaypalTransactionInfo(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/after_sales_receipt/get_pay_info', params);
}
//获取退款金额 
export function getAllowRefundAmount(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/ebay_after_sales_refund/get_allow_refund_amount', params);
}
//EB登记退款单 
export function ebayAfterSalesRefund(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_after_sales_refund/store', params);
}
//新建售后单
export function addNewAfterSales(params = {},str) {
    params = {...params};
    return http.postAjax('/aftersales/'+str+'/store', params);
}
//修改客诉单
export function complaintDoEdit(params = {},str) {
    params = {...params};
    return http.postAjax('/aftersales/'+str+'/do_edit', params);
}
//登记客诉单提交
export function customerComplaintSubmission(params = {},str) {
    params = {...params};
    return http.postAjax('/aftersales/'+str+'/store', params);
}
//INR纠纷信息
export function getInquiry(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_inquiry/get_inquiry', params);
}
//模板
export function getCommentHeader(params = {}) {
    params = {...params};
    return http.postAjax('/review/ebay_feedback_reply/get_comment_header', params);
}
//升级原因下拉数据
export function getEscalateReasonInfo(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_inquiry/escalate_reason', params);
}
//全额退款提交
export function issueRefundSubmission(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_inquiry/issue_refund', params);
}
//提供发货信息提交
export function provideShipmentInfoSubmission(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_inquiry/provide_shipment_info', params);
}
//升级提交
export function escalateSubmission(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_inquiry/escalate', params);
}
//发送留言提交
export function sendMessageSubmission(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_inquiry/send_message', params);
}
//cancel纠纷信息
export function getCancelDisputeInfo(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_cancellations/cancel_dispute', params);
}
//return纠纷信息
export function getReturnInfo(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_returns_requests/get_return', params);
}
//return全额、部分退款提交
export function issueReturnRefund(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_returns_requests/issue_refund', params);
}
//return发送留言提交
export function sendReturnMessage(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_returns_requests/send_message', params);
}
//return上传凭证提交
export function uploadCertReturn(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_returns_requests/upload_cert', params);
}
//cancel接受提交
export function approveCancel(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_cancellations/approve_cancel', params);
}
//cancel接受提交
export function rejectCancel(params = {}) {
    params = {...params};
    return http.postAjax('/ebay/ebay_cancellations/reject_cancel', params);
}

//return设置自动退款
export function returnSetAutoRefund(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_returns_requests/set_auto_refund', params);
}

//inr设置自动退款
export function inquirySetAutoRefund(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_inquiry/set_auto_refund', params);
}

//仓库联动获取物流方式
export function getLogisticsListNew(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/after_sales_order/get_logistics_list_new', params);
}