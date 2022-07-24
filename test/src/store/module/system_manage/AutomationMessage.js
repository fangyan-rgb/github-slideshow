
/**  =========================> *|`| % （store）自动信息记录 % |`|*<======================== **/

// methodName
import * as types from '../../mutation-type';

// api
import {
    getAutomationMessageListInfo,   //API文件内获取列表数据方法
} from '../../../api/SystemManagement/GetAutomationMessage';   /* 此地址要修改，改成请求数据的js文件的路径API */

const config = {
    state: {
        automationMessageInfo: {}   //自定义对象名，注意不能重名,同18行代码，同getters
    },
    mutations: {
        [types.SAVE_AUTOMATION_MESSAGE_LIST_INFO](state, saveInfo) {    // SAVE_LABEL_CONFIGURATION_LIST_INFO自定义,见mutation-type.js 
            state.automationMessageInfo = saveInfo;
        }
    },
    actions: {

        // 获取信息
        GetAutomationMessageListInfo({ commit }, queryData) {  // 获取列表数据方法，注意大写
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getAutomationMessageListInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_AUTOMATION_MESSAGE_LIST_INFO'], response.data);
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

