<template>
    <el-select
            size="small"
            v-model="value"
            :multiple="multiple"
            :collapse-tags="multiple"
            filterable v-filter
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
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
        model: {
            prop: 'msg',
            event: 'changes'
        },
        props: {
            msg: '',
            optionList: {
                type: (Array || Object),
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
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        this.optionsListShow = this.list.filter(item => {
                            return item.label.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
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
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

</style>