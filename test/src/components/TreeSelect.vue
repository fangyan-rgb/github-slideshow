<template>
    <div>
        <el-dialog
                custom-class="ui-tree-dialog"
                :title="title"
                :visible.sync="isShow"
                width="400px"
                top="20vh"
                :fullscreen="true"
                @close="handleCloseDialog">
            <el-tree
                    show-checkbox
                    node-key="resource_id"
                    ref="tree"
                    highlight-current
                    :filter-node-method="autoFilterNode"
                    :props="props"
                    :data="list"
                    :default-checked-keys="checkedKeys"
                    :default-expand-all="false"
                    @check="checkTreeOption">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCancelSel">取 消</el-button>
                <el-button type="primary" @click="handleConfirmSel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TreeSelect",
        props: ['showTree', 'title', 'checkedKeys', 'list', 'props', 'rolename'],
        data() {
            return {
                filterText: '',
                isShow: false,
                data2: [
                    {
                        id: 1,
                        label: '销售出库',
                        children: [
                            {
                                id: 11,
                                label: '新增'
                            },
                            {
                                id: 12,
                                label: '删除'
                            },
                            {
                                id: 13,
                                label: '查看'
                            }
                        ]
                    },
                    {
                        id: 2,
                        label: '采购订单',
                        children: [
                            {
                                id: 21,
                                label: '删除'
                            },
                            {
                                id: 22,
                                label: '新增'
                            },
                            {
                                id: 23,
                                label: '查看'
                            }
                        ]
                    }
                ],
                checkData: [],
                roleModeName: ''
            }
        },
        computed: {
            // roleName: {
            //     get: function () {
            //         return this.rolename || ''
            //     },
            //     set: function (v) {
            //         this.roleModeName = v;
            //     }
            // }
        },
        methods: {
            autoFilterNode(val, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            handleCloseDialog() {
                this.isShow = false;
                this.$emit('cancel', false);
            },
            // 确认选择
            handleConfirmSel() {

                if (!this.checkData.length) {
                    this.$message({
                        type: 'error',
                        message: '必须至少选择一个资源'
                    })
                    return;
                }

                this.isShow = false;
                let obj = {
                    list: JSON.stringify(this.checkData),
                    roleName: this.roleModeName
                };
                this.$emit('confirm', obj);
                this.handleCancelSel();
            },
            // 取消选择
            handleCancelSel() {
                this.roleModeName = '';
                // this.roleName = '';
                this.isShow = false;
                this.$emit('cancel', false);
                this.$refs.tree.setCheckedKeys([]);
            },
            // 设置选择资源
            handleSetCheckedKeys() {
                this.$refs.tree.setCheckedKeys([12]);
            },
            // 保存勾选
            checkTreeOption(a, b, c) {
                // this.checkData = b.checkedKeys.concat(b.halfCheckedKeys);
                console.log(this.checkData);
                this.checkData = JSON.parse(JSON.stringify(b.checkedKeys));
            }
        },
        watch: {
            roleModeName(val) {
                console.log(val);
            },
            showTree(val) {
                if (val) {
                    this.$nextTick(() => {
                        this.roleModeName = this.rolename;
                        this.checkData = this.checkedKeys;
                        this.$refs.tree.setCheckedKeys(this.checkedKeys)
                    })
                } else {
                    this.$nextTick(() => {
                        // this.roleName = '';
                        this.$refs.tree.setCheckedKeys([])
                    })
                }
                this.isShow = val;
                this.$emit('changeState', val);
            },
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        }
    }
</script>

<style scoped>
    .dialog-footer {
        position: absolute;
        bottom: 70px;
        right: 35px;
    }
    .ui-edit-info {
        text-align: left;
    }
    .ui-edit-info::after {
        content: "";
        clear: both;
        display: block;
    }
    .ui-edit-info span {
        width: 120px;
        text-align: right;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 28px;
        padding: 0 40px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
    .ui-edit-input {
        width: 200px;
        float: left;
    }
    .ui-edit-first {
        margin-bottom: 20px;
    }
</style>