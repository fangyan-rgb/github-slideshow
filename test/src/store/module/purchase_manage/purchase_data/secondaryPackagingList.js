
/**  =========================> *|`| % 二次包装列表 % |`|*<======================== **/

// methodName
import * as types from '../../../mutation-type';

// api
import {
    getSecondaryPackagingList,
} from '../../../../api/purchasingDataManagement/secondaryPackagingList';

const config = {
    state: {
        twiceDataInfo: {}
    },
    mutations: {
        [types.SAVE_TWICE_DATA_INFO](state, saveInfo) {
            console.log(saveInfo);
            state.twiceDataInfo = saveInfo;
        },
    },
    actions: {

        // 获取二次包装信息
        GetSecondaryPackagingList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getSecondaryPackagingList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_TWICE_DATA_INFO'], response.data);
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

