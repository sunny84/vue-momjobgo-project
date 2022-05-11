import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/login/LoginView.vue'
import UserView from '@/views/UserView.vue'
import BoardView from '@/views/board/BoardsView.vue'

export default {

    namespaced : true,

    state : {

        // header 부분의 제목.
        title : '',

        // basepath가 있다면 지정.
        basePath : '',

        // router와 nav의 목록 리스트에 동시에 적용되는 list, display에 nav노출이 결정된다.
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
            
            board : {
                path: `/board`,
                name: `board`,
                meta: {
                    title: `Board`,
                    icon: `table_rows`,
                    display : true
                },
                component : BoardView
            },
            
            user : {
                path: `/user`,
                name: `user`,
                meta: {
                    title: `User`,
                    icon: `account_circle`,
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
            },

        },

        // 템플릿 태그들의 존재 유무를 결정함.
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

        // list의 object키를 파라미터로 받으면 해당 키에 대한 path를 베이스 path와 합쳐서 반환.
        getPath : (state, getters) => listKey => {
            return `${getters.basePath}${state.list[listKey].path}`
        }
    },

    mutations : {
        setTitle(state, title){
            state.title = title;
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

        /**
         * template에 해당하는 태그들의 유무를 컨트롤
         * @param {*} param0 
         * @param {*} value 
         */
        setAllVisible({commit}, value){
            commit('setAllVisible', value);
        }

    }

}