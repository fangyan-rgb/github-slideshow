/**  =========================> *|`| % 模板分类配置 % |`|*<======================== **/
// methodName
import * as types from '@/store/mutation-type';

// api
import {
    getClassTemplateList,
} from '../../../api/SystemManagement/templateClassificationConfiguration'

const config = {
    state: {
        TemplateClassInfo: {},
    },
    mutations: {
        [types.SAVE_TEMPLATE_CLASS_INFO](state, saveInfo) {
            state.TemplateClassInfo = saveInfo;
        },
    },
    actions: {
        GetClassTemplateList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getClassTemplateList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_TEMPLATE_CLASS_INFO'], response.data);
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
