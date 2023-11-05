// ################################################################
// Layout Naming Functions and Config                             #
// ################################################################
// IDs

const LAYOUT_ID = {
    // ID pattern for table headers:
    // LAYOUT_ID['HeaderPrefix'] + headerString +  LAYOUT_ID['HeaderPostfix']
    'HeaderPrefix': 'header-',
    'HeaderPostfix': '',

    // ID pattern for table rows
    // LAYOUT_ID['RowPrefix'] + rowIndex + LAYOUT_ID['RowPostfix']
    'RowPrefix': 'row:',
    'RowPostfix':'!',

    // ID pattern for table cells:
    // "R:" + rowIndex + "C:" + colIndex + "H:" + headerString
    'CellR': 'R:',
    'CellC': 'C:',
    'CellH': 'H:'
}

const LAYOUT_CLASSNAME = {
    'Table': 'ecsvtable',
    'Cell': 'ecsvcell',
    'ColPrefix': 'col-'
}

class clsCSV_Layout_Naming {
    constructor(EgoDivID) {
        this.EgoDivID = EgoDivID
    }

    headerID(header) {
        let ret = '[' + this.EgoDivID+ '] '
        ret += LAYOUT_ID['HeaderPrefix'] + header + LAYOUT_ID['HeaderPostfix']
        return ret
    }

    headersID(headers) {
        let ret = []
        for (let h of headers) {
            ret.push(this.headerID(h))
        }
        return ret
    }

    header(from_headerID) {
        return RetStringBetween(from_headerID,LAYOUT_ID['HeaderPrefix'],LAYOUT_ID['HeaderPostfix'])
    }

    headerClasses(header) {
        return [LAYOUT_CLASSNAME['ColPrefix'] + header]
    }

    headersClasses(headers) {
        let ret = []
        for (let h of headers) {
            ret.push(this.headerClasses(h))
        }
        return ret
    }

    headerWidth(header) {
        let w = "15"
        if (header == "No.") {w = "4"}
        if (header == "Name") {w = "15"}
        if (header == "Description") {w = "38"}
        if (header == "Type") {w = "5"}
        if (header == "Tags") {w = "8"}

        return w
        }

    headersWidth(headers) {
            let ret = []
            for (let h of headers) {
                ret.push(this.headerWidth(h))
            }
            return ret
        }
    
    RowID(RowIndexStr) {
        let ret = '[' + this.EgoDivID+ '] '
        ret += LAYOUT_ID['RowPrefix'] + RowIndexStr + LAYOUT_ID['RowPostfix']
        return ret
    }

    RowIDs(RowsCount) {
        let ret = []
        for (let i = 0; i < RowsCount; i++) {
            ret.push(this.RowID(String(i)))
        }
        return ret
    }

    row(from_rowID) {
        return RetStringBetween(from_rowID,LAYOUT_ID['RowPrefix'],LAYOUT_ID['RowsPostfix'])
    }

    CellID(rowIdxStr, colIdxStr, header) {
        let ret = '[' + this.EgoDivID+ '] '
        ret += LAYOUT_ID["CellR"] + rowIdxStr + LAYOUT_ID["CellC"] + colIdxStr + LAYOUT_ID["CellH"] + header
        return ret
    }

    CellsID(cols, RowsCount) {
        let ret = []
        let tmp = []
        for (let j = 0; j < RowsCount; j++) {
            tmp = []
            for (let i = 0; i < cols.length; i++) {
                tmp.push(this.CellID(String(j),String(i),cols[i]))
            }
            ret.push(tmp)
        }
        return ret
    }

    CellColsClasses (headers, RowsCount) {
        let ret = []
        let tmp = []
        for (let j = 0; j < RowsCount; j++) {
            tmp = []
            for (let h of headers) {
                tmp.push(this.CellClasses(h))
            }
            ret.push(tmp)
        }
        return ret
    }

    // all cells of a certain col get the following classes
    CellClasses (header) {
        // return [LAYOUT_CLASSNAME['Table'], LAYOUT_CLASSNAME['Cell'], LAYOUT_CLASSNAME['ColPrefix'] + header]
        return [this.CellClass_Table(), this.CellClass_Cell(), this.CellClass_Col(header)]
    }

    // class to identify a cell as being a cell
    CellClass_Cell () {
        return LAYOUT_CLASSNAME['Cell']
        }
    
    // class to identify a cell as part of a table
    CellClass_Table () {
        return LAYOUT_CLASSNAME['Table']
        }

    // class to identify a cell as part of a certain colum
    CellClass_Col (header) {
        return LAYOUT_CLASSNAME['ColPrefix'] + header
    }

    Is_headerID(headerID) {
        let check = this.headerID("")
        let rest = headerID.replace(this.header(headerID), "")

        if (check == rest) {
            return true}
        return false
    }

    Is_rowID(divID) {
        let check = this.RowID("")
        let rest = divID.replace(this.row(divID), "")

        if (check == rest) {
            return true}
        return false
    }

    Is_CellID(divID) {
        if (divID.includes(LAYOUT_ID["CellR"]) && divID.includes(LAYOUT_ID["CellC"]) && divID.includes(LAYOUT_ID["CellH"])) {
            if (divID.indexOf(LAYOUT_ID["CellR"])< divID.indexOf(LAYOUT_ID["CellC"]) < divID.indexOf(LAYOUT_ID["CellH"])) {
                return true
            }
        }
        return false
    }
}