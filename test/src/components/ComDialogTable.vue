<template>
    <div class="ui-dialog-table">
        <el-dialog
                :width="width"
                :title="title"
                :visible.sync="isShow"
                @close="handleCloseDialog">
            <div class="ui-table-top" v-if="topInfo.length">
                <ul class="clearFix">
                    <li v-for="(item, index) in topInfo" :key="index">
                        <span>{{item.label}}</span>
                        <span>{{item.value}}</span>
                    </li>
                </ul>
            </div>
            <div class="ui-table-info">
                <el-table
                        stripe
                        border
                        :data="list.value"
                        :height="comTableHeight">
                    <el-table-column v-for="(item, index) in list.key"
                        :type="list.props[index] === 'index' ? 'index' : ''"
                        :width="list.props[index] === 'index' ? '80px' : ''"
                        :key="index"
                        :prop="list.props[index] === 'index' ? '' : list.props[index]"
                        :label="item">
                        <template slot-scope="scope">
                            <slot :name="list.props[index]" :row="scope.row">{{list.props[index] === 'index' ? autoAddTableInx(index) : scope.row[list.props[index]]}}</slot>
                        </template>
                        </el-table-column>
                </el-table>
            </div>
            <div class="ui-table-page" v-if="isPage">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageData.offset"
                        :page-sizes="pageSizes"
                        :page-size="pageData.limit"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageData.total">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { autoAddTableInx } from '../services'
    import config from '../assets/js/config'
    export default {
        name: "ComDialogTable",
        props: {
            list: {
                type: Object,
                default() {
                    return {
                        key: ['序号', '姓名', '性别'],
                        value: [],
                        props: []
                    }
                }
            },
            showDialog: {
                type: Boolean,
                default: false
            },
            width: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: '表格信息'
            },
            tableHeight: {
                default: '100px'
            },
            topInfo: {
                type: Array,
                default() {
                    return []
                }
            },
            pageData: {
                offset: 1,
                limit: 20,
                total: 0
            },
            isPage: {
                type: Boolean,
                default() {
                    return true
                }
            }
        },
        data() {
            return {
                pageSizes: config.pageData.pageSizes,
                isShow: false,
                comTableHeight: '100px'
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.comTableHeight = config.setTableHeight('ui-main-module')
            });
        },
        methods: {
            autoAddTableInx,
            handleSizeChange:function(size){
                this.$emit('tablePageToggle', {
                    limit: size,
                    offset: 1
                })
            },
            handleCurrentChange:function(idx){
                this.$emit('tablePageToggle', {
                    limit: this.pageData.limit,
                    offset: idx
                })
            },
            handleCloseDialog() {
                this.$emit('close', false);
            }
        },
        watch: {
            showDialog(val) {
                if (val) {
                    this.$nextTick(() => {
                        // this.checkData = this.checkedKeys;
                    })
                } else {
                    this.$nextTick(() => {
                        // this.roleName = '';
                        // this.$refs.tree.setCheckedKeys([])
                    })
                }
                this.isShow = val;
                this.$emit('changeState', val);
            }
        }
    }
</script>

<style scoped lang="less">
    @import (reference) '../assets/less/index';
    .ui-dialog-table {
        text-align: left;
        .ui-table-page {
            margin-top: 50px;
            text-align: center;
        }
        .ui-table-top {
            margin-top: -8px;
            margin-bottom: 8px;
            li {
                float: left;
                width: 200px;
                text-align: left;
                span {
                    text-align: left;
                    padding-left: 10px;
                    font-size: @base-txt-two;
                    color:@base-txtColor-tow;
                }
            }
        }
    }
</style>