class clsCSV_Layout_AsHTML {
    constructor(clsLayoutNames) {
        this.headers = []
        this.data = [[]]
        this.headersConfig = []
        
        this.Names = clsLayoutNames
    }

    List(rows) {
        let link = ""
        let text = ""
        if (this.headers.indexOf("url") >-1) {
            if (this.headers.indexOf("img") >-1) {
                return this._AsHTMLList_BuildList_ImgLink(rows, "url", "img")
            } else if (this.headers.indexOf("Name") >-1) {
                return this._AsHTMLList_BuildList_NameLink(rows, "url")
            } else {
                console.log("Error Layout: csv does not include Name or img")
            }
        } else {
            if (this.headers.indexOf("img") >-1) {
                
            } else if (this.headers.indexOf("Name") >-1) {

            } else {
                console.log("Error Layout: csv does not include Name or img")
            }
        }
    }

    _AsHTMLList_BuildList_NameLink(rows, ColLink) {
        let ret = '<ul>';
        let idxL = this.headers.indexOf(ColLink)
        let idxN = this.headers.indexOf("Name")
        let link = ""
        for (let row of rows) {
            if (row[idxL].slice(0,1) == "[" && row[idxL].slice(-1) == "]") {
                link = RetStringBetween(row[idxL],"[", "]")
                ret += '<li>' + this._HREF(row[idxN], link, "li-" + row[idxN]) + '</li>'
                ret += ' | '
            }
        }
        ret += '</ul>';
        return ret
    }

    _AsHTMLList_BuildList_ImgLink(rows, ColLink, ColImg) {
        let ret = '<ul>';
        let idxImg = this.headers.indexOf(ColImg)
        let idxL = this.headers.indexOf(ColLink)
        let imgText = ""

        for (let row of rows) {
            // ret += '<li><a href="' + this._Replace_Link(row[idxL]) + '"> ' + row[idxN] + ' </a></li>'
            if (row[idxImg].length > 5) {
                imgText = row[idxImg]
            } else {
                imgText = ""}
            
            ret += '<li>' + this._Replace_Link(row[idxL], "", imgText) + '</li>'
            ret += ' | '
        }
        ret += '</ul>';
        return ret
    }

    Table(cols, headersConfig, rows) {
        let tableX = {
            tableClasses: ["table"], 
            theadClasses: ["ecsvtable"], 
            tableStyles: ["margin-bottom:0"]
        }
        let headerX = {
            thsText: cols, 
            thsID:this.Names.headersID(cols), 
            thsClasses:this.Names.headersClasses(cols), 
            thsWidth:this.Names.headersWidth(cols)
        }
        let htm = cHTML.TableHeader(tableX, headerX)
        let ret = this._xxManipulateHeaderByConfig(htm, cols, headersConfig)
        
        //row body
        let ROWSX = {
            rowsID:this.Names.RowIDs(rows.length), 
            rowsClasses:[]
        }
        let CELLX = {
            cellsText:this._HTMLReadableData(rows), 
            CellIDs:this.Names.CellsID(cols, rows.length), 
            cellsClasses:this.Names.CellColsClasses(cols, rows.length)
        }
        ret += cHTML.TableBody(cols.length, ROWSX, CELLX)
        return ret;
    }

    _xxManipulateHeaderByConfig(HTML, cols, colsConfig) {
        let retIns = ""; let ret = HTML
        for (let col of cols) {
            if (colsConfig[col].indexOf("dropdown") >-1) {
                retIns = ' ' + this._svgText_ArrowDown(col)
                retIns += this._AddDropDownMenuFromValues(col)
                ret = ret.replace(col + "</th>", col + retIns + "</th>")}
        }
        return ret
    }

    _AddDropDownMenuFromValues(header){
        var prefix = header + "-"
        let ret = '<div class="dropdown-menu ' + header + '">'
        for (let tag of this._GetColValues(header)) {
            // if (filter.includes(tag)) {
            //     ret += '<a id="' + prefix + tag + '" class="dropdown-item bg-info" href="#">' + tag + '</a>'} 
            // else {
                ret += '<a id="' + prefix + tag + '" class="dropdown-item" href="#">' + tag + '</a>'
            // }  
        }

        return ret
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

    _svgText_ArrowDown(header){
        let para = "Layout_DowpDown_ShowHide('" + header + "')"
        let param = '"' + para + '"'
        return '<a id = "a-ArrowDown-' + header + '" href="#" onclick=' + param + '>\
        <svg id = "svg-ArrowDown-' + header + '" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-down-square" viewBox="0 0 16 16">\
        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0\
         0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>\
      </svg></a>'
    }

    TableHeaderOnly(cols, headersConfig) {
        let ret = this._AsHTMLTableHeader(cols, headersConfig)

        // row body end
        ret += '</tbody>'
        // table end
        ret += '</table>'

        return ret;
    }

    _AsHTMLTableHeader(cols, headersConfig) {
        let tableX = {tableClasses: ["table"], headerClasses: ["ecsvtable"], tableStyles: ["margin-bottom:0"]}
        let IDX = this.Names.headersID(cols)
        let ClX = this.Names.headersClasses(cols)
        let WHX = this.Names.headersWidth(cols)
        let headerX = {colsText: cols, colsID:IDX, colsClasses:ClX, colsWidth:WHX}
        
        let htm = cHTML.TableHeader(tableX, headerX)
        let ret = this._xxManipulateHeaderByConfig(htm, cols, headersConfig)
        return ret
    }

    _HTMLReadable(dataString) {
        let HTMLString = dataString
        if (String(HTMLString).includes("\r")) {
            HTMLString = HTMLString.replace(new RegExp('\r', "g") , '<br>')  // use \r for in cell new line
        }
        return HTMLString
    }

    _HTMLReadableData(dataArray) {
        let array1D = []
        let array2D = []; let tmp2D = []
        if (Array.isArray(dataArray)) {
            for (let i = 0; i<dataArray.length; i++) {
                if (Array.isArray(dataArray[i])) {
                    // 2D Array
                    for (let j = 0; j<dataArray[i].length; j++) {
                        tmp2D.push(this._HTMLReadable(dataArray[i][j]))}
                    array2D.push(tmp2D)
                    tmp2D = []
                } else {
                    // 2D Array
                    array1D.push(this._HTMLReadable(dataArray[i]))
                }
            }
        }
        assert(array1D.length == 0 || array2D.length == 0)
        if (array1D.length>0) {return array1D}
        if (array2D.length>0) {return array2D}
        return dataArray
    }
}