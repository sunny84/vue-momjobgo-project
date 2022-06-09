/**
 * 유저정보와 토큰을 set하고 
 * 토큰여부를 확인하는 내용을 작성
 */
export default {

    namespaced : true,

    state : {
        token : sessionStorage.getItem('access-token'),
        user : {
            id : '',
            name : ''
        }
    },

    getters : {
        token(state){
            return state.token;
        },
        hasToken(state){
            return !!state.token;
        },
        userId(state){
            return state.user.id;
        },
        userName(state){
            return state.user.name;
        }
    },

    mutations : {
        setToken(state, token){
            state.token = token;
            sessionStorage.setItem('access-token', token);
        },
        setUserId(state, id){            
            state.user.id = id;
        },
        setUserName(state, name){            
            state.user.name = name;
        }
    },

    actions : {
        setToken({commit}, token){
            commit('setToken', token);
        },
        setUserId({commit}, id){
            commit('setUserId', id);
        },
        setUserName({commit}, name){
            commit('setUserName', name);
        }
    }
}