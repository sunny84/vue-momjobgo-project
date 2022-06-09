<template>
  <v-navigation-drawer app v-if="visible.footer">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">Vue-Project</v-list-item-title>
        <!-- 로그인한 사람의 이름이 나오도록 구현. -->
        {{ this.userName }}
        <v-list-item-subtitle>님 환영합니다. </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-for="(item, key) in menuList" :key="key" :to="item.path" v-show="item.meta.display">
        <v-list-item-icon>
          <v-icon>{{ item.meta.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="logout">
        <v-list-item-icon>
          <v-icon>logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {mapGetters, mapActions} from "vuex";

export default {
  data: () => ({
    
  }),

  computed : {  
    ...mapGetters('page', ['menuList', 'visible']),
    ...mapGetters('user', ['userName']),
  },

  methods : {
    ...mapActions('user', ['setToken']),

    logout(){
      /**
       * 로그아웃 구현.
       * 
       * 토큰에 빈값이 들어가면 로그아웃이 된것으로 처리 됨.
       */
      if(!confirm('로그아웃 하시겠습니까?')) {
        return false;
      }

      this.setToken('');
    }
  }

};
</script>
