const ID_DIVOUT = "ecsvDivOut"
// const cDivOut = document.getElementById("ecsvDivOut");

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

// <div id="ecsvDivOut" style="height: 90vh">       # output element where csv data is printed


class clsCSV {
    constructor({csvtext = "", delimiter = ";", egoname = ''}) {
        this.mode = "standard"
        this.name = egoname
        this.layout = new clsCSVLayout()
        this.userinput = new clsUserInput()
        this.data1x1 = new clsData_1x1()
        this.dataSubSet = new clsData_1x1()
        if (csvtext == "") {
            this.data1x1.headers = ["No.", "Name", "Type", "Tags"];
            this.data1x1.data = [["1", "..", "..", "[]"]];
            this.data1x1.len = 1;
            this._DataSynch()
        } 
        else {
            assert(false)
            this.ReadCSV(csvtext)}
        
        this.sum = -1;          // sum = -1 inactive, sum >=0 sum is active
        // Styles
        
        // this.printMode = 'full'
        this.filterValueEquals = {}
        this.filterCols = []

        this.filterTags = []
        this.filterTypes = []
        this.Print()
    }

    _DataSynch() {
        this.dataSubSet = this.data1x1.Subset({cols: this.filterCols, valueEquals: this.filterValueEquals}) 
        this.headers = this.dataSubSet.headers
        this.data = this.dataSubSet.data
        this.len = this.dataSubSet.len


        // for (let key of Object.keys(MODES)) {
        //     if (this.mode == key) {
        //         this.dataSubSet = this.data1x1.Subset(MODES[key]) 
        //         this.headers = this.dataSubSet.headers
        //         this.data = this.dataSubSet.data
        //         this.len = this.dataSubSet.len
        //     }
        // }

    }

    

    Print() {
        this._DataSynch()
        this.layout._Print(this.headers, this.data, this._RetFilteredRowsIndexList())
    }

    ReadCSV(csvtext, delimiter = ";" ) {
        var str = csvtext.replace(new RegExp('\r\n', "g") , '\n')           // '\r\n' is the standard for new line in windows. for clsCSV plain \n is used as new line
        str = str.replace(new RegExp('"' + delimiter, "g") , delimiter)     // '"' used to make csv xls readable. Not used here
        str = str.replace(new RegExp(delimiter + '"', "g") , delimiter)     // '"' used to make csv xls readable. Not used here
        this.headers = str.slice(0, str.indexOf("\n")).split(delimiter);
        if (!this.headers.includes("No.") && this.mode == "standard") {
            this.VirtualCol_No = true
            this.headers.splice(0,0,"No.")
        } else {
            this.VirtualCol_No = false
        }
        this.data = [];
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");
        this.len = 0;
        for (let row of rows) {
            if (this._IsValidRow(row)) {
                if (this.VirtualCol_No) {
                    row = String(this.len+1) + delimiter + row
                }
                let tmp = row.split(delimiter)
                this.data.push(tmp)
                this.len +=1}
        }
        this.data1x1.headers = this.headers
        this.data1x1.data = this.data
        this.data1x1.len = this.len
        this.layout.FullCSVData(this.data1x1.headers, this.data1x1.data)
    }

    _RetFilteredRowsIndexList() {
        let ret = []
        let returnCondition = this.filterTypes.length == 0 && this.filterTags.length == 0
        if (returnCondition) {
            for (let i = 0; i < this.len; i++) {
                ret.push(i)}
            return ret
        }
        else if (this.filterTypes.length == 0) {
            let jG = this.headers.indexOf("Tags")
            for (let i = 0; i < this.len; i++) {
                for (let k = 0; k < this.filterTags.length; k++) {
                    if (this.data[i][jG].includes(this.filterTags[k])) {
                        ret.push(i)
                        break
                    }
                }
            }
        }
        else if (this.filterTags.length == 0) {
            let jP = this.headers.indexOf("Type")
            for (let i = 0; i < this.len; i++) {
                for (let k = 0; k < this.filterTypes.length; k++) {
                    if (this.data[i][jP] == this.filterTypes[k]) {
                        ret.push(i)
                        break
                    }
                }
            }
        }
        else {
            let jP = this.headers.indexOf("Type")
            let jG = this.headers.indexOf("Tags")
            for (let i = 0; i < this.len; i++) {
                for (let k = 0; k < this.filterTypes.length; k++) {
                    for (let l = 0; l < this.filterTags.length; l++) {
                        if (this.data[i][jP] == this.filterTypes[k] && this.data[i][jG].includes(this.filterTags[k])) {
                            ret.push(i)
                            break
                        }
                    }
                }
            }
        }
        return ret
    }

