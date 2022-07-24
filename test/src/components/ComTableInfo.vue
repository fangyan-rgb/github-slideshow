<template>
    <div :class="className" v-if="initTable">
        <slot></slot>
        <el-table
                :resizable="false"
                ref="myTable"
                :border="border"
                :data="tableData"
                :height="tableHeight"
                :span-method="spanMethod"
                :highlight-current-row='true'
                @selection-change="handleSelectionChange"
                @sort-change="handleSortChange"
                @row-click='handleRowClick'
                :row-class-name="tableRowClassName"
                v-loading="tableLoading">
            <el-table-column
                    fixed='left'
                    v-if="isCheck"
                    type="selection"
                    width="36"
                    :selectable="selectable">
            </el-table-column>
            <el-table-column
                    :sortable="tableSort[index]"
                    :fixed="tableProps[index] === 'operate' ? 'right' : false"
                    v-for="(item, index) in tableKey"
                    :type="tableProps[index] === 'index' ? 'index' : ''"
                    :key="index"
                    :label="item"
                    :prop="tableProps[index]"
                    :minWidth='minTableWidth[index]? minTableWidth[index]: ""'
                    :width="tableWidth[index] || ''">
                <template slot-scope="scope">
                    <slot :name="tableProps[index]" :row="scope.row" :$index="scope.$index">{{tableProps[index] === 'index' ? autoAddTableInx(scope.$index) : scope.row[tableProps[index]]}}</slot>
                </template>
            </el-table-column>
            <template slot="empty">
                <div>
                    <NotData v-show="!tableData.length"></NotData>
                </div>
            </template>
        </el-table>
    </div>
</template>

<script>
    /**
     * name: 表格渲染信息
     *
     * params:
     *      tableKey: 表头信息  ['姓名', '性别']
     *      tableData:  表格数据  [{name: '小白'， sex: '男'}]
     *      tableProps:  表格props  ['name', 'sex']
     *      showSearch:  收缩搜索栏时切换表格高度
     *      isCheck:  是否可勾选
     *      otherHeight:  自适应表格高度
     *      border: 是否有边框
     *      className: 自定义类名
     * */
    import { autoAddTableInx } from '../services'
    import config from '@/assets/js/config'
    export default {
        name: "ComTableInfo",
        props: {
            tableKey: {
                type: Array,
                default() {
                    return []
                }
            },
            tableSort: {
                type: Array,
                default() {
                    return [false]
                }
            },
            defaultSort: {
                type: Object,
                default() {
                    return {}
                }
            },
            tableData: {
                type: Array,
                default() {
                    return []
                }
            },
            tableProps: {
                type: Array,
                default() {
                    return []
                }
            },
            showSearch: {
                type: Boolean,
                default: true
            },
            tableWidth: {
                type: Array,
                default() {
                    return ['80']
                }
            },
            minTableWidth: {
                type: Array,
                default() {
                    return ['80']
                }
            },
            isCheck: {
                type: Boolean,
                default: false
            },
            otherHeight: {
                type: Array,
                default() {
                    return []
                }
            },
            selectable: {
                type: Function,
                default() {
                    return () => {};
                }
            },
            border: {
                type: Boolean,
                default: true
            },
            className: {
                type: String,
                default: 'ui-main-module-table'
            },
            spanMethod: {
                type: Function,
                default() {
                    return () => {};
                }
            },
            tableRowClassName: {
                type: Function,
                default() {
                    return '';
                }
            },
            isSetHeight: {
                type: Boolean,
                default: true
            },
            sortable: {
                type: Boolean,
                default: false
            },
            searchHeight:{
                type: Boolean,
                default: false
            },
            tableLoading: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                initTable: true,
                tableHeight: '100px'
            }
        },
        methods: {
            autoAddTableInx,
            // 勾选
            handleSelectionChange(val) {
                this.$emit('checked', val)
            },
            // 排序
            handleSortChange(column){
                this.$emit('handleSort', column);
            },
            handleResizeHeight() {
                document.querySelector('body').style.overflow = 'hidden';
                this.tableHeight = this.isSetHeight ? config.setTableHeight('s-main', this.otherHeight, null, this.extraView) : '';
            },
            handleRowClick(row, column, event) {
                if (row) {
                    this.$refs.myTable.toggleRowSelection(row);
                }
            },
        },
        mounted() {
            // 页面dom加载完设置表格高度
            this.$nextTick().then(() => {
                document.querySelector('body').style.overflow = 'hidden';
                this.tableHeight = this.isSetHeight ? config.setTableHeight('s-main', this.otherHeight, null, this.extraView) : '';
            });
        },
        // 页签激活设置表格高度
        activated () {
            const vm = this;
            vm.$nextTick().then(() => {
                vm.handleResizeHeight()
                window.onresize = function(){
                    if (vm.$refs['myTable']) {
                        vm.handleResizeHeight()
                    }
                }
            })
        },
        watch: {
            showSearch(n, o) {
                setTimeout(() => {
                    this.handleResizeHeight()
                }, 400)
            },
            // 搜索项加载完设置表格高度
            searchHeight(n) {
                setTimeout(() => {
                    this.handleResizeHeight()
                }, 400)
            }
        }
    }
</script>

<style scoped>

</style>