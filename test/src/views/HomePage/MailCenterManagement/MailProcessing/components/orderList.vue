<style lang="less" scoped>
.orderinfowrap{
    .orderinfohead{
        min-height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;
        .orderinfoheadlist{
            flex: auto;
            display: flex;
            padding: 0 10px;
            & > div{
                width: 25%;
                flex: none;
                text-align: center;
                p{
                    padding: 0 10px;
                    a{
                        word-break: break-all;
                    }
                }
            }
        }
    }
}

.commontablea{
    width: 100%;
    border-top: 1px solid #e6e6e6;
    border-right: 1px solid #e6e6e6;
    td{
        border-left: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        padding: 9px;
        background: #fafafa;
        &:nth-child(2n){
            background: transparent;
        }
    }
    &.commontableb{
        tr{
            &:first-child{
                background: #fafafa;
            }
        }
        td{
            background: transparent;
        }
    }
}

.addmakewrap{
    display: flex;
    .centersel, .centerbtn{
        flex: none;
    }
    .centertxt{
        flex: auto;
        margin: 0 10px;
    }
}

.textfileitemwrap{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0 6px 6px;
    & > div{
        flex: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        & > div{
            padding: 0 6px 0 0;
        }
        .tit{
            flex: auto;
        }
        .rem{
            flex: none;
        }
        .man{
            width: 53px;
            text-align: center;
            flex: none;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .tim{
            flex: none;
        }
    }
    & > span{
        flex: none;
        display: none;
        color: #9ea09d;
        cursor: pointer;
    }
    &:hover{
        background: #fcf8ec;
        span{
            display: inline-block;
        }
    }
}
</style>

<template>
    <div class="MailProcessing_OrderListwrap">
        <div v-for="(v, i) in orderList" class="orderinfowrap">
            <div class="orderinfohead">
                <div class="orderinfoheadlist">
                    <div v-if="idx < 4" v-for="(order, idx) in chiledOrderList">
                        <el-popover
                            width="200"
                            trigger="hover"
                            :content="order.order_type">
                            <div slot="reference">
                                <p><a @click="handleOrderInfo(order)" href="javascript:;" style="color: #3388ff;">{{order.order_id}}</a></p>
                                <p><a :href="order.track_url" target="_blank" style="color: #3388ff;">{{order.tracking_number}}</a></p>
                            </div>
                        </el-popover>
                    </div>
                </div>
                <el-dropdown v-if="v.platform_code == 'AMAZON'" @command="changeOperation($event, v)">
                    <el-button type="primary" size="mini">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">新建售后单</el-dropdown-item>
                        <el-dropdown-item command="2">登记客诉单</el-dropdown-item>
                        <el-dropdown-item command="3">登记退款单</el-dropdown-item>
                        <el-dropdown-item
                            v-if="v.complete_status != 40"
                            :disabled="(v.amazon_fulfill_channel == 'FBM' && [19, 20].includes(v.complete_status)) || v.amazon_fulfill_channel == 'FBA'"
                            command="4">
                            作废
                        </el-dropdown-item>
                        <el-dropdown-item
                            v-if="(v.complete_status != 40 || v.complete_status != 45) && v.complete_status != 25"
                            :disabled="(v.amazon_fulfill_channel == 'FBM' && [19, 20].includes(v.complete_status)) || v.amazon_fulfill_channel == 'FBA'"
                            command="5">
                            暂扣
                        </el-dropdown-item>
                        <el-dropdown-item
                            v-if="v.complete_status == 25"
                            command="6">
                            取消暂扣
                        </el-dropdown-item>
                        <el-dropdown-item command="7">登记发票</el-dropdown-item>
                        <el-dropdown-item
                            :disabled="v.is_business_order != '1' || (v.site.toUpperCase() != 'DE' && v.site.toUpperCase() != 'IT' && v.site.toUpperCase() !='FR' && v.site.toUpperCase() != 'SP' && v.site.toUpperCase() != 'UK')"
                            command="8">
                            B2B发票
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown v-if="v.platform_code == 'EB'" @command="changeOperation($event, v)">
                    <el-button type="primary" size="mini">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">新建售后单</el-dropdown-item>
                        <el-dropdown-item command="2">登记客诉单</el-dropdown-item>
                        <el-dropdown-item command="3">登记退款单</el-dropdown-item>
                        <el-dropdown-item
                            v-if="v.complete_status != 40"
                            :disabled="[19, 20].includes(v.complete_status)"
                            command="4">
                            作废
                        </el-dropdown-item>
                        <el-dropdown-item
                            v-if="v.complete_status != 40 && v.complete_status != 45 && v.complete_status != 25"
                            :disabled="[19, 20].includes(v.complete_status)"
                            command="5">
                            暂扣
                        </el-dropdown-item>
                        <el-dropdown-item
                            v-if="v.complete_status == 25"
                            command="6">
                            取消暂扣
                        </el-dropdown-item>
                        <el-dropdown-item command="8">取消订单</el-dropdown-item>
                        <el-dropdown-item
                            v-if="v.order_type != '合并后的订单' && v.order_type != '拆分后的子订单' &&  v.order_type != '重寄后的订单'"
                            command="9">
                            留评
                        </el-dropdown-item>
                        <el-dropdown-item command="10">收款请求</el-dropdown-item>
                        <el-dropdown-item command="11">登记收款</el-dropdown-item>
                        <el-dropdown-item command="12">日志</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <table class="commontablea" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <div style="width: 60px;">
                            订单号
                            <p v-if="v.is_order_id == '1'" style="margin-top: 5px;">
                                <el-tag size="mini" style="background: #fd9727; color: #fff; border-color: #fd9727;">当前订单</el-tag>
                            </p>
                        </div>
                    </td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            <a @click="handleOrderInfo(v)" href="javascript:;" style="color: #3388ff;">{{v.order_id}}</a>
                        </div>
                    </td>
                    <td>
                        <div style="width: 50px;">
                            订单状态
                        </div>
                    </td>
                    <td :style="{color: [5, 10, 25, 40].includes(v.complete_status) ? '#f00' : ''}">
                        <div style="width: 70px; word-break: break-all;">
                            {{v.complete_status | orderStatusFilter}}
                        </div>
                    </td>
                    <td>
                        <div style="width: 50px;">
                            订单类型
                            <p v-if="v.platform_code == 'AMAZON'" style="margin-top: 5px;">
                                <el-tag size="mini" :style="{background: v.is_business_order == '1' ? '#fd9727' : '#ccc', borderColor: v.is_business_order == '1' ? '#fd9727' : '#ccc'}" style="color: #fff;">B2B</el-tag>
                            </p>
                        </div>
                    </td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            <span :style="{color: ['合并后的订单', '拆分的主订单', '被合并的订单', '拆分后的子订单'].includes(v.order_type) ? 'red' : ''}">{{v.order_type}}</span>
                        </div>
                    </td>
                    <td>
                        <div style="width: 50px;">
                            订单金额
                        </div>
                    </td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            {{v.total_price + ' ' + v.currency}}
                        </div>
                    </td>
                    <td>
                        <div style="width: 50px;">
                            发货仓库
                        </div>
                    </td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            {{v.warehouse_name}}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>客户ID</td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            {{v.buyer_id}}
                        </div>
                    </td>
                    <td>纠纷</td>
                    <td v-if="v.platform_code == 'AMAZON'">
                        <div v-if="v.operation && v.operation.dispute">
                            <el-popover
                                placement="top"
                                width="255"
                                trigger="hover">
                                <div style="max-height: 500px; overflow-y: auto;">
                                    <table class="commontablestyle" cellspacing="0" cellpadding="0">
                                        <tr v-for="dispute in v.operation.dispute">
                                            <td>{{dispute.inbox_id}}</td>
                                            <td>
                                                <a @click="gotoDisputeCenterList(v.order_id)" href="javascript:;" style="color: #3388ff;">
                                                    {{dispute.dispute_status}}
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <a style="color: #f00;" href="javascript:;" slot="reference">
                                    查看
                                </a>
                            </el-popover>
                        </div>
                        <div v-else>
                            无
                        </div>
                    </td>
                    <td v-if="v.platform_code == 'EB'">
                        <div v-if="v.dispute_cancel.length || v.dispute_inr.length || v.dispute_return.length">
                            <el-popover
                                placement="top"
                                width="255"
                                trigger="hover">
                                <div style="max-height: 500px; overflow-y: auto;">
                                    <table class="commontablestyle" cellspacing="0" cellpadding="0">
                                        <tr v-for="cancel in v.dispute_cancel">
                                            <td width="40">Cancel</td>
                                            <td>
                                                <a @click="gotoCancelList(v)" href="javascript:;" style="color: #3388ff;">
                                                    {{cancel.cancel_id}}
                                                </a>
                                            </td>
                                            <td width="55">{{cancel.is_deal}}</td>
                                        </tr>
                                        <tr v-for="inr in v.dispute_inr">
                                            <td>INR</td>
                                            <td>
                                                <a @click="gotoInrList(v)" href="javascript:;" style="color: #3388ff;">
                                                    {{inr.inquiry_id}}
                                                </a>
                                            </td>
                                            <td>{{inr.is_deal}}</td>
                                        </tr>
                                        <tr v-for="ret in v.dispute_return">
                                            <td>Return</td>
                                            <td>
                                                <a @click="gotoReturnList(v)" href="javascript:;" style="color: #3388ff;">
                                                    {{ret.return_id}}
                                                </a>
                                            </td>
                                            <td>{{ret.is_deal}}</td>
                                        </tr>
                                    </table>
                                </div>
                                <a style="color: #f00;" href="javascript:;" slot="reference">
                                    查看
                                </a>
                            </el-popover>
                        </div>
                        <div v-else>
                            无
                        </div>
                    </td>
                    <td>付款时间</td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            {{v.paytime}}
                        </div>
                    </td>
                    <td>退款金额</td>
                    <td>
                        <div style="width: 70px; word-break: break-all; color: #f00;">
                            {{v.amt + ' ' + v.currency}}
                        </div>
                    </td>
                    <td>运输方式</td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            {{v.ship_name}}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>国家</td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            {{v.ship_cn_country}}
                        </div>
                    </td>
                    <td>售后单</td>
                    <td>
                        <div v-if="v.operation && v.operation.aftersales">
                            <el-popover
                                placement="top"
                                width="255"
                                trigger="hover">
                                <div style="max-height: 500px; overflow-y: auto;">
                                    <table class="commontablestyle" cellspacing="0" cellpadding="0">
                                        <tr v-for="aftersales in v.operation.aftersales">
                                            <td>
                                                <a @click="gotoAfterSalesOrderList(aftersales.after_id)" href="javascript:;" style="color: #3388ff;">
                                                    {{aftersales.after_id}}
                                                </a>
                                            </td>
                                            <td>{{aftersales.aftersales_status}}</td>
                                        </tr>
                                    </table>
                                </div>
                                <a style="color: #f00;" href="javascript:;" slot="reference">
                                    查看
                                </a>
                            </el-popover>
                        </div>
                        <div v-else>
                            无
                        </div>
                    </td>
                    <td>发货时间</td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            {{v.shipped_date}}
                        </div>
                    </td>
                    <td>总利润 / 利润率</td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            {{v.total_profit + ' CNY' + '/' + v.profit_rate + '%'}}
                        </div>
                    </td>
                    <td>跟踪号</td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            <a :href="v.track_url" target="_blank" style="color: #3388ff;">{{v.track_number}}</a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>平台账号</td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            {{v.account_id}}
                        </div>
                    </td>
                    <td>客诉单</td>
                    <td>
                        <div v-if="v.operation && v.operation.cust">
                            <el-popover
                                placement="top"
                                width="255"
                                trigger="hover">
                                <div style="max-height: 500px; overflow-y: auto;">
                                    <table class="commontablestyle" cellspacing="0" cellpadding="0">
                                        <tr v-for="cust in v.operation.cust">
                                            <td>
                                                <a @click="gotoCustomerComplaintList(cust.complaint_order)" href="javascript:;" style="color: #3388ff;">
                                                    {{cust.complaint_order}}
                                                </a>
                                            </td>
                                            <td>{{cust.status}}</td>
                                        </tr>
                                    </table>
                                </div>
                                <a style="color: #f00;" href="javascript:;" slot="reference">
                                    查看
                                </a>
                            </el-popover>
                        </div>
                        <div v-else>
                            无
                        </div>
                    </td>
                    <td>退货编码</td>
                    <td>
                        <div style="width: 70px; word-break: break-all;">
                            <p v-if="v.refund_code">{{v.refund_code}}</p>
                            <p v-else>
                                <el-button @click="handleobtainReturnCode(v)" type="primary" size="mini">获取</el-button>
                            </p>
                        </div>
                    </td>
                    <td v-if="v.platform_code == 'AMAZON'">feedback</td>
                    <td v-if="v.platform_code == 'AMAZON'">
                        <div v-if="v.feedback_status === '无评价'">
                            {{v.feedback_status}}
                        </div>
                        <div v-else>
                            <el-popover
                                placement="top"
                                width="255"
                                trigger="hover">
                                <div>
                                    <p>
                                        FeedBack星级：<el-rate :value="Number(v.feedback_status_id)" disabled style="display: inline-block;"></el-rate>
                                    </p>
                                    <p>移除状态：{{v.is_stamp}}</p>
                                    <p style="margin-top: 5px;">
                                        评价内容：<br>
                                        {{v.comments}}
                                    </p>
                                </div>
                                <a @click="gotoFeedbackList(v.order_id)" href="javascript:;" style="color: #f00;" slot="reference">
                                    {{v.feedback_status}}
                                </a>
                            </el-popover>
                        </div>
                    </td>
                    <td v-if="v.platform_code == 'AMAZON'">Review</td>
                    <td v-if="v.platform_code == 'AMAZON'">
                        <div v-if="v.review_comment === '无评价'">
                            {{v.review_comment}}
                        </div>
                        <div v-else>
                            <el-popover
                                placement="top"
                                width="255"
                                trigger="hover">
                                <div>
                                    <p>
                                        Review星级：<el-rate :value="Number(v.review_comment_id)" disabled style="display: inline-block;"></el-rate>
                                    </p>
                                    <p style="margin-top: 5px;">
                                        评价内容：<br>
                                        {{v.review_content}}
                                    </p>
                                </div>
                                <a @click="gotoReviewList(v.order_id)" href="javascript:;" style="color: #f00;" slot="reference">
                                    {{v.review_comment}}
                                </a>
                            </el-popover>
                        </div>
                    </td>

                    <td v-if="v.platform_code == 'EB'">评价</td>
                    <td v-if="v.platform_code == 'EB'">
                        <div v-if="!v.feedback.length">
                            无评价
                        </div>
                        <div v-else>
                            <el-popover
                                placement="top"
                                width="255"
                                trigger="hover">
                                <div v-if="v.operation && v.operation.feedback" style="max-height: 500px; overflow-y: auto;">
                                    <table class="commontablestyle" cellspacing="0" cellpadding="0">
                                        <tr v-for="feed in v.operation.feedback">
                                            <td>
                                                <a
                                                    @click="gotoFeedbackList(feed.item_id)"
                                                    href="javascript:;"
                                                    :style="{color: ['Positve', 'independantly withdrawn', 'withdrawn'].includes(feed.comment_type) ? 'green' : ['Neutral'].includes(feed.comment_type) ? 'orange' : ['Negative'].includes(feed.comment_type) ? 'red' : '#3388ff'}">
                                                    {{feed.comment_type}}
                                                </a>
                                            </td>
                                            <td>
                                                <a @click="gotoFeedbackList(feed.item_id)" href="javascript:;" style="color: #3388ff;">
                                                    {{feed.item_id}}
                                                </a>
                                            </td>
                                            <td>{{feed.status}}</td>
                                        </tr>
                                    </table>
                                </div>
                                <a
                                    href="javascript:;"
                                    slot="reference"
                                    :style="{color: ['Positve', 'independantly withdrawn', 'withdrawn'].includes(v.feedback[0].comment_type) ? 'green' : ['Neutral'].includes(v.feedback[0].comment_type) ? 'orange' : ['Negative'].includes(v.feedback[0].comment_type) ? 'red' : '#3388ff'}">
                                    {{v.feedback[0].comment_type}}
                                </a>
                            </el-popover>
                        </div>
                    </td>
                    <td v-if="v.platform_code == 'EB'"></td>
                    <td v-if="v.platform_code == 'EB'"></td>
                </tr>
                <!-- <tr>
                    <td>物流动态</td>
                    <td colspan="9">{{(v.tracks_content && v.tracks_content.length) ? v.tracks_content[0].event_thing : ''}}</td>
                </tr> -->
            </table>
            <p style="text-align: right; margin: 20px 0 0;"><!-- <a @click="$set(v, 'isShow', !v.isShow)" href="javascript:;" style="color: #4c93ff; text-decoration: underline;">查看产品详情</a> --></p>
            <table v-if="1 || v.isShow" class="commontablea commontableb" cellpadding="0" cellspacing="0">
                <tr>
                    <td width="26">编号</td>
                    <td>产品名称</td>
                    <td width="125">系统SKU</td>
                    <td width="75">系统SKU数量</td>
                    <td width="125">平台SKU</td>
                    <td v-if="v.platform_code == 'EB'" width="40">model</td>
                    <td width="75">平台SKU数量</td>
                    <td v-if="v.platform_code == 'AMAZON'" width="75">Asin</td>
                    <td v-if="v.platform_code == 'EB'" width="75">Item ID</td>
                </tr>
                <tr v-for="(j, d) in v.goods_list">
                    <td>{{j.id}}</td>
                    <td>{{j.cn_title}}</td>
                    <td>
                        <p>
                            <a :href="j.sku_url" style="color: #3388ff;" target="_blank">{{j.sku}}</a>
                        </p>
                    </td>
                    <td>{{j.quantity}}</td>
                    <td>{{j.sku_old}}</td>
                    <td v-if="v.platform_code == 'EB'">{{j.model_value || '无'}}</td>
                    <td>{{j.quantity_old}}</td>
                    <td v-if="v.platform_code == 'AMAZON'">
                        <p>
                            <a :href="j.asin_item_url" style="color: #3388ff;" target="_blank">{{j.asinval}}</a>
                        </p>
                    </td>
                    <td v-if="v.platform_code == 'EB'">
                        <p>
                            <a target="_blank" style="color: #3388ff;" :href="'https://www.ebay.com/itm/' + j.item_id">{{j.item_id}}</a>
                        </p>
                    </td>
                </tr>
                <tr v-if="v.goods_list && !v.goods_list.length">
                    <td :colspan="v.platform_code == 'AMAZON' ? 7 : 8" align="center">没有数据</td>
                </tr>
            </table>
            <p style="margin: 10px 0;">添加备注：</p>
            <div class="addmakewrap">
                <div class="centersel">
                    <el-select v-model="AddMakeForm.remarkType" size="mini" filterable v-filter style="width: 100px;">
                        <el-option label="订单备注" value="1"></el-option>
                        <el-option label="出货备注" value="2"></el-option>
                    </el-select>
                </div>
                <div class="centertxt">
                    <el-input v-model="AddMakeForm.remark" size="mini" placeholder="请输入" show-word-limit :maxlength="v.platform_code == 'EB' ? '250' : '100'" class="showwordlimitipt"></el-input>
                    <div style="height: 7px;"></div>
                    <div v-if="v.ship_remark" class="textfileitemwrap">
                        <div>
                            <div class="tit">
                                {{v.ship_remark}}
                            </div>
                            <div class="rem">
                                发货备注
                            </div>
                            <div class="man">

                            </div>
                            <div class="tim">

                            </div>
                        </div>
                        <span @click="delRemarkFn('2', {}, v)" class="icon--shanchu"></span>
                    </div>
                    <div v-for="(j, d) in v.order_remark" class="textfileitemwrap">
                        <div>
                            <div class="tit">
                                {{j.remark}}
                            </div>
                            <div class="rem">
                                订单备注
                            </div>
                            <div class="man">
                                {{j.create_user_id}}
                            </div>
                            <div class="tim">
                                {{j.create_time}}
                            </div>
                        </div>
                        <span @click="delRemarkFn('1', j, v)" class="icon--shanchu"></span>
                    </div>
                </div>
                <div class="centerbtn">
                    <el-button @click="submitRemark(v)" type="primary" size="mini">保存</el-button>
                </div>
            </div>
        </div>
        <div v-if="!orderList.length" style="color: #999; padding: 10px 0; text-align: center;">暂无订单信息</div>
    </div>
</template>

<script>
export default {
    name: 'MailProcessing_OrderList',
    data () {
        return {
            AddMakeForm: {
                remarkType: '1',
                remark: ''
            },
        }
    },
    props: {
        orderList: {
            type: Array,
            default() {
                return []
            }
        },
        chiledOrderList: {
            type: Array,
            default() {
                return []
            }
        },
    },
    methods: {
        handleOrderInfo(order) {
            this.$emit('handleOrderInfo', order);
        },
        changeOperation(e, v) {
            this.$emit('changeOperation', e, v);
        },
        handleobtainReturnCode(v) {
            this.$emit('handleobtainReturnCode', v);
        },
        delRemarkFn(t, v, item) {
            this.$emit('delRemarkFn', t, v, item);
        },
        submitRemark(v) {
            this.$emit('submitRemark', v, this.AddMakeForm);
        },
        gotoDisputeCenterList(v) {
            this.$emit('gotoDisputeCenterList', v);
        },
        gotoAfterSalesOrderList(v) {
            this.$emit('gotoAfterSalesOrderList', v);
        },
        gotoCustomerComplaintList(v) {
            this.$emit('gotoCustomerComplaintList', v);
        },
        gotoFeedbackList(v) {
            this.$emit('gotoFeedbackList', v);
        },
        gotoReviewList(v) {
            this.$emit('gotoReviewList', v);
        },
        gotoCancelList(v) {
            this.$emit('gotoCancelList', v);
        },
        gotoInrList(v) {
            this.$emit('gotoInrList', v);
        },
        gotoReturnList(v) {
            this.$emit('gotoReturnList', v);
        },
    },
    filters: {
        orderStatusFilter(v) {
            let str = '';
            switch (v) {
                case 0:
                    str = '初始化';
                    break;
                case 1:
                    str = '正常订单';
                    break;
                case 5:
                    str = '异常订单';
                    break;
                case 10:
                    str = '缺货订单';
                    break;
                case 13:
                    str = '已备货订单';
                    break;
                case 15:
                    str = '待发货订单';
                    break;
                case 17:
                    str = '超期订单';
                    break;
                case 19:
                    str = '部分发货订单';
                    break;
                case 20:
                    str = '已发货订单';
                    break;
                case 25:
                    str = '暂扣订单';
                    break;
                case 40:
                    str = '已取消订单';
                    break;
                case 45:
                    str = '已完成订单';
                    break;
                case 99:
                    str = '通途系统处理订单';
                    break;
                case 90:
                    str = '借用领用单确认收货';
                    break;
                case 91:
                    str = '借用领用单已经部分归还';
                    break;
                case 92:
                    str = '借用领用单已经全部归还';
                    break;
                case 119:
                    str = '待检测paypal账号';
                    break;
            }
            return str;
        }
    },
}
</script>
