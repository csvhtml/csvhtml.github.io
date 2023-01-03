// ################################################################
// class CSV Layout                                               #
// ################################################################

class clsCSVLayout {
    constructor() {
        this.cellIDs_highlight = [["", ""], ["", ""]]   // cells that shall be highlighted. fist value is the internal value. Second value is representing the current state of the  site. The secondvalue will be changed by Print()
        this.row_highlight = ["", ""]                   //Row that is currently selected. First is targeted value, second is currently displayed value and can only be changed by Print()
        this.col_highlight = ["", ""] 
        this.div_input = null                           // current text area for user input
        this.filterDD = {
            "Tags": [],
            "Type": []
        }
        
        this.headers = []
        this.data = [[]]

    }

    FullCSVData(headers, data) {
        // read only
        this.headers = headers
        this.data = data
    }

    Toggle_Filter(tag = "", type = "") {
        if (tag == "" && type == "") {
            return}
        if (tag != "") {
            this.filterDD["Tags"].toggle(tag)
            }
        if (type != "") {
            this.filterDD["Type"].toggle(type)
        }
    }

    ApplyHighlightToSite () {
        for (let row of this.row_highlight) {
            if (row == ID_DIVOUT) {
                row = ""}
        }
        //Highlithing Cells
        for (let cell of this.cellIDs_highlight) {
            if (cell[0] == "" && cell[1] != "") {
                document.getElementById(cell[1]).classList.remove("table-info")}
            if (cell[0] != "" && cell[1] == "") {
                document.getElementById(cell[0]).classList.add("table-info")}
            cell[1] = cell[0]
        }

         
        //Highlithing Rows
        if (this.row_highlight[0] == "") {
            if (this.row_highlight[1] != "") {
                document.getElementById(this.row_highlight[1]).classList.remove("table-info")}
        } else {
            document.getElementById(this.row_highlight[0]).classList.add("table-info")}
        this.row_highlight[1] = this.row_highlight[0]

        //Highlithing Cols
        if (this.col_highlight[0] == "") {
            if (this.col_highlight[1] != "") {
                var colcells = document.getElementsByClassName("ecsvcell " + this.col_highlight[1]);
                for (let colcell of colcells) {
                    colcell.classList.remove("table-info")}}
        } else {
            var colcells = document.getElementsByClassName(this.col_highlight[0]);
            for (let colcell of colcells) {
                colcell.classList.add("table-info")}
        this.col_highlight[1] = this.col_highlight[0]
        }

        // Highlight Tags/Types
    }

    AddDropDownMenuFromValues(header, values, filter){
        var tags = []; var prefix = "";
        if (header == "Type") {
            prefix = "type-"}
        if (header == "Tags") {
            prefix = "tag-"}
        let ret = '<div class="dropdown-menu ' + header + '">'

        for (let tag of values) {
            if (filter.includes(tag)) {
                ret += '<a id="' + prefix + tag + '" class="dropdown-item bg-info" href="#">' + tag + '</a>'} 
            else {
                ret += '<a id="' + prefix + tag + '" class="dropdown-item" href="#">' + tag + '</a>'}  
        }

        return ret
    }

    _Print(headers, data, filter) {   // or filtered
        // standard use case
        var cDivOut = document.getElementById(ID_DIVOUT);
        let cols = ["No.", "name", "description", "url", "value", "Type", "Tags"]
        let widths = ["2", "15", "38", "15", "5", "5", "10"]
        for (let i = 0; i < len(widths); i++) {
            widths[i] = 'style="width:' + widths[i] + '%"'}
        let colswidth = dicct(cols, widths)

        cDivOut.innerHTML = this._AsHTMLTable(headers, colswidth, data , filter)
        // if (this.printMode == 'full') {
        //     cDivOut.innerHTML = this._AsHTMLTable()
        // } else {
        //     cDivOut.innerHTML = this._AsHTMLTable(this._RetFilteredRowsIndexList())
        // }
        
        if (this.mode == "memory") {
            let TDs = document.getElementsByTagName("td")
            for (let td of TDs) {
                td.classList.add("memory-card", "memory-center")
            }
            let THs = document.getElementsByTagName("th")
            for (let th of THs) {
                th.classList.add("memory-center")
            }
        }
            
        this.ApplyHighlightToSite()
    }

    
    _AsHTMLTable(cols, colswidth, rows, listRowsIdx) {
        let ret = '<table class="table"><thead><tr>';
        // table header
        for (let header of cols) {
            ret += '<th id = "header-' + header + '" class="ecsvtable col-' + header + '" '+ colswidth[header] +'>' + header
            if (["Type", "Tags"].includes(header) ) {
                ret += " " + this._svgText_ArrowDown(header)
                ret += this.AddDropDownMenuFromValues(header, this._GetColValues(header, cols, rows), this.filterDD[header])}
            ret += '</th>'}
        ret += '</tr></thead>'
        
        //row body
        ret += '<tbody>'
        //rows
        var rowidx = -1;
        // build data table
        for (let row of rows) {
            // rowidx += 1
            rowidx = parseInt(row[0])-1
            var i = -1;
            // if (listRowsIdx.includes(rowidx)) {
                ret += '<tr id="row:' + rowidx + '!">';
                for (let cell of row) {
                    i += 1;
                    if (String(cell).includes("\r")) {
                        cell = cell.replace(new RegExp('\r', "g") , '<br>')  // use \r for in cell new line
                    }
                    cell = this._Replace_NAME(cell)
                    ret += '<td id="R:' + rowidx + 'C:' + i + 'H:' + cols[i] + '" class="ecsvtable col-' + cols[i] + ' ecsvcell">' + cell + '</td>'
                }
              ret += '</tr>'
            // }
        }

        // row body end
        ret += '</tbody>'
        // table end
        ret += '</table>'

        return ret;
    }

