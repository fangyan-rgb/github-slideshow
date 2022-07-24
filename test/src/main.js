// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import component from './components';
import store from './store';
import * as Storage from './utils/storage';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/index.css';
import '@/assets/fonts/iconfont.css';
import '@/assets/less/index.less';
import '@/assets/css/common.css';
import 'viewerjs/dist/viewer.min.css';
import promise from 'es6-promise'
import VDistpicker from 'v-distpicker'
import CONFIG from '@/assets/js/config';
import VueLazyload from 'vue-lazyload';  // 图片懒加载
import directive from './directive';

// 图片懒加载
Vue.use(VueLazyload, {
    error: require('./assets/image/default_error.png'),
    loading: require('./assets/image/img_loading.gif'),
});

Vue.component('v-distpicker', VDistpicker);
Vue.component('v-distpicker', VDistpicker)
// axios 请求兼容
promise.polyfill();

Vue.config.productionTip = false;
Vue.use(ElementUI);

/* 注册全局组件 */
Object.keys(component).forEach(key => {
    let name = key.replace(/(\w)/, (v) => v.toUpperCase()); // 首字母大写
    Vue.component(`${name}`, component[key]);
});

/* 注册全局指令 */
Object.keys(directive).forEach(key => {
    Vue.directive(`${key}`, directive[key]);
});

window.getEleAttr = function (_e, parent) {
    return parent ? parent.querySelector(_e) : document.querySelector(_e);
};

// 清除浏览器缓存，开发时可以注释
window.addEventListener("unload", function(event) {
    Storage.clearSessionStorage();
});

HTMLElement.prototype.pressKey = function(code) {
    var evt = document.createEvent("UIEvents");
    evt.keyCode = code;
    evt.initEvent("keyup", true, true);
    this.dispatchEvent(evt);
}
// // 加载公共样式文件
// let httpPath = process.env.NODE_ENV == 'production' ? CONFIG.IN_PRODUCTION_PATH : 'http://192.168.71.128/';
// const cssEle = document.createElement('link');
// cssEle.rel = 'stylesheet';
// cssEle.href = `${httpPath}front/src/assets/css/common.css?v=${Math.random() * 1000}`;
// document.querySelector('head').appendChild(cssEle);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,  
    components: {App},
    template: '<App/>'
});



