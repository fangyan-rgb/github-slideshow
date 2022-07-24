<template>
<div class="RegisteredReceivables">
    <!-- 登记收款弹窗 -->
    <el-dialog title="登记收款" width="820px" top="15vh" class="ui-layout_edit-dialog"
        :visible.sync="isRegisteredReceivables" @close="sendRegisteredReceivablesCancel">
        <el-form label-width="100px" :model="sendRegisteredReceivablesInfo" ref="sendRegisteredReceivablesInfo" :rules="batchRules">
            <el-form-item label="订单号：">{{order.order_id}}</el-form-item>
            <el-form-item label="平台：">{{order.platform_code}}</el-form-item>
            <el-form-item label="账号：">{{RegisteredReceivablesInfo.order.account_name}}</el-form-item>
            <el-form-item label="客户ID：">{{order.buyer_id}}</el-form-item>
            <el-form-item label="收款记录查询：" prop="receipt_type">收款方式
                <el-radio v-model="sendRegisteredReceivablesInfo.receipt_type" label="1" @change="handleShow">paypal收款</el-radio>
                <el-radio v-model="sendRegisteredReceivablesInfo.receipt_type" label="2" @change="handleShow" v-if="!RegisteredReceivablesInfo.edit">线下收款</el-radio>
            </el-form-item>
            <div class="underLineReceivables" v-if="isOfflineCollection" v-show="!RegisteredReceivablesInfo.edit">
                <div style="display:flex;height:60px;">
                    <div style="display:flex;" class="receivablesQuota">
                        <el-form-item label="收款金额：" prop="receipt_money">
                            <el-input size="small" type="number"
                                v-model.trim="sendRegisteredReceivablesInfo.receipt_money"></el-input>
                        </el-form-item>
                        <div class="company">
                            <el-form-item label-width="0" prop="receipt_currency">
                                <el-select filterable v-filter size="small" clearable v-model="sendRegisteredReceivablesInfo.receipt_currency">
                                    <el-option v-for="(value,key) in RegisteredReceivablesInfo.receipt_currency"
                                        :key="key" :label="value" :value="key"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    <div style="display: inline-block;">
                        <el-form-item label="收款银行：" prop="receipt_bank">
                            <el-input size="small" type="text" v-model.trim="sendRegisteredReceivablesInfo.receipt_bank"
                                :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div style="display:flex;">
                    <div style="display: inline-block;">
                        <el-form-item label="交易流水号：" prop="receipt_bank_sn">
                            <el-input size="small" type="text"
                                v-model.trim="sendRegisteredReceivablesInfo.receipt_bank_sn"></el-input>
                        </el-form-item>
                    </div>
                    <div style="display: inline-block;">
                        <el-form-item label="银行账号：" label-width="97px"  prop="receipt_bank_account">
                            <el-select filterable v-filter size="small"
                                v-model="sendRegisteredReceivablesInfo.receipt_bank_account" clearable>
                                <el-option v-for="(value,key) in RegisteredReceivablesInfo.receipt_bank_account"
                                    :key="key" :label="value" :value="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
            </div>

            <div class="onLineReceivables" v-if="isPaypal">
                <div style="display:flex;">
                    <div>
                        <el-form-item label="paypal账号：" prop="paypal_account_id">
                            <el-select  filterable v-filter v-filter size="small"
                                v-model="sendRegisteredReceivablesInfo.paypal_account_id" clearable>
                                <el-option v-for="(value,key) in RegisteredReceivablesInfo.paypal" :key="key"
                                    :label="value" :value="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="paypal交易号：" label-width="110px" prop="transaction_id">
                            <el-input size="small" type="text"
                                v-model="sendRegisteredReceivablesInfo.transaction_id"></el-input>
                            <el-button size="small" type="primary" @click="handleTransactionInformation">搜索
                            </el-button>
                        </el-form-item>
                    </div>
                </div>
                <div v-show="transactionInfo.transaction_id!=''">
                    <table cellspacing="0" cellpadding="0" width=100%>
                        <tr style="background-color: #FAFAFA;">
                            <td>paypal交易号</td>
                            <td>交易时间</td>
                            <td>金额</td>
                            <td>状态</td>
                            <td>佣金</td>
                            <td>付款账号</td>
                            <td>收款账号</td>
                        </tr>
                        <tr>
                            <td>{{transactionInfo.transaction_id}}</td>
                            <td>{{transactionInfo.paytime}}</td>
                            <td>{{transactionInfo.amt}}</td>
                            <td>{{transactionInfo.payment_status}}</td>
                            <td>{{transactionInfo.fee_amt}}</td>
                            <td>{{transactionInfo.payer_email}}</td>
                            <td>{{transactionInfo.receiver_email}}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div style="margin-top: 10px">
                <el-form-item label="原因：" prop="receipt_reason_type">
                    <el-select  filterable v-filter v-filter size="small" clearable v-model="sendRegisteredReceivablesInfo.receipt_reason_type">
                        <el-option v-for="(value,key) in RegisteredReceivablesInfo.receipt_reason_type" :key="key"
                            :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
        </el-form>
        <div slot="footer">
            <el-button size="small" @click="sendRegisteredReceivablesCancel">取消</el-button>
            <el-button size="small" type="primary" @click="RegisteredReceivablesReceiptRequest">确定</el-button>
        </div>
    </el-dialog>
    </div>
