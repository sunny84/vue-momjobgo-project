<template>
    <div>
        <v-card
        elevation="2"
        >
            <v-card-title>회원 정보 및 수정</v-card-title>
            <v-card-subtitle>* 는 필수 값입니다.</v-card-subtitle>
            <v-card-text>
                 <v-text-field v-model="user.id" label="* 아이디" disabled></v-text-field>
                 <v-text-field v-model="user.pwd" label="* 현재 비밀번호" type="password"></v-text-field>

                 <v-text-field v-model="user.newPwd" label="새로운 비밀번호" type="password"></v-text-field>
                 <v-text-field v-model="checkPwd" label="새로운 비밀번호 확인" type="password"></v-text-field>
                 <v-text-field v-model="user.name" label="* 이름"></v-text-field>
            </v-card-text>

            <v-card-actions>
                <v-btn @click="modify">수정</v-btn>
                <v-btn @click="deleteUser" color="red" style="color: white;">삭제</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import { mapActions } from "vuex"
import store from '@/store'
export default {

    data() {
        return {
            user : {
                id : '',
                name : '',
                pwd : '',
                newPwd : ''
            },

            checkPwd : ''
        }
    },

    created() {
        this.refreshUser();
    },

    methods: {
        ...mapActions('user', ['setToken', 'setUserId', 'setUserName']),

        async refreshUser(){
            /**
             * 유저 정보 조회 구현.
             * 
             * vuex 유저정보 갱신 및 text-field 초기화.
             */
            const {data : user} = await this.$api('/api/auth/user', 'get');
            this.setUserId(user.id);
            this.setUserName(user.name);

            this.user.id = user.id;
            this.user.name = user.name;
            // this.user.pwd = '';
            // this.user.newPwd = '';
            // this.checkPwd = '';
        },

        async modify(){
            /**
             * 유저 정보 수정 구현.
             * 
             * 새로운 비밀번호를 입력하지 않으면 이름만 변경된다.
             * 새로운 비밀번호 입력 시 비밀번호 확인과 일치해야한다.
             * 수정 여부를 확인 한 후 수정한다.
             */            
            if (this.user.pwd.length === 0 || this.user.name.length === 0  || this.user.id.length === 0 ){
                alert('*는 필수 값입니다. 입력해주세요.');
                return false;
            }

            if (this.user.newPwd !== this.checkPwd) {
                alert('비밀번호가 일치하지 않습니다.');
                return false;
            }

            if(!confirm('정말로 수정 하시겠습니까?')){
                return false;
            }
            const response = await this.$api('/api/auth/user', 'patch', {
                ...this.user,
                newPwd : this.user.newPwd === '' ? null : this.user.newPwd 
            });

            if(response.status === this.HTTP_OK || response.status === this.HTTP_CREATED){
                alert("수정 되었습니다.");
                this.refreshUser();
            }
        },

        async deleteUser(){
            /**
             * 유저 정보 삭제 구현.
             * 
             * 삭제 여부를 확인 한 후 삭제한다.
             */
            if(!confirm('정말로 삭제 하시겠습니까?')){
                return false;
            }
            const response = await this.$api(`/api/auth/user`, 'delete');
            if(response.status === this.HTTP_OK){
                alert('삭제되었습니다.')
                this.setToken('');
            }
        }
    },
}
</script>