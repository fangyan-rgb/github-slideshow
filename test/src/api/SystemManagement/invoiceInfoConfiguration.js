/**  =========================> *|`| % 发票信息配置% |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';

/**
 * JUDY
 * 列表
 */
export function getInvoiceList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/invoice/get_list', params);
}
/**
 * JUDY
 * 删除
 */
export function getInvoiceDelete(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/invoice/delete', params);
}
/**
 * JUDY
 * 新增编辑
 */
export function getInvoiceEdit(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/invoice/update', params);
}
/**
 * JUDY
 *  日志
 */
export function getLog(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/General_data/get_logs', params);
}