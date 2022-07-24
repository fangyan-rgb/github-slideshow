
/**  =========================> *|`| % 报损信息管理 % |`|*<======================== **/

// methodName
import * as types from '../../../mutation-type';

// api
import {
    getbreakageMessageList,
} from '../../../../api/breakageMessageManage';

const config = {
    state: {
        breakageDataInfo: {}
    },
    mutations: {
        [types.SAVE_BREAKAGE_DATA_INFO](state, saveInfo) {
            console.log(saveInfo);
            state.breakageDataInfo = saveInfo;
        },
    },
    actions: {

        // 获取报损信息
        GetbreakageMessageList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getbreakageMessageList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_BREAKAGE_DATA_INFO'], response.data);
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

