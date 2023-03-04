// ################################################################
// class CSV Layout                                               #
// ################################################################

class clsCSVLayout {
    constructor({TargetDivID = ""}) {
        this.LayoutTargetDivID = TargetDivID
        this.cellIDs_highlight = [["", ""], ["", ""]]   // cells that shall be highlighted. fist value is the internal value. Second value is representing the current state of the  site. The secondvalue will be changed by Print()
        this.row_highlight = ["", ""]                   //Row that is currently selected. First is targeted value, second is currently displayed value and can only be changed by Print()
        this.col_highlight = ["", ""] 
        this.div_input = null                           // current text area for user input
        
        this.filter_dropdown = {
            // "Tags": [],
            // "Type": []
        }
        
        this.headers = []
        this.data = [[]]
        this.headers_dropdown = [] //(obsolete)
        this.headersConfig = []
    }

    ReadFullCSVData(headers, data, headersConfig) {
        // data
        this.headers = headers
        this.data = data
        // config
        this.headersConfig = headersConfig
        for (let i =0; i<this.headersConfig.length;i++) {
            if (this.headersConfig[i] == "dropdown") {
                if(!this.filter_dropdown.hasOwnProperty(this.headers[i])) {
                    this.filter_dropdown[this.headers[i]] = []
                }
            }
        }
    }

    _GetDropDownHeaders() {
        let ret = []
        for (let header of this.headers) {
            if (header.includes("[dropdown]")) {
                let head = header.replace(" [dropdown]", "")
                head = head.replace("[dropdown]", "")
                ret.push(head)
            }
        }
        return ret
    }

    Toggle_Filter(tag = "", type = "") {
        if (tag == "" && type == "") {
            return}
        if (tag != "") {
            this.filter_dropdown["Tags"].toggle(tag)
            }
        if (type != "") {
            this.filter_dropdown["Type"].toggle(type)
        }
    }

    ApplyHighlightToSite () {
        let hclass = "table-info"
        for (let row of this.row_highlight) {
            if (row == this.LayoutTargetDivID) {
                row = ""}
        }

        for (let cell of this.cellIDs_highlight) {
            if (cell[0] == "" && cell[1] != "") {
                document.getElementById(cell[1]).classList.removeX(hclass)}
            if (cell[0] != "") {
                document.getElementById(cell[0]).classList.addX(hclass)}
            cell[1] = cell[0]
        }

         
        //Highlithing Rows
        if (this.row_highlight[0] == "") {
            if (this.row_highlight[1] != "") {
                document.getElementById(this.row_highlight[1]).classList.remove(hclass)}
        } else {
            document.getElementById(this.row_highlight[0]).classList.add(hclass)}
        this.row_highlight[1] = this.row_highlight[0]

        //Highlithing Cols
        if (this.col_highlight[0] == "") {
            if (this.col_highlight[1] != "") {
                var colcells = document.getElementsByClassName("ecsvcell " + this.col_highlight[1]);
                for (let colcell of colcells) {
                    colcell.classList.remove(hclass)}}
        } else {
            var colcells = document.getElementsByClassName(this.col_highlight[0]);
            for (let colcell of colcells) {
                colcell.classList.add(hclass)}
        this.col_highlight[1] = this.col_highlight[0]
        }

        // Highlight Tags/Types
    }

    AddDropDownMenuFromValues(header){
        var prefix = header + "-"
        let ret = '<div class="dropdown-menu ' + header + '">'
        let filter =  this.filter_dropdown[header]
        for (let tag of this._GetColValues(header)) {
            if (filter.includes(tag)) {
                ret += '<a id="' + prefix + tag + '" class="dropdown-item bg-info" href="#">' + tag + '</a>'} 
            else {
                ret += '<a id="' + prefix + tag + '" class="dropdown-item" href="#">' + tag + '</a>'}  
        }

        return ret
        // var tags = []; var prefix = "";
        // if (header == "Type") {
        //     prefix = "type-"}
        // if (header == "Tags") {
        //     prefix = "tag-"}
        // let ret = '<div class="dropdown-menu ' + header + '">'

        // for (let tag of values) {
        //     if (filter.includes(tag)) {
        //         ret += '<a id="' + prefix + tag + '" class="dropdown-item bg-info" href="#">' + tag + '</a>'} 
        //     else {
        //         ret += '<a id="' + prefix + tag + '" class="dropdown-item" href="#">' + tag + '</a>'}  
        // }

        // return ret
    }

