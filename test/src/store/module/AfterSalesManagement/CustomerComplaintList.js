/**  =========================> *|`| % 客诉列表 % |`|*<======================== **/
// methodName
import * as types from '@/store/mutation-type';

// api
import {
    getComplaintList,
} from '../../../api/AfterSalesManagement/customerComplaintList'

const config = {
    state: {
        CustomerComplaintInfo: {},
    },
    mutations: {
        [types.SAVE_CUSTOMER_COMPLAINT_INFO](state, saveInfo) {
            state.CustomerComplaintInfo = saveInfo;
        },
    },
    actions: {
        GetComplaintList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getComplaintList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_CUSTOMER_COMPLAINT_INFO'], response.data);
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
