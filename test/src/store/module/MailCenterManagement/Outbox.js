
// methodName
import * as types from '@/store/mutation-type';

// api
import {
  getOutboxList,
} from '@/api/MailCenterManagement/Outbox';


const config = {
    state: {
        OutboxObj: {},
    },
    mutations: {
        [types.SAVE_OUT_BOX_OBJ](state, saveInfo) {
            state.OutboxObj = saveInfo;
        },
    },
    actions: {
        GetOutboxList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getOutboxList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_OUT_BOX_OBJ'], response.data);
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
