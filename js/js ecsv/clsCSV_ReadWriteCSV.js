const CLS_CSV_READWRITECSV_XLSCELLFORMAT = true
const CLS_CSV_READWRITECSV_CHR_NEWLINE_INSIDECELL = '\r'
const CLS_CSV_READWRITECSV_CHR_NEWLINE_INCSV = '\n'

class clsCSV_ReadWriteCSV {
    /*
    * Methods to Read in and Write to CSV file
    */
    constructor (parent) {
        this.parent = parent
    }

    ReadfromJSON(jsontext,delimiter) {
        return this.xReadfromJSON(jsontext, delimiter)
    }

    ReadfromText_0Headers1Data2Config(csvtext) {
        return this.xReadfromText_0Headers1Data2Config(csvtext)
    }

    WriteToText(headersList, DataList2D, delimiter = ";", csvRootPath) {
        return this.xWriteToText(headersList, DataList2D, delimiter, csvRootPath)
    }

    // ################################################################
    // Sub methods                                                    #
    // ################################################################

    xReadfromJSON(text, delimiter = ";" ) {
        // let headers = ["A", "B", "C"]
        // let dataa = ["Hallo;Welt;Drausen","Super;Mario;World"]
        let headers = JSON_DATA["TestData"]["headers"]
        let dataa = JSON_DATA["TestData"]["data"]
        this.parent.data1x1.Init_Headers(headers, delimiter)
        this.parent.data1x1.Init_Data(dataa, delimiter)
        this.parent.mode.SetConfig("cols", headers)
    }


    xReadfromText_0Headers1Data2Config(csvtext) {
        let ret = []
        let text = csvtext
        // 0 = headers, 1 = data, 2 = config text
        let str0 = ''; let str1 = ''; let str2 = ''

        text = this._ReadFromText_UnifyNewLines(text)
        str0 = text.slice(0,  text.indexOf(CLS_CSV_READWRITECSV_CHR_NEWLINE_INCSV))
        let str12 = text.slice(text.indexOf(CLS_CSV_READWRITECSV_CHR_NEWLINE_INCSV)+1)
        if (str12.includes("X;CONFIG;")) {
            str1 = str12.slice(0,str12.indexOf("X;CONFIG;")-1)
            str2 = str12.slice(str12.indexOf("X;CONFIG;"))
        } else {
            str1 = str12
        }
        for (let strX of [str0, str1, str2]) {

            ret.push(this._FixText(strX))

        }
        return ret // 0 = headers text, 1 = data text, 2 = config text
    }

    _FixText(text) {
        let ret = text
        if (text.charAt(text.length-1)== '\n') {
            ret = text.slice(0,-1)
        }
        return ret
    }

    _ReadFromText_UnifyNewLines(text) {
        let str = ''
        str = text.replace(new RegExp('\n\r', "g") , CLS_CSV_READWRITECSV_CHR_NEWLINE_INCSV)
        str = text.replace(new RegExp('\r\n', "g") , CLS_CSV_READWRITECSV_CHR_NEWLINE_INCSV)           // '\r\n' is the standard for new line in windows. for clsCSV plain \n is used as new line
        // make csv xls readable. Not used here
        // str = str.replace(new RegExp('"' + delimiter, "g") , delimiter)     
        // str = str.replace(new RegExp(delimiter + '"', "g") , delimiter)   
        return str    
    }

    xWriteToText(headersList, DataList2D, delimiter = ";", csvRootPath) {
        let ret = '';
        // headers
        for (let header of headersList) {
            ret += header + ';'}
        ret = this._Chr10AtEnd(ret)

        //rows
        for (let row of DataList2D) {
            for (let cell of row) {
                cell = this._WriteToText_CellValue_Refinement(cell)
                ret += cell + delimiter}
            ret = this._Chr10AtEnd(ret)
            // ret = ret.slice(0, -1) // remove last seperator. open: length of seperator
            // ret += "\n"
            }
        ret += "X;CONFIG;PATH:" + csvRootPath + "!;" + '\r'
        return ret;
    }

    _WriteToText_CellValue_Refinement(cellVal) {
        let cell = cellVal
        if (this._IncludesEnterChar(cell)) {
            if (CLS_CSV_READWRITECSV_XLSCELLFORMAT) {
                cell = this._ApplyXLS(cell)}
            if (CLS_CSV_READWRITECSV_CHR_NEWLINE_INSIDECELL != '\n') {
                cell = cell.replace(new RegExp('\n', "g") , CLS_CSV_READWRITECSV_CHR_NEWLINE_INSIDECELL)} 
        } else {
            cell = this._RemoveQuotationCharAtStartorEnd(cell)
        }

        return cell
    }

    // not used so far... to be embedded
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

    _RemoveQuotationCharAtStartorEnd(text) {
        if ((text.charAt(0) == '"' || text.charAt(0) == "'") && (text.charAt(text.length-1) == '"' || text.charAt(text.length-1) == "'")) {
            return text.slice(1,-1)}
        if (text.charAt(0) == '"' || text.charAt(0) == "'") {
            return text.slice(1)}
        if (text.charAt(text.length-1) == '"' || text.charAt(text.length-1) == "'") {
            return text.slice(0, -1)} 
        return text
    }

    _IncludesEnterChar(text) {
        if (text.includes("\r") || text.includes("\n")) {
            return true
        }
        return false
    }

    _ApplyXLS(text) {
        if (text.charAt(0) != '"' && text.charAt(text.length-1) != '"' ) {
            return '"' + text + '"'}

        if (text.charAt(0) == '"' && text.charAt(text.length-1) == '"' ) {
            return text}

        if (text.charAt(0) == '"') {
            return text + '"'}

        if (text.charAt(text.length-1)  == '"') {
            return '"' + text}

        assert(false)
    }

    _Chr10AtEnd(text) {
        let ret = text
        ret = ret.slice(0, -1) // remove last seperator. open: length of seperator
        ret = ret + "\n"
        return ret
    }
}


// ################################################################
// test                                                           #
// ################################################################
// function test_clsCSV_ReadWriteCSV() {
//     test_clsCSV_ReadWriteCSV_Init()

//     return 0 // 32 assertions in this file (and should all be catched)
// }

// function test_clsCSV_ReadWriteCSV_Init() {
//     let fname = arguments.callee.name;

//     RW = new clsCSV_ReadWriteCSV("A;B;C\nHallo;Welt;Tag")

//     testEqual(RW.Header_Raw(), "A;B;C", fname)
//     testEqual(RW.Data_Raw(), "Hallo;Welt;Tag", fname)
//     testEqualList(RW.Headers_List(), ["A", "B", "C"], fname)
//     testEqualList(RW.Data_List2D(), [["Hallo", "Welt", "Tag"]], fname)

//     RW = new clsCSV_ReadWriteCSV("A;B;C\nHallo;Welt;Tag\nMario;Luigi;Toad")
//     testEqualList(RW.Data_List2D(), [["Hallo", "Welt", "Tag"], ["Mario", "Luigi", "Toad"]], fname)
// }