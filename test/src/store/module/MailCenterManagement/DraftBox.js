
// methodName
import * as types from '@/store/mutation-type';

// api
import {
  getDraftBoxList,
} from '@/api/MailCenterManagement/DraftBox';


const config = {
    state: {
        DraftBoxObj: {},
    },
    mutations: {
        [types.SAVE_DRAFT_BOX_OBJ](state, saveInfo) {
            state.DraftBoxObj = saveInfo;
        },
    },
    actions: {
        GetDraftBoxList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getDraftBoxList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DRAFT_BOX_OBJ'], response.data);
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
