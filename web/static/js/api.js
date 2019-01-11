"use strict";

const searchScripts = options => {
    return new Promise(async (resolve, reject) => {

        let url_encode = "";
        for (let opt in options) {
            if (url_encode === "") {

                url_encode += "?";
            } else {

                url_encode += "&";
            }

            url_encode += `${opt}=${options[opt]}`;
        }

        const req = new XMLHttpRequest;
        req.open("GET", `/api/v3/scripts${url_encode}`);

        req.onreadystatechange = () => {
            if (req.readyState === 4) {

                const res_json = JSON.parse(req.response);

                if (res_json instanceof Array === true) {

                    resolve(res_json);
                } else {

                    reject(res_json);
                }
            }
        }

        req.send();
    });
}
