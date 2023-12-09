class clsCSV_Getter {
    constructor(parent) {
        this.parent = parent
    }

    Cols() {
        return this.parent.data1x1.headers}

    ColsWithConfig() {
        let headers = this.parent.data1x1.headers; let config = this.parent.config.cols
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

    let cols = parent.Get.Cols()
    // let colsConfig = parent.Get.ColsConfig()
    let colsWithConfig = parent.Get.ColsWithConfig()

    let test1 = []
    let test3 = _byVal(JSONDICT["Template"]["headers"])

    for (let header of test3) {
        test1.push(RetStringBetween(header, "", " ["))
    }
    
    testEqualList(cols, test1, fname)
    testEqualList(colsWithConfig, test3, fname)
}