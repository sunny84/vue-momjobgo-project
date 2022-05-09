export default {

    namespaced : true,

    state : {
        token : sessionStorage.getItem('access-token'),
        user : {
            name : ''
        }
    },

    getters : {
        name(state){
            return state.user.name;
        },

        token(state){
            return state.token;
        },

        hasToken(state){
            return !!state.user.token;
        }
    },

    mutations : {
        setName(state, name){
            state.user.name = name;
        },

        setToken(state, token){
            state.token = token;
            sessionStorage.setItem('access-token', token);
        }
    },

    actions : {
        setName({commit}, name){
            commit('setName', name);
        },
        
        setToken({commit}, token){
            commit('setToken', token);
        }
    }
}