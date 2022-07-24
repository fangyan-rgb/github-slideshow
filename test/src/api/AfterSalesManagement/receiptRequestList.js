/**  =========================> *|`| % 收款请求列表 % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';

/**
 * JUDY
 * 收款请求列表查询接口
 */
export function getRequestList(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/paypal_invoice_record/get_list', params);
}