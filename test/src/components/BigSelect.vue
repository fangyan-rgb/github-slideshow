<template>
    <div>
        <el-select
                v-if="Array.isArray(options)"
                ref="select"
                v-model="objs.value"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词进行筛选"
                name="mySelects"
                :multiple="multiple"
                :size="size"
                :remote-method="remoteMethod"
                :loading="loading"
                :disabled="isDisabled"
                @change="handleChange">
            <el-option
                    v-for="(item, index) in optionList"
                    v-if="handleIsAcitveOption(item)"
                    :key="index"
                    :value-key="item.value"
                    :value="item.value"
                    :label="item.label">
            </el-option>
        </el-select>
        <el-select
                v-else
                ref="select"
                v-model="objs.value"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词进行筛选"
                :multiple="multiple"
                :size="size"
                :remote-method="remoteMethod"
                :loading="loading"
                :disabled="isDisabled"
                @change="handleChange">
            <el-option
                    v-for="(value, label) in optionList"
                    :key="value"
                    :value-key="value"
                    :value="value"
                    :label="label">
            </el-option>
        </el-select>
    </div>
    <!--<el-select-->
            <!--clearable-->
            <!--filterable-->
            <!--:disabled="isDisabled"-->
            <!--:multiple="multiple"-->
            <!--:filter-method="remoteMethod"-->
            <!--:size="size"-->
            <!--:loading="loading"-->
            <!--@change="handleChange"-->
            <!--@blur="handleBlur"-->
            <!--placeholder="请输入关键字进行筛选"-->
            <!--v-model="objs.value">-->
        <!--<el-option-->
                <!--v-for="(item, index) in optionList"-->
                <!--:key="index"-->
                <!--:value="item.value"-->
                <!--:label="item.label">-->
        <!--</el-option>-->
    <!--</el-select>-->

</template>

<script>
    export default {
        name: "BigSelect",
        model: {
            prop: 'model',
            event: 'changes'
        },
        props: {
            model: '',
            multiple: {
                type: Boolean,
                default: false
            },
            options: {
                type: [Array, Object],
                default() {
                    return []
                }
            },
            size: {
                type: String,
                default: 'small'
            },
            isDisabled: {
                type: Boolean,
                default: false
            },
            update: false
        },
        data() {
            return {
                objs: {},
                optionList: [],
                times: '',
                checkVal: '',
                loading: false,
                maxLength: 100,
                filterVal: '',
                timeout: ''
            }
        },
        methods: {
            remoteMethod(query) {
                this.filterVal = query;
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        let opntion = this.options.filter(item => {
                            return item.label.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1 || this.model.indexOf(item.value) > -1;
                        })

                        if (opntion.length > this.maxLength) {
                            opntion.splice(this.maxLength, opntion.length - this.maxLength);
                        }
                        this.optionList.splice(0);
                        this.$nextTick().then(() => {
                            this.optionList.push(...opntion);
                        })
                        // this.optionList = opntion;
                    }, 200);
                } else {
                    this.optionList = [];
                }
            },
            handleChange(val) {
                if (this.multiple) {
                    this.$refs.select.query = ''
                }
                this.$emit('changes', val);
            },
            handleBlur() {
                setTimeout(() => {
                    clearInterval(this.timeout);
                    this.objs.value = this.checkVal;
                }, 100)
            },
            handleFocus() {
                if (Array.isArray(this.model)) {
                    const tempVal = JSON.parse(JSON.stringify(this.objs.value));
                    if (this.options.filter) {
                        this.optionList = this.options.filter(item => {
                            return this.model.indexOf(item.value) > -1;
                        });
                        this.objs.value.splice(0);
                        this.$nextTick().then(() => {
                            // this.objs.value = tempVal;
                            this.handleChange(tempVal);
                        })
                        this.$forceUpdate();
                    }
                } else {
                    this.objs.value = '';
                    if (this.options.filter) {
                        this.optionList = this.options.filter(item => {
                            if (this.model === item.value) {
                                this.$nextTick().then(() => {
                                    this.objs.value = this.model;
                                })
                            }
                            return this.model === item.value;
                        });
                        this.$forceUpdate();
                    }
                }
            },

            // 判断是否要激活option
            handleIsAcitveOption(item) {
                if (item) {
                    return item.label.toLowerCase().indexOf(this.filterVal.toLowerCase()) > -1
                }
            }
        },
        created() {
            this.$set(this.objs, 'value', this.model);
            this.handleFocus();
        },
        mounted() {
            // 获取监听
            this.$nextTick().then(() => {
                const selectEl  = this.$refs.select.$el.querySelector('.el-input__inner');
                if (selectEl) {
                    selectEl.oninput = (e) => {
                        let reg = /^[\u4e00-\u9fa5]+$/;
                        if (reg.test(e.data)) {
                            this.remoteMethod(e.data);
                        }
                    }
                }
            });
        },
        watch: {
            model(val) {
                this.objs.value = val;
            },
            update(val) {
                if (val) {
                    this.handleFocus();
                }
            }
        }
    }
</script>

<style scoped>

</style>