    InputIsActive() {
        if (this.cellIDs_highlight[0][1] == "") {
            return false}
        else {
            return true}
    }

    GetDiv_InputCell() {
        if (this.cellIDs_highlight[0][0] != "") {
            return document.getElementById(this.cellIDs_highlight[0][0]);
        }
    }

    Unhighlight_All() {
        for (let cellID_highlight of this.cellIDs_highlight) {
            cellID_highlight[0] = ""
        }
        this.row_highlight[0] = ""
        this.col_highlight[0] = ""
    }

    HighlightRow(divID) {
        // if row is not higlichted, then highlight row
        if (divID.includes("row:") || divID.includes("R:")) {
            this.row_highlight[0] = this.GetRowID(divID)
        }
        
        // else if row is already highlighted then edit mode
    }

    HighlightCol(colClass) {
        // if row is not higlichted, then highlight row
        if (colClass.includes("col-")) {
            this.col_highlight[0] = colClass
        }
        
        // else if row is already highlighted then edit mode
    }

    GetRowID(divID) {
        return "row:" + RetStringBetween(divID, "R:", "C:") + "!"
    }

    _IDIsInsideTable(divID) {
        if (this._IDIncludes(divID, ["R:", "header-", "tag-", "type-", "-input", "svg-", "save-edit"]))
            {return true}
        return false
    }

    _IDIncludes(divID, keys) {
        for (let key of keys) {
            if (divID.includes(key)) {
                return true
            }
        }
        return false
    }


    _IDIsButton(divID) {
        if (divID.includes("btn")) {
            return true}
        return false
    }
    
    _IDIsNavMenu(divID) {
        if (divID.includes("nav-")) {
            return true}
        return false
        }

    _IDIsInsideHeader(divID) {
        if (divID.includes("header-")) {
            return true
        }
        return false
    }

    _IDIsOutsideTable(divID) {
        return !this._IDIsInsideTable(divID)
    }

    _svgText_ArrowDown(header){
        let para = "Layout_DowpDown_ShowHide('" + header + "')"
        let param = '"' + para + '"'
        return '<a href="#" onclick=' + param + '>\
        <svg id = "svg-ArrowDown-' + header + '" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-square" viewBox="0 0 16 16">\
        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0\
         0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>\
      </svg></a>'
    }

    _GetColValues(colname, cols, rows) {
        let tmp = []
        if (cols.includes(colname)) {
            let idx = cols.indexOf(colname)
            for (let row of rows) {
                if (colname == "Tags") {
                    let tags = RetStringBetween(row[idx], "[", "]")
                    tags = tags.replace(new RegExp(', ', "g") , ',') 
                    let tmptmp = tags.split(",")
                    for (let tmp3 of tmptmp) {
                        if (!tmp.includes(tmp3)) {
                            tmp.push(tmp3)}
                    }
                } else {
                    if (!tmp.includes(row[idx])) {
                        tmp.push(row[idx])}
                }
            }
        }
        tmp.sort()  
        return tmp
    }

    _Replace_NAME(value) {
        for (let i = 0; i< 100;i++) {
            if( typeof value === 'string') {
                if (value.indexOf("[NAME:")!=-1) {
                    let name = RetStringBetween(value,"[NAME:", "]")
                    let url = this._RetURL(name)
                    let rpl = '<a href="' + url + '" target="_blank">' + name + '</a>'
                    value = value.replace("[NAME:" + name + "]" , rpl)
                }
            }
        }
        return value
    }

    _RetURL(name) {
        let iName = this.headers.indexOf("Name")
        let iURL = this.headers.indexOf("url")
        for (let i = 0; i< this.data.length;i++) {
            if (this.data[i][iName] == name) {
                return this.data[i][iURL] 
            }
        }
        return ""
    }
    
}

function Layout_DowpDown_ShowHide(className) {
    let elements = document.getElementsByClassName("dropdown-menu " + className)
    for (let element of elements) {
        if (element.style.display != "block" ) {
            element.style.display = "block";
        }
        else {
            element.style.display = "none"; 
        }
    }
}