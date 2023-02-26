// ################################################################
// class UserInput                                                #
// ################################################################

class clsUserInput {
    constructor() {
        this.LeftDown = false
        this.RightDown = false
        this.n_down = false
    }
}

// ################################################################
// class CSV                                                      #
// ################################################################

class clsCSV {
    // constructor({csvtext = "", delimiter = ";", egoname = '', TargetDivID = ""}) {
    constructor({egoname = '', TargetDivID = "", Mode = "standard"}) {
        this.fileLoaded = false
        this.name = egoname
        this.TargetDivID = TargetDivID
        this.mode = new clsModes(Mode)
        this.ReadWrite = new clsCSV_ReadWrite()
        this.layout = new clsCSVLayout({"TargetDivID": TargetDivID})
        this.userinput = new clsUserInput()
        this.data1x1 = new clsData_1x1()
        this.dataSubSet = new clsData_1x1()
        this.data1x1.Init_Headers(this.mode.GetCols())
        this.data1x1.data = this.mode.DefaultData()
        this.data1x1.len = 1;
        this._DataSynch()
        this.sum = -1;          // sum = -1 inactive, sum >=0 sum is active

        // if (csvtext == "") {
        //     this.data1x1.Init_Headers(this.mode.GetCols())
        //     this.data1x1.data = this.mode.DefaultData()
        //     this.data1x1.len = 1;
        //     this._DataSynch()
        // } 
        // else {
        //     assert(false)
        //     this.ReadCSV(csvtext)}
        
        
        // // Styles
        
        // this.printMode = 'full'
        this.filterValueEquals = {}  //"Type":[] (obsolete in future)
        this.filterValueIncludes = {} //"Tags":[]
        this.filterCols = []

        // this.filterTags = []
        // this.filterTypes = []
        this.SetMode()
        this.Print()
    }

    SetTargetDiv(TargetDivID) {
        this.TargetDivID = TargetDivID
        this.layout.LayoutTargetDivID = TargetDivID
        this.Print()
    }

    _DataSynch() {
        this.layout.ReadFullCSVData(this.data1x1.headers, this.data1x1.data, this.data1x1.headersConfig)
        this.dataSubSet = this.data1x1.Subset({cols: this.filterCols, valueEquals: this.filterValueEquals, valueIncludes: this.filterValueIncludes}) 
        this.headers = this.dataSubSet.headers
        this.headersConfig = this.dataSubSet.headersConfig
        this.data = this.dataSubSet.data
        this.len = this.dataSubSet.len

    }


    Print() {
        if (this.TargetDivID != "") {
            this._DataSynch()
            this.layout._Print(this.headers, this.data, this.headersConfig)
        }

    }

    ReadCSV(csvtext, delimiter = ";" ) {
        var str = csvtext.replace(new RegExp('\r\n', "g") , '\n')           // '\r\n' is the standard for new line in windows. for clsCSV plain \n is used as new line
        str = str.replace(new RegExp('"' + delimiter, "g") , delimiter)     // '"' used to make csv xls readable. Not used here
        str = str.replace(new RegExp(delimiter + '"', "g") , delimiter)     // '"' used to make csv xls readable. Not used here
        // this.data1x1.headers = str.slice(0, str.indexOf("\n")).split(delimiter);
        this.data1x1.Init_Headers(str.slice(0, str.indexOf("\n")).split(delimiter))
        if (!this.data1x1.headers.includes("No.") && this.mode.activeMode == "standard") {
            this.VirtualCol_No = true
            this.data1x1.headers.splice(0,0,"No.")
        } else {
            this.VirtualCol_No = false
        }
        this.data1x1.data = [];
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");
        this.data1x1.len = 0;
        for (let row of rows) {
            if (this._IsValidRow(row)) {
                if (this.VirtualCol_No) {
                    row = String(this.len+1) + delimiter + row
                }
                let tmp = row.split(delimiter)
                this.data1x1.data.push(tmp)
                this.data1x1.len +=1}
        }
    }
    //SetMode: Applies layout configuration from mode to csv
    
