ETY = ".."   // default value for empty cells/headers

class clsData_1x1 {
    constructor(headers=[], data=[]) {
        assert(Array.isArray(headers), "headers is not of type array/list")
        assert(Array.isArray(data), "data is not of type array/list")
        for (let datum of data) {
            assert(Array.isArray(datum), "at least on data row is not of type array/list")
        }
        this.headersConfig =  []
        this.headers =  []
        this.Init_Headers(headers)
        this.data =  []
        for (let row of data) {
            let nextrow = []
            for (let cell of row) {
                nextrow.push(cell)
            }
            this.data.push(nextrow)
        }
        this.len = this.data.length
    }

    Init_Headers(headers) {
        this.headersConfig =  []
        this.headers =  []
        for (let header of headers) {
            if (header.includes("[") && header.includes("]")) {
                let headerName = RetStringBetween(header, "", "[", true)
                let headerConfig = RetStringBetween(header, "[", "]")
                this.headers.push(headerName)
                this.headersConfig.push(headerConfig)
            } else {
                this.headers.push(header)
                this.headersConfig.push("")
            }
        }
    }

    AddRow(atPosition = -1, newRow = []) {
        assert(atPosition > -2, "atPosition index below -1")
        assert(atPosition < this.len+1, "atPosition above data length")

        if (newRow.length == 0) {
            for (let header of this.headers) {
                newRow.push(ETY)}
        } else {
            assert(newRow.length == this.headers.length, "values length not equal to data length")}

        if (atPosition == -1) {
            this.data.push(newRow)
        } else {
            this.data.splice(atPosition, 0, newRow)
        }
        this.len += 1
    }

    RemoveRow(row = -1) {
        assert(row > -2, "row index below -1")
        assert(row < this.len+1, "row above data length")

        if (row == -1) {
            this.data.pop()
        } else {
            this.data.splice(row, 1)
        }
        this.len -=1
    }

    AddCol(header = "", atPosition = -1, values = []) {
        assert(!this.headers.includes(header), "header already exists")
        assert(atPosition > -2, "atPosition index below -1")
        assert(atPosition < this.headers.length, "atPosition index above headers length")

        if (header == "") {header = ETY}
        if (values.length == 0) {
            for (let i = 0; i < this.len; i++) {
                values.push(ETY)}
        } else {
            if (this.len != 0) {
                assert(values.length == this.len, "values length not equal to data length")}}
            
        if (atPosition == -1) {
            this.headers.push(header)
            if (this.len == 0) {
                for (let i = 0; i < values.length; i++) {
                    let row = [_byVal(values[i])]
                    this.data.push(row)
                this.len +=1 }
            } else {
                for (let i = 0; i < this.data.length; i++) {
                    this.data[i].push(values[i])}}

        } else {
            assert(false)
        }
    }

    RemoveCol(col = -1, colName = "") {
        assert (Number.isInteger(col), "col is not an integer")
        assert(col> -2, "col index below -1")
        assert(col < this.headers.length, "col index above headers length")
        assert(!(col != -1 && colName != ""), "col and colName are both defined. Define only one")
        
        if (col == -1 && colName == "") {
            col = this.headers.length-1
        }
        if (col == -1 && colName != "") {
            col = this.headers.indexOf(colName)
        }

        this.headers.splice(col, 1)

        for (let i = 0; i < this.data.length; i++) {
            this.data[i].splice(col,1)
        }

    }

    Subset({cols = [], valueEquals = {}, valueIncludes = {}}) {
        assert(Array.isArray(cols), "headers is not of type list")
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

        if (cols.length == 0) {cols = this.headers}

        let ret = new clsData_1x1(); let flag = true
        for (let col of cols) {
            ret.AddCol(col, -1, this.ColAsList(col))
        }
        for (let key of Object.keys(valueEquals)) {
            let j = ret.headers.indexOf(key)
            for (let i = ret.len-1; i > -1; i-- ) {
                flag = true
                for (let val of valueEquals[key]) {
                    if (val === ret.data[i][j]) {
                        flag = false
                        break
                    }
                }
                if (flag && valueEquals[key].length >0) {ret.RemoveRow(i)}
            }   
        }
        for (let key of Object.keys(valueIncludes)) {
            let j = ret.headers.indexOf(key)
            for (let i = ret.len-1; i > -1; i-- ) {
                for (let val of valueIncludes[key]) {
                    if (ret.data[i][j].indexOf(val) == -1) {
                        ret.RemoveRow(i)
                        break
                    }
                }
            }     
        }
        return ret
    }

