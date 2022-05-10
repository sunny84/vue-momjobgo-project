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
        ...mapActions('user', ['setName', 'setId']),

        checkToken(){
            const nowPath = window.location.pathname;

            if( this.hasToken && nowPath !== this.getPath('home')){
                this.$router.push({ path: this.menuList.home.path });
            } else if (!this.hasToken && nowPath !== this.getPath('login')){
                this.$router.push({ path: this.menuList.login.path });
            }
        },

        async getUserInfo(){    
            if(this.hasToken){
                const {data : user} = await this.$api(`/api/auth/user`, 'get');
                this.setId(user.id);
                this.setName(user.name);
            }
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
