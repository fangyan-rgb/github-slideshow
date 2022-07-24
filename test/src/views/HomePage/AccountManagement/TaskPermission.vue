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
            
            <el-button size="small" type="text" v-if="buttonList['batchEdit'].permit(thisVm)" @click="handleTaskPermissionEdit('',false)">
                <i class="icon-piliangchuli" style="color: #75b1fc;font-size:12px;"></i>批量修改</el-button>
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
            <template slot-scope="scope" slot="status">
                <span class="ui-state_circle redColor" v-if="scope.row.status === '停用'"></span>
                <span class="ui-state_circle greenColor" v-if="scope.row.status === '启用'"></span>
                <span v-html="scope.row.status"></span>
            </template>
            <template slot-scope="scope" slot="operate">
                <el-button type="text" v-if="buttonList['edit'].permit(thisVm)" @click="handleTaskPermissionEdit(scope.row,true)">修改</el-button>
                <ComDivide/>
                <el-button type="text" v-if="buttonList['journal'].permit(thisVm)" @click="handleTaskPermissionLogsInfo(scope.row)">日志</el-button>
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
        <el-dialog title="修改绑定客服人员" width="500px" :visible.sync="isEdit" @close="handleEditClose" class="ui-layout_edit-dialog">
            <el-form :model="editPermission" :rules="rules" ref="editPermission">
                <el-form-item label="绑定客服人员" label-width="140px" prop="user_number">
                    <el-select v-model="editPermission.user_number" @change="isEditChange=true" clearable filterable v-filter remote 
                        :remote-method='handleGetUserList' 
                        size="small"
                        popper-class="zindexhighest"
                        style="width: 100%;">
                        <el-option
                            v-for="item in userInfo"
                            :label="item.value"
                            :value="item.id"
                            :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleEditClose">取消</el-button>
                <el-button size="small" type="primary" @click="handleEditConfirm()">确定</el-button>
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
  getTaskPermissionList,//列表
  getPermissionLogs,//日志信息
  getUserList,//获取客服人员信息
  saveEditInfo,//保存修改信息
} from '../../../api/AccountManagement/Taskermission';
import routerConfig from '@/router/routerConfig';

export default {
    name: 'TaskPermission',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['所属平台', '平台账号', '启用状态', '是否绑定客服', '绑定客服人员', '修改人', '修改时间', '操作'],
            tableProps: ['platform_code', 'account_name', 'status', 'is_bind', 'user_name', 'modify_by', 'modify_time', 'operate'],
            tableWidth: ['', '', '', '', '', '', ''],
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
                platform_code:"",
                account_id:"",
                modifier_people:"",
                modify_time: "",
                binding_customer:"",
                customer:""
            },
            isShowLog:false,
            showLogTableData:[],
            isEdit:false,
            userInfo:[],
            editPermission:{
                user_number:'',
                account_id:'',
            },
            isEditChange:false,
            rules: {
                user_number: [{required: true,message: '带*为必填项',trigger: 'blur'}],
            },
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
            getTaskPermissionList(obj).then(({data}) => {
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
        // 保存勾选信息
        handleSaveCheckInfo(val) {
            this.saveCheckInfo = val;
            this.saveCheckIds = [...new Set(this.saveCheckInfo.map(e => e.id))].join(',');
        },
        //日志信息
        handleTaskPermissionLogsInfo(row){
            getPermissionLogs({id:row.id}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.isShowLog = true;
                this.showLogTableData = data.data_list;
            }).catch({});
        },
        //修改
        handleTaskPermissionEdit(row,bool){
            if(bool){
                this.editPermission={
                    user_number: row.user_name,
                    account_id: row.id,
                }
            }else{
                this.editPermission={
                    user_number: '',
                    account_id: this.saveCheckIds,
                }
            }
            this.handleGetUserList('')
            this.isEdit = true;
        },
        // 获取客服人员
        handleGetUserList(query) {
            // if( query ){
                getUserList({account_name: query}).then(({data})=> {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    this.userInfo = data.data_list;
                });
            // }
        },
        //修改提交
        handleEditConfirm(){
            if(this.isEditChange){
                this.$refs.editPermission.validate((valid) => {
                    if (valid) {
                        saveEditInfo(this.editPermission).then(({data})=> {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败！');
                                return;
                            }else{
                                this.isEdit = false;
                                this.handleQueryInfo({}, true);
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        //取消修改
        handleEditClose(){
            this.isEdit = false;
            this.editPermission={
                user_number:'',
                account_id:'',
            }
            this.$refs.editPermission.resetFields();
        }
    },
}
</script>

<style lang="less" scoped>
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
