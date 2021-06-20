export default {
    methods: {
        findUrls(text) {
            const pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gim;
            return text.match(pattern);
        },
        wrapUrls(inputText) {
            let replacedText;
            // URLs starting with http://, https://, or ftp://
            const pattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
            replacedText = inputText.replace(pattern1, "<a href=\"$1\" target=\"_blank\">$1</a>");

            // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
            const pattern2 = /(^|[^/])(www\.[\S]+(\b|$))/gim;
            replacedText = replacedText.replace(pattern2, "$1<a href=\"http://$2\" target=\"_blank\">$2</a>");
            
            return replacedText;
        } 
    }
};
