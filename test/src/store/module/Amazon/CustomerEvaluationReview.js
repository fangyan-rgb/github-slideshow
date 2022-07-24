/**  =========================> *|`| % 客户评价review % |`|*<======================== **/
// methodName
import * as types from '@/store/mutation-type';

// api
import {
    reviewList,
} from '@/api/Amazon/customerEvaluationReview'

const config = {
    state: {
        CustomerReviewInfo: {},
    },
    mutations: {
        [types.SAVE_CUSTOMER_REVIEW_INFO](state, saveInfo) {
            state.CustomerReviewInfo = saveInfo;
        },
    },
    actions: {
        GetReviewList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                reviewList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_CUSTOMER_REVIEW_INFO'], response.data);
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
