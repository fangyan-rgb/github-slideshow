
import * as types from './mutation-type';
import * as Storage from '@/utils/storage';
import Store from '@/store';
import buttonList from '../authority/button_config';
import mailConfig from "@/assets/js/mailProcessingConfig";

export default {
    [types.SAVE_LOADING_STATE](state, data) {
        state.showLoading = data;
    },

    // 保存登录信息
    [types.SAVE_LOGIN_INFO](state, loginInfo) {
        state.loginInfo = loginInfo;
        Storage.setSessionStorage('userInfo', loginInfo ? JSON.stringify(loginInfo) : '');
    },

    // 保存按钮配置
    [types.SAVE_BUTTON_CONFIG](state, saveInfo) {
        state.buttonList = buttonList[saveInfo.replace(/^[\/]/, '')] && buttonList[saveInfo.replace(/^[\/]/, '')].buttonList;
    },

    // 保存查询参数
    [types.SAVE_QUERY_PARAMS_INFO](state, saveInfo) {
        state.queryParamsInfo[saveInfo.key] = saveInfo.value;
    },
    // 保存页面缓存状态
    [types.SAVE_PAGE_CACHE_STATUS](state, saveInfo) {
        state.pageCacheStatus[saveInfo.key] = saveInfo.value;
    },

    // 保存多页签对象
    [types.SAVE_MULTIPLE_OBJ](state, saveInfo) {
        state.multipleObj = saveInfo;
    },

    // 保存权限资源菜单
    [types.SAVE_PERMIT_PATH_INFO](state, infoList) {
        let arr = [];
        for (let i = 0; i < infoList.length; i++) {
            arr.push(infoList[i].resource_path)
        }
        state.permitPath = state.permitPath.concat(arr);
    },

    // 保存权限资源按钮
    [types.SAVE_PERMIT_RESOURCE_INFO](state, infoList) {
        // 递归函数
        let callBack = function (children, saveObj, isRoot) {
            if (children && children.length) {
                for (let i = 0; i < children.length; i++) {
                    if (children[i].children && children[i].children.length) {
                        saveObj[children[i].resource_name] = {};
                        callBack(children[i].children, saveObj[children[i].resource_name])
                    } else {
                        saveObj[children[i].resource_name] = true
                    }
                }
            } else if (isRoot) {
                return true;
            }
        };
        let obj = {};
        for (let i = 0; i < infoList.length; i++) {
            obj[infoList[i].resource_name] = {};
            callBack(infoList[i].children, obj[infoList[i].resource_name], true) === true ? obj[infoList[i].resource_name] = true : false;
        }
        state.permitResource = obj;
    },

    /**
     * 保存页签:
     *  isRemove 1 移除单个; 2 移除全部; 3 替换参数
     * **/
    [types.SAVE_TAB_LABELS](state, saveInfo) {

        let initFn = (obj) => {
            for (let key in obj) {
                switch (typeof obj[key]) {
                    case 'number':
                        obj[key] = 0;
                        break;
                    case 'string':
                        obj[key] = '';
                        break;
                    case 'boolean':
                        obj[key] = false;
                        break;
                    case 'object':
                        obj[key] = obj[key] instanceof Array ? [] : {};
                        break;
                }
                // console.log(obj[key]);
            }

        };

        if (saveInfo.isRemove === 1) {
            state.tabLabel.forEach((element, index) => {
                if (saveInfo.path == element.path) {
                    state.tabLabel.splice(index, 1);  // 删除
                } else if (saveInfo.name == element.name) {     // 通过name属性也能删除
                    state.tabLabel.splice(index, 1);  // 删除
                }
            });

            if( saveInfo.path ){    // 兼容name删除方式
                let resetObj = state[saveInfo.path.replace('/', '')];
                initFn(resetObj);
            }

        } else if (saveInfo.isRemove === 2) {
            let leaveArr = [];
            for (let i = 0; i < state.tabLabel.length; i++) {
                if (state.tabLabel[i].path === saveInfo.path) {
                    leaveArr.push(state.tabLabel[i]);
                    break;
                }
            }
            // 关闭全部的缓存
            let pathArr = Array.from(Store.getters.permitPath);
            for (let i = 0; i < pathArr.length; i++) {
                if (pathArr[i] === saveInfo.path) continue;
                let resetObj = state[pathArr[i].replace('/', '')];
                initFn(resetObj);
            }
            state.tabLabel.splice(0);
            state.tabLabel = leaveArr;
        } else if (saveInfo.isRemove === 3) {
            state.tabLabel.forEach((element, index) => {
                if (saveInfo.path == element.path) {
                    element.query = {...saveInfo.query};
                } else if (saveInfo.name == element.name) {     // 通过name属性也能找到
                    element.query = {...saveInfo.query};
                    element.path = saveInfo.path;
                }
            });
        } else {
            for (let i = 0; i < state.tabLabel.length; i++) {
                // 如果已存在就替换参数
                if (state.tabLabel[i].path === saveInfo.path) {
                    state.tabLabel[i].query = {...saveInfo.query};
                    return;
                }
            }
            if (state.tabLabel.length > 7) {
                initFn(state[state.tabLabel[0].path.replace('/', '')]);
                let tabLabelObj = state.tabLabel.shift();
                // 定义邮件处理标签名数组
                let MailProcessingArr = JSON.parse(JSON.stringify(mailConfig.paramsRouterObj));
                let mailArr = [];
                for (let key in MailProcessingArr) {
                    if (MailProcessingArr.hasOwnProperty(key)) {
                        let element = MailProcessingArr[key];
                        mailArr.push({name: element.pathName, paramsName: key});
                    }
                }
                // 如果当前的标签是邮件处理   那删除这个邮件处理标签列表
                let findObj = mailArr.find(e => e.name === tabLabelObj.name );
                if( findObj ){
                    this.commit('SAVE_QUERY_PARAMS_INFO', {
                        key: findObj.paramsName,
                        value: '[]'
                    });
                }
            }
            state.tabLabel.push(saveInfo);
        }
    },

    // 导航激活INDEX
    [types.SAVE_NAV_INDEX](state, saveInfo) {

        state.navIndex = saveInfo;
    },

    // 展开指定导航面板INDEX
    [types.SAVE_NAV_SINGLE_INDEX](state, saveInfo) {
        state.singleNavIndex = saveInfo;
    },

    // 公共搜索配置
    [types.SAVE_COMMON_SEARCH_CONFIG](state, info) {
        if (info.all_data) {
            state.searchConfig.all_data = info.all_data
            state.searchConfig.main_data = info.main_data
        }
    },
    // 保存勾选搜索条件
    [types.SAVE_CHECK_SEARCH_INFO](state, saveInfo) {
        state.checkedSearchInfo = saveInfo;
    },

     // 保存勾选搜索条件
     [types.SAVE_CHECK_MAINDATA](state, saveInfo) {
        state.checkedMainData = saveInfo;
    },


}