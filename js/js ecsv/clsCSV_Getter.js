const CLSCSV_GETTER = {
    "colTypeIdentifier": {
        "number": ["No", "No."],   // pushes number to new row
        "filter": ["[dropdown]"]     // pushes "[]" to new row
    }
}


class clsCSV_Getter {
    constructor(parent) {
        this.parent = parent
    }

    Cols() {
        return this._fromparent_headers() }

    ColsWithConfig() {
        let headers = this._fromparent_headers(); let config = this._fromparent_configCols()
        if (IsEqual(headers, []) || IsEqual(config, {})) {
            return []}
        let configString = ""
        let ret = []; 
        for (let header of headers) {
            configString = ""
            if (config[header].length > 0) {
                configString = " ["
                for (let conf of config[header]) {
                    configString += conf + ','}
                configString = ChangeLastChar(configString, "]")
            }     
            ret.push(header + configString)
        }
        return ret}
    
    ConfigOfCol(col) {
        return this.parent.config.HeadersConfig(col)
    }

    
    _fromparent_headers() {
        if (this.parent.hasOwnProperty("data1x1")) {
            return this.parent.data1x1.headers} 
        return []
    }

    _fromparent_configCols() {
        if (this.parent.hasOwnProperty("config")) {
            return this.parent.config.cols} 
        return {}
    }

}



// ################################################################
// test                                                           #
// ################################################################

function test_CSV_Getter() {
    test_CSV_Getter_Cols() 

    return 0 // 32 assertions in this file (and should all be catched)
}

function test_CSV_Getter_Cols() {
    let fname = arguments.callee.name;
    let parent = new clsCSV({})

    testEqualList(parent.Get.ColsWithConfig(), _byVal(JSONDICT["Template"]["headers"]), fname)

    // let colsConfig = parent.Get.ColsConfig()
    // let colsWithConfig = parent.Get.ColsWithConfig()

    // let test1 = []
    // let test3 = 

    // for (let header of test3) {
    //     test1.push(RetStringBetween(header, "", " ["))
    // }
    
    
    // testEqualList(colsWithConfig, test3, fname)
}


