<template>
    <v-app id="app">
        
        <NavView></NavView>
        
        <HeaderView></HeaderView>

        <MainView></MainView>

        <FooterView></FooterView>
        
    </v-app>
</template>

<script>
import NavView from "./views/layout/NavView.vue";
import HeaderView from "./views/layout/HeaderView.vue";
import FooterView from "./views/layout/FooterView.vue";
import MainView from "./views/layout/MainView.vue";
import { mapGetters, mapActions } from "vuex";

export default {
    name: "App",

    data: () => ({}),

    components: {
        NavView,
        HeaderView,
        MainView,
        FooterView,
    },

    computed : {
        ...mapGetters('page',['menuList', 'basePath', 'getPath']),
        ...mapGetters('user',['hasToken'])
    },

    methods : {
        
        checkToken(){
            const nowPath = window.location.pathname;
            // 현재 토큰이 있는지 확인 .
            if( this.hasToken && nowPath !== this.getPath('home')){
                // 토큰이 존재할 때 홈으로 이동.
                this.$router.push({ path: this.menuList.home.path });
            } else if (!this.hasToken && nowPath !== this.getPath('login')){
                // 토큰이 없을 때 로그인 페이지로 이동.
                this.$router.push({ path: this.menuList.login.path });
            }
        },

        async getUserInfo(){
            /**
             * 토큰이 있을 때 유저 정보 호출 구현.
             * 
             * vuex 유저정보 갱신
             */
        }
    },

    created() {
        this.checkToken();
        this.getUserInfo();
    },

    watch: {
        'hasToken' : function() {
            this.checkToken();
        }
    }

};
</script>
