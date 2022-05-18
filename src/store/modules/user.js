/**
 * 유저정보와 토큰을 set하고 
 * 토큰여부를 확인하는 내용을 작성
 */
export default {

    namespaced : true,

    state : {
        token : '',
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
        setToken(state, payload){
            state.token = payload;
        },
        setUserId(state, payload){            
            state.user.id = payload;
        },
        setUserName(state, payload){            
            state.user.name = payload;
        }
    },

    actions : {
        setToken({commit}, payload){
            commit('setToken', payload);
        },
        setUserId({commit}, payload){
            commit('setUserId', payload);
        },
        setUserName({commit}, payload){
            commit('setUserName', payload);
        }
    }
}