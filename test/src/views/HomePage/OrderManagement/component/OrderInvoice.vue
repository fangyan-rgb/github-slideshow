<template>
    <el-dialog
        title="发票"
        width="1000px"
        top="0vh"
        class="invoiceStyle zindexhighest"
        :append-to-body='true'
        :visible.sync="isInvoiceShow"
        @close="cancel(true)">
        <el-form
            label-width="200px"
            :model="invoiceSubmission"
            ref="invoiceSubmission"
            :rules="invoiceRules"
            >
            <div class="invoiceMain" v-if="InvoiceInfo.site.toUpperCase()!=='JP'&&!InvoiceInfo.B2B">
                <div class="invoiceHeadline" v-html="invoiceSubmission.customer_company"></div>
                <div class="invoiceSubheading">
                    <div>{{invoiceSubmission.customer_addr}}</div>
                    <div>
                        <span v-show="detailsInvoiceInfo.company_tel==''?false:true">Tel.{{detailsInvoiceInfo.company_tel}}</span> 
                        <span v-show="detailsInvoiceInfo.company_fox==''?false:true">Fax.{{detailsInvoiceInfo.company_fox}}</span> 
                    </div>
                </div>
                <div class="invoiceHeadline">INVOICE</div>
                <div class="invoiceText">
                    <div style="display:flex;">
                        <el-form-item label="Company name：" prop="buyer_id">
                            <el-input size="small" type="text" v-model.trim="invoiceSubmission.buyer_id"></el-input>
                        </el-form-item>
                        <el-form-item label="NO：" prop="platform_order_id">
                            <el-input size="small" type="text" v-model.trim="invoiceSubmission.platform_order_id"></el-input>
                        </el-form-item>
                    </div>
                    <div style="padding-right:180px;">
                        <el-form-item label="Company address：" prop="cust_addr">
                            <el-input
                                size="small"
                                type="textarea"
                                rows="8"
                                v-model="invoiceSubmission.cust_addr"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div style="padding-right:180px;">
                        <el-form-item label="Date：" prop="paytime">
                            <template>
                                    <el-date-picker
                                        v-model="invoiceSubmission.paytime"
                                        size="small"
                                        popper-class="zindexhighest"
                                        type="date"
                                        disabled
                                        placeholder="选择日期"
                                        format="yyyy 年 MM 月 dd 日"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                            </template>
                        </el-form-item>
                    </div>
                    <div style="text-align: center;">
                        <table cellspacing="0" cellpadding="0" width="80%">
                                <tr style="background-color: #FAFAFA;">
                                    <td width="500">MODEL NO./DESCRIPTION</td>
                                    <td width="100">QTY (pc)</td>
                                    <!-- <td width="100">UP</td>
                                    <td width="100">
                                        <el-select
                                            filterable v-filter
                                            size="mini"
                                            clearable
                                            v-model="detailsInvoiceInfo.currency"
                                            popper-class="zindexhighest"
                                        >
                                            <el-option
                                                v-for="(item,key) in invoiceCurrency"
                                                :key="key"
                                                :label="item"
                                                :value="key"
                                            ></el-option>
                                        </el-select>
                                    </td> -->
                                    <!-- <td width="100">VAT</td> -->
                                    <td width="100">OPERATION</td>
                                </tr>
                                <tr v-for="(item,index) in invoiceSubmission.product_info_list">
                                    <td>
                                        <el-form-item label-width="0" :prop="'product_info_list.'+index+'.title'" :rules="[{required: true,message: '产品标题不能为空',trigger: 'blur'}]">
                                            <el-input
                                                size="mini"
                                                type="textarea"
                                                v-model="item.title"
                                            ></el-input>
                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" :prop="'product_info_list.'+index+'.quantity'" :rules="[{required: true,message: '产品数量不能为空',trigger: 'blur'},{pattern: /^\+?[1-9][0-9]*$/,message: '产品数量只能为正整数'}]">
                                            <el-input
                                                size="mini"
                                                type="text"
                                                v-model.trim="item.quantity"
                                            ></el-input>
                                        </el-form-item>
                                    </td>
                                    <!-- <td>
                                        <el-form-item label-width="0" :prop="'product_info_list.'+index+'.sale_price'" :rules="[{required: true,message: '产品价格不能为空',trigger: 'blur'},{pattern:  /^([0-9]+)((\.[0-9][0-9])||\.[0-9])?$/,message: '产品价格不能为负数，且只能保留小数点后两位！'}]">
                                            <el-input
                                                size="mini"
                                                type="text"
                                                @change="HandleCalculationTotalAmount"
                                                v-model.trim="item.sale_price"
                                            ></el-input>
                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0">
                                            <el-input
                                                size="mini"
                                                type="text"
                                                disabled
                                                v-model.trim="item.quantity*item.sale_price"
                                            ></el-input>
                                        </el-form-item>
                                    </td> -->
                                    <td class="invoiceOpertion">
                                        <div>
                                            <i class="el-icon-circle-plus-outline" @click="elCirclePlusOutline()"></i>&nbsp;
                                            <i
                                                class="el-icon-remove-outline"
                                                @click="elCircleRemoveOutline(item,index)"
                                                v-show="invoiceSubmission.product_info_list.length==1?false:true"
                                            ></i>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="invoicePrice">
                                    <!-- <td>
                                        <el-form-item label="Freight：">
                                            <el-input
                                                size="small"
                                                type="number"
                                                @change="HandleCalculationTotalAmount"
                                                v-model="invoiceSubmission.ship_fee"
                                            ></el-input>
                                        </el-form-item>
                                    </td> -->
                                    <td colspan="3">
                                        <div style="width:100%;display:flex;">
                                            <div style="width:400px;display:flex;">
                                                <el-form-item label="Total Amount：" label-width="140px" prop="total_price">
                                                    <el-input
                                                        size="small"
                                                        type="text"
                                                        v-model.trim="invoiceSubmission.total_price"
                                                    ></el-input>
                                                </el-form-item>
                                                <span
                                                    style="line-height: 40px;"
                                                    v-model="detailsInvoiceInfo.currency"
                                                >{{detailsInvoiceInfo.currency}}</span>
                                            </div>
                                            <div>
                                                <el-form-item label-width="50px" label="VAT:" prop="vat">
                                                    <el-input size="mini" type="text" v-model.trim="invoiceSubmission.vat"></el-input>
                                                </el-form-item>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                        </table>
                    </div>
                    <div class="invoiceBelow">
                        <div>Package: The goods be packed in one box. Export Standard Package</div>
                        <div>Terms of Payment:100% payment pay through paypal or bank transfer</div>
                        <div v-show="detailsInvoiceInfo.account_holder==''&&detailsInvoiceInfo.bank_account==''&&detailsInvoiceInfo.bank_name==''?false:true">The detail of our bank</div>
                        <div>
                            <p v-show="detailsInvoiceInfo.account_holder==''?false:true">
                                Beneficiary：
                                <span>{{detailsInvoiceInfo.account_holder}}</span>
                            </p>
                            <p v-show="detailsInvoiceInfo.bank_account==''?false:true">
                                Account Number：
                                <span>{{detailsInvoiceInfo.bank_account}}</span>
                            </p>
                            <p v-show="detailsInvoiceInfo.bank_name==''?false:true">
                                Opening Bank：
                                <span>{{detailsInvoiceInfo.bank_name}}</span>
                            </p>
                            <!-- <p>
                                SWIFT CODE：
                                <span>{{detailsInvoiceInfo.swif_code}}</span>
                            </p> -->
                        </div>
                        <div>The detail of our company</div>
                        <div style="width:480px;">
                            <p>{{invoiceSubmission.customer_addr}}</p>
                            <p>
                                <span v-show="detailsInvoiceInfo.company_tel==''?false:true">Tel.{{detailsInvoiceInfo.company_tel}}</span> 
                                <span v-show="detailsInvoiceInfo.company_fox==''?false:true">Fax.{{detailsInvoiceInfo.company_fox}}</span> 
                            </p>
                        </div>
                        <div>CONFIRMED AND ACCEPTED BY</div>
                        <div style="width:480px;"
                            v-model="invoiceSubmission.buyer_id"
                        >{{invoiceSubmission.buyer_id}}</div>
                        <div>SIGNATURE AND COMPANY CHOP</div>
                        <div class="sealPicture">
                            <div class="limited">
                                <div>{{invoiceSubmission.customer_company}}</div>
                                <div>{{detailsInvoiceInfo.account_holder}}</div>
                            </div>
                            <img :src="detailsInvoiceInfo.invoice_stamp" width="180px;">
                        </div>
                    </div>
                </div>
            </div>
            <div class="invoiceMain" v-if="InvoiceInfo.site.toUpperCase()=='JP'&&!InvoiceInfo.B2B">
                <div class="invoiceHeadline">
                    <p>請求書</p>
                    <p>invoice</p>
                </div>
                <div class="invoiceJapanTime">インボイス作成日(Date) ：{{invoiceSubmission.invoice_time}}</div>
                <div class="invoiceText">
                    <div style="padding-right:80px;">
                        <el-form-item label="ご依頼主 (Sender):" prop="customer_addr">
                            <el-input
                                size="small"
                                type="textarea"
                                rows="10"
                                v-model="invoiceSubmission.customer_addr"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div style="padding-right:80px;">
                        <el-form-item label="お届け先 (Addressee):" prop="cust_addr">
                            <el-input
                                size="small"
                                type="textarea"
                                rows="10"
                                v-model="invoiceSubmission.cust_addr"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div style="display:flex;">
                        <el-form-item label="注文日：">
                            <!-- <el-input size="small" type="text" v-model="invoiceSubmission.paytime"></el-input> -->
                            <template>
                                <div class="block">
                                    <el-date-picker
                                        v-model="invoiceSubmission.paytime"
                                        size="small"
                                        popper-class="zindexhighest"
                                        type="date"
                                        disabled
                                        placeholder="选择日期"
                                        format="yyyy 年 MM 月 dd 日"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </div>
                            </template>
                        </el-form-item>
                        <el-form-item label="注文番号(Order No.)：">
                            <el-input size="small" type="text" v-model.trim="invoiceSubmission.platform_order_id"></el-input>
                        </el-form-item>
                    </div>
                    <div style="text-align: center;">
                        <table cellspacing="0" cellpadding="0" width="90%">
                                <tr style="background-color: #FAFAFA;">
                                    <td width="600">
                                        <div>内容品の記載</div>
                                        <div>(Description)</div>
                                    </td>
                                    <td style="width:200px;">
                                        <div>数量</div>
                                        <div>(Quantity)</div>
                                    </td>
                                    <!-- <td width="100">
                                        <div>単価</div>
                                        <div>(Unit Price)</div>
                                    </td>
                                    <td width="100">
                                        <div>合計額</div>
                                        <div>(Total Amount)</div>
                                    </td> -->
                                    <td width="100">操作</td>
                                </tr>
                                <tr v-for="(item,index) in invoiceSubmission.product_info_list">
                                    <td>
                                        <el-form-item label-width="0" :prop="'product_info_list.'+index+'.title'" :rules="[{required: true,message: '产品标题不能为空',trigger: 'blur'}]">
                                            <el-input
                                                size="mini"
                                                type="textarea"
                                                v-model.trim="item.title"
                                            ></el-input>
                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0" :prop="'product_info_list.'+index+'.quantity'" :rules="[{required: true,message: '数量不能为空',trigger: 'blur'},{pattern: /^\+?[1-9][0-9]*$/,message: '产品数量只能为正整数'}]">
                                            <el-input
                                                size="mini"
                                                type="text"
                                                v-model.trim="item.quantity"
                                            ></el-input>
                                        </el-form-item>
                                    </td>
                                    <!-- <td>
                                        <el-form-item label-width="0" :prop="'product_info_list.'+index+'.sale_price'" :rules="[{required: true,message: '价格不能为空',trigger: 'blur'},{pattern: /^([0-9]+)((\.[0-9][0-9])||\.[0-9])?$/,message: '产品价格不能为负数，且只能保留小数点后两位！'}]">
                                            <el-input
                                                size="mini"
                                                type="text"
                                                @change="HandleCalculationTotalAmount"
                                                v-model.trim="item.sale_price"
                                            ></el-input>
                                        </el-form-item>
                                    </td>
                                    <td>
                                        <el-form-item label-width="0">
                                            <el-input
                                                size="mini"
                                                type="text"
                                                disabled
                                                v-model.trim="item.quantity*item.sale_price"
                                            ></el-input>
                                        </el-form-item>
                                    </td> -->
                                    <td class="invoiceOpertion">
                                        <div>
                                            <i
                                                class="el-icon-circle-plus-outline"
                                                @click="elCirclePlusOutline()"
                                            ></i>&nbsp;
                                            <i
                                                class="el-icon-remove-outline"
                                                @click="elCircleRemoveOutline(item,index)"
                                                v-show="invoiceSubmission.product_info_list.length==1?false:true"
                                            ></i>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="invoicePrice">
                                    <td colspan="3">
                                        <div style="display:flex;width:600px;">
                                            <el-form-item label="合計金額：" prop="total_price">
                                                <el-input
                                                    size="small"
                                                    type="text"
                                                    v-model.trim="invoiceSubmission.total_price"
                                                ></el-input>
                                            </el-form-item>&nbsp;&nbsp;&nbsp;
                                            <span
                                                style="line-height: 40px;"
                                                v-model="detailsInvoiceInfo.currency"
                                            >{{detailsInvoiceInfo.currency}}</span>
                                        </div>
                                    </td>
                                </tr>
                        </table>
                    </div>
                    <div class="sealPictureJapan">
                        <div class="limited">
                            <div>{{invoiceSubmission.customer_company}}</div>
                            <div>{{detailsInvoiceInfo.account_holder}}</div>
                        </div>
                        <img :src="detailsInvoiceInfo.invoice_stamp" width="180px;">
                    </div>
                </div>
            </div>
            <div class="invoiceMain" v-if="InvoiceInfo.B2B">
                <div class="invoiceB2B">
                    <div class="titleInvoiceB2B">Invoice</div>
                    <div class="headInvoiceB2B">
                        <div class="linkHeadInvoiceB2B">For questions about your order, visit： 
                            <span>{{invoiceSubmission.platform_site_url}}</span>
                        </div>
                        <div class="dataHeadInvoiceB2B">Invoice date：{{invoiceSubmission.invoice_time}}</div>
                    </div>
                    <div class="addressInvoiceB2B">
                        <div class="Billing">
                            <div style="font-weight:700;font-size:14px;">Billing address</div>
                            <div>
                                <el-form-item prop="buyer_id" label-width="0">
                                    <el-input size="small" type="text" v-model="invoiceSubmission.buyer_id"></el-input>
                                </el-form-item>
                            </div>
                            <div>
                                <el-form-item prop="cust_addr" label-width="0">
                                    <el-input size="small" type="text" v-model="invoiceSubmission.cust_addr"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="Delivery">
                            <div class="deliveryAddress">
                                <div style="font-weight:700;font-size:14px;">Delivery address</div>
                                <div>{{buyer_id}}</div>
                                <div>{{cust_addr}}</div>
                                <!-- <div>637374140，Avenida</div>
                                <div>Alfonso X el Sabio</div> -->
                            </div>
                            <div class="soldBy">
                                <div style="font-weight:700;font-size:14px; ">Sold by</div>
                                <div>{{invoiceSubmission.account_name}}</div>
                                <div>{{invoiceSubmission.vat_addr}}</div>
                                <div>VAT Number: {{invoiceSubmission.vat_number}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="orderInvoiceB2B">
                        <div style="font-weight:700;font-size:14px;">Order information</div>
                        <div><span style="font-weight:600;">Order date：</span> {{invoiceSubmission.paytime}}</div>
                        <div><span style="font-weight:600;">Order：</span>{{invoiceSubmission.platform_order_id}}</div>
                        <div style="padding-left:606px;">
                            <el-form-item prop="invoice_number" label-width="80" label="Invoice：">
                                <el-input size="small" style="width:240px;" type="text" v-model="invoiceSubmission.invoice_number"></el-input>
                            </el-form-item>
                        </div>
                        <div class="invoiceB2Btable">
                            <table cellspacing="0" cellpadding="0" style="max-width:100%;">
                                <tr>
                                    <td style="width:300px;"><div style="font-weight:700;font-size:14px;">Invoice details</div></td>
                                    <td colspan="5"></td>
                                </tr>
                                <tr>
                                    <td><div style="font-weight:600;">Description</div></td>
                                    <td><div style="font-weight:600;">Qty</div></td>
                                    <td><span style="font-weight:600;">Unit price</span>({{invoiceSubmission.currency}})</td>
                                    <td><div style="font-weight:600;">VAT rate</div></td>
                                    <td><span style="font-weight:600;">Unit price</span>({{invoiceSubmission.currency}})</td>
                                    <td><span style="font-weight:600;">Item subtotal</span>({{invoiceSubmission.currency}})</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>(excl. VAT)</td>
                                    <td></td>
                                    <td>(incl. VAT)</td>
                                    <td></td>
                                </tr>
                                <tr v-for="(item,index) in invoiceSubmission.product_info_list">
                                    <td>
                                        <div>{{item.title}}</div>
                                        <div style="padding-top:10px;text-align:left;">{{item.asin}}</div>
                                    </td>
                                    <td>{{item.quantity}}</td>
                                    <td>{{item.vat_sale_price?item.vat_sale_price:'0.00'}}</td>
                                    <td>{{invoiceSubmission.vat_tax_point}}%</td>
                                    <td>{{item.sale_price?item.sale_price:'0.00'}}</td>
                                    <td>{{item.pro_total_price?item.pro_total_price:'0.00'}}</td>
                                </tr>
                                <tr>
                                    <td>Shipping Charge</td>
                                    <td colspan="2">{{invoiceSubmission.vat_ship_cost?invoiceSubmission.vat_ship_cost:'0.00'}}</td>
                                    <td>{{invoiceSubmission.vat_tax_point}}%</td>
                                    <td>{{invoiceSubmission.ship_cost?invoiceSubmission.ship_cost:'0.00'}}</td>
                                    <td>{{invoiceSubmission.ship_cost?invoiceSubmission.ship_cost:'0.00'}}</td>
                                </tr>
                                <tr>
                                    <td>Gift Wrap</td>
                                    <td colspan="2">{{invoiceSubmission.vat_giftwrap_amount?invoiceSubmission.vat_giftwrap_amount:'0.00'}}</td>
                                    <td>{{invoiceSubmission.vat_tax_point}}%</td>
                                    <td>{{invoiceSubmission.giftwrap_amount?invoiceSubmission.giftwrap_amount:'0.00'}}</td>
                                    <td>{{invoiceSubmission.giftwrap_amount?invoiceSubmission.giftwrap_amount:'0.00'}}</td>
                                </tr>
                                <tr>
                                    <td>Promotions</td>
                                    <td colspan="2">{{invoiceSubmission.vat_promotions?'-'+invoiceSubmission.vat_promotions:'0.00'}}</td>
                                    <td>{{invoiceSubmission.vat_tax_point}}%</td>
                                    <td>{{invoiceSubmission.promotions?'-'+invoiceSubmission.promotions:'0.00'}}</td>
                                    <td>{{invoiceSubmission.promotions?'-'+invoiceSubmission.promotions:'0.00'}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="totalInvoiceB2B">
                        <div class="invoiceTotal">
                            <div class="headInvoiceTotal">
                                <div style="font-weight:700;font-size:14px;">Invoice total</div>
                                <div style="font-weight:700;font-size:14px;">{{invoiceSubmission.total_price?invoiceSubmission.total_price:'0.00'}} {{invoiceSubmission.currency}}</div>
                            </div>
                            <div>
                                <table cellspacing="0" cellpadding="0" style="width:100%;">
                                    <tr style="height:28px;">
                                        <td style="width:33%;"><span style="font-weight:600;">VAT rate</span>({{invoiceSubmission.currency}})</td>
                                        <td style="width:33%;"><span style="font-weight:600;">Item subtotal</span>({{invoiceSubmission.currency}})</td>
                                        <td style="width:33%;"><span style="font-weight:600;">VAT subtotal</span>({{invoiceSubmission.currency}})</td>
                                    </tr>
                                    <tr style="height:28px;">
                                        <td></td>
                                        <td>(excl. VAT)</td>
                                        <td></td>
                                    </tr>
                                    <tr style="height:28px;" v-for="(item,index) in invoiceSubmission.product_info_list">
                                        <td>{{invoiceSubmission.vat_tax_point}}%</td>
                                        <td>{{item.vat_pro_total_price?item.vat_pro_total_price:'0.00'}}</td>
                                        <td>{{item.vat_pro_amount?item.vat_pro_amount:'0.00'}}</td>
                                    </tr>
                                    <tr style="height:28px;">
                                        <td style="border-top:2px solid #C9C9C9;"><div style="font-weight:600;text-align: left;">Total</div></td>
                                        <td style="border-top:2px solid #C9C9C9;">{{invoiceSubmission.vat_pro_more_total?invoiceSubmission.vat_pro_more_total:'0.00'}}</td>
                                        <td style="border-top:2px solid #C9C9C9;">{{invoiceSubmission.vat_total_pro_amount}}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <el-dialog
                    :visible="isInvoiceShow"
                    top="0"
                    width="900px"
                    custom-class="printPreview"
                    append-to-body>
                    <div class="invoiceContent" ref="invoiceContent">
                        <div class="invoiceEnglish" ref="invoiceEnglish"  v-if="InvoiceInfo.site.toUpperCase()!='JP'&&!InvoiceInfo.B2B">
                            <div class="invoiceEnglishTop">{{invoiceSubmission.customer_company}}</div>
                            <div class="invoiceEnglishCompanyAddress">{{invoiceSubmission.customer_addr}}</div>
                            <div class="invoiceEnglishCompanyTelephone">
                                <span v-show="detailsInvoiceInfo.company_tel==''?false:true">Tel.{{detailsInvoiceInfo.company_tel}}</span> 
                                <span v-show="detailsInvoiceInfo.company_fox==''?false:true">Fax.{{detailsInvoiceInfo.company_fox}}</span> 
                            </div>
                            <div class="invoiceEnglishText">INVOICE</div>
                            <div style="display: flex;justify-content: space-between;padding:20px 80px;">
                                <div>Company name:{{invoiceSubmission.buyer_id}}</div>
                                <div>NO:{{invoiceSubmission.platform_order_id}}</div>
                            </div>
                            <div class="invoiceEnglishCustomerAddress">Company address: {{invoiceSubmission.cust_addr}}</div>
                            <div class="invoiceEnglishPaymentTime">Date:{{invoiceSubmission.paytime}}</div>
                            <div class="invoiceEnglishTable">
                                <table cellspacing="0" cellpadding="0" style="max-width:80%;">
                                    <tr>
                                        <td width="500">MODEL NO./DESCRIPTION</td>
                                        <td width="100">QTY (pc)</td>
                                        <!-- <td width="50">UP</td>
                                        <td width="50">{{detailsInvoiceInfo.currency}}</td>
                                        <td width="50">VAT</td> -->
                                    </tr>
                                    <tr v-for="item in invoiceSubmission.product_info_list">
                                        <td>{{item.title}}</td>
                                        <td>{{item.quantity}}</td>
                                        <!-- <td>{{item.sale_price}}</td>
                                        <td>{{item.quantity*item.sale_price}}</td>
                                        <td>{{item.vat}}</td> -->
                                    </tr>
                                    <tr class="invoicePrice">
                                        <td colspan="2">
                                            <span>Total Amount：{{invoiceSubmission.total_price}}{{detailsInvoiceInfo.currency}}</span>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>VAT：{{invoiceSubmission.vat}}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="invoiceEnglishPackage">Package: The goods be packed in one box. Export Standard Package</div>
                            <div class="invoiceEnglishTermsPayment">Terms of Payment:100% payment pay through paypal or bank transfer</div>
                            <div class="invoiceEnglishDetail" v-show="detailsInvoiceInfo.account_holder==''&&detailsInvoiceInfo.bank_account==''&&detailsInvoiceInfo.bank_name==''?false:true">The detail of our bank</div>
                            <div class="invoiceEnglishBank">
                                <div v-show="detailsInvoiceInfo.account_holder==''?false:true">Beneficiary: {{detailsInvoiceInfo.account_holder}}</div>
                                <div v-show="detailsInvoiceInfo.bank_account==''?false:true">Account Number:{{detailsInvoiceInfo.bank_account}}</div>
                                <div v-show="detailsInvoiceInfo.bank_name==''?false:true">Opening Bank:{{detailsInvoiceInfo.bank_name}}</div>
                            </div>
                            <div class="invoiceEnglishDetail">The detail of our company</div>
                            <div class="invoiceEnglishBank"style="width:500px;">
                                <div>{{invoiceSubmission.customer_addr}}</div>
                                <div>
                                    <span v-show="detailsInvoiceInfo.company_tel==''?false:true">Tel.{{detailsInvoiceInfo.company_tel}}</span> 
                                    <span v-show="detailsInvoiceInfo.company_fox==''?false:true">Fax.{{detailsInvoiceInfo.company_fox}}</span> 
                                </div>
                            </div>
                            <div class="invoiceEnglishAccepted">CONFIRMED AND ACCEPTED BY</div>
                            <div class="invoiceEnglishCustomer" v-model="invoiceSubmission.buyer_id">{{invoiceSubmission.buyer_id}}</div>
                            <div class="invoiceEnglishEnding">SIGNATURE AND COMPANY CHOP</div>
                            <div class="invoiceEnglishSealPicture">
                                <div class="invoiceEnglishLimited">
                                    <div>{{invoiceSubmission.customer_company}}</div>
                                    <div>{{detailsInvoiceInfo.account_holder}}</div>
                                </div>
                                <img :src="detailsInvoiceInfo.invoice_stamp" id='img' width="180px;">
                            </div>
                        </div>

                        <div class="invoiceJapanese"  ref="invoiceJapanese" v-if="InvoiceInfo.site.toUpperCase()=='JP'&&!InvoiceInfo.B2B">
                            <div class="invoiceJapaneseTop">
                                <div>請求書</div>
                                <div>invoice</div>
                            </div>
                            <div class="InvoiceJapaneseDate">インボイス作成日(Date) ：{{invoiceSubmission.invoice_time}}</div>
                            <div class="invoiceJapanesePeopleInfo">
                                <div style="width:150px;">ご依頼主 (Sender):</div>
                                <div>{{invoiceSubmission.customer_addr}}</div>
                            </div>
                            <div class="invoiceJapanesePeopleInfo">
                                <div style="width:150px;">お届け先 (Addressee):</div>
                                <div>{{invoiceSubmission.cust_addr}}</div>
                            </div>
                            <div class="invoiceJapaneseOrderInfo">
                                <div>注文日：{{invoiceSubmission.paytime}}</div>
                                <div>注文番号(Order No.)：{{invoiceSubmission.platform_order_id}}</div>
                            </div>
                            <div class="invoiceJapaneseTable">
                                <table cellspacing="0" cellpadding="0" style="max-width:90%;">
                                    <tr style="background-color: #FAFAFA;">
                                        <td width="500">
                                            <div>内容品の記載</div>
                                            <div>(Description)</div>
                                        </td>
                                        <td width="100">
                                            <div>数量</div>
                                            <div>(Quantity)</div>
                                        </td>
                                        <!-- <td>
                                            <div>単価</div>
                                            <div>(Unit Price)</div>
                                        </td>
                                        <td>
                                            <div>合計額</div>
                                            <div>(Total Amount)</div>
                                        </td> -->
                                    </tr>
                                    <tr v-for="item in invoiceSubmission.product_info_list">
                                        <td>{{item.title}}</td>
                                        <td>{{item.quantity}}</td>
                                        <!-- <td>{{item.sale_price}}</td>
                                        <td>{{item.quantity*item.sale_price}}</td> -->
                                    </tr>
                                    <tr class="invoicePrice">
                                        <td colspan="4">合計金額：{{invoiceSubmission.total_price}}{{detailsInvoiceInfo.currency}}</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="invoiceJapaneseSealPicture">
                                <div class="invoiceJapaneseLimited">
                                    <div>{{invoiceSubmission.customer_company}}</div>
                                    <div>{{detailsInvoiceInfo.account_holder}}</div>
                                </div>
                                <img :src="detailsInvoiceInfo.invoice_stamp" width="180px;" height="180px;">
                            </div>
                        </div>

                        <div class="invoiceB2B" ref="invoiceB2B" v-if="InvoiceInfo.B2B">
                            <div>
                                <div class="titleInvoiceB2B">Invoice</div>
                                <div class="headInvoiceB2B">
                                    <div class="linkHeadInvoiceB2B">For questions about your order, visit：{{invoiceSubmission.platform_site_url}}</div>
                                    <div class="dataHeadInvoiceB2B">Invoice date：{{invoiceSubmission.invoice_time}}</div>
                                </div>
                                <div class="addressInvoiceB2B" style="border-top:2px solid #C9C9C9;">
                                    <div class="Billing">
                                        <div style="font-weight:700;font-size:14px;">Billing address</div>
                                        <div>{{invoiceSubmission.buyer_id}}</div>
                                        <div>{{invoiceSubmission.cust_addr}}</div>
                                    </div>
                                    <div class="Delivery">
                                        <div class="deliveryAddress">
                                            <div style="font-weight:700;font-size:14px;">Delivery address</div>
                                            <div>{{buyer_id}}</div>
                                            <div style="word-wrap:break-word;">{{cust_addr}}</div>
                                        </div>
                                        <div class="soldBy">
                                            <div style="font-weight:700;font-size:14px; ">Sold by</div>
                                            <div>{{invoiceSubmission.account_name}}</div>
                                            <div>{{invoiceSubmission.vat_addr}}</div>
                                            <div>VAT Number: {{invoiceSubmission.vat_number}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="orderInvoiceB2B" style="border-top:2px solid #C9C9C9;">
                                    <div style="font-weight:700;font-size:14px;">Order information</div>
                                    <div><span style="font-weight:600;">Order date：</span> {{invoiceSubmission.paytime}}</div>
                                    <div><span style="font-weight:600;">Order：</span>{{invoiceSubmission.platform_order_id}}</div>
                                    <div style="text-align: right;">Invoice：{{invoiceSubmission.invoice_number}}</div>
                                    <div class="invoiceB2Btable">
                                        <table cellspacing="0" cellpadding="0" style="max-width:100%;">
                                            <tr>
                                                <td style="width:300px;"><div style="font-weight:700;font-size:14px;">Invoice details</div></td>
                                                <td colspan="5"></td>
                                            </tr>
                                            <tr>
                                                <td><div style="font-weight:600;">Description</div></td>
                                                <td><div style="font-weight:600;">Qty</div></td>
                                                <td><span style="font-weight:600;">Unit price</span>({{invoiceSubmission.currency}})</td>
                                                <td><div style="font-weight:600;">VAT rate</div></td>
                                                <td><span style="font-weight:600;">Unit price</span>({{invoiceSubmission.currency}})</td>
                                                <td><span style="font-weight:600;">Item subtotal</span>({{invoiceSubmission.currency}})</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td>(excl. VAT)</td>
                                                <td></td>
                                                <td>(incl. VAT)</td>
                                                <td></td>
                                            </tr>
                                            <tr v-for="(item,index) in invoiceSubmission.product_info_list">
                                                <td>
                                                    <div>{{item.title}}</div>
                                                    <div style="padding-top:10px;text-align:left;">{{item.asin}}</div>
                                                </td>
                                                <td>{{item.quantity}}</td>
                                                <td>{{item.vat_sale_price?item.vat_sale_price:'0.00'}}</td>
                                                <td>{{invoiceSubmission.vat_tax_point}}%</td>
                                                <td>{{item.sale_price?item.sale_price:'0.00'}}</td>
                                                <td>{{item.pro_total_price?item.pro_total_price:'0.00'}}</td>
                                            </tr>
                                            <tr>
                                                <td>Shipping Charge</td>
                                                <td colspan="2">{{invoiceSubmission.vat_ship_cost?invoiceSubmission.vat_ship_cost:'0.00'}}</td>
                                                <td>{{invoiceSubmission.vat_tax_point}}%</td>
                                                <td>{{invoiceSubmission.ship_cost?invoiceSubmission.ship_cost:'0.00'}}</td>
                                                <td>{{invoiceSubmission.ship_cost?invoiceSubmission.ship_cost:'0.00'}}</td>
                                            </tr>
                                            <tr>
                                                <td>Gift Wrap</td>
                                                <td colspan="2">{{invoiceSubmission.vat_giftwrap_amount?invoiceSubmission.vat_giftwrap_amount:'0.00'}}</td>
                                                <td>{{invoiceSubmission.vat_tax_point}}%</td>
                                                <td>{{invoiceSubmission.giftwrap_amount?invoiceSubmission.giftwrap_amount:'0.00'}}</td>
                                                <td>{{invoiceSubmission.giftwrap_amount?invoiceSubmission.giftwrap_amount:'0.00'}}</td>
                                            </tr>
                                            <tr>
                                                <td>Promotions</td>
                                                <td colspan="2">{{invoiceSubmission.vat_promotions?'-'+invoiceSubmission.vat_promotions:'0.00'}}</td>
                                                <td>{{invoiceSubmission.vat_tax_point}}%</td>
                                                <td>{{invoiceSubmission.promotions?'-'+invoiceSubmission.promotions:'0.00'}}</td>
                                                <td>{{invoiceSubmission.promotions?'-'+invoiceSubmission.promotions:'0.00'}}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div class="totalInvoiceB2B">
                                    <div class="invoiceTotal">
                                        <div class="headInvoiceTotal">
                                            <div style="font-weight:700;font-size:14px;">Invoice total</div>
                                            <div style="font-weight:700;font-size:14px;">{{invoiceSubmission.total_price?invoiceSubmission.total_price:'0.00'}} {{invoiceSubmission.currency}}</div>
                                        </div>
                                        <div>
                                            <table cellspacing="0" cellpadding="0" style="width:100%;border-top:2px solid #C9C9C9;">
                                                <tr style="height:28px;">
                                                    <td style="width:33.3%;"><span style="font-weight:600;">VAT rate</span>({{invoiceSubmission.currency}})</td>
                                                    <td style="width:33.3%;"><span style="font-weight:600;">Item subtotal</span>({{invoiceSubmission.currency}})</td>
                                                    <td style="width:33.3%;"><span style="font-weight:600;">VAT subtotal</span>({{invoiceSubmission.currency}})</td>
                                                </tr>
                                                <tr style="height:28px;">
                                                    <td></td>
                                                    <td>(excl. VAT)</td>
                                                    <td></td>
                                                </tr>
                                                <tr style="height:28px;" v-for="(item,index) in invoiceSubmission.product_info_list">
                                                    <td>{{invoiceSubmission.vat_tax_point}}%</td>
                                                    <td>{{item.vat_pro_total_price?item.vat_pro_total_price:'0.00'}}</td>
                                                    <td>{{item.vat_pro_amount?item.vat_pro_amount:'0.00'}}</td>
                                                </tr>
                                                <tr style="height:28px;">
                                                    <td style="border-top:2px solid #C9C9C9;"><div style="font-weight:600;text-align: left;">Total</div></td>
                                                    <td style="border-top:2px solid #C9C9C9;">{{invoiceSubmission.vat_pro_more_total?invoiceSubmission.vat_pro_more_total:'0.00'}}</td>
                                                    <td style="border-top:2px solid #C9C9C9;">{{invoiceSubmission.vat_total_pro_amount}}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-dialog>
            <div style="display: flex;padding-top:100px;justify-content: center;" id="buttonInvoice">
                    <el-button size="small" style="margin-right:30px;" type="primary" @click="handleSubmitInvoiceInterface()"
                        v-show="!InvoiceInfo.B2B"
                        >同步
                    </el-button>
                
                    <!-- <el-button size="small" type="primary" @click="handleInvoicePrinting">打印预览</el-button> -->
                    <el-button size="small" style="margin-right:30px;" type="primary" @click="handleDownLoad('PDF')">下载PDF</el-button>
                
                    <el-button size="small" style="margin-right:30px;" type="primary" @click="handleDownLoad('JPG')">下载JPG</el-button>
                
                    <el-button size="small" @click="cancel(true)">取消</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex'
    import config from '@/assets/js/config';
    import {
        getPdfView,
        getJpgView
    } from "../../../../api/invoice/index";
    import html2canvas from 'html2canvas';
    import * as math from 'mathjs';
    import pdfjs from 'pdfjs-dist';
    import JsPDF from 'jspdf';

export default {
    name: "OrderInvoice",
    props: {
        isInvoice:{
            type: Boolean,
            default: {}
        },
        // invoiceCurrency: {
        //     type: Object,
        //     default: {}
        // },
        InvoiceInfo: {
            type: Object,
            default: {}
        },
        detailsInvoiceInfo: {
            type: Object,
            default: {}
        },
        invoice: {
            type: Object,
            default:()=> {
                return {}
            }
        }
    },
    data() {
        return {
			invoiceRules: {
				addr: [
					{
						required: true,
						message: "此项为必填项",
						trigger: "blur"
					}
				],
				cust_addr: [
					{
						required: true,
						message: "此项为必填项",
						trigger: "blur"
					}
                ],
                paytime: [
					{
						required: true,
						message: "此项为必填项",
						trigger: "blur"
					}
                ],
                platform_order_id:[
					{
						required: true,
						message: "此项为必填项",
						trigger: "blur"
					}
                ],
                buyer_id:[
					{
						required: true,
						message: "此项为必填项",
						trigger: "blur"
					}
                ],
                invoice_number:[
					{
						required: true,
						message: "此项为必填项",
						trigger: "blur"
					}
                ],
                vat:[{pattern:  /^([0-9]+)((\.[0-9][0-9])||\.[0-9])?$/,message: '增值税不能为负数，且只能保留小数点后两位！'}],
                total_price:[
					{
						required: true,
						message: "此项为必填项",
						trigger: "blur"
                    },
                    {pattern:  /^([0-9]+)((\.[0-9][0-9])||\.[0-9])?$/,message: '总价不能为负数，且只能保留小数点后两位！'}
                ],
            },
            invoicePrinting:false,//控制是否显示打印区域
            isInvoiceShow:true,//发票弹窗
            // product:{
            //     product_info_list:[],
            //     total_price:0
            // },
            invoiceCurrency:{//发票货币币种
                USD:'USD',
                CNY:'CNY',
                EUR:'EUR'
            },
            invoiceSubmission:{
                paytime:'',
                cust_addr:'',
                buyer_id:'',
                company_name:'',
                company_addr:'',
                company_tel:'',
                company_fox:'',
                order_id:'',
                platform_order_id:'',
                account_holder:'',
                bank_account:'',
                bank_name:'',
                img_url:'',
                product_info:'',
                site:'',
                total_price:'',
                currency:'',
                customer_addr:'',
                vat:"",
                product_info_list:[],
                invoice_time:'',
                pro_total:0,
                vat_pro_total:0,
                invoice_number:''
            },
            cust_addr:'',
            buyer_id:"",
		};
    },
    methods: {
        getPdfView,//发票pdf下载
        getJpgView,//发票JPG下载
        // handleInvoicePrinting(){//打印发票
        //     this.$refs.invoiceSubmission.validate((valid) => {
        //         if (valid) {
        //             this.invoicePrinting = true
        //             // this.cancel(false)
        //             setTimeout(()=>{
        //                 window.print(setTimeout(()=>{
        //                     this.invoicePrinting = false
        //                     // if(!this.invoicePrinting)this.isInvoiceShow=true
        //                 },100));
        //             },500)
        //         } else {
        //             console.log('error submit!!');
        //             return false;
        //         }
        //     })
        // },
        //删除商品信息
        elCircleRemoveOutline(commodity,index) {
            this.invoiceSubmission.product_info_list.splice(index, 1);
            // this.HandleCalculationTotalAmount()
        },
        //新增商品信息
        elCirclePlusOutline() {
            let obj = {
                title: "",
                quantity: 1,
                // sale_price: 0,
                // vat: '',
            };
            this.invoiceSubmission.product_info_list.push(obj);
		},
		// //change计算总金额
		// HandleCalculationTotalAmount(){
		// 	let totalAmount = this.product.product_info_list
		// 	let product = 0
		// 	totalAmount.forEach(element => {
		// 		product += element.sale_price*element.quantity
        //     });
		// 	// this.invoiceSubmission.pro_pric = product
        //     this.invoiceSubmission.total_price = product.toFixed(2)
        //     this.product.total_price = product.toFixed(2)
		// },
		//同步
		handleSubmitInvoiceInterface(){
            this.$refs.invoiceSubmission.validate((valid) => {
                if (valid) {
                    // this.invoiceSubmission.product_info_list = this.invoiceSubmission.product_info_list
                    // this.invoiceSubmission.product_info_list.forEach(element => {
                    //     let obj = {
                    //         title:element.title,
                    //         qty:element.quantity,
                    //         // pro_price:element.sale_price,
                    //         // vat:element.vat,
                    //     }
                    //     this.invoiceSubmission.product.push(obj)
                    // });
                    this.invoiceSubmission.product = this.invoiceSubmission.product_info_list;
                    this.invoiceSubmission.registered_company = this.InvoiceInfo.platform_code
                    this.invoiceSubmission.tracking_number = this.detailsInvoiceInfo.tracking_number
                    this.invoiceSubmission.currency = this.detailsInvoiceInfo.currency
                    this.invoiceSubmission.sale_account = this.detailsInvoiceInfo.sale_account
                    this.invoiceSubmission.cust_addr = this.invoiceSubmission.cust_addr.replace(/[\r\n]/g, "");
                    // this.$refs['invoiceSubmission'].resetFields();
                    this.$emit('handleSubmitInvoiceInterface', this.invoiceSubmission)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        cancel(bool){
            this.isInvoiceShow=false
            if(bool){
                this.invoiceSubmission.product_info_list = this.detailsInvoiceInfo.product_info_list
                this.invoiceSubmission.total_price = this.detailsInvoiceInfo.total_price;
                this.$refs['invoiceSubmission'].resetFields();
            }
        },
        //下载发票图片
        handleDownLoad(format){
             this.$refs.invoiceSubmission.validate((valid) => {
                if (valid) {
                    let element = '';
                    if(this.InvoiceInfo.B2B){
                        element = 'invoiceB2B';
                    }else{
                        if(this.InvoiceInfo.site.toUpperCase()=='JP')element = 'invoiceJapanese';
                        else element = 'invoiceEnglish';
                    }
                    switch (format) {
                        case 'JPG':
                                this.toImage(element,false);
                            break;
                        default:
                                this.toImage(element,true);
                            break;
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        toImage (element,bool) {
            setTimeout(() => {
                // 创建一个新的canvas
                const _canvas = this.$refs.invoiceContent;
                // 此处用于解决截图不清晰问题，将生成的canvas放大，然后再填充到原有的容器中就会清晰
                // const width = _canvas.scrollWidth; 
                // const height = _canvas.scrollHeight; 
                // const canvas2 = document.createElement('canvas');
                const scale = 2;
                // canvas2.width = width*2;
                // canvas2.height = height*2;
                // const context1 = canvas2.getContext('2d')
                // if(context1) {
                //     context1.scale(scale, scale);
                // }
                const options = {
                        scale:scale,
                        // logging: true, //日志开关，便于查看html2canvas的内部执行流程
                        // width:width,
                        // height:height,
                        imageTimeout:500,
                        async: true,
                        // canvas:canvas2,
                        // 【重要】开启跨域配置
                        
                        useCORS: true 
                    };
                html2canvas(_canvas,options).then((canvas) => {
                    // const context = canvas2.getContext('2d');
                    // if(context) {
                    //     context.scale(2,2);
                    //     context.mozImageSmoothingEnabled = false;
                    //     context.webkitImageSmoothingEnabled = false;
                    //     context.imageSmoothingEnabled = false;
                    // }
                    let contentWidth = canvas.width;
                    let contentHeight = canvas.height;
                    let pageHeight = contentWidth / 592.28 * 841.89;
                    let leftHeight = contentHeight;
                    let position = 0;
                    let imgWidth = 595.28;
                    let imgHeight = 592.28/contentWidth * contentHeight;;
                    let url = canvas.toDataURL('image/jpg',0.5);
                    if(bool){
                        let PDF = new JsPDF('', 'pt', 'a4')
                        let page = 1
                        if (leftHeight < pageHeight) {
                            PDF.addImage(url, 'JPEG', 0, 0, imgWidth, imgHeight,'','SLOW');
                            let str1 = `Page ${page} / ${page}`
                            PDF.text(str1, 200, 840)
                            console.log('分页')
                        } else {
                            while (leftHeight > 0) {
                                PDF.addImage(url, 'JPEG', 0, position, imgWidth, imgHeight,'','SLOW');
                                leftHeight -= pageHeight;
                                position -= 841.89
                                if (leftHeight > 0) {
                                    // PDF.addPage()
                                    page += 1
                                    PDF.text(`第${page}页`, 200, 840)
                                }
                            }
                        }
                        let testUrl = PDF.save((new Date()).getTime() + '.' + "pdf");
                        console.log('testUrl', PDF.output('bloburl'))
                    } else {
                        var eleLink = document.createElement("a");
                        eleLink.href = url;// 转换后的图片地址
                        eleLink.download =(new Date()).getTime() + '.' + "jpg";
                        // 触发点击
                        document.body.appendChild(eleLink);
                        eleLink.click();
                        // 然后移除
                        document.body.removeChild(eleLink);
                    }
                
                })
            },1000)
        }
    },
    watch:{
        detailsInvoiceInfo(val, old){
            this.invoiceCurrency={//发票货币币种
                USD:'USD',
                CNY:'CNY',
                EUR:'EUR'
            }
            if(val.company_name){
                for (const key in val) {
                    this.invoiceSubmission[key] = val[key];
                }
                if(!this.invoiceSubmission.vat)this.invoiceSubmission.vat=0;
                this.invoiceSubmission.invoice_time = this.invoice.invoice_time;
                this.invoiceSubmission.customer_addr = this.invoiceSubmission.company_addr;
                this.invoiceSubmission.paytime = val.paytime;
                this.invoiceCurrency[val.currency]=val.currency;
                this.invoiceSubmission.product_info_list = this.detailsInvoiceInfo.product_info_list;
               
                let str = '';
                if(this.InvoiceInfo.B2B){
                    if(val.cust_name)str += val.cust_name+",";
                    if(val.ship_phone)str += val.ship_phone+",";
                    if(val.ship_street1)str += val.ship_street1+",";
                    if(val.ship_street2)str += val.ship_street2+",";
                    if(val.ship_city_name)str += val.ship_city_name+",";
                    if(val.ship_stateorprovince)str += val.ship_stateorprovince+",";
                    if(val.ship_zip)str += val.ship_zip+",";
                    if(val.ship_country)str += val.ship_country+",";
                    str = str.substring(0, str.length - 1)
                }else{
                    if(val.cust_name)str += val.cust_name+","+"\n";
                    if(val.ship_phone)str += val.ship_phone+","+"\n";
                    if(val.ship_street1)str += val.ship_street1+","+"\n";
                    if(val.ship_street2)str += val.ship_street2+","+"\n";
                    if(val.ship_city_name)str += val.ship_city_name+","+"\n";
                    if(val.ship_stateorprovince)str += val.ship_stateorprovince+","+"\n";
                    if(val.ship_zip)str += val.ship_zip+","+"\n";
                    if(val.ship_country)str += val.ship_country+","+"\n";
                    str = str.substring(0, str.length - 2)
                }
                this.invoiceSubmission.cust_addr = str;
                this.buyer_id = this.invoiceSubmission.buyer_id;
                this.cust_addr = str;
                this.invoiceSubmission.create_time = this.invoiceSubmission.create_time.substring(0, this.invoiceSubmission.create_time.length - 8);
                this.invoiceSubmission.create_time = this.invoiceSubmission.create_time.replace(/-/g," ");
                this.isInvoiceShow=true;
            }else{
                this.isInvoiceShow=false;
                this.$message.warning('缺少发票必要信息，请先去添加账号发票模板！');
            }
        }
    },
};
</script>

<style lang="less">
    // 下拉框z-index
    .zindexhighest{
        z-index: 10002 !important;
    }

    // 信息弹框z-index
    .el-message-box__wrapper{
        z-index: 10002 !important;
    }

    // 消息弹框
    .el-message{
        z-index: 10003 !important;
    }
</style>
<style lang="less" scoped>
// @media print{
//     /deep/.el-dialog__header{
//         display:none;
//     }
//     .el-dialog.is-fullscreen{
//         overflow: hidden;
//     }
//     .invoiceStyle{
//         display: none;
//     }
// }

/deep/.printPreview{
    z-index: 200000 !important;
    position: fixed;
    left:50%;
    transform: translateX(-50%);
    background-color: white;
}

.invoiceStyle {
    /deep/.el-dialog{
        margin-bottom:0px;
    }
    /deep/.el-dialog__header {
        background-color: #f2f2f2;
        border-bottom: 1px solid #a9a9a9;
        .el-dialog__title {
            font-size: 14px;
            line-height: 24px;
        }
    }
    /deep/.el-dialog__body {
        background-color: #f2f2f2;
    }
    .invoiceMain {
        padding: 10px;
        .invoiceHeadline {
            text-align: center;
            font-size: 18px;
            font-weight: 600;
            margin: 20px 0;
        }
        .invoiceSubheading {
            text-align: center;
            padding: 20px 0;
        }
        .invoiceText {
            table {
                display: inline-block;
                background-color: white;
                text-align: center;
                border-right: 1px solid #e6e6e6;
                border-bottom: 1px solid #e6e6e6;
                font-size: 12px;
                table-layout: fixed; 
                td{
                    border-top: 1px solid #e6e6e6;
                    border-left: 1px solid #e6e6e6;
                    padding: 5px 10px;
                    // white-space: nowrap; /* 自适应宽度*/
                    // word-break:  keep-all;
                    /deep/.el-form-item__error{
                        position: relative;
                        // top: -8px;
                    }
                    .el-form-item__content,.el-input.el-input--mini{
                        line-height: 28px;
                        height: 28px;
                    }
                    .el-form-item__error{
                        padding: 0;
                    }
                }
                .invoiceOpertion {
                    font-size: 20px;
                    i {
                        height: auto;
                        cursor: pointer;
                        vertical-align: hidden;
                    }
                }
                .el-form-item {
                    margin: 0px;
                }
            }
        }
        .invoiceBelow {
            padding-left: 100px;
            div {
                padding: 20px 0 0 0;
            }
        }
    }
    .el-dialog__footer {
        background-color: #f2f2f2;
        text-align: center;
    }
    .sealPicture {
        width: 200px;
        height: 200px;
        display: inline-block;
        position: absolute;
        left: 700px;
        bottom: 100px;

    }
    .sealPictureJapan {
        position: relative;
        display: inline-block;
        left: 700px;
        top: 50px;
        width: 200px;
        height: 200px;
        .limited {
            position: absolute;
            top: 50px;
        }
    }
    .limited {
        position: absolute;
    }
    .invoicePrice {
        .el-form-item__label {
            width: 120px !important;
        }
        .el-form-item__content {
            margin-left: 20px !important;
        }
    }
    .invoiceJapanTime {
        text-align: right;
        padding-right: 100px;
    }
}
/deep/.invoiceContent{
    width: 840px;
    height: auto;
    margin: auto;
    padding: 30px 30px;
    font-size: 12px;
    .invoiceEnglish{
        padding-bottom:100px;
        .invoiceEnglishTop,.invoiceEnglishText{
            text-align: center;
            font-size: 20px;
            font-weight: 600;
            margin: 30px 0;
        }
        .invoiceEnglishCompanyAddress{
            text-align: center;
        }
        .invoiceEnglishCompanyTelephone{
            text-align: center;
        }
        .invoiceEnglishCustomerAddress{
            padding: 20px 0 20px 80px;
        }
        .invoiceEnglishPaymentTime{
            padding: 20px 0 20px 80px;
        }
        .invoiceEnglishTable{
            width: 100% ;
            text-align: center;
            table{
                // background-color: null;
                margin: 0 auto;
                width: 100%;
                border-right: solid 1px #e6e6e6;
                border-bottom: solid 1px #e6e6e6;
                font-size: 12px;
                border: solid .5px #e6e6e6;
                td{
                    border-top: solid 1px #e6e6e6;
                    border-left: solid 1px #e6e6e6;
                    padding: 5px 10px;
                    border: solid .5px #e6e6e6;
                }
            }
        }
        .invoiceEnglishPackage,.invoiceEnglishTermsPayment{
            padding: 20px 0 0 80px;
        }
        .invoiceEnglishDetail,.invoiceEnglishAccepted{
            padding: 30px 0 0 80px;
        }
        .invoiceEnglishBank,.invoiceEnglishCustomer{
            padding: 10px 0 0 80px;
        }
        .invoiceEnglishCustomer{
            width: 500px;
        }
        .invoiceEnglishAccepted{
            padding: 30px 0 0 80px;
        }
        .invoiceEnglishEnding{
            padding: 50px 0 0 80px;
        }
        .invoiceEnglishSealPicture{
            position: relative;
            left: 500px;
            display: inline-block;
            bottom: 100px;
            .invoiceEnglishLimited{
                position: absolute;
                top: 20px;
                width: 180px;
            }
        }
    }
    .invoiceJapanese{
        .invoiceJapaneseTop{
            text-align: center;
        }
        .InvoiceJapaneseDate{
            text-align: right;
            padding: 20px 80px 20px 20px;
        }
        .invoiceJapanesePeopleInfo{
            display: flex;
            padding: 20px 0 0 100px;
        }
        .invoiceJapaneseOrderInfo{
            display: flex;
            justify-content: space-around;
            padding: 20px 0;
        }
        .invoiceJapaneseTable{
            // width: 100%;
            // text-align: center;
            // table{
            //     display: inline-block;
            //     border-right: 1px solid #e6e6e6;
            //     border-bottom: 1px solid #e6e6e6;
            //     font-size: 12px;
            //     td{
            //         border-top: 1px solid #e6e6e6;
            //         border-left: 1px solid #e6e6e6;
            //         padding: 5px 10px;
            //     }
            // }
            width: 100% ;
            table{
                margin: 0 auto;
                // background-color: null;
                width: 100%;
                border-right: solid 1px #e6e6e6;
                border-bottom: solid 1px #e6e6e6;
                font-size: 12px;
                border: solid .5px #e6e6e6;
                td{
                    border-top: solid 1px #e6e6e6;
                    border-left: solid 1px #e6e6e6;
                    padding: 5px 10px;
                    border: solid .5px #e6e6e6;
                }
            }
        }
        .invoiceJapaneseSealPicture{
            position: relative;
            left: 500px;
            display: inline-block;
            top: 50px;
            margin-bottom:50px;
            .invoiceJapaneseLimited{
                position: absolute;
                top: 20px;
                width: 180px;
            }
        }
    }
    
}
.invoiceMain,.invoiceContent{
    height: 100%;
    /deep/.invoiceB2B{
        font-size: 12px;
        .titleInvoiceB2B{
            text-align: right;
            color:#808181;
            font-size: 20px;
        }
        /deep/.headInvoiceB2B{
            width: 100%;
            display: flex;
            justify-content: space-between;
            line-height: 40px;
            border-bottom:2px solid #C9C9C9;
            .linkHeadInvoiceB2B{
                padding-left: 10px;
            }
            .dataHeadInvoiceB2B{
                padding-right: 10px;
            }
        }
        /deep/.addressInvoiceB2B{
            width: 100%;
            display: flex;
            height: auto;
            min-height: 150px;
            padding: 10px 0;
            border-bottom:2px solid #C9C9C9;
            line-height: 24px;
            .Billing{
                width: 45%;
                margin-right: 10px;
                padding-left: 10px;
            }
            .Delivery{
                flex:1;
                margin-left: 10px;
                display: flex;
                .deliveryAddress{
                    width: 40%;
                }
                .soldBy{
                    flex:1;
                    margin-left: 10px;
                    padding-right: 10px;
                }
            }
        }
        /deep/.orderInvoiceB2B{
            padding: 10px;
            line-height: 20px;
            .invoiceB2Btable{
                width: 100%;
                background-color: white;
                table {
                    background-color: white;
                    text-align: center;
                    // border-top: 1px solid #e6e6e6;
                    // border-left: 1px solid #e6e6e6;
                    font-size: 12px;
                    // border-spacing: 1px;
                    border-collapse:separate;
                    border: .5px solid #e6e6e6;
                    td{
                        // border-right: 1px solid #e6e6e6;
                        // border-bottom: 1px solid #e6e6e6;
                        padding: 5px 10px;
                        border: .5px solid #e6e6e6;
                    }
                }
            }
        }
        /deep/.totalInvoiceB2B{
            text-align: right;
            .invoiceTotal{
                display: inline-block;
                width: 50%;
                .headInvoiceTotal{
                    display: flex;
                    justify-content: space-between;
                    border-bottom:2px solid #C9C9C9;
                    line-height: 28px;
                    padding: 10px 0;
                }
            }
        }
    }
}
.invoiceContent{
    background-color: white;
    .invoiceEnglish,.invoiceB2B,.invoiceEnglish{
        background-color: white;
    }
}

</style>