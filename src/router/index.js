import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = getPageList();

const router = new VueRouter({
    base : getBasePath(),
    mode: 'history',
    routes
});

/**
 * router가 실행되기 이전에 실행되는 함수.
 * to : 이동하고자 하는 router 정보
 * from : 이동하기전 router 정보
 * next : 이동될 때 실행되는 함수.
 */
router.beforeEach(function (to, from, next) {
    if(!(store.getters['user/hasToken'] && to.path === store.getters['page/menuList'].login.path)){
        next();
    }
});

/**
 * router 이동 후 동작 함수.
 * to : 이동하고자 하는 경로의 정보
 * from : 이동하려고 하는 경로의 정보
 */
router.afterEach(function (to, from) {
    store.dispatch('page/setTitle', to.meta.title);
});

/**
 * store/modules/page.js의 state.list 목록을 반환.
 * @returns 
 */
function getPageList() {
    const pageList = new Array();
    Object.entries(store.getters['page/menuList']).forEach(([key, item])=>{
        pageList.push(item);
    });
    return pageList;
}

/**
 * store/modules/page.js의 state.base 반환.
 * @returns 
 */
function getBasePath() {
    return store.getters['page/basePath'];
}

export default router