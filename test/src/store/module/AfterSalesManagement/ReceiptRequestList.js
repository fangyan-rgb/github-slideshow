/**  =========================> *|`| % 收款请求列表 % |`|*<======================== **/
// methodName
import * as types from '@/store/mutation-type';

// api
import {
    getRequestList,
} from '../../../api/AfterSalesManagement/receiptRequestList'

const config = {
    state: {
        ReceiptRequestInfo: {},
    },
    mutations: {
        [types.SAVE_RECEIPT_REQUEST_INFO](state, saveInfo) {
            state.ReceiptRequestInfo = saveInfo;
        },
    },
    actions: {
        GetRequestList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getRequestList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_RECEIPT_REQUEST_INFO'], response.data);
                    }
                    resolve(response);
                }).catch(error => {
                    reject(error);
                })
            })
        },
    }
};

export default config;
