
/**  =========================> *|`| % 任务权限管理 % |`|*<======================== **/

// methodName
import * as types from '../../mutation-type';

// api
import {
    getJurisdictionManagementMation,
} from '../../../api/AccountManagement/jurisdiction_management';

const config = {
    state: {
        jurisdictionManagementMation: {}
    },
    mutations: {
        [types.SAVE_JURISDICTION_MANAGEMENT](state, saveInfo) {
            state.JurisdictionManagementMation = saveInfo;
        }
    },
    actions: {

        // 获取信息
        GetJurisdictionManagementMation({ commit }, queryData) {
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getJurisdictionManagementMation(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_JURISDICTION_MANAGEMENT'], response.data);
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