    IsColsSubset(cols) {
        for (let col of cols) {
            if (!this.headers.includes(col)) {
                return false}
        }
        return true
    }

    ColAsList(colName) {
        assert(typeof colName === 'string', colName + " is not of type string")
        assert(this.headers.indexOf(colName)>-1, colName + " not in headers")
        let ret = []
        let idx = this.headers.indexOf(colName)
        for (let i = 0; i<this.len;i++) {
            ret.push(_byVal(this.data[i][idx]))
        }
        return ret
    }

    RenameCol(old, neww) {
        assert(this.headers.includes(old), old + " is not in headers")

        this.headers[this.headers.indexOf(old)] = neww
    }

    HeaderIndex(headerName) { // test
        assert(this.headers.includes(headerName), headerName + " is not in headers")

        return this.headers.indexOf(headerName)
    }

    HeaderValue(headerName) { // test
        assert(this.headers.includes(headerName), headerName + " is not in headers")
        let idx = this.HeaderIndex(headerName)
        let ret = ""
        if (this.headersConfig[idx] == "") {
            ret = this.headers[idx]
        } else {
            ret = this.headers[idx] + ' [' + this.headersConfig[idx] + ']'} 
    
        return ret
    }
}



// ################################################################
// test                                                           #
// ################################################################
function test_clsData_1x1() {
    test_clsData_1x1_Init()
    test_clsData_1x1_AddRow()
    test_clsData_1x1_RemoveRow()
    test_clsData_1x1_AddCol()
    test_clsData_1x1_RemoveCol()
    test_clsData_1x1_ColAsList()
    test_clsData_1x1_Subset()
    test_clsData_1x1__byVal()
    test_clsData_1x1_RenameCol()

    return 25 // 25 assertions in this file (and should all be catched)
}


function test_clsData_1x1_Init() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A"], [["Hallo"], ["Welt"]])

    assertEqualList(datta.headers,["A"], fname)
    assertEqualList(datta.data[0],["Hallo"], fname)
    assertEqualList(datta.data[1],["Welt"], fname)

    datta2 = new clsData_1x1(datta.headers, datta.data)
    datta.headers[0] = "Z"          // This should have no effect.
    datta.data[0] = ["Mario"]       // Datta2 is a complete new data set. No reference
    assertEqualList(datta2.headers,["A"], fname)
    assertEqualList(datta2.data[0],["Hallo"], fname)
    assertEqualList(datta2.data[1],["Welt"], fname)

    datta3 = new clsData_1x1(["A", "B [config]"], [["Hallo", "Welt"], ["Super", "Mario"]])
    assertEqualList(datta3.headers,["A", "B"], fname)
    assertEqualList(datta3.headersConfig,["", "config"], fname)

    // test assertions
    assertCalls = [
        {"a": "B", "ermg": "headers is not of type array/list"},
        {"a": ["B"], "b": "Hallo", "ermg": "data is not of type array/list"},
        {"a": ["B"], "b": ["Hallo"], "ermg": "at least on data row is not of type array/list"},
        
    ]
    var foo = function (a,b,c,d) {new clsData_1x1(a,b,c,d)}
    assertAssertions(foo, assertCalls)
}

function test_clsData_1x1_AddCol() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1()
    datta.AddCol("B", -1, ["Meine", "da drausen"])
    assertEqualList(datta.headers,["B"], fname)
    assertEqualList(datta.headers,["B"], fname)
    assertEqualList(datta.data[0],["Meine"], fname)
    assertEqualList(datta.data[1],["da drausen"], fname)

    datta = new clsData_1x1(["A"], [["Hallo"], ["Welt"]])
    datta.AddCol("B", -1, ["Meine", "da drausen"])
    assertEqualList(datta.headers,["A", "B"], fname)
    assertEqualList(datta.data[0],["Hallo", "Meine"], fname)
    assertEqualList(datta.data[1],["Welt", "da drausen"], fname)

    // test assertions
    assertCalls = [
        {"a": "B", "b": -1, "c":  ["Meine", "da drausen"], "ermg": "header already exists"},
        {"a": "C", "b": -2, "c":  ["Meine", "da drausen"], "ermg": "atPosition index below -1"},
        {"a": "D", "b": 5, "c":  ["Meine", "da drausen"], "ermg": "atPosition index above headers length"},
        {"a": "E", "b": -1, "c":  ["Meine", "da drausen", "ist schoen"], "ermg": "values length not equal to data length"},
        
    ]
    var foo = function (a,b,c) {datta.AddCol(a,b,c)}
    assertAssertions(foo, assertCalls)
}

