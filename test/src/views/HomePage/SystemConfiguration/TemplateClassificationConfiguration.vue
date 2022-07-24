<template>
    <div class="ui-main-module">
        <!-- 搜索框 -->
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo' @handleLoadOk='searchHeight = !searchHeight'/>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch">
                <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
            </span>
            <el-button type="text" @click="handleNewAdd" v-if="buttonList['newAdd'].permit(thisVm)"><i class="icon-xinzeng1" style="color: #75b1fc" ></i>新增</el-button>
        </div>
        <!-- 列表 -->
        <ComTableInfo
            isCheck
            @checked="handleCheck"
            :tableWidth="tableWidth"
            :tableKey="tableKey"
            :tableProps="tableProps"
            :tableData="tableData"
            :showSearch="showSearch"
            :searchHeight="searchHeight"
            :otherHeight="['el-tabs__header']"
            :tableLoading="tableLoading">
            <!-- 操作 -->
            <template slot-scope="scope" slot="operate">
                <el-button type="text" @click="handleOperateEdit(scope.row)" v-if="buttonList['edit'].permit(thisVm)">编辑</el-button>
                <ComDivide/>
                <el-button type="text" @click="handleOperateDelete(scope.row)" v-if="buttonList['delete'].permit(thisVm)">删除</el-button>
                <ComDivide/>
                <el-button type="text" @click="handleOperateDiary(scope.row)" v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
            </template>
            <!-- 分类描述 -->
            <template slot="category_describe" slot-scope="scope">
                <el-tooltip  :disabled="String(scope.row.category_describe).length < 100" effect="light" :content="String(scope.row.category_describe)" placement="top-start">
                    <p v-if="String(scope.row.category_describe) != 'null'">{{String(scope.row.category_describe).slice(0,100)}}<span  v-if="String(scope.row.category_describe).length > 100">...</span></p>
                    <p v-else>{{scope.row.category_describe}}</p>
                </el-tooltip>
            </template>
            <!-- 分类名称 -->
            <template slot="category_name" slot-scope="scope">
                <el-tooltip  :disabled="String(scope.row.category_name).length < 10" effect="light" :content="String(scope.row.category_name)" placement="top-start">
                    <p v-if="String(scope.row.category_name) != 'null'">{{String(scope.row.category_name).slice(0,10)}}<span  v-if="String(scope.row.category_name).length > 10">...</span></p>
                    <p v-else>{{scope.row.category_name}}</p>
                </el-tooltip>
            </template>
        </ComTableInfo>
        <!-- 分页 -->
        <div class="ui-main-module-page">
            <el-pagination
                @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageData.currentPage" :page-sizes="pageSizes"
                :page-size="pageData.currentList"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageData.currentTotal">
            </el-pagination>
        </div>
        <!-- 模板分类弹框-->
        <el-dialog
            width="620px"
            class="ui-layout_edit-dialog"
            title="模板分类"
            :visible.sync="dialog.isTemplateClassShow"
            @close="handleAddEditCancel">
            <el-form :model="form" :rules="formRule" ref="form" label-width="90px">
                <el-form-item label="平台：" prop="platform_code">
                    <el-select filterable v-filter clearable size="small" v-model="form.platform_code">
                        <el-option
                            v-for="(value,key) in platformCodeList"
                            :key="key"
                            :label="value"
                            :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="className" label="分类名称：">
                    <el-input size="small" v-model="form.className" clearable class="ui-form-style" placeholder="请输入内容,不能超过20个字符" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="分类描述：" prop="classDescription">
                    <el-input type="textarea" v-model="form.classDescription" :rows="5" resize="none" class="ui-form-style" placeholder="请输入内容,不能超过100个字符" maxlength="100" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
               <el-button @click="handleAddEditCancel" size="small">取消</el-button>
               <el-button type="primary" @click="handleAddEditConfirm" size="small">确定</el-button>
            </span>
        </el-dialog>
        <!-- 日志 -->
        <el-dialog
            width="950px"
            class="ui-layout_edit-dialog"
            title="日志"
            :visible.sync="dialog.isShowLogShow"
            close="dialog.isShowLogShow=false">
            <ComPreviewTable
                :isAdaptiveHeight="false"
                :logKey="logTable.tableKey"
                :logProps="logTable.tableProps"
                :logWidth='logTable.tableWidth'
                :logData="dialogData.showLogTableData">
            </ComPreviewTable>
        </el-dialog>
    </div>
