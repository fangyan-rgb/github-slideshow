/**  =========================> *|`| % 订单信息 % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';

export function getOrderInformation(params) {
    const data = {
        page: 1,
        page_size: 20,
        ...CONFIG.ajaxData,
        ...params
    };

    // 查询参数带isExcel为导出
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/api/warehouse/index' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.postAjax('/user/register', data);
    }
}
//系统进度信息
export function systemProgress(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/order_node', data);
}
//获取当前订单详情信息
export function obtainOrderDetailsInfo(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/order_details', data);
}
//获取当前订单产品详情信息
export function obtainProDetailsInfo(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/pro_details', data);
}
//获取当前订单交易记录信息
export function obtainTransactionDetailsInfo(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/transaction_details', data);
}
//获取当前订单包裹信息
export function obtainPackageDetailsInfo(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/package_details', data);
}
//获取当前订单物流信息
export function obtainLogisticsDetailsInfo(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/logistics_details', data);
}
//获取当前订单利润信息
export function obtainProfitDetailsInfo(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/profit_details', data);
}
//获取当前当前订单售后信息
export function obtainSalesAfterDetailsInfo(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/sales_after_details', data);
}
//获取当前订单操作日志信息
export function obtainLogsInfo(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/logs', data);
}
//作废订单
export function toVoidInfo(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/batch_forever', data);
}
//暂扣订单
export function withhold(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/batch_holdorder', data);
}
//取消暂扣信息
export function batchCancelWithhold(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/batch_canncel', data);
}
//平台进度信息
export function orderPlatformProgress(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/platform_progress', data);
}
//添加订单备注
export function addNewBatchRemark(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/batch_remark', data);
}
//添加出货备注
export function addNewShipRemark(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/ship_remark', data);
}
//删除订单详细信息备注
export function delRemarkInfo(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/del_remark', data);
}
//新建售后单
export function addNewAfterSales(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/aftersales/'+str+'/store', data);
}
//产品信息增删改
export function productInfoAddDeleteEdit(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/pro_save', data);
}
//新建售后单信息
export function afterSalesOrderCreateInfo(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/aftersales/after_sales_order/create', data);
}
//搜索paypal交易号信息
export function searchPaypalTransactionInfo(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/aftersales/'+str+'/get_pay_info', data);
}
//获取退货编码
export function returnCodeObtain(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/aftersales/after_sales_order/get_refund_code', data);
}
//获取RMA
export function rmaObtain(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/aftersales/after_sales_order/get_rma', data);
}
//登记客诉单提交
export function customerComplaintSubmission(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/aftersales/'+str+'/store', data);
}
//发票详情接口
export function invoiceDetailsInterface(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/order/order_invoice/invoice_details', data);
}
//发票提交接口
export function submitInvoiceInterface(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/order_invoice/add_invoice', data);
}
//取消暂扣
// export function batchWithhold(queryData) {
//     const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
//     return http.postAjax('/order/order_list/batch_holdorder', data);
// }
//客诉单所需信息
export function customerComplaintInfoInterface(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/aftersales/'+str+'/create', data);
}
//订单详情通过sku获取产品信息
export function proErpSku(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/'+str+'/pro_erp', data);
}
//新建售后单通过sku获取产品信息
export function proErpAftersalesSku(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/aftersales/after_sales_order/get_product_info', data);
}
//获取新建退款单所需信息
export function addNewRefundInfo(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/aftersales/amazon_refund/get_product_refund_info', data);
}
//获取客诉单的详细信息
export function customerComplaintInfo(queryData,str) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/aftersales/'+str+'/get_detail', data);
}
//客诉单确定
export function complaintConfirm(params = {},str) {
    params = {...params};
    return http.postAjax('/aftersales/'+str+'/confirm', params);
}
//客诉单驳回
export function complaintReject(params = {},str) {
    params = {...params};
    return http.postAjax('/aftersales/'+str+'/reject', params);
}
//客诉单修改获取数据
export function complaintEditInfo(params = {},str) {
    params = {...params};
    return http.getAjax('/aftersales/'+str+'/show_edit', params);
}
//修改客诉单
export function complaintDoEdit(params = {},str) {
    params = {...params};
    return http.postAjax('/aftersales/'+str+'/do_edit', params);
}
//审核客诉单
export function complaintExamine(params = {},str) {
    params = {...params};
    return http.getAjax('/aftersales/'+str+'/check', params);
}
//订单详情获取退货编码
export function obtainReturnCode(params = {}) {
    params = {...params};
    return http.getAjax('/order/order_operation/refund_code', params);
}
//获取多条客诉信息
export function OrderCustomerComplaintInfo(params = {}) {
    params = {...params};
    return http.getAjax('/order/order_operation/get_list', params);
}
//获取售后单修改信息
export function afterSalesOrderShowEdit(params = {},str) {
    params = {...params};
    return http.getAjax('/aftersales/'+str+'/show_edit', params);
}
//售后单修改提交
export function afterSalesOrderEditSubmission(params = {},str) {
    params = {...params};
    return http.postAjax('/aftersales/'+str+'/do_edit', params);
}
//售后单下拉数据拆分crm 
export function afterSalesOrderCreateCrmInfo(params = {},str) {
    params = {...params};
    return http.postAjax('/aftersales/'+str+'/create_crm', params);
}
//EB登记退款单 
export function ebayAfterSalesRefund(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_after_sales_refund/store', params);
}
//获取退款金额 
export function getAllowRefundAmount(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/ebay_after_sales_refund/get_allow_refund_amount', params);
}
//纠纷INR 
export function getInquiryInfo(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_inquiry/get_inquiry', params);
}

//取消合单
export function cancelMergeOrder(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/order_edit_erp/cancel_merge_order', data);
}