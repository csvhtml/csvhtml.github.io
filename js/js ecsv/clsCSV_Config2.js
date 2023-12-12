const CLSCSV_CONFIG = {
    "Views": ["table", "list", "sidebar"],  // first entry is default config
}


class clsCSV_Config2 {
    constructor(parent, headers = [], view = "") {
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
        this.ActiveView = view 

        // ACTIONS
        this.SetView(view)

        if (!IsEqual(headers, [])) {
            this.Init(headers)}
    }


    SetView(view) {
        if (view == ""){
            this.ActiveView = CLSCSV_CONFIG["Views"][0]; return}
        this.ActiveView = view
    }

    ApplyViewOnHeadersConfig() {
        if (this.ActiveView == "sidebar") {
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

    HeadersVisible(all = false) {
        let ret = []; let flag = false

        for (let header of Object.keys(this.cols)) {
            flag = false
            for (let parameter of this.cols[header]) {
                if (parameter == "hidden") {
                    flag = true; break}
            }
            if (flag == false || all) {
                ret.push(header)}
        }
        return ret
    }

    Init(headers = []) {
        this.cols =  {}
        let headerName = ""
        if (IsEqual(headers, [])) {
            headers = this._headersFromTemplate()}

        for (let header of headers) {
            headerName = RetStringBetween(header, "", "[", true)
            this.cols[headerName] = this._ConfigFromColString(header)}

        this.ApplyViewOnHeadersConfig()
    }

    _ConfigFromColString(header) {
        if (this.HeaderHasConfig(header)) {
            let headerConfig = RetStringBetween(header, "[", "]")
            if (headerConfig.indexOf(",") > 0) {
                headerConfig = headerConfig.split(",")}
            else {
                headerConfig = [headerConfig]}
            return headerConfig
        }
        return []
    }

    HeaderConfig(header, AsString = false, WithBlank = false) {
        if (IsEqual(this.cols, {})) {
            if (AsString) {return ""}; return []}
        
        if (AsString) {
            let ret = "["
            for (let config of this.HeaderConfig(header)) {
                ret+=config + ","}
            ret = ChangeLastChar(ret,"]")
            if (ret == "]") {
                return ""}
            
            if (WithBlank) {
                return " " + ret}
            return ret
        }
        return this.cols[header]
    }

    HeadersWithConfig() {
        let ret = []
        for (let header of Object.keys(this.cols)) {
            ret.push(this.HeaderWithConfig(header))}
        return ret
    }

    HeaderWithConfig(header) {
        return header + this.HeaderConfig(header, true, true)
    }

    HeadersConfig() {
        return this.cols
    }

    Headers() {
        return this.HeadersVisible(true) 
    }

    HeadersHaveConfig(headers) {
        for (let header of headers) {
            if (this.HeaderHasConfig(header)) {
                return true}
        }
        return false   
    }

    HeaderHasConfig(header) {
        if (header.indexOf("[") > 0 && header.indexOf("]") > header.indexOf("[") ) {
            return true}
        return false
    }

    _headersFromTemplate(headers) {
        return JSONDICT["Template"]["headers"]}
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
    testConfig.Init(headers)  // when you pass no parameter, then teh config of the JSON will be taken
    testEqualDict(testConfig.HeadersConfig(),valEq, fname)


    // init with header
    testConfig = new clsCSV_Config2(parent, 
        ["A [dropdown,hidden]", "B", "C [hidden]", "D [dropdown]"])

    testEqualDict(testConfig.HeadersConfig(),valEq, fname)

    testEqualList(testConfig.HeadersVisible(),["B", "D"], fname)
    
    
    

}
    