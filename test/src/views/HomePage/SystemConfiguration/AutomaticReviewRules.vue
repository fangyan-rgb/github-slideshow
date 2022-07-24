<template>
    <div class="TemplatePagewrap">
        <div class="TemplatePagebox">

            <div class="ui-main-module">
                <!-- 查询参数 -->
                <transition name="slide-fade">
                    <div class="ui-search-area" v-show="showSearch">
                        <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo($event, false, true)' @handleResetQueryInfo='handleResetQueryInfo' @handleLoadOk='searchHeight = !searchHeight'>
                        </ComSearchCondition>
                    </div>
                </transition>

                <!-- 操作按钮 -->
                <div class="ui-fn-module">
                    <span class="ui-top_i" @click="showSearch = !showSearch">
                        <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
                    </span>
                    <el-button size="small" type="text" @click="handleAddOrEdit()" v-if="buttonList['newAdd'].permit(thisVm)">
                        <i class="icon-xinzeng1" style="color: #75b1fc"></i>新增</el-button>
                    <el-button size="small" type="text" @click="handleDeleteOpen()" v-if="buttonList['batchDelete'].permit(thisVm)">
                        <i class="icon-shanchu1" style="color: rgb(255, 101, 98)"></i>批量删除</el-button>
                    <el-button size="small" type="text" @click="handleDiscontinue('启用')" v-if="buttonList['batchStart'].permit(thisVm)">
                        <i class="icon-piliangqiyong" style="color: rgb(255, 152, 96)"></i>批量启用</el-button>
                    <el-button size="small" type="text" @click="handleDiscontinue('停用')" v-if="buttonList['batchStop'].permit(thisVm)">
                        <i class="icon-piliangtingyong" style="color: rgb(255, 101, 98)"></i>批量停用</el-button>
            </el-button>
                </div>

                <!-- 主体表格 -->
                <ComTableInfo
                    isCheck
                    :tableKey="tableKey"
                    :tableProps="tableProps"
                    :tableWidth="tableWidth"
                    :tableData="tableData"
                    :showSearch="showSearch"
                    :searchHeight="searchHeight"
                    @checked="handleSaveCheckInfo"
                    :tableLoading="tableLoading">
                    <template slot-scope="scope" slot="status_text">
                        <span class="ui-state_circle redColor" v-if="scope.row.status === '2'"></span>
                        <span class="ui-state_circle greenColor" v-if="scope.row.status === '1'"></span>
                        {{scope.row.status_text}}
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['edit'].permit(thisVm)" @click="handleAddOrEdit(scope.row)" type="text" size="mini">编辑</el-button>
                        <ComDivide v-if="buttonList['edit'].permit(thisVm)"/>
                        <el-button v-if="scope.row.status === '1'?buttonList['stop'].permit(thisVm):buttonList['start'].permit(thisVm)" @click="handleDiscontinue(scope.row)" type="text" size="mini">{{scope.row.status === '2'?'启用':'停用'}}</el-button>
                        <ComDivide v-if="scope.row.status === '1'?buttonList['stop'].permit(thisVm):buttonList['start'].permit(thisVm)"/>
                        <el-button v-if="buttonList['delete'].permit(thisVm)" @click="handleDeleteOpen(scope.row)" type="text" size="mini">删除</el-button>
                        <ComDivide v-if="buttonList['delete'].permit(thisVm)"/>
                        <el-button v-if="buttonList['diaryLog'].permit(thisVm)" @click="handleLog(scope.row)" type="text" size="mini">日志</el-button>
                    </template>
                </ComTableInfo>

                <!-- 分页 -->
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
            <!-- 日志弹框 -->
            <el-dialog width="950px" class="ui-layout_edit-dialog logs" title="日志" :visible.sync="isShowLog">
                <ComPreviewTable
                    :isAdaptiveHeight="false"
                    :logKey="['操作日志', '操作人', '操作时间']"
                    :logProps="['action', 'operator', 'create_time']"
                    :logData="showLogTableData"
                    :logWidth="['', '180', '180']">
                    <template slot-scope="scope" slot="action">
                        <div v-html="scope.row.action"></div>
                    </template>
                </ComPreviewTable>
            </el-dialog>
            <!-- 新增/编辑 -->
            <el-dialog :title="addOrEditTitle" width="580px" class="ui-layout_edit-dialog addOrEdit" :visible.sync="isAddOrEditShow" @close="handleAddOrEditCancel">
                <el-form label-width="80px" :model="addOrEdit" ref="addOrEdit" :rules="Rules">
                    <el-form-item label="所属平台：" prop="platform_code">
                        <el-select placeholder="请选择" size="mini" v-model="addOrEdit.platform_code" filterable v-filter @change="handlePlatformCodeChange(addOrEdit.platform_code,true)">
                            <el-option v-for="(value, key, index) in platformCodeList"
                                    :label="key"
                                    :value="key"
                                    :key="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规则名称:" prop="rule_name">
                            <el-input size="small" style="width:300px;" v-model="addOrEdit.rule_name"></el-input>
                    </el-form-item>
                    <el-form-item label="优先级：" prop='priority'>
                        <el-input-number v-model="addOrEdit.priority" class="priority" size="small" controls-position="right" placeholder="输入大于0的整数" :precision="0" :min="1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status">
                            <el-radio v-model="addOrEdit.status" label="1">启用</el-radio>
                            <el-radio v-model="addOrEdit.status" label="2">停用</el-radio>
                    </el-form-item>
                    <el-form-item label="选择账号:">
                        <el-button type="text" @click="choiceConditionOption()" size="mini">选择账号</el-button>
                        <span style="font-size:12px;color:#333333;" v-if="addOrEdit.account_ids">已选{{addOrEdit.account_ids.split(',').length}}个账号</span>
                    </el-form-item>
                    <el-form-item label="留评内容：" prop="feedback_type">
                        <el-radio v-model="addOrEdit.feedback_type" label="1">随机发送留评模板</el-radio>
                        <el-radio v-model="addOrEdit.feedback_type" label="2">指定留评模板</el-radio>
                    </el-form-item>
                        <div v-if="addOrEdit.feedback_type==='2'">
                            <el-form-item label="" prop="feedback_id">
                                <el-select placeholder="请选择" size="mini" v-model="addOrEdit.feedback_id" filterable v-filter @change="handleTemplateContent()">
                                    <el-option v-for="(value, index) in templateList"
                                            :label="value.template_name" 
                                            :value="value.id"
                                            :key="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="" prop="templateContent">
                                <el-input rows="3" style="width:100%;" type="textarea" v-model="addOrEdit.templateContent" disabled></el-input>
                            </el-form-item>
                        </div>
                </el-form>
                <div slot="footer">
                    <el-button size="small" @click="handleAddOrEditCancel">取消</el-button>
                    <el-button size="small" type="primary" @click="handleFormSubmission">确定</el-button>
                </div>
            </el-dialog>
            <!-- 点击选择账号弹窗 -->
            <el-dialog
                :title="'选择账号'"
                :width="'1000px'"
                top="15vh"
                class="ui-layout_edit-dialog"
                append-to-body
                :visible.sync="choiceCondition">
                <div style="padding: 20px 0;">
                    <ComShuttle
                        v-if="choiceCondition"
                        :data="Object.keys(conditionList).map(e => {return {key: e, label: conditionList[e]}})"
                        :label="titleArr"
                        :selectValue="conditionValue"
                        @handleChange="handleChangeSiteData">
                    </ComShuttle>
                </div>
                <div slot="footer">
                    <el-button size="small" @click="choiceCondition = false">取消</el-button>
                    <el-button size="small" type="primary" @click="conditionConfirm()">确定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
