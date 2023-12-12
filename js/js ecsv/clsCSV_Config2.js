const CLSCSV_CONFIG = {
    "Views": ["table", "list", "sidebar"],  // first entry is default config
}


class clsCSV_Config2 {
    constructor(parent, headers = [], view) {
        this.parent = parent
        this.cols = {
            // "headerA": ["dropdown", "hidden"],
            // "headerB": [],
            // "headerC": ["dropdown"],
        }
        this.filter = {
            // "headerA": ["Hello", "World"]  OR Logic, all elementes that either have "Hello" or "World". AND Logic between headers
            // "headerB": []
            // ...
        }
        this.views = _byVal(CLSCSV_CONFIG["Views"])
        this.ActiveView = this.views[0]

        // ACTIONS
        if (!IsEqual(headers, [])) {
            this.Set_Config_From_Headers(headers)}

        if (CLSCSV_CONFIG["Views"].indexOf(view) > -1) {
            this.ApplyView(view)
        }
        let a = 1
    }

    ApplyView(view) {
        this.ActiveView = view
        if (view == "sidebar") {
            for (let header of Object.keys(this.cols)) {
                if (header != "Name") {
                    this.cols[header].pushX("hidden")}
            }
        }
    }

    Add(header) {
        let headerName = RetStringBetween(header, "", "[", true)
        this.cols[headerName] = this._ConfigFromColString(header)
    }

    ColsVisible() {
        let ret = []; let flag = false

        for (let header of Object.keys(this.cols)) {
            flag = false
            for (let parameter of this.cols[header]) {
                if (parameter == "hidden") {
                    flag = true; break}
            }
            if (flag == false) {
                ret.push(header)}
        }
        return ret
    }

    Set_Config_From_Headers(headers = []) {
        let headerName = ""; let headerConfig = ""; let i = -1; 
        headers = this._headers(headers)

        for (let header of headers) {
            headerName = RetStringBetween(header, "", "[", true)
            this.cols[headerName] = this._ConfigFromColString(header)

            // i +=1
            // if (header.indexOf("[") > 0 && header.indexOf("]") > header.indexOf("[") ) {
            //     headerName = RetStringBetween(header, "", "[", true)
            //     this.cols[headerName] = this._ConfigFromColString(header)
            // } else {
            //     // set
            //     this.cols[header] = []
            // }
        }
    }

    _ConfigFromColString(header) {
        if (header.indexOf("[") > 0 && header.indexOf("]") > header.indexOf("[") ) {
            let headerConfig = RetStringBetween(header, "[", "]")
            if (headerConfig.indexOf(",") > 0) {
                headerConfig = headerConfig.split(",")}
            else {
                headerConfig = [headerConfig]}
            return headerConfig
        }
        return []
    }

    HeaderConfig(header="") {
        if (IsEqual(this.cols, {})) {
            return [] }
        if (header == "") {
            return []}
        return this.cols[header]
    }

    HeadersConfig() {
        return this.cols
    }

    _headers(headers) {
        if (IsEqual(headers, [])) {
            return JSONDICT["Template"]["headers"]}
        return headers
    }

}


// ################################################################
// test                                                           #
// ################################################################
class testParent {
    constructor() {
        this.data1x1= new testdata1x1()
        this.config = new clsCSV_Config2()
    }
}

class testdata1x1 {
    constructor() {
        this.headers = []
    }
}

function test_clsCSV_Config2() {

    test_clsCSV_Config2_Extract_Config_From_Headers()

    return 0
}

function test_clsCSV_Config2_Extract_Config_From_Headers() {
    let fname = arguments.callee.name;
    let parent = new testParent()
    let valEq = {
        "A": ["dropdown", "hidden"],
        "B": [],
        "C": ["hidden"],
        "D": ["dropdown"],
    }
    let headers = ["A [dropdown,hidden]", "B", "C [hidden]", "D [dropdown]"]


    // init with no header
    let testConfig = new clsCSV_Config2(parent)
    testEqualDict(testConfig.HeadersConfig(),{}, fname)
    // then you can manually add a header to get the config
    testConfig.Set_Config_From_Headers(headers)  // when you pass no parameter, then teh config of the JSON will be taken
    testEqualDict(testConfig.HeadersConfig(),valEq, fname)


    // init with header
    testConfig = new clsCSV_Config2(parent, 
        ["A [dropdown,hidden]", "B", "C [hidden]", "D [dropdown]"])

    testEqualDict(testConfig.HeadersConfig(),valEq, fname)

    testEqualList(testConfig.ColsVisible(),["B", "D"], fname)
    
    
    

}
    