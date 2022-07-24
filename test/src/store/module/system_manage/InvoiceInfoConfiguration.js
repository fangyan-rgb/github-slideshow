// /**  =========================> *|`| % 发票信息配置 % |`|*<======================== **/
// // methodName
// import * as types from '@/store/mutation-type';

// // api
// import {
//     getInvoiceList,
// } from '../../../api/SystemManagement/invoiceInfoConfiguration'

// const config = {
//     state: {
//         InvoiceInfoConfiguration: {},
//     },
//     mutations: {
//         [types.SAVE_INVOICE_CONFIGURATION_INFO](state, saveInfo) {
//             state.InvoiceInfoConfiguration = saveInfo;
//         },
//     },
//     actions: {
//         GetInvoiceList({ commit }, queryData = {}) {
//             return new Promise((resolve, reject) => {
//                 getInvoiceList(queryData).then(response => {
//                     if (response.data.status === 1) {
//                         commit(types['SAVE_INVOICE_CONFIGURATION_INFO'], response.data);
//                     }
//                     resolve(response);
//                 }).catch(error => {
//                     reject(error);
//                 })
//             })
//         },
//     }
// };

// export default config;
