const CLS_SVG_APPLYFORTAGS = ["div", "a", "label"]
const CLS_SVG_VALID_NAMES = {
    "SquareArrowDown": "mySVG-SqAwDwn",
    "SquareArrowDownWithBottomLine": "mySVG-SqAwDwnBmLine",
    "A":  "mySVG-FileAwUp",
    "B": "mySVG-FileAwDown"
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

    "mySVG-FileAwUp": '<svg width="25" height="25" fill="currentColor" class="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16"> \
    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707L6.354 9.854z"/> \
    </svg>',

    "mySVG-FileAwDown": '<svg width="25" height="25" fill="currentColor" class="bi bi-file-earmark-arrow-down-fill" viewBox="0 0 16 16"> \
    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0z"/> \
    </svg>'
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
                    div.innerHTML = CLS_SVG_REPLACE[cls] + div.innerHTML
                    // if (cls == "mySVG-SqAwDwnBmLine") {
                    //     div.innerHTML = CLS_SVG_REPLACE[cls] + div.innerHTML
                    // }
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
