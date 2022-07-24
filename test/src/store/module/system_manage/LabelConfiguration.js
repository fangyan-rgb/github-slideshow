
/**  =========================> *|`| % （store）标签配置 % |`|*<======================== **/

// methodName
import * as types from '../../mutation-type';

// api
import {
    getLabelConfigurationListInfo,   //API文件内获取列表数据方法
} from '../../../api/SystemManagement/GetLabelConfiguration';   /* 此地址要修改，改成请求数据的js文件的路径API */

const config = {
    state: {
        labelConfigurationInfo: {}   //自定义对象名，注意不能重名,同18行代码，同getters
    },
    mutations: {
        [types.SAVE_LABEL_CONFIGURATION_LIST_INFO](state, saveInfo) {    // SAVE_LABEL_CONFIGURATION_LIST_INFO自定义,见mutation-type.js 
            state.labelConfigurationInfo = saveInfo;
        }
    },
    actions: {

        // 获取信息
        GetLabelConfigurationListInfo({ commit }, queryData) {  // 获取列表数据方法，注意大写
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getLabelConfigurationListInfo(queryData).then(response => {                  
                    if (response.data.status === 1) {
                        commit(types['SAVE_LABEL_CONFIGURATION_LIST_INFO'], response.data);
                    
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

