<style lang="less" scoped>

</style>

<template>
    <span class="ProdInfoPopupwrap">
        <el-popover
            placement="right"
            width="570"
            trigger="hover"
            :disabled="!list.length">
            <table class="commontablestyle" cellspacing="0" cellpadding="0">
                <tr>
                    <td width="100">Item ID</td>
                    <td width="80">SKU</td>
                    <td>商品名称</td>
                    <td width="30">数量</td>
                    <td width="60">产品线</td>
                </tr>
                <tr v-for="v in list">
                    <td><a target="_blank" style="color: #3388ff;" :href="'https://www.ebay.com/itm/' + v.item_id">{{v.item_id}}</a></td>
                    <td>
                        <a v-if="v.sku_url" target="_blank" style="color: #3388ff;" :href="v.sku_url">{{v.sku}}</a>
                        <span v-else>{{v.sku}}</span>
                    </td>
                    <td>{{v.title}}</td>
                    <td>{{v.quantity}}</td>
                    <td>{{v.linelist_cn_name}}</td>
                </tr>
            </table>
            <a style="color: #3388ff;" href="javascript:;" slot="reference">
                <slot></slot>
            </a>
        </el-popover>
    </span>
</template>

<script>
export default {
    name: 'ProdInfoPopup',
    data () {
        return {

        }
    },
    props: {
        list: {
            type: Array,
            default() {
                return []
            }
        }
    }
}
</script>
