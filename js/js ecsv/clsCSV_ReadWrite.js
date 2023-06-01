class clsCSV_ReadWrite {
    constructor (csvtext = "", delimiter = ";") {
        this.fulltextraw = ""
        this.headerraw = ""
        this.dataraw = ""

        this.fulltextfine = ""

        this.headerslist = []
        this.datalist2D = []

        this.DataFine = ""
        if (csvtext != "") {
            this.ReadfromText(csvtext,delimiter)
        }

    }

    ReadfromText(csvtext, delimiter = ";") {
        this.fulltextraw = csvtext
        this.fulltextfine = this._ReturnFormatText(csvtext, delimiter)
        let str = this.fulltextfine
        this.headerraw = str.slice(0, str.indexOf("\n"))
        this.dataraw = str.slice(str.indexOf("\n")+1)
        this.headerslist = this.headerraw.split(delimiter)
        
        let rows = this.dataraw.split("\n");
        for (let row of rows) {
            let tmp = row.split(delimiter)
            this.datalist2D.push(tmp)
        }
    }

    WriteToText(headersList, DataList2D, delimiter = ";", csvRootPath) {
        let ret = '';
        // headers
        for (let header of headersList) {
            ret += header + ';'}
        // ret = ret.slice(0, -1)
        // ret += "\n"
        ret = this._Chr10AtEnd(ret)

        //rows
        for (let row of DataList2D) {
            for (let cell of row) {
                if (String(cell).includes("\r")) {
                    // make mult-line readable for xls
                    cell = '"' + cell + '"'
                    cell = cell.replace(new RegExp('\n', "g") , '\r')  // use \r for in cell new line
                }
                ret += cell + delimiter}
            ret = this._Chr10AtEnd(ret)
            // ret = ret.slice(0, -1) // remove last seperator. open: length of seperator
            // ret += "\n"
            }
        ret += "X;CONFIG;PATH:" + csvRootPath + "!;" + '\r'
        return ret;
    }

    _ReturnFormatText(text, delimiter)  {
        let ret = text
        ret = this._ReturnFormatText_Chr10Chr13(ret, delimiter)
        return ret
    }

    _ReturnFormatText_Chr10Chr13(text, delimiter) {
        let str = text.replace(new RegExp('\r\n', "g") , '\n')           // '\r\n' is the standard for new line in windows. for clsCSV plain \n is used as new line
        str = str.replace(new RegExp('"' + delimiter, "g") , delimiter)     // '"' used to make csv xls readable. Not used here
        str = str.replace(new RegExp(delimiter + '"', "g") , delimiter)     // '"' used to make csv xls readable. Not used here
        return str
    }

    _Chr10AtEnd(text) {
        let ret = text
        ret = ret.slice(0, -1) // remove last seperator. open: length of seperator
        ret = ret + "\n"
        return ret
    }

    Header_Raw() {
        return this.headerraw
    }

    Data_Raw() {
        return this.dataraw
    }

    Headers_List() {
        return this.headerslist
    }

    Data_List2D() {
        return this.datalist2D
    }
}


// ################################################################
// test                                                           #
// ################################################################
function test_clsCSV_ReadWrite() {
    test_clsCSV_ReadWrite_Init()

    return 0 // 32 assertions in this file (and should all be catched)
}

function test_clsCSV_ReadWrite_Init() {
    let fname = arguments.callee.name;

    RW = new clsCSV_ReadWrite("A;B;C\nHallo;Welt;Tag")

    testEqual(RW.Header_Raw(), "A;B;C", fname)
    testEqual(RW.Data_Raw(), "Hallo;Welt;Tag", fname)
    testEqualList(RW.Headers_List(), ["A", "B", "C"], fname)
    testEqualList(RW.Data_List2D(), [["Hallo", "Welt", "Tag"]], fname)

    RW = new clsCSV_ReadWrite("A;B;C\nHallo;Welt;Tag\nMario;Luigi;Toad")
    testEqualList(RW.Data_List2D(), [["Hallo", "Welt", "Tag"], ["Mario", "Luigi", "Toad"]], fname)
}