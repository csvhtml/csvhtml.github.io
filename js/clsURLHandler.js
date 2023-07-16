const queryString = window.location.search
const urlParameterX = new URLSearchParams(queryString)
const urlParameter= Object.fromEntries(urlParameterX.entries())

class clsURLHandler {
/**
 * Handles the URL parameters. 
 * @param {*} parameter - returns all URL parameters as dictionary
 */

    constructor() {
        this.urlParameter = urlParameter
        
        let keys = Object.keys(this.urlParameter) 
        for (let para of keys) {
            this.urlParameter[para] = forceType(this.urlParameter[para])
        }
    }

    parameter() {
        let ret = {}
        let keys = Object.keys(this.urlParameter) 
        for (let key of keys) {
            ret[key] = this.urlParameter[key]
        }
        return ret
    }
}


function forceType(text) {
    if (text == "false") {
        return false
    }
    if (text == "true") {
        return true
    }
    return text
}

// ################################################################
// test                                                           #
// ################################################################

// tests run in new opened tab with a new instance
// function test_clsURLParameterHandler() {
//     test_clsURLParameterHandler()

//     return 0
// }


// function test_clsURLParameterHandler() {
//     let fname = arguments.callee.name;
//     testInput = "sidebar=false&mode=asd"

//     // window.open("file:///C:/git/csvhtml.github.io/index.html?" + testInput, "_blank").close()
//     window.open("file:///C:/git/csvhtml.github.io/index.html?" + testInput, "_blank")

// }

