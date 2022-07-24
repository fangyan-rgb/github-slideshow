<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch" >
                <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo' @handleLoadOk='searchHeight = !searchHeight'/>
            </div>
        </transition>
            <div class="ui-fn-module">
                <span class="ui-top_i" @click="showSearch = !showSearch">
                    <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
                </span>
                <el-button type="text" size="small" @click="handleAddData" v-if="buttonList['newAdd'].permit(thisVm)">
                    <i class="icon-xinzeng1" style="color: #75b1fc" ></i>新增
                </el-button>
                <el-button type="text" size="small" @click="batchDeleteData" v-if="buttonList['batchDelete'].permit(thisVm)">
                    <i class="icon-shanchu1" style="color: #fa686c" ></i>批量删除
                </el-button>
            </div>
            <!-- 表格 -->
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
            </ComTableInfo>
            <!-- 点击新增/编辑弹窗 -->
            <el-dialog
                :title="isModifyShow ? '编辑' : '新增'"
                width="1300px"
                top="5vh"
                class="ui-layout_edit-dialog"
                :visible.sync="isAddShow"
                @close="cancel(true)">
                        <div class="configureInfoMain">
                            <el-collapse v-model="activeNames">
                                <el-form  label-width="90px"  :model="configureInfo" :rules="Rules" ref="configureInfo">
                                    <el-form-item label="所属平台：" prop="platform_code">
                                        <el-select
                                            filterable v-filter
                                            size="small"
                                            v-model="configureInfo.platform_code"
                                            @change="handleNewsSource(configureInfo.platform_code)">
                                            <el-option
                                                v-for="(value,key) in configureType.platformCodeList"
                                                    :key="key"
                                                    :label="key"
                                                    :value="key">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <div class="configureInfo">
                                        <div class="configureInfoLeft">
                                            <!-- <el-collapse-item title="规则信息" class="headerInfoScrollTop" name="1"></el-collapse-item> -->
                                            <!-- 条件设置 -->
                                            <el-collapse-item title="条件设置" class="headerInfoScrollTop" name="2">
                                                <table class="configureInfoLeftTable" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td colspan='2' style="width:300px;">条件字段</td>
                                                        <td style="width:500px;"><div style="text-align:center;">条件结果(未选择即默认全部)</div></td>
                                                    </tr>
                                                    <tr>
                                                        <td rowspan="9" style="padding-left:0;text-align:center;">选择条件</td>
                                                        <td><el-checkbox v-model="configureInfo.account.check" @change="configureInfo.account.content=[];configureInfo.account.len=0;configureInfo.account.account_id=''">指定账号</el-checkbox></td>
                                                        <td>
                                                            <el-button type="text" size="small"  @click="choiceConditionOption('选择账号')" :disabled="!configureInfo.account.check">选择账号</el-button>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="configureInfo.account.len">已选择{{configureInfo.account.len}}个</span>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="configureInfo.platform_code==='AMAZON'">
                                                        <td><el-checkbox v-model="configureInfo.site.check" @change="configureInfo['site'].content=[];">指定站点</el-checkbox></td>
                                                        <td>
                                                            <el-checkbox-group v-model="configureInfo['site'].content" class="checkbox_group">
                                                                <el-checkbox v-for="(item,index) in siteInfo" :label="item" :key="item" style="margin-right:16px;" :disabled="!configureInfo.site.check">{{item}}</el-checkbox>
                                                            </el-checkbox-group>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><el-checkbox v-model="configureInfo.country.check" @change="configureInfo.country.content=[];configureInfo.country.len=0;configureInfo.country.country_content=''">指定买家收货国家</el-checkbox></td>
                                                        <td>
                                                            <el-button type="text" size="small" @click="choiceConditionOption('选择国家')" :disabled="!configureInfo.country.check">选择国家</el-button>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="configureInfo.country.len">已选择{{configureInfo.country.len}}个</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><el-checkbox v-model="configureInfo.subject.check" @change="configureInfo.subject.content='';">邮件主题</el-checkbox></td>
                                                        <td>
                                                            <div class="configure">
                                                                <div class="configureArea">
                                                                    <el-input type="textarea" :rows="2" v-model="configureInfo.subject.content" placeholder="请输入关键词，多个请用英文逗号“,”隔开" :disabled="!configureInfo.subject.check"></el-input>
                                                                    <el-select  size="small" v-model="configureInfo.subject.type"  :disabled="!configureInfo.subject.check">
                                                                        <el-option
                                                                            v-for="(value,key) in includeList"
                                                                            :key="key"
                                                                            :label="value"
                                                                            :value="key">
                                                                        </el-option>
                                                                    </el-select>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><el-checkbox v-model="configureInfo.subject_body.check" @change="configureInfo.subject_body.content='';">邮件正文</el-checkbox></td>
                                                        <td>
                                                            <div class="configure">
                                                                <div class="configureArea">
                                                                    <el-input type="textarea" :rows="2" v-model="configureInfo.subject_body.content" placeholder="请输入关键词，多个请用英文逗号“,”隔开" :disabled="!configureInfo.subject_body.check"></el-input>
                                                                    <el-select  size="small" v-model="configureInfo.subject_body.type" :disabled="!configureInfo.subject_body.check">
                                                                        <el-option
                                                                            v-for="(value,key) in includeList"
                                                                            :key="key"
                                                                            :label="value"
                                                                            :value="key">
                                                                        </el-option>
                                                                    </el-select>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><el-checkbox v-model="configureInfo.erp_sku.check" @change="configureInfo.erp_sku.content='';">SKU</el-checkbox></td>
                                                        <td>
                                                            <div class="configure">
                                                                <div class="configureArea">
                                                                    <el-input type="textarea" :rows="2" v-model="configureInfo.erp_sku.content" placeholder="多个SKU用英文逗号“,”隔开" :disabled="!configureInfo.erp_sku.check"></el-input>
                                                                    <el-select  size="small" v-model="configureInfo.erp_sku.type" :disabled="!configureInfo.erp_sku.check">
                                                                        <el-option
                                                                            v-for="(value,key) in includeList"
                                                                            :key="key"
                                                                            :label="value"
                                                                            :value="key">
                                                                        </el-option>
                                                                    </el-select>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="configureInfo.platform_code==='AMAZON'">
                                                        <td><el-checkbox v-model="configureInfo.asin.check" @change="configureInfo.asin.content='';">ASIN</el-checkbox></td>
                                                        <td>
                                                            <div class="configure">
                                                                <div class="configureArea">
                                                                    <el-input type="textarea" :rows="2" v-model="configureInfo.asin.content" placeholder="多个ASIN用英文逗号“,”隔开" :disabled="!configureInfo.asin.check"></el-input>
                                                                    <el-select  size="small" v-model="configureInfo.asin.type" :disabled="!configureInfo.asin.check">
                                                                        <el-option
                                                                            v-for="(value,key) in includeList"
                                                                            :key="key"
                                                                            :label="value"
                                                                            :value="key">
                                                                        </el-option>
                                                                    </el-select>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="configureInfo.platform_code==='EB'">
                                                        <td><el-checkbox v-model="configureInfo.item.check" @change="configureInfo.item.content='';">Item ID</el-checkbox></td>
                                                        <td>
                                                            <div class="configure">
                                                                <div class="configureArea">
                                                                    <el-input type="textarea" :rows="2" v-model="configureInfo.item.content" placeholder="多个Item ID用英文逗号“,”隔开" :disabled="!configureInfo.item.check"></el-input>
                                                                    <el-select  size="small" v-model="configureInfo.item.type" :disabled="!configureInfo.item.check">
                                                                        <el-option
                                                                            v-for="(value,key) in includeList"
                                                                            :key="key"
                                                                            :label="value"
                                                                            :value="key">
                                                                        </el-option>
                                                                    </el-select>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><el-checkbox v-model="configureInfo.buyer_id.check" @change="configureInfo.buyer_id.content='';">买家ID</el-checkbox></td>
                                                        <td>
                                                            <div class="configure">
                                                                <div class="configureArea">
                                                                    <el-input type="textarea" :rows="2" v-model="configureInfo.buyer_id.content" placeholder="多个买家ID用英文逗号“,”隔开" :disabled="!configureInfo.buyer_id.check"></el-input>
                                                                    <el-select  size="small" v-model="configureInfo.buyer_id.type" :disabled="!configureInfo.buyer_id.check">
                                                                        <el-option
                                                                            v-for="(value,key) in includeList"
                                                                            :key="key"
                                                                            :label="value"
                                                                            :value="key">
                                                                        </el-option>
                                                                    </el-select>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="configureInfo.platform_code==='AMAZON'">
                                                        <td><el-checkbox v-model="configureInfo.customer_email.check" @change="configureInfo.customer_email.content='';">客户邮箱</el-checkbox></td>
                                                        <td>
                                                            <div class="configure">
                                                                <div class="configureArea">
                                                                    <el-input type="textarea" :rows="2" v-model="configureInfo.customer_email.content" placeholder="多个客户邮箱用英文逗号“,”隔开" :disabled="!configureInfo.customer_email.check"></el-input>
                                                                    <el-select  size="small" v-model="configureInfo.customer_email.type" :disabled="!configureInfo.customer_email.check">
                                                                        <el-option
                                                                            v-for="(value,key) in includeList"
                                                                            :key="key"
                                                                            :label="value"
                                                                            :value="key">
                                                                        </el-option>
                                                                    </el-select>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </el-collapse-item>
                                        </div>
                                    </div>
                                    <div class="configureInfoRight">
                                        <el-collapse-item title="规则信息" class="headerInfoScrollTopright" name="3">
                                            <el-form-item label="规则名称：" prop="rule_name">
                                                <el-input size="small" v-model="configureInfo.rule_name" placeholder="请输入内容,不能超过20个字符" class="rule_name"  maxlength="20" show-word-limit></el-input>
                                            </el-form-item>
                                            <el-form-item label="状态：" prop="status">
                                                <el-radio v-model="configureInfo.status" label="1" >启用</el-radio>
                                                <el-radio v-model="configureInfo.status" label="0">禁用</el-radio>
                                            </el-form-item>
                                            <el-form-item label="有效期：" prop="is_permanent">
                                                <el-radio v-model="configureInfo.is_permanent" label="1" >永久有效</el-radio>
                                                <el-radio v-model="configureInfo.is_permanent" label="0">时限内有效</el-radio>
                                            </el-form-item>
                                            <div v-if="configureInfo.is_permanent==='0'">
                                                <el-form-item label-width="auto" :prop="configureInfo.is_permanent ? '' :'validTimeArr'">
                                                    <el-date-picker
                                                        style="width:329px;"
                                                        @blur="handleTimeChange"
                                                        v-model="configureInfo.validTimeArr"
                                                        value-format="yyyy-MM-dd HH:mm:ss"
                                                        :default-time="['00:00:00', '23:59:59']"
                                                        type="datetimerange"
                                                        range-separator="至"
                                                        start-placeholder="开始日期"
                                                        end-placeholder="结束日期">
                                                    </el-date-picker>
                                                </el-form-item>
                                            </div>
                                            <el-form-item label="发送时间：" prop="send_time" v-if="configureInfo.platform_code==='AMAZON'">
                                                <div>超过
                                                    <el-input-number v-model="configureInfo.send_time" :min="1" :precision="0" controls-position="right" class="sendTime" style="width:100px;"></el-input-number>
                                                    小时未回复，自动回复
                                                </div>
                                            </el-form-item>
                                            <el-form-item label="选择模板：" prop="template_id">
                                                <el-select
                                                    filterable v-filter
                                                    clearable
                                                    size="small"
                                                    v-model="configureInfo.template_id"
                                                    @change="handleEmailContent(configureInfo.template_id)">
                                                    <el-option
                                                        v-for="(item,i) in configureType.maliTemplateList"
                                                        :key="i"
                                                        :label="item.template_name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="标题：">
                                                <el-input size="small" placeholder="选择模板后会显示标题，标题不可编辑或修改" v-model="configureInfo.template_title" class="rule_name" disabled></el-input>
                                            </el-form-item>
                                            <el-input
                                                type="textarea"
                                                :rows="10"
                                                placeholder="选择模板后会显示发信内容，发信内容不可编辑或修改"
                                                v-model="configureInfo.template_content"
                                                disabled>
                                            </el-input>
                                        </el-collapse-item>
                                    </div>
                                </el-form>
                            </el-collapse>
                        </div>
                        <!-- 点击选择权限弹窗 -->
                        <el-dialog
                            :title="optionChoiceCondition"
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
            <div slot="footer">
                <el-button size="small" @click="cancel(true)">取消</el-button>
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
        getAutomationReplyRuleListInfo,
        addAutomationReplyRule,
        editAutomationReplyRule,
        deleteAutomationReplyRule,
        platformCodeInfo,
        getMaliTemplateInfo,
        editDetailsInfo,
        getLogData,
        getNewsSourceData,
        getEmailContentData,
        getCountryListData,
    } from '../../../api/SystemManagement/GetAutomationReplyRule'
    import {
        getAccountOptionList,
        getCountryOptionList,
    } from '../../../api/SystemManagement/GetAutomationSendRule'
    // import{
    //     mapGetters,
    //     mapActions
    // } from 'vuex';

    export default {
        name: 'AutomationReplyRule',
        data () {
            return {
                searchHeight: false,
                thisVm: this,
                //搜索框数据
                queryData: {
                    mainQuery: {}
                },
                //列表数据
                tableKey: ["规则名称","所属平台","状态","有效期","创建人","创建时间","修改人","修改时间","操作"],
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
                //是否修改显示(false是新增显示，true时编辑显示)
                isModifyShow:false,
                //控制弹窗显示隐藏
                isAddShow:false,
                //勾选ID，用于批量删除
                selectId:"",
                //控制搜索配置弹窗显示隐藏
                isSearchShow:false,
                //单选框
                //radio:"true",
                //控制搜索框显示隐藏
                showSearch: true,
                //创建人
                createByList:[],
                //包含、不包含
                includeList:{1:"包含",2:"不包含"},
                //国家列表
                countryList:[],
                //弹窗数据
                addObj:{
                    platform_code:"",
                    tag_name:"",
                    tag_describe:"",
                    shortcut_key:"",
                    status:"",
                    id:""
                },
                //弹窗表单验证
                Rules: {
                    platform_code: [{required: true,message: '带*号为必填项',trigger: 'blur'}],
                    status: [{required: true,message: '带*号为必填项',trigger: 'blur'}],
                    validTimeArr: [{required: true,message: '有效期与永久有效二选一',trigger: 'blur'}] ,
                    is_permanent: [{required: true,message: '有效期项与永久有效项二选一',trigger: 'blur'}],
                    send_time:[{required: true,message: '带*号为必填项',trigger: 'blur'}],
                    rule_name:[{max:20,message:'不能超过最大长度'},{required: true,message: '带*号为必填项',trigger: 'blur'}],
                    template_id: [{required: true,message: '带*号为必填项',trigger: 'blur'}],
                },
                activeNames:["1","2","3"],
                configureType:{
                    platformCodeList:{},   //平台选项
                    maliTemplateList:[],  //选择模板列表数据
                    accountList:[],       //消息来源-账号列表
                    siteList:[],          //消息来源-站点列表
                },
                //新增编辑参数
                optionChoiceCondition:'',   //选择条件标题(穿梭框)
                choiceCondition:false,
                conditionList: {},
                conditionValue: [],
                configureInfo:{
                    id:'',
                    platform_code: 'AMAZON',   //	是	string	平台CODE
                    account:{
                        check:false,
                        content:[],
                        len:0,
                        account_id: ''
                    },
                    country:{
                        check:false,
                        content:[],
                        len:0,
                        country_content:''
                    },
                    site:{
                        check:false,
                        content:[],
                    },
                    subject:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    subject_body:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    erp_sku:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    asin:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    item:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    buyer_id:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    customer_email:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    rule_name:'',       //	是	int	规则名称
                    status:'',          //	否	int	状态(0:否,1:是)
                    start_time:'',      //	否	int	有效期 开始时间
                    end_time:'',        //	否	string	有效期 结束时间
                    is_permanent:'1',    //	否	datetime	是否永久有效(1是 0否)
                    send_time:'',       //	否	string	发送时间
                    template_id:'',     //	否	int	邮件模板id
                    validTimeArr:[],
                    template_title:'',
                    template_content:'',
                    

                    // account_id:'',       //	否	string	账号(多个逗号分隔)    
                    // site:'',            //	否	string	站点(多个逗号分隔)
                    // subject_content:'', //	否	string	邮件主题内容
                    // subject_type:'',    //	否	int	邮件主题类型（1 包含 2 不包含）
                    // subject_body_content:'',//	否	string	邮件正文内容
                    // subject_body_type:'',//	否	int	邮件正文类型（1 包含 2 不包含）
                    // erp_sku_content:'', //	否	string	erp sku
                    // erp_sku_type:'',    //	否	string	erp sku类型（1包含 2 不包含）
                    // buyer_id_content:'',//	否	string	客户id
                    // buyer_id_type:'',   //	否	int	客户id类型（1 包含 2 不包含）
                    // customer_email_content:'',//	否	string	客户邮箱内容
                    // customer_email_type:'',//	否	int	客户邮箱类型（1 包含 2 不包含）
                    // country_type:'',    //	否	int	国家类型（1 包含 2 不包含）
                    // country_content:'', //	否	string	国家内容
                    // asin_type:'',       //	否	int	asin类型（1包含 2 不包含）
                    // asin_content:'',    //	否	string	asin
                    
                },
                siteInfo:['CA', 'MX', 'DE', 'IT', 'JP', 'FR', 'AU', 'ES', 'UK', 'US'],
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
            //     'automationReplyRuleInfo'
            // ]),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
        methods:{
            // ...mapActions([
            //     'GetAutomationReplyRuleListInfo',
            // ]),
            getAutomationReplyRuleListInfo,
            addAutomationReplyRule,
            editAutomationReplyRule,
            deleteAutomationReplyRule,
            platformCodeInfo,
            getMaliTemplateInfo,
            editDetailsInfo,
            getLogData,
            getNewsSourceData,
            getEmailContentData,
            getCountryListData,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                // if (isSave) {
                //     this.queryData = JSON.parse(this.queryParamsInfo['automation_Reply_Rule']);
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
                this.getAutomationReplyRuleListInfo(obj).then(({data}) => {
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
                //     key: 'automation_Reply_Rule',
                //     value: JSON.stringify(this.queryData)
                // });
                //列表数据渲染
                // this.createByList = data.data_list.drop_down_box.create_by_list;
                this.tableData = data.data_list.values;
                this.tableProps = ["rule_name","platform_code","status","effective_time","create_by","create_time","modify_by","modify_time","operation"]
                this.tableWidth = ['490', '150', '80', '120', '100 ', '200', '100', '200', ''];
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
            cancel(bool){
                if(bool){
                    this.isAddShow = false;
                    this.isModifyShow = false;
                }
                this.configureInfo={
                    id: bool?'':this.configureInfo.id,
                    platform_code: bool?'AMAZON':this.configureInfo.platform_code,   //	是	string	平台CODE
                    account:{
                        check:false,
                        content:[],
                        len:0,
                        account_id: ''
                    },
                    country:{
                        check:false,
                        content:[],
                        len:0,
                        country_content:''
                    },
                    site:{
                        check:false,
                        content:[],
                    },
                    subject:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    subject_body:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    erp_sku:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    asin:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    item:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    buyer_id:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    customer_email:{
                        check:false,
                        content: '',
                        type: '1',
                    },
                    rule_name:'',       //	是	int	规则名称
                    status:'1',          //	否	int	状态(0:否,1:是)
                    start_time:'',      //	否	int	有效期 开始时间
                    end_time:'',        //	否	string	有效期 结束时间
                    is_permanent:'1',    //	否	datetime	是否永久有效(1是 0否)
                    send_time:'',       //	否	string	发送时间
                    template_id:'',     //	否	int	邮件模板id
                    validTimeArr:[],
                    template_title:'',
                    template_content:'',
                };
                // this.configureType={
                //     platformCodeList:{},   //平台选项
                //     maliTemplateList:[],  //选择模板列表数据
                //     accountList:[],       //消息来源-账号列表
                //     siteList:[],          //消息来源-站点列表
                // };
                if(bool)this.$refs['configureInfo'].resetFields();
            },

            //点击新增
            handleAddData(){
                this.isAddShow = true;
                this.configureInfo.is_permanent = '1';

                //获取模板
                this.handleNewsSource(this.configureInfo.platform_code);
            },

            //点击编辑按钮
            compile(row){
                this.editDetailsInfo({id:row.id}).then((data)=>{
                    let dataArr = [];
                    dataArr = data.data.data_list.values[0];
                    this.configureInfo={
                        id: dataArr.id,
                        platform_code: dataArr.platform_code,   //	是	string	平台CODE
                        account:{
                            check: dataArr.account_id?true:false,
                            content: dataArr.account_id?dataArr.account_id.split(','):[],
                            len: dataArr.account_id?dataArr.account_id.split(',').length:0,
                            account_id: dataArr.account_id
                        },
                        country:{
                            check: dataArr.country_content?true:false,
                            content: dataArr.country_content?dataArr.country_content.split(','):[],
                            len: dataArr.country_content?dataArr.country_content.split(',').length:0,
                            country_content: dataArr.country_content
                        },
                        site:{
                            check: dataArr.site?true:false,
                            content: dataArr.site?dataArr.site.split(','):[],
                        },
                        subject:{
                            check: dataArr.subject_content?true:false,
                            content:  dataArr.subject_content,
                            type: dataArr.subject_type,
                        },
                        subject_body:{
                            check: dataArr.subject_body_content?true:false,
                            content:  dataArr.subject_body_content,
                            type: dataArr.subject_body_type,
                        },
                        erp_sku:{
                            check: dataArr.erp_sku_content?true:false,
                            content:  dataArr.erp_sku_content,
                            type: dataArr.erp_sku_type,
                        },
                        asin:{
                            check: dataArr.asin_content?true:false,
                            content:  dataArr.asin_content,
                            type: dataArr.asin_type,
                        },
                        item:{
                            check: dataArr.itemid_content?true:false,
                            content:  dataArr.itemid_content,
                            type: dataArr.itemid_type,
                        },
                        buyer_id:{
                            check: dataArr.buyer_id_content?true:false,
                            content:  dataArr.buyer_id_content,
                            type: dataArr.buyer_id_type,
                        },
                        customer_email:{
                            check: dataArr.customer_email_content?true:false,
                            content:  dataArr.customer_email_content,
                            type: dataArr.customer_email_type,
                        },
                        rule_name: dataArr.rule_name,       //	是	int	规则名称
                        status: dataArr.status,          //	否	int	状态(0:否,1:是)
                        start_time: dataArr.is_permanent==='0'?dataArr.start_time:'',      //	否	int	有效期 开始时间
                        end_time: dataArr.is_permanent==='0'?dataArr.end_time:'',        //	否	string	有效期 结束时间
                        is_permanent: dataArr.is_permanent,    //	否	datetime	是否永久有效(1是 0否)
                        send_time: dataArr.send_time,       //	否	string	发送时间
                        template_id: dataArr.template_id,     //	否	int	邮件模板id
                        validTimeArr: dataArr.is_permanent==='0'?[dataArr.start_time,dataArr.end_time]:[],
                        template_title: '',
                        template_content: '',
                    };
                    this.handleEmailContent(this.configureInfo.template_id);
                });
                //编辑时获取消息来源-站点、账号、邮件模板数据
                this.getNewsSourceData({platform_code:row.platform_code}).then((data)=>{
                    this.configureType.accountList = data.data.data_list.data.account.values;
                    this.configureType.siteList = data.data.data_list.data.site.values;
                });
                this.getMaliTemplateInfo({platform_code:row.platform_code}).then((data)=>{
                    this.configureType.maliTemplateList = data.data.data_list;
                });
                this.isModifyShow = true;
                this.isAddShow = true;
            },

            // 点击弹窗确认回调
            dialogConfirm() {
                if(this.configureInfo.account.check&&!this.configureInfo.account.content.length){
                    this.$message.error('请选择指定账号!');
                    return;
                }else if(this.configureInfo.country.check&&!this.configureInfo.country.content.length){
                    this.$message.error('请选择指定买家收货国家!');
                    return;
                }else if(this.configureInfo.site.check&&!this.configureInfo.site.content.length){
                    this.$message.error('请选择指定站点!');
                    return;
                }else if(this.configureInfo.subject.check&&!this.configureInfo.subject.content.length){
                    this.$message.error('请输入邮件主题!');
                    return;
                }else if(this.configureInfo.subject_body.check&&!this.configureInfo.subject_body.content.length){
                    this.$message.error('请输入邮件正文!');
                    return;
                }else if(this.configureInfo.erp_sku.check&&!this.configureInfo.erp_sku.content.length){
                    this.$message.error('请输入SKU!');
                    return;
                }else if(this.configureInfo.asin.check&&!this.configureInfo.asin.content.length){
                    this.$message.error('请输入ASIN!');
                    return;
                }else if(this.configureInfo.buyer_id.check&&!this.configureInfo.buyer_id.content.length){
                    this.$message.error('请输入买家ID!');
                    return;
                }else if(this.configureInfo.customer_email.check&&!this.configureInfo.customer_email.content.length){
                    this.$message.error('请输入客户邮箱!');
                    return;
                }
                this.$refs['configureInfo'].validate((res) => {
                    if(res) {
                        let newObj = {
                            platform_code: this.configureInfo.platform_code,
                            rule_name: this.configureInfo.rule_name,
                            account_id: this.configureInfo.account.check?this.configureInfo.account.account_id:'',
                            status: this.configureInfo.status,
                            start_time: this.configureInfo.is_permanent==='0'?this.configureInfo.validTimeArr[0]:'',
                            end_time: this.configureInfo.is_permanent==='0'?this.configureInfo.validTimeArr[1]:'',
                            is_permanent: this.configureInfo.is_permanent,
                            site: this.configureInfo.site.content.length?this.configureInfo.site.content.join(','):'',
                            subject_type: this.configureInfo.subject.type,
                            subject_content: this.configureInfo.subject.check?this.configureInfo.subject.content:'',
                            subject_body_type: this.configureInfo.subject_body.type,
                            subject_body_content: this.configureInfo.subject_body.check?this.configureInfo.subject_body.content:'',
                            send_time: this.configureInfo.send_time,
                            erp_sku_type: this.configureInfo.erp_sku.type,
                            erp_sku_content: this.configureInfo.erp_sku.check?this.configureInfo.erp_sku.content:'',
                            asin_type: this.configureInfo.asin.type,
                            asin_content: this.configureInfo.asin.check?this.configureInfo.asin.content:'',
                            itemid_type: this.configureInfo.item.type,
                            itemid_content: this.configureInfo.item.check?this.configureInfo.item.content:'',
                            country_content: this.configureInfo.country.check?this.configureInfo.country.country_content:'',
                            customer_email_type: this.configureInfo.customer_email.type,
                            customer_email_content: this.configureInfo.customer_email.check?this.configureInfo.customer_email.content:"",
                            buyer_id_type: this.configureInfo.buyer_id.type,
                            buyer_id_content: this.configureInfo.buyer_id.check?this.configureInfo.buyer_id.content:'',
                            template_id: this.configureInfo.template_id
                        };
                        if( this.configureInfo.id )newObj.id = this.configureInfo.id;
                        //新增编辑提交
                        if(!this.isModifyShow) {
                            this.addAutomationReplyRule(newObj).then(({ data }) => {
                                this.succeedCallBack(data);
                            })
                        }else {
                            this.editAutomationReplyRule(newObj).then(({ data }) => {
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
                        this.cancel(true);
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
                    this.deleteAutomationReplyRule({id}).then(({ data }) => {
                        this.succeedCallBack(data);
                    })
                })
            },
            // 日志
            handleShowLog(row) {
                this.getLogData({
                    id:row.id,
                    modules:"mail_auto_reply"
                }).then(({data})=>{
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess);
                        return
                    }
                    this.dialogData.showLogTableData = data.data_list.data.values;
                    this.dialog.isShowLogShow = true
                });
            },
            handleDisable(row, isDisable) {
                this.$confirm(isDisable? '确定停用？': '确定启用？', "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    const params = {}
                    params.update_status =  row.status === '1'? 0: 1
                    params.id =  row.id
                    this.editAutomationReplyRule(params).then(({data}) => {
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

            //发送时间
            handleSendTime(val){
                if (val>0) {
                this.configureInfo.send_time = val
                }
                // else {
                //     this.$message.warning('请输入大于0的数字');
                //     this.configureInfo.send_time = ""
                // }
            },

            //获取消息来源-站点、账号、邮件模板数据
            handleNewsSource(val){
                this.getNewsSourceData({platform_code:val}).then((allData)=>{
                    this.configureType.accountList = allData.data.data_list.data.account.values;
                    this.configureType.siteList = allData.data.data_list.data.site.values;
                });
                let obj ={
                    platform_code:val,
                    template_type:2
                }
                this.getMaliTemplateInfo(obj).then((data)=>{
                    this.configureType.maliTemplateList = data.data.data_list;
                });
                //编辑-所属平台发生改变时清空关联数据
                this.cancel();
            },

            //获取邮件模板内容
            handleEmailContent(val){
                this.getEmailContentData({id:val}).then((data)=>{
                    this.configureInfo.template_title = data.data.data_list.values[0].template_title;
                    this.configureInfo.template_content = data.data.data_list.values[0].template_content;
                })
            },

            //永久有效值改变
            handleRadioChange(val){
                this.configureInfo.validTimeArr = []
            },

            //有效期时间范围改变
            handleTimeChange(val){
                // if (this.configureInfo.is_permanent) {
                //     this.configureInfo.is_permanent = false
                // }
                // this.$forceUpdate()
            },

            // 选择条件信息弹窗
            choiceConditionOption(mode){
                this.optionChoiceCondition = mode;
                this.conditionValue = [];
                this.conditionList = {};
                let arr = [];
                if( !this.configureInfo.platform_code ){
                    this.$message.warning('请先选择平台！');
                    return;
                }
                switch(mode){
                    case "选择账号":
                        this.titleArr=['全部账号', '所选账号']
                        this.conditionValue = [...this.configureInfo.account.content];
                        let account ={
                            platform_code: this.configureInfo.platform_code
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
                        break;
                    case "选择国家":
                        this.titleArr=['全部国家', '所选国家']
                        this.conditionValue = [...this.configureInfo.country.content];
                        getCountryOptionList().then(({data}) => {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败');
                                return;
                            }
                            if( data.data_list.values.length > 0 ){
                                let arr = {};
                                data.data_list.values.forEach(e => {
                                    arr[e.enAbbr] = e.cnName;
                                });
                                this.conditionList = arr;
                                this.choiceCondition = true;
                            }else{
                                this.$message.warning('暂无数据！');
                            }
                        });
                        break;
                }
            },
            // 穿梭框选中方法
            handleChangeSiteData(values) {
                this.conditionValue = values;
            },
            conditionConfirm() {
                switch(this.optionChoiceCondition){
                    case "选择账号":
                        this.configureInfo.account.content = [...this.conditionValue];
                        this.configureInfo.account.len = this.configureInfo.account.content.length;
                        this.configureInfo.account.account_id = this.conditionValue.join(',');
                        break;
                    case "选择国家":
                        this.configureInfo.country.content = [...this.conditionValue];
                        this.configureInfo.country.len = this.configureInfo.country.content.length;
                        this.configureInfo.country.country_content = this.conditionValue.join(',');
                        break;
                };
                this.choiceCondition = false;
            },
        },

        created() {
            // try {
            //     if (this.$route.query._cacheType === '1' || JSON.stringify(this.automationReplyRuleInfo) === '{}') {
            //         // this.handleQueryInfo();
            //     } else {
            //         // 获取保存的查询参数
            //         this.queryData = JSON.parse(this.queryParamsInfo['automation_Reply_Rule']);
            //         this.handleQueryInfoCallBack(this.automationReplyRuleInfo);
            //     }
            // } catch (e) {
            //     console.log(e)
            // }
            //获取平台列表
            this.platformCodeInfo().then(({ data }) => {
                this.configureType.platformCodeList = data.data_list.values
            })
            //获取国家列表
            this.getCountryListData().then((data)=>{
                this.countryList = data.data.data_list.values
            })
            // //获取模板
            // this.handleNewsSource(this.configureInfo.platform_code);
        },
    }
</script>

<style lang="less" scoped>
    .ulBox:after{
        display: block;
        clear: both;
        content: ""
    }
    .ulBox{
        height: 250px;
    }
    .ulBox li{
        float: left;
        width: 150px;
    }
    .ulBox li p{
       margin-bottom: 20px;
    }
    /deep/.el-collapse{
        border-top:0 none;
        border-bottom:0 none;
        display: flex;
        .el-collapse-item__header{
            background-color: #FAFAFA;
            border: 1px solid #E6E6E6;
            padding-left: 20px;
            font-family: "Microsoft YaHei","微软雅黑";
            font-weight: 700;
            font-style: normal;
            margin-top:10px;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
        }
        .el-collapse-item__arrow.el-icon-arrow-right{
            height: 30px;
            line-height: 30px;
        }
        .el-collapse-item__wrap{
            height: 563px;
            overflow: auto;
            border-bottom: 0 none;
            border: 1px solid #e6e6e6;
            border-top: 0 none;
            padding: 10px 20px 10px 20px;
        }
        .el-collapse-item__content{
            padding-bottom: 0;
            font-size: 12px;
        }
    }
    /deep/.configureInfo{
        width: 800px;
        height: auto;
        display: inline-block;
        float: left;
        .headerInfoScrollTop{
            width: 100%;
            .configureInfoMain{
                width: 100%;
            }
            table{
                width: 100%;
                border-top: 1px solid #E6E6E6;
                border-left: 1px solid #E6E6E6;
                th{
                    line-height: 28px;
                    font-family: "Microsoft YaHei","微软雅黑";
                    font-weight: 600;
                    font-style: normal;
                    text-indent: 2em;
                    border-right: 1px solid #E6E6E6;
                    border-bottom: 1px solid #E6E6E6;
                    background-color: #FAFAFA;
                }
                td{
                    border-right: 1px solid #E6E6E6;
                    border-bottom: 1px solid #E6E6E6;
                    line-height: 28px;
                    padding-left: 24px;
                }
            }
        }
        .is-required .el-form-item__label::before{
            position: static;
        }
    }
    /deep/.el-form-item__content{
        line-height: 32px;
        font-size: 12px;
        .el-input__inner{
            height: 32px;
            line-height: 32px;
            .el-input__icon.el-range__icon.el-icon-date{
                line-height: 20px;
            }
            .el-range-separator{
                line-height: 24px;
            }
        }
    }
    .newsSource{
        display: flex;
        justify-content:flex-start;
        .el-select.el-select--small{
            width: 200px;
        }
        /deep/.el-input.el-input--small.el-input--suffix{
            width: 200px !important;
        }
    }
    /deep/.sendOutTime{
        display: flex;
        justify-content:flex-start;
        line-height: 40px;
        margin-top: 11px;
        .el-input.el-input--small{
            width: 100px;
            margin: 0 10px;
        }
        .el-form-item__content{
            line-height: 40px;
        }
    }
    /deep/.configure{
        .el-form-item__label{
            line-height: 66px;
        }
        /deep/.configureArea{
            display: flex;
            margin: 10px 0;
            .el-textarea{
                // width: 450px;
                // margin-right: 20px;
                width: 350px;
                margin-right: 27px;
            }
            .el-select.el-select--small{
                width: 100px;
                .el-input.el-input--small.el-input--suffix{
                    width: 100px;
                }
            }
        }
    }
    /deep/.headerInfoScrollTopright{
        width: 450px;
        .el-collapse-item__wrap{
            height: 563px;
            overflow: auto;
        }
        // .el-select.el-select--small{
        //     width: 200px;
        // }
        // .el-input.el-input--small.el-input--suffix{
        //     width: 200px;
        // }
        .el-textarea__inner{
            width: 400px;
        }
        .sendTime{
            width: 100px;
            .el-input{
                width: 100px;
            }
            .el-input-number__decrease{
                line-height: 15px;
                bottom: 4px;
            }
            .el-input-number__increase{
                line-height: 15px;
                top: 4px;
            }
        }
    }
    .el-form{
        width: 100%;
        .configureInfoRight{
            width: 450px;
            display: inline-block;
            margin: 0 0 0 10px;
            /deep/.el-date-editor .el-range__icon{
                line-height: 25px;
            }
        }
    }
    //垂直居中
    /deep/.el-form-item__content{
        line-height: 40px
    }
    //消息来源
    .newsSource li{
        margin-right: 20px;
    }
    //li01
   .countryContent{
        display: flex;
        justify-content:flex-start;
        .li01{
            margin-right: 27px;
            .el-select.el-select--small{
            width: 490px;
            }
            /deep/.el-input.el-input--small.el-input--suffix{
                width: 490px !important;
            }
        }
        .li02{
            .el-select.el-select--small{
            width: 100px;
            }
            /deep/.el-input.el-input--small.el-input--suffix{
                width: 100px !important;
            }
        }
   }
   //发送时间
   .sendOutTime li{
       margin-right: 23px;
   }
   //时间弹窗层级
    .TimeControl{
        /deep/.el-picker-panel.el-date-range-picker.el-popper.has-time{
            z-index: 3000;
        }
    }
    .configureInfoLeft{
        /deep/.el-input__icon.el-range__icon.el-icon-time{
            line-height: 24px;
        }
    }
    .headerInfoScrollTop{
        /deep/.rule_name{
            .el-input__inner{
                padding-right: 55px;
            }
        }
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
    /deep/.ui-shuttle_container .el-transfer-panel{
        width: 390px;
        .el-input__inner{
            width: 370px;
        }
    }
    .checkbox_group{
        /deep/.el-checkbox{
            width: 80px;
        }
    }
    /deep/.el-dialog__body{
        padding: 10px 20px;
        .ui-shuttle_container > span:nth-of-type(1){
            left: 200px;
        }
        .ui-shuttle_container > span:nth-of-type(2){
            left: 740px;
        }
    }
</style>