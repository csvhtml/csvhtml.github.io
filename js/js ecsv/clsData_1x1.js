// Reserved colls with certain functionality automaticaly applied
CLS_DATA_1X1_RESERVED_COLS ={ // in case key is negative, then index is not specified
    0: "No."
}

CLS_DATA_1X1_AUTOFILL_COL_NO = true

ETY = ".."

class clsData_1x1 {
    constructor(parent, headers=[], data=[]) {
        assert(Array.isArray(headers), "headers is not of type array/list")
        assert(Array.isArray(data), "data is not of type array/list")
        for (let datum of data) {
            assert(Array.isArray(datum), "at least on data row is not of type array/list")
        }
        this.parent = parent
        this.headers =  []
        this.data = [[]]
        this.len = 0
        
        this.Init_Headers(headers)
        // this.Init_Data(data)
        if (this.headers.length >0) {
            this.Init_Data(data)}
        
    }

    Init_Headers(headers) {
        this.xInit_Headers(headers)
    }

    Init_Data(dataRows, delimiter) {
        this.xInit_Data(dataRows, delimiter)
    }

    AddRow(atPosition = -1, newRow = []) {
        this.xAddRow(atPosition, newRow)}

    AddCol(header = "", atPosition = -1, values = []) {
        this.xAddCol(header, atPosition, values)}

    Headers() {
        return this.headers
    }

    HeadersConfig(headerName = null) { 
        return this.xHeadersConfig(headerName)
    }

    HeadersRaw(headerName = null) {
        return this.xHeadersRaw(headerName)
    }

    Data(cols = []) {
        return this.xData(cols)
    }

    ColAsList(col) {
        let idx = this.headers.indexOf(col); assert(idx>-1)
        let ret = []
        for (row of data) {
            ret.push(_byVal(row[idx]))
        }
        return ret
    }

    DefaultCol() {
        let ret = []
        for (let i = 0; i < this.len; i++) {
            ret.push(this._DefaultVal(header, i))}
    }

    DefaultRow(atPosition = -1) {
        let no = 0
        let ret = []
        if (atPosition = -1) {
            no = 0}
        
        for (let col of this.headers) {
            ret.push(this._DefaultVal(col))
        }
        return ret
    }

    _DefaultVal(col, n = 0) {
        if (this._ColIsNumber(col)) {
            return String(n+1)}
        if (this._ColIsFilter(this.parent.config2.HeaderConfig(col))) {
            return "[]"}
        return ".."
    }
    
    _ColIsNumber(col) {
        if (CLSCSV_GETTER["colTypeIdentifier"]["number"].indexOf(col)>-1) {
            return true}
        return false
    }

    _ColIsFilter(colConfig) {
        assert(typOf(colConfig) == 'list')
        let thisConfig = []
        for (let config of CLSCSV_GETTER["colTypeIdentifier"]["filter"]) {
            thisConfig.push(RetStringBetween(config, "[", "]"))
        }

        for (let config of colConfig) {
            if (thisConfig.indexOf(config) >-1){
                return true}
        }
        return false
    }
    

    xInit_Headers(headers) {
        // this.parent.config.Get_Config_From_Headers()
        // this.headersConfig =  []
        this.headers =  []
        for (let header of headers) {
            this.headers.push(this._headerNamePure(header))
            // this.headersConfig.push(this._headerConfigPure(header))
        }
    }


    xInit_Data(dataRows, delimiter=";") {
        this._xInit_Data_assert(dataRows)

        if (IsEqual(dataRows, [[]])) {
            dataRows = [[]]
            return}

        if (IsEqual(dataRows, [])) {
            dataRows = [this.DefaultRow()]
        }

        let dataN = this.headers.length
        
        this.len = 0
        this.data = []
        let tmp = []
        for (let row of dataRows) {
            if (Array.isArray(row)) {
                tmp = row
            } else {
                tmp = row.split(delimiter)
                }
            assert(tmp.length == dataN, tmp[0])
            this.data.push(tmp)
            this.len +=1
        }
    }
    _xInit_Data_assert(dataRows) {
        if (this.headers.length == 0)  {
            let a = 1
        }
    }


