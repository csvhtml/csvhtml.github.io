const CLS_SVG_APPLYFORTAGS = ["div", "a"]

const CLS_SVG_REPLACE = {
    "mySVG-SqAwDwnBmLine": '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">\
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>\
    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>\
    </svg>',
}

class clsSVG {
/**
 * Insert Creates SVG icons based on SVG class
 */
    constructor() {
        this.CreateSVGs()
    }

    CreateSVGs() {
        var Cls_SVG_ValidTags = Object.keys(CLS_SVG_REPLACE)
        let listDIVS = []
        // get all divs
        for (let tag of CLS_SVG_APPLYFORTAGS) {
            let pageDIVs = document.getElementsByTagName(tag)
            for (let div of pageDIVs) {
                listDIVS.push(div)
            }
        }
        
        // loop all divs->loop all classes
        for (let div of listDIVS) {
            for (let cls of div.classList)
                if (Cls_SVG_ValidTags.includes(cls)) {
                    if (cls == "mySVG-SqAwDwnBmLine") {
                        div.innerHTML = CLS_SVG_REPLACE[cls] + div.innerHTML
                    }
                }
        }
    }
}
