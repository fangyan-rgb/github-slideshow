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
                <el-button type="text" size="small" v-if="buttonList['newAdd'].permit(thisVm)" @click="AddData"><i class="icon-xinzeng1" style="color: #75b1fc" ></i>新增</el-button>
                <el-button type="text" size="small" v-if="buttonList['batchDelete'].permit(thisVm)" @click="batchDeleteData"><i class="icon-shanchu1" style="color: #fa686c"></i>批量删除</el-button>
            </div>
            <!-- 列表 -->
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
                    <el-button type="text" @click="handleOperateDiary(scope.row)" v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
                </template>
                <template slot="status" slot-scope="scope">
                    <span class="ui-state_circle greenColor" v-if="scope.row.status == 1"></span>
                    <span class="ui-state_circle redColor" v-if="scope.row.status == 0"></span>
                    <span v-html="scope.row.status == 1 ?'启用':'停用'"></span>
                </template>
                <!-- 规则 -->
                <template slot="rule_description" slot-scope="scope">
                    <el-popover class="ui-content-overflow" ref="popover"
                        placement="top"
                        trigger="hover"
                        :disabled="scope.row.rule_description[0].length<85"
                        width="500"
                        :content="scope.row.rule_description[0]">
                    <div slot="reference" class="ui-tooltip">{{scope.row.rule_description[0]}}</div>
                    </el-popover>
                    <div>{{scope.row.rule_description[1]}}</div>
                </template>
                <!-- 规则名称 -->
                <template slot="rule_name" slot-scope="scope">
                    <el-tooltip  :disabled="String(scope.row.rule_name).length < 16" effect="light" :content="String(scope.row.rule_name)" placement="top-start">
                        <p v-if="String(scope.row.rule_name) != 'null'">{{String(scope.row.rule_name).slice(0,16)}}<span  v-if="String(scope.row.rule_name).length >16">...</span></p>
                        <p v-else>{{scope.row.rule_name}}</p>
                    </el-tooltip>
                </template>
            </ComTableInfo>
            <!-- 点击新增/编辑弹窗 -->
        <el-dialog
            :title="isModifyShow ? '新增' : '编辑'"
            width="1150px"
            top="1vh"
            class="ui-layout_edit-dialog"
            :visible.sync="isAddShow"
            @close="cancel">
            <el-form  label-width="110px" :model="addObj" :rules="Rules" ref="addObj">
                <el-form-item label="平台：" prop="platform_code">
                    <el-select
                            filterable v-filter
                            size="small"
                            @change="AddData"
                            v-model="addObj.platform_code">
                        <el-option
                            v-for="(value,key) in platformCodeList"
                            :key="key"
                            :label="key"
                            :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="dialog_top">
                    <el-collapse v-model="activedialogTop">
                        <div class="top_header">
                            <el-collapse-item title="规则信息" name="1">
                                <!-- AMAZON -->
                                <div v-if="addObj.platform_code!='EB'">
                                    <div style="display:flex;">
                                        <div style="width:350px;">
                                            <el-form-item label="规则名称：" prop="rule_name">
                                                <el-input size="small" v-model="addObj.rule_name" placeholder="请输入内容,不能超过20个字符" show-word-limit maxlength="20"></el-input>
                                            </el-form-item>
                                        </div>
                                        <div style="width:300px;">
                                            <el-form-item label="优先级：" prop="priority">
                                                <el-input-number size="small" v-model="addObj.priority" show-word-limit :precision="0" :min="1" controls-position="right" style="width:240px;"></el-input-number>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    
                                    <div style="display:flex;">
                                        <div style="width:350px;">
                                            <el-form-item label="售后类型：">
                                                <el-radio v-model="addObj.aftersale_type" label="1" >退款</el-radio>
                                            </el-form-item>
                                        </div>
                                        <div style="width:300px;">
                                            <el-form-item label="状态：" prop="status">
                                                <el-radio v-model="addObj.status" label="1" >启用</el-radio>
                                                <el-radio v-model="addObj.status" label="0">停用</el-radio>
                                            </el-form-item>
                                        </div>
                                    </div>
                                </div>
                                <!-- EB -->
                                <div v-if="addObj.platform_code=='EB'">
                                    <div style="display:flex;">
                                        <div style="width:350px;">
                                            <el-form-item label="规则名称：" prop="rule_name">
                                                <el-input size="small" v-model="addObj.rule_name" placeholder="请输入内容,不能超过20个字符" show-word-limit maxlength="20"></el-input>
                                            </el-form-item>
                                        </div>
                                        <div style="width:300px;">
                                            <el-form-item label="售后类型：">
                                                <el-radio v-model="addObj.aftersale_type" label="1" >退款</el-radio>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div style="display:flex;">
                                        <div style="width:350px;">
                                            <el-form-item label="状态：" prop="status">
                                                <el-radio v-model="addObj.status" label="1" >启用</el-radio>
                                                <el-radio v-model="addObj.status" label="0">停用</el-radio>
                                            </el-form-item>
                                        </div>
                                        <div style="width:300px;">
                                            <el-form-item label="优先级：" prop="priority">
                                                <el-input-number size="small" v-model="addObj.priority" show-word-limit :precision="0" :min="1" controls-position="right" style="width:240px;"></el-input-number>
                                            </el-form-item>
                                        </div>
                                    </div>
                                </div>
                                    
                            </el-collapse-item>
                        </div>
                    </el-collapse>
                </div>
                <div class="dialog_bottom">
                    <el-collapse v-model="activedialogBottom">
                        <div class="bottom_header">
                            <el-collapse-item title="售后规则" name="2">
                                <div class="bottom_table" v-if="addObj.platform_code!='EB'">
                                    <table cellspacing="0">
                                        <tr class="tr_title">
                                            <td>
                                                平台退款原因
                                            </td>
                                            <td>
                                                ERP订单状态
                                            </td>
                                            <td>
                                                SKU状态
                                            </td>
                                            <td>
                                                订单利润
                                            </td>
                                            <td>
                                                不良类型
                                            </td>
                                            <td>
                                                不良原因
                                            </td>
                                            <!-- <td>
                                                责任归属部门
                                            </td>
                                            <td>
                                                原因类别
                                            </td> -->
                                        </tr>
                                        <tr class="tr_content" >
                                            <td class="pingtai">
                                                <el-select size="mini" clearable v-model="addObj.rules[0].platform_reason_code">
                                                    <el-option
                                                        v-for="(item,index) in platformRefundList"
                                                        :key="index"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </td>
                                            <td>
                                                <el-button @click="handleClickERPBtn">选择状态</el-button>
                                            </td>
                                            <td>
                                                <el-button @click="handleClickSKUBtn">选择状态</el-button>
                                            </td>
                                            <td>
                                                <el-select size="mini" clearable v-model="addObj.rules[0].order_profit_cond">
                                                    <el-option
                                                        v-for="(value,key) in profitList"
                                                        :key="key"
                                                        :label="value"
                                                        :value="key">
                                                    </el-option>
                                                </el-select>
                                                <el-form-item label-width="0" :prop="'rules.'+0+'.order_profit_value'" :rules="[{pattern: /^(([1-9][0-9]+)||[0-9])((\.[0-9][0-9])||\.[0-9])?$/,message: '不能为负数，且只保留小数点后两位！'}]">
                                                    <el-input  size="mini" type="text" v-model="addObj.rules[0].order_profit_value">
                                                        <template slot="append">元</template>
                                                    </el-input>
                                                </el-form-item>
                                            </td>
                                            <td>
                                                <el-select size="mini" clearable v-model="addObj.rules[0].department_id" @change="handleDutyDepartmentChange(addObj.rules[0].department_id)">
                                                    <el-option
                                                        v-for="(item,index) in dutyDepartmentList"
                                                        :key="index"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </td>
                                            <td>
                                                <el-select size="mini" clearable v-model="addObj.rules[0].reason_id">
                                                    <el-option
                                                        v-for="(item,index) in causeClassList"
                                                        :key="index"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="bottom_table_eb" v-if="addObj.platform_code=='EB'">
                                    <table cellspacing="0">
                                        <tr>
                                            <td width="200" colspan="2" style="text-align:center;background-color: #F3F3F3;">条件字段</td>
                                            <td width="500" style="text-align:center;background-color: #F3F3F3;">条件结果</td>
                                        </tr>
                                        <tr>
                                            <td rowspan="6">选择条件</td>
                                            <td>纠纷类型/原因</td>
                                            <td>
                                                <div style="display:flex;">
                                                    <div>
                                                        <el-form-item label="" label-width="0px" :prop="'ruleEb.'+0+'.dispute_type'" :rules="ruleEb.dispute_type">
                                                            <div style="width:100px;"><el-radio label="Cancel" v-model="addObj.ruleEb[0].dispute_type" @change="addObj.ruleEb[0].dispute_type==='Return'?'':addObj.ruleEb[0].dispute_reason=''">Cancel</el-radio></div>
                                                            <div style="width:100px;"><el-radio label="Inquiry" v-model="addObj.ruleEb[0].dispute_type" @change="addObj.ruleEb[0].dispute_type==='Return'?'':addObj.ruleEb[0].dispute_reason=''">Inquiry</el-radio></div>
                                                            <div style="width:100px;"><el-radio label="Return" v-model="addObj.ruleEb[0].dispute_type" @change="addObj.ruleEb[0].dispute_type==='Return'?'':addObj.ruleEb[0].dispute_reason=''">Return</el-radio></div>
                                                        </el-form-item>
                                                    </div>
                                                    <div style="margin-top:80px;">
                                                        <el-form-item label="纠纷原因" :prop="'ruleEb.'+0+'.dispute_reason'" :rules="addObj.ruleEb[0].dispute_type=='Return'?[{required: true,message: '带*号为必填项',trigger: 'blur'}]:[]" label-width="120px">
                                                            <el-select filterable v-filter clearable size="mini" v-model="addObj.ruleEb[0].dispute_reason" multiple collapse-tags :disabled="addObj.ruleEb[0].dispute_type!='Return'">
                                                                <el-option
                                                                    v-for="value in ReasonsDisputes"
                                                                    :key="value.id"
                                                                    :label="value.id"
                                                                    :value="value.id">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>ERP订单状态</td>
                                            <td><span style="cursor: pointer;color: #409EFF;" @click="handleClickERPBtn">选择状态</span>
                                             &nbsp;&nbsp;&nbsp;<span v-if="addObj.ruleEb[0].erp_order_status.length">已选{{addObj.ruleEb[0].erp_order_status.split(',').length}}个</span></td>
                                        </tr>
                                        <tr>
                                            <td>SKU状态</td>
                                            <td><span style="cursor: pointer;color: #409EFF;" @click="handleClickSKUBtn">选择状态</span>
                                             &nbsp;&nbsp;&nbsp;<span v-if="addObj.ruleEb[0].sku_status.length">已选{{addObj.ruleEb[0].sku_status.split(',').length}}个</span></td>
                                        </tr>
                                        <tr>
                                            <td>订单退件类型</td>
                                            <td><span style="cursor: pointer;color: #409EFF;" @click="handleClickTypeBtn">选择类型</span>
                                             &nbsp;&nbsp;&nbsp;<span v-if="addObj.ruleEb[0].order_return_type.length">已选{{addObj.ruleEb[0].order_return_type.split(',').length}}个</span></td>
                                        </tr>
                                        <tr>
                                            <td>发货仓库</td>
                                            <td><span style="cursor: pointer;color: #409EFF;"  @click="choiceConditionOption('选择仓库')">选择仓库</span>
                                             &nbsp;&nbsp;&nbsp;<span v-if="warehouseCheckedList.length">已选{{warehouseCheckedList.length}}个</span></td>
                                        </tr>
                                        <tr>
                                            <td>订单利润</td>
                                            <td>
                                                <el-select size="mini" clearable v-model="addObj.ruleEb[0].order_profit_cond">
                                                    <el-option
                                                        v-for="(value,key) in profitList"
                                                        :key="key"
                                                        :label="value"
                                                        :value="key">
                                                    </el-option>
                                                </el-select>
                                                <el-input-number size="mini" show-word-limit 
                                                    controls-position="right" class="inputNumber" v-model="addObj.ruleEb[0].order_profit_value"
                                                    :precision="2" :min="0"></el-input-number>元
                                            </td>
                                        </tr>
                                        <tr>
                                            <td rowspan="2">执行结果</td>
                                            <td>不良类型</td>
                                            <!-- <td>责任归属部门</td> -->
                                            <td>
                                                <el-form-item label="" label-width="0px" :prop="'ruleEb.'+0+'.department_id'" :rules="ruleEb.department_id">
                                                    <el-select size="mini" clearable v-model="addObj.ruleEb[0].department_id" @change="handleDutyDepartmentChange(addObj.ruleEb[0].department_id)">
                                                        <el-option
                                                            v-for="(item,index) in dutyDepartmentList"
                                                            :key="index"
                                                            :label="item.name"
                                                            :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </td>
                                        </tr>
                                        <tr>
                                            <!-- <td>原因类别</td> -->
                                            <td>不良原因</td>
                                            <td>
                                                <el-form-item label="" label-width="0px" :prop="'ruleEb.'+0+'.reason_id'" :rules="ruleEb.reason_id">
                                                    <el-select size="mini" clearable v-model="addObj.ruleEb[0].reason_id">
                                                        <el-option
                                                            v-for="(item,index) in causeClassList"
                                                            :key="index"
                                                            :label="item.name"
                                                            :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </el-collapse-item>
                        </div>
                    </el-collapse>
                </div>
                </el-form>
            <div slot="footer">
                <el-button size="small" @click="cancel">取消</el-button>
                <el-button size="small" type="primary" @click="dialogConfirm">确定</el-button>
            </div>
            <div class="choiceCondition">
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
            </div>
            <!-- 选择ERP订单状态弹窗 -->
            <el-dialog
                width="720px"
                title="选择ERP订单状态"
                :visible.sync="innerVisible"
                class="ui-layout_edit-dialog"
                :append-to-body="true"
                @close="handleEPRSKUCancel(false,'ERP')">
                <template>
                    <div class="ERPSKUBox">
                    <el-checkbox :indeterminate="isIndeterminate_ERP" v-model="ERPAll" @change="ERPSKUCheckAll">全选</el-checkbox>
                    <el-checkbox-group v-model="ERPcheckedList" @change="handleCheckedERPChange">
                        <p v-for="(value,key) in ERPCheckedData" :key="key" class="ERPSKU_P"><el-checkbox :label="key" :key="key" >{{value}}</el-checkbox></p>
                    </el-checkbox-group>
                    </div>
                </template>
                    <div slot="footer" class="footer">
                    <el-button size="small" @click="handleEPRSKUCancel(false,'ERP')">取消</el-button>
                    <el-button size="small" type="primary" @click="handleSelectStatusConfirm('ERP')">确定</el-button>
                </div>
            </el-dialog>
            <!-- 选择SKU状态弹窗 -->
            <el-dialog
                width="720px"
                title="选择SKU状态"
                :visible.sync="SKUInnerVisible"
                class="ui-layout_edit-dialog"
                :append-to-body="true"
                @close="handleEPRSKUCancel(false,'SKU')">
                <template>
                    <div class="ERPSKUBox">
                    <el-checkbox :indeterminate="isIndeterminate_SKU" v-model="SKUAll"  @change="ERPSKUCheckAll">全选</el-checkbox>
                    <el-checkbox-group v-model="SKUcheckedList" @change="handleCheckedERPChange">
                        <p v-for="(value,key) in SKUCheckedData" :key="key" class="ERPSKU_P"><el-checkbox :label="key" :key="key">{{value}}</el-checkbox></p>
                    </el-checkbox-group>
                    </div>
                </template>
                    <div slot="footer">
                    <el-button size="small" @click="handleEPRSKUCancel(false,'SKU')">取消</el-button>
                    <el-button size="small" type="primary" @click="handleSelectStatusConfirm('SKU')">确定</el-button>
                </div>
            </el-dialog>
            <!-- 选择订单退件类型弹窗 -->
            <el-dialog
                width="720px"
                title="选择订单退件类型"
                :visible.sync="orderReturnTypeVisible"
                class="ui-layout_edit-dialog"
                :append-to-body="true"
                @close="handleEPRSKUCancel(false,'type')">
                <template>
                    <div class="ERPSKUBox">
                    <el-checkbox :indeterminate="isIndeterminate_type" v-model="typeAll"  @change="ERPSKUCheckAll">全选</el-checkbox>
                    <el-checkbox-group v-model="typeCheckedList" @change="handleCheckedERPChange">
                        <p v-for="(value,index) in OrderReturnType" :key="index" class="ERPSKU_P"><el-checkbox :label="value.id" :key="index">{{value.value}}</el-checkbox></p>
                    </el-checkbox-group>
                    </div>
                </template>
                    <div slot="footer">
                    <el-button size="small" @click="handleEPRSKUCancel(false,'type')">取消</el-button>
                    <el-button size="small" type="primary" @click="handleSelectStatusConfirm('type')">确定</el-button>
                </div>
            </el-dialog>
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
    import {
        getAutomationAfterSaleRuleListInfo,
        addAutomationAfterSaleRule,
        editAutomationAfterSaleRule,
        deleteAutomationAfterSaleRule,
        getdropDownData,
        getAutomationAfterSaleRuleData,
        getThirdStageData,
        getLog,
    } from '../../../api/SystemManagement/GetAutomationAfterSaleRule'
    import {
        getWarehouseOptionList,
    } from '../../../api/SystemManagement/GetAutomationSendRule'
    // import{
    //     mapGetters,
    //     mapActions
    // } from 'vuex';
    export default {
        name: 'AutomationAfterSaleRule',
        data () {
            return {
                orderReturnTypeVisible:false,
                searchHeight:false,
                thisVm: this,
                //搜索框数据
                queryData: {
                    mainQuery: {}
                },
                //列表数据
                tableKey: [/*"ID",*/"规则名称","所属平台","规则","状态","创建人","创建时间","操作"],
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
                isModifyShow:false,
                //控制弹窗显示隐藏
                isAddShow:false,
                //勾选ID，用于批量删除
                selectId:"",
                //单选框
                radio:"true",
                //控制搜索框显示隐藏
                showSearch: true,
                ERPCheckedData:{},
                SKUCheckedData:{},
                //内层弹窗(ERP订单状态)
                innerVisible:false,
                //内层弹窗(sku状态)
                SKUInnerVisible:false,
                //全选(内层弹窗(sku状态))
                SKUcheckedList: [],
                SKUArr:[],
                isIndeterminate_SKU: false,
                SKUAll:false,
                //全选(内层弹窗(ERP订单状态))
                isIndeterminate_ERP:false,
                ERPcheckedList: [],
                ERPArr:[],
                ERPAll:false,
                //全选(内层弹窗(订单退件类型))
                isIndeterminate_type:false,
                typeCheckedList: [],
                OrderReturnType:[{"id":'1',"value":"安检"},{"id":'2',"value":"尺寸超长、体积超重"},{"id":'3',"value":"偏远"},{"id":'4',"value":"地址问题"},{"id":'5',"value":"跟踪号失败"},{"id":'6',"value":"退货重号"},{"id":'7',"value":"扣件"},{"id":'8',"value":"派送不成功"}],
                typeArr:[],
                typeAll:false,
                //平台退款原因
                platformRefundList:[],
                //责任部门
                dutyDepartmentList:[],
                //原因类别
                causeClassList:[],
                //纠纷原因
                ReasonsDisputes:[{"id":"ARRIVED_DAMAGED","value":"ARRIVED_DAMAGED"},{"id":"ARRIVED_LATE","value":"ARRIVED_LATE"},{"id":"BUYER_CANCEL_ORDER","value":"BUYER_CANCEL_ORDER"},{"id":"BUYER_NO_SHOW","value":"BUYER_NO_SHOW"},{"id":"BUYER_NOT_SCHEDULED","value":"BUYER_NOT_SCHEDULED"},{"id":"BUYER_REFUSED_TO_PICKUP","value":"BUYER_REFUSED_TO_PICKUP"},{"id":"DEFECTIVE_ITEM","value":"DEFECTIVE_ITEM"},{"id":"DIFFERENT_FROM_LISTING","value":"DIFFERENT_FROM_LISTING"},{"id":"EXPIRED_ITEM","value":"EXPIRED_ITEM"},{"id":"FAKE_OR_COUNTERFEIT","value":"FAKE_OR_COUNTERFEIT"},{"id":"FOUND_BETTER_PRICE","value":"FOUND_BETTER_PRICE"},{"id":"IN_STORE_RETURN","value":"IN_STORE_RETURN"},{"id":"MISSING_PARTS","value":"MISSING_PARTS"},{"id":"NO_LONGER_NEED_ITEM","value":"NO_LONGER_NEED_ITEM"},{"id":"NO_REASON","value":"NO_REASON"},{"id":"NOT_AS_DESCRIBED","value":"NOT_AS_DESCRIBED"},{"id":"ORDERED_ACCIDENTALLY","value":"ORDERED_ACCIDENTALLY"},{"id":"ORDERED_DIFFERENT_ITEM","value":"ORDERED_DIFFERENT_ITEM"},{"id":"ORDERED_WRONG_ITEM","value":"ORDERED_WRONG_ITEM"},{"id":"OTHER","value":"OTHER"},{"id":"OUT_OF_STOCK","value":"OUT_OF_STOCK"},{"id":"RETURNING_GIFT","value":"RETURNING_GIFT"},{"id":"VALET_DELIVERY_ISSUES","value":"VALET_DELIVERY_ISSUES"},{"id":"VALET_UNAVAILABLE","value":"VALET_UNAVAILABLE"},{"id":"WRONG_SIZE","value":"WRONG_SIZE"}],
                //订单利润
                profitList:{1:"大于",2:"大于等于",3:"小于",4:"小于等于"},
                //平台选项框下拉数据
                platformCodeList:{},
                //责任部门id
                departmentId:"",
                activedialogTop:"1",
                activedialogBottom:"2",
                //弹窗数据
                addObj:{
                    rule_name:"",
                    platform_code:"AMAZON",
                    aftersale_type:"",
                    status:"",
                    id:"",
                    priority:"",
                    rules:[
                       {
                            platform_reason_code: "",
                            erp_order_status: "",
                            sku_status: "",
                            order_profit_cond: "",
                            order_profit_value: "",
                            department_id: "",
                            reason_id: "",
                        }
                    ],
                    ruleEb:[
                       {
                            dispute_type: "",
                            dispute_reason:[],
                            order_return_type:"",
                            erp_order_status: "",
                            sku_status: "",
                            order_profit_cond: "",
                            order_profit_value: "",
                            department_id: "",
                            reason_id: "",
                            // formula_id:""
                            warehouse: ""
                        }
                    ],
                },
                //穿梭框
                optionChoiceCondition:'',   //选择条件标题(穿梭框)
                choiceCondition:false,
                conditionList: {},
                conditionValue: [],
                //选择仓库
                warehouseCheckedList: [],
                //弹窗表单验证
                Rules: {
                    rule_name: [{required: true,message: '带*号为必填项',trigger: 'blur'},{max:20,message:'不能超过最大长度'}],
                    platform_code: [{required: true,message: '带*号为必填项',trigger: 'blur'}],
                    status: [{required: true,message: '带*号为必填项',trigger: 'blur'}],
                    order_profit_value:[{pattern: /^(([1-9][0-9]+)||[1-9])((\.[0-9][0-9])||\.[0-9])?$/,message: '只能为正实数，且只保留小数点后两位！'}],
                    priority: [{required: true,message: '带*号为必填项',trigger: 'blur'}],
                    dispute_type: [{required: true,message: '此项为必填项',trigger: 'blur'}],
                    department_id: [{required: true,message: '此项为必填项',trigger: 'blur'}],
                    reason_id: [{required: true,message: '此项为必填项',trigger: 'blur'}],
                    dispute_reason: [{required: true,message: '带*号为必填项',trigger: 'blur'}],
                },
                ruleEb:{
                    dispute_type: [{required: true,message: '此项为必填项',trigger: 'blur'}],
                    department_id: [{required: true,message: '此项为必填项',trigger: 'blur'}],
                    reason_id: [{required: true,message: '此项为必填项',trigger: 'blur'}],
                    dispute_reason: [{required: true,message: '带*号为必填项',trigger: 'blur'}],
                },
                dialog:{
                    isShowLogShow: false
                },
                logTable: {
                    tableKey: ['操作日志', '操作人', '操作时间'],
                    tableProps: ['content', 'created_by', 'created_at' ],
                    tableWidth: []
                },
                dialogData:{showLogTableData: []},
            }
        },
        computed: {
            // ...mapGetters([
            //     'queryParamsInfo',
            //     'automationAfterSaleRuleInfo'
            // ]),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
        methods:{
            // ...mapActions([
            //     'GetAutomationAfterSaleRuleListInfo',
            // ]),
            getAutomationAfterSaleRuleListInfo,
            addAutomationAfterSaleRule,
            editAutomationAfterSaleRule,
            deleteAutomationAfterSaleRule,
            getdropDownData,
            getAutomationAfterSaleRuleData,
            getThirdStageData,
            getLog,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                if (isSave) {
                    // this.queryData = JSON.parse(this.queryParamsInfo['automation_after_Sale_Rule']);
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
                this.getAutomationAfterSaleRuleListInfo(obj).then(({data}) => {
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
                //     key: 'automation_after_Sale_Rule',
                //     value: JSON.stringify(this.queryData)
                // });
                //列表数据渲染
                this.tableData = data.data_list.values;
                this.platformCodeList = data.data_list.drop_down_box.platform_code;
                this.ERPCheckedData = data.data_list.drop_down_box.order_status;
                this.ERPArr = Object.keys(this.ERPCheckedData);
                this.SKUCheckedData = data.data_list.drop_down_box.sku_status;
                this.SKUArr = Object.keys(this.SKUCheckedData);
                this.tableProps = [/*"id",*/"rule_name","platform_code","rule_description","status","create_by","create_time","operation"];
                this.tableWidth = [/*'60',*/ '220', '100', '800', '60 ', '100', '150', ''];
                //渲染分页
                this.pageData.currentList = data.page_data.limit * 1;  //每页条数
                this.pageData.currentPage = data.page_data.offset * 1;  // 前往页
                this.pageData.currentTotal = data.page_data.total * 1;  //总数

                // 重置表格高度
                this.searchHeight = !this.searchHeight;
            },

            // 重置
            // handleResetQueryInfo(){
            //     this.queryData = {
            //         mainQuery: {}
            //     }
            // },

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
                // if (!this.isAddShow&&!this.innerVisible&&!this.SKUInnerVisible ) {
                    this.isAddShow = false;
                    //sku/erp弹窗数据清空
                    this.ERPcheckedList = [];
                    this.SKUcheckedList = [];
                    this.typeCheckedList = [];
                    this.warehouseCheckedList = [];
                    this.warehouse = [];
                    this.isIndeterminate_ERP = false;
                    this.isIndeterminate_SKU = false;
                    this.isIndeterminate_type = false;
                    this.addObj = {
                        rule_name:"",
                        platform_code:"AMAZON",
                        aftersale_type:"",
                        status:"",
                        id:"",
                        priority:"",
                        rules:[
                        {
                                platform_reason_code: "",
                                erp_order_status: "",
                                sku_status: "",
                                order_profit_cond: "",
                                order_profit_value: "",
                                department_id: "",
                                reason_id: "",
                                formula_id:""
                            }
                        ],
                        ruleEb:[
                        {
                                dispute_type: "",
                                dispute_reason:"",
                                order_return_type:"",
                                erp_order_status: "",
                                sku_status: "",
                                order_profit_cond: "",
                                order_profit_value: "",
                                department_id: "",
                                reason_id: "",
                                formula_id:""
                            }
                        ],
                    };
                    this.$refs['addObj'].resetFields();
                //}
            },

            //编辑数据
            handleCompileData(row){
                this.getAutomationAfterSaleRuleData({
                    id:row.id,
                }).then(({data})=>{
                    //责任部门id
                    this.departmentId = data.data_list.rule_list[0].department_id,
                    //编辑数据
                    this.addObj.id = data.data_list.detail_data.values[0].id;
                    this.addObj.rule_name = data.data_list.detail_data.values[0].rule_name;
                    this.addObj.platform_code = data.data_list.detail_data.values[0].platform_code;
                    this.addObj.aftersale_type = data.data_list.detail_data.values[0].aftersale_type;
                    this.addObj.status = data.data_list.detail_data.values[0].status;
                    this.addObj.priority = data.data_list.detail_data.values[0].priority;
                    if(data.data_list.detail_data.values[0].platform_code!='EB'){
                        this.addObj.rules = [
                            {
                                platform_reason_code:data.data_list.rule_list[0].platform_reason_code,
                                erp_order_status:data.data_list.rule_list[0].erp_order_status,
                                sku_status:data.data_list.rule_list[0].sku_status,
                                order_profit_cond:data.data_list.rule_list[0].order_profit_cond=='0'?'':data.data_list.rule_list[0].order_profit_cond,
                                order_profit_value:data.data_list.rule_list[0].order_profit_value,
                                department_id:data.data_list.rule_list[0].department_id,
                                reason_id:data.data_list.rule_list[0].reason_id,
                            }
                        ]
                        if(this.addObj.rules[0].erp_order_status)this.ERPcheckedList = this.addObj.rules[0].erp_order_status.split(",");
                        if(this.addObj.rules[0].sku_status)this.SKUcheckedList = this.addObj.rules[0].sku_status.split(",");
                    }else if(data.data_list.detail_data.values[0].platform_code=='EB'){
                        this.addObj.ruleEb = [
                            {
                                dispute_type: data.data_list.rule_list[0].dispute_type,
                                dispute_reason:data.data_list.rule_list[0].dispute_reason,
                                order_return_type: data.data_list.rule_list[0].order_return_type,
                                erp_order_status: data.data_list.rule_list[0].erp_order_status,
                                sku_status: data.data_list.rule_list[0].sku_status,
                                order_profit_cond: data.data_list.rule_list[0].order_profit_cond=='0'?'':data.data_list.rule_list[0].order_profit_cond,
                                order_profit_value: data.data_list.rule_list[0].order_profit_value,
                                department_id: data.data_list.rule_list[0].department_id,
                                reason_id: data.data_list.rule_list[0].reason_id,
                                warehouse: data.data_list.rule_list[0].warehouse,
                            }
                        ]
                        if(this.addObj.ruleEb[0].erp_order_status)this.ERPcheckedList = this.addObj.ruleEb[0].erp_order_status.split(",");
                        if(this.addObj.ruleEb[0].sku_status)this.SKUcheckedList = this.addObj.ruleEb[0].sku_status.split(",");
                        if(this.addObj.ruleEb[0].order_return_type)this.typeCheckedList = this.addObj.ruleEb[0].order_return_type.split(",");
                        if(this.addObj.ruleEb[0].warehouse)this.warehouseCheckedList = this.addObj.ruleEb[0].warehouse.split(",");
                    }
                    this.getdropDownData({
                        platform_code:row.platform_code,
                    }).then(({data})=>{
                        this.platformRefundList = data.data_list[15];
                        if(this.addObj.platform_code=='AMAZON'){
                            this.dutyDepartmentList = data.data_list[38];
                            // this.dutyDepartmentList = data.data_list[1];
                        }else if(this.addObj.platform_code=='EB'){
                            this.dutyDepartmentList = data.data_list[39];
                            // this.dutyDepartmentList = data.data_list[21];
                        }
                    });
                    this.handleSKUERPStyleChage();
                    //原因类别
                    this.getThirdStageData({parent_id:this.departmentId}).then(({data})=>{
                        this.causeClassList = data.data_list;
                    })
                });
            },

            //点击编辑按钮
            compile(row){
                this.handleCompileData(row);
                this.isAddShow = true;
                this.isModifyShow = false;
            },

            // 点击弹窗确认回调
            dialogConfirm() {
                this.$refs['addObj'].validate((res) => {
                    if(res) {
                        let newObj = {};
                        if(this.addObj.platform_code!='EB'){
                            let jsonObj_amazon = JSON.stringify(this.addObj.rules);
                            newObj = {
                                rule_name:this.addObj.rule_name,
                                platform_code:this.addObj.platform_code,
                                aftersale_type:this.addObj.aftersale_type,
                                status:this.addObj.status,
                                id:this.addObj.id,
                                priority:this.addObj.priority,
                                rules: jsonObj_amazon
                            };
                        }else if(this.addObj.platform_code=='EB'){
                            let jsonObj_ebay = JSON.stringify(this.addObj.ruleEb);
                            newObj = {
                                rule_name:this.addObj.rule_name,
                                platform_code:this.addObj.platform_code,
                                aftersale_type:this.addObj.aftersale_type,
                                status:this.addObj.status,
                                id:this.addObj.id,
                                priority:this.addObj.priority,
                                rules: jsonObj_ebay
                            };
                        }
                        if(this.isModifyShow) {
                            this.addAutomationAfterSaleRule(newObj).then(({ data }) => {
                                this.succeedCallBack(data);
                            })
                        }else {
                            this.editAutomationAfterSaleRule(newObj).then(({ data }) => {
                                this.succeedCallBack(data);
                            })
                        };
                    }
                })
            },

            //操作成功回调
            succeedCallBack(data) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleQueryInfo({...this.queryData.mainQuery}, true);
                        //this.isAddShow = false;
                        this.cancel();

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
                    this.deleteAutomationAfterSaleRule({id}).then(({ data }) => {
                        this.succeedCallBack(data);
                    })
                })
            },

            //新增
            AddData(){
                this.getdropDownData({platform_code:this.addObj.platform_code,}).then(({data})=>{
                    this.platformRefundList = data.data_list[15];
                    if(this.addObj.platform_code=='AMAZON'){
                        // this.dutyDepartmentList = data.data_list[1];
                        this.dutyDepartmentList = data.data_list[38];
                    }else if(this.addObj.platform_code=='EB'){
                        // this.dutyDepartmentList = data.data_list[21];
                        this.dutyDepartmentList = data.data_list[39];
                    }
                    // this.ReasonsDisputes = data.data_list[19];
                })
                this.ERPcheckedList = [];
                this.SKUcheckedList = [];
                this.typeCheckedList = [];
                this.warehouseCheckedList = [];
                this.isAddShow = true;
                this.isModifyShow = true;
                this.ERPAll = false;
                this.SKUAll = false;
                this.typeAll = false;
                this.addObj.status = "1";
                this.addObj.aftersale_type = "1"

            },

            //全选(ERP/SKU)
            ERPSKUCheckAll(val) {
                if (this.innerVisible) {
                    this.ERPcheckedList = val ? this.ERPArr : [];
                    this.isIndeterminate_ERP = false;
                } else if(this.SKUInnerVisible){
                    this.SKUcheckedList = val ? this.SKUArr : [];
                    this.isIndeterminate_SKU = false;
                } else if(this.orderReturnTypeVisible){
                    this.typeCheckedList = val ? this.typeArr : [];
                    this.isIndeterminate_type = false;
                }
            },

            // 点击选择状态确认
            handleSelectStatusConfirm(str) {
                if(str==='ERP'){
                    this.addObj.rules[0].erp_order_status = this.ERPcheckedList.join(",");
                    this.addObj.ruleEb[0].erp_order_status = this.ERPcheckedList.join(",");
                    this.handleEPRSKUCancel(true,'ERP');
                }else if(str==='SKU'){
                    this.addObj.rules[0].sku_status = this.SKUcheckedList.join(",");
                    this.addObj.ruleEb[0].sku_status = this.SKUcheckedList.join(",");
                    this.handleEPRSKUCancel(true,'SKU');
                }else if(str==='type'){
                    this.addObj.rules[0].order_return_type = this.typeCheckedList.join(",");
                    this.addObj.ruleEb[0].order_return_type = this.typeCheckedList.join(",");
                    this.handleEPRSKUCancel(true,'type');
                }
            },

            //ERP SKU订单状态弹窗关闭
            handleEPRSKUCancel(bool,str){
                // if(str==='ERP'){
                //     this.innerVisible = false;
                //     // if(!this.isERPchecked){
                //     //     this.ERPcheckedList = [];
                //     //     this.ERPAll = false;
                //     //     this.isIndeterminate_ERP = false;
                //     // }
                // }else if(str==='SKU'){
                //     this.SKUInnerVisible = false;
                //     // if(!this.isSKUchecked){
                //     //     this.SKUcheckedList = [];
                //     //     this.SKUAll = false;
                //     //     this.isIndeterminate_SKU = false;
                //     // }
                // }else if(str==='type'){
                //     this.orderReturnTypeVisible = false;
                //     // if(!this.isTypechecked){
                //     //     this.typeCheckedList = [];
                //     //     this.typeAll = false;
                //     //     this.isIndeterminate_type = false;
                //     // }
                // }
                this.ERPcheckedList = [];
                this.SKUcheckedList = [];
                this.typeCheckedList = [];
                this.innerVisible = false;
                this.orderReturnTypeVisible = false;
                this.SKUInnerVisible = false;
                this.isAddShow = true;                
            },

            //erp/sku全选样式变化
            handleCheckedERPChange(value){
                if (this.innerVisible) { 
                    let ERPcheckedCount = value.length;
                    this.ERPAll = ERPcheckedCount == this.ERPArr.length;
                    this.isIndeterminate_ERP = ERPcheckedCount > 0 && ERPcheckedCount < this.ERPArr.length;
                } else if(this.SKUInnerVisible){
                    let SKUcheckedCount = value.length;
                    this.SKUAll = SKUcheckedCount == this.SKUArr.length;
                    this.isIndeterminate_SKU = SKUcheckedCount > 0 && SKUcheckedCount < this.SKUArr.length;
                } else if(this.orderReturnTypeVisible){
                    let typeCheckedCount = value.length;
                    this.typeAll = typeCheckedCount == this.typeArr.length;
                    this.isIndeterminate_type = typeCheckedCount > 0 && typeCheckedCount < this.typeArr.length;
                }
            },

            //原因类别
            handleDutyDepartmentChange(val){
                this.addObj.ruleEb[0].reason_id = "";
                this.addObj.rules[0].reason_id = "";
                this.getThirdStageData({parent_id:val}).then(({data})=>{
                    this.causeClassList = data.data_list;
                })
            },
            // 日志
            handleOperateDiary(row){
                this.getLog({
                    id:row.id,
                    modules:"aftersale_rule"
                }).then(({data})=>{
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess);
                        return
                    }
                    this.dialogData.showLogTableData = data.data_list.data.values;
                    this.dialog.isShowLogShow = true
                });
            },

            //订单利润输入金额限制
            // handleInputAstrict(val){
            //    if (val >= 0) {
            //        this.addObj.rules[0].order_profit_value = val
            //    } else {
            //        this.addObj.rules[0].order_profit_value = ""
            //        this.$message.warning('请输入大于或等于0数字');
            //    }
            // },

            //编辑时全选样式变化
            handleSKUERPStyleChage(){
                //ERP编辑时全选样式变化
                // this.addObj.rules[0].erp_order_status==null?this.ERPcheckedList = []:this.ERPcheckedList = this.addObj.rules[0].erp_order_status.split(",");
                if (this.ERPcheckedList.length == 17) {
                    this.ERPAll = true;
                    this.isIndeterminate_ERP = false;
                } else if(this.ERPcheckedList.length>0&&this.ERPcheckedList.length<17) {
                    this.ERPAll = false;
                    this.isIndeterminate_ERP = true;
                }else{
                    this.ERPAll = false;
                    this.isIndeterminate_ERP = false;
                }
                //SKU编辑时全选样式变化
                // this.addObj.rules[0].sku_status==null?this.SKUcheckedList = []:this.SKUcheckedList = this.addObj.rules[0].sku_status.split(",");
                if (this.SKUcheckedList.length == 24) {
                    this.SKUAll = true;
                    this.isIndeterminate_SKU = false;
                } else if(this.SKUcheckedList.length>0&&this.SKUcheckedList.length<24) {
                    this.SKUAll = false;
                    this.isIndeterminate_SKU = true;
                }else{
                    this.SKUAll = false;
                    this.isIndeterminate_SKU = false;
                }
                //订单退件类型编辑时全选样式变化
                // this.addObj.rules[0].order_return_type==null?this.typeCheckedList = []:this.typeCheckedList = this.addObj.rules[0].order_return_type.split(",");
                if (this.typeCheckedList.length == 8) {
                    this.typeAll = true;
                    this.isIndeterminate_type = false;
                } else if(this.typeCheckedList.length>0&&this.typeCheckedList.length<8) {
                    this.typeAll = false;
                    this.isIndeterminate_type = true;
                }else{
                    this.typeAll = false;
                    this.isIndeterminate_type = false;
                }
            },

            //点击ERP选择状态按钮
            handleClickERPBtn(){
                if(this.addObj.platform_code==='AMAZON'){
                    if(this.addObj.rules[0].erp_order_status.length)this.ERPcheckedList = this.addObj.rules[0].erp_order_status.split(',');
                }else if(this.addObj.platform_code==='EB'){
                    if(this.addObj.ruleEb[0].erp_order_status.length)this.ERPcheckedList = this.addObj.ruleEb[0].erp_order_status.split(',');
                }
                this.innerVisible = true;
                //this.isAddShow = false
            },

            //点击SKU选择状态按钮
            handleClickSKUBtn(){
                if(this.addObj.platform_code==='AMAZON'){
                    if(this.addObj.rules[0].sku_status.length)this.SKUcheckedList = this.addObj.rules[0].sku_status.split(',');
                }else if(this.addObj.platform_code==='EB'){
                    if(this.addObj.ruleEb[0].sku_status.length)this.SKUcheckedList = this.addObj.ruleEb[0].sku_status.split(',');
                }
                this.SKUInnerVisible = true;
               //this.isAddShow = false
            },
            
            //点击订单退件类型选择类型按钮
            handleClickTypeBtn(){
                if(this.addObj.platform_code==='AMAZON'){
                    if(this.addObj.rules[0].order_return_type.length)this.typeCheckedList = this.addObj.rules[0].order_return_type.split(',');
                }else if(this.addObj.platform_code==='EB'){
                    if(this.addObj.ruleEb[0].order_return_type.length)this.typeCheckedList = this.addObj.ruleEb[0].order_return_type.split(',');
                }
                this.orderReturnTypeVisible = true;
            },

            // 选择条件信息弹窗
            choiceConditionOption(mode){
                this.optionChoiceCondition = mode;
                this.conditionValue = [];
                this.conditionList = {};
                let arr = [];
                if( !this.addObj.platform_code ){
                    this.$message.warning('请先选择平台！');
                    return;
                }
                switch(mode){
                    case "选择仓库":
                        this.titleArr=['全部仓库', '所选仓库'];
                        this.conditionValue = [...this.warehouseCheckedList];
                        getWarehouseOptionList().then(({data}) => {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败');
                                return;
                            }
                            this.conditionList = data.data_list.values;
                            this.choiceCondition = true;
                            this.$forceUpdate();
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
                    case "选择仓库":
                        this.warehouseCheckedList = [...this.conditionValue];
                        this.addObj.ruleEb[0].warehouse = this.conditionValue.join(',');
                        break;
                };
                this.choiceCondition = false;
            },
        },
        created() {
            this.OrderReturnType.forEach(element => {
                this.typeArr.push(element.id);
            });
            // try {
            //     if (this.$route.query._cacheType === '1' || JSON.stringify(this.automationAfterSaleRuleInfo) === '{}') {
            //         //初始化每页条数设置
            //         // this.handleQueryInfo();
            //     } else {
            //         // 获取保存的查询参数
            //         this.queryData = JSON.parse(this.queryParamsInfo['automation_after_Sale_Rule']);
            //         this.handleQueryInfoCallBack(this.automationAfterSaleRuleInfo);
            //     }
            // } catch (e) {
            //     console.log(e)
            // }
        },
    }
