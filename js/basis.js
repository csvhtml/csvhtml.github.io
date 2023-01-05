class clsLogger {
    constructor() {
        this.LogEntries = []
        this.active = false
        this.PushToConsole = true
    }

    Add(Logentry) {
        this.active = true
        this.LogEntries.push(Logentry)
        if (this.PushToConsole) {console.log("clsLOG: " + Logentry)}
    }

    Get(Idx = -1) {
        if (Idx == -1) {
            Idx = this.LogEntries.length-1
        }
        return this.LogEntries[Idx]
    }

    Length() {
        return this.LogEntries.length
    }

    IsActive() {
        return this.active
    }

    Deactivate() {
        this.active = false
    }
}


// ###############################################################################
// Basis                                                                         #
// ###############################################################################


function RetStringBetween(text, fromStr, toStr = "") {
    /**
     * Returns the String between two  strings.
     * "" / empty strings are interpreted as open end / take rest of string
     * strings not found in text are interpreted as "" / empty strings
     * 
     */
    // var idx1 = text.indexOf(fromStr);
    // if (idx1 == -1) {fromStr=""}
    // idx1 = text.indexOf(fromStr);
    // var idx2 = text.indexOf(toStr, fromIndex = idx1);
    // if (idx2 == -1) {toStr=""}
    // var idx2 = text.indexOf(toStr, fromIndex = idx1);

    var [idx1, idx2, len1, len2] = _RetIdxFromTextInString(text, fromStr, toStr)

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

function _RetIdxFromTextInString(text, strA, strB){
    /**
     * Returns the indexes and length of the search string given
     * if a string was not found, returns (idx=0 and len=0) => identical behaviour as if search string was str = ""
     * if a string was found at start returns (idx = 0, len = <3>)
     * 
     */

    var idx1 = text.indexOf(strA);
    if (idx1 == -1) {strA=""; tmp1 = -1}   // if u dont find the string, act if it was an empty string
    idx1 = text.indexOf(strA);
    var idx2 = text.indexOf(strB, fromIndex = idx1);
    if (idx2 == -1) {strB=""; tmp2 = -1} // if u dont find the string, act if it was an empty string
    idx2 = text.indexOf(strB, fromIndex = idx1);
    l1 = strA.length
    l2 = strB.length
    return [idx1, idx2, l1, l2]
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

function _byVal(data) {
    let ret = data
    if (Array.isArray(data)) {
        ret = []
        for (let element of data) {
            ret.push(_byVal(element))
        }
    }
    return ret
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

// ################################################################
// List / Array functions                                         #
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

// ################################################################
// Usefull DOM functions                                          #
// ################################################################

function ReturnAllElemementsWithOnClickFunctions (mode="") {
    // let allElements = document.getElementsByTagName('*');
    let allElements = document.getElementsByTagName('a');
    let ret = []
    for ( var i = 0; i<allElements.length; i++ ) {
        if ( typeof allElements[i].onclick === 'function' ) {
            if (mode = "") {ret.push(allElements[i])}
            if (mode = "id") {ret.push(allElements[i].id)}
            
        }
    }
    return ret
}

function ReturnParentIfTag (element, tag = "A", iterations = 3) {
    let ret = ""
    let parent = element
    for (i = 0; i<iterations; i++) {
        if (parent.tagName == tag) {
            return parent
        } else {
            parent = parent.parentElement}
        }
}


// ################################################################
// test                                                           #
// ################################################################

function test_clsData_1x1__byVal() {
    let fname = arguments.callee.name;
    liste = ["Super", "Mario", "Land"]
    listeA = _byVal(liste)
    listeB = liste

    liste[1] = "Sonic"
    assertEqualList(listeA, ["Super", "Mario", "Land"], fname)
    assertEqualList(listeB, ["Super", "Sonic", "Land"], fname)

    liste = ["Super", "Mario", "Land"]
    liste = [liste, liste, liste]
    listeA = _byVal(liste)
    listeB = liste

    liste[1][1] = "Sonic"
    assertEqualList(listeA, [["Super", "Mario", "Land"], ["Super", "Mario", "Land"], ["Super", "Mario", "Land"]], fname)
    assertEqualList(listeB, [["Super", "Sonic", "Land"], ["Super", "Sonic", "Land"], ["Super", "Sonic", "Land"]], fname)
}