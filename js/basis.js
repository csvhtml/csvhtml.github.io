class clsLog {
    constructor() {
        this.logs= []
    }

    msg(msg) {
        this.logs.push(msg)
        console.log(msg)
    }
}

// ###############################################################################
// Basis   Text Functions                                                        #
// ###############################################################################


function RetStringBetween(text, fromStr, toStr = "", ignoreBlankAtBorders = false) {
    /**
     * Returns the String between two  strings.
     * "" / empty strings are interpreted as open end / take rest of string
     * strings not found in text are interpreted as "" / empty strings
     * 
     */

    var [idx1, idx2, len1, len2] = _RetIdxFromTextInString(text, fromStr, toStr, ignoreBlankAtBorders)

    if (idx2 > idx1) {
        return text.substring(idx1+len1, idx2);}
    else {
        return text.substring(idx1+len1)}
}

function RetStringOutside(text, fromStr, toStr) {
    /**
     * Returns the String except the text between two  strings.
     * "" / empty strings are interpreted as "remove rest of string"
     * strings not found in text are interpreted as "" / empty strings (=identical behaviour)
     * 
     */

    var [idx1, idx2, len1, len2] = _RetIdxFromTextInString(text, fromStr, toStr)

    // fromStr = "" and toStr was found at start:
    if (idx1 == 0 && idx2 == 0 && len2 >0) {
        return text.substring(idx2 + len2)
    }

    if (idx2 > idx1) {
        return text.substring(0, idx1) + text.substring(idx2 + len2)}
    else {
        return text.substring(0, idx1)}
}

function _RetIdxFromTextInString(text, strA, strB, ignoreBlankAtBorders){
    /**
     * Returns the indexes and length of the search string given
     * if a string was not found, returns (idx=0 and len=0) => identical behaviour as if search string was str = ""
     * if a string was found at start returns (idx = 0, len = <3>)
     * 
     */
    var idx1 = text.indexOf(strA);
    if (idx1 == -1) {strA=""; tmp1 = -1}   // if u dont find the string, act if it was an empty string
    idx1 = text.indexOf(strA);
    
    if (ignoreBlankAtBorders && text.indexOf(" " + strB)>-1) {
        strB = " " + strB
    }
    var idx2 = text.indexOf(strB, fromIndex = idx1);
    if (idx2 == -1) {strB=""; tmp2 = -1} // if u dont find the string, act if it was an empty string
    idx2 = text.indexOf(strB, fromIndex = idx1);
    l1 = strA.length
    l2 = strB.length
    return [idx1, idx2, l1, l2]
}

function FileNameFromPath(path) {
    let idxR1 = path.lastIndexOf("/")
    let idxR2 = path.lastIndexOf("\\")
    let idx = Math.max(idxR1, idxR2)

    return path.slice(idx+1)
}

function rgbText(a,b,c) {
    return "rgb(" + a + "," + b + "," + c + ")"
}

// ###############################################################################
// Basis   Text Functions                                                        #
// ###############################################################################

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
        ret.push(ele.replace(" ", ""))
    }

    return ret
}

function _byVal(data) {
    // Creates a hard copy of a list
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


// ################################################################
// Prototype extentions                                           #
// ################################################################

// from https://stackoverflow.com/questions/6120931/how-to-count-certain-elements-in-array
Object.defineProperties(Array.prototype, {
    count: {
        value: function(query) {
            /* 
               Counts number of occurrences of query in array, an integer >= 0 
               Uses the javascript == notion of equality.
            */
            var count = 0;
            for(let i=0; i<this.length; i++)
                if (this[i]==query)
                    count++;
            return count;
        }
    }
});


Object.defineProperties(Array.prototype, {
    remove: {
        value: function(element) {
            let idx = this.indexOf(element);
            return this.splice(idx, 1)
        }
    }
});


Object.defineProperties(Array.prototype, {
    toggle: {
        value: function(element) {
            if (this.includes(element)) {
                this.remove(element)}
            else {
                this.push(element)}
            }
        }
});

Object.defineProperties(Array.prototype, {
    pushX: {
        value: function(element) {
            if (!this.includes(element)) {
                this.push(element)}
            }
        }
});

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