</template>
<script>
    import config from '@/assets/js/config';
    // import {
    //     mapActions,
    //     mapGetters
    // } from "vuex";
    import {
        getClassTemplateList,
        getClassTemplateDelete,
        getClassTemplateEdit,
        getLog,
        getPlatformCodeList,
    } from '../../../api/SystemManagement/templateClassificationConfiguration.js'
    import {getSessionStorage} from '@/utils/storage';
    export default {
        name: 'TemplateClassificationConfiguration',
        data () {
            return {
                searchHeight: false,
                thisVm: this,
                //默认图片
                defaultImg: require("../../../assets/image/default_error.png"),
                // 搜索框
                showSearch: true,
                queryData: {
                    mainQuery: {}
                },
                optionList:{
                    create_by_list:[],
                },
                checkList: [],
                // 数据
                tableData: [],
                tableKey: ['分类名称', '所属平台', "分类描述", "关联模板数量", "创建人", "创建时间","修改人", "修改时间", '操作'],
                tableProps: [],
                tableWidth: [],
                // 表格加载动画
                tableLoading: false,

                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },
                //id参数
                ids: '',
                dialog:{
                    isTemplateClassShow:false,
                    isShowLogShow: false

                },
                logTable: {
                    tableKey: ['操作日志', '操作人', '操作时间'],
                    tableProps: ['content', 'created_by', 'created_at' ],
                    tableWidth: []
                },
                dialogData:{showLogTableData: []},
                form:{
                    id:'',
                    platform_code:'',
                    className:'',
                    classDescription:'',
                },
                formRule:{
                    className:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        },
                        {
                            max:20,
                            message:'不能超过最大长度'
                        }
                    ],
                    platform_code:[{
                        required: true,
                        message: "带*号不能为空",
                        trigger: "blur"
                    }],
                    classDescription:[{
                        max:100,
                        message:'不能超过最大长度'
                    }]
                },
                platformCodeList:'',
            }
        },
        methods: {
            // ...mapActions(["GetClassTemplateList"]),
            getClassTemplateList,
            getClassTemplateDelete,
            getClassTemplateEdit,
            getLog,
            getPlatformCodeList,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                // if (isSave) {
                //     this.queryData = JSON.parse(this.queryParamsInfo['template_info']);
                // }
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
                this.getClassTemplateList(obj).then(({data}) => {
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

            // 查询重置
            handleResetQueryInfo() {
                this.queryData = {
                    mainQuery: {}
                }
            },
            // 查询回调
            handleQueryInfoCallBack(data){
                // 获取保存的查询参数
                // this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                //     key: 'template_info',
                //     value: JSON.stringify(this.queryData)
                // });
                this.optionList = data.data_list.drop_down_box;
                this.tableData = data.data_list.values;
                this.tableWidth = ['150', '150', '', '100', '120', '150', '120', '150', '150'];
                this.tableProps = ['category_name', 'platform_code', 'category_describe', 'template_count', 'create_by', 'create_time','modify_by','modify_time','operate'];

                // 渲染分页
                this.pageData.currentTotal = data.page_data.total * 1;
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentPage = data.page_data.offset * 1;

                // 重置表格高度
                this.searchHeight = !this.searchHeight;
            },
            // 操作回调
            handleOperationCall(data) {
                if (data.status) {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                    this.handleQueryInfo({...this.queryData.mainQuery}, true);
                } else {
                    this.$message({
                        type: 'error',
                        message: data.errorMess || '操作失败'
                    })
                }
            },
            // 新增
            handleNewAdd(){
                this.dialog.isTemplateClassShow = true
                this.handleGetPlatformCodeListInfo()
            },
            // 操作编辑
            handleOperateEdit(row){
                this.form.id = row.id;
                this.form.platform_code = row.platform_code;
                this.form.className = row.category_name;
                this.form.classDescription = row.category_describe;
                this.dialog.isTemplateClassShow = true;
                this.handleGetPlatformCodeListInfo()
            },
            // 新增编辑取消
            handleAddEditCancel(){
                this.form = {
                    id:'',
                    platform_code:'',
                    className:'',
                    classDescription:'',
                },
                this.$refs['form'].resetFields();
                this.dialog.isTemplateClassShow = false
            },
            // 新增编辑确定
            handleAddEditConfirm(){
                this.$refs['form'].validate((res) => {
                    if (res) {
                        let obj = {
                            id:this.form.id,
                            platform_code:this.form.platform_code,
                            category_name:this.form.className,
                            category_describe:this.form.classDescription,
                        };
                        this.getClassTemplateEdit(obj).then(({data}) => {
                            this.handleOperationCall(data)
                        });
                        this.dialog.isTemplateClassShow = false
                    }
                })
            },
            // 操作删除
            handleOperateDelete(row){
                if(row.template_count>0){
                    this.$message.warning("该模板存在关联，不允许删除！");
                    return
                }
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getClassTemplateDelete({
                        id:row.id,
                    }).then(({data})=>{
                        this.handleOperationCall(data)
                    }).catch(error=>{})
                }).catch(error =>{})
            },
            //n条/页切换
            handleSizeChange(val) {
                this.pageData.currentPage = 1;
                this.pageData.currentList = val;
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
            },

            //页数切换
            handleCurrentChange(val) {
                this.pageData.currentPage = val;
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
            },
            // 列表勾选
            handleCheck(row) {
                this.checkList = row
                let idArr = [];
                this.checkList.forEach(item => {
                    idArr.push(item.id)
                });
                this.ids = idArr.join(',')
            },
            // 日志
            handleOperateDiary(row){
                this.getLog({
                    id: row.id,
                    modules: "template_category"
                }).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess);
                        return
                    }
                    this.dialogData.showLogTableData = data.data_list.data.values;
                    this.dialog.isShowLogShow = true
                });
            },
            //获取平台下拉数据
            handleGetPlatformCodeListInfo(){
                this.getPlatformCodeList().then(({data})=>{
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess);
                        return
                    }
                    this.platformCodeList = data.data_list.values
                })
            }
        },
        created() {
            // try {
            //     if (this.$route.query._cacheType === '1' || JSON.stringify(this.TemplateClassInfo) === "{}") {
            //         // this.handleQueryInfo();
            //     } else {
            //         // 获取保存的查询参数
            //         this.queryData = JSON.parse(this.queryParamsInfo["template_info"]);
            //         this.handleQueryInfoCallBack(this.TemplateClassInfo);
            //     }
            // } catch (e) {}

        },
        computed: {
            // ...mapGetters(['queryParamsInfo', 'TemplateClassInfo']),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
    }
</script>

<style scoped lang="less">
.ui-form-style{
    width:450px;
}
.el-select.el-select--small{
    width:450px;
    /deep/.el-input.el-input--small.el-input--suffix{
        width:450px;
    }
}

.el-form-item{
    /deep/.el-input__count{
        line-height: 15px;
    }
}
</style>