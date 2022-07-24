<!-- 搜索配置 -->
<template>
    <div>
        <ul class="ui-main-module-search clearFix">
            <li v-for='(item, index) in mainData.slice(0, advancedFilterLength)' :key='item.html_name' v-if="attributeName[index]">
                <SearchRequirement :label='item.attribute_name'>
                    <el-input v-if="item.css_type === 'input' && item.is_datetime === '0'"  size="small" v-model='queryData[attributeName[index]]'
                        clearable @keyup.enter.native='handleQuery(false)' placeholder='请输入'>
                    </el-input>
                    <el-select v-if='item.css_type ==="select"' size='small' v-model='queryData[attributeName[index]]' :clearable='!item.isRequire' filterable
                    :remote='item["is_url"] === "1" && item["search_type"] !== "3" && item["search_request"] !== "0"' :remote-method='(query)=> { item["is_url"] === "1"&& item["search_type"] !== "3" & item["search_request"] !== "0"?
                     handleGetOption(item, query, item["select"] === "2"): "" }' @clear='handleClear'
                       :placeholder='item["is_url"] === "1" && item["search_request"] !== "0"? "关键词搜索": "请选择"' @change='(val)=> {item["select"] === "2"? handleSelectChange(item, val): item["is_caderser"]? handleCascaderSelectChange(item, val): ""}' 
                       :multiple='item["select"] === "2"' collapse-tags v-filter @focus='()=> {handleSelectFocus(item)}'>
                        <el-option v-for='(_item, _index) in item.optionValue' :key='_index' :value='_item["id"]' :label="_item['value']? _item['value']: ''">
                        </el-option>
                    </el-select>
                    <el-date-picker v-if="item.css_type === 'input' && item.is_datetime === '1'" size="small" v-model="queryData[attributeName[index]]"
                        type="datetimerange" start-placeholder="开始日期时间" end-placeholder="结束日期时间" range-separator="至"
                        value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"  :picker-options="pickerOptions">
                    </el-date-picker>
                    <el-cascader v-if="item.css_type === 'cascader'" size="small" v-model='queryData[attributeName[index]]'  placeholder="请选择" clearable
                        :options="item.options" filterable :props="{ checkStrictly: true, emitPath: true }"/>
                    <InputRangeNumber v-if='item.css_type === "InputRangeNumber"' v-model='queryData[attributeName[index]]' :precision ='Number(item["precision"])'/>
                </SearchRequirement>
            </li>
            <transition name="slide-fade" v-if="mainData.length > advancedFilterLength">
                <div v-if="advancedFilter">
                    <li v-for='(item, index) in mainData.slice(advancedFilterLength)' :key='item.html_name' v-if="attributeName[index + advancedFilterLength]" >
                        <SearchRequirement :label='item.attribute_name'>
                            <el-input v-if="item.css_type === 'input' && item.is_datetime === '0'"  size="small" v-model='queryData[attributeName[index + advancedFilterLength]]'
                                clearable @keyup.enter.native='handleQuery(false)' placeholder='请输入'>
                            </el-input>
                            <el-select v-if='item.css_type ==="select"' size='small' v-model='queryData[attributeName[index + advancedFilterLength]]' :clearable='!item.isRequire' filterable
                               :remote='item["is_url"] === "1" && item["search_type"] !== "3" && item["search_request"] !== "0"' :remote-method='(query)=> { item["is_url"] === "1"&& item["search_type"] !== "3" && item["search_request"] !== "0"? handleGetOption(item, query, item["select"] === "2"): "" }' @clear='handleClear'
                               :placeholder='item["is_url"] === "1" && item["search_request"] !== "0"? "关键词搜索": "请选择" ' @change='(val)=> {item["select"] === "2"? handleSelectChange(item, val): item["is_caderser"]? handleCascaderSelectChange(item, val): ""}'
                               :multiple='item["select"] === "2"' collapse-tags v-filter @focus='()=> {handleSelectFocus(item)}'>
                                <el-option v-for='(_item, _index) in item.optionValue' :key='_index' :value='_item["id"]' :label="_item['value']? _item['value']: ''"></el-option>
                            </el-select>
                            <el-date-picker v-if="item.css_type === 'input' && item.is_datetime === '1'" size="small" v-model="queryData[attributeName[index + advancedFilterLength]]"
                                type="datetimerange" start-placeholder="开始日期时间" end-placeholder="结束日期时间" range-separator="至"
                                value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions">
                            </el-date-picker>
                            <el-cascader v-if="item.css_type === 'cascader'" size="small" v-model='queryData[attributeName[index + advancedFilterLength]]'  placeholder="请选择" clearable
                                :options="item.options" filterable :props="{ checkStrictly: true, emitPath: true }"/>
                            <InputRangeNumber v-if='item.css_type === "InputRangeNumber"' v-model='queryData[attributeName[index + advancedFilterLength]]' :precision ='Number(item["precision"])'/>
                        </SearchRequirement>
                    </li>
                </div>
            </transition>
            <slot></slot>
        </ul>
        <div class="ui-main-search-btn ui-btn-chose">
            <el-button size="small" @click="handleQuery(true)"><i class="icon-zhongzhi"></i>重置</el-button>
            <el-button size="small" @click="handleQuery(false)" type="primary"><i class="icon-chaxun"></i>查询</el-button>
            <el-button v-if="mainData.length > 10" size="small" @click="handleButtonChose" type="text" v-show="!advancedFilter" class="btn-style">高级筛选<i
                class="el-icon-caret-bottom"></i></el-button>
            <el-button size="small" v-if="mainData.length > 10" @click="handleButtonChose" type="text" v-show="advancedFilter" class="btn-style">
                基本筛选<i class="el-icon-caret-top"></i></el-button>
        </div>
    </div>
