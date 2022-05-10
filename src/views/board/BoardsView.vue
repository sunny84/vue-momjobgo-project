<template>
    <v-data-table :headers="headers" :items="boards" sort-by="calories" class="elevation-1" :search="search">

        <template #top>
            <v-toolbar flat>
                <v-toolbar-title>간단한 게시판</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="검색"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer></v-spacer>

                <!-- 글 상세 정보 alert -->
                <v-dialog v-model="popup" max-width="800px">
                    <v-card>
                    <v-card-title>
                    </v-card-title>

                    <v-card-subtitle>
                        <span class="text-h6">{{ editedItem.title }}</span>
                    </v-card-subtitle>

                    <v-card-text>
                        <v-container>
                        <v-card-text v-html="$nl2br(editedItem.contents)" style="border-style: ridge;"></v-card-text>
                        <v-card-text>
                            <v-icon 
                                v-for="(emotion, index) in emotionList"
                                :key="index" 
                                :color="emotion.on ? 'red' : ''"
                                @click="clickEmotion(emotion, index)"
                                >{{emotion.icon}}
                            </v-icon>
                        </v-card-text>
                        <BoardCommentsViewVue :bno="detailBno" @updated="updatedComment"></BoardCommentsViewVue>
                        </v-container>
                    </v-card-text>
                    
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closePopup"> 확인 </v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>

                <!-- 글 등록 alert -->
                <v-dialog v-model="dialog" max-width="500px">
                    <template #activator="{ on, attrs }">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                            글 등록
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{formTitle}}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                            <v-row>
                                <v-col cols="12">
                                <v-text-field
                                    label="제목"
                                    v-model="editedItem.title"
                                ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                <v-textarea
                                    outlined
                                    label="내용"
                                    v-model="editedItem.contents"
                                ></v-textarea>
                                </v-col>
                            </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close"> 취소 </v-btn>
                            <v-btn color="blue darken-1" text @click="save"> 저장 </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!-- 삭제 시 alert -->
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                    <v-card-title class="text-h5">정말 삭제하시겠습니까?</v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete">취소</v-btn>
                        <v-btn color="blue darken-1" text @click="deleteItemConfirm">삭제</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
                
            </v-toolbar>
        </template>

        <!-- 테이블 제목 -->
        <template #item.title="{ item }">
            <span style="cursor: pointer;" @click="popupItem(item)"> 
                {{item.title}} 
                <template v-if="item.commentCnt > 0">
                    ({{item.commentCnt}})
                </template> 
            </span>
        </template>

        <!-- 테이블 날짜 -->
        <template #item.createdAt="{ item }">
            <span> {{ new Date(item.createdAt) | getWriteTime}} </span>
        </template>

        <!-- 테이블 동작 -->
        <template #item.actions="{ item }">
            <template v-if="userId === item.writer">
                <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
        </template>

        <!-- 데이터 없을때 화면 -->
        <template #no-data>
            <v-btn color="primary" @click="initialize"> 새로고침 </v-btn>
        </template>

    </v-data-table>
</template>

<script>
    import { mapGetters } from "vuex";

    import BoardCommentsViewVue from "./BoardCommentsView.vue";
    import BoardMixin from "@/mixins/board";
    import DateMixin from "@/mixins/date";

    export default {
        mixins : [BoardMixin, DateMixin],

        data: () => ({
            
            emotionList : [
                {icon : 'favorite', on : false, value : 0}
            ],

            detailBno : 0,

            dialog: false,
            dialogDelete: false,
            popup : false,
            search : '',

            headers: [
                {
                    text: "게시물 번호",
                    align: "start",
                    sortable: true,
                    value: "bno",
                },
                { text: "제목", value: "title" },
                { text: "추천수", value: "likeCnt" },
                { text: "작성자", value: "writer" },
                { text: "등록일", value: "createdAt" },
                { text: "", value: "actions", sortable: false },
            ],
            boards: [],

            editedIndex: -1,
            editedItem: {
                bno: 0,
                title: "",
                contents: "",
            },
            defaultItem: {
                bno : 0,
                title: "",
                contents: "",
            },

        }),

        components : {
            BoardCommentsViewVue 
        },

        computed: {
            ...mapGetters('user', {userId : 'id'}),

            formTitle(){
                return this.editedIndex === -1 ? '글 등록' : '글 수정'
            }
        },

        watch: {
            dialog(val) {
                val || this.close();
            },
            dialogDelete(val) {
                val || this.closeDelete();
            },
            popup(val) {
                val || this.closePopup();
            }
        },

        created() {
            this.initialize();
        },

        methods: {
            initialize() {
                this.callBoards();
            },

            async callBoards() {
                /**
                 * 게시판 목록 호출.
                 * 
                 * boards 항목에 응답 결과를 대입해준다.
                 */
                const response = await this.$api("/api/board", "get");

                if (response.status === this.HTTP_OK) {
                    this.boards = response.data;
                }
            },

            popupItem(item) {
                this.detailBno = item.bno;
                this.callEmotion();
                this.editedIndex = this.boards.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.popup = true;
            },

            editItem(item) {
                this.editedIndex = this.boards.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.dialog = true;
            },

            deleteItem(item) {
                this.editedIndex = this.boards.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.dialogDelete = true;
            },

            async deleteItemConfirm() {
                const bno = this.editedItem.bno;

                const response = await this.$api(`/api/board/${bno}`, 'delete')
                if(response.status === this.HTTP_OK){
                    alert('삭제 되었습니다.');
                    this.callBoards();
                }

                this.closeDelete();

            },

            close() {
                this.dialog = false;
                this.clearEditItem();
            },

            closePopup() {
                this.popup = false;
                this.clearEditItem();
            },

            clearEditItem(){
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                });
            },

            closeDelete() {
                this.dialogDelete = false;
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                });
            },

            async save() {
                if (this.editedIndex > -1) {
                    // 수정
                    const response = await this.$api("/api/board", "PATCH", {
                        bno: this.editedItem.bno,
                        title: this.editedItem.title,
                        contents: this.editedItem.contents,
                    });

                    if(response.status === this.HTTP_OK || response.status === this.HTTP_CREATED){
                        alert("수정되었습니다.");
                        this.dialog = false;
                    }
                } else {
                    // 신규 등록
                    const response = await this.$api("/api/board", "POST", {
                        title: this.editedItem.title,
                        contents: this.editedItem.contents,
                    });

                    if(response.status === this.HTTP_OK || response.status === this.HTTP_CREATED){
                        alert("등록되었습니다.");
                        this.dialog = false;
                    }
                }

                this.callBoards();
                this.close();
            },

            updatedComment(){
                this.callBoards();
            },

            async callEmotion(){
                const response = await this.$api(`/api/board/emotion/${this.detailBno}`, 'GET', null);

                if(response.status === this.HTTP_OK){
                    
                    const emotion = response.data.emotion;
                    if(emotion != null){
                        this.emotionList[emotion].on = true;
                    } else {
                        this.emotionList.forEach(emotion => emotion.on = false);
                    }

                }
            },

            clickEmotion(item, index){
                item.on = !item.on;

                this.emotionList.forEach((emotion, idx)=> {
                    if(!index === idx){
                        emotion.on = false;
                    }
                });

                if(item.on){
                    this.$api(`/api/board/emotion/${this.detailBno}`, 'POST', {emotion : item.value});
                } else {
                    this.$api(`/api/board/emotion/${this.detailBno}`, 'POST', {emotion : null});
                } 

                
            },

        }

    };
  
</script>