function test_clsData_1x1_AddRow() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A"], [["Hallo"], ["Welt"]])
    datta.AddRow()
    assertEqual(datta.len, 3, fname)
    assertEqualList(datta.data,[["Hallo"], ["Welt"], [".."]], fname)
    datta = new clsData_1x1(["A", "B"], [["Hallo", "Welt"], ["Super", "Mario"]])
    datta.AddRow()
    assertEqual(datta.len, 3, fname)
    assertEqualList(datta.data,[["Hallo", "Welt"], ["Super", "Mario"], ["..", ".."]], fname)
    datta.AddRow(1)
    assertEqual(datta.len, 4, fname)
    assertEqualList(datta.data,[["Hallo", "Welt"], ["..", ".."], ["Super", "Mario"], ["..", ".."]], fname)
    datta.AddRow(4, ["Munich", "Oktoberfest"])
    assertEqual(datta.len, 5, fname)
    assertEqualList(datta.data,[["Hallo", "Welt"], ["..", ".."], ["Super", "Mario"], ["..", ".."], ["Munich", "Oktoberfest"]], fname)

    // test assertions
    assertCalls = [
        {"a": -1, "b":  ["Super", "Mario", "Land"], "ermg": "values length not equal to data length"},
        {"a": -2, "b":  ["Super", "Mario"], "ermg": "atPosition index below -1"},
        {"a": 6, "b":  ["Super", "Mario"], "ermg": "atPosition above data length"},
    ]
    var foo = function (a,b) {datta.AddRow(a,b)}
    assertAssertions(foo, assertCalls)
}

function test_clsData_1x1_RemoveRow() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A", "B"], [["Hallo", "Welt"], ["Super", "Mario"], ["Munich", "Oktoberfest"]])
    datta.RemoveRow()
    assertEqualList(datta.data,[["Hallo", "Welt"], ["Super", "Mario"]], fname)
    assertEqual(datta.len, 2, fname)

    datta = new clsData_1x1(["A", "B"], [["Hallo", "Welt"], ["Super", "Mario"], ["Munich", "Oktoberfest"]])
    datta.RemoveRow(0)
    assertEqualList(datta.data,[["Super", "Mario"], ["Munich", "Oktoberfest"]], fname)
    assertEqual(datta.len, 2, fname)

    // test assertions
    assertCalls = [
        {"a": -2,  "ermg": "row index below -1"},
        {"a": 5,  "ermg": "row above data length"}
    ]
    var foo = function (a,b) {datta.RemoveRow(a,b)}
    assertAssertions(foo, assertCalls)
}

function test_clsData_1x1_RemoveCol() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta.RemoveCol()
    assertEqualList(datta.headers, ["A", "B"], fname)
    assertEqualList(datta.data,[["Hallo", "Welt"], ["Super", "Mario"], ["Munich", "Oktoberfest"]], fname)

    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta.RemoveCol(1)
    assertEqualList(datta.headers, ["A", "C"], fname)
    assertEqualList(datta.data,[["Hallo", "drausen"], ["Super", "Land"], ["Munich", "Beer"]], fname)

    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta.RemoveCol(-1, "A")
    assertEqualList(datta.headers, ["B", "C"], fname)
    assertEqualList(datta.data,[["Welt", "drausen"], ["Mario", "Land"], ["Oktoberfest", "Beer"]], fname)

    // test assertions
    assertCalls = [
        {"a": -2, "ermg": "col index below -1"},
        {"a": 5, "ermg": "col index above headers length"},
        {"a": "col", "ermg": "col is not an integer"},
        {"a": 1, "b": "B", "ermg": "col and colName are both defined. Define only one"},
    ]
    var foo = function (a,b) {datta.RemoveCol(a,b)}
    assertAssertions(foo, assertCalls)
}

