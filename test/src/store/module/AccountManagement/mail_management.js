/**  =========================> *|`| % 邮箱管理 % |`|*<======================== **/

// methodName
import * as types from '../../mutation-type';

// api
import {
    mailManagementList,
} from '../../../api/AccountManagement/mail_management';

const config = {
    state: {
        mailManagementMation: {}
    },
    mutations: {
        [types.SAVE_MAIL_MANAGEMENT](state, saveInfo) {
            state.mailManagementMation = saveInfo;
        }
    },
    actions: {

        // 获取信息
        mailManagementList({ commit }, queryData) {
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                mailManagementList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_MAIL_MANAGEMENT'], response.data);
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