    SetMode(mode = "") {
        if (mode == "") {
            mode = this.mode.activeMode
        } else {
            this.mode.activeMode = mode
        }
        let MODE = this.mode.modes[mode]
        this.filterValueEquals = MODE["valueEquals"]
        this.filterValueIncludes = MODE["valueIncludes"]
        this.filterCols = MODE["cols"]

    }

    AddCol() {
        this.data1x1.AddCol()
        this.Print();
        }  

    DelCol() {
        let colIdx = this.ActiveColIndex()
        this.data1x1.RemoveCol(colIdx)
        this.Print();

    }

    AddRow() {
        let atPosition = this.ActiveRowIndex()
        let newRow = this.NewRowDefault(atPosition, this.mode.GetModeValueEquals());
        if (atPosition == -1) {atPosition = this.len}
        this.data1x1.AddRow(atPosition, newRow)
        // Update Numbering after atPosition
        for (let i = atPosition;i< this.data1x1.len-1;i++) {
            this.data1x1.data[i+1][0] = i + 2}
        this.Print();
    }

    AddRowDict(dict = {}) {
        let atPosition = this.ActiveRowIndex()
        if (atPosition == -1) {
            atPosition = this.len
            if (this.data1x1.headers.includes("No.")) {
                dict["No."] = atPosition+1}
            }
        this.data1x1.AddRowDict(atPosition, dict)
        // Update Numbering after atPosition
        for (let i = atPosition;i< this.data1x1.len-1;i++) {
            this.data1x1.data[i+1][0] = i + 2}
        this.Print();
    }

    DelRow() {
        let atPosition = this.ActiveRowIndex()
        if (atPosition == -1) {atPosition = this.len} else {atPosition -= 1}
        this.data1x1.RemoveRow(atPosition)
        // Update Numbering
        for (let i = atPosition;i< this.data1x1.len;i++) {
            this.data1x1.data[i][0] = i + 1}
        this.Print();
    }

    ActiveRowIndex() {
        if (this.layout.row_highlight[0] == "") {
            return -1 
        } else {
            return parseInt(RetStringBetween(this.layout.row_highlight[0], "row:", "!")) + 1
        }
    }

    ActiveColIndex() {
        if (this.layout.col_highlight[0] == "") {
            return -1 
        } else {
            let colName = RetStringBetween(this.layout.col_highlight[0], "col-", "")
            return this.headers.indexOf(colName)
        }
    }

    ActiveCellValue() {
        let rawID = this.layout.cellIDs_highlight[0][0]
        if (rawID.includes("R:") && rawID.includes("C:")) {
            let row = parseInt(RetStringBetween(rawID,"R:", "C:"))
            let col = parseInt(RetStringBetween(rawID,"C:", "H:"))
            return this.data1x1.data[row][col]}
        if (rawID.includes("header-")) {
            let header = RetStringBetween(rawID,"header-", "")
            return this.data1x1.HeadersRaw(header)
        }

    }

    NewRowDefault(atPosition, SetCols = {}) {
        let newRow = []
        if (atPosition == -1) {
            newRow.push(String(this.len+1))
            for (let i = 1; i < this.data1x1.headers.length; i++) {
                let flag = true
                for (let col of Object.keys(SetCols)) {
                    if (this.data1x1.headers[i] == col) {
                        newRow.push(String(SetCols[col]))
                        flag = false
                        break}}
                if (flag) {
                    newRow.push('..')
                }
            }
        } else {
            newRow.push(String(atPosition+1))
            for (let i = 1; i < this.data1x1.headers.length; i++) {
                newRow.push(String(this.data1x1.data[atPosition-1][i]))}
        }

        return newRow
    }

    Edit(divID) {
        this.layout.HighlightCell(divID)
        this.Print()
        this._CreateInputField(divID)
        this._svgAppend_Save(divID)
        this._CreateName(divID)
        
        document.getElementById(this.name + "-input").focus();
        document.getElementById(this.name + "-input").select();
    }

    Edit_Header(divID) {
        this.layout.HighlightCell(divID)
        this.Print()
        this._CreateInputField(divID)
        this._svgAppend_Save(divID)
        
        document.getElementById(this.name + "-input").focus();
        document.getElementById(this.name + "-input").select();
    }