    _Print(headers, data, headersConfig) {   // or filtered
        // standard use case
        var cDivOut = document.getElementById(this.LayoutTargetDivID);
        let colswidth = this._GetColsWidthDictionary(headers)

        cDivOut.innerHTML = this._AsHTMLTable(headers, headersConfig, colswidth, data)
        
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

    _GetColsWidthDictionary(headers) {
        let widths = []
        for (let header of headers) {
            let w = "15"
            if (header == "No.") {w = "2"}
            if (header == "Name") {w = "15"}
            if (header == "Description") {w = "38"}
            widths.push('style="width:' + w + '%"')
        }
        ret = dicct(headers, widths)
        return ret
    }

    
    _AsHTMLTable(cols, headersConfig, colswidth, rows) {
        let ret = '<table class="table"><thead><tr>';
        // table header
        for (let i = 0; i < cols.length; i++) {
            let header = cols[i]
            let config = headersConfig[i]
            ret += '<th id = "header-' + header + '" class="ecsvtable col-' + header + '" '+ colswidth[header] +'>' + header
            if (config == "dropdown") {
                ret += " " + this._svgText_ArrowDown(header)
                ret += this.AddDropDownMenuFromValues(header)}
            ret += '</th>'
        }
        ret += '</tr></thead>'
        
        //row body
        ret += '<tbody>'
        //rows
        var rowidx = "";
        // build data table
        for (let row of rows) {
            // rowidx += 1
            // rowidx = parseInt(row[0])-1
            rowidx = row[0]  // "No." col
            var i = -1;
                ret += '<tr id="' + this._RowDivID({rowidx:rowidx}) + '">';
                for (let cell of row) {
                    i += 1;
                    // let id = "R:" + rowidx + "C:" + i + "H:" + cols[i]
                    let id = this._CellDivID({rowIdx: rowidx,colIdx:i.toString(), cols:cols})
                    if (String(cell).includes("\r")) {
                        cell = cell.replace(new RegExp('\r', "g") , '<br>')  // use \r for in cell new line
                    }
                    cell = this._Replace_NAME(cell)
                    cell = this._Replace_Link(cell, id)
                    // ret += '<td id="R:' + rowidx + 'C:' + i + 'H:' + cols[i] + '" class="ecsvtable col-' + cols[i] + ' ecsvcell">' + cell + '</td>'
                    ret += '<td id="' + id + '" class="ecsvtable col-' + cols[i] + ' ecsvcell">' + cell + '</td>'
                }
              ret += '</tr>'
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
        assert(divID.includes("R:") || "row:")
        this.Unhighlight_All()
        // this.row_highlight[0] = this.GetRowID(divID)
        this.row_highlight[0] = this._RowDivID({cellID:divID})
    }


    HighlightCol(divID) {
        assert(divID.includes("header-"))
        this.Unhighlight_All()
        this.col_highlight[0] = "col-" + RetStringBetween(divID,"header-","")
    }

    HighlightCell(divID) {
        assert(this.row_highlight[0] + this.col_highlight[0] != "")
        if (divID.includes("R:") && divID.includes("C:")) {
            this.cellIDs_highlight[0][0] = divID;
            this.row_highlight[0] = "";
        }
        if (divID.includes("header-")) {
            this.cellIDs_highlight[0][0] = divID;
            this.col_highlight[0] = "";
        }
    }

    // GetRowID(divID) {
    //     return "row:" + RetStringBetween(divID, "R:", "C:") + "!"
    // }

    DivIsInsideNavbar(divID) {
        let element = document.getElementById(divID)
        if (DivIsDescendantOf(element,"navbar"))
            {return true}
        return false
    }
    
    DivIsInsideECSV(divID) {
        let element = document.getElementById(divID)
        if (DivIsDescendantOf(element,this.LayoutTargetDivID))
            {return true}
        return false
    }

    IDIncludes(divID, keys) {
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
        return '<a id = "a-ArrowDown-' + header + '" href="#" onclick=' + param + '>\
        <svg id = "svg-ArrowDown-' + header + '" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-down-square" viewBox="0 0 16 16">\
        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0\
         0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>\
      </svg></a>'
    }

    _GetColValuesX(colname, cols, rows) {
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

    _GetColValues(header, delim = ",") {
        assert(this.headers.includes(header))
        let tmp = []
        let idx = this.headers.indexOf(header)
        for (let row of this.data) {
            if (row[idx][0] === "[" && row[idx][row[idx].length-1] === "]") {
                let tags = RetStringBetween(row[idx], "[", "]")
                tags = tags.replace(new RegExp(delim + ' ', "g") , delim)
                let tmptmp = tags.split(delim)
                for (let tmp3 of tmptmp) {
                    tmp.pushX(tmp3)}
            } else {
                tmp.pushX(_byVal(row[idx]))}
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
                    let rpl = '<a id="reftoNAME-'+ name + '" href="' + url + '" target="_blank">' + name + '</a>'
                    value = value.replace("[NAME:" + name + "]" , rpl)
                }
            }
        }
        return value
    }

    _Replace_Link(value, idStr) {
        // for (let i = 0; i< 100;i++) {
            if(typeof value === 'string') {
                for (let i = 0; i < 10; i++) {
                    if (value.indexOf("[file:")!=-1) {
                        let link = RetStringBetween(value,"[", "]")
                        let linkB = "[" + link + "]"
                        let id = 'id = "' + idStr + '-link"' 
                        let text = link.replace(new RegExp("%20", "g") , " ") 
                        let rpl = '<a ' + id + ' href="' + link + '" target = "#">' + text + '</a>'
                        value = value.replace(linkB, rpl)}
                    if (value.indexOf("[http:")!=-1 || value.indexOf("[https:")!=-1) {
                        let link = RetStringBetween(value,"[", "]")
                        let linkB = "[" + link + "]"
                        let id = 'id = "' + idStr + '-link"' 
                        let text = link.replace(new RegExp("%20", "g") , " ") 
                        let rpl = '<a ' + id + ' href="' + link + '" target = "#">' + text + '</a>'
                        value = value.replace(linkB, rpl)}
                    }
                }
            // }
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

    // Return RowDivID based on rowIdex or CellID
    _RowDivID({rowidx= "", cellID = ""}) {
        assert(rowidx||cellID)
        assert(rowidx == "" || cellID == "")
            
        if (cellID) {
            rowidx = RetStringBetween(cellID, "R:", "C:")
        }
        let egoname = '[' + this.LayoutTargetDivID + '] '
        return egoname + 'row:' + rowidx + '!'
        // return '[' + this.LayoutTargetDivID + '] row:' + rowidx + '!'
        
    }

        // Return CellDivID based on rowIdex and col or colIdx
    _CellDivID({rowIdx= "", colIdx = "", col = "", cols = []}) {
        assert(rowIdx)
        assert(colIdx||col)
        assert(colIdx == "" || col == "")
        assert(cols.length>0)
        
        let egoname = '[' + this.LayoutTargetDivID + '] '
        if (colIdx) {
            return egoname + "R:" + rowIdx + "C:" + colIdx + "H:" + cols[colIdx]}
        if (col) {
            colIdx = cols.indexOf(col)
            assert(colIdx>-1)
            return egoname + "R:" + rowIdx + "C:" + colIdx + "H:" + col}
        assert(false)
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

function Layout_toggleClass(divID, className) {
        let element = document.getElementById(divID)
        let classListe = []
        for (let e of element.classList) {
            classListe.push(e)}
        if (classListe.includes(className)) {
            element.classList.remove(className)}
        else {
            element.classList.add(className)}
    }