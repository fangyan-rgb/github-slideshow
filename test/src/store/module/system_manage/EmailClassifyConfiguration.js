
/**  =========================> *|`| % （store）邮件分类配置 % |`|*<======================== **/

// methodName
import * as types from '../../mutation-type';

// api
import {
    getEmailClassifyConfigurationListInfo,   //API文件内获取列表数据方法
} from '../../../api/SystemManagement/GetEmailClassifyConfiguration';   /* 此地址要修改，改成请求数据的js文件的路径API */

const config = {
    state: {
        emailClassifyConfigurationInfo: {}   //自定义对象名，注意不能重名,同18行代码，同getters
    },
    mutations: {
        [types.SAVE_EMAIL_CLASS_CONFIGURATION_LIST_INFO](state, saveInfo) {    // SAVE_LABEL_CONFIGURATION_LIST_INFO自定义,见mutation-type.js 
            state.emailClassifyConfigurationInfo = saveInfo;
        }
    },
    actions: {

        // 获取信息
        GetEmailClassifyConfigurationListInfo({ commit }, queryData) {  // 获取列表数据方法，注意大写
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getEmailClassifyConfigurationListInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_EMAIL_CLASS_CONFIGURATION_LIST_INFO'], response.data);
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

