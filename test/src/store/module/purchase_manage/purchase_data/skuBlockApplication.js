
/**  =========================> *|`| % sku屏蔽申请% |`|*<======================== **/

// methodName
import * as types from '../../../mutation-type';

// api
import {
    getSkuShieldApplyfor,
} from '../../../../api/purchasingDataManagement/skuBlockApplication';

const config = {
    state: {
        skuShieldDataInfo: {}
    },
    mutations: {
        [types.SAVE_SKUSHIELD_DATA_INFO](state, saveInfo) {
            console.log(saveInfo);
            state.skuShieldDataInfo = saveInfo;
        },
    },
    actions: {

        // 获取sku屏蔽信息
        GetSkuShieldApplyfor({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getSkuShieldApplyfor(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_SKUSHIELD_DATA_INFO'], response.data);
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

