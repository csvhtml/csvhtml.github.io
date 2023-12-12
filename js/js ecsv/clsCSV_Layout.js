// ################################################################
// class CSV Layout                                               #
// ################################################################

class clsCSV_Layout {
    constructor(parent, {TargetDivID = "", mode = null, log = null}) {
        this.parent = parent
        this.headers = []
        this.data = [[]]
        this.headersConfig = []

        this.LayoutTargetDivID = TargetDivID
        this.cellIDs_highlight = [["", ""], ["", ""]]   // cells that shall be highlighted. fist value is the internal value. Second value is representing the current state of the  site. The secondvalue will be changed by Print()
        this.row_highlight = ["", ""]                   // Row that is currently selected. First is targeted value, second is currently displayed value and can only be changed by Print()
        this.col_highlight = ["", ""]                   // identified via class, that is shared among all cells and the ehader of the col

        this.mode = mode
        this.log = log

        this.Names = new clsCSV_Layout_Naming(TargetDivID)
        this.AsHTML = new clsCSV_Layout_AsHTML(this.Names)
    }

    DataSynch(headers, data, headersConfig) {
        this.xDataSynch(headers, data, headersConfig)
    }

    ApplyHighlightToSite () {
        this.xApplyHighlightToSite()
    }

    Unhighlight_All() {
        this.xUnhighlight_All()
    }

    HighlightRow(divID) {
        this.xHighlightRow(divID)
    }

    HighlightCol(divID) {
        this.xHighlightCol(divID)
    }

    HighlightCell(divID) {
        this.xHighlightCell(divID)
    }

    DivIsInsideECSV(divID) {
        return this.xDivIsInsideECSV(divID)
    }

    IDIncludes(divID, keys) {
        for (let key of keys) {
            if (divID.includes(key)) {
                return true}}
        return false
    }

    ScrollToHighlight() {
        this.xScrollToHighlight()
    }

    Print(headers, data, headersConfig) {
        this.xPrint(headers, data, headersConfig)
    }

    PrintList(data) {
        this.xPrintList(data)
    }

    PrintHeader(headers, headersConfig) {
        this.xPrintHeader(headers, headersConfig)
    }


    xDataSynch(headers, data, headersConfig) {
        this.headers = headers
        this.AsHTML.headers = headers
        this.data = data
        this.AsHTML.data = data
        this.headersConfig = headersConfig
        this.AsHTML.headersConfig = headersConfig
    }


