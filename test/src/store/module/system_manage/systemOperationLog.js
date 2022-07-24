
/**  =========================> *|`| % 系统操作日志 % |`|*<======================== **/

// methodName
import * as types from '../../mutation-type';

// api
import {
    getSystemOperationLog,
} from '../../../api/SystemManagement/SystemOperationLog';

const config = {
    state: {
        systemDataInfo: {}
    },
    mutations: {
        [types.SAVE_SYSTEM_DATA_INFO](state, saveInfo) {
            console.log(saveInfo);
            state.systemDataInfo = saveInfo;
        },
    },
    actions: {

        // 获取系统操作日志信息
        GetSystemOperationLog({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getSystemOperationLog(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_SYSTEM_DATA_INFO'], response.data);
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

