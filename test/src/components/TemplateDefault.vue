<template>
    <div class="ui-default_template" :style="{height: height}" :class="className">
        <slot></slot>
    </div>
</template>

<script>
    import CONFIG from '@/assets/js/config'
    export default {
        name: "TemplateDefault",
        props: {
            className: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                height: ''
            }
        },
        mounted() {
            this.height = CONFIG.setTableHeight('ui-default_template', null, true);
        }
    }
</script>

<style scoped>
    .ui-default_template {
        overflow: auto;
    }
</style>