    xApplyHighlightToSite () {
        if (this.mode.ActiveCSVLayout() == "table") {
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
            this._ApplyHighlightToSite_Rows(hclass)

            //Highlithing Cols
            if (this.col_highlight[0] == "") {
                if (this.col_highlight[1] != "") {
                    var colcells = document.getElementsByClassName(LAYOUT_CLASSNAME['Cell'] + " " + this.col_highlight[1]);
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
    }

    _ApplyHighlightToSite_Rows(hclass) {
        if (this.row_highlight[0] == "") {
            if (this.row_highlight[1] != "") {
                let div = document.getElementById(this.row_highlight[1])
                if (div) {
                    div.classList.remove(hclass)}
                else {
                    console.log("_ApplyHighlightToSite_Rows: Error 1")}
                }
        } else {
            let div = document.getElementById(this.row_highlight[0])
            if (div) {
                div.classList.add(hclass)}
            else {
                console.log("_ApplyHighlightToSite_Rows: Error 2")}
        }

        this.row_highlight[1] = this.row_highlight[0]
    }

    xPrint(headers, data, headersConfig) {
        let egoDiv = document.getElementById(this.LayoutTargetDivID);
        headers = this.parent.config2.ColsVisible()
        data = this.parent.data1x1.Data(headers)

        headersConfig = this.parent.config2.HeadersConfig()
        egoDiv.innerHTML = this.AsHTML.Table(headers, headersConfig, data)    
        this.ApplyHighlightToSite()
    }

    xPrintList(data) {   // or filtered
        // standard use case
        var egoDiv = document.getElementById(this.LayoutTargetDivID);

        egoDiv.innerHTML = this.AsHTML.List(data, "Name")
            
        this.ApplyHighlightToSite()
    }

    xPrintHeader(headers, headersConfig) {   // or filtered
        // standard use case
        let egoDiv = document.getElementById(this.LayoutTargetDivID);

        egoDiv.innerHTML = this.AsHTML.TableHeaderOnly(headers, headersConfig)
            
    }

    xUnhighlight_All() {
        for (let cellID_highlight of this.cellIDs_highlight) {
            cellID_highlight[0] = ""
        }
        this.row_highlight[0] = ""
        this.col_highlight[0] = ""
    }

    xHighlightRow(divID) {
        assert(divID.includes("R:") || divID.includes("row:"))
        if (divID.indexOf("[") == -1 && divID.indexOf("[") == -1) {
            divID = "[" + this.LayoutTargetDivID + "] " + divID
        }
        this.Unhighlight_All()
        this.row_highlight[0] = this._DivIDTableRow({cellID:divID})
        
        this.log.Add({
            "action": "HighlightRow",
            "parameters": [],
            "divIDSource": divID, 
            "divIDTarget": this.row_highlight[0]
         })
    }


    xHighlightCol(headerID) {
        assert(this._IsHeaderID(headerID))
        let header = this.Names.header(headerID)
        this.Unhighlight_All()
        this.col_highlight[0] = this.Names.CellClass_Col(header)
    }

    _IsHeaderID(divID) {
        if (divID.includes(LAYOUT_ID['HeaderPrefix']) && divID.includes(LAYOUT_ID['HeaderPostfix'])) {
            return true}
        return false
    }

    xHighlightCell(divID) {
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
    
    xDivIsInsideECSV(divID) {
        let element = document.getElementById(divID)
        if (DivIsDescendantOf(element, this.LayoutTargetDivID))
            {return true}
        return false
    }

    // _Replace_NAME(value) {
    //     for (let i = 0; i< 100;i++) {
    //         if( typeof value === 'string') {
    //             if (value.indexOf("[NAME:")!=-1) {
    //                 let name = RetStringBetween(value,"[NAME:", "]")
    //                 let url = this._LookUp("Name", name, "url")
    //                 let nummer = this._LookUp("Name", name, "No.")

    //                 let rpl = '<a id="reftoNAME-'+ name + '" href="' + url + '" target="_blank">(' + nummer + ') ' + name + '</a>'
    //                 value = value.replace("[NAME:" + name + "]" , rpl)
    //             }
    //         } 
    //     }
    //     return value
    // }
    _HREF(name, link, id = "") {
        if (id == "") {
            id = name}

        if (link.indexOf("[http:") == 0 || link.indexOf("[https:") == 0) {
            let ret = '<a ' + id + ' href="' + link + '" target = "#">' + name + '</a>'
            return ret} 
        if (link.indexOf("[file:") == 0) {
            let ret = '<a ' + id + ' href="' + link + '" target = "#">' + name + '</a>'
            return ret}   
        if (link.length > 5 && name.length > 3) {
            let ret = '<a ' + id + ' href="' + link + '" target = "#">' + name + '</a>'
            return ret}  
        if (link.length > 5) {
            let ret = '<a href="' + link + '" target = "#">' + link + '</a>'
            return ret}  
        return ".."   
    }   

    _Replace_Link(value, idStr, imgLink = "") {
        // for (let i = 0; i< 100;i++) {
        if(typeof value === 'string') {
            let text = ""
            for (let i = 0; i < 10; i++) {
                if (value.indexOf("[NAME:")!=-1) {
                    let name = RetStringBetween(value,"[NAME:", "]")
                    let url = this._LookUp("Name", name, "url")
                    if (url.indexOf("[/")!=-1) {
                        url = RetStringBetween(url,"[/", "]")
                        url = this.mode.CSVFilePath() + "/" + url
                    }
                    let nummer = this._LookUp("Name", name, "No.")

                    let rpl = '<a id="reftoNAME-'+ name + '" href="' + url + '" target="_blank">(' + nummer + ') ' + name + '</a>'
                    value = value.replace("[NAME:" + name + "]" , rpl)
                }
                if (value.indexOf("[file:")!=-1) {
                    let link = RetStringBetween(value,"[file:", "]")
                    let linkB = "[file:" + link + "]"
                    let id = 'id = "' + idStr + '-link"' 
                    text = link.replace(new RegExp("%20", "g") , " ") 
                    let fileName = FileNameFromPath(text)
                    let rpl = '<a ' + id + ' href="' + link + '" target = "#">' + fileName + '</a>'
                    value = value.replace(linkB, rpl)}
                if (value.indexOf("[http:") == 0 || value.indexOf("[https:") == 0) {
                    let link = RetStringBetween(value,"[", "]")
                    let linkB = "[" + link + "]"
                    let id = 'id = "' + idStr + '-link"' 
                    text = link.replace(new RegExp("%20", "g") , " ") 
                    let rpl = '<a ' + id + ' href="' + link + '" target = "#">' + text + '</a>'
                    value = value.replace(linkB, rpl)}
                if (value.indexOf("[/")!=-1)  {
                    let link = RetStringBetween(value,"[/", "]")
                    text = link.replace(new RegExp("%20", "g") , " ") 
                    let linkB = "[/" + link + "]"
                    link = this.mode.CSVFilePath() + "/" + link
                    let id = 'id = "' + idStr + '-link"' 
                    let rpl = '<a ' + id + ' href="' + link + '" target = "#">' + text + '</a>'
                    value = value.replace(linkB, rpl)}
                }

            if (imgLink) {
                imgLink = RetStringBetween(imgLink,"[", "]")
                let imgText = '<img height="30" src="' + imgLink + '">' 
                // value = value.replace(text, imgText) bugfix in RetSringBetween
                value = value.replace(text +"]", imgText)
            }
        }

        // }
        return value
    }
        
        
    _LookUp(lookCol, lookValue, returnCol) {
            let iLook = this.headers.indexOf(lookCol)
            let iReturn = this.headers.indexOf(returnCol)
            if (iLook > -1 && iReturn > -1) {
                for (let i = 0; i< this.data.length;i++) {
                    if (this.data[i][iLook] == lookValue) {
                        return this.data[i][iReturn] 
                    }
                }
            }
            return ""
    }

    // Returns RowDivID
    _DivIDTableRow({rowidx= "", cellID = ""}) {
        assert(rowidx||cellID)
        assert(rowidx == "" || cellID == "")
            
        if (cellID) {
            if (cellID.includes("R:")) {
                rowidx = RetStringBetween(cellID, "R:", "C:")}
            if (cellID.includes("row:")) {
                rowidx = RetStringBetween(cellID, "row:", "!")}
            assert(ValidChars("0123456789", rowidx))
        }   

        return this._DivIDTableRow_FromIndex(rowidx)        
    }

    _DivIDTableRow_FromIndex(indexAsString) {
        let divID = LAYOUT_ID['RowPrefix'] + indexAsString + LAYOUT_ID['RowPostfix']
        return this._TableDivID_With_Prefix(divID)
    }

    // Returns CellDivID
    _DivIDTableCell({rowIdx= "", colIdx = "", col = "", cols = []}) {
        assert(rowIdx)
        assert(colIdx||col)
        assert(colIdx == "" || col == "")
        assert(cols.length>0)
        

        if (col) {
            colIdx = cols.indexOf(col)
            assert(colIdx>-1)
        }

        let divID = LAYOUT_ID["CellR"] + rowIdx + LAYOUT_ID["CellC"] + colIdx + LAYOUT_ID["CellH"] + cols[colIdx]
        return this._TableDivID_With_Prefix(divID)
    }

    _TableDivID_With_Prefix(divID) {
        let prefix = '[' + this.LayoutTargetDivID + '] '
        if (divID.includes(prefix)) {
            return divID}
        else {
            return prefix + divID
        }
    }

    xScrollToHighlight() {
        if (this.row_highlight[0] != "") {
            var element = document.getElementById(this.row_highlight[0]);
        }
        if(element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })}
      }

    IsActive(divID) {
        if (this._DivIDTableRow({cellID:divID}) == this.row_highlight[0]) {
            return true}
        else {
            return false}
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



// ################################################################
// test                                                           #
// ################################################################
function test_Layout() {
    test_Layout_LookUp()

    return 0// 32 assertions in this file (and should all be catched)
}

function test_Layout_LookUp() {
    let fname = arguments.callee.name;
    layoutt = new clsCSV_Layout("FakeTargetDivID")

    let headers = ["A", "B", "C", "D"]
    let data = [["A1", "B1", "C1", "D1"],["A2", "B2", "C2", "D2"],["A3", "B3", "C3", "D3"]]
    let dataConfig = []
    layoutt.ReadFullCSVData(headers, data, dataConfig)

    for (val of ["1", "2", "3"]) {
        testEqual(layoutt._LookUp("A", "A"+val, "B"), "B"+val, fname)
    }
    
    
}