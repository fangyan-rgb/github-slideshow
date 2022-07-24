/**  =========================> *|`| 系统操作日志 |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';

/**
 * Zhangrong
 * 系统操作日志--列表公共接口
 */
export function getSystemOperationLog(params = {}) {
    params = {...params};
    return http.getAjax('/system/admin_log/get_list', params);   
}