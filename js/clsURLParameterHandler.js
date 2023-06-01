const queryString = window.location.search
const urlParameterX = new URLSearchParams(queryString)
const urlParameter= Object.fromEntries(urlParameterX.entries())
// const URLPARAMETER_LOG = false
const URLPARAMETER_LOG = true

var pageParameter = {
    "sidebar": false,
    "mode": "",
}

class clsURLParameterHandler {
    constructor() {
        for (let key in urlParameter) {
                this.log(key, urlParameter[key])
                this.constructor_HandleURLParameter(key, urlParameter[key])
        }
    }

    constructor_HandleURLParameter(key, val) {
        if (!URLPARAMETER_LOG) {
            if (!(key in pageParameter)) {
                return
            }
        }
        if (key == "sidebar")  {
            if (val == "false"){
                cParameter.set("Sidebar", false)
                // boolSIDEBEAR = false
                document.getElementById("MySidebar").remove()
                document.getElementById("MyCSV").classList.remove("col-10")
                document.getElementById("MyCSV").classList.add("col-12")
            }
        } 
        if (key == "mode") {
            
        }
    }

    log(key, val) {
        if (URLPARAMETER_LOG) {
            if (key in pageParameter) {
                log.msg(key + ": " + val)
            } else  {
                log.msg(key + " : " + val + " (key not defined)")
            }
            
        }
    }
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

