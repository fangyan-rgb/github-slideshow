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
                <el-button type="text" size="small" @click="AddData" v-if="buttonList['newAdd'].permit(thisVm)"><i class="icon-xinzeng1" style="color: #75b1fc"></i>新增</el-button>
                <el-button type="text" size="small"  @click="batchDeleteData" v-if="buttonList['batchDelete'].permit(thisVm)"><i class="icon-shanchu1" style="color: #fa686c"></i>批量删除</el-button>
            </div>
            <!-- 操作 -->
            <ComTableInfo
                isCheck
                :tableWidth="tableWidth"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :searchHeight="searchHeight"
                @checked="handleSelectionChange"
                :tableLoading="tableLoading">
                <template slot="operation" slot-scope="scope">
                    <el-button type="text"  size="small" @click="compile(scope.row)" v-if="buttonList['edit'].permit(thisVm)">编辑</el-button>
                    <ComDivide/>
                    <el-button type="text"  size="small" @click="deleteData(scope.row)" v-if="buttonList['delete'].permit(thisVm)">删除</el-button>
                    <ComDivide/>
                    <span v-if="scope.row.status  === '1'">
                        <el-button type="text" @click="handleDisable(scope.row, true)" v-if="buttonList['stop'].permit(thisVm)">停用</el-button>
                        <ComDivide/>
                    </span>
                    <span v-if="scope.row.status  === '0'">
                        <el-button type="text" @click="handleDisable(scope.row, false)" v-if="buttonList['start'].permit(thisVm)">启用</el-button>
                        <ComDivide/>
                    </span>
                    <el-button type="text"  size="small" @click="handleShowLog(scope.row)" v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
                </template>
                <template slot="status" slot-scope="scope">
                    <span class="ui-state_circle greenColor" v-if="scope.row.status == 1"></span>
                    <span class="ui-state_circle redColor" v-if="scope.row.status == 0"></span>
                    <span v-html="scope.row.status==0?'停用':'启用'"></span>
                </template>
                <!-- 规则名称 -->
                <template slot="rule_name" slot-scope="scope">
                    <el-tooltip  :disabled="String(scope.row.rule_name).length < 16" effect="light" :content="String(scope.row.rule_name)" placement="top-start">
                        <p v-if="String(scope.row.rule_name) != 'null'">{{String(scope.row.rule_name).slice(0,16)}}<span  v-if="String(scope.row.rule_name).length >16">...</span></p>
                        <p v-else>{{scope.row.rule_name}}</p>
                    </el-tooltip>
                </template>
            </ComTableInfo>
            <!-- 新增编辑 -->
        <el-dialog
            :title="isModifyShow ? '新增' :'编辑'"
            width="1200px"
            class="ui-layout_edit-dialog"
            :visible.sync="isAddShow"
            @close="cancel">
            <el-form label-width="100px" ref="addObj" :model="addObj" :rules="Rules">
                <el-form-item label="所属平台：" prop="platform_code">
                    <el-select
                        filterable v-filter
                        size="small"
                        @change="addObj.first_class=''"
                        v-model="addObj.platform_code">
                        <el-option
                        v-for="(value,key) in platformCodeList"
                        :key="key"
                        :label="key"
                        :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="box">
                <div class="left">
                    <div class="left_header">条件<span style="font-size:12px;">（请至少选择一项条件填写）</span></div>
                    <el-form  label-width="100px" ref="addObj">
                        <el-form-item label="邮件主题：" >
                            <el-input type="textarea" :rows="2" placeholder="请输入关键词，多个请用英文逗号“,”隔开" size="mini" v-model="addObj.mail_theme"></el-input>
                            <el-select
                                size="small"
                                v-model="addObj.mail_theme_type">
                            <el-option
                                v-for="(value,key) in conditionTypeList"
                                :key="key"
                                :label="value"
                                :value="key">
                            </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发件人邮箱：">
                            <el-input type="textarea" :rows="2" placeholder="例：admin@163.com，多个请用英文逗号“,”隔开" size="mini" v-model="addObj.sender_email"></el-input>
                            <!-- <el-select
                                filterable v-filter
                                size="small"
                                clearable
                                v-model="addObj.sender_email_type">
                            <el-option
                                v-for="(value,key) in conditionTypeList"
                                :key="key"
                                :label="value"
                                :value="key">
                            </el-option>
                            </el-select>     -->
                        </el-form-item>
                        <el-form-item label="发件人后缀：">
                            <el-input type="textarea" :rows="2" placeholder="例：@163.com，多个请用英文逗号“,”隔开" size="mini" v-model="addObj.sender_suffix"></el-input>
                            <!-- <el-select
                                filterable v-filter
                                size="small"
                                clearable
                                v-model="addObj.sender_suffix_type">
                            <el-option
                                v-for="(value,key) in conditionTypeList"
                                :key="key"
                                :label="value"
                                :value="key">
                            </el-option>
                            </el-select>    -->
                        </el-form-item>
                        <el-form-item label="邮件正文：">
                            <el-input type="textarea" :rows="2" placeholder="请输入关键词，多个请用英文逗号“,”隔开" size="mini" v-model="addObj.mail_content"></el-input>
                            <el-select
                                size="small"
                                v-model="addObj.mail_content_type">
                            <el-option
                                v-for="(value,key) in conditionTypeList"
                                :key="key"
                                :label="value"
                                :value="key">
                            </el-option>
                            </el-select>
                        </el-form-item>
                        <div v-if="addObj.platform_code==='AMAZON'">
                            <el-form-item label="平台订单：">
                                <el-input type="textarea" :rows="2" placeholder="请输入订单号，多个请用英文逗号“,”隔开" size="mini" v-model="addObj.platform_order"></el-input>
                                <!-- <el-select
                                    filterable v-filter
                                    size="small"
                                    clearable
                                    v-model="addObj.platform_order_type">
                                <el-option
                                    v-for="(value,key) in conditionTypeList"
                                    :key="key"
                                    :label="value"
                                    :value="key">
                                </el-option>
                                </el-select>      -->
                            </el-form-item>
                            <el-form-item label="SKU：">
                                <el-input type="textarea" :rows="2" placeholder="请输入SKU，多个请用英文逗号“,”隔开" size="mini" v-model="addObj.sku"></el-input>
                                <el-select
                                    size="small"
                                    v-model="addObj.sku_type">
                                <el-option
                                    v-for="(value,key) in conditionTypeList"
                                    :key="key"
                                    :label="value"
                                    :value="key">
                                </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Asin：">
                                <el-input type="textarea" :rows="2" placeholder="请输入Asin，多个请用英文逗号“,”隔开" size="mini" v-model="addObj.asin"></el-input>
                                <el-select
                                    size="small"
                                    v-model="addObj.asin_type">
                                <el-option
                                    v-for="(value,key) in conditionTypeList"
                                    :key="key"
                                    :label="value"
                                    :value="key">
                                </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="货源状态：">
                                <el-checkbox-group v-model="checkedDeliveryChannel" @change="handleCheckeChange">
                                    <el-checkbox  label="1">正常</el-checkbox>
                                    <el-checkbox  label="2">断货</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="是否存在订单：">
                                <el-radio  label="1" v-model="addObj.order_exist">是</el-radio>
                                <el-radio  label="0" v-model="addObj.order_exist">否</el-radio>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div class="right">
                    <div class="right_header">规则</div>
                    <el-form  label-width="100px" ref="addObj" :model="addObj" :rules="Rules">
                        <el-form-item label="规则名称：" prop="rule_name">
                            <el-input size="small" v-model="addObj.rule_name" clearable placeholder="请输入内容,不能超过20个字符" class="rule_name" maxlength="20" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="优先级：">
                            <el-input size="small" v-model="addObj.priority" placeholder="填写大于0的整数" clearable @keyup.native="handleNumber(addObj.priority)"></el-input>
                            <p class="honey">数据同时满足多个规则时，执行此规则的优先级</p>
                        </el-form-item>
                        <el-form-item label="规则状态：" prop="status">
                            <el-radio  label="1" v-model="addObj.status">启用</el-radio>
                            <el-radio  label="0" v-model="addObj.status">停用</el-radio>
                        </el-form-item>
                        <el-form-item label="邮件类型：" prop="type">
                            <div v-if="addObj.platform_code==='AMAZON'">
                                <el-radio  label="1" v-model="addObj.type" @change="handleRadiochange">客户邮件</el-radio>
                                <el-radio  label="2" v-model="addObj.type" @change="handleRadiochange">客户纠纷</el-radio>
                                <el-radio  label="3" v-model="addObj.type" @change="handleRadiochange">平台通知</el-radio>
                                <el-radio  label="4" v-model="addObj.type" @change="handleRadiochange">QA</el-radio>
                            </div>
                            <div v-if="addObj.platform_code==='EB'">
                                <el-radio  :label="key" :key="key" v-model="addObj.type" v-for="(item,key) in ebayEmailType">{{item}}</el-radio>
                            </div>
                        </el-form-item>
                        <!-- 邮件分类 -->
                        <el-form-item label="邮件分类：" v-if="addObj.platform_code==='EB'" prop="first_class">
                            <el-select size="small" v-model="addObj.first_class" clearable>
                                <el-option
                                    v-for="(value,key) in ebayEmailLass"
                                    :key="key"
                                    :label="value"
                                    :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 纠纷类型 -->
                        <el-form-item label="纠纷类型：" v-if="addObj.type==2&&addObj.platform_code==='AMAZON'">
                            <el-select size="small" v-model="addObj.type_value" clearable>
                                <el-option
                                    v-for="(value,key) in disputeClassValue"
                                    :key="key"
                                    :label="value"
                                    :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                         <!-- 通知类型 -->
                        <el-form-item label="通知类型：" v-if="addObj.type==3&&addObj.platform_code==='AMAZON'">
                            <el-select size="small" v-model="addObj.type_value" clearable>
                                <el-option
                                    v-for="(value,key) in informClassValue"
                                    :key="key"
                                    :label="value"
                                    :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <div v-if="addObj.platform_code==='AMAZON'">
                            <el-form-item label="一级分类：">
                                <el-select
                                    filterable v-filter
                                    size="small"
                                    clearable
                                    v-model="addObj.first_class"
                                    @change="handleFirstClassChange(addObj.first_class)">
                                <el-option
                                    v-for="(value,key) in rankClassifyList"
                                    :key="key"
                                    :label="value"
                                    :value="key">
                                </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="二级分类：">
                                <el-select
                                    filterable v-filter
                                    size="small"
                                    clearable
                                    v-model="addObj.second_class">
                                <el-option
                                    v-for="(item,i) in secondClassList"
                                    :key="i"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <el-form-item label="满足条件：" prop="rule_exec_type">
                            <el-radio  label="1" v-model="addObj.rule_exec_type">满足任意条件</el-radio>
                            <el-radio  label="2" v-model="addObj.rule_exec_type">满足全部条件</el-radio>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer">
                <el-button size="small" @click="cancel">取消</el-button>
                <el-button size="small" type="primary" @click="dialogConfirm">确定</el-button>
            </div>
        </el-dialog>
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
    import {
        getEmailClassifyConfigurationListInfo,
        addEmailClassifyConfiguration,
        editEmailClassifyConfiguration,
        deleteEmailClassifyConfiguration,
        getdropDownData,
        getEmailClassifyConfigurationEditData,
        getPlatformCodeData,
        getLogData
    } from '../../../api/SystemManagement/GetEmailClassifyConfiguration'
    // import{
    //     mapGetters,
    //     mapActions
    // } from 'vuex';
    export default {
        name: 'EmailClassifyConfiguration',
        data () {
            return {
                searchHeight: false,
                thisVm: this,
                //搜索框数据
                queryData: {
                    mainQuery: {}
                },
                //列表数据
                tableKey: ["规则名称","所属平台","状态","优先级","创建人","创建时间","修改人","修改时间","规则结果","操作"],
                tableData: [],
                tableProps: [],
                tableWidth:[],
                // 表格加载动画
                tableLoading: false,

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },
                //是否修改显示(false是编辑显示，true时新增显示)
                isModifyShow:true,
                //控制弹窗显示隐藏
                isAddShow:false,
                //控制搜索配置弹窗显示隐藏
                isSearchShow:false,
                //勾选ID，用于批量删除
                selectId:"",
                //单选框
                radio:"true",
                //控制搜索框显示隐藏
                showSearch: true,
                //平台选项框下拉数据
                platformCodeList:{},
                //条件类型列表
                conditionTypeList:{1:"满足一个",2:"满足全部"},
                //级别分类列表
                rankClassifyList:{7:"客户咨询",8:"订单异常",9:"物流问题",10:"客诉异常"},
                //二级分类
                secondClassList:[],
                //客户咨询列表
                clientConsultList:[],
                //订单异常列表
                orderformAnomalyList:[],
                //物流问题列表
                logisticsIssueList:[],
                //客诉异常
                appealAnomalyList:[],
                //发货渠道checked
                checkedDeliveryChannel:[],
                //纠纷类型值
                disputeClassValue:{1:"AZ",2:"Return"},
                //邮件分类
                ebayEmailLass:{},
                ebayEmailType:{},
                //部门类型值
                informClassValue:{3:"VAT",4:"警告信",5:"其他"},
                //创建人
                createByList:[],
                //新增编辑弹窗数据
                addObj:{
                    mail_theme:"",              //邮件主题
                    sender_email:"",            //发件人邮箱
                    sender_suffix:"",           //发件人后缀
                    mail_content:"",            //邮件正文
                    platform_order:"",          //平台订单
                    sku:"",                     //SKU
                    asin:"",                    //asin
                    delivery_channel:"",        //发货渠道
                    order_exist:"",             //是否存在订单
                    platform_code:"AMAZON",           //平台
                    rule_name:"",               //规则名称
                    priority:"",                //优先级
                    status:"",                  //规则状态
                    type:"",                    //邮件类型
                    first_class:"",             //一级分类
                    second_class:"",            //二级分类或邮件分类
                    rule_exec_type:"",          //满足条件
                    mail_theme_type:"",         //邮件主题条件类型
                    sender_email_type:"",       //发件人邮箱条件类型
                    sender_suffix_type:"",      //发件人后缀条件类型
                    mail_content_type:"",       //邮件正文条件类型
                    platform_order_type:"",     //平台订单条件类型
                    sku_type:"",                //sku条件类型
                    asin_type:"",               //asin条件类型
                    delivery_channel_type:"",   //发货渠道条件类型
                    type_value:"",              //邮件类型的类型值（如纠纷类型的值）
                    id:"",
                },
                //弹窗表单验证
                Rules: {
                    platform_code: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        }
                    ],
                    rule_name: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        },{
                            max:20,
                            message:'不能超过最大长度'
                        }
                    ],
                    status: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        }
                    ],
                    type: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        }
                    ],
                    rule_exec_type: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        }
                    ],
                    first_class: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        }
                    ],
                },
                logTable: {
                    tableKey: ['操作日志', '操作人', '操作时间'],
                    tableProps: ['content', 'created_by', 'created_at' ],
                    tableWidth: []
                },
                dialog: {isShowLogShow: false},
                dialogData:{showLogTableData: []}
            }
        },
        computed: {
            // ...mapGetters([
            //     'queryParamsInfo',
            //     'emailClassifyConfigurationInfo'
            // ]),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
        methods:{
            // ...mapActions([
            //     'GetEmailClassifyConfigurationListInfo',
            // ]),
            //定义请求接口方法
            getEmailClassifyConfigurationListInfo,
            addEmailClassifyConfiguration,
            editEmailClassifyConfiguration,
            deleteEmailClassifyConfiguration,
            getdropDownData,
            getEmailClassifyConfigurationEditData,
            getPlatformCodeData,
            getLogData,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                // if (isSave) {
                //     this.queryData = JSON.parse(this.queryParamsInfo['email_classify_configuration']);
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
                this.getEmailClassifyConfigurationListInfo(obj).then(({data}) => {
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
                // this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                //     key: 'email_classify_configuration',
                //     value: JSON.stringify(this.queryData)
                // });
                //列表数据渲染
                this.createByList = data.data_list.drop_down_box.create_by_list;
                this.tableData = data.data_list.values;
                this.tableProps = ["rule_name","platform_code","status","priority","create_by","create_time","modify_by","modify_time","rule_result","operation"]
                this.tableWidth = ['240', '100', '100', '100', '150 ', '200', '150', '200', '150', ''];

                this.ebayEmailLass = data.data_list.drop_down_box.ebay_mail_class;
                this.ebayEmailType = data.data_list.drop_down_box.ebay_mail_type;
                //渲染分页
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentPage = data.page_data.offset * 1;
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
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
            },

            //页数切换
            handleCurrentChange(val) {
                this.pageData.currentPage = val;
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
            },

            //取消（关闭弹窗）
            cancel(){
                this.isAddShow = false;
                this.checkedDeliveryChannel = [];
                this.addObj = {
                    mail_theme:"",              //邮件主题
                    sender_email:"",            //发件人邮箱
                    sender_suffix:"",           //发件人后缀
                    mail_content:"",            //邮件正文
                    platform_order:"",          //平台订单
                    sku:"",                     //SKU
                    asin:"",                    //asin
                    //delivery_channel:"",      //发货渠道
                    order_exist:"",             //是否存在订单
                    platform_code:"AMAZON",           //平台
                    rule_name:"",               //规则名称
                    priority:"",                //优先级
                    status:"",                  //规则状态
                    type:"",                    //邮件类型
                    first_class:"",             //一级分类
                    second_class:"",            //二级分类
                    rule_exec_type:"",          //满足条件
                    mail_theme_type:"满足一个",  //邮件主题条件类型
                    sender_email_type:"",       //发件人邮箱条件类型
                    sender_suffix_type:"",      //发件人后缀条件类型
                    mail_content_type:"满足一个",//邮件正文条件类型
                    platform_order_type:"",     //平台订单条件类型
                    sku_type:"满足一个",         //sku条件类型
                    asin_type:"满足一个",        //asin条件类型
                    delivery_channel_type:"",   //发货渠道条件类型
                    type_value:"",              //邮件类型的类型值（如纠纷类型的值）
                    id:""
                };
                //重置表单域，清除验证
                this.$refs['addObj'].resetFields();
            },

            //点击编辑按钮
            compile(row){
                this.getEmailClassifyConfigurationEditData({
                    id:row.id,
                }).then(({data})=>{
                    let  newVal = data.data_list.values[0].first_class;
                    this.handleFirstClassChange(newVal);
                    this.addObj = data.data_list.values[0];
                    this.addObj.second_class = data.data_list.values[0].second_class;
                });
                this.isAddShow = true;
                this.isModifyShow = false;
            },

            // 点击弹窗确认回调
            dialogConfirm() {
                this.$refs['addObj'].validate((res) => {
                    if(res) {
                        let newObj = this.addObj;
                        if(this.addObj.platform_code==='AMAZON'){
                            if(this.addObj.mail_theme==''&&this.addObj.sender_email==''&&this.addObj.sender_suffix==''&&this.addObj.mail_content==''&&
                            this.addObj.platform_order==''&&this.addObj.sku==''&&this.addObj.asin==''&&this.addObj.delivery_channel==''&&
                            this.addObj.order_exist==''){
                                this.$message.error('请至少选择一项条件填写！');
                                return
                            }
                        }else if(this.addObj.platform_code==='EB'){
                            if(this.addObj.mail_theme==''&&this.addObj.sender_email==''&&this.addObj.sender_suffix==''&&this.addObj.mail_content==''){
                                this.$message.error('请至少选择一项条件填写！');
                                return
                            }
                        }
                        //修改默认显示传值
                        if (this.addObj.mail_theme_type == "满足一个") {
                            this.addObj.mail_theme_type="1"
                        }
                        if(this.addObj.mail_content_type == "满足一个"){
                            this.addObj.mail_content_type="1"
                        }
                        if(this.addObj.sku_type == "满足一个"){
                            this.addObj.sku_type = "1"
                        }
                        if(this.addObj.asin_type == "满足一个"){
                            this.addObj.asin_type = "1"
                        }
                        if(this.isModifyShow) {
                            this.addEmailClassifyConfiguration(newObj).then(({ data }) => {
                                this.succeedCallBack(data);
                            })
                        }else {
                            this.editEmailClassifyConfiguration(newObj).then(({ data }) => {
                                this.succeedCallBack(data);
                            })
                        }
                    }
                })
            },

            //操作成功回调
            succeedCallBack(data) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleQueryInfo({...this.queryData.mainQuery}, true);
                    if (this.isAddShow) {
                        this.cancel();
                    }
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                }
            },

            //获取勾选数据(用于批量删除)
            handleSelectionChange(val) {
                let idArr = [];
                for(let i = 0; i < val.length; i++) {
                    idArr.push(val[i].id)
                }
                this.selectId = idArr.join(',')
            },

            //点击操作/删除
            deleteData(row) {
                this.deleteCallBack(row.id);
            },

            //批量删除
            batchDeleteData(){
                if (!this.selectId) {
                    this.$message.warning('请勾选列表数据')
                } else {
                    this.deleteCallBack(this.selectId)
                }
            },

            //删除回调
            deleteCallBack(id) {
                this.$confirm('是否确认删除？','提示',{
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.deleteEmailClassifyConfiguration({id}).then(({ data }) => {
                        this.succeedCallBack(data);
                    })
                })
            },

            //新增
            AddData(){
                this.isAddShow = true;
                this.isModifyShow = true;
                this.addObj.status = "1"
            },

            //一次分类发生改变时
            handleFirstClassChange(val){
                if (val==7) {
                    this.secondClassList = this.clientConsultList;
                }else if (val==8){
                    this.secondClassList = this.orderformAnomalyList;
                }else if(val==9){
                    this.secondClassList = this.logisticsIssueList;
                }else if(val==10){
                    this.secondClassList = this.appealAnomalyList
                }else{
                    this.secondClassList = "";
                }
                this.addObj.second_class = ""
            },

            //发货渠道/订单状态CheckeChange
            handleCheckeChange(){
                this.addObj.delivery_channel = this.checkedDeliveryChannel.join(",");
            },
            // 日志
            handleShowLog(row) {
                this.getLogData({
                    id:row.id,
                    modules:"mail_classify_rule"
                }).then(({data})=>{
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess);
                        return
                    }
                    this.dialogData.showLogTableData = data.data_list.data.values;
                    this.dialog.isShowLogShow = true
                });
            },
            //停用启用
            handleDisable(row, isDisable) {
                this.$confirm(isDisable? '确定停用？': '确定启用？', "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    const params = {}
                    params.update_status =  row.status === '1'? 0: 1
                    params.id =  row.id
                    this.editEmailClassifyConfiguration(params).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess);
                            return
                        }
                        this.handleOperationCall(data);
                    });
                });
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

            //优先级
            handleNumber(val){　
                if (val.length == 1) {
                    this.addObj.priority = val.replace(/[^1-9]/g,'')
                } else {
                    this.addObj.priority = val.replace(/\D/g,'')
                }
            },

            //优化邮件类型联动数据
            handleRadiochange(){
                this.addObj.type_value = ""
            }

        },
        created() {
            this.addObj.mail_theme_type = this.conditionTypeList["1"];
            this.addObj.mail_content_type = this.conditionTypeList["1"];
            this.addObj.sku_type = this.conditionTypeList["1"];
            this.addObj.asin_type = this.conditionTypeList["1"];
            // try {
            //     if (this.$route.query._cacheType === '1' || JSON.stringify(this.emailClassifyConfigurationInfo) === '{}') {
            //         // this.handleQueryInfo();
            //     } else {
            //         // 获取保存的查询参数
            //         this.queryData = JSON.parse(this.queryParamsInfo['email_classify_configuration']);
            //         this.handleQueryInfoCallBack(this.emailClassifyConfigurationInfo);
            //     }
            // } catch (e) {
            //     console.log(e)
            // };
            this.getPlatformCodeData().then(({data})=>{
                this.platformCodeList = data.data_list.values;
            })

            this.getdropDownData({
                platform_code:'AMAZON',
            }).then(({data})=>{
                //一级分类下拉数据的四个值的四个对应列表
                this.clientConsultList = data.data_list[7];
                this.orderformAnomalyList = data.data_list[8];
                this.logisticsIssueList = data.data_list[9];
                this.appealAnomalyList = data.data_list[10];
            })

        },
    }