</template>
<script>
import * as storage from '@/utils/storage';
import routerConfig from '@/router/routerConfig';
import {
        registeredReceivablesInterface, //登记收款
        TransactionInformation, //通过交易号获取交易信息
        editRegisteredReceivablesInterface,
    } from '../../../../api/orderInfo/componentjs';

export default {
    name: "RegisteredReceivables",
    props: {
      sendRegisteredReceivables: {
        type: Object,
        default: {}
      },
      showRegisteredReceivables:{
          type: Boolean,
          default: false
      },
      orderInfo: {
        type: Object,
        default: {}
      },
      RegisteredReceivables: {
        type: Object,
        default: {}
      },
    },
    data() {
      return {
          isRegisteredReceivables:false,
          sendRegisteredReceivablesInfo: { //登记收款
            account_id:'',
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
        transactionInfo: { //交易信息
            amt: '',
            buyer_id: "",
            currency: "",
            fee_amt: '',
            order_id: "",
            payer_email: '',
            payment_status: "",
            payment_status_id: '',
            paytime: "",
            platform_order_id: "",
            receiver_email: '',
            transaction_id: "",
        },
        order:{},
        batchRules:{
            receipt_money: [{
                required: true,
                message: '请输入收款金额',
                trigger: "blur"
            },{
                pattern: /^(([1-9][0-9]+)||[1-9])((\.[0-9][0-9])||\.[0-9])?$/,
                message: '收款金额只能为正实数，且只保留小数点后两位！'
            }],
            receipt_currency: [{
                required: true,
                message: "请选择币种",
                trigger: "blur"
            }],
            receipt_bank_sn: [{
                required: true,
                message: "带*号为必填项",
                trigger: "blur"
            }],
            receipt_bank_account: [{
                required: true,
                message: "带*号为必填项",
                trigger: "blur"
            }],
            paypal_account_id: [{
                required: true,
                message: "带*号为必填项",
                trigger: "blur"
            }],
            transaction_id: [{
                required: true,
                message: "带*号为必填项",
                trigger: "blur"
            }],
            receipt_reason_type: [{
                required: true,
                message: "带*号为必填项",
                trigger: "blur"
            }],
            receipt_type: [{
                required: true,
                message: "请选择收款方式",
                trigger: "blur"
            }],
        },
        RegisteredReceivablesInfo: {
            order: {
                account_id: "",
                account_name: "",
                buyer_id: "",
                order_id: "",
                platform_code: ""
            }
        },
        isPaypal:false,
        isOfflineCollection:false,
      }
    },
    methods: {
        //登记收款
        RegisteredReceivablesReceiptRequest() {
            this.$refs["sendRegisteredReceivablesInfo"].validate(res => {
                if (res) {
                    if(this.sendRegisteredReceivablesInfo.receipt_type=='1'){
                        this.sendRegisteredReceivablesInfo.receipt_money = this.transactionInfo.amt
                    }
                    this.sendRegisteredReceivablesInfo.status = this.transactionInfo.payment_status_id?this.transactionInfo.payment_status_id:"";
                    this.sendRegisteredReceivablesInfo.payment_account = this.transactionInfo.payer_email?this.transactionInfo.payer_email:"";
                    this.sendRegisteredReceivablesInfo.transaction_hour = this.transactionInfo.paytime?this.transactionInfo.paytime:"";
                    this.sendRegisteredReceivablesInfo.paypal_account = this.RegisteredReceivablesInfo.paypal[this.sendRegisteredReceivablesInfo.paypal_account_id];
                    this.sendRegisteredReceivablesInfo.receipt_bank = this.RegisteredReceivablesInfo.receipt_bank
                    this.sendRegisteredReceivablesInfo.platform_code = this.orderInfo.platform_code; //平台
                    this.sendRegisteredReceivablesInfo.order_id = this.orderInfo.order_id; //订单号
                    this.sendRegisteredReceivablesInfo.account_id = this.orderInfo.account_id; //账号id
                    this.sendRegisteredReceivablesInfo.buyer_id = this.orderInfo.buyer_id; //客户ID
                        // console.log(this.sendRegisteredReceivablesInfo)
                    if(this.RegisteredReceivablesInfo.edit){
                        let obj={
                            after_sale_receipt_id:this.orderInfo.after_sale_receipt_id,
                            receipt_type:this.sendRegisteredReceivablesInfo.receipt_type,
                            paypal_account:this.RegisteredReceivablesInfo.paypal[this.sendRegisteredReceivablesInfo.paypal_account_id],
                            transaction_id:this.sendRegisteredReceivablesInfo.transaction_id,
                            receipt_reason_type:this.sendRegisteredReceivablesInfo.receipt_reason_type,
                            transaction_hour:this.transactionInfo.paytime,
                            status:this.transactionInfo.payment_status=='已付款'?'1':'0',
                            payment_account:this.transactionInfo.payer_email,
                            receipt_money:this.transactionInfo.amt,
                        };
                        editRegisteredReceivablesInterface(obj).then(({data}) => {
                            if (data.status) {
                                this.$message.success('操作成功！');
                                this.sendRegisteredReceivablesCancel();
                                this.$emit('RegisteredReceivablesReceiptRequest')
                            } else {
                                this.$message.error(data.errorMess || '操作失败！');
                            }
                        })
                    }else{
                        let str='';
                        if(this.order.platform_code==='AMAZON'){
                            str='after_sales_receipt';
                        }else{
                            str='ebay_after_sales_receipt';
                        }
                        registeredReceivablesInterface(this.sendRegisteredReceivablesInfo,str).then(({data}) => {
                            if (data.status) {
                                this.$message.success('操作成功！');
                                this.sendRegisteredReceivablesCancel();
                                // this.$emit('RegisteredReceivablesReceiptRequest')
                            } else {
                                this.$message.error(data.errorMess || '操作失败！');
                            }
                        })
                    }
                }
            });
        },
        //取消登记收款
        sendRegisteredReceivablesCancel(){
            this.transactionInfo= { //交易信息
                transaction_id: '',
            }
            this.isRegisteredReceivables = false
            this.$refs.sendRegisteredReceivablesInfo.resetFields();
            this.$emit("handlesendRegisteredReceivablesCancel");
        },
        //通过交易号获取交易信息
        handleTransactionInformation() {
            let obj = {
                platform_code: this.order.platform_code,
                transaction_id: this.sendRegisteredReceivablesInfo.transaction_id,
            }
            let str = "";
            if(this.order.platform_code==='AMAZON'){
                str = 'after_sales_receipt';
            }else if(this.order.platform_code==='EB'){
                str = 'ebay_after_sales_receipt';
            }
            TransactionInformation(obj,str).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.transactionInfo = data.data_list
            })
        },
        handleShow(){
            if(this.sendRegisteredReceivablesInfo.receipt_type=='1'){
                this.isOfflineCollection=false;
                this.isPaypal=true;
            }else if(this.sendRegisteredReceivablesInfo.receipt_type=='2'){
                this.isPaypal=false;
                this.isOfflineCollection=true;
            }
        }
    },
    watch:{
        sendRegisteredReceivable(n,o){
            this.sendRegisteredReceivablesInfo={...n};
            this.handleShow();
        },
        orderInfo(){
            this.order={...this.orderInfo};
        },
        RegisteredReceivables(){
            this.RegisteredReceivablesInfo={...this.RegisteredReceivables};
        }
    },
    computed:{
        sendRegisteredReceivable:{
            get(){
                this.sendRegisteredReceivablesInfo={...this.sendRegisteredReceivables};
                
                return this.sendRegisteredReceivables;
            }
        },
    },
    created(){
        this.order={...this.orderInfo};
        this.sendRegisteredReceivablesInfo={...this.sendRegisteredReceivables};
        this.RegisteredReceivablesInfo={...this.RegisteredReceivables};
        this.isRegisteredReceivables = this.showRegisteredReceivables;
        this.handleShow();
    }
};
</script>
<style lang="less" scoped>
.RegisteredReceivables{
    /deep/.el-form-item{
        margin-bottom: 0;
    }
    /deep/.underLineReceivables,
    .onLineReceivables {
        border-top: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        padding: 10px 0;
        margin: 10px 0;
        font-size: 12px;

        .el-input.el-input--small {
            width: 250px;
        }
    }
    /deep/.receivablesQuota {
            .el-input.el-input--small {
                width: 140px;
            }

            .company {
                margin-left: 10px;

                .el-select.el-select--small {
                    width: 100px;

                    .el-input.el-input--small.el-input--suffix {
                        width: 100%;
                        line-height: 42px;
                    }
                }
            }
        }

    /deep/table {
        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        font-size: 12px;

        td {
            border-top: 1px solid #e6e6e6;
            border-left: 1px solid #e6e6e6;
            padding: 5px 10px;
        }
    }
}

</style>