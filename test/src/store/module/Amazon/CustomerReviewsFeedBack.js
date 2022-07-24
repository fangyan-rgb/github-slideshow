/**  =========================> *|`| % 客户评价feedback % |`|*<======================== **/
// methodName
import * as types from '@/store/mutation-type';

// api
import {
    feedbackList,
} from '@/api/Amazon/customerReviewsFeedBack'

const config = {
    state: {
        CustomerFeedbackInfo: {},
    },
    mutations: {
        [types.SAVE_CUSTOMER_FEEDBACK_INFO](state, saveInfo) {
            state.CustomerFeedbackInfo = saveInfo;
        },
    },
    actions: {
        GetFeedBackList({ commit }, queryData = {}) {
            return new Promise((resolve, reject) => {
                feedbackList(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_CUSTOMER_FEEDBACK_INFO'], response.data);
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