    Click(div) {
        let divID = ReturnParentUntilID(div).id
        
        let onclickDivs = ElemementsWithOnClickFunctions("id")
        let directlinkDivs = ElemementsWithSubStringInID(["-link", "File-"], "id")
        if (this.layout.IDIncludes(divID, onclickDivs.concat(directlinkDivs))){
            return}
        
        if (!this.layout.DivIsInsideECSV(divID) || this.layout.DivIsInsideECSV(divID) && divID.includes(this.TargetDivID)){
            this.layout.Unhighlight_All()
            this.Print()
            return}

        if (this.layout.DivIsInsideECSV(divID) && divID.includes("header-")){
            if (this.layout.col_highlight[0] == divID.replace("header", "col")) {
                this.Edit_Header(divID) 
            } else {
                this.layout.HighlightCol(divID)
                this.Print()
            }

            return}

        if (this.layout.DivIsInsideECSV(divID) && divID.includes("R:") && divID.includes("C:")) {
            if (this.layout._RowDivID({cellID:divID}) == this.layout.row_highlight[0]) {
                this.Edit(divID) 
            } else {
                this.layout.HighlightRow(divID)
                this.Print()
            }
            return}
        
        
    }


    UnEdit(divID) {
        this.layout.cellIDs_highlight[0][0] = ""
        this.Print()
    }

    SaveEdit() {
        this._SaveCellValueToData()
        this.Print()
    }

    Feature_Sum() {
        if (this.sum == -1) {
            this._SumCalculate()}
        else {
            this.sum = -1;}
        this.Print()
    }

    _Sum_Refresh() {
        this._SumCalculate()
        let Rows = document.getElementsByTagName("tr")
        for (let row of Rows) {
            if (row.classList.contains("csv-sum")) {
                let oldVal = RetStringBetween(row.innerHTML, "Sum: ", ".")
                row.innerHTML = row.innerHTML.replace("Sum: " + oldVal + ".", "Sum: " + this.sum + ".")
            }
        }
    }

    _SumCalculate(colname = "value") {
        var cells = document.getElementsByClassName("ecsvcell col-" + colname);
        let sum = 0;
        for (let cell of cells) {
            if (cell.innerHTML.includes("Sum: ")) {
                continue}
            if (typeof(Number(cell.innerHTML)) == "number" && cell.style.display != "none") {
                sum +=  Number(cell.innerHTML)
            }
          }
        this.sum = sum;
    }

    _CreateInputField(divID) {
        let oldinput  = document.getElementById(this.name + "-input");
        if (oldinput != undefined) {
            oldinput.remove();}

        let div = document.getElementById(divID);
        
        let input = document.createElement('textarea'); input.cols = "50"
        // ; input.rows = "5"
        input.id = this.name + "-input"
        input.classList.add("input-large", "form-control")
        input.value = this.ActiveCellValue();
        div.innerHTML = ""
        div.append(input);
        this.InputFiled_AutoHeight();
        this.layout.div_input = input;
    }

    // inhibited by clsCSV Click (will call a Print that will make onclick disaper)
    _CreateName(divID) {
        let div = document.getElementById(divID);
        let a = document.createElement('a');
        a.id = "save-NAME"
        a.href = "#"
        a.setAttribute('onclick', this.name + '._Prefill_Input()');
        a.innerHTML = '[NAME:]'
        a.style.margin = '5pt'
        div.append(a);
    }

    _Prefill_Input() {
        document.getElementById(this.name + '-input').value += '[NAME:]'
    }

    _SaveCellValueToData(){
        let value = document.getElementById(this.name + "-input").value;
        let rawID = this.layout.cellIDs_highlight[0][0]
        if (rawID.includes("R:") && rawID.includes("C:")) {
            let row = parseInt(RetStringBetween(rawID,"R:", "C:"))
            let col = parseInt(RetStringBetween(rawID,"C:", "H:"))
            if (value.includes("\n")) {
                value = value.replace(new RegExp("\n", "g") , "\r")
            }
            this.data1x1.data[row][col] = value;}
        if (rawID.includes("header-")) {
                let idx = this.headers.indexOf(RetStringBetween(rawID,"header-", ""))
                let headerOld = this.data1x1.headers[idx]
                this.data1x1.headers[idx] = value
                for (let cell of this.layout.cellIDs_highlight) {
                    cell[0] = cell[0].replace(headerOld, value)
                    cell[1] = cell[1].replace(headerOld, value)
                }}
    }

