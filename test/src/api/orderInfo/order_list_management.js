/**  =========================> *|`| % 订单管理 % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';

// export function getOrderListManagementInfo(params) {
//     const data = {
//         page: 1,
//         page_size: 20,
//         ...CONFIG.ajaxData,
//         ...params
//     };
//     console.log(data)
//     // 查询参数带isExcel为导出
//     if (data.isExcel) {
//         let str = '?';
//         for (let key in data) {
//             str = `${str}&${key}=${data[key] || ''}`;
//         }
//         window.open('/api/warehouse/index' + str, '_self');
//         return new Promise((resolve => {
//             resolve({
//                 data: {
//                     status: 2
//                 }
//             });
//         }));
//     } else {
//         return http.postAjax('/order/order_list/order_list', data);
//     }
// }
//登记收款
export function registeredReceivablesInterface(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/after_sales_receipt/store', params);
}

//通过交易号获取交易信息
export function TransactionInformation(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/after_sales_receipt/get_pay_info', params);
}
//订单列表信息
export function orderList(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/order_list/order_list', data);
}
//日志操作信息
export function journalOperation(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/order_list/logs', data);
}
//暂扣信息
export function withhold(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/order_list/batch_holdorder', data);
}
//作废信息
export function toVoidInfo(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/order_list/batch_forever', data);
}
//批量作废信息
export function batchToVoid(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/order_list/batch_forever', data);
}
//批量暂扣信息
export function batchWithhold(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/order_list/batch_holdorder', data);
}
//批量取消暂扣信息
export function batchCancelWithhold(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/order_list/batch_canncel', data);
}
//批量备注信息
export function batchRemarkInfo(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/order_list/batch_remark', data);
}
//获取公司paypal账号
export function companyPaypalAccount(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/aftersales/payment_request/create', data);
}

//登记收款弹窗数据
export function registeredReceivablesData(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/aftersales/after_sales_receipt/create', data);
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

//收款请求弹窗数据
export function collectionInformation(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/aftersales/Paypal_invoice_record/create', data);
}
//获取当前订单产品详情信息
export function obtainProDetailsInfo(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/order_details/pro_details', data);
}
//取消合单
export function cancelMergeOrder(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/order/order_edit_erp/cancel_merge_order', data);
}