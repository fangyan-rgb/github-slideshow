
<template>
    <div class="ui-agreement clearFix">
        <ul>
            <li v-for="(item, index) in saveData" class="clearFix">
                <div class="ui-btn_area clearFix">
                    <span>合同{{textShow[index]}}：</span>
                    <span v-if="index === saveData.length - 1" @click="handleAddOperation"><ComIcon name="icon_add"></ComIcon> 添加合同</span>
                    <span v-if="index === saveData.length - 1 && !(saveData.length < 2) && item[2] !== 'isSave'" @click="handleDelOperation"><ComIcon name="icon_del"></ComIcon>删除合同</span>
                </div>
                <div class="ui-inp_area clearFix">
                    <span>开始时间</span>
                    <el-date-picker
                            v-model="item[0]"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"
                            :disabled="item[4] === 'isSave'">
                    </el-date-picker>
                </div>
                <div class="ui-inp_area clearFix">
                    <span>结束时间</span>
                    <el-date-picker
                            v-model="item[1]"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"
                            :disabled="item[4] === 'isSave'">
                    </el-date-picker>
                </div>
                <div class="ui-inp_area clearFix">
                    <span>合同编号</span>
                    <el-input v-model="item[2]" :disabled="item[4] === 'isSave'"></el-input>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex'
    import {
        getDefaultTime,
        getAppointDate
    } from '../services'
    export default {
        name: "ComEditAgreement",
        // props: ['tableKey', 'props', 'itemLength', 'dataList', 'type'],
        props: {
            dataList: {
                type: Array,
                default() {
                    return []
                }
            },
            inTableData: {
                type: Array,
                default() {
                    return []
                }
            },
            isAdd: {
                type: Boolean,
                default: false
            },
            isRefresh: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: ''
            },
            staffState: ''
        },
        data() {
            return {
                saveData: [],
                textShow: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七']
            }
        },
        computed: {
            ...mapGetters([
                'isAddOrModify',
                // 'staffState'
            ])
        },
        methods: {
            getDefaultTime,
            getAppointDate,

            // 刷新
            handleRefreshTableData(data) {

                if (this.staffState === 'EDITING') {
                    if (this.inTableData.length) {
                        this.saveData.splice(0);
                        this.saveData = this.inTableData;
                    } else {
                        if (this.isAddOrModify === 'MODIFY') {
                            if (this.dataList.length || (data && data.length)) {
                                this.saveData.splice(0);
                                this.saveData = this.dataList.length ? this.dataList : data;
                            } else {
                                this.saveData.splice(0);
                                this.saveData = [new Array(4)];
                            }
                        } else if (this.isAddOrModify === 'ADD') {
                            this.saveData.splice(0);
                            this.getDefaultTime().then((res) => {
                                this.saveData = [[res.end, this.getAppointDate(res.end, 36)]];
                            });
                        }
                    }
                } else {
                    if (this.dataList.length) {
                        this.saveData.splice(0);
                        this.saveData = this.dataList;
                    } else {
                        this.saveData.splice(0);
                        this.saveData = [new Array(4)];
                    }
                }
            },

            // 新增操作
            handleAddOperation() {
                this.saveData.push(new Array(4));
            },

            // 删除操作
            handleDelOperation() {
                this.saveData.pop();
            }
        },
        created() {
            this.handleRefreshTableData();
        },
        watch: {
            saveData: {
                handler(val) {
                    this.$emit('backData', val)
                },
                deep: true
            },
            isRefresh(val) {
                if (!val) {
                    this.tableData = [];
                } else {
                    this.handleRefreshTableData();
                }
            },
            inTableData() {
                this.handleRefreshTableData();
            }
        }
    }
</script>

<style scoped lang="less">
    .ui-agreement {
        .ui-btn_area {
            text-align: left;
            span {
                width: 104px;
                text-align: right;
                float: left;
                font-size: 14px;
                color: #606266;
                line-height: 40px;
                padding: 0 12px 0 0;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                cursor: pointer;
            }
        }
        .ui-inp_area {
            float: left;

            &:nth-child(2n) {
                margin-right: 160px;
                margin-bottom: 15px;
            }

            .el-input {
                width: 200px;
            }

            span {
                width: 100px;
                text-align: right;
                float: left;
                font-size: 14px;
                color: #606266;
                line-height: 32px;
                padding: 0 12px 0 0;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
            }
        }
    }
</style>