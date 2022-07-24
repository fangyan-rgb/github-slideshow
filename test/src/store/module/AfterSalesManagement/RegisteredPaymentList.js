/**  =========================> *|`| % 登记收款列表 % |`|*<======================== **/
// methodName
import * as types from '@/store/mutation-type';

// api
import {
    getRegisterList,
} from '../../../api/AfterSalesManagement/registeredPaymentList'

const config = {
    state: {
        RegisteredPaymentInfo: {},
    },
    mutations: {
        [types.SAVE_REGISTERED_PAYMENT_INFO](state, saveInfo) {
            state.RegisteredPaymentInfo = saveInfo;
        },
    },
    actions: {
        GetRegisterList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getRegisterList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_REGISTERED_PAYMENT_INFO'], response.data);
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
