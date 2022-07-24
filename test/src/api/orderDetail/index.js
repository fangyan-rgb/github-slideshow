import http from '@/http';

//物流信息编辑提交
export function updateOrderWarehouse(params = {},str) {
    params = {...params};
    return http.postAjax('/order/'+str+'/update_order_warehouse', params);
}
//获取国家下拉数据
export function getCountryList(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/general_data/get_country_list', params);
}
//发货地址编辑提交
export function updateOrderAddr(params = {},str) {
    params = {...params};
    return http.postAjax('/order/'+str+'/update_order_addr', params);
}
//是否发货/order/order_details/whether_ship
export function whetherShip(params = {},str) {
    params = {...params};
    return http.postAjax('/order/order_details/whether_ship', params);
}