function test_clsData_1x1_Subset() {
    let fname = arguments.callee.name;
    let datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    let datta2 = datta.Subset({cols:["A", "C"]})
    assertEqualList(datta2.headers, ["A", "C"], fname)
    assertEqualList(datta2.data,[["Hallo", "drausen"], ["Super", "Land"], ["Munich", "Beer"]], fname)

    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"], ["Hallo", "Oktoberfest", "Beer"], ["Bye", "Oktoberfest", "Beer"]])
    let valEq = {"A": ["Hallo"]} 
    datta2 = datta.Subset({valueEquals: valEq})
    assertEqualList(datta2.headers, ["A", "B", "C"], fname)
    assertEqualList(datta2.data,[["Hallo", "Welt 12 Y", "drausen"], ["Hallo", "Oktoberfest", "Beer"]], fname)
    assertEqual(datta2.len, 2, fname)

    valEq = {"A": ["Hallo", "Super"]} 
    datta2 = datta.Subset({valueEquals: valEq})
    assertEqualList(datta2.headers, ["A", "B", "C"], fname)
    assertEqualList(datta2.data,[["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"], ["Hallo", "Oktoberfest", "Beer"]], fname)
    assertEqual(datta2.len, 3, fname)

    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"], ["Hallo", "Oktoberfest", "Beer"]])
    let valIn = {"B": ["12"]} 
    datta2 = datta.Subset({valueIncludes: valIn})
    assertEqualList(datta2.headers, ["A", "B", "C"], fname)
    assertEqualList(datta2.data,[["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"]], fname)
    assertEqual(datta2.len, 2, fname)

    valEq = {"A": ["Hallo"]};valIn = {"B": ["12"]} 
    datta2 = datta.Subset({valueEquals: valEq, valueIncludes: valIn})
    assertEqualList(datta2.headers, ["A", "B", "C"], fname)
    assertEqualList(datta2.data,[["Hallo", "Welt 12 Y", "drausen"]], fname)
    assertEqual(datta2.len, 1, fname)

    // test assertions
    assertCalls = [
        {"a": {cols: 1}, "ermg": "headers is not of type list"},
        {"a": {valueEquals: 1}, "ermg": "valueEquals is not of type object"},
        {"a": {valueEquals: {"Z": 1}}, "ermg": "valueEquals element Z not in headers"},
        {"a": {valueEquals: {"B": 1}}, "ermg": "valueEquals element B is not of type list"},
        {"a": {valueIncludes: 1}, "ermg": "valueIncludes is not of type object"},
        {"a": {valueIncludes: {"Z": 1}}, "ermg": "valueIncludes element Z not in headers"},
        {"a": {valueIncludes: {"B": 1}}, "ermg": "valueIncludes element B is not of type list"},
    ]
    var foo = function (a,b) {datta.Subset(a)}
    assertAssertions(foo, assertCalls)

}

function test_clsData_1x1_ColAsList() {
    let fname = arguments.callee.name;
    let datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    let values = datta.ColAsList("A")
    assertEqualList(values, ["Hallo", "Super", "Munich"], fname)
    assertEqual(datta.IsColsSubset(["B", "C"]), true, fname)
    assertEqual(datta.IsColsSubset(["B", "D"]), false, fname)

    // test assertions
        assertCalls = [
            {"a": 1, "ermg": "1 is not of type string"},
            {"a": "D", "ermg": "D not in headers"},
        ]
        var foo = function (a,b) {datta.ColAsList(a)}
        assertAssertions(foo, assertCalls)
}

function test_clsData_1x1_RenameCol() {
    let fname = arguments.callee.name;
    let datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta.RenameCol("A", "XYZ")
    assertEqualList(datta.headers, ["XYZ", "B", "C"], fname)

    // test assertions
        assertCalls = [
            {"a": "X", b: "A", "ermg": "X is not in headers"},
        ]
        var foo = function (a,b) {datta.RenameCol(a)}
        assertAssertions(foo, assertCalls)
}