</script>

<style lang="less" scoped>
    /deep/.ui-layout_edit-dialog .el-input,.ui-layout_edit-dialog .el-select{
        width: 150px ;
        }
   //选择状态弹窗
    .ERPSKU_P{
        float: left;
        margin-right: 10px;
        width:160px;
        margin-top: 20px;
    }
    .ERPSKUBox:after{
        display: block;
        clear: both;
        content:""
    }
    //弹窗上部
    .dialog_top{
        border: 1px solid #ebeef5;
        margin-bottom:15px;
        border-bottom: 0px;
    }
    .dialog_top {
        /deep/.el-collapse-item__header{
            height:30px;
            background-color:#F3F3F3;
            font-family: "Microsoft YaHei","微软雅黑";
            font-size: 12px;
            line-height: 30px;
            font-style: normal;
            font-weight: 700;
            padding-left: 20px;
            margin-bottom:15px;
        /deep/.el-collapse-item__arrow {
            line-height: 30px;
        }
        }
    }
    //弹窗下部
    .dialog_bottom{
        border: 1px solid #ebeef5;
        margin-bottom:10px;
        border-bottom: 0px;
    }
    .dialog_bottom {
        /deep/.el-collapse-item__header{
            height:30px;
            background-color:#F3F3F3;
            font-family: "Microsoft YaHei","微软雅黑";
            font-size: 12px;
            line-height: 30px;
            font-style: normal;
            font-weight: 700;
            margin-bottom:15px;
            padding-left: 20px;
        /deep/.el-collapse-item__arrow {
            line-height: 30px;
        }
        }
    }
    .bottom_table{
        width:1065px;
        border: 1px solid #ebeef5;
        margin-left:20px;
        margin-right:20px;
        border-right: 0px;
        font-size: 12px;
    }
    .tr_title td{
       width:15%;
       height:30px;
       text-align: center;
       border-bottom: 1px solid #ebeef5;
       border-right: 1px solid #ebeef5;
       background-color:#F3F3F3;
   }
   .tr_content td{
       width:15%;
       height:80px;
       text-align: center;
       border-right: 1px solid #ebeef5;
   }

   .tr_content{
       /deep/.el-button{
           font-size: 12px;
       }
   }
   //气泡
   /deep/.el-popover{
       font-size: 12px !important;
       line-height: 1.8 !important;
       color: #333333 !important;
   }

   //弹窗遮罩
   /deep/.v-modal{
       z-index: none;
   }
   .top_header{
       /deep/.el-input.el-input--small{
           width: 240px;
           .el-input__inner{
               padding-right: 55px;
           }
       }
   }
   .bottom_header{
       .bottom_table_eb{
           margin-left: 20px;
           table{
                border-right: 1px solid #e6e6e6;
                border-bottom: 1px solid #e6e6e6;
                word-wrap:break-word;
                word-break:break-all;
                font-weight: 100;
                color: #333333;
                td{
                    border-top: 1px solid #e6e6e6;
                    border-left: 1px solid #e6e6e6;
                    padding: 5px 5px;
                    .el-radio{
                        line-height: 40px;
                    }
                    .inputNumber{
                        /deep/.el-input.el-input--mini{
                            width: 100%;                        }
                    }
                }
           }
       }
   }
   /deep/.choiceCondition{
        .el-dialog__body{
            padding: 0;
            .el-tabs__item.is-top.is-active{
                background-color: #3F9EFD;
                color: #FAFAFA;
                border-top-right-radius: 8px;
                border-top-left-radius: 8px;
            }
            .el-tabs--border-card{
                .el-tabs__content{
                    padding: 0;
                }
            }
            .el-tabs__nav-scroll{
                background-color: white;
                .el-tabs__item{
                    font-size:12px;
                }
            }
            table{
                width: 100%;
                font-size: 12px;
                td{
                    height:100px;
                    border-right: 1px solid #ECECEC;
                    border-bottom: 1px solid #ECECEC;
                    .el-radio{
                        margin-left: 0;
                    }
                }
            }
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
</style>