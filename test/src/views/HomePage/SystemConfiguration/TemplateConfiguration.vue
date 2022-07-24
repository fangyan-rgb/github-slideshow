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
            <el-button type="text" @click="handleNewAdd()" v-if="buttonList['newAdd'].permit(thisVm)"><i class="icon-xinzeng1" style="color: #75b1fc" ></i>新增</el-button>
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
            <!-- 模板属性 转换 -->
            <template slot-scope="scope" slot="private">
                <div>{{optionList.private? optionList.private[scope.row.private]: ''}}</div>
            </template>
            <!-- 操作 -->
            <template slot-scope="scope" slot="operate">
                <el-button type="text" @click="handleOperateEdit(scope.row)" v-if="buttonList['edit'].permit(thisVm)">编辑</el-button>
                <ComDivide/>
                <el-button type="text" @click="handleOperateDelete(scope.row)" v-if="buttonList['delete'].permit(thisVm)">删除</el-button>
                <ComDivide/>
                <el-button type="text" @click="handleOperateDiary(scope.row)" v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
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
        <!-- 模板新增编辑弹框-->
        <el-dialog
            width="630px"
            class="ui-layout_edit-dialog"
            title="模板"
            :visible.sync="dialog.isTemplateClassShow"
            @close="handleAddEditCancel">
            <el-form :model="form" :rules="formRule" ref="form" label-width="90px">
                <el-form-item prop="platform" label="所属平台：">
                    <el-select placeholder="请选择" size="small" class="ui-form-style" clearable v-model="form.platform" @change="handlePlatformChange()">
                        <el-option
                            :label="value"
                            :value="value"
                            :key="value"
                            v-for="(label, value) in requestData.platform">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="templateName" label="模板名称：">
                    <el-input size="small" v-model="form.templateName" class="ui-form-style" clearable placeholder="请输入内容,不能超过50个字符" maxlength="50" show-word-limit></el-input>
                </el-form-item>
                <el-form-item prop="templatePropertie" label="模板属性：">
                    <el-select placeholder="请选择" size="small" class="ui-form-style" clearable v-model="form.templatePropertie">
                        <el-option
                            :label="label"
                            :value="value"
                            :key="value"
                            v-for="(label, value) in requestData.templatePropertie">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="templateType" label="模板类型：">
                    <el-select placeholder="请选择" size="small"  class="ui-form-style" clearable v-model="form.templateType" >
                        <el-option
                            v-if="form.platform"
                            :label="label"
                            :value="value"
                            :key="value"
                            v-for="(label, value) in form.platform?requestData.templateType[form.platform]:{}">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="templateClass" label="模板分类：">
                    <el-select placeholder="请选择" size="small"  class="ui-form-style" clearable v-model="form.templateClass">
                        <div v-for="(value,key) in requestData.templateClass" :key="key" v-if="key==form.platform?true:false">
                            <el-option
                                v-if="form.platform"
                                :label="item.category_name"
                                :value="item.id"
                                :key="item.id"
                                v-for="item in value">
                            </el-option>
                        </div>
                    </el-select>
                </el-form-item>
                <el-form-item label="标题：" prop="title">
                    <el-input type="textarea" v-model="form.title" :rows="2" resize="none" class="ui-form-style" placeholder="请输入内容,不能超过200个字符" maxlength="200" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="模板内容：" prop="templateContant">
                    <el-input type="textarea" v-model="form.templateContant" autosize :autosize="{ minRows: 2, maxRows: 6 }" :rows="2" class="ui-form-style"></el-input>
                </el-form-item>
            </el-form>
            <div class="ui-el-input-style" style="display:none;">
                <h3>标签替换</h3>
                <p>加入
                <el-input placeholder="{#客服名字#}" size="mini" value="{#客服名字#}" disabled></el-input>
                    后可根据当前客服人员名字来替换
                </p>
                <p>加入
                    <el-input placeholder="{#客户名称#}" size="mini" value="{#客户名字#}" disabled></el-input>
                    后可根据当前客户名称来替换
                </p>
                <p>加入
                    <el-input placeholder="{#客户地址#}" size="mini" value="{#客户地址#}" disabled></el-input>
                    后可根据当前客户订单收货地址来替换
                </p>
                <p>加入
                    <el-input placeholder="{#产品名称#}" size="mini" value="{#产品名称#}" disabled></el-input>
                    后可根据当前客户订单产品英文名称来替换（只支持单个产品）
                </p>
                <p>加入
                    <el-input placeholder="{#物流单号#}" size="mini" value="{#物流单号#}" disabled></el-input>
                    后可根据当前客户订单物流单号来替换
                </p>
                <p>加入
                    <el-input placeholder="{#ASIN#}" size="mini" value="{#ASIN#}" disabled></el-input>
                    后可根据当前客户订单Asin码来替换（只支持单个产品）
                </p>
            </div>
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
        getTemplateList,
        getTemplateDelete,
        getTemplateDetail,
        getTemplateEdit,
        getLog,
    } from '../../../api/SystemManagement/templateConfiguration.js'
    import {getSessionStorage} from '@/utils/storage';
    export default {
        name: 'TemplateConfiguration',
        data () {
            let newReg = (rule, value, callback) => {
                if ((this.form.templateType==='2'||this.form.templateType==='3'||this.form.templateType==='5')&&value==='1') {
                    callback(new Error('当前模板类型的属性应该为公共模板!'));
                } else {
                    callback();
                }
            };
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
                    platform_code:[],
                    create_by_list:[],
                    private:[],
                },
                checkList: [],
                // 数据
                tableData: [],
                tableKey: ['模板名称', "所属平台", "模板属性", "模板类型", "标题", "模板分类","创建人", "创建时间", "修改人", "修改时间",'模板使用次数','操作'],
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
                requestData:{
                    platform:[],
                    templatePropertie:[],
                    templateType:[],
                    templateClass:[],
                },
                form:{
                    templateName:'',
                    platform:'',
                    templatePropertie:'',
                    templateType:'',
                    templateClass:'',
                    title:'',
                    templateContant:'',
                },
                formRule:{
                    templateName:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        },
                    ],
                    platform:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        }
                    ],
                    templatePropertie:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        },
                        { validator: newReg, trigger: 'blur' }
                    ],
                    templateType:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        }
                    ],
                    templateClass:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        }
                    ],
                    templateContant:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        }
                    ],
                    title:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        },
                    ]
                }
            }
        },
        methods: {
            // ...mapActions(["GetTemplateList"]),
            getTemplateList,
            getTemplateDelete,
            getTemplateDetail,
            getTemplateEdit,
            getLog,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                // if (isSave) {
                //     this.queryData = JSON.parse(this.queryParamsInfo['template_configuration']);
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
                this.getTemplateList(obj).then(({data}) => {
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
                //     key: 'template_configuration',
                //     value: JSON.stringify(this.queryData)
                // });
                this.optionList = data.data_list.drop_down_box;
                this.optionList.create_by_list = data.data_list.drop_down_box.create_by_list;
                this.tableData = data.data_list.values;
                this.tableWidth = ['300', '120', '150', '150', '150 ', '100', '150', '100', '150', '120',''];
                this.tableProps = ['template_name', 'platform_code', 'private', 'template_type_txt', 'template_title', 'category_name', 'create_by','create_time', 'modify_by','modify_time','use_count','operate'];
                // 渲染分页
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentPage = data.page_data.offset * 1;
                this.pageData.currentTotal = data.page_data.total * 1;

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
                this.getTemplateList().then(({data})=>{
                    this.requestData.platform = data.data_list.drop_down_box.platform_code
                    this.requestData.templatePropertie = data.data_list.drop_down_box.private
                    this.requestData.templateType = data.data_list.drop_down_box.template_category_platform
                    this.requestData.templateClass = data.data_list.drop_down_box.template_category
                }).catch(error=>{})
                this.dialog.isTemplateClassShow = true
            },
            // 操作编辑
            handleOperateEdit(row){
                this.form.id = row.id
                this.form.templateName = row.template_name
                this.form.platform = row.platform_code
                this.form.templatePropertie = row.private;
                this.form.templateType = row.template_type;
                this.form.templateClass = row.category_id;
                this.form.title = row.template_title
                this.form.templateContant = row.template_content.replace(/\<br\>/g,'')
                this.getTemplateList().then(({data})=>{
                    this.requestData.platform = data.data_list.drop_down_box.platform_code
                    this.requestData.templatePropertie = data.data_list.drop_down_box.private
                    this.requestData.templateType = data.data_list.drop_down_box.template_category_platform
                    this.requestData.templateClass = data.data_list.drop_down_box.template_category
                }).catch(error=>{})

                this.dialog.isTemplateClassShow = true
            },
            // 新增编辑取消
            handleAddEditCancel(){
                this.form = {
                    id:'',
                    templateName:'',
                    platform:'',
                    templatePropertie:'',
                    templateType:'',
                    templateClass:'',
                    title:'',
                    templateContant:'',
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
                            category_id:this.form.templateClass,
                            platform_code:this.form.platform,
                            template_type:this.form.templateType,
                            template_name:this.form.templateName,
                            private:this.form.templatePropertie,
                            template_title:this.form.title,
                            template_content:this.form.templateContant
                        };
                        this.getTemplateEdit(obj).then(({data}) => {
                            this.handleOperationCall(data)
                        });
                        this.dialog.isTemplateClassShow = false
                    }
                })
            },
            // 操作删除
            handleOperateDelete(row){
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getTemplateDelete({
                        id:row.id,
                    }).then(({data})=>{
                        this.handleOperationCall(data)
                    }).catch(error=>{})
                }).catch(error =>{})
            },
            // 分页条数切换
            handleSizeChange(val) {
                this.pageData.currentPage = 1;
                this.pageData.currentList = val;
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
            },
            // 跳转页数切换
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
                    id:row.id,
                    modules:"mail_template"
                }).then(({data})=>{
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess);
                        return
                    }
                    this.dialogData.showLogTableData = data.data_list.data.values;
                    this.dialog.isShowLogShow = true
                });
            },
            handlePlatformChange(){
                this.form.templateClass='';
                this.form.templateType='';
            }
        },
        created() {
            // try {
            //     if (this.$route.query._cacheType === '1' || JSON.stringify(this.TemplateconfigInfo) === "{}") {
            //         // this.handleQueryInfo();
            //     } else {
            //         // 获取保存的查询参数
            //         this.queryData = JSON.parse(this.queryParamsInfo["template_configuration"]);
            //         this.handleQueryInfoCallBack(this.TemplateconfigInfo);
            //     }
            // } catch (e) {}
        },
        computed: {
            // ...mapGetters(['queryParamsInfo', 'TemplateconfigInfo']),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },

        },
    }
</script>

<style scoped lang="less">
    .ui-form-style{
        width:450px;
        /deep/.el-input.el-input--small.el-input--suffix{
            width:450px;
        }
    }
    .ui-el-input-style{
        .el-input{
            padding:10px 0;
    }
    }

    //弹窗字体
    /deep/.el-dialog__body {
        font-size: 12px;
    }
    //弹窗位置调整
    /deep/.el-dialog{
        margin-top: 5vh !important;
    }
</style>