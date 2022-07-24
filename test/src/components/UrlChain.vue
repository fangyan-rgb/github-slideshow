<template>
        <!-- 标签路由 -->
        <div>
            
            <!-- 产品分类 面包屑 -->
            <div  v-if="childUrlChain">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item  v-for=" (item,index) in childUrlChain" :key="index" @click.native='select(index)'>{{item.sname}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <!-- 属性绑定 面包屑 -->
            <div v-if="attrUrl.type == 'bindUrl' && !childUrlChain ">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item  v-for=" (item,index) in attrUrl.url" :key="index" >{{item.class? item.class:item.name}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
    </template>
                           
    <script>
        import {  mapActions, mapGetters } from "vuex";
        export default {
            name: "HomeManage",
            props:[
                'childUrlChain', // 产品分类
                ], 
            data() {
                return {
                    
                }
            },
            
            mounted(){
                // console.log(this.attrUrl);
            },
            methods:{
                /**
                 * 获取点击事件的数据,响应父级组件
                 * @param obj data 
                 */
                select(index){
                    console.log(index);
                    //整理数据
                    this.$emit('up_list_lick',index); // select事件触发后，自动触发showCityName事件
                }
            },
            computed: {
                //获取参数
                ...mapGetters([
                    'attrUrl' // 绑定属性面包屑
                ])
            },
            
        }
    </script>
    
    <style scoped less>
    
    </style>