</script>

<style lang="less" scoped>
    .box{
        width: 100%;
        //height: 600px;
    }
    .box:after{
        display: block;
        clear: both;
        content: ""
    }
    .box .left{
        width: 62%;
        float: left;
        border:1px solid #F3F3F3;
        margin-right: 1%;
    }
    .box .right{
        width: 36%;
        float: left;
        border:1px solid #F3F3F3;
    }
    //textarea
    /deep/.el-textarea.el-input--mini{
        width: 77%;
    }
    //select
    // /deep/.el-select.el-select--small{
    //     width: 220px !important;
    // }
    // /deep/.el-input.el-input--small.el-input--suffix{
    //     width: 100%;
    // }
    .left_header,.right_header{
        height: 25px;
        background: #F3F3F3;
        line-height: 25px;
        padding-left: 20px;
        margin-bottom: 5px;
        font-weight: 700;
    }
   //下拉选择箭头
    // /deep/.el-input__suffix{
    //     height: 15px;
    // }
    //发货渠道
    /deep/.el-checkbox-group{
        display: inline;
    }
    .honey{
        color: #C0C4CC;
        font-size: 12px;
        font-family: "Microsoft YaHei","微软雅黑";
    }
   //左侧selec
   .left{
       /deep/.ui-layout_edit-dialog .el-select{
           width:120px !important;
       }
       /deep/.el-input.el-input--small.el-input--suffix{
            width:120px !important;
       }
       /deep/.el-input__inner{
           width:120px !important;
       }
       /deep/.el-select.el-select--small{
           width:120px !important;
       }
   }
   .right{
       .el-radio{
           margin-right: 8px;
       }
       /deep/.rule_name{
           .el-input__inner{
                padding-right: 55px;
            }
       }
   }
</style>