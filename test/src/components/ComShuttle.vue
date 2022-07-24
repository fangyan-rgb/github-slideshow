<template>
    <div class="ui-shuttle_container">
        <span>{{ label[0] }}</span>
        <span>{{ label[1] }}</span>
        <el-transfer
            class="ui-shuttle_transfer"
            filterable
            v-model="value"
            :data="data"
            :titles="title"
            :button-texts="buttonText"
            :format="{
                noChecked: '${total}',
                hasChecked: (isLeft||isRight)?isLeft?`${num}/${data.length-value.length}`:`${num}/${value.length}`:'${checked}/${total}'
            }"
            :filter-method="filterMethod"
            @left-check-change="leftCheckChange"
            @right-check-change="rightCheckChange"
            @change="handleChange">
        </el-transfer>
        <!-- `${num}/${data.length-value.length}` -->
        <!-- '${checked}/${total}' -->
    </div>
</template>

<script>
    var strQuery="";
    export default {
        name: "ComShuttle",
        props: {
            //绑定数据
            data: {
                type: Array,
                default() {
                    return []
                }
            },
            selectValue: {
                type: Array,
                default() {
                    return []
                }
            },
            //左边默认选中
            leftDefaultChecked: {
                type: Array,
                default() {
                    return []
                }
            },
            //右边默认选中
            rightDefaultChecked: {
                type: Array,
                default() {
                    return []
                }
            },
            //上方标题
            title: {
                type: Array,
                default() {
                    return ['全选', '清除全选']
                }
            },
            //穿梭按钮文案
            buttonText: {
                type: Array,
                default() {
                    return []
                }
            },
            label: {
                type: Array,
                default() {
                    return ['备选', '已选']
                }
            },
            
        },
        data() {
            let filterNumber = 0;
            let that=this;
            return {
                value: [],
                filterMethod(query, item) {
                    let boolQuery = item.label.toLowerCase().indexOf(query.toLowerCase())>-1;
                    if(query){
                        strQuery=query;
                        return boolQuery;
                    }else{
                        if(strQuery!==query||filterNumber>this.data.length-1){
                            filterNumber=0;
                        }
                        strQuery=query;
                        if(boolQuery)filterNumber++;
                        if(filterNumber>100){
                            return false;
                        }else{
                            return boolQuery;
                        }
                    }
                },
                num:0,
                isLeft:false,
                isRight:false,
            }
        },
        methods: {
            handleChange(value, direction, movedKeys) {
                if(this.num>=100&&!strQuery){
                    if(this.isLeft){
                        value = this.data.map(item=>{return item.key});
                        this.value = this.data.map(item=>{return item.key});
                    }else{
                        value=[];
                        this.value = [];
                    }
                }else{
                    this.value = value;
                }
                this.$emit('handleChange', this.value);
            },
            leftCheckChange(a){
                let option=[];
                if(a.length>=100&&!strQuery){
                    this.isLeft=true;
                    this.isRight=false;
                    option= this.data;
                    this.num=option.length-this.value.length;
                }else{
                    this.isLeft=false;
                    this.isRight=false;
                    this.num=a.length;
                }
            },
            rightCheckChange(a){
                if(a.length>=100&&!strQuery){
                    this.isLeft=false;
                    this.isRight=true;
                    this.num=this.value.length;
                }else{
                    this.isLeft=false;
                    this.isRight=false;
                    this.num=a.length;
                }
            },
        },
        watch: {
            selectValue(val){
                this.value = val;
            }
        },
        created(){
            this.value = this.selectValue;
        }
    }
</script>

<style lang="less">
    //穿梭组件
    .ui-shuttle_container {
        position: relative;
        & > span {
            position: absolute;
            z-index: 10;
            font-size: 12px;
            font-weight: bold;
            color: #333333;
        }
        & > span:nth-of-type(1) {
            left: 165px;
            top: 12px
        }
        & > span:nth-of-type(2) {
            left: 615px;
            top: 12px
        }
        .ui-shuttle_transfer {
            text-align: left;
            display: inline-block;
            margin-left: 40px;
            margin-bottom: 10px;
        }
        .el-transfer-panel {
            width: 300px;
            .el-transfer-panel__item {
                display: inline-block;
                .el-checkbox__label {
                    font-size: 12px;
                }
            }
            .el-transfer-panel__header {
                background: none;
                padding-left: 12px;
            }
            .el-transfer-panel__header .el-checkbox .el-checkbox__label {
                font-size: 14px;
            }
            .el-transfer-panel__filter {
                margin: 8px;
            }
        }
        .el-transfer__buttons {
            padding: 0 55px !important;
            margin-top: 40px;
            .el-transfer__button.is-disabled {
                background-color: #fafafa;
                border: 1px #fafafa solid;
            }
        }
    }
</style>
