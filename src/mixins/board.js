export default {
    methods : {
        /**
         * /n/r to <br/>
         * @param {*} text 
         * @returns 
         */
        $nl2br(text){
            return text.replace(/\n/g, "<br />");
        },
    }
}