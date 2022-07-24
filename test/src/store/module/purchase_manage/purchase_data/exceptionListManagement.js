
/**  =========================> *|`| % 异常订单处理 % |`|*<======================== **/

// methodName
import * as types from '../../../mutation-type';

// api
import {
    getExceptionList,
} from '../../../../api/exceptionListManagement';

const config = {
    state: {
        unusualDataInfo: {}
    },
    mutations: {
        [types.SAVE_UNUSUAL_DATA_INFO](state, saveInfo) {
            console.log(saveInfo);
            state.unusualDataInfo = saveInfo;
        },
    },
    actions: {

        // 获取异常订单处理信息
        GetExceptionList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getExceptionList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_UNUSUAL_DATA_INFO'], response.data);
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

