class clsLog {
    constructor() {
        this.logs= []
    }

    Add(msg) {
        if (LOGG) {
            this.logs.push(msg)
            console.log(msg)
        }
    }
}

function len(n) {
    return n.length
}

function range(n) {
    ret= []
    for (let i = 0; i <len(n); i++) {
        ret.push(i)
    }
    return ret
}

function dicct(keys, vals) {
    if (len(keys) != len(vals)) {
        return -1}
    ret = {}
    for (let i = 0; i < len(keys); i++)  {
        ret[keys[i]] = vals[i]
    }
    return ret
}

function _RemoveBlanksInList(liste) {
    let ret = []
    for (ele of liste) {
        ret.push(ele.replace(" ", "_"))
    }

    return ret
}

function _byVal(data) {
    // Creates a hard copy of a list (and list of lists)
    let ret = data
    if (Array.isArray(data)) {
        ret = []
        for (let element of data) {
            ret.push(_byVal(element))
        }
    }
    return ret
}

function IsEqualList(a,b) {
    if (!(Array.isArray(a) && Array.isArray(a))) {
        return false}
    if (!(a.length == b.length)) {
        return false}
    for (let i = 0; i< a.length; i++) {
        if (Array.isArray(a[i]) && Array.isArray(b[i])) {
            if (!(a[i].length == b[i].length)) {
                return false}
            for (let j = 0; j< a[i].length; j++) {
                if (a[i][j] != b[i][j]) {
                    return false}}
        } else {
            if (a[i] != b[i]) {
                return false}}
        }

    return true
}

function ValidChars(validChars, text) {
    for (char of text) {
        if (!validChars.includes(char)) {
            return false}
    }
    return true
}

// ################################################################
// Assert                                                         #
// ################################################################
ASSERT = true

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function assertIsList(elements, elementsName = "") {
    let message = ""
    if (elementsName == "") {
        message = "not of type list"
     } else {
        message = elementsName + " is not of type list"
    }
    if (!Array.isArray(elements)) {
        throw new Error(message);
    }
}


Object.defineProperties(DOMTokenList.prototype, {
    addX: {
        value: function(element) {
            if (!this.contains(element)) {
                this.add(element)}
            }
        }
});

Object.defineProperties(DOMTokenList.prototype, {
    removeX: {
        value: function(element) {
            if (this.contains(element)) {
                this.remove(element)}
            }
        }
});

// ################################################################
// Usefull DOM functions                                          #
// ################################################################

function ElemementsWithOnClickFunctions (mode="") {
    // let allElements = document.getElementsByTagName('*');
    let allElements = document.getElementsByTagName('*');
    let ret = []
    for ( var i = 0; i<allElements.length; i++ ) {
        if ( typeof allElements[i].onclick === 'function' ) {
            if (mode == "") {
                ret.push(allElements[i])}
            if (mode == "id") {
                assert(allElements[i].id != "")
                ret.push(allElements[i].id)}
            if (mode == "function") {
                ret.push(allElements[i].attributes['onclick'].value)}
        }
    }
    return ret
}

function ElemementsWithSubStringInID (fixx =  [], mode="") {
    // let allElements = document.getElementsByTagName('*');
    let allElements = document.getElementsByTagName('*');
    let ret = []
    for ( var i = 0; i<allElements.length; i++ ) {
        for (fix of fixx) {
            if (allElements[i].id.includes(fix)) {
                if (mode == "") {
                    ret.push(allElements[i])}
                if (mode == "id") {
                    assert(allElements[i].id != "")
                    ret.push(allElements[i].id)}
            }
        }
    }
    return ret
}


function ReturnParentUntilID (element, targetID = "", iterations = 10) {
    let parent = element
    for (i = 0; i<iterations; i++) {
        if (parent.tagName == "BODY") {
            assert(false)}
        if (parent.id == "") {
            parent = parent.parentElement
        } else {
            return parent}
    }
    assert(false)
}

function DivIsDescendantOf (element, targetID, iterations = 10) {
    let parent = element
    for (i = 0; i<iterations; i++) {
        if (parent.tagName == "BODY") {
            return false
        }
        if (parent.id == targetID) {
            return true
        } else if (parent.parentElement == undefined) {
            return false // if parents are not fully traced... you dont know
        } else {
            parent = parent.parentElement}
    }
    assert(false)
}


// ################################################################
// test                                                           #
// ################################################################
function test_Basis() {
    test_Basis_byVal()
    test_Basis_RetStringBetween()   
    test_Basis_FileNameFromPath()  

    return 0 // 32 assertions in this file (and should all be catched)
}

function test_Basis_byVal() {
    let fname = arguments.callee.name;
    liste = ["Super", "Mario", "Land"]
    listeA = _byVal(liste)
    listeB = liste

    liste[1] = "Sonic"
    testEqualList(listeA, ["Super", "Mario", "Land"], fname)
    testEqualList(listeB, ["Super", "Sonic", "Land"], fname)

    liste = ["Super", "Mario", "Land"]
    liste = [liste, liste, liste]
    listeA = _byVal(liste)
    listeB = liste

    liste[1][1] = "Sonic"
    testEqualList(listeA, [["Super", "Mario", "Land"], ["Super", "Mario", "Land"], ["Super", "Mario", "Land"]], fname)
    testEqualList(listeB, [["Super", "Sonic", "Land"], ["Super", "Sonic", "Land"], ["Super", "Sonic", "Land"]], fname)

    return 0
}

function test_Basis_RetStringBetween() {
    let fname = arguments.callee.name;
    text = "R:1029C:23H:header"

    testEqual(RetStringBetween(text, "R:", "C:"), "1029", fname)
    testEqual(RetStringBetween(text, "R:", ""), "1029C:23H:header", fname)
    testEqual(RetStringBetween(text, "H:", ""), "header", fname)
}

function test_Basis_FileNameFromPath() {
    let fname = arguments.callee.name;

    text = "file:///C:/A/B/World/FileName.pdf"
    testEqual(FileNameFromPath(text), "FileName.pdf", fname)
    text = "file:///C:/A/B/World\\FileName.pdf"
    testEqual(FileNameFromPath(text), "FileName.pdf", fname)
}


// ################################################################
// rest                                                           #
// ################################################################

function OpenHTTP(url) {
    window.open(url, "_blank");
    }
