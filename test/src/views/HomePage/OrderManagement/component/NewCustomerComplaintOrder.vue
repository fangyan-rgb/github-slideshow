<template>
    <el-form  label-width="80px" :model="registeredCustomerComplaint" ref="registeredCustomerComplaint" :rules="mustFill" class="reSendInfo">
        <div class="customerComplaintHandle">
            <div>
                <el-form-item label="加急：" prop="is_expedited">
                    <template>
                        <el-radio v-model="registeredCustomerComplaint.is_expedited" label="1">加急</el-radio>
                        <el-radio v-model="registeredCustomerComplaint.is_expedited" label="0">不加急</el-radio>
                    </template>
                </el-form-item>
            </div>
            <div>
                <el-form-item label="客诉部门：" :prop="registeredCustomerComplaint.department?'department':'genre'">
                    <template>
                        <el-radio v-model="registeredCustomerComplaint.department?registeredCustomerComplaint.department:registeredCustomerComplaint.genre" @change="registeredCustomerComplaint.complaint_type=''" label="1">仓库部门</el-radio>
                        <el-radio v-model="registeredCustomerComplaint.department?registeredCustomerComplaint.department:registeredCustomerComplaint.genre" @change="registeredCustomerComplaint.complaint_type=''" label="2">物流部门</el-radio>
                    </template>
                </el-form-item>
            </div>
            <div>
                <el-form-item label="客诉类型：" prop="complaint_type">
                    <el-select v-model="registeredCustomerComplaint.complaint_type" size="small" placeholder="请选择">
                        <div v-for="item in customerComplaintFormInfo">
                            <el-option
                                v-if="(registeredCustomerComplaint.department||registeredCustomerComplaint.genre)==item.id"
                                v-for="(value,key) in item.child"
                                :key="key"
                                :label="value"
                                :value="key">
                            </el-option>
                        </div>
                    </el-select>
                </el-form-item>
            </div>
        </div>
        <el-form-item label="详情描述" label-width="90" prop="description">
            <el-input v-model.trim="registeredCustomerComplaint.description" type="textarea" rows="10" placeholder=""></el-input>
        </el-form-item>
        <div class="rowSpacingTable">
            <table cellspacing="0" cellpadding="0">
                <tr>
                    <td width="30">操作</td>
                    <td width="30">产品名称</td>
                    <td width="80">SKU</td>
                    <td width="50">产品线</td>
                    <td width="30">数量</td>
                    <td width="30">附件</td>
                </tr>
                <tr v-for="(item,index) in (registeredCustomerComplaint.detail?registeredCustomerComplaint.detail:obtainOrderDetails.proDetailsInfo)">
                    <td style="text-align:center;">
                        <el-checkbox v-model="item.product" @change="(bool)=>handleProDetailsOption(bool,item)"></el-checkbox>
                    </td>
                    <td>{{item.chinese_title?item.chinese_title:item.title}}</td>
                    <td>{{item.sku}}</td>
                    <td>{{item.linelist_cn_name?item.linelist_cn_name:item.product_line}}</td>
                    <td>{{item.quantity?item.quantity:item.qty}}</td>
                    <td>
                        <el-upload
                            v-if="!orderInfo.edit"
                            class="upload-demo"
                            action="api/system_set/general_upload/upload"
                            name="userfile"
                            :data="userInfo"
                            :ref="'file'+index"
                            :limit="5"
                            :beforeUpload="beforeUpload"
                            :on-exceed="handleExceed"
                            :on-error="handleError"
                            :on-remove="(file, fileList) => handleRemove(file, fileList ,item)"
                            :on-success="(response, file, fileList) => handleAddress(response, file, fileList, item)">
                            <el-button size="small" type="primary">上传</el-button>
                            <div slot="tip">支持gif、jpg、png、jpeg、bmp，格式大小不能超过10M,数量不超过5个</div>
                        </el-upload>
                        <el-upload
                            v-if="orderInfo.edit"
                            class="upload-demo"
                            action="api/system_set/general_upload/upload"
                            :data="userInfo"
                            name="userfile"
                            :ref="'file'+index"
                            :limit="5"
                            :beforeUpload="beforeUpload"
                            :on-exceed="handleExceed"
                            :on-error="handleError"
                            :file-list="item.img_url"
                            :on-remove="(file, fileList) => handleRemove(file, fileList ,item)"
                            :on-success="(response, file, fileList) => handleAddress(response, file, fileList, item)">
                            <el-button size="small" type="primary">上传</el-button>
                            <div slot="tip">支持gif、jpg、png、jpeg、bmp，格式大小不能超过10M,数量不超过5个</div>
                        </el-upload>
                    </td>
                </tr>
            </table>
        </div>
    </el-form>
</template>
<script>
import * as storage from '@/utils/storage';
import routerConfig from '@/router/routerConfig';
import {
        complaintDoEdit,
        customerComplaintSubmission,
    } from '../../../../api/orderInfo/componentjs';
import {getSessionStorage} from '@/utils/storage';

