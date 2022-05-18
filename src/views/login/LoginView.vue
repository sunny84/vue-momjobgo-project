<template>
    <v-app>
        <v-card width="500" style="top: 25%" class="mx-auto mt-5">
            <v-card-title class="pb-0">
                <h3>Login</h3>
            </v-card-title>

            <v-card-text>
                <v-form>
                    <v-text-field label="Id" v-model="id" @keyup.enter="$refs.pwd.focus()"/>
                    <v-text-field
                    ref="pwd"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    v-model="password"
                    @keyup.enter="login"
                    />
                </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <SignUpModalViewVue btn-color="success">
                    <template v-slot:title>회원가입</template>
                </SignUpModalViewVue>
                <v-btn color="info" @click="login" style="margin-left: 8px;">로그인</v-btn>
            </v-card-actions>

        </v-card>
    </v-app>
</template>

<script>
    import SignUpModalViewVue from "./SignUpModalView.vue";

    import { mapActions } from "vuex"
    import axios from "axios"

    export default {
        data : () => ({
            showPassword: false,
            id: "",
            password: "",
        }),

        mounted() {
            this.setAllVisible(false);
        },

        beforeDestroy() {
            this.setAllVisible(true);
        },

        methods : {
            ...mapActions('page', ['menuList', 'setAllVisible']),
            ...mapActions('user', ['setToken']),

            async login() {
                /**
                 * 로그인.
                 * 
                 * 로그인 한 후 발급된 토큰을 vuex에 저장
                 * 로그인 성공 후 location.href='/'
                 */
                try {
                    const response = await axios.post('https://api.devcury.kr/auth/user', {
                        id : this.id,
                        pwd : this.password
                    });
                    this.setToken(response.data.token);
                    this.$router.push({ path: '/' });
                } catch (error) {
                    console.error(error);
                }
            }
        },

        components : {
            SignUpModalViewVue
        }
    }
</script>

<style>

</style>