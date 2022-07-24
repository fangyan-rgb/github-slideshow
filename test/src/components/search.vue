<template>
     <div class="search">

            <!-- 搜索列表 -->
            
                <el-form ref="Form" :model="Form"  class="from"  >
                    <div v-for="(item,key) in FormData"  :key="key" >
                        
                        <!-- 输入框 -->
                        <el-form-item
                                label-position="left" 
                                :label="item.name" 
                                style="margin-right: 20px;" 
                                class="from_list" 
                                v-if=" item.type == 'text' "
                                :prop=" item.rules ? item.key : '' "
                                :rules=" item.rules ? item.rules : [] "
                            >
                            <el-input v-model="Form[item.key]"  size="small"  type="text" :placeholder="item.placeholder" clearable ></el-input>
                        </el-form-item>

                        <!-- 下拉框 -->
                        <el-form-item
                                label-position="left" 
                                :label="item.name"
                                style="margin-right: 20px;" 
                                class="from_list" 
                                v-if=" item.type == 'select' "
                                :prop=" item.rules ? item.key : '' "
                                :rules=" item.rules ? item.rules : [] "
                            >
                            <el-select v-model="Form[item.key]"   size="small"  :placeholder="item.placeholder" clearable >
                                <el-option :label="itm.label" :value="itm.value" v-for="(itm,k) in item.option"  :key="k"  v-if="item.option.length > 0"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <!-- 城市联动 -->
                        <el-form-item
                                label-position="left"  
                                :label="item.name" 
                                style="margin-right: 20px;" 
                                class="from_list" 
                                v-if=" item.type == 'city' " 
                            >
                            <v-distpicker 

                                    :hide-area=item.hide_area
                                    :only-province=item.only_province
                                    style="height:30px;"

                                    :province="Form[Object.keys(item.key)[0]].value ? Form[Object.keys(item.key)[0]].value : Form[Object.keys(item.key)[0]]"
                                    :city="Form[Object.keys(item.key)[1]].value ? Form[Object.keys(item.key)[1]].value : Form[Object.keys(item.key)[1]]"
                                    :area="Form[Object.keys(item.key)[2]].value? Form[Object.keys(item.key)[2]].value : Form[Object.keys(item.key)[2]]"
                                    
                                    @province="onChangeProvince(arguments[0],Object.keys(item.key)[0])" 
                                    @city="onChangeCity(arguments[0],Object.keys(item.key)[1])"
                                    @area="onChangeArea(arguments[0],Object.keys(item.key)[3])"

                                ></v-distpicker>
                        </el-form-item>

                        <!-- 时间 -->
                        <el-form-item 
                            label-position="left" 
                            :label="item.name" 
                            style="width:450px" 
                            class="from_list" 
                            size="small"
                            v-if=" item.type == 'time' " 
                            :prop=" item.rules ? item.key : '' "
                            :rules=" item.rules ? item.rules : [] "
                        >
                            <el-date-picker
                                v-model="Form[item.key]"
                                type="daterange"
                                clearable
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>

                    </div>
                    <!-- slot -->
                    <slot name="payment_type"></slot>

                    <div class="btns">
                        <el-button size="small" type="primary" @click="submitForm(item.type)" v-for="(item,key) in operation" :key=key v-if="item.active">{{item.name}}</el-button>
                    </div>
                </el-form> 
           
     </div>   
</template>
<script>
import {  mapActions, mapGetters } from "vuex";
import VDistpicker from 'v-distpicker';
export default {
    components: { VDistpicker },
    data() {
      return {
        // 表单参数
        Form: {},
      }
    },
    props:[
        'FormData',         // 模块参数     (必填)
        'type',             // 模块类型    （必填）
        'operation'         // 操作内容
        ],
    methods:{
        /**
         * joker
         * 提交
         * @param string type  操作类型 （search：查询，reset：重置）
         */
        submitForm(type){
            // 查询
            if( type=='search' ){
                this.Form.type = this.type;
                this.$emit('up_submit',this.Form);
            }
            //重置
            else if( type=='reset' ){
                //初始化
                this.initObject();  
            }
        },

        /**
         * 对象初始化
         */
        initObject(){
            this.Form = {};
            // console.log();
            for (var item of this.FormData) {
                // 是对象，合并
                if(item.key instanceof Object ){
                    this.Form = Object.assign(this.Form, item.key);
                }else{
                    this.Form[item.key] ='';
                }
            };
            this.Form = Object.assign({}, this.Form);
        },
        
        /**
         * joker
         * 地址 省
         * @param string index 表单属性
         * @param object item={
         *      number  code    代码参数（如：220000）, 
         *      string  value   值 （如：吉林省）
         * }
         */
        onChangeProvince(item,index){
            this.Form[index] = item;
        },

        /**
         * joker
         * 地址 市
         * @param string index 表单属性
         * @param object item={
         *      number  code    代码参数, 
         *      string  value   值
         * }
         */
        onChangeCity(item,index){
            this.Form[index] = item;
        },
        
        /**
         * joker
         * 地址 区
         * @param string index 表单属性
         * @param object item={
         *      number  code    代码参数, 
         *      string  value   值
         * }
         */
        onChangeArea(item,index){
            this.Form[index] = item;
        },

    },
    computed: {
            //获取参数
            ...mapGetters([
                'queryParamsInfo',
            ])
        },
    created() {
        /**
        *  joker
        *  整合表单,初始化
        *  ps：命名不能重复
        *  @param array FormData=[
        *    // 输入框类型
        *            {
        *                type:'text' ,                   // 类型
        *                name:'',                        // 标题
        *                rules:[]                        // 校验内容 （不必填）
        *                key:'',                         // 属性名
        *                placeholder:''                  // 占位符
        *            },
        *    // 下拉选择
        *            {
        *                type:'select',                  // 类型
        *                name:'',                        // 标题
        *                rules:[],                       // 校验内容 （不必填）
        *                key:'',                         // 属性名
        *                placeholder:'',                 // 占位符
        *                option:[                        // 下拉选项  
        *                        {label:'',value:''},
        *                        {label:'',value:''},
        *                    ]
        *            },
        *    // 地址
        *            {
        *                type:'city',                    // 类型          
        *                name:'',                        // 标题
        *                hide_area:true,                 // 是否隐藏地区
        *                only_province:false,            // 是否只显示省份
        *                key:{                           // 属性名（数据结构必须是一个对象）    
        *                    province: "",               // 省（属性名可自定义）      
        *                    city: "",                   // 市（属性名可自定义）
        *                    area: ""                    // 区（属性名可自定义）
        *                },
        *            },
        *    // 日期
        *            {
        *                type:'time',                    // 类型
        *                name:'',                        // 标题
        *                key:'',                         // 属性名
        *                placeholder:''                  // 占位符
        *            }
        *
        *      ]
        * 
        *  
        **/ 

        if( this.FormData instanceof Array && this.FormData.length > 0 ){   
            // 初始化
            this.initObject();
        };
        //存在值，则赋值
        if(this.queryParamsInfo[this.type]){
            this.Form = this.queryParamsInfo[this.type];
        };
        // console.log(this.FormData);
        // console.log(this.queryParamsInfo);
        
    }

    
}
</script>
<style lang="less" scoped>
    .search{
        background: #ffffff;
        margin: 0;
        border: 1px solid #e6e6e6;
        padding: 10px 25px;
        position: relative;
        overflow: hidden;
        border-top: 0 none;
        .from{
            .from_list{
                display: flex;
                float: left;
            }
        }
    }
    .btns{
        float: right;
    }
</style>
