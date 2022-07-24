<template>
    <div :class="'ui-table_' + type">
        <div :class="isAdd ? 'ui-table_add' : ''">
            <el-table
                    :data="tableData"
                    border>
                <el-table-column :label="itme" v-for="(itme, inx) in tableKey" :key="inx">
                    <template slot-scope="scope">
                        <div>
                            <input type="text" class="el-input__inner" v-model="tableData[scope.$index][inx]" v-if="!types[inx] || /^(input|\s)/.exec(types[inx])" @blur="types[inx].indexOf('@blur') > -1 ? handleBackData() : function(){}" @input="types[inx].indexOf('@change') > -1 ? handleBackData() : function(){}">
                            <!--<el-input ></el-input>-->
                            <el-input v-model="tableData[scope.$index][inx]" v-if="types[inx] === 'srinput'" readonly>
                                <template slot="append"><span @click="handleClickSearch(scope.$index, inx)" class="el-icon-search" style="cursor: pointer"></span></template>
                            </el-input>
                            <el-select v-model="tableData[scope.$index][inx]" v-if="types[inx] === 'select'" filterable v-filter>
                                <el-option
                                        v-for="(value, key, index) in optionList[inx]"
                                        :key="index"
                                        :value="assignType[inx] === 'obj'? value.value: key"
                                        :label="assignType[inx] === 'obj'? value.label: value"></el-option>
                            </el-select>
                            <el-select v-model="tableData[scope.$index][inx]" v-if="types[inx] === 'selects'"  multiple collapse-tags filterable v-filter>
                                <el-option
                                        v-for="(value, key) in optionList[inx]"
                                        :key="key"
                                        :value="key"
                                        :label="value"></el-option>
                            </el-select>
                            <el-date-picker
                                    v-if="types[inx] === 'daterange'"
                                    size="medium"
                                    v-model="tableData[scope.$index][inx]"
                                    type="daterange"
                                    :editable="false"
                                    :clearable="false"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <el-date-picker
                                    v-if="types[inx] === 'date'"
                                    v-model="tableData[scope.$index][inx]"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <el-time-picker
                                    v-if="types[inx] === 'time'"
                                    v-model="tableData[scope.$index][inx]"
                                    type="time"
                                    format="HH:mm:ss"
                                    value-format="HH:mm:ss">
                            </el-time-picker>
                            <!--<el-input v-model="tableData[scope.$index][inx]" v-if="tableData[scope.$index][inx] === 'input'"></el-input>-->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div :class="'ui-operation_btn-' + type" v-if="isAdd">
                <span @click="handleDelList" v-if="tableData.length > 1"><ComIcon name="icon_del"></ComIcon></span>
                <span @click="handleAddList" v-if="tableData.length < maxLength || !maxLength"><ComIcon name="icon_add"></ComIcon></span>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * tableKey   表头        ['名称', '性别'];
     * props      额外配置    ['name', 'sex', 'id']
     * itemLength 默认行数    1
     * dataList   渲染数据    [{name: '小白', sex: '男'}}]
     * type       类型        table:表格类型   form:表单类型
     * types      输入类型    ['select', 'date', 'daterange', '']
     * optionList 下拉列表    [{value: 1, label: '人类'}]
     * isAdd      是否有新增  false
     * isRefresh  刷新表格    false
     * */
    import {
        mapGetters
    } from 'vuex'
    export default {
        name: "TableEdit",
        // props: ['tableKey', 'props', 'itemLength', 'dataList', 'type'],
        props: {
            tableKey: {
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
            props: {
                type: Array,
                default() {
                    return []
                }
            },
            itemLength: {
                type: Number,
                default: 1
            },
            dataList: {
                type: Array,
                default() {
                    return []
                }
            },
            type: {
                type: String,
                default: 'table'
            },
            types: {
                type: Array,
                default() {
                    return []
                }
            },
            optionList: {
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
            maxLength: {
                type: Number,
                default: 0
            },
            assignType: {
                type: Array,
                default() {
                    return []
                }
            },
        },
        data() {
            return {
                tableData: [],
                tableDataTree: []
            }
        },
        computed: {
            ...mapGetters(['isAddOrModify'])
        },
        methods: {
            handleAddList() {
                this.tableData.push(new Array(this.tableKey.length));
                this.tableDataTree.push(new Array(this.tableKey.length));
            },
            handleDelList() {
                this.tableData.pop();
                this.tableDataTree.pop();
                this.handleBackData();
            },

            //刷新组件 type :: staff 员工编辑框
            handleRefreshTableData(changeData, type = 'staff') {

                // 员工编辑状态
                if (this.staffState === 'EDITING' && type === 'staff') {
                    this.tableData.splice(0);
                    // 编辑中 （初始化加载数据）
                    if (changeData && changeData.length) {
                        this.tableData = Array.from(changeData);
                    } else {
                        let arr = [];
                        if (this.isAddOrModify === 'MODIFY') {
                            if (!this.dataList || !this.dataList.length) {
                                for (let i = 0; i < this.itemLength; i++) {
                                    let boxArr = new Array(this.tableKey.length);
                                    arr.push(boxArr);
                                }
                            } else if(this.itemLength > 1) {
                                for (let i = 0; i < this.itemLength; i++) {
                                    let valArr = [];
                                    for (let j = 0; j < this.props.length; j++) {
                                        if (!this.dataList[i]) break;
                                        if (this.types[j] === 'daterange') {
                                            let [tempArr, prop] = [[], this.props[j].split(',')];
                                            tempArr.push(this.dataList[i][prop[0]], this.dataList[i][prop[1]]);
                                            valArr.push(tempArr);
                                        } else {
                                            valArr.push(this.dataList[i][this.props[j]]);
                                        }
                                    }
                                    arr.push(valArr);
                                }
                            } else {
                                for (let i = 0; i < this.dataList.length; i++) {
                                    let valArr = [];
                                    for (let j = 0; j < this.props.length; j++) {
                                        if (!this.dataList[i]) break;
                                        if (this.types[j] === 'daterange') {
                                            let [tempArr, prop] = [[], this.props[j].split(',')];
                                            tempArr.push(this.dataList[i][prop[0]], this.dataList[i][prop[1]]);
                                            valArr.push(tempArr);
                                        } else {
                                            valArr.push(this.dataList[i][this.props[j]]);
                                        }
                                    }
                                    arr.push(valArr);
                                }
                            }
                        } else if (this.isAddOrModify === 'ADD') {
                            for (let i = 0; i < this.itemLength; i++) {
                                let boxArr = new Array(this.tableKey.length);
                                arr.push(boxArr);
                            }
                        }

                        this.tableData = arr;
                    }
                } else if (type === 'com'){
                    console.log(changeData);
                    let arr = [];
                    if (changeData && changeData.length) {
                        let length = this.itemLength >= changeData.length ? this.itemLength: changeData.length;
                        for (let i = 0; i < length; i++) {
                            let valArr = [];
                            for (let j = 0; j < this.props.length; j++) {
                                if (changeData[i]) {
                                    valArr.push(changeData[i][this.props[j]]);
                                } else {
                                    valArr.push('');
                                }
                            }
                            arr.push(valArr);
                        }
                    } else {
                        for (let i = 0; i < this.itemLength; i++) {
                            let boxArr = new Array(this.tableKey.length);
                            arr.push(boxArr);
                        }
                    }

                    this.tableData = arr;
                } else  {
                    let arr = [];
                    if (changeData && changeData.length) {
                        if (!this.tableData.length) {
                            this.tableData = Array.from(changeData);
                        } else {
                            for (let i = 0; i < changeData.length; i++) {
                                if (!changeData[i] || !changeData[i].length) continue;
                                for (let j = 0; j < changeData[i].length; j++) {
                                    if (changeData[i][j]) {
                                        this.tableData[i].splice(j, 1, changeData[i][j]);
                                    }
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < this.itemLength; i++) {
                            if (!this.dataList || !this.dataList.length) {
                                let boxArr = new Array(this.tableKey.length);
                                arr.push(boxArr);
                            } else {
                                let valArr = [];
                                for (let j = 0; j < this.props.length; j++) {
                                    if (!this.dataList[i]) break;
                                    valArr.push(this.dataList[i][this.props[j]]);
                                }
                                arr.push(valArr);
                            }
                        }
                        this.tableData = arr;
                    }
                }
            },

            // 输入框点击搜索
            handleClickSearch(finx, cinx) {
                this.$emit('srinput', {
                    finx,
                    cinx
                })
            },

            // 回调数据
            handleBackData() {
                this.$emit('tableEvent', this.tableData)
            }
        },
        created() {
            this.handleRefreshTableData();
        },
        watch: {
            tableData: {
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
            dataList() {
                this.handleRefreshTableData();
            }
        }
    }
</script>

<style scoped lang="less">
    .ui-table_add {
        margin-right: 50px;
    }
    .ui-operation_btn-table {
        position: absolute;
        /* bottom: 30px; */
        right: 0;
        margin-top: -28px;
        width: 60px;
        span {
            float: left;
            cursor: pointer;
        }
    }

    .ui-operation_btn-form {
        position: absolute;
        /*bottom: 52px;*/
        right: -6px;
        width: 60px;
        margin-top: -38px;
        span {
            float: left;
            cursor: pointer;
        }
    }
</style>