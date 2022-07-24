<template>
        <el-select
                size="small"
                v-model="value"
                :multiple="multiple"
                :collapse-tags="multiple"
                filterable v-filter
                clearable
                reserve-keyword
                placeholder="请输入关键词"
                :filter-method="filterMethod"
                :loading="loading">
            <el-option
                v-for="item in optionsListShow"
                :label="item.label"
                :key="item.value"
                :value="item.value"></el-option>
        </el-select>
</template>

<script>
    export default {
        name:'optimizationSelect',
        props: {
            // prop:'',
            // label:'',
            // rule:'',
            msg: '',
            optionList: {
                type: [Array, Object],
                default() {
                   return []
                }
            },
            multiple: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                optionsListShow: [],
                value: [],
                list: [],
                loading: false
            }
        },
        mounted() {
            this.value = this.msg;
        },
        methods: {
            filterMethod(query) {
                if (query !== '') {
                        let number = 0;
                        this.optionsListShow = this.list.filter(item => {
                            if(number>=100){
                                return false;
                            }else{
                                if(item.label.indexOf(query)>-1){
                                    number++;
                                }
                                return item.label.indexOf(query)>-1;
                            }
                        });
                } else {
                    this.optionsListShow = [];
                }
            }
        },
        watch: {
            value(val) {
                this.$emit('changes', val);
            },
            optionList: {
                handler(val) {
                    if (val.length) {
                        this.list = this.optionList.map(item => {
                            return { value: item.value, label: item.label };
                        });
                    }else{
                        this.list = [];
                        for (const key in this.optionList) {
                            this.list.push({value: val[key], label: key});
                        }
                    }
                },
                deep: true
            }
        },
        created(){
            if (this.optionList.length) {
                this.list = this.optionList.map(item => {
                    return { value: item.value, label: item.label };
                });
                this.optionsListShow = this.list.slice(0,100);
            }
        }
    }
</script>

<style scoped>

</style>