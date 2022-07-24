/**  =========================> *|`| % 登记收款列表 % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';

/**
 * JUDY
 * 售登记收款列表查询接口
 */
export function getRegisterList(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/after_sales_receipt/get_list', params);
}