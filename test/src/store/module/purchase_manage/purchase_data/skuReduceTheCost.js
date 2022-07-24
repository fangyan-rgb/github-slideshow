
/**  =========================> *|`| % sku降本% |`|*<======================== **/

// methodName
import * as types from '../../../mutation-type';

// api
import {
    getSkuReduceTheCostList,
} from '../../../../api/purchasingDataManagement/skuReduceTheCost';

const config = {
    state: {
        skuCutTheCostDataInfo: {}
    },
    mutations: {
        [types.SAVE_SKU_CUT_THE_COST_DATA_INFO](state, saveInfo) {
            console.log(saveInfo);
            state.skuCutTheCostDataInfo = saveInfo;
        },
    },
    actions: {

        // 获取sku降本信息
        GetSkuReduceTheCostList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getSkuReduceTheCostList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_SKU_CUT_THE_COST_DATA_INFO'], response.data);
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

