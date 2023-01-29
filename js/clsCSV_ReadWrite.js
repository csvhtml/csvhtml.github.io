class clsCSV_ReadWrite {
    constructor (csvtext, delimiter = ";") {
        this.fulltextraw = ""
        this.headerraw = ""
        this.dataraw = ""

        this.fulltextfine = ""

        this.headerslist = []
        this.datalist2D = []

        this.DataFine = ""
        this.Read(csvtext,delimiter)
    }

    Read(csvtext, delimiter = ";") {
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