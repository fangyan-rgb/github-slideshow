
// methodName
import * as types from '@/store/mutation-type';

// api
import {
  getMessageCenterList,
} from '@/api/Amazon/MessageCenter';

const config = {
    state: {
        MessageCenterObj: {},
    },
    mutations: {
        [types.SAVE_MESSAGE_CENTER_OBJ](state, saveInfo) {
            state.MessageCenterObj = saveInfo;
        },
    },
    actions: {
        GetMessageCenterList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getMessageCenterList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_MESSAGE_CENTER_OBJ'], response.data);
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
