/**  =========================> *|`| % 客诉列表 % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';

/**
 * JUDY
 * 客诉列表查询接口
 */
export function getComplaintList(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/customer_complaint/get_list', params);
}
/**
 * JUDY
 * 日志
 */
export function getShowLog(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/customer_complaint/showlog', params);
}

/**
 * JUDY
 * 确认
 */
export function complaintConfirm(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/customer_complaint/confirm', params);
}

/**
 * JUDY
 * 批量驳回
 */
export function complaintReject(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/customer_complaint/reject', params);
}
//删除客诉单 
export function deleteCustomerComplaint(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/customer_complaint/delete', params);
}