/**  =========================> *|`| % 基础数据配置 % |`|*<======================== **/
// methodName
import * as types from '@/store/mutation-type';

// api
import {
    getBasicDataList,
} from '../../../api/SystemManagement/basicDataConfiguration'

const config = {
    state: {
        BasicDataInfo: {},
    },
    mutations: {
        [types.SAVE_BASIC_DATA_INFO](state, saveInfo) {
            state.BasicDataInfo = saveInfo;
        },
    },
    actions: {
        GetBasicDataList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getBasicDataList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_BASIC_DATA_INFO'], response.data);
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
