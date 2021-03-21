const fakeRequest = (url, cb) => {
    const responses = {
        "file1": "The first text",
        "file2": "The middle text",
        "file3": "The last text"
    };
    const randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000;

    console.log("Pobieram: " + url);

    setTimeout(() => {
        cb(responses[url]);
    }, randomDelay);
}

const output = (text) => {
    console.log(text);
}

// zmodyfikuj poniższą definicję wykorzystując pojęcie „domknięcia” (por. wykład)
const getFile = (function (file) {
    const responses = {};
    return (file) => {
        fakeRequest(file, (text) => {
            responses[file] = { resp: text, printed : 0 };

            var checkResponses = (responses) => {
                if (responses.hasOwnProperty("file1") && responses.file1.printed !== 1) {
                    output(responses.file1.resp);
                    responses.file1.printed = 1;
                    checkResponses(responses);
                } else if (responses.hasOwnProperty("file2") && responses.hasOwnProperty("file1") && responses.file2.printed !== 1 && responses.file1.printed === 1) {
                    output(responses.file2.resp);
                    responses.file2.printed = 1;
                    checkResponses(responses);
                } else if (responses.hasOwnProperty("file3") && responses.hasOwnProperty("file2") && responses.file3.printed !== 1 && responses.file2.printed === 1) {
                    output(responses.file3.resp);
                    responses.file3.printed = 1;
                    console.log("Zakończono!");
                }
            }

            checkResponses(responses);
        });
    };
})();

// żądania
getFile("file1");
getFile("file2");
getFile("file3");
