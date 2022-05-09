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

router.beforeEach(function (to, from, next) {
    if(store.getters['user/hasToken'] || to.path === store.getters['page/menuList'].login.path){
        next();
    }
});

router.afterEach(function (to, from) {
    store.dispatch('page/setTitle', to.meta.title);
});


function getPageList() {
    const pageList = new Array();
    Object.entries(store.getters['page/menuList']).forEach(([key, item])=>{
        pageList.push(item);
    });
    return pageList;
}

function getBasePath() {
    return store.getters['page/basePath'];
}

export default router