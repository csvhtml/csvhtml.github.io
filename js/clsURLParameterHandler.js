const queryString = window.location.search
const urlParameterX = new URLSearchParams(queryString)
const urlParameter= Object.fromEntries(urlParameterX.entries())
// const URLPARAMETER_LOG = false
const URLPARAMETER_LOG = true

class clsURLParameterHandler {
    constructor(parameters) {
        this.urlParameter = urlParameter
        this.pageParameter = {}
        
        let keys = Object.keys(this.urlParameter) 
        for (let para of keys) {
            this.urlParameter[para] = forceType(this.urlParameter[para])
        }
        for (let para of parameters) {
            this.pageParameter[para] = null
        }
        for (let key in urlParameter) {
                this.log(key, urlParameter[key])
                this._setparameterValues(key, urlParameter[key])
        }
    }

    _setparameterValues(key, val) {
        if (key in this.pageParameter) {
                this.pageParameter[key] = forceType(val)
            } else {
                return
            }
        }

    parameters() {
        let ret = {}
        let keys = Object.keys(this.pageParameter) 
        for (let key of keys) {
            if (key in this.urlParameter) {
                ret[key] = this.urlParameter[key]
            }
        }
        return ret
    }

    get(parameter) {
        assert (parameter in this.pageParameter)
        return this.pageParameter[parameter]
    }

    log(key, val) {
        if (URLPARAMETER_LOG) {
            if (key in this.pageParameter) {
                log.msg(key + ": " + val)
            } else  {
                log.msg(key + " : " + val + " (key not defined)")
            }
            
        }
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

