/**
 *  作者：joker
 *  功能：表格组件入口文件
 *  创建时间：2018/12/7
 *  组件说明：
 *  注意事项：
 *  使用方法：
 */

// 引用组件
import commponent from '@/table/table_1/commponent';
import ComTableInfo from '@/table/table_1/ComTableInfo';

// 是否从入口文件中，加载组件， false : 未加载  true：加载
let roter_active = false;
// 组件文件名称


const config={
    /**
     * joker
     * 根据参数，进行组件的配置
     * @param {*} type  加载路由的类型
     */
    module(type){
        if(type==1){
            return ComTableInfo;
        }else{
            return commponent;
        }
    }, 
}

export default config;
