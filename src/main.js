import Vue from 'vue';
import VueGtag from 'vue-gtag';
import App from './App.vue';
import router from './router';
import store from './store';
// import i18n from '@/locale';
import '@/assets/icons';
import '@/utils/filters';
// import './registerServiceWorker';
import translate from 'i18n-jsautotranslate';
import { dailyTask } from '@/utils/common';
import VueMasonry from 'vue-masonry-css';
import '@/assets/css/global.scss';
import NProgress from 'nprogress';
import '@/assets/css/nprogress.css';

window.resetApp = () => {
  localStorage.clear();
  indexedDB.deleteDatabase('yesplaymusic');
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
  return '已重置应用，请刷新页面（按Ctrl/Command + R）';
};
console.log(
  '如出现问题，可尝试在本页输入 %cresetApp()%c 然后按回车重置应用。',
  'background: #eaeffd;color:#335eea;padding: 4px 6px;border-radius:3px;',
  'background:unset;color:unset;'
);

function initLang() {
  // 设置使用 v2.x 版本
  translate.setUseVersion2();
  // 是否显示语言切换栏
  translate.selectLanguageTag.show = false;
  //设置使用的翻译服务
  translate.service.use('client.edge');
  //对整个页面进行整体翻译
  translate.whole.enableAll();
  //本地语种也进行强制翻译
  // translate.language.translateLocal = true;

  // 监控页面动态渲染的文本进行自动翻译
  translate.listener.start();

  setTimeout(() => {
    if (localStorage.getItem('lang') == 'zh') {
      // 英文

      // translate.changeLanguage('english');
      translate.language.setLocal('english');
    } else {
      // 简体中文
      translate.language.setLocal('chinese_simplified');
      // translate.changeLanguage('chinese_simplified');
    }

    // 对当前 DOM 重新执行一次翻译，确保立即生效
    if (typeof translate.execute === 'function') {
      translate.execute();
    }
  }, 300);
}
Vue.use(VueMasonry);
Vue.use(
  VueGtag,
  {
    config: { id: 'G-KMJJCFZDKF' },
  },
  router
);
Vue.config.productionTip = false;

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });
dailyTask();
initLang();

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
