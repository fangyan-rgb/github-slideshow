<template>
    <el-dialog
            :width="width"
            :title="title"
            :visible.sync="isShowDialog"
            @close="handleClose">
        <div class="ui-search_area">
            <el-input v-model="keyCode" placeholder="请输入关键字进行筛选"></el-input>
        </div>
        <div class="ui-select_area">
            <el-tree
                    ref="tree"
                    node-key="id"
                    :show-checkbox="isChecks"
                    :check-on-click-node="!isChecks"
                    :data="data"
                    :props="props"
                    :check-strictly="true"
                    :expand-on-click-node="false"
                    :default-expand-all="false"
                    :default-expanded-keys="checked"
                    :filter-node-method="autoFilterNode"
                    @check="handleCheckChange">
                <div slot-scope="{ node, data }" class="clearFix custom-tree-node">
                    <span><ComIcon :name="data.resource_type === '1' ? 'menu-group' : 'button-group'"></ComIcon>&nbsp;{{ node.label }}</span>
                </div>
            </el-tree>
        </div>
        <div slot="footer" class="ui-dialog-footer">
            <el-button @click="handleClose" size="small">取 消</el-button>
            <el-button @click="handleSave" type="primary" size="small">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "ComDialogTree",
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: '树形结构筛选'
            },
            width: {
                type: String,
                default: ''
            },
            data: {
                type: Array,
                default() {
                    return []
                }
            },
            checked: {
                type: Array,
                default() {
                    return []
                }
            },
            isChecks: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                dataList: [],
                props: [],
                keyCode: '',
                isShowDialog: false,
                saveCheckInfo: {
                    id: [],
                    label: ''
                }
            }
        },
        methods: {
            handleCheckChange(val, data) {
                if (this.isChecks) {
                    this.saveCheckInfo.id = data.checkedKeys;
                    let arr = [];
                    for (let i = 0; i < data.checkedNodes.length; i++) {
                        arr.push(data.checkedNodes[i].label.replace(/\([\d]+\)/, ''));
                    }
                    this.saveCheckInfo.label = arr.join(',');
                } else {
                    this.saveCheckInfo.id = [val.id];
                    this.saveCheckInfo.label = val.label.replace(/\([\d]+\)/, '');
                }
            },

            autoFilterNode(val, data) {
                if (!val) return true;
                return data.label.indexOf(val) !== -1;
            },

            // 关闭
            handleClose() {
                this.$emit('close');
            },

            // 保存
            handleSave() {
                this.$emit('confirm', Object.assign({}, this.saveCheckInfo));
            },

            handleActiveCheckBox(val) {
                this.saveCheckInfo.id = Array.from(this.checked);
                this.$nextTick(() => {
                    this.$refs.tree.setCheckedKeys(this.checked, true)
                })
            }
        },
        watch: {
            keyCode(val) {
                this.$refs.tree.filter(val);
            },
            isShow(val) {
                this.isShowDialog = val;
                if (val) {
                    this.handleActiveCheckBox();
                } else {
                    this.$refs.tree.setCheckedKeys([], true)
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .ui-dialog-footer {
        text-align: center;

        button {
            margin: 0 30px;
        }
    }

    .ui-search_area {
        margin-bottom: 20px;
    }

    .ui-select_area {
        max-height: 350px;
        overflow: auto;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>