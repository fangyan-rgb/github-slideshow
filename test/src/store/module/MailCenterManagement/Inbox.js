
// methodName
import * as types from '@/store/mutation-type';

// api
import {
  getInboxList,
} from '@/api/MailCenterManagement/Inbox';


const config = {
    state: {
        InboxObj: {},
    },
    mutations: {
        [types.SAVE_IN_BOX_OBJ](state, saveInfo) {
            state.InboxObj = saveInfo;
        },
    },
    actions: {
        GetInboxList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getInboxList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_IN_BOX_OBJ'], response.data);
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
