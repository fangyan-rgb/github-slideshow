/**  =========================> *|`| % 自动信息记录(请求数据) % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';
/* 获取列表数据 */
export function getAutomationMessageListInfo(params) {
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
        window.open('/system_set/email_send_record/get_list' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/system_set/email_send_record/get_list', data);
    }
}

//获取platform_code列表
export function getPlatformCodeData(PlatformCode) {
    const data = PlatformCode ? Object.assign(PlatformCode, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/General_data/get_platform_list', data);   
}