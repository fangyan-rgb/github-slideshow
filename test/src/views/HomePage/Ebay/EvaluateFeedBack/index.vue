<style lang="less" scoped>
.commontablestyle{
    td{
        padding-top: 6px;
        padding-bottom: 6px;
    }
}
</style>

<template>
    <div class="EbayEvaluateFeedBackwrap">
        <div class="EbayEvaluateFeedBackbox">

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
                    <span v-for="item in optionListLabel.batchEditArr">
                        <el-button
                            v-if="(buttonList[item.button].permit(thisVm)) && ![8, 9].find(e => e === item.id)"
                            @click="batchEditFn(item.id)"
                            size="small"
                            type="text"
                            style='color: #333 !important;'
                            :key="item.id">
                            <i :class="'icon-' + item.iconName" :style="{color: item.color, fontSize: '12px'}"></i>{{item.name}}
                        </el-button>
                        <el-button
                            v-if="(buttonList[item.button].permit(thisVm)) && [8, 9].find(e => e === item.id)"
                            @click="handleCopyEmpty(saveCheckInfo.map(e => {if(item.id === 8){return e.item_id};if(item.id === 9){return e.account_name};}).join(','))"
                            :data-clipboard-text="saveCheckInfo.map(e => {if(item.id === 8){return e.item_id};if(item.id === 9){return e.account_name};}).join(',')"
                            class="copyBtn"
                            size="small"
                            type="text"
                            style='color: #333 !important;'
                            :key="item.id">
                            <i :class="'icon-' + item.iconName" :style="{color: item.color, fontSize: '12px'}"></i>{{item.name}}
                        </el-button>
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
                    <template slot-scope="scope" slot="reviewinfo">
                        <div>评价ID：{{scope.row.feedback_id}}</div>
                        <div>买家评分：{{scope.row.commenting_user_score}}</div>
                        <div>级别：{{scope.row.comment_type}}</div>
                        <div>
                            <el-popover
                                placement="top"
                                width="260"
                                trigger="hover">
                                <div v-html="spaceConversionFn(scope.row.comment_text)" style="max-height: 400px; overflow-y: auto;"></div>
                                <a v-html="'内容：' + spaceConversionFn(scope.row.comment_text)" href="javascript:;" class="ellipsis2" slot="reference"></a>
                            </el-popover>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="accountinfo">
                        <div>平台账号：{{scope.row.account_name}}</div>
                        <div>刊登地点：{{scope.row.site}}</div>
                        <div>消息状态：<a v-if="scope.row.message_status != '无消息'" @click="gotoMessagePageFn(scope.row.order_id)" href="javascript:;" style="color: #3388ff;">{{scope.row.message_status}}</a><span v-else>{{scope.row.message_status}}</span>
                        </div>
                        <div>处理状态：{{scope.row.status}}</div>
                        <div>客服人员：{{scope.row.user_name}}</div>
                    </template>
                    <template slot-scope="scope" slot="orderinfo">
                        <div>订单号：<span style="cursor: pointer;color: #3388ff;" @click="handleOrderInfo(scope.row)">{{scope.row.order_id}}</span></div>
                        <div>平台订单号：{{scope.row.order_line_item_id}}</div>
                        <div>订单类型：{{scope.row.order_type}}</div>
                        <div>订单状态：{{scope.row.order_status}}</div>
                        <div>买家ID：{{scope.row.buyer_id}}</div>
                        <div>产品金额：{{scope.row.item_price}}</div>
                    </template>
                    <template slot-scope="scope" slot="productinfo">
                        <div>Item ID：<a target="_blank" style="color: #3388ff;" :href="'https://www.ebay.com/itm/' + scope.row.item_id">{{scope.row.item_id}}</a></div>
                        <div>公司SKU：
                            <ProdInfoPopup :list="scope.row.order_detail">
                                {{scope.row.sku}}
                            </ProdInfoPopup>
                        </div>
                        <div>产品名称：{{scope.row.item_title}}</div>
                        <div>公司产品线：{{scope.row.linelist_cn_name}}</div>
                    </template>
                    <template slot-scope="scope" slot="aftersalesinfo">
                        <div>售后问题：<a v-if="scope.row.after_pr != '无'" @click="gotoAfterOrderPageFn(scope.row.order_id)" href="javascript:;" style="color: #3388ff;">{{scope.row.after_pr}}</a><span v-else>{{scope.row.after_pr}}</span></div>
                        <div>不良类型：<a @click="handleChangeRowDutyFn(scope.row)" href="javascript:;" style="color: #3388ff;">{{scope.row.department_id_name}}</a></div>
                        <div>不良原因：<a @click="handleChangeRowDutyFn(scope.row)" href="javascript:;" style="color: #3388ff;">{{scope.row.reason_id_name}}</a></div>
                    </template>
                    <template slot-scope="scope" slot="keepstatusremark">
                        <div>跟进状态：<a @click="handleChangeRowKeepFn(scope.row)" href="javascript:;" style="color: #3388ff;">{{scope.row.step_id_name}}</a></div>
                        <div>链接剩余时间：{{scope.row.remaining_time}}</div>
                        <div>备注：{{scope.row.remark}}</div>
                    </template>
                    <template slot-scope="scope" slot="sendinfo">
                        <div>发货仓库：{{scope.row.ship_warehouse}}</div>
                        <div>发货方式：{{scope.row.ship_code}}</div>
                        <div>收货国家：{{scope.row.ship_country}}</div>
                        <div>跟踪号：<a :href="'https://t.17track.net/en#nums=' + scope.row.track_number" style="color: #3388ff;" target="_blank">{{scope.row.track_number}}</a></div>
                    </template>
                    <template slot-scope="scope" slot="timeinfo">
                        <div>评论时间：{{scope.row.comment_time}}</div>
                        <div>发货时间：{{scope.row.shipped_date}}</div>
                        <div>付款时间：{{scope.row.paytime}}</div>
                        <div>发链时间：{{scope.row.send_link_time}}</div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['replyComment'].permit(thisVm)" @click="handleReplyFn(scope.row)" type="text" size="mini">回复评论</el-button>
                        <ComDivide v-if="buttonList['replyComment'].permit(thisVm)"/>
                        <el-button v-if="buttonList['messageLink'].permit(thisVm)" @click="handleMessageLinkFn(scope.row)" type="text" size="mini">消息联系</el-button>
                        <ComDivide v-if="buttonList['messageLink'].permit(thisVm)"/>
                        <!-- <el-button v-if="buttonList['mailLink'].permit(thisVm)" @click="fn(scope.row)" type="text" size="mini">邮件联系</el-button>
                        <ComDivide v-if="buttonList['mailLink'].permit(thisVm)"/> -->
                        <el-button v-if="buttonList['log'].permit(thisVm)" @click="handleLogFn(scope.row.id)" type="text" size="mini">日志</el-button>
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

        </div>

        <!-- 操作日志 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="日志"
            :visible.sync="logInfo.isShowLog">
            <ComPreviewTable
                :isAdaptiveHeight="false"
                :logKey="logInfo.tableKey"
                :logProps="logInfo.tableProps"
                :logData="logInfo.tableData"
                :logWidth="logInfo.tableWidth">
            </ComPreviewTable>
        </el-dialog>

        <!-- 回复评论 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="feedback回复评论"
            :visible.sync="replyToCommentObj.dialog"
            top="5vh"
            width="1016px">
            <div>
                <div style="color: #333; font-weight: bold; margin: 0 0 6px;">基础信息</div>
                <table class="commontablestyle" cellspacing="0" cellpadding="0">
                    <tr>
                        <td width="98" style="background: #fafafa;">订单号</td>
                        <td width="185">{{replyToCommentObj.data.order_id}}</td>
                        <td width="98" style="background: #fafafa;">产品金额</td>
                        <td width="185"><span style="color: #ff9b00;">{{replyToCommentObj.data.item_price + ' ' + replyToCommentObj.data.currency}}</span></td>
                        <td width="98" style="background: #fafafa;">运费</td>
                        <td><span v-if="replyToCommentObj.data.ship_price" style="color: #ff9b00;">{{replyToCommentObj.data.ship_price + ' ' + replyToCommentObj.data.currency}}</span></td>
                    </tr>
                    <tr>
                        <td style="background: #fafafa;">总金额</td>
                        <td><span v-if="replyToCommentObj.data.total_price" style="color: #ff9b00;">{{replyToCommentObj.data.total_price + ' ' + replyToCommentObj.data.currency}}</span></td>
                        <td style="background: #fafafa;">item id</td>
                        <td>{{replyToCommentObj.data.item_id}}</td>
                        <td style="background: #fafafa;">商品名称</td>
                        <td>{{replyToCommentObj.data.item_cn_title}}</td>
                    </tr>
                </table>

                <div style="color: #333; font-weight: bold; margin: 10px 0 6px;">发货信息</div>
                <table class="commontablestyle" cellspacing="0" cellpadding="0">
                    <tr>
                        <td width="98" style="background: #fafafa;">发货仓库</td>
                        <td width="185">{{replyToCommentObj.data.warehouse_name}}</td>
                        <td width="98" style="background: #fafafa;">邮寄方式</td>
                        <td width="185">{{replyToCommentObj.data.shipped_name}}</td>
                        <td width="98" style="background: #fafafa;">跟踪号</td>
                        <td><a :href="'https://t.17track.net/en#nums=' + replyToCommentObj.data.track_number" style="color: #3388ff;" target="_blank">{{replyToCommentObj.data.track_number}}</a></td>
                    </tr>
                    <tr>
                        <td style="background: #fafafa;">发货地址</td>
                        <td colspan="5">
                            <span v-if="replyToCommentObj.data.ship_name">{{replyToCommentObj.data.ship_name}},</span>
                            <span v-if="replyToCommentObj.data.ship_phone">{{replyToCommentObj.data.ship_phone}},</span>
                            <span v-if="replyToCommentObj.data.ship_street1">{{replyToCommentObj.data.ship_street1}},</span>
                            <span v-if="replyToCommentObj.data.ship_street2">{{replyToCommentObj.data.ship_street2}},</span>
                            <span v-if="replyToCommentObj.data.ship_city_name">{{replyToCommentObj.data.ship_city_name}},</span>
                            <span v-if="replyToCommentObj.data.ship_stateorprovince">{{replyToCommentObj.data.ship_stateorprovince}},</span>
                            <span v-if="replyToCommentObj.data.ship_zip">{{replyToCommentObj.data.ship_zip}},</span>
                            <span v-if="replyToCommentObj.data.ship_country_name">{{replyToCommentObj.data.ship_country_name}}</span>
                        </td>
                    </tr>
                </table>

                <div style="color: #333; font-weight: bold; margin: 10px 0 6px;">feedback信息</div>
                <table class="commontablestyle" cellspacing="0" cellpadding="0">
                    <tr>
                        <td width="98" style="background: #fafafa;">发送更改链接时间</td>
                        <td width="185">{{replyToCommentObj.data.send_link_time}}</td>
                        <td width="98" style="background: #fafafa;">客户留评</td>
                        <td width="185">{{replyToCommentObj.data.comment_text}}</td>
                        <td width="98" style="background: #fafafa;">留评时间</td>
                        <td>{{replyToCommentObj.data.comment_time}}</td>
                    </tr>
                </table>

                <div style="color: #333; font-weight: bold; margin: 10px 0 6px;">处理信息</div>
                <table class="commontablestyle" cellspacing="0" cellpadding="0">
                    <tr>
                        <td width="98" style="background: #fafafa;">不良类型 <span v-if="replyToCommentObj.row.comment_type == 'Negative'" style="color: #f00;">*</span></td>
                        <td width="185"><a @click="handleChangeDutyFn()" href="javascript:;" style="color: #3388ff;">{{replyToCommentObj.data.department_id_name}}</a></td>
                        <td width="98" style="background: #fafafa;">不良原因 <span v-if="replyToCommentObj.row.comment_type == 'Negative'" style="color: #f00;">*</span></td>
                        <td width="185"><a @click="handleChangeDutyFn()" href="javascript:;" style="color: #3388ff;">{{replyToCommentObj.data.reason_id_name}}</a></td>
                        <td width="98" style="background: #fafafa;">跟进状态 <span v-if="replyToCommentObj.row.comment_type == 'Negative'" style="color: #f00;">*</span></td>
                        <td><a @click="handleChangeKeepFn()" href="javascript:;" style="color: #3388ff;">{{replyToCommentObj.data.step_id_name}}</a></td>
                    </tr>
                    <tr>
                        <td style="background: #fafafa;">备注</td>
                        <td colspan="5">{{replyToCommentObj.data.remark}}</td>
                    </tr>
                </table>

                <div style="color: #333; font-weight: bold; margin: 10px 0 6px;">联系买家</div>
                <div style="padding-left: 12px;">
                    买家ID：{{replyToCommentObj.data.buyer_id}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button v-if="replyToCommentObj.row.message_status_name != '无消息'" @click="replyToCommentObj.dialog = false; gotoMessagePageFn(replyToCommentObj.row.order_id)" type="primary" size="mini">{{replyToCommentObj.row.message_status_name}}</el-button><el-button v-else type="primary" size="mini">{{replyToCommentObj.row.message_status_name}}</el-button> &nbsp;&nbsp;&nbsp;
                    <el-button @click="handleMessageLinkFn(replyToCommentObj.row)" type="primary" size="mini">发送消息</el-button>
                </div>

                <div style="color: #333; font-weight: bold; margin: 10px 0 6px;">商品图片</div>
                <div>
                    <span v-for="img in replyToCommentObj.data.product_img" style="margin: 0 6px 5px 0; display: inline-block; width: 100px; height: 100px; vertical-align: top; border: 1px solid #e6e6e6; overflow: hidden;">
                        <img :src="replyToCommentObj.data.product_img_host + img" @click="handleClickImg(replyToCommentObj.data.product_img.map(e => replyToCommentObj.data.product_img_host + e))" alt="" style="width: 100%; cursor: pointer;">
                    </span>
                </div>

                <div style="color: #333; font-weight: bold; margin: 10px 0 6px;">回复评论：</div>
                <div>
                    <el-form :model="replyToCommentObj.form" :rules="formRules" ref="replyToCommentObjForm" label-width="80px" label-position="top" size="small">
                        <el-form-item prop="response_text">
                            <el-input v-model="replyToCommentObj.form.response_text" type="textarea" :maxlength="replyToCommentObj.row.site == 'HongKong' ? 125 : 80" :disabled="replyToCommentObj.data.status == 2" show-word-limit placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span slot="footer">
                <el-button @click="replyToCommentObj.dialog = false" size="small">取 消</el-button>
                <el-button v-if="buttonList['tagDealWith'].permit(thisVm) && !['标记处理', '已处理'].includes(replyToCommentObj.row.status)" @click="handleTagProFn(replyToCommentObj.row)" type="primary" size="small">标记处理</el-button>
                <el-button type="primary" @click="submitReplyToCommentFn()" size="small" :disabled="replyToCommentObj.data.status == 2">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 不良类型 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="不良类型"
            :visible.sync="afterReasonObj.dialog"
            width="400px">
            <div>
                <el-form :model="afterReasonObj.form" :rules="formRules" ref="afterReasonObjForm" label-width="80px" size="small">
                    <el-form-item prop="department_id" label="不良类型：">
                        <el-select v-model="afterReasonObj.form.department_id" @change="departmentIdChange" clearable>
                            <el-option v-for="(value, index) in optionListLabel.afterReasonList" :key="index" :value="value.id" :label="value.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="reason_id" label="不良原因：">
                        <el-select v-model="afterReasonObj.form.reason_id" clearable>
                            <el-option v-for="(value, index) in ((optionListLabel.afterReasonList.find(e => e.id == afterReasonObj.form.department_id) || {}).child || [])" :key="index" :value="value.id" :label="value.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer">
                <el-button @click="afterReasonObj.dialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitAfterReasonFn()" size="small">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 修改跟进状态 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="修改跟进状态"
            :visible.sync="keepStatusObj.dialog"
            width="520px">
            <div>
                <el-form :model="keepStatusObj.form" :rules="formRules" ref="keepStatusObjForm" label-width="80px" size="small">
                    <el-form-item prop="step_id" label="跟进状态：">
                        <el-select v-model="keepStatusObj.form.step_id" clearable>
                            <el-option v-for="(value, index) in optionListLabel.keepStatusList" :key="index" :value="value.id" :label="value.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="keepStatusObj.form.remark" type="textarea" :rows="5" placeholder="请输入" maxlength="250" show-word-limit></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer">
                <el-button @click="keepStatusObj.dialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitKeepStatusFn()" size="small">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 发送消息 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="发送消息"
            :visible.sync="sendMessageObj.dialog"
            top="5vh"
            width="777px">
            <div>
                <el-form :model="sendMessageObj.form" :rules="formRules" ref="sendMessageObjForm" label-width="90px" size="small">
                    <el-form-item label-width="0">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="选择模板：">
                                    <el-select v-model="sendMessageObj.form.tmp_id" @change="templateChange" filterable v-filter>
                                        <el-option v-for="(v, k, i) in optionListLabel.templateList" :key="i" :value="k" :label="v">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="" label="个性标签：">
                                    <el-select v-model="sendMessageObj.form.tag_id" filterable v-filter clearable>
                                        <el-option
                                            v-for="(v, i) in optionListLabel.tagList"
                                            :key="i"
                                            :label="v.value"
                                            :value="v.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="翻译后语言：">
                        <ComSelectLanguageV2 @change="changeLanguage" @translate="googleTranslate()" :list="optionListLabel.google_lang_code" notxt ref="ComSelectLanguageV2"/>
                    </el-form-item>
                    <el-form-item prop="reply_content_en" :label="sendMessageObj.languageCode ? '翻译前：' : ''">
                        <el-input v-model="sendMessageObj.form.reply_content_en" type="textarea" :rows="sendMessageObj.languageCode ? '15' : '31'" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item v-if="sendMessageObj.languageCode" label="翻译后：">
                        <el-input v-model="sendMessageObj.form.reply_content" type="textarea" :rows="15" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer">
                <el-button @click="sendMessageObj.dialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitSendMessageFn()" size="small">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 批量客服 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="批量客服"
            width="430px"
            :visible.sync="batchEditObj.batchKefuDialog">
            <div>
                <el-form :model="batchEditObj.batchKefuForm" :rules="formRules" ref="batchKefuForm" size="small" label-width="100px">
                    <el-form-item prop="one" label="批量客服：">
                        <el-select
                            v-model="batchEditObj.batchKefuForm.one"
                            clearable
                            filterable
                            v-filter
                            remote
                            :remote-method="userIdChangeRemoteMethod"
                            placeholder="请输入搜索"
                            size="small">
                            <el-option
                                v-for="(v, i) in optionListLabel.kefuList"
                                :label="v.value"
                                :value="v.id"
                                :key="i">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="batchEditObj.batchKefuDialog = false" size="small">取 消</el-button>
                <el-button @click="batchKefusubmitFn()" type="primary" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 预览图片 -->
        <PreviewImg :show.sync="imgPopPreview.pop_preview" :src="imgPopPreview.thumb_url"></PreviewImg>

        <!-- 订单详情弹窗 -->
        <OrderInformation
            v-if="isOrderInfoShow"
            @handleCancelOrderInfoPopup="handleCancelOrderInfoPopup"
            :isOrderInfoShow="isOrderInfoShow"
            :orderInfo="orderInfo"
            :afterSalesOrderEdit="afterSalesOrderEditInfo"
            @handleEditAfterSaleList="handleQueryInfo({}, true);"
            @handleAfterSaleList="isOrderInfoShow=false; handleQueryInfo({after_order_number: $event})"
        ></OrderInformation>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
import config from '@/assets/js/config';
import {
    getMainList,
    getLogs,
    getReplyData,
    setReplyData,
    getAfterReason,
    setAfterReason,
    getFollowUp,
    setFollowUp,
    dataOutput,
    getSendMessage,
    setSendMessage,
    setSignStatus,
    saveKefu,
} from '@/api/Ebay/EvaluateFeedBack';
import {
    getGoogleTranslate,
    getTemplateDetail,
} from '@/api/MailCenterManagement/PostMail';
import {
    getTag,
    getkefu,
} from '@/api/MailCenterManagement/Inbox';
import ProdInfoPopup from '@/views/HomePage/Ebay/components/ProdInfoPopup';
import ComSelectLanguageV2 from "@/views/HomePage/MailCenterManagement/PostMail/components/ComSelectLanguageV2";
import { getSessionStorage } from '@/utils/storage';
import OrderInformation from "@/views/HomePage/OrderManagement/OrderInformation";
import routerConfig from '@/router/routerConfig';
import * as storage from '@/utils/storage';
// 复制到剪贴板功能
import Clipboard from 'clipboard';
let clipboard = new Clipboard('.copyBtn');

export default {
    name: 'EbayEvaluateFeedBack',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['评价信息', '账号信息', '订单信息', '产品信息', '售后原因', '跟进状态/备注', '发货信息', '时间信息', '操作'],
            tableProps: ['reviewinfo', 'accountinfo', 'orderinfo', 'productinfo', 'aftersalesinfo', 'keepstatusremark', 'sendinfo', 'timeinfo', 'operate'],
            tableWidth: ['160', 'accountinfo', 'orderinfo', 'productinfo', '200', 'keepstatusremark', 'sendinfo', '200', '165'],
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

            optionListLabel: {
                curBatchEditId: '',
                batchEditArr: [
                    {id: 1, name: '批量修改跟进状态', button:'batchEditKeep', iconName:"genjinzhuangtai", color:'#ff9860'},
                    {id: 5, name: '批量修改客服', button:'batchChangeCust', iconName:"piliangfenpeikefu", color:'#72afff'},
                    {id: 8, name: '批量复制Item ID', button:'copyItemID', iconName:"fuzhi", color:'#6facff'},
                    {id: 9, name: '批量复制账号', button:'copyAccount', iconName:"fuzhi", color:'#6facff'},
                    {id: 2, name: '数据导出', button:'dataExport', iconName:"shujuxiazai", color:'#6facff'},
                ],
                afterReasonList: [],
                keepStatusList: [],
                templateList: {},
                google_lang_code: {},
                tagList: [],
                kefuList: [],
            },

            formRules:{
                response_text: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                department_id: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                reason_id: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                step_id: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                remark: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                reply_content_en: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                tag_id: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                one: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
            },

            // 日志相关
            logInfo: {
                tableData: [],
                tableProps: [],
                tableKey: ['操作事项', '操作人', '操作时间'],
                tableWidth: ['', '', ''],
                isShowLog: false,
            },

            // 回复评论相关
            replyToCommentObj: {
                dialog: false,
                form: {
                    id: '',
                    response_text: '',
                },
                data: {},
                row: {},
            },

            // 图片预览相关
            imgPopPreview: {
                pop_preview: false,
                thumb_url: '',
            },

            // 修改不良类型相关
            afterReasonObj: {
                dialog: false,
                isbatch: false,
                form: {
                    id: '',
                    department_id: '',
                    reason_id: '',
                },
            },

            // 修改跟进状态相关
            keepStatusObj: {
                dialog: false,
                isbatch: false,
                form: {
                    id: '',
                    step_id: '',
                    remark: '',
                },
            },

            // 消息联系相关
            sendMessageObj: {
                dialog: false,
                languageCode: '',
                form: {
                    feedback_id: '',
                    tmp_id: '',
                    tag_id: '',
                    tag: '',
                    reply_title: '',
                    reply_content: '',
                    reply_content_en: '',
                    ebay_order: [
                        {
                            sender: '',
                            item_id: '',
                            question_type: '',
                            account_id: '',
                            recipient_id: '',
                            platform_order_id: '',
                            template_id: '',
                        },
                    ],
                },
            },

            // 批量处理
            batchEditObj: {
                batchKefuDialog: false,
                batchKefuForm: {
                    one: ''
                }
            },

            // 订单弹窗相关
            isOrderInfoShow:false,  //订单详情弹窗
            orderInfo:{},
            afterSalesOrderEditInfo:{},
        }
    },
    components: {ProdInfoPopup, ComSelectLanguageV2, OrderInformation},
    computed: {
        ...mapGetters([
            'queryParamsInfo',
        ]),
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList']
        },
    },
    activated() {

    },
    mounted() {
        // this.handleQueryInfo();
        // 复制到剪贴板功能
        clipboard.on('success', e => {
            // this.$message.success('复制成功！');
            e.clearSelection();
        });

        clipboard.on('error', e => {
            this.$message.error('复制失败！');
        });
    },
    methods: {
        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo(params, isSave, isComSearch) {
            this.queryData.mainQuery = {...(params || {})};     // 用来缓存
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo['Ebay_Evaluate_FeedBack']);
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
                page: isSave ? this.pageData.currentPage : 1,     // 不取缓存就要重置页数
                limit: this.pageData.currentList
            };

            this.tableLoading = true;
            getMainList(obj).then(({data}) => {
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
                key: 'Ebay_Evaluate_FeedBack',
                value: JSON.stringify(this.queryData)
            });
            data.data_list.value.forEach(e => {
                e.step_id = e.step_id == '0' ? '' : e.step_id;
                e.department_id = e.department_id == '0' ? '' : e.department_id;
                e.reason_id = e.reason_id == '0' ? '' : e.reason_id;
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

        // 执行操作回调
        handleOperationCallBack(data) {
            if (data.status) {
                this.$message.success('操作成功！');
                this.saveCheckInfo = [];
                this.saveCheckIds = '';
                this.handleQueryInfo({}, true);
            } else {
                this.$message.error(data.errorMess || '操作失败！');
            }
        },

        // 处理复制数据为空的时候
        handleCopyEmpty(str) {
            if( !this.saveCheckInfo.length ){
                this.$message.warning('请先勾选数据！');
                return false;
            }
            if( !str ){
                this.$message.warning('数据为空，无法复制！');
                return false;
            }
            this.$message.success('复制成功！');
        },

        // 批量操作
        batchEditFn(id) {
            id = id || this.optionListLabel.curBatchEditId;
            switch (id) {
                case 1:
                    // 批量修改跟进状态
                    this.batchChangeKeep();
                    break;
                case 2:
                    // 数据导出
                    this.dataDownloadFn();
                    break;
                case 5:
                    // 批量修改客服
                    this.batchKefu();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },

        // 批量修改跟进状态
        batchChangeKeep() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.changeKeepCommonFn({isbatch: true, id: this.saveCheckIds, step_id: ''});
        },
        changeKeepCommonFn({isbatch, id, step_id}) {
            this.keepStatusObj.dialog = true;
            this.keepStatusObj.isbatch = isbatch;
            this.keepStatusObj.form = {
                id,
                step_id: step_id ? parseInt(step_id) : '',
                remark: '',
            };
            this.$nextTick(() => {
                this.$refs.keepStatusObjForm.clearValidate();
            });
            if( !this.optionListLabel.keepStatusList.length ){
                getFollowUp().then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.optionListLabel.keepStatusList = data.data_list;
                }).catch(error => {

                });
            }
        },
        submitKeepStatusFn() {
            this.$refs.keepStatusObjForm.validate((valid) => {
                if (valid) {
                    setFollowUp({...this.keepStatusObj.form}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.$message.success('修改跟进状态成功！');
                        this.keepStatusObj.dialog = false;
                        if( this.keepStatusObj.isbatch ) {
                            this.handleOperationCallBack(data);
                        }else{
                            this.replyToCommentObj.data.step_id = this.keepStatusObj.form.step_id;
                            this.replyToCommentObj.data.step_id_name = this.optionListLabel.keepStatusList.find(e => e.id == this.replyToCommentObj.data.step_id).name;
                            this.replyToCommentObj.data.remark = this.keepStatusObj.form.remark;
                        }
                    }).catch(error => {

                    });
                }
            });
        },

        changeDutyCommonFn({isbatch, id, department_id, reason_id}) {
            this.afterReasonObj.dialog = true;
            this.afterReasonObj.isbatch = isbatch;
            this.afterReasonObj.form = {
                id,
                department_id,
                reason_id,
            };
            this.$nextTick(() => {
                this.$refs.afterReasonObjForm.clearValidate();
            });
            if( !this.optionListLabel.afterReasonList.length ){
                getAfterReason().then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.optionListLabel.afterReasonList = data.data_list;
                }).catch(error => {

                });
            }
        },
        departmentIdChange() {
            this.afterReasonObj.form.reason_id = '';
        },
        submitAfterReasonFn() {
            this.$refs.afterReasonObjForm.validate((valid) => {
                if (valid) {
                    setAfterReason({...this.afterReasonObj.form}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.$message.success('修改不良类型原因成功！');
                        this.afterReasonObj.dialog = false;
                        if( this.afterReasonObj.isbatch ) {
                            this.handleOperationCallBack(data);
                        }else{
                            this.replyToCommentObj.data.department_id = this.afterReasonObj.form.department_id;
                            this.replyToCommentObj.data.department_id_name = this.optionListLabel.afterReasonList.find(e => e.id == this.afterReasonObj.form.department_id).name;
                            this.replyToCommentObj.data.reason_id = this.afterReasonObj.form.reason_id;
                            this.replyToCommentObj.data.reason_id_name = this.optionListLabel.afterReasonList.find(e => e.id == this.afterReasonObj.form.department_id).child.find(e => e.id == this.afterReasonObj.form.reason_id).name;
                        }
                    }).catch(error => {

                    });
                }
            });
        },

        // 数据导出
        dataDownloadFn() {
            this.$confirm('是否导出数据？', '提示', {
                type: 'warning'
            }).then(() => {
                let data = JSON.parse(this.queryParamsInfo['Ebay_Evaluate_FeedBack'] || '{}');
                let datastr = {};
                Object.keys(data).forEach(e => {
                    if( e == 'mainQuery' ){
                        Object.keys(data[e]).forEach(j => {
                            datastr[j] = data[e][j];
                        });
                    }else{
                        datastr[e] = data[e];
                    }
                });
                dataOutput({
                    ...datastr
                }).then(({data}) => {

                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {

            });
        },

        // 日志
        handleLogFn(id) {
            getLogs({
                id,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.logInfo.isShowLog = true;
                this.logInfo.tableData = data.data_list;
                this.logInfo.tableProps = ['behavior', 'created_by_name', 'created_at'];
            }).catch(error => {

            });
        },

        // 标记处理
        handleTagProFn(row) {
            this.$confirm('是否标记处理？', '提示', {
                type: 'warning'
            }).then(() => {
                setSignStatus({id: row.id}).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.replyToCommentObj.dialog = false;
                    this.handleOperationCallBack(data);
                }).catch(error => {

                });
            }).catch(() => {

            });
        },

        // 回复评论
        handleReplyFn(row) {
            this.replyToCommentObj.dialog = true;
            this.replyToCommentObj.form = {
                id: row.id,
                response_text: '',
            };
            this.replyToCommentObj.row = row;
            this.replyToCommentObj.data = {};
            this.$nextTick(() => {
                this.$refs.replyToCommentObjForm.clearValidate();
            });
            getReplyData({id: row.id}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                data.data_list.step_id = data.data_list.step_id == '0' ? '' : data.data_list.step_id;
                data.data_list.department_id = data.data_list.department_id == '0' ? '' : data.data_list.department_id;
                data.data_list.reason_id = data.data_list.reason_id == '0' ? '' : data.data_list.reason_id;
                this.replyToCommentObj.data = data.data_list;
                if( this.replyToCommentObj.data.status == 2 ){
                    this.replyToCommentObj.form.response_text = data.data_list.response_text;
                }
            }).catch(error => {

            });
        },
        submitReplyToCommentFn() {
            if( this.replyToCommentObj.row.comment_type == 'Negative' && (!this.replyToCommentObj.data.step_id || !this.replyToCommentObj.data.department_id || !this.replyToCommentObj.data.reason_id) ) {
                this.$message.warning('请选择责任原因和跟进状态！')
                return;
            }
            this.$refs.replyToCommentObjForm.validate((valid) => {
                if (valid) {
                    setReplyData({...this.replyToCommentObj.form}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.replyToCommentObj.dialog = false;
                        this.handleOperationCallBack(data);
                    }).catch(error => {

                    });
                }
            });
        },
        handleChangeDutyFn() {
            this.changeDutyCommonFn({isbatch: false, id: this.replyToCommentObj.form.id, department_id: this.replyToCommentObj.data.department_id, reason_id: this.replyToCommentObj.data.reason_id});
        },
        handleChangeKeepFn() {
            this.changeKeepCommonFn({isbatch: false, id: this.replyToCommentObj.form.id, step_id: this.replyToCommentObj.data.step_id});
        },

        // 列表直接修改不良类型、不良原因
        handleChangeRowDutyFn(row) {
            this.changeDutyCommonFn({isbatch: true, id: row.id, department_id: row.department_id, reason_id: row.reason_id});
        },

        // 列表直接修改跟进状态
        handleChangeRowKeepFn(row) {
            this.changeKeepCommonFn({isbatch: true, id: row.id, step_id: row.step_id});
        },

        // 点击放大图片
        handleClickImg(url) {
            if (url) {
                this.imgPopPreview.thumb_url = url;
                this.imgPopPreview.pop_preview = true;
            }
        },

        // 获取个性标签
        getTagFn() {
            if( !this.optionListLabel.tagList.length ){
                getTag({platform_code: 'EB'}).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.optionListLabel.tagList = data.data_list;
                }).catch(err => {

                });
            }
        },

        getSendMessageFn() {
            if( !Object.keys(this.optionListLabel.google_lang_code).length ){
                getSendMessage().then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.optionListLabel.templateList = data.data_list.template;
                    this.optionListLabel.google_lang_code = data.data_list.google_lang_code;
                }).catch(error => {

                });
            }
        },

        // 消息联系
        handleMessageLinkFn(row) {
            // 初始化数据
            this.sendMessageObj.dialog = true;
            this.sendMessageObj.form = {
                feedback_id: row.id,
                tmp_id: '',
                tag_id: '',
                tag: '',
                reply_title: '',
                reply_content: '',
                reply_content_en: '',
                ebay_order: [
                    {
                        sender: row.account_name,
                        item_id: row.item_id,
                        question_type: '2',
                        account_id: row.account_id,
                        recipient_id: row.buyer_id,
                        platform_order_id: row.platform_order_id,
                        template_id: '',
                    },
                ],
            };
            this.$nextTick(() => {
                this.$refs.sendMessageObjForm.clearValidate();
                this.$refs.ComSelectLanguageV2.changeItem('');
            });

            // 获取选项数据
            this.getSendMessageFn();
            this.getTagFn();
        },
        templateChange(id) {
            getTemplateDetail({id}).then(({data}) => {
                let str = this.sendMessageObj.form.reply_content_en;
                this.sendMessageObj.form.reply_content_en = (str ? str + '\n\n\n' : '') + data.data_list.values[0].template_content;
            });
        },
        changeLanguage(code) {
            this.sendMessageObj.languageCode = code;
        },
        googleTranslate() {
            if( !this.sendMessageObj.languageCode ) {
                this.$message.warning('请选择语言后再进行翻译！');
                return;
            }
            if( !this.sendMessageObj.form.reply_content_en ){
                return;
            }
            getGoogleTranslate({
                content: this.sendMessageObj.form.reply_content_en,
                after : this.sendMessageObj.languageCode,
                before : "auto"
            }).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.sendMessageObj.form.reply_content = data.after;
            });
        },
        submitSendMessageFn() {
            this.$refs.sendMessageObjForm.validate((valid) => {
                if (valid) {
                    this.sendMessageObj.form.ebay_order[0].template_id = this.sendMessageObj.form.tmp_id;
                    this.sendMessageObj.form.tag = this.optionListLabel.tagList.find(e => e.id == this.sendMessageObj.form.tag_id)?this.optionListLabel.tagList.find(e => e.id == this.sendMessageObj.form.tag_id).value:"";
                    setSendMessage({...this.sendMessageObj.form}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.sendMessageObj.dialog = false;
                        this.handleOperationCallBack(data);
                    }).catch(error => {

                    });
                }
            });
        },

        // 批量修改客服
        batchKefu() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.batchEditObj.batchKefuDialog = true;
            this.batchEditObj.batchKefuForm = {
                one: ''
            };
            this.$nextTick(() => {
                this.$refs.batchKefuForm.clearValidate();
            });
        },
        batchKefusubmitFn() {
            this.$refs.batchKefuForm.validate((valid) => {
                if (valid) {
                    let id = this.saveCheckInfo.map(e => e.id);
                    saveKefu({id, user_id: this.batchEditObj.batchKefuForm.one}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.batchEditObj.batchKefuDialog = false;
                        this.handleOperationCallBack(data);
                    }).catch(error => {

                    });
                }
            });
        },
        // 获取客服人员
        userIdChangeRemoteMethod(query) {
            if( query ){
                getkefu({account_name: query}).then(({data})=> {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    this.optionListLabel.kefuList = data.data_list;
                });
            }
        },

        // 订单弹窗相关
        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow = bool;
        },
        // // 修改信息
        // handleOperateModifyInfo(row) {
        //     this.orderInfo={
        //         order_id:row.order_id,
        //         platform_code:row.platform_code,
        //         edit:false,
        //         title:'订单信息',
        //         operation:'addNewAfterSaleSingle'
        //     }
        //     this.afterSalesOrderEditInfo=row;
        //     this.afterSalesOrderEditInfo.edit=true;
        //     this.isOrderInfoShow=true;
        // },
        //订单详情弹窗
        handleOrderInfo(row){
            this.orderInfo={
                order_id:row.order_id,
                platform_code:'EB',
                edit:false,
                title:'订单信息',
                operation:'handleOrder'
            }
            this.isOrderInfoShow=true;
        },

        // 跳往消息页面
        gotoMessagePageFn(id) {
            let path = '/EbayMessage';
            let query = {order_id: id, message_type: 2, _cacheType:'1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
        },

        // 跳往售后单页面
        gotoAfterOrderPageFn(id) {
            let path = '/EbayAfterSalesOrderManagement';
            let query = {order_id: id, _cacheType:'1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
        },

        changeNavShowFn(path, query = {}) {
            let idx = routerConfig.getRouteIndex(path);
            storage.setSessionStorage('navActive', idx);
            let to = routerConfig.navJumpFn(idx);
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name: to.name,
                index: idx,
                query
            });
            this.$store.commit('SAVE_NAV_INDEX', idx);
        },

        // 把空格替换
        spaceConversionFn(v) {
            return v ? v.replace(/\s/g, '&nbsp;') : '';
        }
    },
}
</script>
