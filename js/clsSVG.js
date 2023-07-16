const CLS_SVG_APPLYFORTAGS = ["div", "a"]
const CLS_SVG_VALID_NAMES = {
    "SquareArrowDown": "mySVG-SqAwDwn",
    "SquareArrowDownWithBottomLine": "mySVG-SqAwDwnBmLine",
}
const CLS_SVG_REPLACE = {
    "mySVG-SqAwDwnBmLine": '<svg width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">\
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>\
    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>\
    </svg>',

    "mySVG-SqAwDwn": '<svg width="20" height="20" fill="currentColor" class="bi bi-save m-2" viewBox="0 0 16 16"> \
    <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 \
    3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/> \
    </svg>',
}

class clsSVG {
/**
 * Insert Creates SVG icons based on SVG class
 */
    constructor() {
        this.CreateSVGs_FromDivClasses()
    }

    CreateSVGs_FromDivClasses() {
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

    CreateSVG_FromDivID(divID, SVGName) {
        if (Object.keys(CLS_SVG_VALID_NAMES).includes(SVGName)) {
            let div = document.getElementById(divID);   
            div.innerHTML = CLS_SVG_REPLACE[CLS_SVG_VALID_NAMES[SVGName]] + div.innerHTML
        }
    }
}
