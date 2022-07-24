import mailConfig from "@/assets/js/mailProcessingConfig";
// 预先在查询参数里设置好存储所有邮件处理列表的键  初始值为 '[]'
let MailProcessingArr = JSON.parse(JSON.stringify(mailConfig.paramsRouterObj));
let tempObj = {};
for (let key in MailProcessingArr) {
    if (MailProcessingArr.hasOwnProperty(key)) {
        tempObj[key] = '[]';
    }
}

const states = {
    showLoading: false,
    systemId: '',
    loginInfo: {},
    buttonList: [],
    permitPath: [],
    permitResource: {},
    //查询参数
    queryParamsInfo: {
        ...tempObj
    },
    tabLabel: [],
    navIndex: '1-1',
    singleNavIndex: '',
    multipleObj: {},
    // 公共搜索配置
    searchConfig: {},
    // 勾选搜索条件
    checkedSearchInfo: [],
    checkedMainData: [],

    // 页面缓存状态
    pageCacheStatus: {},
};

export default states;
