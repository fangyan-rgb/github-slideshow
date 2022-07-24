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
                <el-button v-if="buttonList['newAdd'].permit(thisVm)" type="text" size="small" @click="sendFormDialog = true;templateChange('AMAZON');"><i class="icon-xinzeng1" style="color: #75b1fc"></i>新增</el-button>
                <el-button v-if="buttonList['batchDelete'].permit(thisVm)" type="text" size="small" @click="batchDeleteData"><i class="icon-shanchu1" style="color: #fa686c"></i>批量删除</el-button>
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
                    <el-button type="text"  size="small" @click="editSendFormFn(scope.row)" v-if="buttonList['edit'].permit(thisVm)">编辑</el-button>
                    <ComDivide/>
                    <el-button type="text"  size="small" @click="deleteData(scope.row)" v-if="buttonList['delete'].permit(thisVm)">删除</el-button>

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
                <!-- 选择条件 -->
                <template slot="condition_list" slot-scope="scope">
                    <div>
                        <el-popover
                            placement="top"
                            width="260"
                            @after-enter="isBlur=scope.$index"
                            @hide="isBlur=-1"
                            :open-delay='200'
                            trigger="hover">
                            <div v-for="(v, k, i) in (scope.row.condition_list || {})" :key="i">
                                {{v}}
                            </div>
                            <a href="javascript:;" slot="reference" :class="{optionConditions: isBlur==scope.$index}" class="optionCondition">
                                <div v-if="i<4" v-for="(v, i) in (scope.row.condition_list || {})" :key="i">
                                    {{v}}
                                </div>
                            </a>
                        </el-popover>
                    </div>
                </template>

                <template slot="status" slot-scope="scope">
                    <span class="ui-state_circle greenColor" v-if="scope.row.status == 1"></span>
                    <span class="ui-state_circle redColor" v-if="scope.row.status == 0"></span>
                    <span v-html="scope.row.status == 0?'停用':'启用'"></span>
                </template>
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
        <!-- 点击新增/编辑弹窗 new -->
        <el-dialog
            class="ui-layout_edit-dialog"
            :title="sendForm.id ? '自动发信规则编辑配置' : '自动发信规则新增配置'"
            width="1350px"
            top="3vh"
            :visible.sync="sendFormDialog"
            @close="sendFormCloseFn()">
            <div>
                <el-form :model="sendForm" :rules="formRules" ref="sendForm" size="small" label-width="126px">
                    <div class="configureInfoMain">
                        <el-form-item label="所属平台：" label-width="78px" prop="platform_code">
                            <el-select
                                filterable v-filter
                                size="small"
                                v-model="sendForm.platform_code"
                                @change="(v)=>templateChange(v,true)">
                                <el-option
                                    v-for="(item,key,index) in configureType.platformCodeList"
                                    :key="index"
                                    :label="key"
                                    :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-collapse  v-model="activeNames">
                            <div class="configureInfo">
                                <!-- 左侧条件 -->
                                <div class="configureInfoLeft">
                                    <el-collapse-item title="选择条件" class="headerInfoScrollTop" name="1">

                                        <template>
                                            <table class="configureInfoLeftTable" cellspacing="0" cellpadding="0">
                                                <tr class="hasBg">
                                                    <th width="337" colspan="2">条件字段</th>
                                                    <th>条件结果</th>
                                                </tr>
                                                <tr>
                                                    <td width="88" :rowspan="sendForm.platform_code==='AMAZON'?10:9" class="hasBg">选择条件</td>
                                                    <!-- <td width="88" class="hasBg">平台账号</td> -->
                                                    <td width="200">
                                                        <el-checkbox v-model="conditionForm['info.account_id'].check">指定账号</el-checkbox>
                                                    </td>
                                                    <td>
                                                        <el-button type="text" size="small" @click="choiceConditionOption('选择账号')" :disabled="!conditionForm['info.account_id'].check">选择账号</el-button>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="conditionForm['info.account_id'].number">已选择{{conditionForm['info.account_id'].number}}个</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <!-- <td width="88" rowspan="3" class="hasBg">物流</td> -->
                                                    <td width="200">
                                                        <el-checkbox v-model="conditionForm['info.warehouse_id'].check">指定仓库</el-checkbox>
                                                    </td>
                                                    <td>
                                                        <el-button type="text" size="small" @click="choiceConditionOption('选择仓库')" :disabled="!conditionForm['info.warehouse_id'].check">选择仓库</el-button>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="conditionForm['info.warehouse_id'].number">已选择{{conditionForm['info.warehouse_id'].number}}个</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="200">
                                                        <el-checkbox v-model="conditionForm['info.ship_code'].check">指定邮寄方式</el-checkbox>
                                                    </td>
                                                    <td>
                                                        <el-button type="text" size="small" @click="choiceConditionOption('选择邮寄方式')" :disabled="!conditionForm['info.ship_code'].check">选择邮寄方式</el-button>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="conditionForm['info.ship_code'].number">已选择{{conditionForm['info.ship_code'].number}}个</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="200">
                                                        <el-checkbox v-model="conditionForm['info.ship_country'].check">指定买家收货国家</el-checkbox>
                                                    </td>
                                                    <td>
                                                        <el-button type="text" size="small" @click="choiceConditionOption('选择国家')" :disabled="!conditionForm['info.ship_country'].check">选择国家</el-button>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="conditionForm['info.ship_country'].number">已选择{{conditionForm['info.ship_country'].number}}个</span>
                                                    </td>
                                                </tr>
                                                <tr v-if="sendForm.platform_code==='AMAZON'">
                                                    <td width="200">
                                                        <el-checkbox v-model="conditionForm['info.amazon_fulfill_channel'].check">订单类型</el-checkbox>
                                                    </td>
                                                    <td>
                                                        <el-radio v-model="sendForm.order_type" label="FBA" :disabled="!conditionForm['info.amazon_fulfill_channel'].check">FBA</el-radio>
                                                        <el-radio v-model="sendForm.order_type" label="FBM" :disabled="!conditionForm['info.amazon_fulfill_channel'].check">FBM</el-radio>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td width="200">
                                                        <el-checkbox v-model="conditionForm['info.site'].check">站点</el-checkbox>
                                                    </td>
                                                    <td class="exclude">
                                                        <el-checkbox-group v-model="conditionForm['info.site'].option_value">
                                                            <el-checkbox v-for="(item,key) in siteInfo" :label="item" :key="key" style="margin-right:16px;" :disabled="!conditionForm['info.site'].check"></el-checkbox>
                                                        </el-checkbox-group>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="200">
                                                        <el-checkbox v-model="conditionForm['info.order_amount'].check">订单金额</el-checkbox>
                                                    </td>
                                                    <td>
                                                        <el-input  size="mini" style="width:100px;" v-model.trim="conditionForm['info.order_amount'].min" :disabled="!conditionForm['info.order_amount'].check"></el-input> ——
                                                        <el-input  size="mini" style="width:100px;" v-model.trim="conditionForm['info.order_amount'].max" placeholder="最大金额" :disabled="!conditionForm['info.order_amount'].check"></el-input>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><el-checkbox v-model="conditionForm['product.SKU'].check">SKU</el-checkbox></td>
                                                    <td>
                                                        <el-input v-model.trim="sendForm.sku" size="mini" placeholder="多个SKU编码用英文逗号“,”隔开" :disabled="!conditionForm['product.SKU'].check"></el-input>
                                                        <el-select  size="mini" v-model="sendForm.sku_type"  class="option_value_type" :disabled="!conditionForm['product.SKU'].check">
                                                            <el-option
                                                                v-for="(value,key) in includeList"
                                                                :key="key"
                                                                :label="value"
                                                                :value="key">
                                                            </el-option>
                                                        </el-select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="200">
                                                        <div v-if="sendForm.platform_code==='AMAZON'"><el-checkbox v-model="conditionForm['product.asin'].check">Asin</el-checkbox></div>
                                                        <div v-if="sendForm.platform_code==='EB'"><el-checkbox v-model="conditionForm['product.item'].check">item ID</el-checkbox></div>
                                                    </td>
                                                    <td>
                                                        <div v-if="sendForm.platform_code==='AMAZON'">
                                                            <el-input v-model.trim="sendForm.asin" size="mini" placeholder="多个Asin编码用英文逗号“,”隔开" :disabled="!conditionForm['product.asin'].check"></el-input>
                                                            <el-select  size="mini" v-model="sendForm.asin_type"  class="option_value_type" :disabled="!conditionForm['product.asin'].check">
                                                                <el-option
                                                                    v-for="(value,key) in includeList"
                                                                    :key="key"
                                                                    :label="value"
                                                                    :value="key">
                                                                </el-option>
                                                            </el-select>
                                                        </div>
                                                        <div v-if="sendForm.platform_code==='EB'">
                                                            <el-input v-model.trim="sendForm.item_id" size="mini" placeholder="多个item ID编码用英文逗号“,”隔开" :disabled="!conditionForm['product.item'].check"></el-input>
                                                            <el-select  size="mini" v-model="sendForm.item_id_type"  class="option_value_type" :disabled="!conditionForm['product.item'].check">
                                                                <el-option
                                                                    v-for="(value,key) in includeList"
                                                                    :key="key"
                                                                    :label="value"
                                                                    :value="key">
                                                                </el-option>
                                                            </el-select>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="200">
                                                        <el-checkbox v-model="conditionForm['product.buyer_id'].check">买家ID</el-checkbox>
                                                    </td>
                                                    <td>
                                                        <el-input v-model.trim="sendForm.buyer_id" size="mini" placeholder="多个买家ID编码用英文逗号“,”隔开" :disabled="!conditionForm['product.buyer_id'].check"></el-input>
                                                        <el-select  size="mini" v-model="sendForm.buyer_id_type"  class="option_value_type" :disabled="!conditionForm['product.buyer_id'].check">
                                                            <el-option
                                                                v-for="(value,key) in includeList"
                                                                :key="key"
                                                                :label="value"
                                                                :value="key">
                                                            </el-option>
                                                        </el-select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="88" class="hasBg" :rowspan="sendForm.platform_code==='AMAZON'?'4':'3'">排除条件</td>
                                                    <td width="200">
                                                        <div v-if="sendForm.platform_code==='AMAZON'"><el-checkbox v-model="conditionForm['exclude_review'].check">已留过评价Review的订单</el-checkbox></div>
                                                        <div v-if="sendForm.platform_code==='EB'"><el-checkbox v-model="conditionForm['exclude_evaluate'].check">已留过评价的订单</el-checkbox></div>
                                                    </td>
                                                    <td class="exclude">
                                                        <div v-if="sendForm.platform_code==='AMAZON'">
                                                            <el-form-item label="排除：" label-width="50px">
                                                                <el-checkbox :indeterminate="exclude_review.isIndeterminate" v-model="exclude_review.checkAll" @change="(val)=>handleCheckAllChange(val,'exclude_review')" style="float:left;" :disabled="!conditionForm['exclude_review'].check">全选</el-checkbox>
                                                                <el-checkbox-group v-model="conditionForm['exclude_review'].option_value" style="float:left;" @change="(val)=>handleCheckedCitiesChange(val,'exclude_review')">
                                                                    <el-checkbox v-for="(value,key) in starClass" :label="key" :key="key" :disabled="!conditionForm['exclude_review'].check">{{value}}</el-checkbox>
                                                                </el-checkbox-group>
                                                            </el-form-item>
                                                        </div>
                                                        <div v-if="sendForm.platform_code==='EB'">
                                                            <el-form-item label="排除：" label-width="50px">
                                                                <el-checkbox :indeterminate="exclude_evaluate.isIndeterminate" v-model="exclude_evaluate.checkAll" @change="(val)=>handleCheckAllChange(val,'exclude_evaluate')" style="float:left;" :disabled="!conditionForm['exclude_evaluate'].check">全选</el-checkbox>
                                                                <el-checkbox-group v-model="conditionForm['exclude_evaluate'].option_value" style="float:left;" @change="(val)=>handleCheckedCitiesChange(val,'exclude_evaluate')">
                                                                    <el-checkbox v-for="(value,key) in evaluate" :label="key" :key="key" :disabled="!conditionForm['exclude_evaluate'].check">{{value}}</el-checkbox>
                                                                </el-checkbox-group>
                                                            </el-form-item>
                                                        </div>
                                                        
                                                    </td>
                                                </tr>
                                                <tr v-if="sendForm.platform_code==='AMAZON'">
                                                    <td width="200">
                                                        <el-checkbox v-model="conditionForm['exclude_feedback'].check">已留过评价Feedback的订单</el-checkbox>
                                                    </td>
                                                    <td class="exclude">
                                                        <el-form-item label="排除：" label-width="50px">
                                                            <el-checkbox :indeterminate="exclude_feedback.isIndeterminate" v-model="exclude_feedback.checkAll" @change="(val)=>handleCheckAllChange(val,'exclude_feedback')" style="float:left;" :disabled="!conditionForm['exclude_feedback'].check">全选</el-checkbox>
                                                            <el-checkbox-group v-model="conditionForm['exclude_feedback'].option_value" style="float:left;" @change="(val)=>handleCheckedCitiesChange(val,'exclude_feedback')">
                                                                <el-checkbox v-for="(value,key) in starClass" :label="key" :key="key" :disabled="!conditionForm['exclude_feedback'].check">{{value}}</el-checkbox>
                                                            </el-checkbox-group>
                                                        </el-form-item>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="200">
                                                        <el-checkbox v-model="conditionForm['exclude_dispute'].check">已产生纠纷的订单</el-checkbox>
                                                    </td>
                                                    <td>排除已产生纠纷的订单</td>
                                                </tr>
                                                <tr>
                                                    <td width="200">
                                                        <el-checkbox v-model="conditionForm['exclude_mail'].check">有往来邮件的订单</el-checkbox>
                                                    </td>
                                                    <td>
                                                        <el-input  size="mini" style="width:100px;" v-model.trim="sendForm.exclude_mail" :disabled="!conditionForm['exclude_mail'].check"></el-input>
                                                        天内同一买家只发送同一封邮件
                                                    </td>
                                                </tr>
                                            </table>
                                        </template>
                                    </el-collapse-item>
                                </div>
                                <!-- 右侧规则信息 -->
                                <div class="configureInfoRight">
                                    <el-collapse-item title="规则"  class="headerInfoScrollTopright" name="2">
                                        <el-form-item label="规则名称：" prop="rule_name">
                                            <el-input v-model.trim="sendForm.rule_name" size="small" placeholder="请输入内容,不能超过20个字符" class="rule_name" maxlength="20" show-word-limit></el-input>
                                        </el-form-item>
                                        <el-form-item label="优先级：" prop='priority' v-if="sendForm.platform_code==='AMAZON'">
                                            <el-input v-model.trim="sendForm.priority" size="small" placeholder="输入大于0的整数" @keyup.native="handleNumber(sendForm.priority)"></el-input>
                                        </el-form-item>
                                        <el-form-item label="状态：" prop="status">
                                            <template>
                                                <el-radio v-model="sendForm.status" label="1">启用</el-radio>
                                                <el-radio v-model="sendForm.status" label="0">停用</el-radio>
                                            </template>
                                        </el-form-item>
                                        <el-form-item label="有效期：" prop="survival_time_type">
                                            <template>
                                                <el-radio v-model="sendForm.survival_time_type" label="1">永久有效</el-radio>
                                                <el-radio v-model="sendForm.survival_time_type" label="2">时限内有效</el-radio>
                                                <div class="block" v-show="sendForm.survival_time_type === '2'">
                                                    <el-date-picker
                                                        v-model="sendForm.time"
                                                        type="datetimerange"
                                                        start-placeholder="开始日期"
                                                        end-placeholder="结束日期"
                                                        value-format="yyyy-MM-dd HH:mm:ss"
                                                        :default-time="['00:00:00', '23:59:59']"
                                                        style="width: 240px;">
                                                    </el-date-picker>
                                                </div>
                                            </template>
                                        </el-form-item>
                                        <el-form-item label="触发条件：" prop="execute_id">
                                            <el-select
                                                clearable
                                                filterable v-filter
                                                size="small"
                                                v-model="sendForm.execute_id">
                                                <el-option
                                                    v-for="(v, k, i) in optionListNew.execute_type"
                                                    :key="i"
                                                    :label="v"
                                                    :value="k">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>

                                        <el-form-item label="发送时间点：" prop="execute_time" ref="executeTime">
                                            <div style="color:#333;font-size:12px;">
                                                触发后 <el-input size="small" style="width:80px;" v-model.trim="sendForm.execute_time"></el-input> 天
                                                <el-input size="small" style="width:80px;" v-model.trim="sendForm.execute_hour" ref="execute_hour"></el-input> 时发送
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="规则执行类型：" prop="rule_exec_type">
                                            <template>
                                                <el-radio v-model="sendForm.rule_exec_type" label="1">满足所有条件</el-radio>
                                                <el-radio v-model="sendForm.rule_exec_type" label="2">满足任意条件</el-radio>
                                            </template>
                                        </el-form-item>
                                        <el-form-item label="选择模板：" prop="template_id">
                                            <el-select
                                                clearable
                                                filterable v-filter
                                                size="small"
                                                @change="handleOptinTemlate"
                                                v-model="sendForm.template_id">
                                                <el-option
                                                    v-for="(item,index) in configureType.maliTemplate"
                                                    :key="index"
                                                    :label="item.template_name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="标题：">
                                                <el-input size="small" v-model="template_title" disabled></el-input>
                                        </el-form-item>
                                        <el-form-item label="发信内容:" label-width="auto" >
                                                <el-input size="small" type="textarea" row="8" v-model="template_content" disabled></el-input>
                                        </el-form-item>
                                    </el-collapse-item>
                                </div>
                            </div>
                        </el-collapse>
                    </div>
                </el-form>
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
                    <!-- <div v-if="optionChoiceCondition !== '选择仓库'" style="height: 750px; overflow-y: auto; padding: 10px 20px;">
                        <el-checkbox-group v-model="conditionValue">
                            <el-checkbox v-for="(v, k, i) in conditionList" :label="k" :key="i" style="margin-left: 0; margin-right: 20px;">{{v}}</el-checkbox>
                        </el-checkbox-group>
                    </div> -->
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="sendFormDialog = false" size="small">取 消</el-button>
                <el-button @click="handleSendFormFn()" type="primary" size="small">确 定</el-button>
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
    import {
        getAutomationSendRuleListInfo,
        addEmailClassifyConfiguration,
        editEmailClassifyConfiguration,
        deleteAutomationSendRule,
        platformCodeInfo,
        maliTemplateInfo,
        triggerConditionInfo,
        getBuyerOptionList,
        getAccountOptionList,
        getWarehouseOptionList,
        getLogisticsOptionList,
        getCountryOptionList,
        editSendRule,
        getLogData,
        getRuleInfo,
    } from '../../../api/SystemManagement/GetAutomationSendRule'
    // import{
    //     mapGetters,
    //     mapActions
    // } from 'vuex';
    export default {
        name: 'AutomationSendRule',
        data () {
            var executeTime1 = (rule, value, callback) => {
                let hour = this.sendForm.execute_hour;
                if (value===''||value===null||hour===""||value===null) {
                    callback(new Error('不能为空'));
                }else{
                    let reg =  /(^[1-9]{1}[0-9]*$)|(^[0-9]$)/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入大于或等于零的整数'));
                    }else if(!reg.test(hour)){
                        callback(new Error('请输入大于或等于零的整数'));
                    }else{
                        callback();
                    }
                }
            };
            return {
                template_title:'',
                template_content:'',
                exclude_review:{
                    checkAll:false,
                    isIndeterminate:false
                },
                exclude_feedback:{
                    checkAll:false,
                    isIndeterminate:false
                },
                exclude_evaluate:{
                    checkAll:false,
                    isIndeterminate:false
                },
                starClass:{
                    '1':'一星',
                    '2':'二星',
                    '3':'三星',
                    '4':'四星',
                    '5':'五星'
                },
                evaluate:{
                    '1':'Postive',
                    '2':'Netural',
                    '3':'Negative',
                },
                siteInfo:{CA:'CA',MX:'MX',DE:'DE',IT:'IT',JP:'JP',FR:'FR',AU:'AU',ES:'ES',UK:'UK',US:'US'},
                allOptions:['1','2','3','4','5'],
                includeList:{1:"包含",2:"不包含"},
                isBlur: -1,
                thisVm: this,
                searchHeight: false,
                site:'',                     //站点信息
                orderType:'',               //订单类型
                asinCode:'',                //Asin编码
                checkedCities:[],           //所选中的选项
                optionChoiceCondition:'',   //选择条件标题
                choiceCondition:false,      //选择条件
                activeName:'1',
                //搜索框数据
                queryData: {
                    mainQuery: {}
                },
                activeNames:["1","2"],
                //列表数据
                tableKey: ["规则名称","所属平台","状态","优先级","关联模板名","创建人","创建时间","修改人","修改时间","选择条件","操作"],
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
                 //控制搜索配置弹窗显示隐藏
                isSearchShow:false,
                //勾选ID，用于批量删除
                selectId:"",
                //控制搜索框显示隐藏
                showSearch: true,
                //单选框
                radio:"true",
                //创建人
                createByList:[],
                //弹窗数据
                addObj:{
                    platform_code:"",
                    tag_name:"",
                    tag_describe:"",
                    shortcut_key:"",
                    status:'',
                    id:""
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
                    execute_type: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        }
                    ],
                    relation_id: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        }
                    ],
                    appointTimeSend: [
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
                },
                option:[],
                configureType:{
                    platformCodeList:[],     //平台选项
                    maliTemplate:[],        //邮件模板选项
                    triggerCondition:[],    //触发条件
                },
                configureInfo:{            //自动回信规则配置
                    platform_code:'',      //平台CODE
                    rule_name:'',          //规则名称
                    priority:'',          //优先级
                    relation_id:'',       //邮件模板id
                    execute_type:1,       //触发条件
                    is_timed:2,           //是否定时发送
                    survival_str_time:'', //有效期开始时间
                    urvival_end_time:'',  //有效期结束时间
                    rule_exec_type:'',    //规则执行类型
                    condition_by:'',//排除条件
                },
                limitedTime:[],//有限的时间
                timeShow:false,
                logTable: {
                    tableKey: ['操作日志', '操作人', '操作时间'],
                    tableProps: ['content', 'created_by', 'created_at' ],
                    tableWidth: []
                },
                dialog: {isShowLogShow: false},
                dialogData:{showLogTableData: []},

                // 规则新增编辑 new
                sendFormDialog: false,
                optionListNew: {
                    execute_type: {},
                    conditions: [],
                    condition_by: {},
                },
                sendForm: {
                    platform_code: 'AMAZON',
                    rule_name: '',
                    status: '',
                    priority: '',
                    survival_time_type:'',
                    relation_id: '',
                    execute_id: '',
                    template_id:'',
                    rule_exec_type:'',
                    account:'',
                    warehouse:'',
                    shipping_method:'',
                    receiving_country:'',
                    order_type:'',
                    site:'',
                    order_amount:'',
                    sku:'',
                    sku_type:'',
                    asin:'',
                    asin_type:'',
                    buyer_id:'',
                    buyer_id_type:'',
                    item_id: '',
                    item_id_type: '',
                    exclude_review:'',
                    exclude_feedback:'',
                    exclude_dispute:'',
                    exclude_mail:'',
                    execute_hour:'',
                    survival_str_time:'',
                    survival_end_time:'',
                    time: [],
                    execute_time: '',
                    exclude_evaluate: '',
                },
                conditionForm: {
                    'info.account_id': {
                        check: false,
                        option_value: [],
                        number:0
                    },
                    'info.warehouse_id': {
                        check: false,
                        option_value: [],
                        number:0
                    },
                    'info.ship_code': {
                        check: false,
                        option_value: [],
                        number:0,
                    },
                    'info.ship_country': {
                        check: false,
                        option_value: [],
                        number:0
                    },
                    'info.amazon_fulfill_channel': {
                        check: false,
                        option_value: ''
                    },
                    'info.site': {
                        check: false,
                        option_value: []
                    },
                    'info.order_amount': {
                        check: false,
                        min: '',
                        max:''
                    },
                    'product.SKU': {
                        check: false,
                        option_value: ''
                    },
                    'product.asin': {
                        check: false,
                        option_value: ''
                    },
                    'product.item': {
                        check: false,
                        option_value: ''
                    },
                    'product.buyer_id': {
                        check: false,
                        option_value: ''
                    },
                    'exclude_review':{
                        check: false,
                        option_value: []
                    },
                    'exclude_feedback':{
                        check: false,
                        option_value: []
                    },
                    'exclude_dispute':{
                        check: false,
                        option_value: ''
                    },
                    'exclude_mail':{
                        check: false,
                        option_value: ''
                    },
                    'exclude_evaluate':{
                        check: false,
                        option_value: []
                    },
                },
                conditionList: {},
                conditionValue: [],
                formRules: {
                    platform_code: [
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    rule_name: [
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    priority:[
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    relation_id: [
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    execute_id: [
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    is_timed: [
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    rule_exec_type: [
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    status:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    survival_time_type:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    template_id:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    execute_time:[
                        {required: true, validator: executeTime1, trigger: 'change' }
                    ]
                },
                titleArr:[],

            }
        },
        computed: {
            // ...mapGetters([
            //     'queryParamsInfo',
            //     'automationSendRuleInfo'  // getters.js文件
            // ]),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
        methods:{
            // ...mapActions([
            //     'GetAutomationSendRuleListInfo',
            // ]),
            //定义请求接口方法
            getAutomationSendRuleListInfo,
            addEmailClassifyConfiguration,
            editEmailClassifyConfiguration,
            deleteAutomationSendRule,
            platformCodeInfo,
            maliTemplateInfo,
            triggerConditionInfo,
            getBuyerOptionList,
            getAccountOptionList,
            getWarehouseOptionList,
            getLogisticsOptionList,
            getCountryOptionList,
            getLogData,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                // if (isSave) {
                //     this.queryData = JSON.parse(this.queryParamsInfo['automation_send_rule']);
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
                this.getAutomationSendRuleListInfo(obj).then(({data}) => {
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

            //查询回调`
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                // this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                //     key: 'automation_send_rule',
                //     value: JSON.stringify(this.queryData)
                // });
                //列表数据渲染
                this.tableData = data.data_list.values;
                this.tableProps = ["rule_name","platform_code","status", "priority", "template_name","create_by","create_time","modify_by","modify_time","condition_list","operation"]
                this.tableWidth = ['250', '120', '100', '80', '220', '100 ', '150', '100', '150', '240', '110'];
                this.createByList = data.data_list.drop_down_box.create_by_list;
                this.optionListNew.execute_type = data.data_list.drop_down_box.execute_type;
                this.configureType.platformCodeList = data.data_list.drop_down_box.platform_list;
                //渲染分页
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentPage = data.page_data.offset * 1;
                this.pageData.currentTotal = data.page_data.total * 1;

                // 重置表格高度
                this.searchHeight = !this.searchHeight;
            },
            handleClick(tab, event) {
                console.log(tab, event);
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
                this.isModifyShow = false;
                this.addObj = {
                    platform_code:"",
                    tag_name:"",
                    tag_describe:"",
                    shortcut_key:"",
                    status:"",
                    id:""
                };
                //重置表单域，清除验证
                this.$refs['configureInfo'].resetFields();
            },

            //点击编辑按钮
            compile(row){
                this.isModifyShow = true;
                this.isAddShow = true;
                this.addObj = {
                    platform_code:row.platform_code,
                    tag_name:row.tag_name,
                    tag_describe:row.tag_describe,
                    shortcut_key:row.shortcut_key,
                    status:row.status,
                    id:row.id
                };
            },

            // 点击弹窗确认回调
            dialogConfirm() {
                this.$refs['configureInfo'].validate((res) => {
                    if(res) {
                        let jsonObj = JSON.stringify(this.configureInfo.conditions);
                        this.configureInfo.conditions = jsonObj;
                        let newObj = this.configureInfo
                        if(!this.isModifyShow) {
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
                    this.deleteAutomationSendRule({id}).then(({ data }) => {
                        this.succeedCallBack(data);
                    })
                })
            },
            // 日志
            handleShowLog(row) {
                this.getLogData({
                    id:row.id,
                    modules:"mail_auto_send"
                }).then(({data})=>{
                    //console.log('日志data', data)
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
                    editSendRule(params).then(({data}) => {
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

            //关闭新增和编辑弹窗
            sendFormCloseFn() {
                this.sendForm =  {
                    platform_code: 'AMAZON',
                    rule_name: '',
                    status: '',
                    priority: '',
                    survival_time_type:'',
                    relation_id: '',
                    execute_id: '',
                    template_id:'',
                    rule_exec_type:'',
                    account:'',
                    warehouse:'',
                    shipping_method:'',
                    receiving_country:'',
                    order_type:'',
                    site:'',
                    order_amount:'',
                    sku:'',
                    sku_type:'',
                    asin:'',
                    asin_type:'',
                    buyer_id:'',
                    buyer_id_type:'',
                    item_id: '',
                    item_id_type: '',
                    exclude_review:'',
                    exclude_feedback:'',
                    exclude_dispute:'',
                    exclude_mail:'',
                    execute_hour:'',
                    survival_str_time:'',
                    survival_end_time:'',
                    time: [],
                    execute_time: '',
                    exclude_evaluate: '',
                };
                this.conditionForm = {
                    'info.account_id': {
                        check: false,
                        option_value: [],
                        number:0
                    },
                    'info.warehouse_id': {
                        check: false,
                        option_value: [],
                        number:0
                    },
                    'info.ship_code': {
                        check: false,
                        option_value: [],
                        number:0,
                    },
                    'info.ship_country': {
                        check: false,
                        option_value: [],
                        number:0
                    },
                    'info.amazon_fulfill_channel': {
                        check: false,
                        option_value: ''
                    },
                    'info.site': {
                        check: false,
                        option_value: []
                    },
                    'info.order_amount': {
                        check: false,
                        min: '',
                        max:''
                    },
                    'product.SKU': {
                        check: false,
                        option_value: ''
                    },
                    'product.asin': {
                        check: false,
                        option_value: ''
                    },
                    'product.item': {
                        check: false,
                        option_value: ''
                    },
                    'product.buyer_id': {
                        check: false,
                        option_value: ''
                    },
                    'exclude_review':{
                        check: false,
                        option_value: []
                    },
                    'exclude_feedback':{
                        check: false,
                        option_value: []
                    },
                    'exclude_dispute':{
                        check: false,
                        option_value: ''
                    },
                    'exclude_mail':{
                        check: false,
                        option_value: ''
                    },
                    'exclude_evaluate':{
                        check: false,
                        option_value: []
                    },
                };
                this.exclude_review={
                    checkAll:false,
                    isIndeterminate:false
                };
                this.exclude_feedback={
                    checkAll:false,
                    isIndeterminate:false
                };
                this.exclude_evaluate={
                    checkAll:false,
                    isIndeterminate:false
                };
                this.configureType.maliTemplate = [];
                this.configureType.triggerCondition = [];
                this.template_title = '';
                this.template_content = '';
                this.$refs.sendForm.resetFields();
                this.$nextTick(()=>{
                    this.$refs.executeTime.clearValidate();
                });
            },
            handleSendFormFn(){
                this.$refs.sendForm.validate((valid) => {
                    if(valid) {
                        if(this.conditionForm['info.account_id'].check){
                            if(this.sendForm.account==''){
                                this.$message.error('请选择指定账号');
                                return;
                            }
                        }else{
                            this.sendForm.account='';
                        }
                        if(this.conditionForm['info.warehouse_id'].check){
                            if(this.sendForm.warehouse==''){
                                this.$message.error('请选择指定仓库');
                                return;
                            }
                        }else{
                            this.sendForm.warehouse='';
                        }
                        if(this.conditionForm['info.ship_code'].check){
                            if(this.sendForm.shipping_method==''){
                                this.$message.error('请选择指定邮寄方式');
                                return;
                            }
                        }else{
                            this.sendForm.shipping_method='';
                        }
                        if(this.conditionForm['info.ship_country'].check){
                            if(this.sendForm.receiving_country==''){
                                this.$message.error('请选择指定买家收货国家');
                                return;
                            }
                        }else{
                            this.sendForm.receiving_country='';
                        }
                        if(this.conditionForm['info.amazon_fulfill_channel'].check){
                            if(this.sendForm.order_type==''){
                                this.$message.error('请选择订单类型');
                                return;
                            }
                        }else{
                            this.sendForm.order_type='';
                        }
                        if(this.conditionForm['info.site'].check){
                            if(this.conditionForm['info.site'].option_value.length==0){
                                this.$message.error('请选择站点');
                                return;
                            }else{
                                this.sendForm.site = this.conditionForm['info.site'].option_value.join(',');
                            }
                        }else{
                            this.sendForm.site = '';
                        }
                        if(this.conditionForm['info.order_amount'].check){
                            if(this.conditionForm['info.order_amount'].min===''){
                                this.$message.error('请输入最小订单金额');
                                return;
                            }else if(this.conditionForm['info.order_amount'].max===''){
                                this.$message.error('请输入最大订单金额');
                                return;
                            }
                            let test = /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/;
                            if(!test.test(this.conditionForm['info.order_amount'].min)){
                                this.$message.error('订单金额只能为正数，且只能保留小数点后两位');
                                return;
                            }else if(!test.test(this.conditionForm['info.order_amount'].max)){
                                this.$message.error('订单金额只能为正数，且只能保留小数点后两位');
                                return;
                            }else if(parseFloat(this.conditionForm['info.order_amount'].min)>=parseFloat(this.conditionForm['info.order_amount'].max)){
                                this.$message.error('订单金额最小金额不能大于最大金额!');
                                return;
                            }else{
                                this.sendForm.order_amount=this.conditionForm['info.order_amount'].min+','+this.conditionForm['info.order_amount'].max
                            }
                        }else{
                            this.sendForm.order_amount = '';
                        }
                        if(this.conditionForm['product.SKU'].check){
                            if(this.sendForm.sku==''){
                                this.$message.error('请输入SKU');
                                return;
                            }else{
                                if(this.sendForm.sku_type==''||this.sendForm.sku_type==null){
                                    this.$message.error('请选择是否包含该SKU');
                                    return;
                                }
                            }
                        }else{
                           this.sendForm.sku='';
                           this.sendForm.sku_type='';
                        }
                        
                        if(this.conditionForm['product.buyer_id'].check){
                            if(this.sendForm.buyer_id==''){
                                this.$message.error('请输入买家ID');
                                return;
                            }else{
                                if(this.sendForm.buyer_id_type==''||this.sendForm.buyer_id_type==null){
                                    this.$message.error('请选择是否包含该买家ID');
                                    return;
                                }
                            }
                        }else{
                            this.sendForm.buyer_id='';
                            this.sendForm.buyer_id_type='';
                        }
                        //区分平台的
                        if(this.sendForm.platform_code==='AMAZON'){
                            if(this.conditionForm['exclude_review'].check){
                                if(this.conditionForm['exclude_review'].option_value.length==0){
                                    this.$message.error('请勾选排除已留过评价Review的订单');
                                    return;
                                }else{
                                    this.sendForm.exclude_review = this.conditionForm['exclude_review'].option_value.join(',');
                                }
                            }else{
                                this.sendForm.exclude_review = '';
                            }

                            if(this.conditionForm['exclude_feedback'].check){
                                if(this.conditionForm['exclude_feedback'].option_value.length==0){
                                    this.$message.error('请勾选排除已留过评价Feedback的订单');
                                    return;
                                }else{
                                    this.sendForm.exclude_feedback = this.conditionForm['exclude_feedback'].option_value.join(',');
                                }
                            }else{
                                this.sendForm.exclude_feedback='';
                            }

                            if(this.conditionForm['product.asin'].check){
                                if(this.sendForm.asin==''){
                                    this.$message.error('请输入Asin');
                                    return;
                                }else{
                                    if(this.sendForm.asin_type==''||this.sendForm.asin_type==null){
                                        this.$message.error('请选择是否包含该Asin');
                                        return;
                                    }
                                }
                            }else{
                                this.sendForm.asin='';
                                this.sendForm.asin_type='';
                            }
                        }else{
                            if(this.conditionForm['exclude_evaluate'].check){
                                if(this.conditionForm['exclude_evaluate'].option_value.length==0){
                                    this.$message.error('请勾选排除已留过评价的订单');
                                    return;
                                }else{
                                    this.sendForm.exclude_evaluate = this.conditionForm['exclude_evaluate'].option_value.join(',');
                                }
                            }else{
                                this.sendForm.exclude_evaluate='';
                            }

                            if(this.conditionForm['product.item'].check){
                                if(this.sendForm.item_id==''){
                                    this.$message.error('请输入item');
                                    return;
                                }else{
                                    if(this.sendForm.item_id_type==''||this.sendForm.item_id_type==null){
                                        this.$message.error('请选择是否包含该item ID');
                                        return;
                                    }
                                }
                            }else{
                                this.sendForm.asin='';
                                this.sendForm.asin_type='';
                            }
                        }

                        if(this.conditionForm['exclude_dispute'].check){
                            this.sendForm.exclude_dispute = 1;
                        }else{
                            this.sendForm.exclude_dispute = '';
                        }
                        if(this.conditionForm['exclude_mail'].check){
                            if(this.sendForm.exclude_mail==''){
                                this.$message.error('请输入往来邮件的时间');
                                return;
                            }else{
                                let test = /^[1-9]{1}[0-9]*$/;
                                if(!test.test(this.sendForm.exclude_mail)){
                                    this.$message.error('往来邮件的时间只能为正整数！');
                                    return;
                                }
                            }
                        }else{
                            this.sendForm.exclude_mail='';
                        }
                        let obj = {...this.sendForm};
                        // 如果选了时限内有效
                        if( this.sendForm.survival_time_type === '2' ){
                            if( !this.sendForm.time.length ){
                                this.$message.error('请选择时间段！');
                                return;
                            }else{
                                obj = {
                                    ...obj,
                                    ...{
                                        survival_str_time: this.sendForm.time[0],
                                        survival_end_time: this.sendForm.time[1]
                                    }
                                };
                                delete obj.time;
                            }
                        }

                        // if(this.conditionForm['info.order_amount'].check)this.sendForm.order_amount=this.conditionForm['info.order_amount'].min+','+this.conditionForm['info.order_amount'].max;
                        if(obj.priority=='')delete obj.priority;
                        obj.execute_time = obj.execute_time+','+obj.execute_hour;
                        let fn = this.addEmailClassifyConfiguration;
                        if( obj.id ){
                            fn = this.editEmailClassifyConfiguration;
                        }
                        fn(obj).then(({data}) => {
                            if(!data.status){
                                this.$message.error(data.errorMess||'操作失败');
                                return;
                            }
                            this.sendFormDialog = false;
                            this.handleQueryInfo({...this.queryData.mainQuery}, true);
                        });
                    }
                });
            },
            // 选择条件信息弹窗
            choiceConditionOption(mode){
                this.optionChoiceCondition = mode;
                this.conditionValue = [];
                this.conditionList = {};
                let arr = [];
                if( !this.sendForm.platform_code ){
                    this.$message.warning('请先选择平台！');
                    return;
                }
                switch(mode){
                    // case "买家运输方式":
                    //     this.titleArr=['全部运输方式', '所选运输方式']
                    //     this.conditionValue = [...this.conditionForm['info.buyer_option_logistics'].option_value];
                    //     let buyer ={
                    //         platform_code: this.sendForm.platform_code
                    //     };
                    //     this.getBuyerOptionList(buyer).then(({data}) => {
                    //         if (data.status !== 1) {
                    //             this.$message.error(data.errorMess || '操作失败');
                    //             return;
                    //         }
                    //         if( data.data_list.values.length > 0 ){
                    //             let arr = {};
                    //             data.data_list.values.forEach(e => {
                    //                 arr[e] = e;
                    //             });
                    //             this.conditionList = arr;
                    //             this.choiceCondition = true;
                    //         }else{
                    //             this.$message.warning('暂无数据！');
                    //         }
                    //     });
                    //     break;
                    case "选择账号":
                        this.titleArr=['全部账号', '所选账号']
                        this.conditionValue = [...this.conditionForm['info.account_id'].option_value];
                        let account ={
                            platform_code: this.sendForm.platform_code
                        };
                        this.getAccountOptionList(account).then(({data}) => {
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
                    case "选择仓库":
                        this.titleArr=['全部仓库', '所选仓库'];
                        this.conditionValue = [...this.conditionForm['info.warehouse_id'].option_value];
                        this.getWarehouseOptionList().then(({data}) => {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败');
                                return;
                            }
                            this.conditionList = data.data_list.values;
                            this.choiceCondition = true;
                            this.$forceUpdate();
                        });
                        break;
                    case "选择邮寄方式":
                        this.titleArr=['全部邮寄方式', '所选邮寄方式']
                        this.conditionValue = [...this.conditionForm['info.ship_code'].option_value];
                        this.getLogisticsOptionList().then(({data}) => {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败');
                                return;
                            }
                            this.conditionList = data.data_list.values;
                            this.choiceCondition = true;
                        });
                        break;
                    case "选择国家":
                        this.titleArr=['全部国家', '所选国家']
                        this.conditionValue = [...this.conditionForm['info.ship_country'].option_value];
                        this.getCountryOptionList().then(({data}) => {
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
                // this.conditionValue = [...values];
            },
            conditionConfirm() {
                switch(this.optionChoiceCondition){
                    // case "买家运输方式":
                    //     this.conditionForm['info.buyer_option_logistics'].option_value = [...this.conditionValue];
                    //     break;
                    case "选择账号":
                        this.conditionForm['info.account_id'].number = this.conditionValue.length;
                        this.conditionForm['info.account_id'].option_value = [...this.conditionValue];
                        this.sendForm.account = this.conditionValue.join(',');
                        break;
                    case "选择仓库":
                        this.conditionForm['info.warehouse_id'].number = this.conditionValue.length;
                        this.conditionForm['info.warehouse_id'].option_value = [...this.conditionValue];
                        this.sendForm.warehouse = this.conditionValue.join(',');
                        break;
                    case "选择邮寄方式":
                        this.conditionForm['info.ship_code'].number = this.conditionValue.length;
                        this.conditionForm['info.ship_code'].option_value = [...this.conditionValue];
                        this.sendForm.shipping_method = this.conditionValue.join(',');
                        break;
                    case "选择国家":
                        this.conditionForm['info.ship_country'].number = this.conditionValue.length;
                        this.conditionForm['info.ship_country'].option_value = [...this.conditionValue];
                        this.sendForm.receiving_country = this.conditionValue.join(',');
                        break;
                };
                this.choiceCondition = false;
            },
            // 编辑
            editSendFormFn(row) {
                getRuleInfo({id: row.id}).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败');
                        return;
                    }
                    if( !data.data_list.values.length ){
                        this.$message.error('没有详情数据！');
                        return;
                    }

                    let obj = data.data_list.values[0];
                    // 按提交的格式给表单填充
                    this.sendForm = {
                        ...this.sendForm,
                        ...obj,
                        rule_data: [],      // 去掉无用数据
                        is_timed: (obj.is_timed === '1' && obj.survival_str_time && obj.survival_end_time) ? '2' : obj.is_timed,
                        time: (obj.survival_str_time && obj.survival_end_time) ? [obj.survival_str_time, obj.survival_end_time] : [],
                        condition_by: obj.condition_by ? (obj.condition_by instanceof Array ? obj.condition_by : JSON.parse(obj.condition_by)) : [],
                    };
                    // 填充条件列表
                    //账号
                    if(obj.account){
                        this.conditionForm['info.account_id'].check = true;
                        console.log('账号')
                        this.conditionForm['info.account_id'].option_value = obj.account.split(',');
                        this.conditionForm['info.account_id'].number = this.conditionForm['info.account_id'].option_value.length;
                    }
                    //仓库
                    if(obj.warehouse){
                        console.log('仓库')
                        this.conditionForm['info.warehouse_id'].check = true;
                        this.conditionForm['info.warehouse_id'].option_value = obj.warehouse.split(',');
                        this.conditionForm['info.warehouse_id'].number = this.conditionForm['info.warehouse_id'].option_value.length;
                    }
                    //邮寄方式
                    if(obj.shipping_method){
                        console.log('邮寄方式')
                        this.conditionForm['info.ship_code'].check = true;
                        this.conditionForm['info.ship_code'].option_value = obj.shipping_method.split(',');
                        this.conditionForm['info.ship_code'].number = this.conditionForm['info.ship_code'].option_value.length;
                    }
                    //国家
                    if(obj.receiving_country){
                        console.log('国家')
                        this.conditionForm['info.ship_country'].check = true;
                        this.conditionForm['info.ship_country'].option_value = obj.receiving_country.split(',');
                        this.conditionForm['info.ship_country'].number = this.conditionForm['info.ship_country'].option_value.length;
                    }
                    //订单类型
                    if(obj.order_type){
                        this.conditionForm['info.amazon_fulfill_channel'].check = true;
                        this.sendForm.order_type = obj.order_type;
                    }
                    //站点
                    if(obj.site){
                        console.log('站点')
                        this.conditionForm['info.site'].check = true;
                        this.conditionForm['info.site'].option_value = obj.site.split(',');
                    }
                    //订单金额
                    if(obj.order_amount){
                        console.log('订单金额')
                        this.conditionForm['info.order_amount'].check = true;
                        this.conditionForm['info.order_amount'].min = obj.order_amount.split(',')[0];
                        this.conditionForm['info.order_amount'].max = obj.order_amount.split(',')[1];
                    }
                    //sku
                    if(obj.sku){
                        this.conditionForm['product.SKU'].check = true;
                        this.sendForm.sku = obj.sku;
                        this.sendForm.sku_type = obj.sku_type;
                    }
                    //asin
                    if(obj.asin){
                        this.conditionForm['product.asin'].check = true;
                        this.sendForm.asin = obj.asin;
                        this.sendForm.asin_type = obj.asin_type;
                    }
                    //item_id
                    if(obj.item_id){
                        this.conditionForm['product.item'].check = true;
                        this.sendForm.item_id = obj.item_id;
                        this.sendForm.item_id_type = obj.item_id_type;
                    }
                    //买家ID
                    if(obj.buyer_id){
                        this.conditionForm['product.buyer_id'].check = true;
                        this.sendForm.buyer_id = obj.buyer_id;
                        this.sendForm.buyer_id_type = obj.buyer_id_type;
                    }
                    // //买家ID
                    // if(obj.asin){
                    //     this.conditionForm['product.buyer_id'].check = true;
                    //     this.sendForm.buyer_id = obj.buyer_id;
                    //     this.sendForm.buyer_id_type = obj.buyer_id_type;
                    // }
                    //已留过评价Review的订单
                    if(obj.exclude_review){
                        console.log('已留过评价Review的订单')
                        this.conditionForm['exclude_review'].check = true;
                        this.conditionForm['exclude_review'].option_value = obj.exclude_review.split(',');
                        if(this.conditionForm['exclude_review'].option_value.length){
                            if(this.conditionForm['exclude_review'].option_value.length==5){
                                this.exclude_review.checkAll = true;
                                this.exclude_review.isIndeterminate = false;
                            }else{
                                this.exclude_review.checkAll = false;
                                this.exclude_review.isIndeterminate = true;
                            }
                        }
                        if(this.conditionForm['exclude_review'].option_value.length==5)this.exclude_review.checkAll = true;
                    }
                    //已留过评价FeedBack的订单
                    if(obj.exclude_feedback){
                        console.log('已留过评价FeedBack的订单')
                        this.conditionForm['exclude_feedback'].check = true;
                        this.conditionForm['exclude_feedback'].option_value = obj.exclude_feedback.split(',');
                        if(this.conditionForm['exclude_feedback'].option_value.length){
                            if(this.conditionForm['exclude_feedback'].option_value.length==5){
                                this.exclude_feedback.checkAll = true;
                                this.exclude_feedback.isIndeterminate = false;
                            }else{
                                this.exclude_feedback.checkAll = false;
                                this.exclude_feedback.isIndeterminate = true;
                            }
                        }
                    }
                    //已留过评价的订单
                    if(obj.exclude_evaluate){
                        console.log('已留过评价的订单')
                        this.conditionForm['exclude_evaluate'].check = true;
                        this.conditionForm['exclude_evaluate'].option_value = obj.exclude_evaluate.split(',');
                        if(this.conditionForm['exclude_evaluate'].option_value.length){
                            if(this.conditionForm['exclude_evaluate'].option_value.length==5){
                                this.exclude_evaluate.checkAll = true;
                                this.exclude_evaluate.isIndeterminate = false;
                            }else{
                                this.exclude_evaluate.checkAll = false;
                                this.exclude_evaluate.isIndeterminate = true;
                            }
                        }
                    }
                    //已产生纠纷的订单
                    if(obj.exclude_dispute=='1'){
                        this.conditionForm['exclude_dispute'].check = true;
                    }
                    //有往来邮件的订单
                    if(obj.exclude_mail){
                        this.conditionForm['exclude_mail'].check = true;
                        this.sendForm.exclude_mail = obj.exclude_mail;
                    }
                    this.$nextTick(()=>{
                        let timeArr=obj.execute_time.split(',');
                        this.sendForm.execute_time = parseInt(timeArr[0]);
                        this.sendForm.execute_hour = parseInt(timeArr[1]);
                    });
                    // 填充模板
                    this.templateChange(this.sendForm.platform_code);
                    this.sendFormDialog = true;
                });
            },
            templateChange(v,bool) {
                if(v==='AMAZON'){
                    this.allOptions = ['1','2','3','4','5'];
                }else if(v==='EB'){
                    this.allOptions = ['1','2','3'];
                }
                let platform = v;
                if(bool)this.configureType.maliTemplate = [];
                this.sendForm.platform_code = v;
                let obj ={
                    platform_code:v,
                    template_type:3,
                }
                this.maliTemplateInfo(obj).then(({ data }) => {
                    this.configureType.maliTemplate = data.data_list;
                    this.configureType.maliTemplate.forEach(element => {
                        if(element.id == this.sendForm.template_id){
                            this.template_title = element.template_title;
                            this.template_content = element.template_content;
                        }
                    });
                })
            },

            //优先级
            handleNumber(val){　
                if (val.length == 1) {
                    this.sendForm.priority = val.replace(/[^1-9]/g,'')
                } else {
                    this.sendForm.priority = val.replace(/\D/g,'')
                }
            },
            handleCheckAllChange(val,str) {
                this.conditionForm[str].option_value = val ? this.allOptions : [];
                this[str].isIndeterminate = false;
            },
            handleCheckedCitiesChange(value,str) {
                this.conditionForm[str].option_value = value;
                let checkedCount = value.length;
                this[str].checkAll = checkedCount === this.allOptions.length;
                this[str].isIndeterminate = checkedCount > 0 && checkedCount < this.allOptions.length;
            },
            //自动填充模板标题和内容
            handleOptinTemlate(){
                this.configureType.maliTemplate.forEach(element => {
                    if(element.id == this.sendForm.template_id){
                        this.template_title = element.template_title;
                        this.template_content = element.template_content;
                    }
                });
            }
        },
        created() {
            this.templateChange('AMAZON',false);
            // try {
            //     if (this.$route.query._cacheType === '1' || JSON.stringify(this.automationSendRuleInfo) === '{}') {
            //         // this.handleQueryInfo();
            //     } else {
            //         // 获取保存的查询参数
            //         this.queryData = JSON.parse(this.queryParamsInfo['automation_send_rule']);
            //         this.handleQueryInfoCallBack(this.automationSendRuleInfo);
            //     }
            // } catch (e) {
            //     console.log(e)
            // }
            // this.platformCodeInfo().then(({ data }) => {
            //     for(let i in data.data_list.values){
            //         let obj ={
            //             value: i,
            //             label: data.data_list.values[i]
            //         }
            //         this.configureType.platformCodeList.push(obj);
            //     }
            // })
            // this.triggerConditionInfo().then(({ data }) => {
            //     for(let i in data.data_list.execute_type){
            //         let obj ={
            //             value: i,
            //             label: data.data_list.execute_type[i]
            //         }
            //         this.configureType.triggerCondition.push(obj);
            //         this.optionListNew = {...this.optionListNew, ...data.data_list};
            //     }
            // })
        },
    }
</script>

<style lang="less" scoped>
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
            border-bottom: 0 none;
            border: 1px solid #e6e6e6;
            border-top: 0 none;
            padding: 10px 20px;
            height: 650px;
            overflow-y: auto;
        }
        .el-collapse-item__content{
            padding-bottom: 0;
            font-size: 12px;
        }
    }
    /deep/.headerInfoScrollTop{
        width: 800px;
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
    .configureInfo{
        display: flex;
    }
    /deep/.configureInfoRight{
        width: 500px;
        margin-left: 10px;
        .el-collapse-item__wrap{
            height: 650px;
            overflow-y: auto;
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
    /deep/.el-checkbox-group{
        padding: 0px;
        label{
            line-height: 30px;
        }
    }

    .configureInfoLeftTable{
        .hasBg{
            background: #fafafa;
        }
        td{
            padding: 5px 0;
        }
    }

    //时间选择器层级
    /deep/.el-picker-panel.el-date-range-picker.el-popper{
        z-index: 3000;
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
</style>