import config from '@/assets/js/config';
import {
    getFeedbackAccountRuleList,
    FeedbackAccountRuleDelete,
    FeedbackAccountRuleAdd,
    FeedbackAccountRuleUpdate,
    FeedbackAccountRuleLog,
    FeedbackAccountRuleStatus,
    getTemplateList,
    } from '../../../api/SystemManagement/AutomaticReviewRules';
import {platformCodeInfo,getAccountOptionList} from '../../../api/SystemManagement/GetAutomationSendRule';

export default {
    name: 'AutomaticReviewRules',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['所属平台', '规则名称', '优先级', '启用状态', '创建人', '创建时间', '修改人', '修改时间', '操作'],
            tableProps: ['platform_code', 'rule_name', 'priority', 'status_text', 'create_by', 'create_time', 'update_by', 'update_time', 'operate'],
            tableWidth: ['100', '', '80', '80', '', '150', '', '150', '210'],
            tableData: [],
            // 表格加载动画
            tableLoading: false,

            // 分页数据
            pageSizes: config.pageData.pageSizes,
            pageData: {
                currentPage: 1,
                currentList: 10,
                currentTotal: 0
            },

            // 保存选中项信息
            saveCheckInfo: [],
            // 选中的ids
            saveCheckIds: '',

            // 查询数据
            queryData: {
                mainQuery: {},
            },

            //日志
            isShowLog:false,
            showLogTableData:[],

            //自动留评规则新增或编辑
            addOrEditTitle:'',
            isAddOrEditShow:false,
            addOrEdit:{
                id:'', 
                status:'',
                rule_name:'',
                platform_code:'',
                account_ids:'',
                feedback_id:'',
                feedback_type:'',
                templateContent:'',//模板内容
                priority:1,
            },
            
            platformCodeList:{},
            Rules: {
                platform_code: [{ required: true, message: '带*号为必填项', trigger: 'blur' } ],
                status: [{ required: true, message: '带*号为必填项', trigger: 'blur' } ],
                account_ids: [{ required: true, message: '带*号为必填项', trigger: 'blur' } ],
                feedback_id: [{ required: true, message: '此项为必填项', trigger: 'blur' } ],
                feedback_type: [{ required: true, message: '带*号为必填项', trigger: 'blur' } ],
                rule_name: [{ required: true, message: '带*号为必填项', trigger: 'blur' } ],
                priority: [{ required: true, message: '带*号为必填项', trigger: 'blur' } ],
            },
            templateList:[],
            //穿梭框
            choiceCondition:false,      //选择条件
            conditionList: {},
            conditionValue: [],
        }
    },
    computed: {
        ...mapGetters([
            'queryParamsInfo',
        ]),
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList']
        },
    },
    mounted() {
        // this.handleQueryInfo();
    },
    methods: {
        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo(params, isSave, isComSearch) {
            this.queryData.mainQuery = {...(params || {})};     // 用来缓存
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo['dispute_refund_result']);
            }
            let obj = {};
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
            getFeedbackAccountRuleList(obj).then(({data}) => {
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

        // 查询回调
        handleQueryInfoCallBack(data){
            // 保存查询参数
            this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                key: 'dispute_refund_result',
                value: JSON.stringify(this.queryData)
            });
            this.tableData = data.data_list.value;

            // 渲染分页
            this.pageData.currentPage = data.page_data.offset * 1;
            this.pageData.currentList = data.page_data.limit * 1;
            this.pageData.currentTotal = data.page_data.total * 1;

            // 重置表格高度
            this.searchHeight = !this.searchHeight;
        },

        // 重置
        handleResetQueryInfo(){
            this.queryData = {
                mainQuery: {},
            }
        },

        // 分页条数切换
        handleSizeChange(val) {
            this.pageData.currentPage = 1;
            this.pageData.currentList = val;
            this.handleQueryInfo({}, true);
        },
        // 跳转页数切换
        handleCurrentChange(val) {
            this.pageData.currentPage = val;
            this.handleQueryInfo({}, true);
        },

        // 保存勾选信息
        handleSaveCheckInfo(val) {
            this.saveCheckInfo = val;
            this.saveCheckIds = [...new Set(this.saveCheckInfo.map(e => e.id))].join(',');
        },

        //状态启用/停用
        handleDiscontinue(row){
            let obj = {
                id:[],
                status:''
            }
            if(row.id){
                obj.id[0] = row.id;
                if(row.status === '2'){
                    obj.status = '1';
                }else{
                    obj.status = '2';
                }
            }else{
                if (!this.saveCheckInfo.length) {
                    this.$message.warning('请勾选列表数据')
                    return;
                }
                obj.id = this.saveCheckInfo.map(item=>item.id);
                if(row==='启用'){
                    obj.status = '1';
                }else{
                    obj.status = '2';
                }
            }
            FeedbackAccountRuleStatus(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败');
                    return;
                }else{
                    this.$message.success('操作成功');
                    this.handleQueryInfo({}, true);
                }
            }).catch(err => {
                this.tableLoading = false;
                console.log(err);
            });
        },

        //日志
        handleLog(row){
            FeedbackAccountRuleLog({id:row.id}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败');
                    return;
                }else{
                    this.isShowLog = true;
                    this.showLogTableData = data.data_list.value;
                }
            }).catch(err => {
                console.log(err);
            });
        },

        //删除
        handleDeleteOpen(row){
            if (!row&&!this.saveCheckInfo.length) {
                this.$message.warning('请勾选列表数据')
                return;
            }
            this.$confirm(row?'确定删除该条规则吗?':'确定删除选中的'+this.saveCheckInfo.length+'条规则吗？', row?'删除':'批量删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.handleDelete(row);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        handleDelete(row){
            let obj = {id:[]};
            if(row){
                obj.id[0] = row.id;
            }else{
                obj.id = this.saveCheckInfo.map(item=>item.id);
            }
            FeedbackAccountRuleDelete(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败');
                    return;
                }else{
                    this.$message.success('操作成功');
                    this.handleQueryInfo({}, true);
                }
            }).catch(err => {
                console.log(err);
            });
        },

        //新增或编辑唤醒弹窗
        handleAddOrEdit(row){
            if(row){
                this.addOrEdit={
                    id: row.id,
                    status: row.status,
                    rule_name: row.rule_name,
                    platform_code: row.platform_code,
                    account_ids: row.account_ids==='all'?'':row.account_ids,
                    feedback_id: row.feedback_id,
                    feedback_type: row.feedback_type,
                    priority: row.priority
                };
                this.handlePlatformCodeChange(row.platform_code);
                this.handleTemplateContent();
                this.addOrEditTitle = '编辑留评规则';
            }else{
                this.addOrEditTitle = '新增留评规则';
            }
            this.isAddOrEditShow = true;
        },
        //新增编辑提交
        handleFormSubmission(){
            this.$refs['addOrEdit'].validate((valid) => {
                if (valid) {
                    let obj = {
                        form: {
                            status: this.addOrEdit.status,
                            rule_name: this.addOrEdit.rule_name,
                            platform_code: this.addOrEdit.platform_code,
                            account_ids: this.addOrEdit.account_ids,
                            feedback_id: this.addOrEdit.feedback_id,
                            feedback_type: this.addOrEdit.feedback_type,
                            priority: this.addOrEdit.priority,
                        }
                    };
                    if(this.addOrEdit.id){
                        obj.form.id = this.addOrEdit.id;
                        FeedbackAccountRuleUpdate(obj).then(({data}) => {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败');
                                return;
                            }else{
                                this.handleAddOrEditCancel();
                                this.handleQueryInfo({}, true);
                                this.$message.success('操作成功');
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    }else{
                        FeedbackAccountRuleAdd(obj).then(({data}) => {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败');
                                return;
                            }else{
                                this.handleAddOrEditCancel();
                                this.handleQueryInfo({}, true);
                                this.$message.success('操作成功');
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //穿梭框
        choiceConditionOption(){
            this.conditionValue = [];
            this.conditionList = {};
            let arr = [];
            if( !this.addOrEdit.platform_code ){
                this.$message.warning('请先选择平台！');
                return;
            }
            this.titleArr=['全部账号', '所选账号'];
            if(this.addOrEdit.id&&this.addOrEdit.account_ids.length) this.conditionValue = [...this.addOrEdit.account_ids.split(',')];
            let account ={
                platform_code: this.addOrEdit.platform_code
            };
            getAccountOptionList(account).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败');
                    return;
                }
                if( data.data_list.data.account.values.length > 0 ){
                    let arr = {};
                    data.data_list.data.account.values.forEach(e => {
                        arr[e.id] = e.account_name;
                    });
                    this.conditionList = arr;
                    this.choiceCondition = true;

                }else{
                    this.$message.warning('暂无数据！');
                }
            });
        },
        // 穿梭框选中方法
        handleChangeSiteData(values) {
            this.conditionValue = values;
        },
        conditionConfirm() {
            if(this.conditionValue.length===1){
                this.addOrEdit.account_ids = this.conditionValue[0];
            }else{
                this.addOrEdit.account_ids = this.conditionValue.join(',');
            }
            this.choiceCondition = false;
        },
        //新增编辑取消方法
        handleAddOrEditCancel(){
            this.addOrEditTitle = '';
            this.isAddOrEditShow = false;
            this.addOrEdit = {
                id:'', 
                status:'',
                rule_name:'',
                platform_code:'',
                account_ids:'',
                feedback_id:'',
                feedback_type:'',
                templateContent:'',
                priority:1
            };
            this.templateList = [];
            this.$refs['addOrEdit'].resetFields();
        },
        //模板内容
        handleTemplateContent(){
            if(this.templateList.filter(item=>{return item.id===this.addOrEdit.feedback_id}).length)
            this.addOrEdit.templateContent = this.templateList.filter(item=>{return item.id===this.addOrEdit.feedback_id})[0].template_content;
        },

        handlePlatformCodeChange(platform_code,bool){
            if(bool){
                this.addOrEdit.account_ids = '';
                this.addOrEdit.status = '';
                this.addOrEdit.feedback_id = '';
                this.addOrEdit.templateContent = '';
                this.conditionValue = [];
            }
            getTemplateList({platform_code: platform_code}).then(({ data }) => {
                this.templateList = data.data_list.value;
                this.handleTemplateContent();
            })
        }
    },
    created(){
        platformCodeInfo().then(({ data }) => {
            this.platformCodeList = data.data_list.values;
        })
    }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog__body{
        padding: 10px 20px;
        .ui-shuttle_container > span:nth-of-type(1){
            left: 200px;
        }
        .ui-shuttle_container > span:nth-of-type(2){
            left: 740px;
        }
    }
    /deep/.el-checkbox.el-transfer-panel__item{
        // width: 100%;
        // display: block;
        position: static;
        display: flex;
        .el-checkbox__input{
            position: static;
            line-height: 35px;
        }
        .el-checkbox__label{
            padding: 0 0 0 10px;
        }
    }
    /deep/.ui-shuttle_container .el-transfer-panel .el-transfer-panel__item{
        display: flex;
    }
    /deep/.el-transfer.ui-shuttle_transfer{
        margin-left:20px;
        .el-transfer-panel__body{
            height: 440px;
            .el-checkbox-group.el-transfer-panel__list.is-filterable{
                height: 400px;
                position: relative;
            }
        }
    }
    /deep/.ui-shuttle_container .el-transfer-panel{
        width: 390px;
        .el-input__inner{
            width: 370px;
        }
    }
    .addOrEdit{
        /deep/.el-dialog__body{
            padding: 20px 40px;
            .el-input.el-input--mini.el-input--suffix{
                width: 300px;
            }
        }
        /deep/.priority{
            .el-input{
                width: 300px;
            }
            width: 300px;
        }
    }
</style>
