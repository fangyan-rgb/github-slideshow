<style lang="less" scoped>
    .ui-input-number {
        display: flex;
        .el-input-number--small {
            width: 100%!important;
            /deep/.el-input__inner {
                padding: 0 15px!important;
            }
            /deep/.el-input-number__increase, /deep/.el-input-number__decrease {
                display: none!important;
            }
        }
    }
</style>
<template>
    <div class='ui-input-number'>
        <el-input-number   
            v-model="num1" 
            controls-position="right"
            :min='0'
            @change="handleChange"
            size="small" :precision = 'precision' ></el-input-number>&nbsp-&nbsp
        <el-input-number   
            v-model="num2" 
            controls-position="right"
            :min='0'
            @change="handleChange" 
            size="small" :precision = 'precision' ></el-input-number>
    </div>
</template>
<script>
    export default {
        name: "InputRangeNumber",
        props: {
            value: Array,
            precision: Number
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        methods: {
            handleChange(val) {
                this.$emit('change', [this.num1, this.num2]);
            },
            handleSetData() {
                this.num1 = this.value === null || this.value === undefined ? undefined : this.value.length? this.value[0]: undefined;
                this.num2 = this.value === null || this.value === undefined ? undefined : this.value.length? this.value[1]: undefined;
                if(this.value && this.value.length > 1 && this.value[1] < this.value[0]) {
                    this.num1 = undefined
                    this.$message.error('最大值不能小于最小值')
                }
            }
        },
        data () {
            return {
                num1: this.value === null || this.value === undefined ? undefined : this.value.length? this.value[0]: undefined,
                num2: this.value === null || this.value === undefined ? undefined : this.value.length? this.value[1]: undefined
                
            }
        },
        watch: {
            value: {
                handler(val) {
                    this.handleSetData()
                }
            },
            deep: true
        }
    }
</script>