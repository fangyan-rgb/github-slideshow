<template>
    <div class="ui-tree-menu">
        <div class="ui-system-info">
            <span>易佰集团</span>
        </div>
        <el-tree
                highlight-current
                ref="tree"
                node-key="resource_id"
                :check-strictly="true"
                :filter-node-method="autoFilterNode"
                :data="dataList"
                :props="treeProps"
                :default-expand-all="false"
                :expand-on-click-node="true">
            <div slot-scope="{ node, data }" class="ui-resource-btn clearFix">
                <span><ComIcon :name="data.resource_type === '1' ? 'menu-group' : 'button-group'"></ComIcon>&nbsp;{{ node.label }}</span>
            </div>
        </el-tree>
    </div>
</template>

<script>
    export default {
        name: "Sidebar",
        data() {
            return {
                dataList: [
                    {
                        label: '深圳易佰',
                        children: [
                            {
                                label: '业务开发部',
                                children: [
                                    {
                                        label: '采购部'
                                    },
                                    {
                                        label: '物流部'
                                    }
                                ]
                            },
                            {
                                label: '海外销售部'
                            },
                            {
                                label: '人力资源部'
                            },
                            {
                                label: '行政管理部'
                            }
                        ]
                    }
                ],
                treeProps: []
            }
        },
        methods: {
            autoFilterNode(val, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
        }
    }
</script>

<style scoped lang="less">

    @import (reference) '../../assets/less/index';

    .ui-tree-menu {
        background: #ffffff;
        height: 100%;

        .ui-system-info {
            line-height: 55px;
            font-size: 24px;
        }
    }
</style>