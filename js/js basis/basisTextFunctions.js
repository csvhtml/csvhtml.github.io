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

function myReplace(val,re,place) {
    let value = val
    if (value.includes(re)) {
        value = value.replace(new RegExp(re, "g") , place)
    }
    return value
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
    assert(false)
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

// ################################################################
// test                                                           #
// ################################################################

function test_TextFunctions() {
    test_Basis_RetStringBetween()   
    test_Basis_FileNameFromPath() 
    test_Basis_myReplace() 
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

function test_Basis_myReplace() {
    let fname = arguments.callee.name;

    textRe = "Lorem Ipsum Apsum Ma"
    textPLACE = "Lorem IpSum ApSum Ma"
    testEqual(myReplace(textRe, "s", "S"), textPLACE, fname)
}