    _RetURL(name) {
        let iName = this.headers.indexOf("name")
        let iURL = this.headers.indexOf("url")
        for (let i = 0; i< this.len;i++) {
            if (this.data[i][iName] == name) {
                return this.data[i][iURL] 
            }
        }
        return ""
    }


    _IsValidRow(row) {
      if (row == "") {
        return false}
      return true;
    }

    _IsConfigRow(dataRow) {
        let ret = true
        if (dataRow.length == this.headers.length && Array.isArray(dataRow)) {
            for (let item of dataRow) {
                if (item.substring(0,11) != "ecsvConfig:") {
                    ret = false}
            } 
        } else {
            ret = false}
        return ret;
    }

    InitConfig() {
        // display
        for (let i = 0; i < this.config.length; i++) {
            if (this.config[i] == "d-none") {
                this._Table_ToggleCol("col-" + this.headers[i])
            }
        }
    }

    _retSumRow(sumcolName = "value") {
        let ret = [];
        for (let col of this.headers) {
            if (col == sumcolName) {
                ret.push("Sum: " + this.sum + ".")
            } else {
                ret.push("")
            }
        }
        return [ret]
    }


    _AsCSV(sep = ";") {
        return this.ReadWrite.WriteToText(this.data1x1.headers,this.data1x1.data,sep)
  }

    _ConfigAsCSVRow(sep = ";") {
        let ret = '';
        //row
        for (let cell of this.config) {
            ret += cell + ';'}
        ret = ret.slice(0, -1)// remove last seperator. open: length of seperator
        ret += "\n"
        return ret;
    }

    // obsolete. in future repalce by layout. _Replace_Link
    ToggleLink(colname = "url") {
        var cells = document.getElementsByClassName("ecsvcell col-" + colname);
        for (let cell of cells) {
            if (cell.innerHTML.includes("://")) {
                cell.innerHTML = this._InnerHTML_ToggleToLink(cell);
            }
          
        }

    }

    _Table_ToggleImg(colname) {
      var cells = document.getElementsByClassName("ecsvcell " + colname);
      for (let cell of cells) {
          cell.innerHTML = this._InnerHTML_ToggleToLImg(cell);
        }
    }
    

    _Style(classname, styleDict) {
        var elements = document.getElementsByClassName(classname);
        for (let e of elements) {
            for (const key in styleDict)                // why const ?
            e.style[key] = styleDict[key];
          }
      }

    _InnerHTML_ToggleToLink(cell) {
        if (cell.innerHTML.includes("<a href=")){
            return cell.innerText}
        else {
            let id = 'id = "' + cell.id + '-link"'  
            return '<a ' + id + ' href="' + cell.innerText +'" target = "#">' + cell.innerText + '</a>'}
    }

    _InnerHTML_ToggleToLImg(cell) {
      if (cell.innerHTML.includes("<img src=")){
          return cell.innerHTML.slice(cell.innerHTML.indexOf('src="')+5,cell.innerHTML.indexOf('"></a>'))}
      else {
          let id = 'id = "' + cell.id + '-link"'  
          return '<a ' + id + ' href="' + cell.innerText +'"><img src="' + cell.innerText + '" height="80"></a>'}
    }

