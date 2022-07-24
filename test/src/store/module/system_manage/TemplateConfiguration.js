/**  =========================> *|`| % 模板配置 % |`|*<======================== **/
// methodName
import * as types from '@/store/mutation-type';

// api
import {
    getTemplateList,
} from '../../../api/SystemManagement/templateConfiguration'

const config = {
    state: {
        TemplateConfigInfo: {},
    },
    mutations: {
        [types.SAVE_TEMPLATE_CONFIG_INFO](state, saveInfo) {
            state.TemplateConfigInfo = saveInfo;
        },
    },
    actions: {
        GetTemplateList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getTemplateList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_TEMPLATE_CONFIG_INFO'], response.data);
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
