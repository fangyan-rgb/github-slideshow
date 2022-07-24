
// methodName
import * as types from '@/store/mutation-type';

// api
import {
  getRecycleBinList,
} from '@/api/MailCenterManagement/RecycleBin';


const config = {
    state: {
        RecycleBinObj: {},
    },
    mutations: {
        [types.SAVE_RECYCLE_BIN_OBJ](state, saveInfo) {
            state.RecycleBinObj = saveInfo;
        },
    },
    actions: {
        GetRecycleBinList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getRecycleBinList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_RECYCLE_BIN_OBJ'], response.data);
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
