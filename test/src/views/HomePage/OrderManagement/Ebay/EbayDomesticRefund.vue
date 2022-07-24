<style lang="less" scoped>

</style>

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
                    <!-- 基础信息 -->
                    <template slot-scope="scope" slot="basicsInfo">
                        <div>平台账号：{{scope.row.account_name}}</div>
                        <div>买家ID：{{scope.row.buyer_id}}</div>
                    </template>
                    <!-- 订单信息 -->
                    <template slot-scope="scope" slot="orderInfo">
                        
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">订单号：</div>
                            <div style="word-wrap:break-word;cursor: pointer;color: #409EFF;" @click="handleOrderInfo(scope.row)">{{scope.row.order_id}}</div>
                        </div>
                        <div>订单状态：
                            <span class="ui-state_circle grayColor" v-if="scope.row.order_status === '初始化'"></span>
                            <span class="ui-state_circle greenColor" v-if="scope.row.order_status === '正常'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.order_status === '异常'"></span>
                            <span class="ui-state_circle grayColor" v-if="scope.row.order_status === '缺货'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.order_status === '已备货'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.order_status === '待发货'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.order_status === '超期'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.order_status === '部分发货'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.order_status === '已发货'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.order_status === '暂扣'"></span>
                            <span class="ui-state_circle grayColor" v-if="scope.row.order_status === '已取消'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.order_status === '已完成'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.order_status === '通途系统处理订单'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.order_status === '待检测paypal账号'"></span>
                            {{scope.row.order_status}}
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">付款时间：</div>
                            <div style="flex:1;word-wrap:break-word;">{{scope.row.paytime}}</div>
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">订单金额：</div>
                            <div style="flex:1;word-wrap:break-word;"><span style="color:#ff9900;font-weight: 700;">{{scope.row.order_price}} {{scope.row.currency}}</span></div>
                        </div>
                    </template>
                    <!-- 发货信息 -->
                    <template slot-scope="scope" slot="deliverGoodsInfo">
                        <div>发货仓库：{{scope.row.warehouse_name}}</div>
                        <div>邮寄方式：{{scope.row.ship_code}}</div>
                        <div>跟踪号：{{scope.row.trackno}}</div>
                    </template>
                    <!-- 退货信息 -->
                    <template slot-scope="scope" slot="returnGoodsInfo">
                        <div>退件大类：{{scope.row.return_type_name}}</div>
                        <div>退件小类：{{scope.row.return_typesmall_name}}</div>
                    </template>
                    <!-- 关联信息 -->
                    <template slot-scope="scope" slot="relationState">
                        <div style="display:flex;">
                            <div>纠纷状态：</div>
                            <div style="margin-left:4px;">
                                <span class="ui-state_circle grayColor" v-if="!scope.row.disput_list.length"></span>
                                <span  v-if="scope.row.disput_list.length">
                                    <span class="ui-state_circle orangeColor" v-if="scope.row.disput_list[0].is_deal === '未处理'"></span>
                                    <span class="ui-state_circle blueColor" v-if="scope.row.disput_list[0].is_deal === '处理中'"></span>
                                    <span class="ui-state_circle greenColor" v-if="scope.row.disput_list[0].is_deal === '已处理'"></span>
                                </span>
                            </div>
                            <div style="margin-left:3px;" v-if="!scope.row.disput_list.length" v-html="'无纠纷'"></div>
                            <div v-if="scope.row.disput_list.length">
                                <el-popover placement="right" trigger="hover" width="300px" popper-class="afterId">
                                    <table cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td>ID</td>
                                            <td>纠纷类型</td>
                                            <td>处理状态</td>
                                        </tr>
                                        <tr v-for="(item,index) in scope.row.disput_list">
                                            <td>
                                                <div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleGoDispute(item)">{{item.inquiry_id||item.cancel_id||item.return_id}}</div>
                                            </td>
                                            <td>{{item.type}}</td>
                                            <td>
                                                {{item.is_deal}}
                                            </td>
                                        </tr>
                                    </table>
                                    <div style="cursor: pointer;color: #409EFF;margin-left:3px;" slot="reference">{{scope.row.disput_list[0].is_deal}}</div>
                                </el-popover>
                            </div>
                        </div>
                        <div>消息状态：
                            <span class="ui-state_circle orangeColor" v-if="scope.row.is_replied === '未回复'"></span>
                            <span class="ui-state_circle grayColor" v-if="!scope.row.is_replied"></span>
                            <span class="ui-state_circle greenColor" v-if="scope.row.is_replied === '已回复'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.is_replied === '已回复未发送'"></span>
                            <span v-show="!scope.row.is_replied" v-html="'无消息'"></span>
                            <span v-show="scope.row.is_replied">
                                <span style="cursor: pointer;color: #409EFF;" @click="goMessagejump(scope.row)">
                                    {{scope.row.is_replied}}
                                </span>
                            </span>
                        </div>
                        <div style="display:flex;"><div>售后问题： </div>
                            <div style="margin-left:4px;">
                                <span class="ui-state_circle grayColor" v-if="scope.row.aftersales[0].aftersales"></span>
                                <span v-else>
                                    <span class="ui-state_circle orangeColor" v-if="scope.row.aftersales[0].type === '退货'"></span>
                                    <span class="ui-state_circle blueColor" v-if="scope.row.aftersales[0].type === '重寄'"></span>
                                    <span class="ui-state_circle redColor" v-if="scope.row.aftersales[0].type === '退款'"></span>
                                </span>
                            </div>
                            <div style="margin-left:3px;" v-if="scope.row.aftersales[0].aftersales">无售后</div>
                            <div v-if="!scope.row.aftersales[0].aftersales">
                                <el-popover placement="right" trigger="hover" width="300px" popper-class="afterId">
                                    <table cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td>序号</td>
                                            <td>售后类型</td>
                                            <td>售后单号</td>
                                        </tr>
                                        <tr v-for="(item,index) in scope.row.aftersales">
                                            <td>{{index+1}}</td>
                                            <td>{{item.type}}</td>
                                            <td>
                                                <div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleAfterSaleList(item)">{{item.after_sale_id}}</div>
                                            </td>
                                        </tr>
                                    </table>
                                    <div style="cursor: pointer;color: #409EFF;margin-left:3px;" slot="reference" v-show="!scope.row.aftersales[0].aftersales">
                                        {{scope.row.aftersales[0].type}}
                                    </div>
                                </el-popover>
                            </div>
                        </div>
                        <div style="display:flex;"><div>评价状态： </div>
                            <div style="margin-left:4px;">
                                <span class="ui-state_circle grayColor" v-if="!scope.row.feedback_list.length"></span>
                                <span v-else>
                                    <span class="ui-state_circle orangeColor" v-if="scope.row.feedback_list[0].status === '未回复'"></span>
                                    <span class="ui-state_circle greenColor" v-if="scope.row.feedback_list[0].status === '已回复'"></span>
                                    <span class="ui-state_circle blueColor" v-if="scope.row.feedback_list[0].status === '标记回复'"></span>
                                </span>
                            </div>
                            <div v-if="!scope.row.feedback_list.length" style="margin-left:3px;">无评价</div>
                            <div v-else>
                                <el-popover placement="right" trigger="hover" width="300px" popper-class="afterId">
                                    <table cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td>评价ID</td>
                                            <td>评价状态</td>
                                            <td>评价级别</td>
                                        </tr>
                                        <tr v-for="(item,index) in scope.row.feedback_list">
                                            <td>{{item.id}}</td>
                                            <td><div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="goFeedBackjump(item)">{{item.status}}</div></td>
                                            <td>{{item.comment_type}}</td>
                                        </tr>
                                    </table>
                                    <div style="cursor: pointer;color: #409EFF;margin-left:3px;" slot="reference" v-show="scope.row.feedback_list.length">{{scope.row.feedback_list&&scope.row.feedback_list[0].status}}
                                    </div>
                                </el-popover>
                            </div>
                        </div>
                        <div>退款状态：
                            <span class="ui-state_circle grayColor" v-if="scope.row.refund_status === '未发起退款'"></span>
                            <span class="ui-state_circle grayColor" v-if="scope.row.refund_status === '待退款'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.refund_status === '退款完成'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.refund_status === '退款失败'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.refund_status === '退款中'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.refund_status === '等待接受退款中'"></span>
                            {{scope.row.refund_status}}
                        </div>
                        <!-- <div>售后问题：{{scope.row.type}}</div> -->
                    </template>
                    <!-- 备注 -->
                    <template slot-scope="scope" slot="remarks">
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">备注内容：</div>
                            <div style="flex:1;word-wrap:break-word;">{{scope.row.remark}}</div>
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">备注时间：</div>
                            <div style="flex:1;word-wrap:break-word;">{{scope.row.synchronization_time}}</div>
                        </div>
                    </template>
                    <!-- 处理信息 -->
                    <template slot-scope="scope" slot="handleInfo">
                        <div>处理状态：{{scope.row.handle_type_name}}</div>
                        <div>处理人：{{scope.row.handle_user}}</div>
                        <div>处理时间：{{scope.row.handle_time}}</div>
                        <div>创建时间：{{scope.row.create_time}}</div>
                    </template>
                    <!-- 操作 -->
                    <template slot-scope="scope" slot="operate">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <el-button type="text">操作<div class="triangle"></div>
                                </el-button>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <!-- 暂不处理 -->
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" @click="TemporarilyHandle(scope.row)"
                                        v-if="buttonList['temporarilyHandle'].permit(thisVm)">暂不处理</el-button>
                                </el-dropdown-item>
                                <!-- 修改信息 -->
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" @click="handleOrderEditInfo(scope.row)"
                                        v-if="buttonList['editInfo'].permit(thisVm)&& (scope.row.return_typesmall_name!=='疑似丢件'&&scope.row.return_typesmall_name!=='派送不成功')">修改信息</el-button>
                                </el-dropdown-item>
                                <!-- 新建售后单 -->
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" v-if="buttonList['newSalesOrder'].permit(thisVm)"
                                        @click="handleAfterSalesOrders(scope.row,'addNewAfterSaleSingle','新建售后单')">
                                            新建售后单</el-button>
                                </el-dropdown-item>
                                <!-- 登记退款单 -->
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" v-if="buttonList['registerRefundForm'].permit(thisVm)
                                    && (scope.row.return_typesmall_name!=='疑似丢件'&&scope.row.return_typesmall_name!=='派送不成功')"
                                            @click="handleAfterSalesOrders(scope.row,'registeredRefundSlip','登记退款单')">
                                            登记退款单</el-button>
                                </el-dropdown-item>
                                <!-- 消息联系 -->
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" 
                                    v-if="buttonList['messageContact'].permit(thisVm)&& scope.row.return_typesmall_name!=='疑似丢件'"
                                        @click="handleMessageContact(scope.row,true)">消息联系</el-button>
                                </el-dropdown-item>
                                <!-- 驳回 -->
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" @click="handleReject(scope.row)"
                                        v-if="buttonList['reject'].permit(thisVm)">驳回</el-button>
                                </el-dropdown-item>
                                <!-- 暂扣 -->
                                <el-dropdown-item>
                                    <span v-show="scope.row.complete_status=='暂扣'?false:true">
                                        <el-button style="width:100%;font-size:12px;" type="text" @click="orderWithhold(scope.row)"
                                            v-if="buttonList['hold'].permit(thisVm)&& (scope.row.return_typesmall_name!=='疑似丢件'&&scope.row.return_typesmall_name!=='派送不成功')"
                                            >暂扣</el-button>
                                    </span>
                                    <span v-show="scope.row.complete_status=='暂扣'?true:false">
                                        <el-button style="width:100%;font-size:12px;" type="text" @click="cancelOrderWithhold(scope.row,'1')"
                                            v-if="buttonList['cancelHold'].permit(thisVm)&& (scope.row.return_typesmall_name!=='疑似丢件'&&scope.row.return_typesmall_name!=='派送不成功')">取消暂扣</el-button>
                                    </span>
                                </el-dropdown-item>
                                <!-- 作废 -->
                                <el-dropdown-item>
                                    <span v-show="scope.row.complete_status=='已取消'?false:true">
                                        <el-button style="width:100%;font-size:12px;" type="text" @click="orderToVoid(scope.row)"
                                            v-if="buttonList['obsolete'].permit(thisVm)&& (scope.row.return_typesmall_name!=='疑似丢件'&&scope.row.return_typesmall_name!=='派送不成功')"
                                            >作废</el-button>
                                    </span>
                                    <span v-show="scope.row.complete_status=='已取消'?true:false">
                                        <el-button style="width:100%;font-size:12px;" type="text" @click="cancelOrderWithhold(scope.row,'2')"
                                            v-if="buttonList['cancelObsolete'].permit(thisVm) && (scope.row.return_typesmall_name!=='疑似丢件'&&scope.row.return_typesmall_name!=='派送不成功')">取消作废</el-button>
                                    </span>
                                </el-dropdown-item>
                                <!-- 补款 -->
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text"  @click="handleRegisterGathering(scope.row)"
                                        v-if="buttonList['supplement'].permit(thisVm) && (scope.row.return_typesmall_name==='尺寸超长'||scope.row.return_typesmall_name==='偏远')">补款</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <ComDivide />
                        <el-button type="text" v-if="buttonList['diaryLog'].permit(thisVm)" @click="handleOrderLog(scope.row.id)">日志</el-button>
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
            <!-- 订单详情 -->
            <OrderInformation
                v-if="isOrderInfoShow"
                :isOrderInfoShow="isOrderInfoShow"
                :orderInfo="orderInfo"
                @handleCancelOrderInfoPopup="handleCancelOrderInfoPopup"
                @handleReload="handleReload">
            </OrderInformation>
            <!-- 登记收款 -->
            <RegisteredReceivables
                v-if="isRegisteredReceivables"
                :showRegisteredReceivables="isRegisteredReceivables"
                :orderInfo="order"
                :RegisteredReceivables="RegisteredReceivablesInfo"
                :sendRegisteredReceivables="sendRegisteredReceivablesInfo"
                @handlesendRegisteredReceivablesCancel="isRegisteredReceivables=false">
            </RegisteredReceivables>
            <!-- 留评\消息联系\批量消息联系 -->
            <el-dialog
                class="ui-layout_edit-dialog"
                :title="form.title"
                width="800px"
                :visible.sync="isTemplateChooseShow"
                @close="handleOperateCancel()">
                <el-form border style="width: 100%" ref="from" :rules="batchRules" :model="form">
                    <div style="display:flex;">
                        <div style="display:flex;">
                            <div>
                                <el-form-item label="模板选择：" label-width="80px" prop="">
                                    <el-select placeholder="请选择" size="mini" v-model="form.templateChoose" filterable v-filter @change="handleSelectionTemplate()">
                                        <el-option v-for="(value, key, index) in dataComment.template"
                                                :label="value"
                                                :value="key"
                                                :key="index">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <TemplateEdit :platform="'EB'" class="templateChange" @selectTemplate="templateChange" />
                        </div>
                        <div v-if="form.title!=='留评'">
                            <el-form-item label="添加标签：" label-width="120px" prop="">
                                <el-select placeholder="请选择" size="mini" v-model="form.tag_id">
                                    <el-option v-for="value in tag"
                                            :label="value.value"
                                            :value="value.id"
                                            :key="value.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>

                        <ComSelectLanguageV2 @change="changeLanguage" @translate="googleTranslate()" class="translateButton" :list="dataComment.google_lang_code"></ComSelectLanguageV2>
                    <el-form-item :label="isTranslate?'翻译前':'正文'" prop="before_translate_content">
                        <el-input size="small" type="textarea" v-model="form.before_translate_content" :rows="isTranslate?8:16" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="翻译后" v-if="isTranslate">
                        <el-input size="small" type="textarea" v-model="form.comment_text" rows="8" show-word-limit></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleOperateCancel()" size="small">取 消</el-button>
                    <el-button type="primary" @click="handleTemplateChooseConfirm()" size="small">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 点击暂扣、作废弹窗 -->
            <el-dialog :title="isBatchOperation" width="440px" class="ui-layout_edit-dialog" :visible.sync="isBatchShow" @close="batchOperationCancel">
                <el-form label-width="80px" :model="BatchOperation" ref="BatchOperation" :rules="batchRules">
                    <el-form-item label="订单号：" prop="batchOrderId">
                        <div style="width:320px;max-height:300px;overflow-y:auto;white-space:normal;word-break:break-all;word-wrap:break-word;"
                            v-html="BatchOperation.batchOrderId"></div>
                    </el-form-item>
                    <el-form-item label="平台：" prop="batchPlatform">
                        <div>{{BatchOperation.batchPlatform}}</div>
                    </el-form-item>
                    <el-form-item label="备注信息：" prop="batchRemark">
                        <el-input size="small" type="textarea" class="batchRemark" v-model="BatchOperation.batchRemark" placeholder="请输入内容,不能超过5000个字符" show-word-limit maxlength="5000"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button size="small" @click="batchOperationCancel">取消</el-button>
                    <el-button size="small" type="primary" @click="handleBatchOperation()">确定</el-button>
                </div>
            </el-dialog>
            <!-- 日志弹框 -->
            <el-dialog width="950px" class="ui-layout_edit-dialog logs" title="日志" :visible.sync="isShowLogShow">
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
            <!-- 新建退款后的提示 -->
            <!-- <el-dialog
                class="ui-layout_edit-dialog"
                :title="'提示'"
                width="400px"
                :visible.sync="tips.isShow"
                @close="handleCancelTips()">
                <div style="margin: 30px 0px 30px 79px">
                    <div>付款时间：{{tips.paytime}}</div>
                    <div>当前时间：{{tips.currentTime}}</div>
                    <div>间隔时间：{{tips.intervalTime}}</div>
                    <div style="color:red;font-size:12px;margin-top:10px;">当前订单可以取消订单，请取消订单！</div>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="handleCancelTips()" size="small">关 闭</el-button>
                <el-button type="primary" @click="handleIsCancelOrder()" size="small">取消订单</el-button>
                </span>
            </el-dialog> -->
            <!-- 点击驳回弹窗 -->
            <el-dialog :title="'驳回'" width="440px" class="ui-layout_edit-dialog" :visible.sync="isReject" @close="handleRejectCancel">
                <el-form label-width="80px" :model="reject" ref="reject" :rules="batchRules">
                    <el-form-item label="驳回原因：" prop="rejectReason">
                        <el-input size="small" type="textarea" rows="3" class="batchRemark" v-model="reject.reason"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button size="small" @click="handleRejectCancel">取消</el-button>
                    <el-button size="small" type="primary" @click="handleRejectConfirm()">确定</el-button>
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
    getEbayReturnGoodsHomeList,
    returnGoodsHomeLog,
    returnGoodsHomeReject,
    returnGoodsHomeHangup,
} from '../../../../api/orderInfo/Ebay/EbayDomesticRefund';
import {
    toVoidInfo,
    withhold,
    batchCancelWithhold,
    registeredReceivablesData,
    getCommentHeader,
    replyBack,
    journalOperation,
    activeContactConfirm,
} from '../../../../api/orderInfo/Ebay/OrderListManagement';
import {
    getGoogleTranslate,
    getTemplateDetail,
} from '@/api/MailCenterManagement/PostMail';
import {getTag} from '../../../../api/MailCenterManagement/Inbox';

