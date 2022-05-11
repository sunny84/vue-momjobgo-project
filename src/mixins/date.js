export default {
    methods : { 
        /**
         * Date to yyyy-MM-dd HH:mm:ss
         * @param {*} dateObj 
         * @returns 
         */
        toYmdHms(dateObj){
            return toYmdHms(dateObj);
        }
    },

    filters : {
        
        /**
         * 한시간 이내는 ?분전, 하루 이내는 ?시간 전 그외는 yyyy-MM-dd HH:mm:ss 로 변경해줌.
         * @param {*} dateObj 
         * @returns 
         */
        getWriteTime(dateObj){
            const now = new Date();
            const diff = now.getTime() - dateObj.getTime();
            const minute = 1000 * 60;
            const hour = 1000 * 60 * 60;
            const day = 1000 * 60 * 60 * 24;

            if(hour > diff){
                return `${Math.ceil(diff / minute)}분 전`;
            } else if(day > diff){
                return `${Math.ceil(diff / hour)}시간 전`
            } else {
                return toYmdHms(dateObj);
            }

        },

        /**
         * Date to yyyy-MM-dd HH:mm:ss
         * @param {*} dateObj 
         * @returns 
         */
        time2YmdHms(dateObj){
            return toYmdHms(dateObj);
        },

    }
}

function toYmdHms(dateObj){

    const year = String(dateObj.getFullYear());
    const month = String(dateObj.getMonth() + 1).padStart(2,0);
    const date = String(dateObj.getDate()).padStart(2,0);
    const hour = String(dateObj.getHours()).padStart(2,0);
    const minute = String(dateObj.getMinutes()).padStart(2,0);
    const second = String(dateObj.getSeconds()).padStart(2,0);

    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
}