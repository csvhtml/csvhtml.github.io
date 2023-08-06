// ################################################################
// class CSV Filter                                               #
// ################################################################

class clsCSV_DataFilter {
    constructor(headers, data) {
        this.headers = headers
        this.data = data
    }

    Subset({valueEquals = {}, valueIncludes = {}}) {
        return this.xSubset({valueEquals : valueEquals, valueIncludes : valueIncludes})
    }

    xSubset({valueEquals = {}, valueIncludes = {}}) {
        // let valueEquals = {"header A": ["Hallo"]} 
        // let valueIncludes = {"header B": ["Welt"]} 
        // Assertions
        assert(typeof valueEquals === 'object', "valueEquals is not of type object")
        for (let key of Object.keys(valueEquals)) {
            assert(this.headers.indexOf(key) >-1, "valueEquals element " + key + " not in headers")
            assert(Array.isArray(valueEquals[key]), "valueEquals element " + key + " is not of type list")
        }
        assert(typeof valueIncludes === 'object', "valueIncludes is not of type object")
        for (let key of Object.keys(valueIncludes)) {
            assert(this.headers.indexOf(key) >-1, "valueIncludes element " + key + " not in headers")
            assert(Array.isArray(valueIncludes[key]), "valueIncludes element " + key + " is not of type list")
        }

        // Build subset. 1) Subset of Cols 2) ubset of equals 3) Subset of includes
        let dataCopy = _byVal(this.data)
        dataCopy = this._Subset_Function(dataCopy, valueEquals, "Equals")
        dataCopy = this._Subset_Function(dataCopy, valueIncludes, "Includes")
        return dataCopy

    }

    _Subset_Function(dataCopy, valueEqualsIncludes, Inc_Eq) {
        // let valueEqualsIncludes = {"header A": ["Hallo", ...]} 
        let flag = true
        for (let key of Object.keys(valueEqualsIncludes)) {
            dataCopy = this._Subset_Key(key, valueEqualsIncludes[key], dataCopy, Inc_Eq)
        }
        return dataCopy
    }

    _Subset_Key(key, vals, dataCopy, Inc_Eq) {
        let ret = []; let flag = false
        let j = this.headers.indexOf(key)
        for (let i = 0; i< dataCopy.length; i++) {
            for (let val of vals) {
                if (this._Subset_Key_CheckCondition(dataCopy[i][j], val, Inc_Eq)) {
                    flag = true
                    break
                }
            }
            if (flag) {ret.push(_byVal(dataCopy[i]));flag = false}
        }
        return ret
    }

    _Subset_Key_CheckCondition(istVal, checkVal, Inc_Eq) {
        if (Inc_Eq == "Equals" && istVal == checkVal) {
            return true}
        if (Inc_Eq == "Includes" && istVal.indexOf(checkVal)>-1) {
            return true}
        return false
    }

}

// ################################################################
// test                                                           #
// ################################################################
function test_clsCSV_DataFilter() {

    test_clsCSV_DataFilter_Subset_Equals()
    test_clsCSV_DataFilter_Subset_Includes()
    test_clsCSV_DataFilter_Subset()


    return 0
}

function test_clsCSV_DataFilter_Subset() {
    let fname = arguments.callee.name;
    datta = new clsCSV_DataFilter(["A", "B", "C"], [["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"], ["Hallo", "Oktoberfest", "Beer"]])
    
    let valEq = {"A": ["Hallo"]}
    let valIn = {"B": ["12"]} 
    datta2 = datta.Subset({valueEquals: valEq, valueIncludes: valIn})
    testEqualList(datta2,[["Hallo", "Welt 12 Y", "drausen"]], fname)
    

    // test assertions
    assertCalls = [
        {"a": {valueEquals: 1}, "ermg": "valueEquals is not of type object"},
        {"a": {valueEquals: {"Z": 1}}, "ermg": "valueEquals element Z not in headers"},
        {"a": {valueEquals: {"B": 1}}, "ermg": "valueEquals element B is not of type list"},
        {"a": {valueIncludes: 1}, "ermg": "valueIncludes is not of type object"},
        {"a": {valueIncludes: {"Z": 1}}, "ermg": "valueIncludes element Z not in headers"},
        {"a": {valueIncludes: {"B": 1}}, "ermg": "valueIncludes element B is not of type list"},
    ]
    var foo = function (a,b) {datta.Subset(a)}
    testAssertions(foo, assertCalls)

}

function test_clsCSV_DataFilter_Subset_Equals() {
    let fname = arguments.callee.name;
    datta = new clsCSV_DataFilter(["A", "B", "C"], [["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"], ["Hallo", "Oktoberfest", "Beer"], ["Bye", "Oktoberfest", "Beer"]])
    let valEq = {"A": ["Hallo"]} 
    datta2 = datta.Subset({valueEquals: valEq})
    testEqualList(datta2,[["Hallo", "Welt 12 Y", "drausen"], ["Hallo", "Oktoberfest", "Beer"]], fname)

    valEq = {"A": ["Hallo", "Super"]} 
    datta2 = datta.Subset({valueEquals: valEq})
    testEqualList(datta2,[["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"], ["Hallo", "Oktoberfest", "Beer"]], fname)
}

function test_clsCSV_DataFilter_Subset_Includes() {
    let fname = arguments.callee.name;
    datta = new clsCSV_DataFilter(["A", "B", "C"], [["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"], ["Hallo", "Oktoberfest", "Beer"]])
    let valIn = {"B": ["12"]} 
    datta2 = datta.Subset({valueIncludes: valIn})
    testEqualList(datta2,[["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"]], fname)
}