<template>
    <div class="ui-loading"></div>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'Loading',
        data () {
            return {
                loadingData: {}
            };
        },
        props: [ 'loading' ],
        computed: {
            ...mapGetters(['showLoading']),
            Loading: function () {
                return this.loading;
            }
        },
        watch: {
            showLoading(val) {
                if (val) {
                    this.loadingData = this.$loading({
                        lock: true,
                        text: '',
                        spinner: '',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                } else {
                    this.loadingData.close && this.loadingData.close();
                }
            }
        }
    };
</script>

<style scoped>
    .ui-loading {
        background: #333333;
        opacity: 0.3;
    }
</style>
