
/**  =========================> *|`| % sku权均交期 % |`|*<======================== **/

// methodName
import * as types from '../../../mutation-type';

// api
import {
    getSkuRighttoDeliveryList,
} from '../../../../api/purchasingDataManagement/skuRightToDelivery';

const config = {
    state: {
        skuRighttolDataInfo: {}
    },
    mutations: {
        [types.SAVE_SKU_RIGHTTO_DATA_INFO](state, saveInfo) {
            console.log(saveInfo);
            state.skuRighttolDataInfo = saveInfo;
        },
    },
    actions: {

        // 获取sku权均交期信息
        GetSkuRighttoDeliveryList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                getSkuRighttoDeliveryList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_SKU_RIGHTTO_DATA_INFO'], response.data);
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

