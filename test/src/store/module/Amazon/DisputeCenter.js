
// methodName
import * as types from '@/store/mutation-type';

// api
import {
  getDisputeCenterList,
} from '@/api/Amazon/DisputeCenter';

const config = {
    state: {
        DisputeCenterObj: {},
    },
    mutations: {
        [types.SAVE_DISPUTE_CENTER_OBJ](state, saveInfo) {
            state.DisputeCenterObj = saveInfo;
        },
    },
    actions: {
        GetDisputeCenterList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getDisputeCenterList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DISPUTE_CENTER_OBJ'], response.data);
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
