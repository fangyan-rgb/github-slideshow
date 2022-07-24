import http from '@/http';
import { getSessionStorage } from '@/utils/storage';

export function getMainList(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/ebay_after_sales_receipt/get_list', params);
}

export function delItem(params = {}) {
    params = {...params};
    return http.postAjax('/aftersales/ebay_after_sales_receipt/do_delete', params);
}

export function getLogs(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/ebay_after_sales_receipt/showlog', params);
}

export function dataOutput(params = {}) {
    params.uid = JSON.parse(getSessionStorage('userInfo')).uid;
    params.staff_code = JSON.parse(getSessionStorage('userInfo')).staff_code;
    let str = '';
    for (let key in params) {
        let val = params[key] === 0 ? 0 : (params[key] || '');
        if( val !== '' ){
            if( Array.isArray(val) ){
                val.forEach(e => {
                    str = str ? `${str}&${key}[]=${e}` : `${key}[]=${e}`;
                });
            }else{
                str = str ? `${str}&${key}=${val}` : `${key}=${val}`;
            }
        }
    }
    window.open('/api/aftersales/ebay_after_sales_receipt/get_download?' + str, '_self');
}

//登记收款弹窗数据
export function registeredReceivablesData(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/after_sales_receipt/create', params);
}
//登记收款页面数据
export function getShowEdit(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/ebay_after_sales_receipt/show_edit', params);
}