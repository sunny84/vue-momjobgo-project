<template>
    <div>
        <br/>
        <br/>
        <v-row>
        <v-text-field label="댓글을 입력하세요" v-model="newComment"></v-text-field><v-btn @click="postComment">저장</v-btn>
        </v-row>
        <v-simple-table>
            <template v-slot:default>
                <thead>
                <tr v-if="commentList.length > 0">
                    <th class="text-left">
                    댓글
                    </th>
                    <th class="text-right">
                    작성일
                    </th>
                    <th class="text-right">
                    작성자
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in commentList"
                    :key="item.name"
                >
                    <!-- 작성자와 현재 로그인 한 유저가 일치할 때 삭제 아이콘 보이도록 함.-->
                    <td style="max-width: 400px;">{{ item.comment }}<v-icon v-if="item.writer === userId" small @click="deleteComment(item.id)">delete</v-icon></td>
                    <!-- 시간을 나열한 순서대로 조건을 적용한다. 1시간 이내 ?분전으로 표기, 24시간 이내 ?시간전으로 표기, yyyy-MM-dd HH:mm:ss로 표기 .-->
                    <td class="text-right">{{ new Date(item.createdAt) }}</td>
                    <td class="text-right">{{ item.writer }}</td>
                </tr>
                </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    export default {

        props : {
            bno : {
                type : Number
            }
        },

        data : () => ({
            newComment : '',

            commentList : []
        }),

        created() {
            this.callCommentList();
        },

        computed : {
            ...mapGetters('user', ['userId']),
        },

        methods : {
            async callCommentList() {
                /**
                 * 댓글 조회.
                 * 
                 * bno가 0일때는 조회 호출하지 않음.
                 */
                // console.log(this.props.bno);
                // if(this.props.bno === 0){
                //     return false;
                // }
                // const response = await this.$api(`/api/board/comment/${this.props.bno}`, 'get');
                // console.log(response);
                // this.commentList = response.data;
            },

            async postComment(){
                /**
                 * 댓글 등록.
                 * 
                 * 댓글 입력란에 값이 없으면 '댓글을 입력해주세요 alert'
                 */
                if(this.newComment.length === 0){
                   alert('댓글을 입력해주세요.');
                   return false;
                }
                const response = await this.$api(`/api/board/comment/${this.props.bno}`, 'post', {
                    comment : this.newComment
                });   
            },

            async deleteComment(id){
                /**
                 * 댓글 삭제.
                 * 
                 * 댓글 삭제 여부 확인.
                 */
                const response = await this.$api(`/api/board/comment/${id}`, 'delete');
            },

            // 상위 게시판 컴포넌트에 댓글 업데이트를 알림.
            refreshBoardList(){
                this.$emit('updated');
            }
        },

        watch : {
            bno : function(){
                this.callCommentList();
            },
        },

    }
</script>