import routerConfig from '@/router/routerConfig';
import ComSelectLanguageV2 from "@/views/HomePage/MailCenterManagement/PostMail/components/ComSelectLanguageV2";
import RegisteredReceivables from '../component/RegisteredReceivables';
import OrderInformation from '../OrderInformation';
import * as storage from '@/utils/storage';

export default {
    name: 'EbayDomesticRefund',
    components: {
        OrderInformation,
        RegisteredReceivables,
        ComSelectLanguageV2,
    },
    data () {
        return {
            //订单详情相关
            isOrderInfoShow:false,
            orderInfo:{},

            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['基础信息', '订单信息', '发货信息', '退货信息', '关联信息', '备注', '处理信息', '操作'],
            tableProps: ['basicsInfo', 'orderInfo', 'deliverGoodsInfo', 'returnGoodsInfo', 'relationState', 'remarks', 'handleInfo', 'operate'],
            tableWidth: ['240', '200', '200', '200', '180', '280', '200', '200'],
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

            batchRules: {
                before_translate_content: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                cancel_reason: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                batchOrderId: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                batchPlatform: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                batchRemark: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                reason: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
            },

            //消息联系
            isTemplateChooseShow:false,
            replyBack:{
                item_id:'',//平台item_id
                platform_order_id:"",//平台订单号
                before_translate_content:"",//评价内容
                buyer_id:"",//买家ID
                transaction_id:"",//交易号
                account_id:"",//账号ID
                type:"",
                platform_code:"",//平台
                currency:"",//币种
                sale_price:"",//产品价格
                site_id:"",//平台ID
            },
            dataComment:{
                google_lang_code:{},
                quick_parameter:{},
                template:[]
            },
            tag:[],
            form: {
                template:{},
                templateChoose:"",
                quickParameter:"",
                before_translate_content:"",
                comment_text:"",
                title:'',
                tag_id:"",
            },
            languageCode:'',
            isTranslate:false,
            activeContactRow:{},
            activeContact:{
                reply_title:'',
                reply_content:"",
                reply_content_en:"",
                ebay_order:[]
            },

            // 暂扣作废
            isBatchOperation:"",
            isBatchShow:false,
            BatchOperation: {
                batchOrderId: '',
                batchPlatform: '',
                batchRemark: '',
                batchUserId: '',
            },
            result:{
                isShowResult:false,
                resultType:'暂扣',
                failure:"",
                success:""
            },

            //登记收款弹窗
            isRegisteredReceivables:false,
            RegisteredReceivablesInfo: {
                order: {
                    account_id: "",
                    account_name: "",
                    buyer_id: "",
                    order_id: "",
                    platform_code: ""
                }
            },
            order:{},
            sendRegisteredReceivablesInfo: { //登记收款
                receipt_type: '', //收款方式
                receipt_money: '', //交易金额
                receipt_currency: '', //交易金额单位
                receipt_reason_type: '', //原因
                paypal_account_id: '', //paypal账号id
                paypal_account: '', //paypal账号
                transaction_id: '', //交易号
                transaction_hour: '', //交易时间
                status: '', //状态
                payment_account: '', //	付款账号
                receipt_bank: '', //收款银行
                receipt_bank_sn: '', //交易流水号
                receipt_bank_account: '', //银行账号
            },

            //日志
            isShowLogShow:false,
            showLogTableData:[],

            //提示
            tips:{
                currentTime:"",
                paytime:"",
                intervalTime:"",
                isShow:false,
                row:{},
            },

            //驳回
            reject:{
                id:'',
                reason:'',
            },
            isReject: false,
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
            getEbayReturnGoodsHomeList(obj).then(({data}) => {
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
                fast_mail_category: '',
                fast_is_replied: '',
                fast_tag_id: '',
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

        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow=bool
        },

        handleReload(){
            this.handleQueryInfo({...this.queryData.mainQuery}, true);
        },

        //订单详情弹窗
        handleOrderInfo(row){
            this.orderInfo={
                order_id:row.order_id,
                platform_code:row.platform_code,
                edit:false,
                title:'订单信息',
                operation:'handleOrder'
            }
            this.isOrderInfoShow=true;
        },

        //修改信息
        handleOrderEditInfo(row){
            this.orderInfo={
                order_id:row.order_id,
                platform_code:row.platform_code,
                edit:false,
                title:'订单信息',
                operation:'handleOrder',
                editInfo: row
            }
            this.isOrderInfoShow=true;
        },

        //售后弹窗
        handleAfterSalesOrders(row,identification,title){
            this.tips.row=row;
            this.orderInfo={
                order_id:row.order_id,
                platform_code:row.platform_code,
                edit:false,
                title:title,
                operation:identification,
                type: 'refund'
            }
            this.isOrderInfoShow=true;
        },
        //新建退款单后判断三十天
        // handleCancelOrder(data){
        //     let date = new Date();
        //     let year = date.getFullYear();
        //     let month = date.getMonth() + 1;
        //     let day = date.getDate();
        //     let hh = date.getHours();
        //     let mm = date.getMinutes();
        //     let ss = date.getSeconds();
        //     month = month < 10 ? '0'+ month : month;
        //     day = day < 10 ? '0'+ day : day;
        //     this.tips.currentTime = year +'-'+ month +'-'+ day + ' '+ hh + ':' + mm + ':' + ss;
        //     this.tips.paytime = data.paytime;
        //     let usedTime = date-new Date(data.paytime); // 相差的毫秒数
        //     let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
        //     let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
        //     let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
        //     console.log('days:',days,'         hours:',hours)
        //     if(days<30){
        //         this.tips.intervalTime = days+"天"+hours+"小时";
        //         this.tips.isShow = true;
        //     }
        // },
        //关闭按钮
        // handleCancelTips(){
        //     this.tips={
        //         currentTime:"",
        //         paytime:"",
        //         intervalTime:"",
        //         isShow:false,
        //     }
        // },
        //提示的取消订单按钮
        // handleIsCancelOrder(){
        //     this.handleCancellationOrder(this.tips.row);
        // },

        //消息联系\批量消息联系
        handleMessageContact(row,bool){
            this.form.title = '消息联系';
            this.activeContactRow=row;
                // if(!row.order_comm_detail_list.length){
                //     this.$message.warning('该订单没有产品信息!');
                //     return;
                // }
            getCommentHeader({
                platfrom_code:'EB',
                type:'2'
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess);
                    return;
                }
                this.dataComment = data.data_list;
                this.isTemplateChooseShow = true;
            }).catch(err => {
                console.log(err);
            });
        },
        //消息联系提交
        handleTemplateChooseConfirm(){
            this.replyBack.before_translate_content = this.form.before_translate_content;
            this.replyBack.comment_text = this.form.comment_text?this.form.comment_text:this.form.before_translate_content;
            let tagIndex = this.tag.findIndex((item)=>{ return this.form.tag_id == item.id});
            this.$refs['from'].validate(res => {
                if (res) {
                        this.activeContact={
                            // reply_title: this.form.template.template_title,
                            reply_content:  this.form.comment_text?this.form.comment_text:this.form.before_translate_content,
                            reply_content_en: this.form.before_translate_content,
                            tag: tagIndex>-1?this.tag[tagIndex].value:"",
                            tag_id: this.form.tag_id,
                            ebay_order:[{
                                sender: this.activeContactRow.account_name,
                                item_id: this.activeContactRow.order_comm_detail_list[0].item_id,
                                question_type: '',
                                account_id: this.activeContactRow.kefu_account_id,
                                recipient_id: this.activeContactRow.buyer_id,
                                platform_order_id: this.activeContactRow.platform_order_id,
                                platform_code: this.activeContactRow.platform_code,
                                template_id:this.form.templateChoose,
                            }]
                        }
                        activeContactConfirm(this.activeContact).then(({data}) => {
                            if( !data.status ){
                                this.$message.error(data.errorMess || '操作失败！');
                                return;
                            }else{
                                this.$message.success('操作成功！');
                                this.handleOperateCancel();
                            };
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //取消消息联系提交
        handleOperateCancel(){
            this.isTemplateChooseShow=false;
            this.form= {
                templateChoose:"",
                quickParameter:"",
                before_translate_content:"",
                comment_text:"",
                tag_id:"",
                title:''
            }
            this.activeContact={
                reply_title:'',
                reply_content:"",
                reply_content_en:"",
                ebay_order:[]
            }
            this.replyBack={};
            this.isTranslate=false;
            this.languageCode=false;
            this.$refs['from'].resetFields();
        },
        //模板渲染
        handleSelectionTemplate(){
            // this.form.before_translate_content = this.dataComment.template[this.form.templateChoose];
            getTemplateDetail({id:this.form.templateChoose}).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.form.before_translate_content += data.data_list.values[0].template_content;
                this.form.template = data.data_list.values[0];
            });
        },
        //常用语言翻译
        changeLanguage(code) {
            if( !this.form.before_translate_content){
                return;
            }
            this.languageCode = code;
        },
        //选择语言翻译
        googleTranslate() {
            if( !this.languageCode ) {
                this.$message.warning('请选择语言后再进行翻译！');
                return;
            }
            if( !this.form.before_translate_content){
                return;
            }
            getGoogleTranslate({
                content: this.form.before_translate_content,
                after : this.languageCode,
                before : "auto"
            }).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.form.comment_text = data.after;
                this.isTranslate=true;
            });
        },
        //获取标签下拉数据
        handleGetTag(){
            getTag({platform_code: 'EB'}).then(({data}) => {
                this.tag = data.data_list;
            });
        },
        //更多按钮
        templateChange(id) {
            this.form.templateChoose = id;
            getTemplateDetail({id}).then(({data}) => {
                this.form.before_translate_content = (this.form.before_translate_content ? this.form.before_translate_content + '\n\n\n' : '') + data.data_list.values[0].template_content;
            });
        },

        //暂扣
        orderWithhold(row) {
            this.isBatchOperation = '暂扣';
            this.isBatchShow = true;
            this.BatchOperation.batchOrderId = row.order_id;
            this.BatchOperation.batchPlatform = row.platform_code;
            this.BatchOperation.batchUserId = row.batchUserId;
        },
        //作废
        orderToVoid(row) {
            if(this.isCancelTransaction)this.isCancelTransaction=false;
            this.isBatchOperation = '作废';
            this.isBatchShow = true;
            this.BatchOperation.batchOrderId = row.order_id;
            this.BatchOperation.batchPlatform = row.platform_code;
            this.BatchOperation.batchUserId = row.batchUserId;
        },
        //暂扣、作废、批量弹窗关闭
        batchOperationCancel() {
            this.BatchOperation.batchRemark = '';
            this.isBatchShow = false
            this.result = {
                isShowResult:false,
                resultType:'暂扣',
                failure:"",
                success:""
            }
        },
        //暂扣、作废、批量暂扣、批量作废、批量备注
        handleBatchOperation() {
            let obj = {}
            if (this.isBatchOperation == "暂扣" || this.isBatchOperation == "批量暂扣") {
                obj = {
                    order_id_list: this.BatchOperation.batchOrderId,
                    remark: this.BatchOperation.batchRemark,
                    platform_code: this.BatchOperation.batchPlatform
                }
            } else {
                obj = {
                    order_id: this.BatchOperation.batchOrderId,
                    remark: this.BatchOperation.batchRemark,
                    platform_code: this.BatchOperation.batchPlatform
                }
            }
            this.$refs["BatchOperation"].validate(res => {
                if (res) {
                    switch (this.isBatchOperation) {
                        case "作废":
                            toVoidInfo(obj).then(({data}) => {
                                if (data.status) {
                                    this.$message.success('操作成功！');
                                    this.handleQueryInfo({}, true);
                                } else {
                                    this.$message.error(data.errorMess || '操作失败！');
                                }
                            })
                            break;
                        case "暂扣":
                            withhold(obj).then(({data}) => {
                                if (data.status) {
                                    this.$message.success('操作成功！');
                                    this.handleQueryInfo({}, true);
                                } else {
                                    this.$message.error(data.errorMess || '操作失败！');
                                }
                            })
                            break;
                    }
                }
            });
        },
        //取消暂扣、取消作废
        cancelOrderWithhold(row,num) {
            let cancelWithhold = {
                order_id: row.order_id,
                platform_code: row.platform_code,
                type: num
            }
            batchCancelWithhold(cancelWithhold).then(({data}) => {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleQueryInfo({}, true);
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                }
            })
        },

        //登记收款弹窗控制
        handleRegisterGathering(row) {
            if(row.payment_status=='0'||row.payment_status==''){
                this.$message.error('该订单未付款，不能进行收款登记操作！');
                return;
            }
            let obj = {
                order_id: row.order_id,
                platform_code: row.platform_code,
                account_id:row.account_id
            }
            registeredReceivablesData(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.RegisteredReceivablesInfo=data.data_list
                this.order = row;
                this.sendRegisteredReceivablesInfo.receipt_bank = this.RegisteredReceivablesInfo.receipt_bank
                this.sendRegisteredReceivablesInfo.platform_code = row.platform_code; //平台
                this.sendRegisteredReceivablesInfo.order_id = row.order_id; //订单号
                this.sendRegisteredReceivablesInfo.account_id = row.account_id; //账号id
                this.sendRegisteredReceivablesInfo.buyer_id = row.buyer_id; //客户ID
                this.sendRegisteredReceivablesInfo.receipt_type = '1';
            })
            this.isRegisteredReceivables = !this.isRegisteredReceivables;
        },

        //日志
        handleOrderLog(id){
            let obj = {
                id: id
            }
            this.isShowLogShow = true
            returnGoodsHomeLog(obj).then(({data}) => {
                if (data.status !== 1) {
                    // this.$message.error(data.errorMess);
                    return
                }
                this.showLogTableData = data.data_list.value;
            }).catch(err => {
                console.log(err);
            });
        },

        //驳回
        handleReject(row){
            this.reject = {
                id: row.id,
                reason:''
            }
            this.isReject = true;
        },
        handleRejectCancel(){
            this.reject = {
                id: '',
                reason:''
            };
            this.isReject = false;
            this.$refs['reject'].resetFields();
        },
        handleRejectConfirm(){
            returnGoodsHomeReject(this.reject).then(({data}) => {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleRejectCancel();
                    this.handleQueryInfo({}, true);
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                }
            }).catch(err => {
                console.log(err);
            });
        },

        //暂不处理
        TemporarilyHandle(row){
            this.$confirm('确定暂不处理该退件？', '暂不处理', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                returnGoodsHomeHangup({id:[row.id]}).then(({data}) => {
                    if (data.status) {
                        this.$message.success('操作成功！');
                        this.handleQueryInfo({}, true);
                    } else {
                        this.$message.error(data.errorMess || '操作失败！');
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        //消息跳转
        goMessagejump(row){
            this.$router.push({path:'/EbayMessage',query:{type:"EbayDomesticRefund",order_id: row.order_id, message_type: 2, _cacheType:'1'}});
            let inx = routerConfig.getRouteIndex('/EbayMessage')
            storage.setSessionStorage('navActive', inx);
            let to = routerConfig.navJumpFn(inx);
            this.$store.commit('SAVE_NAV_INDEX', inx);
            // 保存到多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name:  to.name,
                index: inx
            });
        },
        //纠纷跳转
        handleGoDispute(item) {
            let inx='';
            if(item.type=='INR'){
                this.$router.push({path:'/EbayINR',query:{type:"EbayDomesticRefund",inquiry_id:item.inquiry_id, _cacheType:'1'}});
                inx = routerConfig.getRouteIndex('/EbayINR');
            }else if(item.type=='CANCEL'){
                this.$router.push({path:'/EbayCancel',query:{type:"EbayDomesticRefund",cancel_id:item.cancel_id, _cacheType:'1'}});
                inx = routerConfig.getRouteIndex('/EbayCancel');
            }else if(item.type=='RETURN'){
                this.$router.push({path:'/EbayReturn',query:{type:"EbayDomesticRefund",return_id:item.return_id, _cacheType:'1'}});
                inx = routerConfig.getRouteIndex('/EbayReturn');
            }
            storage.setSessionStorage('navActive', inx);
            let to = routerConfig.navJumpFn(inx);
            this.$store.commit('SAVE_NAV_INDEX', inx);
            // 保存到多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name:  to.name,
                index: inx
            });
        },
        //评价跳转
        goFeedBackjump(row){
            this.$router.push({path:'/EbayEvaluateFeedBack',query:{type:"EbayDomesticRefund",order_id: row.order_id, _cacheType:'1'}});
            let inx = routerConfig.getRouteIndex('/EbayEvaluateFeedBack')
            storage.setSessionStorage('navActive', inx);
            let to = routerConfig.navJumpFn(inx);
            this.$store.commit('SAVE_NAV_INDEX', inx);
            // 保存到多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name:  to.name,
                index: inx
            });
        },
        //售后单跳转
        handleAfterSaleList(item){
            this.$router.push({path:'/EbayAfterSalesOrderManagement',query:{after_order_number: item.after_sale_id, _cacheType:'1'}});
            let inx = routerConfig.getRouteIndex('/EbayAfterSalesOrderManagement')
            storage.setSessionStorage('navActive', inx);
            let to = routerConfig.navJumpFn(inx);
            this.$store.commit('SAVE_NAV_INDEX', inx);
                // 保存到多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name:  to.name,
                index: inx
            });
        },
    },
    created(){
        this.handleGetTag();
    }
}
</script>

<style lang="less" scoped>
    table {
        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        font-size: 12px;

        td {
            border-top: 1px solid #e6e6e6;
            border-left: 1px solid #e6e6e6;
            padding: 5px 10px;
        }
    }
    .triangle {
        display: inline-block;
        border-top: 5px solid #5196fe;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid transparent;
        position: relative;
        top: 3px;
    }
</style>
<style  lang="less">
    .orderRemark{
        word-wrap:break-word;
    }
    .afterId{
        max-height: 500px;
        overflow-y: auto;
    }
    .templateChange{
        padding: 5px;
        /deep/.el-dialog{
            z-index: 2200 !important;
        }
    }
</style>