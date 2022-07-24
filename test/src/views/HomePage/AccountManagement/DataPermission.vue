<template>
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
            :tableLoading="tableLoading">
            <template slot-scope="scope" slot="operate">
                <el-button type="text" v-if="buttonList['edit'].permit(thisVm)" @click="handleDataPermissionEdit(scope.row)">修改</el-button>
                <ComDivide/>
                <el-button type="text" v-if="buttonList['journal'].permit(thisVm)" @click="handleDataPermissionLogsInfo(scope.row)">日志</el-button>
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
        <!-- 修改员工权限 -->
        <el-dialog title="修改权限" width="501px" :visible.sync="editPermission.isEdit" @close="editPermission.isEdit=false">
            <ComPreviewTable
                :isAdaptiveHeight="true"
                :logKey="['平台', '账号', '产品线']"
                :logProps="['platform_code', 'account', 'pro_line']"
                :logData="editPermission.dataPermissionDetail"
                :logWidth="['100', '180', '180']">
                <template slot-scope="scope" slot="account">
                    <div style="cursor: pointer;color: #409EFF;text-align:center;" @click="handleEditPermission(scope.row, scope.$index,'选择账号')">已选账号({{scope.row.account_id.length}})</div>
                </template>
                <template slot-scope="scope" slot="pro_line">
                    <div style="cursor: pointer;color: #409EFF;text-align:center;" v-if="scope.row.platform_code!='AMAZON'" @click="handleEditPermission(scope.row, scope.$index,'选择产品线')">已选产品线({{scope.row.pro_line_id.length}})</div>
                </template>
            </ComPreviewTable>
        </el-dialog>
        <!-- 点击选择条件弹窗 -->
        <el-dialog
            :title="optionChoicePermission"
            :width="'1000px'"
            top="15vh"
            class="ui-layout_edit-dialog"
            append-to-body
            :visible.sync="choicePermission">
            <div style="padding: 20px 0;">
                <ComShuttle
                    v-if="choicePermission"
                    :data="Object.keys(conditionList).map(element => {return {key: element, label: conditionList[element]}})"
                    :label="titleArr"
                    :selectValue="conditionValue"
                    @handleChange="handleChangeSiteData">
                </ComShuttle>
            </div>
            <div slot="footer">
                <el-button size="small" @click="choicePermission = false">取消</el-button>
                <el-button size="small" type="primary" @click="conditionConfirm()">确定</el-button>
            </div>
        </el-dialog>

        <!-- 日志弹框 -->
        <el-dialog width="950px" class="logs" title="日志" :visible.sync="isShowLog" @close="isShowLog=false">
            <ComPreviewTable
                :isAdaptiveHeight="true"
                :logKey="['操作日志', '操作人', '操作时间']"
                :logProps="['action', 'operator', 'create_time']"
                :logData="showLogTableData"
                :logWidth="['', '180', '180']">
            </ComPreviewTable>
        </el-dialog>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
import config from '@/assets/js/config';
import {
  getDataPermissionList,//列表
  getDataPermissionDetail,//对应员工详细权限
  dataDisplayList,//权限数据
  getAccountOptionList,//获取账号数据
  getProLineOptionList,//获取产品线数据
  setPermission,//保存权限
  getPermissionLogs,//获取日志信息
} from '../../../api/AccountManagement/DataPermission';

