import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/login/LoginView.vue'
import UserView from '@/views/UserView.vue'

export default {

    namespaced : true,

    state : {

        title : '',

        basePath : '',

        list : {
            home : {
                path: `/home`,
                name: `home`,
                meta: {
                    title: `Home`,
                    icon: `home`,
                    display : true
                },
                component : HomeView
            },

            user : {
                path: `/user`,
                name: `user`,
                meta: {
                    title: `User`,
                    icon: ``,
                    display : true
                },
                component : UserView
            },

            login : {
                path: `/login`,
                name: `login`,
                meta: {
                    title: `Login`,
                    icon: ``,
                    display : false
                },
                component : LoginView
            }

        },

        visible : {
            header : true,
            navi : true,
            footer : true
        }

    },

    getters : {
        title(state){
            return state.title;
        },

        basePath(state){
            return state.basePath;
        },

        menuList(state){
            return state.list;
        },

        visible(state){
            return state.visible;
        },

        getPath : (state, getters) => path => {
            return `${getters.basePath}${state.list[path].path}`
        }
    },

    mutations : {
        setTitle(state, title){
            state.title = title;
        },

        setVisible(state, {key, value}){
            state[key] = value;
        },

        setAllVisible(state, value){
            state.visible.header = value;
            state.visible.navi = value;
            state.visible.footer = value;
        }
    },

    actions : {
        setTitle({commit}, title){
            commit('setTitle', title);
        },

        setVisible({commit}, payload){
            commit('setVisible', payload); 
        },

        setAllVisible({commit}, value){
            commit('setAllVisible', value);
        }

    }

}