    SetMode(mode) {
        this.mode = mode
        this.filterValueEquals = MODES[this.mode]["valueEquals"]
        this.filterCols = MODES[this.mode]["cols"]
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
        if (atPosition == -1) {atPosition = this.len}
        let newRow = this.NewRowDefault(atPosition, GetModeValueEquals(this.mode));
        this.data1x1.AddRow(atPosition, newRow)
        // Update Numbering
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
        let raw = this.layout.cellIDs_highlight[0][0]
        let row = parseInt(RetStringBetween(raw,"R:", "C:"))
        let col = parseInt(RetStringBetween(raw,"C:", "H:"))
        return this.data1x1.data[row][col]
    }

    NewRowDefault(atPosition, SetCols = {}) {
        let newRow = []
        if (atPosition == -1) {
            newRow.push(this.len+1)
        } else {
            newRow.push(atPosition+1)}
        
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
        return newRow
    }

    Edit(divID) {
        // this._HighlightCell(divID);
        this.layout.HighlightCell(divID)
        this.Print()
        this._CreateInputField(divID)
        this._svgAppend_Save(divID)
        this._CreateName(divID)
        
        document.getElementById(this.name + "-input").focus();
        document.getElementById(this.name + "-input").select();
    }

    Click(divID) {

        if (this.layout._IDIsOutsideTable(divID)) {
            if (this.layout._IDIsButton(divID) || this.layout._IDIsNavMenu(divID)) {
                return
            } else {
                this.layout.Unhighlight_All()
                this.Print()
                return
            }
        }
        if (this.layout._IDIncludes(divID, ["svg", "-input"]))  {
            return}

        // if (this.layout._IDIncludesInput(divID)) {
        //     return}

        if (divID.includes("tag-")) {
            let tag = RetStringBetween(divID,"tag-","")
            this._toggle_TagFilter(tag)
            this._ToggleTagColor(divID)
        }

        if (divID.includes("type-")) {
            let tag = RetStringBetween(divID,"type-","")
            this._toggle_TypeFilter(tag)
            this._ToggleTagColor(divID)
        }

        if (divID.includes("header-")) {
            this.layout.Unhighlight_All()
            let tag = RetStringBetween(divID,"header-","")
            this.layout.col_highlight[0] = "col-" + tag
            this.Print()
            return
        }
        
        if (divID.includes("R:") && divID.includes("C:")) {
            if (divID.includes("link")) {
                return
            }
            // when row is already clicked then bring cell in edit mode
            let rowID = this.layout.GetRowID(divID)
            if (rowID == this.layout.row_highlight[0]) {
                this.Edit(divID) // no Print here, as Print would result in a read only representattion of the current data
            } else {
                // else highlight (new) row
                this.layout.Unhighlight_All()
                this.layout.HighlightRow(divID)
                this.Print()
            }
            return
        }

        assert(false)

        
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
        let raw = this.layout.cellIDs_highlight[0][0]
        let row = parseInt(RetStringBetween(raw,"R:", "C:"))
        let col = parseInt(RetStringBetween(raw,"C:", "H:"))
        let value = document.getElementById(this.name + "-input").value;

        if (value.includes("\n")) {
            value = value.replace(new RegExp("\n", "g") , "\r")
        }

        this.data1x1.data[row][col] = value;
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
        let ret = '';
        // headers
        for (let header of this.data1x1.headers) {
            ret += header + ';'}
        ret = ret.slice(0, -1)
        ret += "\n"
        //rows
        for (let row of this.data1x1.data) {
            for (let cell of row) {
                if (String(cell).includes("\r")) {
                    // make mult-line readable for xls
                    cell = '"' + cell + '"'
                    cell = cell.replace(new RegExp('\n', "g") , '\r')  // use \r for in cell new line
                }
                ret += cell + ';'}
            ret = ret.slice(0, -1) // remove last seperator. open: length of seperator
            ret += "\n"
        }
        return ret;
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

    _Table_ConfigDispalay() {
      let ret = 'Show/Hide: ';
      for (let header of this.headers) {
        let strr = "ecsv1._Table_ToggleCol('col-" + header + "')"
        ret += '<a id="configheader-' + header + '" href="#" onclick="' + strr + '">' + header + '</a>' + ' . '}
      return ret + "<br/>";
    }

    _Table_ConfigLink() {
      let ret = 'Link: ';
      for (let header of this.headers) {
        let strr = "ecsv1._Table_ToggleLink('col-" + header + "')"
        ret += '<a id="configlink-' + header + '" href="#" onclick="' + strr + '">' + header + '</a>' + ' . '}
      return ret + "<br/>";
    }

    _Table_ConfigImg() {
      let ret = 'Image: ';
      for (let header of this.headers) {
        let strr = "ecsv1._Table_ToggleImg('col-" + header + "')"
        ret += '<a id="configimg-' + header + '" href="#" onclick="' + strr + '">' + header + '</a>' + ' . '}
      return ret + "<br/>";
    }

    _Table_ToggleCol(colname) {
        var cells = document.getElementsByClassName(colname);
        let idx = this.headers.indexOf(RetStringBetween(colname, "col-"))
        for (let cell of cells) {
            if (cell.style.display === "table-cell") {
                this.config[idx] = "ecsvConfig:d-none"
                cell.style.display = "none";
            } else {
                this.config[idx] = "ecsvConfig:d-tablecell"
                cell.style.display = "table-cell";
            }
        }
    }

    ToggleLink(colname = "url") {
        var cells = document.getElementsByClassName("ecsvcell col-" + colname);
        for (let cell of cells) {
            if (cell.innerHTML.includes("://")) {
                cell.innerHTML = this._InnerHTML_ToggleToLink(cell);
            }
          
        }

    }

    _toggle_TypeFilter(tag) {
        if (this.filterTypes.includes(tag)) {
            this.filterTypes.remove(tag)
        } else {
            this.filterTypes.push(tag)
        }
        this.layout.Toggle_Filter("",tag)
        if (this.filterTypes.length == 0) {
            this.printMode = 'full' }
        else {
            this.printMode = '' }
      }

    _toggle_TagFilter(tag) {
        if (this.filterTags.includes(tag)) {
            this.filterTags.remove(tag)
        } else {
            this.filterTags.push(tag)
        }
        this.layout.Toggle_Filter(tag, "")

        if (this.filterTags.length == 0) {
            this.printMode = 'full' }
        else {
            this.printMode = '' }
      }

    _Table_ToggleImg(colname) {
      var cells = document.getElementsByClassName("ecsvcell " + colname);
      for (let cell of cells) {
          cell.innerHTML = this._InnerHTML_ToggleToLImg(cell);
        }
    }
    
    _ToggleTagColor(tagHeaderID) {
        let EgoStyle = "bg-info"
        let element = document.getElementById(tagHeaderID)
        // create JS list
        let classListe = []
        for (let e of element.classList) {
            classListe.push(e)
        }
        if (classListe.includes(EgoStyle)) {
            element.classList.remove(EgoStyle)}
        else {
            element.classList.add(EgoStyle)}
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
        a.innerHTML = '<svg id = "svg-save-edit" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save m-2" viewBox="0 0 16 16"> \
        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 \
        3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/> \
        </svg>'
        div.append(a);
    }

    // _svgText_ArrowDown(header){
    //     let para = "ecsv.layout.DowpDown_ShowHide('" + header + "')"
    //     let param = '"' + para + '"'
    //     return '<a href="#" onclick=' + param + '>\
    //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-square" viewBox="0 0 16 16">\
    //     <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0\
    //      0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>\
    //   </svg></a>'
    // }

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




    // _Print(headers, data, filter) {   // or filtered
    //     // standard use case
    //     var cDivOut = document.getElementById(ID_DIVOUT);
    //     let cols = ["No.", "name", "description", "url", "value", "Type", "Tags"]
    //     let widths = ["1", "15", "38", "15", "5", "5", "10"]
    //     for (let i = 0; i < len(widths); i++) {
    //         widths[i] = 'style="width:' + widths[i] + '%"'}
    //     let colswidth = dicct(cols, widths)

    //     cDivOut.innerHTML = this.layout._AsHTMLTable(headers, colswidth, data , filter)
    //     // if (this.printMode == 'full') {
    //     //     cDivOut.innerHTML = this._AsHTMLTable()
    //     // } else {
    //     //     cDivOut.innerHTML = this._AsHTMLTable(this._RetFilteredRowsIndexList())
    //     // }
        
    //     if (this.mode == "memory") {
    //         let TDs = document.getElementsByTagName("td")
    //         for (let td of TDs) {
    //             td.classList.add("memory-card", "memory-center")
    //         }
    //         let THs = document.getElementsByTagName("th")
    //         for (let th of THs) {
    //             th.classList.add("memory-center")
    //         }
    //     }
            
    //     this.layout.ApplyHighlightToSite()
    // }
