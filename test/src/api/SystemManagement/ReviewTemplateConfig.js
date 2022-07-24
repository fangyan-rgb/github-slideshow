/**  =========================> *|`| 留评模板配置 |`|*<======================== **/

import http from '@/http';

/**
 * Zhangrong
 * 系统操作日志--列表公共接口
 */
export function getFeedbackTemplateList(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/feedback_template/get_list', params);   
}