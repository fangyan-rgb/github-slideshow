/**  =========================> *|`| % 售后单管理 % |`|*<======================== **/
// methodName
import * as types from '@/store/mutation-type';

// api
import {
    getList,
} from '../../../api/AfterSalesManagement/afterSalesOrderManagement'

const config = {
    state: {
        AfterSaleInfo: {},
    },
    mutations: {
        [types.SAVE_AFTER_SALE_INFO](state, saveInfo) {
            state.AfterSaleInfo = saveInfo;
        },
    },
    actions: {
        AfterSaleOrderManagementList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_AFTER_SALE_INFO'], response.data);
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
