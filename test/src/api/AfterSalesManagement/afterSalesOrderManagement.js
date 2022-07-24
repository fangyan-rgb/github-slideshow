/**  =========================> *|`| % 售后单管理 % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';
import { getSessionStorage } from '@/utils/storage';
/**
 * JUDY
 * 售后单管理列表查询接口
 */
export function getList(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/after_sales_order/get_list', params);
}
/**
 * JUDY
 * 审核通过
 */
export function afterSalesOrderReviewPass(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/after_sales_order/review_pass', params);
}
/**
 * JUDY
 * 审核驳回
 */
export function afterSalesOrderReviewReject(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/after_sales_order/review_reject', params);
}

/**
 * JUDY
 * 删除
 */
export function afterSalesOrderDestroy(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/after_sales_order/destroy', params);
}
/**
 * JUDY
 * 售后单日志  saleafter/saleafter/edit
 */
export function afterSalesOrderShowlog(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/after_sales_order/showlog', params);
}
/**
 * JUDY
 * 修改信息下拉
 */
// export function afterSalesOrderDropDown(params = {}) {
//     params = {...params};
//     return http.getAjax('/aftersales/after_sales_order/modify_operate_info', params);
// }
/**
 * JUDY
 * 修改信息确定
 */
// export function afterSalesOrderEdit(params = {}) {
//     params = {...params};
//     return http.postAjax('/aftersales/after_sales_order/edit', params);
// }
/**
 * JUDY
 * 修改信息确定
 */
export function afterSalesOrderReview(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/after_sales_order/review', params);
}
/**
 * JUDY
 * 标记退款
 */
export function signRefund(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/after_sales_order/sign_refund', params);
}

export function setAfterReason(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/after_sales_order/after_reason', params);
}

/**
 * JUDY
 * @param {*} params
 * 下载
 */
export function downloadExport(params = {}) {
    params.uid = JSON.parse(getSessionStorage('userInfo')).uid;
    let str = '';
    for (let key in params) {
        if (str) {
            str = `${str}&${key}=${params[key] || ''}`;
        } else {
            str = `${key}=${params[key] || ''}`;
        }
    }
    window.open('/api/aftersales/after_sales_order/dowload?' + str, '_self');
}