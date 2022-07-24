<template>
    <div class="ui-main-module-table">
        <el-table
                border
                :data="logData"
                :height="isAdaptiveHeight?logData.length?null:250:tableHeight">
            <el-table-column
                    v-for="(item, index) in logKey"
                    :type="logProps[index] === 'index' ? 'index' : ''"
                    :key="index"
                    :label="item"
                    :prop="logProps[index]"
                    :width="logWidth[index] || ''">
                <template slot-scope="scope">
                    <slot :name="logProps[index]" :row="scope.row" :$index="scope.$index">{{logProps[index] === 'index' ? autoAddTableInx(scope.$index) : scope.row[logProps[index]]}}</slot>
                </template>
            </el-table-column>
            <template slot="empty">
                <div>
                    <NotData v-show="!logData.length"></NotData>
                </div>
            </template>
        </el-table>
    </div>
</template>

<script>
    import config from '@/assets/js/config'
    import { autoAddTableInx } from '../services';
    export default {
        name: "ComPreviewTable",
        props: {
            logData: {
                type: Array,
                default() {
                    return []
                }
            },
            logKey: {
                type: Array,
                default() {
                    return ['时间','操作人','操作内容','备注']
                }
            },
            logProps: {
                type: Array,
                default() {
                    return ['approval_time','user_name','status','remarks']
                }
            },
            logWidth: {
                type: Array,
                default() {
                    return ['160','120','120','']
                }
            },
            isAdaptiveHeight: {
                type: Boolean,
                default() {
                    return false
                }
            }
        },
        data() {
            return {
                tableHeight: '500px'
            }
        },
        methods: {
            autoAddTableInx,
        },
        mounted() {
            this.$nextTick(() => {
                // this.tableHeight = config.setTableHeight('ui-main-module');
            })
        },
    }
</script>

<style scoped>

</style>