</template>
<script>
    import Store from '@/store'
    import { mapGetters } from 'vuex'
    import { getSearchList } from '../api/Common'
    import { defaultConfig } from '@/assets/js/commonSearch'
    import http from '@/http';
    import moment from 'moment'

    export default {
        name: 'ComSearchCondition',
        props: {
            componentName: {
                default: '',
            }
        },
        data() {
            return {
                // 查询对象
                queryData: {},
                // 默认搜索属性名
                attributeName: [],
                // 高级筛选
                advancedFilter: false,
                // 高级筛选长度
                advancedFilterLength: 10,
                // 是否首次进来
                isInitialize: false,
                pickerOptions: {
                    shortcuts: [{
                            text: '当日',
                            onClick(picker) {
                            const start = moment().hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                            const end = moment().hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                            picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '昨日',
                            onClick(picker) {
                            const start = moment().subtract(1, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                            const end = moment().subtract(1, 'day').hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                            picker.$emit('pick', [start, end]);
                            }
                        },{
                            text: '本月',
                            onClick(picker) {
                            const start = moment().subtract(moment().get('date')-1, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                            const end = moment().hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                            picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '上月',
                            onClick(picker) {
                            const start = moment().subtract(1, 'month').subtract(moment().get('date')-1, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                            const end = moment().subtract(moment().get('date'), 'day').hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                            picker.$emit('pick', [start, end]);
                            }
                        },{
                            text: '过去2天',
                            onClick(picker) {
                            const start = moment().subtract(1, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                            const end = moment().hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                            picker.$emit('pick', [start, end]);
                            }
                        },{
                            text: '过去3天',
                            onClick(picker) {
                            const start = moment().subtract(2, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                            const end = moment().hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                            picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '过去7天',
                            onClick(picker) {
                            const start = moment().subtract(6, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                            const end = moment().hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                            picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '过去30天',
                            onClick(picker) {
                            const start = moment().subtract(29, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                            const end = moment().hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                            picker.$emit('pick', [start, end]);
                            }
                        }]
                },
                mainData: [],
            }
        },
        methods: {
            handleQuery(isReset) {
                if (isReset) {
                    this.queryData = {}
                    this.handleResetQueryCondition()
                    this.$emit('handleResetQueryInfo')
                } else {
                    const queryData = this.handleEmitQueryData()
                    for (var key in queryData) {
                        if (queryData[key] === null || queryData[key] === '' || typeof queryData[key] === 'undefined') {
                            delete queryData[key]
                        }
                    }
                    this.$emit('handleQueryInfo', queryData);
                }
            },
            /**
             * CaseeLee
             * 查询默认搜索
             */
            handleQuerySearchList() {
                let main_title_id = ''
                for (let key in defaultConfig) {
                    if (defaultConfig[key] === this.routePath) {
                        main_title_id = key
                    }
                }
                if (!main_title_id) {
                    this.$message.error('页面搜索配置不存在')
                    return
                }
                getSearchList({ main_title_id }).then(({ data }) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess);
                        return
                    }
                    if (data.data_list && data.data_list.all_data) {
                        this.handleSaveSearchData(data.data_list)
                    }

                }).catch(error => { this.$message.error(error) })
            },
            /**
             * CaseeLee
             * 保存查询条件
             * @param data 默认查询条件
             */
            handleSaveSearchData(data) {
                if (this.searchConfig && this.searchConfig['main_data']) {
                    this.searchConfig['main_data'][this.routePath] = data.main_data
                    this.searchConfig['all_data'][this.routePath] = data.all_data
                } else {
                    const searchConfig = {all_data: {[this.routePath] : data.all_data} , main_data: {[this.routePath] : data.main_data}}
                    // 设置搜索配置可勾选条件
                    Store.commit('SAVE_COMMON_SEARCH_CONFIG', searchConfig);
                }
                // 设置搜索配置选中item
                Store.commit('SAVE_CHECK_MAINDATA', data.main_data);
            },
             /**
             * CaseeLee
             * 处理转化返回如下拉框等数据格式
             * @param main_data 查询数据
             */
             handleTransformData(main_data) {
                if (Array.isArray(main_data)) {
                    main_data.forEach((item, index) => {
                        if (this.routePath === '/Inbox')  {
                            if (item.html_name === 'email_cate') {
                                item['isRequire'] = true
                            } 
                        } else if (this.routePath === '/EbayMessage') {
                            if (item.html_name === 'message_type') {
                                item['isRequire'] = true
                            } 
                        }
                        if (this.routePath === '/Inbox')  {
                            if (item.html_name === 'email_cate') {
                                item['isRequire'] = true
                            }
                        }
                        if (item.css_type === 'select') {
                            if (item['select_data'] && item['is_url'] === '0') {
                                try {
                                    item['optionValue'] = JSON.parse(item['select_data'])
                                    item['originOptionValue'] = item['optionValue']
                                    }
                                catch(err) {
                                    console.log('json解析出错', item['select_data'], err)
                                    }
                            } else if (!item['optionValue'] && item['is_url'] === '1') {
                                if (!(this.$route.query._cacheType === '1' && this.$route.query[item.html_name])) {
                                    item['optionValue'] = []
                                    if (item['first_data'] === '1') {
                                        this.handleGetOption(item, '')
                                    }
                                }
                            }
                        } else if (item.css_type === 'cascader' && !item['options']) {
                            item['options'] = []
                            this.handleGetCascaderOption(item)
                        }
                    })
                    this.mainData = main_data
                    // 设置搜索配置选中的搜索条件值
                    Store.commit('SAVE_CHECK_SEARCH_INFO', main_data.map(item => item.html_name));
                }
            },
            /**
             * CaseeLee
             * 设置查询对象
             * @param main_data 查询数据
             */
            handleSettingQueryData(main_data) {
                const queryData = {}
                this.attributeName = main_data.map(item => {
                    if (this.queryData[item.html_name]) {
                        queryData[item.html_name] = this.queryData[item.html_name]
                    } else {
                        if (item.is_datetime === '1' || item.css_type === 'cascader'
                        || (item.is_select === '1' && item.select === "2")) {
                            queryData[item.html_name] = []
                        } else if (item.css_type === 'InputRangeNumber') {
                            queryData[item.html_name] = []
                        } else {
                            queryData[item.html_name] = ''
                        }
                    }
                    return item.html_name
                })
                this.queryData = {...queryData}
                this.handleResetQueryCondition()
                this.dynamicAddSeleteIconClass()
                this.$emit("handleLoadOk")
            },
            getParentElement(e, className) {
                if (e.parentNode) {
                    if (e.parentNode.className.indexOf(className) !== -1) {
                            return e.parentNode
                    } else {
                        return this.getParentElement(e.parentNode, className)
                    }
                } else {
                   return null
                }
            },
            /**
             * CaseeLee
             * 默认下拉框请求
             * @param item 数据项
             */
            async handleGetOption(item, query, isMultiple, callback) {
                if (!query && isMultiple) return
                let url = item['url_address']
                let param = {}
                typeof(query) === 'object'? param = query: param = {account_name: query}
                param = {...param,...this.handleUrlParm(url)}
                url = this.handleQueryUrl(item['url_address'])
                // 联动处理, 获取父级联动参数
                const cascaderItem = this.mainData.find(_item => {
                    let arr = []
                    let idArr = JSON.parse(_item['is_caderser'])
                    Object.prototype.toString.call(idArr) === '[object Array]'? arr = idArr: arr.push(Number(_item['is_caderser']))
                    return arr.indexOf(Number(item['id'])) !== -1 
                })
                if (cascaderItem) {
                    // 优先使用caderser_string查询
                    if (!this.queryData[cascaderItem['html_name']]) return
                    const key = cascaderItem["caderser_string"]? cascaderItem["caderser_string"]: cascaderItem['html_name']
                    param[key] = this.queryData[cascaderItem['html_name']]
                }
                await http.getAjax(url, param).then(({data}) => {
                    if (data.status !== 1){
                        this.$message.error(data.errorMess || '操作失败')
                        return
                    }
                    item['optionValue'] = item['cacheSelectItem'] && item['cacheSelectItem'].length? 
                    [...data.data_list.filter(i => item['cacheSelectItem'].map(j => j.id).indexOf(i.id) === -1), 
                    ...item['cacheSelectItem']]: data.data_list
                    if (!query) {
                        item['originOptionValue'] = data.data_list
                    }
                    this.mainData = [...this.mainData]
                    this.handleCacheSelectData(item)
                    this.$emit("handleDropDownData", item)
                    callback? callback(item): ''
                })
            },
            handleSelectFocus(item) {
                // 级联提示
                this.queryData = {...this.queryData}
                const cascaderItem = this.mainData.find(_item => {
                    let arr = []
                    let idArr = JSON.parse(_item['is_caderser'])
                    Object.prototype.toString.call(idArr) === '[object Array]'? arr = idArr: arr.push(Number(_item['is_caderser']))
                    return arr.indexOf(Number(item['id'])) !== -1
                })
                if (cascaderItem) {
                    if (!item['optionValue'].length && !this.queryData[cascaderItem.html_name]) {
                        this.$message.warning(`请先选择${cascaderItem.attribute_name}!`)
                        return
                    }
                }
                if (item['originOptionValue'] && !item['optionValue'].length) {
                    item['optionValue'] = item['originOptionValue']
                    this.mainData = [...this.mainData]
                }
            },
             /**
             * CaseeLee
             * 处理级联默认请求
             * @param item 数据项
             */
             handleGetCascaderOption (item) {
                let param = {...this.handleUrlParm(item['url_address'])}
                let url = this.handleQueryUrl(item['url_address'])
                http.getAjax(url, param).then(({data}) => {
                    if (data.status !== 1){
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    item['options'] = data.data_list
                    this.mainData = [...this.mainData]
                    this.handleCacheSelectData(item)
                })
            },
             /**
             * CaseeLee
             * 处理查询地址
             * @param url 查询地址
             */
            handleQueryUrl(url){
                if (!url) return;
                let unnecessary = 'api'
                if (url.indexOf(unnecessary) !== -1) {
                    url = url.substring(url.indexOf(unnecessary) + unnecessary.length)
                }
                unnecessary = '?'
                if (url.indexOf(unnecessary) !== -1) {
                   return url.substring(0, url.indexOf(unnecessary))
                }
                return url
            },
             /**
             * CaseeLee
             * 处理查询地址参数
             * @param url 查询地址
             */
             handleUrlParm(url){
                let params = {}
                let paramsChar = '?' 
                let paramsString = url.indexOf('?') !== -1? url.substring(url.indexOf(paramsChar) + 1): ''
                if (paramsString) {
                    paramsString.split('&').forEach(item => {
                        let param = item.split('=')
                        if (param && param.length) {
                            params[param[0]] = param[1]
                        }
                    })
                }
                return params
            },
            /**
             * CaseeLee
             * 缓存下拉数据
             * @param item 数据项
             */
             handleCacheSelectData(item){
                 const copyConfig = this.searchConfig.all_data[this.routePath].map(_item => {
                    if (_item.html_name === item.html_name) {
                        return {...item}
                    }
                    return _item
                })
                this.searchConfig.all_data[this.routePath] = copyConfig
                this.$store.commit('SAVE_COMMON_SEARCH_CONFIG',  this.searchConfig);
            },
            // 高级筛选
            handleButtonChose(){
                this.advancedFilter = !this.advancedFilter;
                this.dynamicAddSeleteIconClass()
                this.$emit("handleLoadOk")
            },
            // 动态添加下拉框
            dynamicAddSeleteIconClass(){
                this.$nextTick().then(() => {
                    const searchArea = document.getElementsByClassName('ui-search-area')[0]
                    const selectRemoteTags = searchArea.getElementsByClassName('el-icon-')
                    for (let i = 0; i < selectRemoteTags.length; i++) {
                        const item = selectRemoteTags[i]
                        let attribute = item.getAttribute('class')
                        attribute = attribute.concat(' el-icon-arrow-up')
                        item.setAttribute('class', attribute)
                    }
                });
            },
            handleClear() {
                this.dynamicAddSeleteIconClass()
            },
            // 设置默认的查询参数
            handleSettingDefaultQueryDataParams() {
                if (!this.isInitialize) return;
                this.isInitialize = false
                // 判断是否页面需要重新刷新页面
                if (this.$route.query._cacheType) {
                    this.handleRrefreshRouting()
                } else {
                    if (this.routePath === '/JurisdictionManagement') return;
                    if (this.routePath === '/OrderListManagement') return;
                    if (this.routePath === '/EbayOrderListManagement') return;
                    switch (this.routePath) {
                        // 消息中心
                        case '/MessageCenter':
                            this.queryData['is_replied'] = [0]
                            this.queryData['first'] = 1
                            this.handleSettingDefaultTime('mail_reception_time', 1);
                            break;
                        // 收件箱
                        case '/Inbox':
                            this.queryData['is_replied'] = [0]
                            // 邮件类型默认传参为“平台通知”
                            this.queryData['email_cate'] = 3
                            this.handleSettingDefaultTime('mail_reception_time', 1);
                            break;
                        // 发件箱
                        case '/Outbox': 
                            this.handleSettingDefaultTime('send_time', 1);
                            break;
                        // 回收箱
                        case '/RecycleBin':
                            this.handleSettingDefaultTime('delete_time', 1);
                            break;
                        // 草稿箱
                        case '/DraftBox':
                            this.handleSettingDefaultTime('add_time', 1);
                            break;
                        // 草稿箱
                        case '/DisputeCenter':
                            this.queryData['dispute_state'] = [1]
                            this.handleSettingDefaultTime('collect_time', 1);
                            break;
                        // review
                        case '/CustomerEvaluationReview':
                            this.handleSettingDefaultTime('review_time', 1);
                            break;
                        // feedback
                        case '/CustomerReviewsFeedBack':
                            this.handleSettingDefaultTime('feedback_time', 1);
                            break;
                        // 自动信息记录
                        case '/AutomationMessage':
                            this.handleSettingDefaultTime('send_time');
                            break;
                        // 售后单管理
                        case '/AfterSalesOrderManagement':
                            this.handleSettingDefaultTime('create_time');
                            break;
                        // 登记收款管理
                        case '/RegisteredPaymentList':
                            this.handleSettingDefaultTime('transaction_hour');
                            break;
                        // ebay消息
                        case '/EbayMessage':
                            this.queryData['is_replied'] = [0]
                            this.queryData['message_type'] = 2
                            this.handleSettingDefaultTime('mail_reception_time', 6);
                            break;
                        // Cancel
                        case '/EbayCancel':
                            this.queryData['processing_status'] = [0];
                            this.queryData['initiator'] = [1];
                            this.handleSettingDefaultTime('create_time', 59);
                            break;
                        // INR
                        case '/EbayINR':
                            this.queryData['processing_status'] =  [0]
                            this.handleSettingDefaultTime('create_time', 59);
                            break;
                        // Retrun
                        case '/EbayReturn':
                            this.queryData['processing_status'] =  [0]
                            this.handleSettingDefaultTime('create_time', 59);
                            break;
                        // 评价feedback
                        case '/EbayEvaluateFeedBack':
                            this.queryData['processing_status'] =  [0]
                            this.queryData['evaluation_level'] = ['2']
                            this.handleSettingDefaultTime('comment_time', 59);
                            break;
                        // ebay发送信息记录
                        case '/EbaySendMessageRecord':
                            this.handleSettingDefaultTime('send_time', 1);
                            break;
                        // ebay售后单列表
                        case '/EbayAfterSalesOrderManagement':
                            this.handleSettingDefaultTime('create_time', 1);
                            break;
                        // ebay登记收款列表
                        case '/EbayRegisteredPaymentList':
                            this.handleSettingDefaultTime('operate_time', 1);
                            break;
                        // ebay收款请求列表
                        case '/EbayReceiptRequestList':
                            this.handleSettingDefaultTime('create_time', 1);
                            break;
                        // ebay客诉列表
                        case '/EbayCustomerComplaintList':
                            this.handleSettingDefaultTime('create_time', 1);
                            break;
                        //===========================V2.1.0=============================    
                        //Ebay-收件箱
                        case '/EbayInbox':
                            this.queryData['email_cate'] = 1;
                            this.handleSettingDefaultTime('mail_reception_time', 7);
                            break;
                        //Ebay-草稿箱 
                        case '/EbayDraftBox':
                            this.handleSettingDefaultTime('add_time', 7);
                            break;
                        //Ebay-发件箱
                        case '/EbayOutbox':
                            this.handleSettingDefaultTime('send_time', 7);
                            break;
                        //AM-国内退件
                        case '/AmazonDomesticRefund':
                            this.queryData['handle_state'][0] = 1;
                            break;
                        //AM-海外退件 
                        case '/AmazonOverseasRefund':
                            this.queryData['handle'] = 1;
                            break;
                        //Ebay-国内退件
                        case '/EbayDomesticRefund':
                            this.queryData['handle_state'][0] = 1;
                            break;
                        //Ebay-海外退件 
                        case '/EbayOverseasRefund':
                            this.queryData['handle'] = 1;
                            break;
                        //Ebay-取消订单结果 
                        case '/CancelOrderResult':
                            this.handleSettingDefaultTime('operate_time', 7);
                            break;
                        //AM-自动回复记录 
                        case '/AmazonAutomaticReplyRcord':
                            this.handleSettingDefaultTime('trigger_time', 2);
                            break;
                        //Ebay-自动发信记录 
                        case '/AutomaticSendingRecord':
                            this.handleSettingDefaultTime('trigger_time', 7);
                            break;
                        //Ebay-自动回复记录 
                        case '/EbayAutomaticReplyRcord':
                            this.handleSettingDefaultTime('trigger_time', 2);
                            break;
                        //Ebay-自动留评记录 
                        case '/AutomaticAssessmentRecord':
                            this.handleSettingDefaultTime('review_time', 2);
                            break;
                    }
                    this.handleQuery(false)
                }
            },
            handleSettingDefaultTime(filedName, subtractDay) {
                const start = moment().subtract(subtractDay? subtractDay: 0, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                const end = moment().hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                this.queryData[filedName] = [start, end]
            },
            handleSelectChange(item, val) {
                this.mainData = [...this.mainData]
                item['cacheSelectItem'] = item.optionValue.filter(item => val.indexOf(item.id) !== -1)
            },
            handleCascaderSelectChange(item, val) {
                const key = item["caderser_string"]? item["caderser_string"]: item['html_name']
                const params = {}   
                params[key] = val
                let arr = []
                let idArr = JSON.parse(item['is_caderser'])
                Object.prototype.toString.call(idArr) === '[object Array]'? arr = idArr: arr.push(Number(item['is_caderser']))
                arr.forEach(i=> {
                    const cascaderItem = this.mainData.find(_item => i == _item['id'])
                    if (!cascaderItem) return
                    // 清空级联数据
                    cascaderItem["select"] === "2"? this.queryData[cascaderItem['html_name']] = []: this.queryData[cascaderItem['html_name']] = ''
                    cascaderItem['optionValue'] = []
                    cascaderItem['originOptionValue'] = []
                    if (cascaderItem['cacheSelectItem']) {
                        cascaderItem['cacheSelectItem'] = []
                    }
                    // 清空不需要再次请求
                    if(!val) return;
                    this.handleGetOption(cascaderItem, params, cascaderItem["select"] === "2", this.handleCallback)
                })
            },
            // 请求回调
            handleCallback(item) {
                // 保存初始数据
                item['originOptionValue'] = item['optionValue']
            },
            // 设置固定的查询参数
            handleResetQueryCondition() {
                // 收件箱邮件类型默认传参为“平台通知”
                if (this.routePath === '/Inbox') {
                    this.queryData['email_cate'] = 3
                } else if (this.routePath === '/EbayMessage') {
                    this.queryData['message_type'] = 2
                }
                
                // 清空联动数据
                const cascaderItemArr = this.mainData.filter(_item => {return _item['is_caderser'] !== '0'})
                cascaderItemArr.forEach(item=> {
                    let arr = []
                    let idArr = JSON.parse(item['is_caderser'])
                    Object.prototype.toString.call(idArr) === '[object Array]'? arr = idArr: arr.push(Number(item['is_caderser']))
                    arr.forEach(i=> {
                        const cascaderItem = this.mainData.find(_item => Number(_item['id']) === i)
                        if (cascaderItem) {
                            cascaderItem['optionValue'] = []
                            cascaderItem['originOptionValue'] = []
                            if (cascaderItem['cacheSelectItem']) {
                                cascaderItem['cacheSelectItem'] = []
                            }
                        }
                    })
                })
                this.queryData = {...this.queryData}
            },
            // 带参数路由跳转页面刷新,只保留当前跳转条件的查询参数
            async handleRrefreshRouting() {
                const param = this.$route.query
                const itemArr = this.mainData.filter(item => item["is_url"] === "1" && param[item.html_name])
                for (let i = 0; i < itemArr.length; i++) {
                    const item = itemArr[i];
                    if (Array.isArray(param[item.html_name])) {
                        await this.handleGetOption(item, {id: param[item.html_name][0]})
                    } else {
                        await this.handleGetOption(item, {id: param[item.html_name]})
                    }
                }
                // 设置查询值
                const queryParams = Object.keys(this.$route.query)
                const queryData = {}
                queryParams.forEach(item =>{
                    if (typeof(param[item]) !== 'undefined' && this.queryData[item] !== 'undefined') {
                        (Object.prototype.toString.call(this.queryData[item]) === '[object String]' 
                        && Object.prototype.toString.call(param[item]) === '[object Array]')? 
                        queryData[item] = param[item][0]:
                        (Object.prototype.toString.call(this.queryData[item]) === '[object Array]'
                        && Object.prototype.toString.call(param[item]) === '[object String]')? 
                        queryData[item] = queryData[item] = [param[item]]:
                        queryData[item] = param[item]
                    }
                })
                this.queryData = queryData
                this.handleQuery(false)
            },
            handleEmitQueryData() {
                // 处理级联组件的传值数据格式
                const cascaderArr = this.mainData.filter(item => { return item.css_type === 'cascader'})
                const queryData = {...this.queryData}
                cascaderArr.forEach(item => {
                    // 有自定义传值字段html_name
                    if (queryData[item.html_name] && (item.options[0] && item.options[0].html_name)) {
                        const orginQueryDataValue = queryData[item.html_name]
                        const htmlNameArr = []
                        let getHtmlNameFn = arr=> {
                            // if (htmlNameArr.length === orginQueryDataValue.length) return
                             arr.forEach(item => {
                                 if (htmlNameArr.indexOf(item['html_name']) === -1) {
                                    htmlNameArr.push(item['html_name'])
                                    if (item.children) {
                                        getHtmlNameFn(item.children)
                                    }
                                 }
                             })
                        }
                        getHtmlNameFn(item.options, htmlNameArr)
                        htmlNameArr.forEach((i, index) => {
                            orginQueryDataValue[index]? queryData[i] = orginQueryDataValue[index]: delete queryData[i]
                        })
                        // 删除原来的html_name
                        // delete queryData[item.html_name]
                    }
                })
                return queryData
            },
        },
        activated () {
            Store.commit('SAVE_CHECK_SEARCH_INFO', this.mainData.map(item => item.html_name));
        },
        computed: {
            ...mapGetters(['searchConfig']),
            checkMainData: {
                get() {
                    return this.$store.state.checkedMainData;
                },
            },
            routePath() {
                return '/' + this.componentName
            },
        },
        created() {
            // 不取缓存（下拉数据是不定时刷新）
            this.handleQuerySearchList();
            this.isInitialize = true
        },
        watch: {
            checkMainData(n, o) {
                if (this.routePath === this.$route.path) {
                    this.mainData = n.map( item=> {return {...item}})
                    this.handleTransformData(this.mainData)
                    this.handleSettingQueryData(this.mainData)
                    this.handleSettingDefaultQueryDataParams()
                }
            },
            // 存在已有的页签，如果_cacheType === '1'需要刷新页面
            "$route.fullPath"(n) {
                if (n) {
                    if ((this.$route.path === this.routePath) && this.$route.query._cacheType === '1') {
                        this.handleRrefreshRouting()
                    } 
                }
            },
        }
    }
</script>