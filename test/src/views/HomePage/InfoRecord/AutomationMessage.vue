<template>
    <div class="ui-main-module">
         <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo' @handleLoadOk='searchHeight = !searchHeight'/>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch">
                <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
            </span>
            <el-button size="small" type="text" @click="handleExportData">
                <i class="icon-daochu" style="color: #bb8fec;font-size:12px;"></i>导出
            </el-button>
        </div>
        <!-- 列表 -->
        <ComTableInfo
            isCheck
            :tableWidth="tableWidth"
            :tableKey="tableKey"
            :tableProps="tableProps"
            :searchHeight="searchHeight"
            :tableData="tableData"
            :tableLoading="tableLoading">
            <!-- 触发条件 -->
            <!-- <template slot="execute_id" slot-scope="scope">
                <div v-if="scope.row.execute_id=='3'">订单收到买家付款</div>
                <div v-if="scope.row.execute_id=='8'">订单执行发货</div>
            </template> -->
            <!-- 发送状态 -->
            <!-- <template slot="send_status" slot-scope="scope">
                <div v-if="scope.row.send_status=='0'">等待发送</div>
                <div v-if="scope.row.send_status=='1'">发送中</div>
                <div v-if="scope.row.send_status=='2'">发送成功</div>
                <div v-if="scope.row.send_status=='-1'">失败</div>
            </template> -->
        </ComTableInfo>
        <!-- 底部分页 -->
        <div class="ui-main-module-page">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageData.currentPage"
                :page-sizes="pageSizes"
                :page-size="pageData.currentList"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageData.currentTotal">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import config from '@/assets/js/config';
    import {
        getPlatformCodeData,
    } from '../../../api/SystemManagement/GetAutomationMessage'
    import{
        mapGetters,
        mapActions
    } from 'vuex';
    import {getSessionStorage} from '@/utils/storage';

    export default {
        name: 'AutomationMessage',
        data () {
            return {
                searchHeight: false,
                //搜索框数据
                queryData: {
                    mainQuery: {}
                },
                //列表数据
                tableData:[],
                tableKey: ['序号', '所属平台', '规则名称', '平台账号', '收件邮箱', '订单号', '触发条件', '关联模板', '发送状态', '触发时间', '计划发送时间', '实际发送时间', '发送失败原因'],
                tableProps: ['index', 'platform_code', 'rule_name', 'account_name', 'receive_email', 'order_id', 'execute_id', 'template_name', 'send_status', 'create_time', 'plan_send_time', 'send_time','send_failure_reason'],
                tableWidth: ['50', '100', '200', '100', '160', '120', '100', '160', '80', '140', '140', '140', ''],
                // 表格加载动画
                tableLoading: false,
                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },
                //搜索框显示隐藏
                showSearch: true,
                //平台选项框下拉数据
                platformCodeList:{},
            }
        },
        computed: {
            ...mapGetters([
                'queryParamsInfo',
                'automationMessageInfo'
            ]),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
        methods:{
            ...mapActions([
                'GetAutomationMessageListInfo',
            ]),
            //定义接口方法
            getPlatformCodeData,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                if (isSave) {
                    this.queryData = JSON.parse(this.queryParamsInfo['automation_message']);
                }
                let obj = {

                };

                // 分离头部搜索和快捷搜索两种条件
                if( !isComSearch ){
                    obj = {...this.queryData.mainQuery, ...obj};
                }else{
                    obj = {...this.queryData.mainQuery, ...obj};
                }

                // 组合分页数据
                obj = {
                    ...obj,
                    offset: isSave ? this.pageData.currentPage : 1,     // 不取缓存就要重置页数
                    limit: this.pageData.currentList
                };

                this.tableLoading = true;
                this.GetAutomationMessageListInfo(obj).then(({data}) => {
                    this.tableLoading = false;
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.handleQueryInfoCallBack(data);
                }).catch(err => {
                    this.tableLoading = false;
                    console.log(err);
                });
            },

            //查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'automation_message',
                    value: JSON.stringify(this.queryData)
                });
                //列表数据渲染
                this.createByList = data.data_list.drop_down_box.create_by_list;
                this.tableData = data.data_list.values;
                //渲染分页
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentPage = data.page_data.page * 1;
                this.pageData.currentTotal = data.page_data.total * 1;

                // 重置表格高度
                this.searchHeight = !this.searchHeight;
            },

            // 重置
            handleResetQueryInfo(){
                this.queryData = {
                    mainQuery: {}
                }
            },

            //n条/页切换
            handleSizeChange(val) {
                this.pageData.currentPage = 1;
                this.pageData.currentList = val;
                this.handleQueryInfo({}, true);
            },

            //页数切换
            handleCurrentChange(val) {
                this.pageData.currentPage = val;
                this.handleQueryInfo({}, true);
            },

            //导出
            handleExportData(params = {}, url = 'api/system_set/email_send_record/get_list'){
                if(this.pageData.currentTotal>10000){
                    this.$message.warning('最多只能导出一万条，请筛选条件后再进行操作！');
                    return;
                }
                let obj = {};
                let urlTime = '';
                for (const key in this.queryData.mainQuery) {
                    if (this.queryData.mainQuery[key]&&this.queryData.mainQuery[key].length!==0) {
                        if(key!='send_time'&&key!='trigger_time'&&key!='plan_send_time'){
                            obj[key] = this.queryData.mainQuery[key];
                        }
                    }
                }
                params = JSON.parse(getSessionStorage('userInfo'));
                const query = Object.entries(obj).reduce((str, [key, value], idx) => {
                    const next = idx === 0 ? `&${key}=${value}` : `&${key}=${value}`;
                    return str + next;
                }, '')
                if(this.queryData.mainQuery['send_time']){
                    urlTime += '&send_time[]='+this.queryData.mainQuery['send_time'][0]+'&send_time[]='+this.queryData.mainQuery['send_time'][1];
                }else if(this.queryData.mainQuery['trigger_time']){
                    urlTime += '&trigger_time[]='+this.queryData.mainQuery['trigger_time'][0]+'&trigger_time[]='+this.queryData.mainQuery['trigger_time'][1];
                }else if(this.queryData.mainQuery['plan_send_time']){
                    urlTime += '&plan_send_time[]='+this.queryData.mainQuery['plan_send_time'][0]+'&plan_send_time[]='+this.queryData.mainQuery['plan_send_time'][1];
                }
                window.location = url+'?uid='+params.uid+'&staff_code='+params.staff_code+'&export=1'+query+urlTime;
            }
        },

        created() {
            try {
                if (this.$route.query._cacheType === '1' || JSON.stringify(this.automationMessageInfo) === '{}') {
                    // this.handleQueryInfo();
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['automation_message']);
                    this.handleQueryInfoCallBack(this.automationMessageInfo);
                }
            } catch (e) {
                console.log(e)
            };
            this.getPlatformCodeData().then(({data})=>{
                this.platformCodeList = data.data_list.values;
            })
        },
    }
</script>
