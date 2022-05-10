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
                <v-dialog v-model="dialgDetail" max-width="800px">
                    <v-card>
                    <v-card-title>
                    </v-card-title>

                    <v-card-subtitle>
                        <span class="text-h6">{{ selectedItem.title }}</span>
                    </v-card-subtitle>

                    <v-card-text>
                        <v-container>
                        <!-- textarea로 저장된 문자열은 \n\r로 줄바꿈을 하는데 html에서는 <br>로 변형해주어야 한다. nl2br이 그러한 역할을 한다.-->
                        <v-card-text v-html="$nl2br(selectedItem.contents)" style="border-style: ridge;"></v-card-text>
                        <v-card-text>
                            <v-icon 
                                v-for="(emotion, index) in emotionList"
                                :key="index" 
                                :color="emotion.value === emotionOn ? 'red' : ''"
                                @click="clickEmotion(emotion, index)"
                                :style="{'margin-right' : '10px'}"
                                >{{emotion.icon}}
                            </v-icon>
                        </v-card-text>
                        <BoardCommentsViewVue :bno="selectedItem.bno" @updated="updatedComment"></BoardCommentsViewVue>
                        </v-container>
                    </v-card-text>
                    
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDetail"> 확인 </v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>

                <!-- 글 등록 alert -->
                <v-dialog v-model="dialogEdit" max-width="500px">
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
                                    v-model="selectedItem.title"
                                ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                <v-textarea
                                    outlined
                                    label="내용"
                                    v-model="selectedItem.contents"
                                ></v-textarea>
                                </v-col>
                            </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeEdit"> 취소 </v-btn>
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
                        <v-btn color="blue darken-1" text @click="deleteItem">삭제</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
                
            </v-toolbar>
        </template>

        <!-- 테이블 제목 -->
        <!-- 테이블 제목 클릭시 popDetailModal(item) 메소드를 호출하도록 구현, 댓글 갯수가 제목 옆에 보이도록 구현.-->

        <!-- 테이블 날짜 -->
        <template #item.createdAt="{ item }">
            <span> {{ new Date(item.createdAt) | getWriteTime}} </span>
        </template>

        <!-- 테이블 동작 -->
        <template #item.actions="{ item }">
            <template v-if="userId === item.writer">
                <v-icon small @click="popEditModal(item)" class="mr-2"> mdi-pencil </v-icon>
                <v-icon small @click="popDeleteModal(item)"> mdi-delete </v-icon>
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

            // 감정표현 관련 변수.
            emotionOn : null,
            emotionList : [
                {icon : 'thumb_up', value : 0},
                {icon : 'thumb_down_alt', value : 1}
            ],

            //dialog 관련 변수.
            dialogEdit: false,
            dialogDelete: false,
            dialgDetail : false,

            //검색창.
            search : '',

            //테이블 헤더.
            headers: [
                {
                    text: "게시물 번호",
                    align: "start",
                    sortable: true,
                    value: "bno",
                },
                { text: "제목", value: "title" },
                { text: "추천수", value: "likeCnt" },
                // 비 추천수 추가 ( hateCnt )
                { text: "작성자", value: "writer" },
                { text: "등록일", value: "createdAt" },
                { text: "", value: "actions", sortable: false },
            ],
            //게시물 list
            boards: [],

            // 선택된 게시물
            selectedIndex: -1,
            selectedItem: {
                bno: 0,
                title: "",
                contents: "",
            },
            // 선택된 게시물 초기화 item
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
                return this.isModify ? '글 수정' : '글 등록'
            },

            isModify() {
                return this.selectedIndex > -1
            }
        },

        watch: {
            dialogEdit(val) {
                val || this.closeEdit();
            },
            dialogDelete(val) {
                val || this.closeDelete();
            },
            dialgDetail(val) {
                val || this.closeDetail();
            }
        },

        created() {
            this.initialize();
        },

        methods: {
            initialize() {
                this.callBoards();
            },

            callBoards() {
                /**
                 * 게시판 목록 호출.
                 * 
                 * boards에 응답 결과를 대입해준다.
                 */
            },

            // 상세정보 보기 모달 창 on
            popDetailModal(item) {
                this.selectedIndex = this.boards.indexOf(item);
                this.selectedItem = Object.assign({}, item);
                this.callEmotion();
                this.dialgDetail = true;
            },

            // 글등록 or 수정 모달 창 on
            popEditModal(item) {
                this.selectedIndex = this.boards.indexOf(item);
                this.selectedItem = Object.assign({}, item);
                this.dialogEdit = true;
            },

            // 삭제여부 모달 창 on
            popDeleteModal(item) {
                this.selectedIndex = this.boards.indexOf(item);
                this.selectedItem = Object.assign({}, item);
                this.dialogDelete = true;
            },

            deleteItem() {
                /**
                 * 게시물 삭제 구현.
                 */
            },

            // 글 등록 or 수정 모달 닫기.
            closeEdit() {
                this.dialogEdit = false;
                this.clearSelectedItem();
            },

            // 글 상세 정보 모달 닫기
            closeDetail() {
                this.dialgDetail = false;
                this.clearSelectedItem();
            },

            // 삭제 여부 모달 닫기
            closeDelete() {
                this.dialogDelete = false;
                this.selectedItem = Object.assign({}, this.defaultItem);
                this.clearSelectedItem();
            },

            // SelectedItem 관련 필드 초기화
            clearSelectedItem(){
                this.selectedItem = Object.assign({}, this.defaultItem);
                this.selectedIndex = -1;
            },

            save() {
                if (this.isModify) {
                    /**
                     * 글 수정.
                     */
                } else {
                    /**
                     * 글 신규등록.
                     */
                }
            },

            // 댓글이 업데이트 될 때 실행.
            updatedComment(){
                this.callBoards();
            },

            callEmotion(){
                /**
                 * 좋아요 불러오기.
                 */
            },

            clickEmotion(item, index){
                /**
                 * 감정표현 클릭.
                 */             
            },

        }

    };
  
</script>