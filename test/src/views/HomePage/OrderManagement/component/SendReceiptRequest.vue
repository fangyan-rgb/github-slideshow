<template>
    <div class="sendReceiptRequest">
        <!-- 收款请求弹窗 -->
        <el-dialog title="收款请求" width="780px" class="ui-layout_edit-dialog" :visible.sync="isReceiptRequestShow" @close="sendReceiptRequestCancel">
            <el-form label-width="100px" :model="sendReceiptRequestInfo" ref="sendReceiptRequestInfo"
                :rules="batchRules">
                <div style="display:flex;">
                    <div>
                        <el-form-item label="公司paypal：" prop="merchant_email">
                            <template>
                                <el-select v-model="sendReceiptRequestInfo.merchant_email" size="small"  v-filter filterable placeholder="请选择">
                                    <el-option v-for="(item,key) in collectionInfo.paypal" :key="key" :label="item"
                                        :value="key">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="客户paypal：" prop="payer_email">
                            <el-input size="small" type="text" v-model.trim="sendReceiptRequestInfo.payer_email"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div style="display:flex;">
                    <div class="amount">
                        
                        <el-form-item label="收款金额：" prop="total_amount">
                            <el-input v-model="sendReceiptRequestInfo.total_amount" class="input-with-select" size="small">
                                <el-select v-model="sendReceiptRequestInfo.currency" slot="append" size="small" placeholder="请选择">
                                    <el-option v-for="(item,key) in collectionInfo.currency" :key="key" :label="item"
                                        :value="key">
                                    </el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                        
                    </div>
                    <div>
                        <el-form-item label="产品名称：" prop="product_name">
                            <el-input size="small" type="text" v-model.trim="sendReceiptRequestInfo.product_name"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item label="留言：">
                    <el-input size="small" style="width:581px;" type="textarea" rows="5" v-model.trim="sendReceiptRequestInfo.note"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="sendReceiptRequestCancel">取消</el-button>
                <el-button size="small" type="primary" @click="handleSendReceiptRequest()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import * as storage from '@/utils/storage';
import routerConfig from '@/router/routerConfig';
import {
        receiptRequestInterface, //收款请求
    } from '../../../../api/orderInfo/componentjs';

export default {
    name: "SendReceiptRequest",
    props: {
      sendReceiptRequest: {
        type: Object,
        default: {}
      },
      ReceiptRequestShow:{
          type: Boolean,
          default: false
      },
      collection: {
        type: Object,
        default: {}
      },
    },
    data() {
        return {
            isReceiptRequestShow:false,
            sendReceiptRequestInfo: { //收款请求
                company_account: '', //公司paypal账号
                customer_account: '', //客户paypal账号
                amount: '', //收款金额
                goods_name: '', //产品名称
                leave_message: '' //留言
            },
            collectionInfo: {}, //收款请求所需信息
            batchRules: {
                merchant_email: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                payer_email: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                total_amount: [{
                    required: true,
                    message: '请输入收款金额，且选择收款币种',
                    trigger: "blur"
                },{
                    pattern: /^(([1-9][0-9]+)||[1-9])((\.[0-9][0-9])||\.[0-9])?$/,
                    message: '收款金额只能为正实数，且只保留小数点后两位！'
                }],
                product_name: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                currency: [{
                    required: true,
                    message: "请选择币种",
                    trigger: "blur"
                }],
                
            },
        }
    },
    methods: {
        //关闭收款请求弹窗
        sendReceiptRequestCancel(){
            this.isReceiptRequestShow = false;
            this.$emit("sendReceiptRequestCancel");
            this.$refs['sendReceiptRequestInfo'].resetFields();
        },
        //提交收款请求
        handleSendReceiptRequest() {
            this.$refs["sendReceiptRequestInfo"].validate(res => {
                if (res) {
                    let str='';
                    if(this.sendReceiptRequestInfo.platform_code==='AMAZON'){
                        str='paypal_invoice_record';
                    }else{
                        str='ebay_paypal_invoice_record';
                    }
                    receiptRequestInterface(this.sendReceiptRequestInfo,str).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }else{
                            this.$message.success('操作成功!');
                            this.sendReceiptRequestCancel();
                        }
                    })
                }
            });
        },
    },
    watch:{
        ReceiptRequestShow(){
            this.isReceiptRequestShow=true;
        },
        sendReceiptRequest(){
            this.sendReceiptRequestInfo = {...this.sendReceiptRequest};
        },
        collection(){
            this.collectionInfo={...this.collection};
        }
    },
    created(){
        this.collectionInfo={...this.collection};
        this.isReceiptRequestShow = this.ReceiptRequestShow;
        this.sendReceiptRequestInfo = {...this.sendReceiptRequest};
    }
};
</script>
<style lang="less" scoped>
    .sendReceiptRequest{
        /deep/.el-dialog__body{
            .amount {
                display: flex;

                .el-select.el-select--small {
                    width: 100px;

                    .el-input.el-input--small.el-input--suffix {
                        width: 100%;
                        line-height: 42px;
                    }
                }
            }
        .el-form-item{
            margin-bottom: 15px;
            .el-form-item__label,.el-form-item__content{
                line-height: 28px;
            }
        }
        }
    }
</style>