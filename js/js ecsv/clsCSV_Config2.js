class clsCSV_Config2 {
    constructor(parent) {
        this.parent = parent
        this.cols = {
            // "headerA": ["dropdown", "hidden"]
            // "headerB": []
            // ...
        }
        this.filter = {
            // "headerA": ["Hello", "World"]  OR Logic, all elementes that either have "Hello" or "World". AND Logic between headers
            // "headerB": []
            // ...
        }
    }

    Extract_Config_From_Headers() {
        let headerName = ""; let headerConfig = ""; let i = -1
        for (let header of this.parent.headers) {
            i +=1
            if (header.indexOf("[") > 0 && header.indexOf("]") > header.indexOf("[") ) {
                headerName = RetStringBetween(header, "", "[", true)
                headerConfig = RetStringBetween(header, "[", "]")
                if (headerConfig.indexOf(",") > 0) {
                    headerConfig = headerConfig.split(",")}
                // set
                this.parent.headers[i] = headerName
                this.cols[headerName] = headerConfig
            } else {
                // set
                this.cols[header] = []
            }
        }
    }

    Get_HeadersConfig() {
        return this.cols
    }

}


// ################################################################
// test                                                           #
// ################################################################
class testParent {
    constructor() {
        this.headers = ["A [dropdown,hidden]", "B", "C [hidden]", "D [dropdown]"]
    }
}

function test_clsCSV_Config2() {

    test_clsCSV_Config2_Extract_Config_From_Headers()

    return 0
}

function test_clsCSV_Config2_Extract_Config_From_Headers() {
    let fname = arguments.callee.name;
    let parent = new testParent()
    let testConfig = new clsCSV_Config2(parent)

    
    let valEq = {
        "A": ["dropdown", "hidden"],
        "B": "",
        "C": ["hidden"],
        "D": ["dropdown"],
    }
    testConfig.Extract_Config_From_Headers()

    let filter = testConfig.Get_HeadersConfig()
    testEqualDict(filter,valEq, fname)

}
    