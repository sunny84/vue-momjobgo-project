import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

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
                    icon: `home`
                },
                component : HomeView
            },

            about : {
                path: `/about`,
                name: `about`,
                meta: {
                    title: `About`,
                    icon: `question_mark`
                },
                component : AboutView
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
        }
    },

    mutations : {
        setTitle(state, title){
            state.title = title;
        },

        setVisible(state, {key, value}){
            state[key] = value;
        }
    },

    actions : {
        setTitle({commit}, title){
            commit('setTitle', title);
        },

        setVisible({commit}, payload){
            commit('setVisible', payload); 
        }
    }

}