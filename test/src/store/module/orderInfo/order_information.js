
/**  =========================> *|`| % 订单信息 % |`|*<======================== **/

// methodName
import * as types from '../../mutation-type';

// api
import {
    getOrderInformation,
} from '../../../api/orderInfo/order_information';

const config = {
    state: {
        orderInformation: {}
    },
    mutations: {
        [types.SAVE_ORDER_INFORMATION](state, saveInfo) {
            state.orderInformation = saveInfo;
        }
    },
    actions: {

        // 获取信息
        GetOrderInformation({ commit }, queryData) {
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getOrderInformation(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ORDER_INFORMATION'], response.data);
                    }
                    resolve(response);
                }).catch(error => {
                    reject(error);
                })
            })
        }
    }
};

export default config;