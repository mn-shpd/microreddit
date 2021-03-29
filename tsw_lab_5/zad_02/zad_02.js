const fakeRequest = async (url, cb) => {
    const responses = {
        "file1": "The first text",
        "file2": "The middle text",
        "file3": "The last text"
    };
    const randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000;

    console.log("Pobieram: " + url);

    cb(new Promise ((resolve) => {
        setTimeout(() => {
            resolve(responses[url]);
        }, randomDelay);
    }));
}

const output = (text) => {
    console.log(text);
}

// zmodyfikuj poniższą definicję wykorzystując pojęcie „domknięcia” (por. wykład)
const getFile = (function (file) {
    const responses = {};
    return (file) => {
        fakeRequest (file, async (text) => {

            responses[file] = { resp: text };

            if (file === "file1") {
                let response = await responses[file].resp;
                console.log(response);
            } else if (file === "file2") {
                let response = await responses["file1"].resp;
                response = await responses[file].resp;
                console.log(response);
            } else if (file === "file3") {
                let response = await responses["file1"].resp;
                response = await responses["file2"].resp;
                response = await responses[file].resp;
                console.log(response);
            }
        });
    };
})();

// żądania
getFile("file1");
getFile("file2");
getFile("file3");
