// ################################################################
// Log                                                            #
// ################################################################

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

// ################################################################
// Assert                                                         #
// ################################################################

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}


// ################################################################
// Useful functions                                               #
// ################################################################

function _RemoveBlanksInList(liste) {
    let ret = []
    for (ele of liste) {
        ret.push(ele.replace(" ", "_"))
    }

    return ret
}

function _byVal(data) {
    if ( ["bool", "str", "int"].indexOf(typOf(data)) >-1) {
        return data}

    if (typOf(data) == "list") {
        let ret = []
        for (let element of data) {
            ret.push(_byVal(element))}
        return ret}
    
    if (typOf(data) == "dict") { 
        let ret = { }
        let keys= Object.keys(data)
        for (key of keys) {
            ret[key] = _byVal(data[key])}
        return ret}

    return data
}

function ValidChars(validChars, text) {
    for (char of text) {
        if (!validChars.includes(char)) {
            return false}
    }
    return true
}

function typOf(variable) {
    if (Array.isArray(variable)) {
        return 'list'} // javascript 'Array'
    if (typeof variable === 'object' && variable !== null) {
        return 'dict'} // javascript 'Object'
    if (typeof variable === 'string') {
        return 'str'}
    if (typeof variable === 'number') {
        return 'int'}
    if (typeof variable === 'boolean') {
        return 'bool'}
    assert(false, String(variable))
}

function IsEqual(a,b, max_iterations = 100) {
    if (max_iterations<1) {
        return false}
    if (typOf(a)!=typOf(b)) {
        return false}

    if (typOf(a) == "bool") {
        if (a == b) {
            return true}
        return false}

    if (typOf(a) == "int") {
        if (a == b) {
            return true}
        return false}

    if (typOf(a) == "str") {
        if (a == b) {
            return true}
        return false}

    if (typOf(a) == "list") {
        if (!(a.length == b.length)) {
            return false}
        for (let i = 0; i< a.length; i++) {
            if (IsEqual(a[i], b[i], max_iterations-1) == false) {
                return false}
        }
        return true
    }

    if (typOf(a) == "dict") {
        let keysA = Object.keys(a)
        let keysB= Object.keys(b)
        if (keysA.length !== keysB.length) {
            return false}
        for (let key of keysA) {
            if (!b.hasOwnProperty(key)) {
                return false}
        }
        for (let key of keysA) {
            if (IsEqual(a[key], b[key], max_iterations-1) == false) {
                return false}
        }
        return true
    }
    return false
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
    test_Basis_typOf()
    test_Basis_IsEqual() 
    return 0 // 32 assertions in this file (and should all be catched)
}

function test_Basis_IsEqual() {
    let fname = arguments.callee.name;
    
    let test = [
        [true, true, true],
        [false, false, true],
        [false, true, false],
        [true, false, false],
        [1, 1, true],
        [1, 2, false],
        [1, "1", false],
        ["1", "1", true],
        ["Hello", "Hello", true],
        ["Hello", "World", false],
        [[1,2,3], [1,2], false],
        [[1,2,3], [1,7,3], false],
        [[1,2,3], [1,2,3], true],
        [{"A": "Hallo", "B":"Welt"}, {"A": "Hallo", "B":"Welt"}, true],
        [{"A": "Hallo", "B":"Welt"}, {"A": "Hallo"}, false],
        [{"A": "Hallo", "B":"Welt"}, {"A": "Hallo", "C":"Welt"}, false],
        [{"A": "Hallo", "B":"Welt"}, {"A": "Hallo", "B":"World"}, false],
        [{"A": "Hallo", "B":[1,2,3]}, {"A": "Hallo", "B":[1,2,3]}, true],
        [{"A": "Hallo", "B":[1,2,3]}, {"A": "Hallo", "B":[1,2,4]}, false],
        [{"A": "Hallo", "B":{"X":[1,2,3], "Y": [4,5]}}, {"A": "Hallo", "B":{"X":[1,2,3], "Y": [4,5]}}, true],
        [{"A": "Hallo", "B":{"X":[1,2,3], "Y": [4,5]}}, {"A": "Hallo", "B":{"X":[1,2,3], "Y": [44,5]}}, false],
    ]

    for (let t of test) {
        testEqual(IsEqual(t[0], t[1]), t[2],fname)}

    let test1 = [
        [[[1,1],2,3],[1,2,3],[1,2,3]],
        [[1,2,3],[1,2,3],[1,2,3]],
    ]
    let test2 = [
        [[[1,1],2,3],[1,2,3],[1,2,3]],
        [[1,2,3],[1,2,3],[1,2,3]],
    ]
    let max_iterations = 4

    testEqual(IsEqual(test1, test2, max_iterations), false, fname)
}

function test_Basis_typOf() {
    let fname = arguments.callee.name;
    
    let test = [
        [[1, 2, 3],'list'],
        [{ key: 'value' },'dict'],
        ['Hello, World!','str'],
        [42,'int'],
        [true,'bool'],
    ]

    for (let t of test) {
        testEqual(typOf(t[0]), t[1], fname)}
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


    dicct = {"A": ["Super", "Mario", "Land"], "B":[1,2,3]}
    dicctA = _byVal(dicct)
    dicctB = dicct

    dicct["A"] = "Wolf"
    testEqualDict(dicctA, {"A": ["Super", "Mario", "Land"], "B": [1,2,3]}, fname)
    testEqualDict(dicctB, {"A": "Wolf", "B": [1,2,3]}, fname)
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
