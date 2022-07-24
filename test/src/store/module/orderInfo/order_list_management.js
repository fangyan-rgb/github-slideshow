
// /**  =========================> *|`| % 订单管理 % |`|*<======================== **/

// // methodName
// import * as types from '../../mutation-type';

// // api
// import {
//     orderList,
// } from '../../../api/orderInfo/order_list_management';

// const config = {
//     state: {
//         orderListManagementInfo: {}
//     },
//     // mutations: {
//     //     [types.SAVE_ORDER_LIST_MANAGEMENT](state, saveInfo) {
//     //         state.orderListManagementInfo = saveInfo;
//     //     }
//     // },
//     actions: {
//         // 获取信息
//         orderList({ commit }, queryData) {
//             if (!queryData) {
//                 queryData = {};
//             }
//             return new Promise((resolve, reject) => {
//                 orderList(queryData).then(response => {
//                     if (response.data.status === 1) {
//                         commit(types['SAVE_ORDER_LIST_MANAGEMENT'], response.data);
//                     }
//                     resolve(response);
//                 }).catch(error => {
//                     reject(error);
//                 })
//             })
//         }
//     }
// };

// export default config;