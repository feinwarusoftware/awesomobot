"use string";

// utility classes and functions for making http requests
class Opt {
    constructor(options) {

        this.options = options;
    }
    fillDefaults(defaults) {

        for (let def in defaults) {

            if (this.options[def] == null) {

                this.options[def] = defaults[def];
            }
        }
    }
    assertContains(fields) {

        for (let field of fields) {

            if (this.options[field] == null) {

                return false;
            }
        }

        return true;
    }
}

const encodeURIParams = (uri, params) => {

    let first = true;

    for (let param in params) {

        if (param != null && param !== "") {

            if (first) {

                uri += "?";
                first = false;
            } else {

                uri += "&";
            }

            uri += `${param}=${params[param]}`;
        }
    }

    return encodeURI(uri);
}

module.exports = {

    Opt,
    encodeURIParams
};
