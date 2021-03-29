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
                console.log(await responses[file].resp);
            } else if (file === "file2") {
                await responses["file1"].resp;
                console.log(await responses[file].resp);
            } else if (file === "file3") {
                await responses["file1"].resp;
                await responses["file2"].resp;
                console.log(await responses[file].resp);
                console.log("Zakończono!");
            }
        });
    };
})();

// żądania
getFile("file1");
getFile("file2");
getFile("file3");
