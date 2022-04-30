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

export default {
    name: "App",

    data: () => ({}),

    components: {
        NavView,
        HeaderView,
        MainView,
        FooterView,
    },

};
</script>