export default {
    name: 'DataPermission',
    data () {
        return {
            isShowLog:false,
            showLogTableData:[],
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['员工名称', '员工工号', '英文名', '岗位', '直属部门', '修改人', '修改时间', '操作'],
            tableProps: ['user_name', 'user_number', 'user_en_name', 'job_name', 'department_name', 'modify_by', 'modify_time', 'operate'],
            tableWidth: ['', '', '', '', '', '', '', ''],
            tableData: [],
            // 表格加载动画
            tableLoading: false,

            // 分页数据
            pageSizes: config.pageDatas.pageSizes,
            pageData: {
                currentPage: 1,
                currentList: 20,
                currentTotal: 0
            },

            // 保存选中项信息
            saveCheckInfo: [],
            // 选中的ids
            saveCheckIds: '',

            // 查询数据
            queryData: {
                user_name:"",
                user_number:"",
                modifier_people:"",
                mainQuery: {},
            },
            editPermission:{
                isEdit:false,
                dataPermissionDetail:[],
            },
            choicePermission:false,
            optionChoicePermission:'',
            permissionList:'',
            conditionValue:"",
            conditionList:'',
            indexEdit:0,     
            rowPermission:{},
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
                this.queryData = JSON.parse(this.queryParamsInfo['in_box']);
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
            getDataPermissionList(obj).then(({data}) => {
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
                key: 'in_box',
                value: JSON.stringify(this.queryData)
            });
            this.tableData = data.data_list.values;

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
        // 执行操作回调
        handleOperationCallBack(data) {
            if (data.status) {
                this.$message.success('操作成功！');
                this.handleQueryInfo({}, true);
            } else {
                this.$message.error(data.errorMess || '操作失败！');
            }
        },

        //修改权限详情
        handleDataPermissionEdit(row){
            getDataPermissionDetail({user_number:row.user_number}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.rowPermission = row;
                this.editPermission.dataPermissionDetail = data.data_list;
                this.editPermission.isEdit = true;
            }).catch({});
        },

        // 穿梭框选中方法
        handleChangeSiteData(values) {
            this.conditionValue = values;
        },

        //穿梭框拿取数据
        handleEditPermission(row,index,str){
            this.indexEdit = index;
            this.optionChoicePermission = str;
            this.conditionValue = [];
            this.conditionList = {};
            switch(str){
                case "选择账号":
                    this.titleArr=['未选账号', '已选账号']

                    this.conditionValue = [...row.account_id];
                    let account ={
                        platform_code: row.platform_code,
                        status: 'ALL'
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
                            this.choicePermission = true;

                        }else{
                            this.$message.warning('暂无数据！');
                        }
                    });
                    break;
                case "选择产品线":
                    this.titleArr=['未选产品线', '已选产品线']
                    this.conditionValue = [...row.pro_line_id];
                    let pro_line ={
                        platform_code: row.platform_code,
                    };
                    getProLineOptionList(pro_line).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败');
                            return;
                        }
                        if( data.data_list.length > 0 ){
                            let arr = {};
                            data.data_list.forEach(e => {
                                arr[e.id] = e.label;
                            });
                            this.conditionList = arr;
                            this.choicePermission = true;

                        }else{
                            this.$message.warning('暂无数据！');
                        }
                    });
                    break;
            }
        },
        //确定修改
        conditionConfirm() {
            let obj = {};
            switch(this.optionChoicePermission){
                case "选择账号":
                    obj = {
                        id: this.rowPermission.id,
                        platform_code: this.editPermission.dataPermissionDetail[this.indexEdit].platform_code,
                        user_number: this.rowPermission.user_number,
                        account_id: this.conditionValue.join(',')
                    }
                    setPermission(obj).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败');
                            return;
                        }else{
                            this.$message.success('操作成功！');
                            this.editPermission.dataPermissionDetail[this.indexEdit].account_id = this.conditionValue;
                            this.choicePermission = false;
                            this.handleQueryInfo({}, true);
                        }
                    }).catch({});
                    break;
                case "选择产品线":
                    obj = {
                        id: this.rowPermission.id,
                        platform_code: this.editPermission.dataPermissionDetail[this.indexEdit].platform_code,
                        user_number: this.rowPermission.user_number,
                        pro_line_id: this.conditionValue.join(',')
                    }
                    setPermission(obj).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }else{
                            this.$message.success('操作成功！');
                            this.editPermission.dataPermissionDetail[this.indexEdit].pro_line_id = this.conditionValue;
                            this.choicePermission = false;
                            this.handleQueryInfo({}, true);
                        }
                    }).catch({});
                    break;
            };
            
        },

        //日志信息
        handleDataPermissionLogsInfo(row){
            let obj ={
                id:row.id
            }
            getPermissionLogs(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.isShowLog = true;
                this.showLogTableData = data.data_list;
            }).catch({});
        }
    },
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
    // .el-transfer-panel__body{
    //     .el-checkbox-group.el-transfer-panel__list.is-filterable{
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
    //     }
    // }

    .el-cascader-menu__item {
        font-size: 12px !important;
    }
    .el-radio{
        font-size: 12px !important;
        /deep/.el-radio__label{
            font-size: 12px !important;
        }
    }
    .el-checkbox{
        font-size: 12px !important;
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
    /deep/.optionCondition{
        color:black;
        &.optionConditions{
            color:#409EFF;
        }
    }
    .headerInfoScrollTopright{
        /deep/.rule_name{
            .el-input__inner{
                padding-right: 55px;
            }
        }
    }
    .exclude{
        .el-form-item{
            margin: 0px;
        }
        /deep/.el-checkbox{
            margin-right: 7px;
        }
        /deep/.el-checkbox__label{
            padding-left: 5px;
        }
    }
    .option_value_type{
        margin-left: 20px;
        width: 90px;
        /deep/.el-input{
            width: 90px;
        }
    }
    .logs{
        /deep/.el-table{
            height: auto;
        }
        /deep/.el-table__body-wrapper{
            max-height: 500px;
            overflow-y: auto;
        }
    }
</style>