    xAddRow(atPosition = -1, newRow = []) {
        this._xAddRow_assert(atPosition, newRow)

        if (newRow.length == 0) {
            newRow = this.DefaultRow(atPosition)}

        if (atPosition == -1) {
            this.data.push(newRow)} 
        else {
            this.data.splice(atPosition, 0, newRow)}
            
        this.len += 1
        this._UpdateNumberCol()
    }
    _xAddRow_assert(atPosition, newRow) {
        assert(atPosition > -2, "atPosition index below -1")
        assert(atPosition < this.len+1, "atPosition above data length")
        if (newRow.length > 0) {
            assert(newRow.length == this.headers.length, "values length not equal to data length")}
    }

    AddRowDict(atPosition = -1, newRowDict = {}) {
        assert(atPosition > -2, "atPosition index below -1")
        assert(atPosition < this.len+1, "atPosition above data length")

        let newRow = []
        if (Object.keys(newRowDict).length === 0) {
            for (let header of this.headers) {
                newRow.push(ETY)}
        } else {
            let Keys = Object.keys(newRowDict)
            for (let header of this.headers) {
                if (Keys.includes(header)) {
                    newRow.push(newRowDict[header])}
                else {
                    newRow.push(ETY)}
                }
            }
        assert(newRow.length == this.headers.length, "values length not equal to data length")

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

    xAddCol(header, atPosition = -1, values = []) {
        this._xAddCol_assert(header, atPosition, values)

        if (values.length == 0) {
            values = this.DefaultCol()}

        if (atPosition == -1) {
            this.headers.push(this._headerNamePure(header))
            // this.headersConfig.push(this._headerConfigPure(header))
            this.parent.config2.Add(header)
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
    _xAddCol_assert(header, atPosition, values) {
        assert(!this.headers.includes(header), "header already exists")
        assert(atPosition > -2, "atPosition index below -1")
        assert(atPosition < this.headers.length, "atPosition index above headers length")
        if (values.length > 0 && this.len > 0 ) {
            assert(values.length == this.len, "values length not equal to data length")}
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
        this.headersConfig.splice(col, 1)

        for (let i = 0; i < this.data.length; i++) {
            this.data[i].splice(col,1)
        }

    }


    xData(cols = []) {
        if (cols.length == 0) {
            return this.data} 
        let ret = []; let tmpRow = []
        for (let i = 0; i<this.len; i++) {
            tmpRow = []
            for (let col of cols) {
                let j = this.headers.indexOf(col); assert(j >-1)
                tmpRow.push(_byVal(this.data[i][j]))
            }
            ret.push(tmpRow)
        }
        return ret
    }


    Subset({cols = [], valueEquals = {}, valueIncludes = {}}) {
        // Assertions
        assert(typOf(cols) == 'list', "cols is not of type list")
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
        let ret = this._Subset_Cols(cols); 

        ret = this._Subset_Equals(ret, valueEquals)

        return this._Subset_Includes(ret, valueIncludes)

    }

    _Subset_Cols(cols) {
// hier ein parent??
        let ret = new clsData_1x1(this.parent);
        if (cols.length == 0) {
            cols = this.headers}
        for (let col of cols) {
            if (this.HeaderIndex(col)>-1) {      
                ret.AddCol(col, -1, this.ColAsList(this._headerNamePure(col)))}      
        }
        return ret
    }

    _Subset_Equals(ret, valueEquals) {
        let flag = true
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
        return ret
    }

    _Subset_Includes(ret, valueIncludes) {
        for (let key of Object.keys(valueIncludes)) {
            let j = this.headers.indexOf(key)
            for (let i = this.len-1; i > -1; i-- ) {
                for (let val of valueIncludes[key]) {
                    if (this.data[i][j].indexOf(val) == -1) {
                        ret.RemoveRow(i)
                        break
                    }
                }
            }     
        }
        return ret
    }

    IsColsSubset(cols) {
        assert(Array.isArray(cols), "headers is not of type list")
        for (let col of cols) {
            let headerNamePure = this._headerNamePure(col)
            if (!this.headers.includes(headerNamePure)) {
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

    HeaderIndex(headerName) {
        assert(typeof headerName === 'string', headerName + " is not of type string")
        let headerNamePure = this._headerNamePure(headerName)
        if (!this.headers.includes(headerNamePure)) {
            return -1
        }
        return this.headers.indexOf(headerNamePure)
    }

    xHeadersRaw(headerName = null) {
        let ret = ""
        if (headerName == null) {
            ret = [] 
            for (let i = 0; i<this.headers.length; i++)
            if(this.headersConfig[i] === "") {
                ret.push(this.headers[i])
            } else {
                ret.push(this.headers[i] + " [" + this.headersConfig[i] + "]")
            }
                
            return ret}

        assert(typeof headerName === 'string', headerName + " is not of type string")
        assert(this.headers.includes(headerName), headerName + " is not in headers")
        let idx = this.HeaderIndex(headerName)
        ret = ""
        if (this.headersConfig[idx] == "") {
            ret = this.headers[idx]
        } else {
            ret = this.headers[idx] + ' [' + this.headersConfig[idx] + ']'} 
    
        return ret
    }

    // xHeadersConfig(headerName = null) {
    //     if (headerName == null) {
    //         return this.headersConfig}

    //     assert(typeof headerName === 'string', headerName + " is not of type string")
    //     assert(this.headers.includes(headerName), headerName + " is not in headers")
        
    //     let idx = this.HeaderIndex(headerName)
    //     return this.headersConfig[idx]

    _headerNamePure(header) {
        if (header.indexOf("[") > 0 && header.indexOf("]") > header.indexOf("[") ) {
            return header.substring(0,header.indexOf(" ["))}
        return header
        }

    // _headerConfigPure(headerRaw) {
    //     assert(typeof headerRaw === 'string', headerRaw + " is not of type string")

    //     if (this._HeaderHasConfig(headerRaw)) {
    //         return RetStringBetween(headerRaw, "[", "]")
    //     } else {
    //         return ""
    //     }
    // }

    // _HeaderHasConfig(header) {
    //     if (header.indexOf("[")>-1 && header.charAt(header.length - 1) === "]") {
    //         return true
    //     }
    //     return false
    // }

    _UpdateNumberCol() {
        if (this._HasReservedCol("No.") && CLS_DATA_1X1_AUTOFILL_COL_NO) {
            let colIdx = this._ReservedCol_Idx("No.")
            for (let i = 0;i<this.len;i++) {
                this.data[i][colIdx] = String(i+1)
            }
        }
    }

    _HasReservedCol(colName) {
        for (let idx of Object.keys(CLS_DATA_1X1_RESERVED_COLS)) {
            if (colName == CLS_DATA_1X1_RESERVED_COLS[idx]) {
                if (idx < 0) {
                    return true}
                if (-1 < idx && this.headers[idx] == colName) {
                    return true}
            }
        }
        return false
    }

    _ReservedCol_Idx(colName) {
        if (this._HasReservedCol(colName)) {
            for (let idx of Object.keys(CLS_DATA_1X1_RESERVED_COLS)) {
                if (colName == CLS_DATA_1X1_RESERVED_COLS[idx]) {
                    return idx
                }
            }
            return false
        }
    }
}



// ################################################################
// test                                                           #
// ################################################################
function test_clsData_1x1() {
    test_clsData_1x1_Init()
    // test_clsData_1x1_AddCol()
    test_clsData_1x1_AddRow()
    // test_clsData_1x1_AddRowDict()
    // test_clsData_1x1_RemoveRow()
    
    // test_clsData_1x1_RemoveCol()
    // test_clsData_1x1_IsColsSubset()
    // test_clsData_1x1_ColAsList()
    // test_clsData_1x1_Subset()
    // test_clsData_1x1_RenameCol()
    // test_clsData_1x1_HeaderIndex() 
    // test_clsData_1x1__headerNamePure()
    // test_clsData_1x1_HeadersRaw_HeadersConfig()
    // test_clsData_1x1_IsColsSubset()
    // test_clsData_1x1_UpdateNumberCol()
    // test_clsData_1x1_Getter_DefaultRow()  

    return 32 // 32 assertions in this file (and should all be catched)
}


function test_clsData_1x1_Init() {
    let fname = arguments.callee.name;
    let parent = new clsCSV({})
    // parent manipulation
    parent.config2.cols = {"A": []} 
    datta = new clsData_1x1(parent, ["A"], [["Hallo"], ["Welt"]])

    testEqualList(datta.headers,["A"], fname)
    testEqualList(datta.data[0],["Hallo"], fname)
    testEqualList(datta.data[1],["Welt"], fname)

    datta2 = new clsData_1x1(datta.headers, datta.data)
    datta.headers[0] = "Z"          // This should have no effect.
    datta.data[0] = ["Mario"]       // Datta2 is a complete new data set. No reference
    testEqualList(datta2.headers,["A"], fname)
    testEqualList(datta2.data[0],["Hallo"], fname)
    testEqualList(datta2.data[1],["Welt"], fname)

    datta3 = new clsData_1x1(["A", "B [config]"], [["Hallo", "Welt"], ["Super", "Mario"]])
    testEqualList(datta3.headers,["A", "B"], fname)
    testEqualList(datta3.headersConfig,["", "config"], fname)

    // test assertions
    assertCalls = [
        {"a": "B", "ermg": "headers is not of type array/list"},
        {"a": ["B"], "b": "Hallo", "ermg": "data is not of type array/list"},
        {"a": ["B"], "b": ["Hallo"], "ermg": "at least on data row is not of type array/list"},
        
    ]
    var foo = function (a,b,c,d) {new clsData_1x1(a,b,c,d)}
    testAssertions(foo, assertCalls)
}

function test_clsData_1x1_AddCol() {
    let fname = arguments.callee.name;
    let parent = new clsCSV({})
    // parent manipulation
    parent.config2.cols = {} 
    let datta = new clsData_1x1(parent)

    datta.AddCol("B", -1, ["Meine", "da drausen"])
    testEqualList(datta.headers,["B"], fname)
    testEqualList(datta.headers,["B"], fname)
    testEqualList(datta.data[0],["Meine"], fname)
    testEqualList(datta.data[1],["da drausen"], fname)

    parent.config2.cols = {"A": []} 
    datta = new clsData_1x1(parent, ["A"], [["Hallo"], ["Welt"]])
    datta.AddCol("B", -1, ["Meine", "da drausen"])
    testEqualList(datta.headers,["A", "B"], fname)
    testEqualList(datta.data[0],["Hallo", "Meine"], fname)
    testEqualList(datta.data[1],["Welt", "da drausen"], fname)

    // datta = new clsData_1x1(["A"], [["Hallo"], ["Welt"]])
    // datta.AddCol("B [lol]", -1, ["Meine", "da drausen"])
    // testEqualList(datta.headers,["A", "B"], fname)
    // testEqualList(datta.headersConfig,["", "lol"], fname)
    // testEqualList(datta.data[0],["Hallo", "Meine"], fname)
    // testEqualList(datta.data[1],["Welt", "da drausen"], fname)

    // test assertions
    assertCalls = [
        {"a": "B", "b": -1, "c":  ["Meine", "da drausen"], "ermg": "header already exists"},
        {"a": "C", "b": -2, "c":  ["Meine", "da drausen"], "ermg": "atPosition index below -1"},
        {"a": "D", "b": 5, "c":  ["Meine", "da drausen"], "ermg": "atPosition index above headers length"},
        {"a": "E", "b": -1, "c":  ["Meine", "da drausen", "ist schoen"], "ermg": "values length not equal to data length"},
        
    ]
    var foo = function (a,b,c) {datta.AddCol(a,b,c)}
    testAssertions(foo, assertCalls)
}

function test_clsData_1x1_AddRow() {
    let fname = arguments.callee.name;
    let parent = new clsCSV({})
    // parent manipulation
    parent.config2.cols = {"A": [], "B": []} 

    datta = new clsData_1x1(parent,["A", "B"], [["Hallo", "Welt"], ["Super", "Mario"]])
    datta.AddRow()
    testEqual(datta.len, 3, fname)
    testEqualList(datta.data,[["Hallo", "Welt"], ["Super", "Mario"], ["..", ".."]], fname)
    datta.AddRow(1)
    testEqual(datta.len, 4, fname)
    testEqualList(datta.data,[["Hallo", "Welt"], ["..", ".."], ["Super", "Mario"], ["..", ".."]], fname)
    datta.AddRow(4, ["Munich", "Oktoberfest"])
    testEqual(datta.len, 5, fname)
    testEqualList(datta.data,[["Hallo", "Welt"], ["..", ".."], ["Super", "Mario"], ["..", ".."], ["Munich", "Oktoberfest"]], fname)

    // test assertions
    assertCalls = [
        {"a": -1, "b":  ["Super", "Mario", "Land"], "ermg": "values length not equal to data length"},
        {"a": -2, "b":  ["Super", "Mario"], "ermg": "atPosition index below -1"},
        {"a": 6, "b":  ["Super", "Mario"], "ermg": "atPosition above data length"},
    ]
    var foo = function (a,b) {datta.AddRow(a,b)}
    testAssertions(foo, assertCalls)
}

function test_clsData_1x1_AddRowDict() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A", "B"], [["Hallo", "Welt"], ["Super", "Mario"]])
    datta.AddRowDict()
    testEqual(datta.len, 3, fname)
    testEqualList(datta.data,[["Hallo", "Welt"], ["Super", "Mario"], ["..", ".."]], fname)
    datta.AddRowDict(-1, {"A": "new A value"})
    testEqual(datta.len, 4, fname)
    testEqualList(datta.data,[["Hallo", "Welt"], ["Super", "Mario"], ["..", ".."], ["new A value", ".."]], fname)

    // test assertions
    assertCalls = [
        {"a": -1, "b":  ["Super", "Mario", "Land"], "ermg": "values length not equal to data length"},
        {"a": -2, "b":  ["Super", "Mario"], "ermg": "atPosition index below -1"},
        {"a": 6, "b":  ["Super", "Mario"], "ermg": "atPosition above data length"},
    ]
    var foo = function (a,b) {datta.AddRow(a,b)}
    testAssertions(foo, assertCalls)
}

function test_clsData_1x1_RemoveRow() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A", "B"], [["Hallo", "Welt"], ["Super", "Mario"], ["Munich", "Oktoberfest"]])
    datta.RemoveRow()
    testEqualList(datta.data,[["Hallo", "Welt"], ["Super", "Mario"]], fname)
    testEqual(datta.len, 2, fname)

    datta = new clsData_1x1(["A", "B"], [["Hallo", "Welt"], ["Super", "Mario"], ["Munich", "Oktoberfest"]])
    datta.RemoveRow(0)
    testEqualList(datta.data,[["Super", "Mario"], ["Munich", "Oktoberfest"]], fname)
    testEqual(datta.len, 2, fname)

    // test assertions
    assertCalls = [
        {"a": -2,  "ermg": "row index below -1"},
        {"a": 5,  "ermg": "row above data length"}
    ]
    var foo = function (a,b) {datta.RemoveRow(a,b)}
    testAssertions(foo, assertCalls)
}

function test_clsData_1x1_RemoveCol() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta.RemoveCol()
    testEqualList(datta.headers, ["A", "B"], fname)
    testEqualList(datta.data,[["Hallo", "Welt"], ["Super", "Mario"], ["Munich", "Oktoberfest"]], fname)

    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta.RemoveCol(1)
    testEqualList(datta.headers, ["A", "C"], fname)
    testEqualList(datta.data,[["Hallo", "drausen"], ["Super", "Land"], ["Munich", "Beer"]], fname)

    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta.RemoveCol(-1, "A")
    testEqualList(datta.headers, ["B", "C"], fname)
    testEqualList(datta.data,[["Welt", "drausen"], ["Mario", "Land"], ["Oktoberfest", "Beer"]], fname)

    datta = new clsData_1x1(["A [lol]", "B [lol]", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta.RemoveCol(-1, "A")
    testEqualList(datta.headers, ["B", "C"], fname)
    testEqualList(datta.headersConfig, ["lol", ""], fname)
    testEqualList(datta.data,[["Welt", "drausen"], ["Mario", "Land"], ["Oktoberfest", "Beer"]], fname)

    // test assertions
    assertCalls = [
        {"a": -2, "ermg": "col index below -1"},
        {"a": 5, "ermg": "col index above headers length"},
        {"a": "col", "ermg": "col is not an integer"},
        {"a": 1, "b": "B", "ermg": "col and colName are both defined. Define only one"},
    ]
    var foo = function (a,b) {datta.RemoveCol(a,b)}
    testAssertions(foo, assertCalls)
}

function test_clsData_1x1_Subset_Cols() {
    let fname = arguments.callee.name;
    let datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    let datta2 = datta.Subset({cols:["A", "C"]})
    testEqualList(datta2.headers, ["A", "C"], fname)
    testEqualList(datta2.data,[["Hallo", "drausen"], ["Super", "Land"], ["Munich", "Beer"]], fname)

    datta = new clsData_1x1(["A [lol]", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta2 = datta.Subset({cols:["A", "C"]})
    testEqualList(datta2.headers, ["A", "C"], fname)
    testEqualList(datta2.headersConfig, ["lol", ""], fname)
    testEqualList(datta2.data,[["Hallo", "drausen"], ["Super", "Land"], ["Munich", "Beer"]], fname)
}

function test_clsData_1x1_Subset_Equals() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"], ["Hallo", "Oktoberfest", "Beer"], ["Bye", "Oktoberfest", "Beer"]])
    let valEq = {"A": ["Hallo"]} 
    datta2 = datta.Subset({valueEquals: valEq})
    testEqualList(datta2.headers, ["A", "B", "C"], fname)
    testEqualList(datta2.data,[["Hallo", "Welt 12 Y", "drausen"], ["Hallo", "Oktoberfest", "Beer"]], fname)
    testEqual(datta2.len, 2, fname)

    valEq = {"A": ["Hallo", "Super"]} 
    datta2 = datta.Subset({valueEquals: valEq})
    testEqualList(datta2.headers, ["A", "B", "C"], fname)
    testEqualList(datta2.data,[["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"], ["Hallo", "Oktoberfest", "Beer"]], fname)
    testEqual(datta2.len, 3, fname)
}

function test_clsData_1x1_Subset_Includes() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"], ["Hallo", "Oktoberfest", "Beer"]])
    let valIn = {"B": ["12"]} 
    datta2 = datta.Subset({valueIncludes: valIn})
    testEqualList(datta2.headers, ["A", "B", "C"], fname)
    testEqualList(datta2.data,[["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"]], fname)
    testEqual(datta2.len, 2, fname)
}

function test_clsData_1x1_Subset() {
    test_clsData_1x1_Subset_Cols()
    test_clsData_1x1_Subset_Equals()
    test_clsData_1x1_Subset_Includes()
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A", "B [some config]", "C"], [["Hallo", "Welt 12 Y", "drausen"], ["Super", "Mario 12 X", "Land"], ["Hallo", "Oktoberfest", "Beer"]])
    
    let valEq = {"A": ["Hallo"]}
    let valIn = {"B": ["12"]} 
    datta2 = datta.Subset({valueEquals: valEq, valueIncludes: valIn})
    testEqualList(datta2.headers, ["A", "B", "C"], fname)
    testEqualList(datta2.headersConfig, ["", "some config", ""], fname)
    testEqualList(datta2.data,[["Hallo", "Welt 12 Y", "drausen"]], fname)
    testEqual(datta2.len, 1, fname)

    let cols = ["A", "B"]
    datta3 = datta.Subset({cols: cols, valueEquals: valEq, valueIncludes: valIn})
    testEqualList(datta3.headers, ["A", "B"], fname)
    testEqualList(datta3.headersConfig, ["", "some config"], fname) // x
    testEqualList(datta3.data,[["Hallo", "Welt 12 Y"]], fname)
    testEqual(datta3.len, 1, fname)
    

    // test assertions
    assertCalls = [
        {"a": {cols: 1}, "ermg": "cols is not of type list"},
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

function test_clsData_1x1_IsColsSubset() {
    let fname = arguments.callee.name;
    let datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])

    testEqual(datta.IsColsSubset(["A"]), true, fname)
    testEqual(datta.IsColsSubset(["A", "B"]), true, fname)
    testEqual(datta.IsColsSubset(["B", "C"]), true, fname)
    testEqual(datta.IsColsSubset(["B", "D"]), false, fname)

    // test assertions
        assertCalls = [
            {"a": 1, "ermg": "1 is not of type string"},
        ]
        var foo = function (a,b) {datta.ColAsList(a)}
        testAssertions(foo, assertCalls)
}


function test_clsData_1x1_ColAsList() {
    let fname = arguments.callee.name;
    let datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    let values = datta.ColAsList("A")
    testEqualList(values, ["Hallo", "Super", "Munich"], fname)
    testEqual(datta.IsColsSubset(["B", "C"]), true, fname)
    testEqual(datta.IsColsSubset(["B", "D"]), false, fname)

    // test assertions
        assertCalls = [
            {"a": 1, "ermg": "1 is not of type string"},
            {"a": "D", "ermg": "D not in headers"},
        ]
        var foo = function (a,b) {datta.ColAsList(a)}
        testAssertions(foo, assertCalls)
}

function test_clsData_1x1_RenameCol() {
    let fname = arguments.callee.name;
    let datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta.RenameCol("A", "XYZ")
    testEqualList(datta.headers, ["XYZ", "B", "C"], fname)

    // test assertions
        assertCalls = [
            {"a": "X", b: "A", "ermg": "X is not in headers"},
        ]
        var foo = function (a,b) {datta.RenameCol(a)}
        testAssertions(foo, assertCalls)
}

function test_clsData_1x1_HeaderIndex() {
    let fname = arguments.callee.name;
    let datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])

    testEqual(datta.HeaderIndex("A"), 0, fname)
    testEqual(datta.HeaderIndex("C"), 2, fname)
    testEqual(datta.HeaderIndex("A [dont care]"), 0, fname)

    // test assertions
        assertCalls = [
            {"a": 1, "ermg": "1 is not of type string"},
        ]
        var foo = function (a,b) {datta.HeaderIndex(a)}
        testAssertions(foo, assertCalls)
}

function test_clsData_1x1_HeadersRaw_HeadersConfig() {
    let fname = arguments.callee.name;
    let datta = new clsData_1x1(["A", "B", "C [some config]"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])

    testEqualList(datta.headers, ["A", "B", "C"], fname)
    testEqualList(datta.headersConfig, ["", "", "some config"], fname)
    testEqualList(datta.HeadersRaw(), ["A", "B", "C [some config]"], fname)
    testEqual(datta.HeadersRaw("A"), "A", fname)
    testEqual(datta.HeadersRaw("C"), "C [some config]", fname)
    testEqualList(datta.HeadersConfig(), ["", "", "some config"], fname)
    testEqual(datta.HeadersConfig("A"), "", fname)
    testEqual(datta.HeadersConfig("C"), "some config", fname)

    // test assertions
        assertCalls = [
            {"a": 1, "ermg": "1 is not of type string"},
            {"a": "D", "ermg": "D is not in headers"},
        ]
        var foo = function (a,b) {datta.HeadersRaw(a)}
        testAssertions(foo, assertCalls)
        var foo = function (a,b) {datta.HeadersConfig(a)}
        testAssertions(foo, assertCalls)
}

function test_clsData_1x1__headerNamePure() {
    let fname = arguments.callee.name;
    let datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])

    let a = "test A"
    let b = "test B [dont care]"

    testEqual("test A", datta._headerNamePure(a), fname)
    testEqual("test B", datta._headerNamePure(b), fname)
}

function test_clsData_1x1_IsColsSubset() {
    let fname = arguments.callee.name;
    let datta = new clsData_1x1(["A", "B", "C [some config]"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])

    let a = ["A", "C [some config]"]
    let b = ["A", "C"]
    let c = ["A", "D"]

    testEqual(datta.IsColsSubset(a), true, fname)
    testEqual(datta.IsColsSubset(b), true, fname)
    testEqual(datta.IsColsSubset(c), false, fname)
}


function test_clsData_1x1_UpdateNumberCol() {
    let fname = arguments.callee.name;
    let colNoIdx = 0
    let colNo = CLS_DATA_1X1_RESERVED_COLS[colNoIdx]
    let datta2 = new clsData_1x1([colNo, "B", "C"], [["2", "Welt", "drausen"], ["3", "Mario", "Land"], ["4", "Oktoberfest", "Beer"]])

    assert(datta2.data[0][colNoIdx], "2")
    assert(datta2.data[1][colNoIdx], "3")
    assert(datta2.data[2][colNoIdx], "4")

    datta2._UpdateNumberCol()

    testEqual(datta2.data[0][colNoIdx], "1", fname)
    testEqual(datta2.data[1][colNoIdx], "2", fname)
    testEqual(datta2.data[2][colNoIdx], "3", fname)

    datta2 = new clsData_1x1([colNo, "B", "C"], [["2", "Welt", "drausen"], ["3", "Mario", "Land"], ["4", "Oktoberfest", "Beer"]])
    datta2.RenameCol(colNo, "NOT")
    datta2._UpdateNumberCol()

    testEqual(datta2.data[0][colNoIdx], "2", fname)
    }

    function test_clsData_1x1_DefaultRow() {
        let fname = arguments.callee.name;
        let parent = new clsCSV({})
    
        let row = parent.Get.DefaultRow()
        let test = ["1", "..", "..", "..", "..", "[]", "[]"]
        
        testEqualList(row, test, fname)
    
    }