export default {
    name: "NewCustomerComplaintOrder",
    props: {
        obtainOrderDetails: {
            type: Object,
            default: {}
        },
        registeredCustomerComplaintInfo: {
            type: Object,
            default: {}
        },
        order: {
            type: Object,
            default: {}
        },
        isCustomerComplaintSubmission:{
            type: Boolean,
            default: false
        },
        customerComplaintForm:{
            type: Array,
            default: []
        },
    },
    data() {
        return {
            registeredCustomerComplaint:{//提交登记客诉单
                is_expedited:'',//是否加急
                department:'',//客诉部门
                complaint_type:'',//客诉类型
                description:'',//详情描述
                account_id:'',
                warehouse_code:'',
                platform_code:'',
                warehouse_id:'',
                order_id:'',
                platform_order_id:'',
                shipping_date:'',
                buyer_phone:'',
                buyer_id:'',
                buyer_mail:'',
                detail:'',
            },
            customerComplaintFormInfo:[],//客诉单所需信息
            mustFill: {
                is_expedited:[{required: true,message: '是否加急处理',trigger: 'blur'}],
                department:[{required: true,message: '请选择是否加急处理',trigger: 'blur'}],
                complaint_type:[{required: true,message: '请选择客诉类型',trigger: 'blur'}],
                genre:[{required: true,message: '请选择客诉类型',trigger: 'blur'}],
            },
            orderInfo:{},
            userInfo:{
                uid:JSON.parse(getSessionStorage('userInfo')).uid,
                staff_code:JSON.parse(getSessionStorage('userInfo')).staff_code,
            },
        }
    },
    methods: {
        //勾选需要进行客诉的产品
        handleProDetailsOption(bool,item){
            this.$forceUpdate();
            if(bool){
                item.checks = 1;
            }else{
                item.checks = 0;
            }
        },
        //删除图片
        handleRemove(file, fileList, item) {
            if(fileList.length){
                fileList.forEach((element,index) => {
                    if(!index){
                        if(element.url){
                            item.url = element.url;
                            item.img_url = [];
                            item.img_url.push(element);
                        }else{
                            item.url = element.response.file_path;
                            item.img_url = [];
                            item.img_url.push(element.response.file_path);
                        }
                        item.img_name = element.name;
                    }else{
                        if(element.url){
                            item.url += ","+element.url;
                            item.img_url.push(element);
                        }else{
                            item.url += ","+element.response.file_path;
                            item.img_url.push(element.response.file_path);
                        }
                        item.img_name += "<@>"+element.name;
                    }
                });
            }else{
                item.url = '';
                item.img_name = '';
            }
        },
        //登记客诉单上传附件
        handleAddress(response, file, fileList,item){
            if( !response.status ){
                this.$message.error(data.errorMess || '上传失败！');
                return;
            }
            if(item.url){
                item.img_name += "<@>"+file.name;
                item.url += ","+response.file_path;
            }else{
                item.img_name = file.name;
                item.url = response.file_path;
            }
            // if(item.img_url){
            //     item.img_url.push({
            //         uid: 0,
            //         url: response.file_path,
            //         name: file.name,
            //         status: 'success'
            //     });
            // }
            this.$message.success('上传成功！');
            this.$store.commit("SAVE_LOADING_STATE",false);
        },
        handleError(){
            this.$store.commit("SAVE_LOADING_STATE",false);
            this.$message.error('上传失败！');
        },
        beforeUpload(file) {
            let ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
            let extArr = ['gif', 'jpg', 'png', 'jpeg', 'bmp'];
            let size = file.size / 1024 / 1024 < 10;
            if( !size ){
                this.$message.error('文件大小必须在10m以内！');
                return false;
            }
            if( !extArr.includes(ext) ){
                this.$message.error('文件格式不符合！');
                return false;
            }
            this.$store.commit("SAVE_LOADING_STATE",true);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        //提交客诉单
        handleCustomerComplaintSubmission(){
            let bool = true;
            this.changeCustomerComplaint = false;
            if(this.orderInfo.edit){
                this.registeredCustomerComplaint.detail.forEach(element => {
                    if(element.product)bool = false;
                });
            }else{
                this.obtainOrderDetails.proDetailsInfo.forEach(element => {
                    if(element.product)bool = false;
                });
            }
            if(bool)this.changeCustomerComplaint = true;
            this.$refs['registeredCustomerComplaint'].validate((valid) => {
                if (valid) {
                    if(this.changeCustomerComplaint){
                        this.$message.error('请勾选需要进行客诉的产品信息！');
                        return;
                    }
                    if(this.orderInfo.edit){
                        let objEdit = {
                            type:this.registeredCustomerComplaint.complaint_type,
                            description:this.registeredCustomerComplaint.description,
                            genre:this.registeredCustomerComplaint.genre,
                            id:this.registeredCustomerComplaint.id,
                            is_expedited:this.registeredCustomerComplaint.is_expedited,
                            detail:[]
                        };
                        
                        this.registeredCustomerComplaint.detail.forEach(element => {
                            let url = '';
                            let name = '';
                            let obj={
                                checks:element.checks,
                                img_url:element.url,
                                id:element.id,
                                product_line:element.product_line,
                                qty:element.qty,
                                sku:element.sku,
                                title:element.title,
                                img_name:element.img_name
                            };
                            objEdit.detail.push(obj);
                        });
                        let str="";
                        if(this.obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'){
                            str='customer_complaint';
                        }else if(this.obtainOrderDetails.orderDetailsInfo.platform_code==='EB'){
                            str="ebay_customer_complaint";
                        }
                        complaintDoEdit(objEdit,str).then(({ data}) => {
                            if(!data.status){
                                this.$message.error(data.errorMess || '操作失败！');
                                return;
                            }
                            this.$emit("handleCancelOrderInfoPopup");
                            this.$emit("handleOperationCallBack");
                            this.$emit("succeedCallBack",data);
                            this.$emit('handleQueryInfo');
                        })
                    }else{
                        this.registeredCustomerComplaint.platform_code = this.obtainOrderDetails.orderDetailsInfo.platform_code
                        this.registeredCustomerComplaint.warehouse_id = this.obtainOrderDetails.orderDetailsInfo.warehouse_id
                        this.registeredCustomerComplaint.order_id = this.obtainOrderDetails.orderDetailsInfo.order_id
                        this.registeredCustomerComplaint.platform_order_id = this.obtainOrderDetails.orderDetailsInfo.platform_order_id
                        this.registeredCustomerComplaint.buyer_phone = this.obtainOrderDetails.orderDetailsInfo.ship_phone
                        this.registeredCustomerComplaint.buyer_id = this.obtainOrderDetails.orderDetailsInfo.buyer_id
                        this.registeredCustomerComplaint.account_id = this.obtainOrderDetails.orderDetailsInfo.account_id
                        this.registeredCustomerComplaint.buyer_mail = this.obtainOrderDetails.orderDetailsInfo.email
                        this.registeredCustomerComplaint.shipping_date = this.obtainOrderDetails.orderDetailsInfo.shipped_date
                        this.registeredCustomerComplaint.warehouse_code = this.obtainOrderDetails.orderDetailsInfo.warehouse_code
                        this.registeredCustomerComplaint.detail = [];
                        this.obtainOrderDetails.proDetailsInfo.forEach(element => {
                                let obj={
                                    sku:element.sku,
                                    asin:element.asinval,
                                    title:element.chinese_title,
                                    product_line:element.linelist_cn_name,
                                    qty:element.quantity,
                                    img_url:element.product&&element.url?element.url:'',
                                    checks:element.product?1:0,
                                    img_name:element.product&&element.img_name?element.img_name:'',
                                }
                                this.registeredCustomerComplaint.detail.push(obj);
                        });
                        if(this.obtainOrderDetails.orderDetailsInfo==""){
                            this.$message.error("订单信息获取失败！");
                        }else{
                            let str='';
                            if(this.obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'){
                                str='customer_complaint';
                            }else if(this.obtainOrderDetails.orderDetailsInfo.platform_code==='EB'){
                                str='ebay_customer_complaint';
                            }
                            customerComplaintSubmission(this.registeredCustomerComplaint,str).then(({ data}) => {
                                if(!data.status){
                                    this.registeredCustomerComplaint.detail = [];
                                    this.$message.error(data.errorMess || '操作失败！');
                                    return;
                                }
                                this.$emit("handleCancelOrderInfoPopup");
                                this.$emit("handleOperationCallBack");
                                this.$emit("succeedCallBack",data);
                            })
                        }
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
    watch:{
        registeredCustomerComplaintInfo(){
            this.registeredCustomerComplaint={...this.registeredCustomerComplaintInfo};
        },
        isCustomerComplaintSubmission(){
            this.handleCustomerComplaintSubmission();
        },
        customerComplaintForm(){
            this.customerComplaintFormInfo=[...this.customerComplaintForm];
        }
    },
    created(){
        this.registeredCustomerComplaint={...this.registeredCustomerComplaintInfo};
        this.orderInfo={...this.order};
        this.customerComplaintFormInfo=[...this.customerComplaintForm];
    }
};
</script>
<style lang="less" scoped>
.reSendInfo{
    /deep/.el-collapse-item__header.is-active{
        padding: 0 0 0 5px;
        font-weight: 400;
        color: #333333;
    }
    /deep/.el-form-item__error{
        position: static !important;
    }
}
.customerComplaintHandle{
    .el-form-item.is-required{
        /deep/.el-form-item__label{
            line-height: 35px !important;
        }
    }
}
.rowSpacingTable{
    table{
        width: 100%;
        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        tr{
            td{
                border-top: 1px solid #e6e6e6;
                border-left: 1px solid #e6e6e6;
                padding: 5px 5px;
                color: #333333;
                /deep/.el-upload-list__item-name{
                    max-width: 300px;
                }
            }
        }
    }
}
</style>