    _GetColValues(colname) {
        let tmp = []
        if (this.headers.includes(colname)) {
            let idx = this.headers.indexOf(colname)
            for (let row of this.data) {
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

    CellValue(rowIndex, colName) {
        let j = this.data1x1.headers.indexOf(colName)
        if (j > -1) {
            return this.data1x1.data[rowIndex][j]
        }
        return null
    }

    Row_Down() {
        let row = parseInt(RetStringBetween(this.layout.row_highlight[0], "row:", "!"))
        if (row < this.len) {
            let tmp = this.data[row];
            this.data[row] = this.data[row+1];
            this.data[row+1] = tmp;
            this.layout.row_highlight[0] = "row:" + String(parseInt(row) + 1) + "!"
            this.data[row][0] = parseInt(this.data[row][0])-1
            this.data[row+1][0] = parseInt(this.data[row+1][0])+1
            this.Print();
        }

    }

    Row_Up() {
        let row = parseInt(RetStringBetween(this.layout.row_highlight[0], "row:", "!"))
        if (row > 0) {
            let tmp = this.data[row];
            this.data[row] = this.data[row-1];
            this.data[row-1] = tmp;
            this.layout.row_highlight[0] = "row:" + String(parseInt(row) - 1) + "!"
            this.data[row][0] = parseInt(this.data[row][0])+1
            this.data[row-1][0] = parseInt(this.data[row-1][0])-1
            this.Print();
        }
    }

    Col_Left() {
        let col = RetStringBetween(this.layout.col_highlight[0], "col-", "")
        let idx = this.headers.indexOf(col)
        for (let row of this.data) {
            let tmp = row[idx-1];
            row[idx-1] = row[idx];
            row[idx] = tmp;
        }
        let tmp = this.headers[idx-1];
        this.headers[idx-1] = this.headers[idx]
        this.headers[idx] = tmp;
        this.Print();
    }

    Col_Right() {
        let col = RetStringBetween(this.layout.col_highlight[0], "col-", "")
        let idx = this.headers.indexOf(col)
        for (let row of this.data) {
            let tmp = row[idx+1];
            row[idx+1] = row[idx];
            row[idx] = tmp;
        }
        let tmp = this.headers[idx+1];
        this.headers[idx+1] = this.headers[idx]
        this.headers[idx] = tmp;
        this.Print();
    }

// ################################################################
// Add HTML Elements                                              #
// ################################################################

    // AddDropDownMenuFromValues(header, values){
    //     var tags = []; var prefix = ""; var thisFilter = []
    //     if (header == "Type") {
    //         tags = values;prefix = "type-";thisFilter = this.filterTypes}
    //     if (header == "Tags") {
    //         tags = values;prefix = "tag-";thisFilter = this.filterTags}
    //     let ret = '<div class="dropdown-menu ' + header + '">'

    //     for (let tag of tags) {
    //         if (thisFilter.includes(tag)) {
    //             ret += '<a id="' + prefix + tag + '" class="dropdown-item bg-info" href="#">' + tag + '</a>'} 
    //         else {
    //             ret += '<a id="' + prefix + tag + '" class="dropdown-item" href="#">' + tag + '</a>'}  
    //     }

    //     return ret
    // }

    _svgAppend_Save(divID) {
        let div = document.getElementById(divID);
        let a = document.createElement('a');
        a.id = "save-edit"
        a.href = "#"
        a.setAttribute('onclick', this.name + '.SaveEdit()');
        a.innerHTML = '<svg id = "svg-save-edit" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-save m-2" viewBox="0 0 16 16"> \
        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 \
        3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/> \
        </svg>'
        div.append(a);
    }


// ################################################################
// Events                                         #
// ################################################################

    ButtonClick(event){
        // "ESC"
        if (event.isComposing || event.keyCode === 27) {
            this.layout.Unhighlight_All();
            this.Print();
        }
        console.log(event.keyCode)
        if (this.layout.InputIsActive() == false){
            // "w"
            if (event.keyCode === 87) {
                this.Row_Up();}
            // "s"
            if (event.keyCode === 83) {
                this.Row_Down();}
                     // "s"
            if (event.keyCode === 65) {
                this.Col_Left();}
            // "s"
            if (event.keyCode === 68) {
                this.Col_Right();}
            // // "a"
            // if (event.isComposing || event.keyCode === 65) {
            //     this.AddRow();}
            // // "c"
            // if (event.isComposing || event.keyCode === 67) {
            //     this.AddRowCopy();}
        }
        if (this.layout.InputIsActive()){
            if (this.userinput.LeftDown) {
                //
            }
        }
        console.log(event.keyCode)
    }

    InputFiled_AutoHeight(event) {
        let element = document.getElementById(this.name + "-input")
        if (element == undefined) {
            return 
        }
        element.style.height = (element.scrollHeight)+"px";
    }

    MouseOver(event) {
        console.log("Mouse over " + event.srcElement.id)
    }
}
