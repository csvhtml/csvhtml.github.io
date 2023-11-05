// ################################################################
// Config                                                         #
// ################################################################

// const LIB_INPUT_FUNCTIONMAPPING2 = {
//     "nav-input": clsNavbar_Call_Input,
//     "clsCSV-Cell-Input": clsCSV_ParseFileNameToTextArea, 
// }
// const LIB_INPUT_NOFILEREAD2 = "libInput-NoFileRead" // in case the input field has this class, then the uploaded file content is not read (and only the files path is saved)

// ################################################################
// Functionality                                                  #
// ################################################################

// Provides Funtionalites to create standatrd html text blocks (usally used for innerHTML or outerHTML), e. g. tables

class libHTML {
    constructor() {
    }

    TableHeader(tableDict, headerDict) {
        return this.xTableHeader(tableDict, headerDict)
    }

    TableBody(tableDict, headerDict, rowDict, cellDict) {
        return this.xTableBody(tableDict, headerDict, rowDict, cellDict)
    }



    xTableHeader({tableID="", tableClasses = [], tableStyles = [], theadClasses = []}, 
        {thsText=["strA", "strB"], thsID= ["strA", "strB"], thsClasses= [["strA", "strB"], ["strA", "strB"]], thsWidth= ["0","0"]}) {
        
        if (IsEqualList(thsText,["strA", "strB"])) {thsText=[]}
        if (IsEqualList(thsID,["strA", "strB"])) {thsID=[]}
        if (IsEqualList(thsClasses,[["strA", "strB"], ["strA", "strB"]])) {thsClasses=[]}
        if (IsEqualList(thsWidth,["0","0"])) {thsWidth=[]}

        assert(thsText.length > 0)
        assert(thsID.length == 0 || thsID.length == thsText.length)
        assert(thsClasses.length == 0 || thsClasses.length == thsText.length)
        assert(thsWidth.length == 0 || thsWidth.length == thsText.length)

        let ret = '<table '
        ret += this._idHTMLString(tableID)
        ret += this._classesHTMLString(tableClasses)
        ret += this._stylesHTMLString(tableStyles)
        ret += '>'

        // header tag
        ret += '<thead '
        ret += this._classesHTMLString(theadClasses)
        ret +='>'

        // row tag
        ret += this._rowHTMLString('th', '', thsText, thsID, thsClasses, this._StylesFromWidths(thsWidth))
        ret += '</thead>'
        return ret
    }

    xTableBody(colsLength,
        {rowsID=["strA", "strB"], rowsClasses= [["strA", "strB"], ["strA", "strB"]]},
        {cellsText=[["strA", "strB"], ["strA", "strB"]], CellIDs = [["strA", "strB"], ["strA", "strB"]], cellsClasses = [[["strA", "strB"], ["strA", "strB"]], [["strA", "strB"], ["strA", "strB"]]]}) {
        
        if (IsEqualList(rowsID, ["strA", "strB"])) {rowsID=[]}
        if (IsEqualList(rowsClasses,[["strA", "strB"], ["strA", "strB"]])) {rowClasses=[]}
        if (IsEqualList(cellsText,[["strA", "strB"], ["strA", "strB"]])) {cellsText=[]}
        if (IsEqualList(CellIDs,[["strA", "strB"], ["strA", "strB"]])) {CellIDs=[]}
        if (IsEqualList(cellsClasses,[[["strA", "strB"], ["strA", "strB"]], [["strA", "strB"], ["strA", "strB"]]])) {cellsClasses=[]}
            
        assert(colsLength > 0)
        assert(cellsText.length > 0)
        assert(rowsID.length == 0 || rowsID.length == cellsText.length)
        assert(rowsClasses.length == 0 || rowsClasses.length == cellsText.length)
        assert(CellIDs.length == 0 || CellIDs.length == cellsText.length)
        assert(cellsClasses.length == 0 || cellsClasses.length == cellsText.length)
        for (let i = 0; i < cellsText.length; i++) {
            assert(cellsText[i].length == colsLength)
            if (CellIDs.length > 0) {
                assert(CellIDs[i].length == colsLength)}
            if (cellsClasses.length > 0) {
                assert(cellsClasses[i].length == colsLength)}
        }
        

        let ret = '<tbody>'
        for (let i = 0; i< cellsText.length; i++) {
            ret += this._rowHTMLString('td', rowsID[i], cellsText[i], CellIDs[i], cellsClasses[i], [])}
        ret += '</tbody>'

        return ret;
    }

    _rowHTMLString(tx, rowid, cells, cellsid, cellsclasses, cellsstyles) {
        // row tag
        // let ret = '<tr>'
        let ret = '<tr' + ' '
        ret += this._idHTMLString(rowid)
        ret += '>'
        for (let i = 0; i < cells.length; i++) {
            ret += '<' + tx + ' '
            if (cellsid.length > 0) {
                ret += this._idHTMLString(cellsid[i])
            }
            if (cellsclasses.length > 0) {
                ret += this._classesHTMLString(cellsclasses[i])
            }
            if (cellsstyles.length > 0) {
                // cellsstyles
                ret += this._stylesHTMLString(cellsstyles[i])
            }
            ret += '>' + cells[i] + '</' + tx +'>'
        }
        ret += '</tr>'
        return ret
    }

    _idHTMLString(idName) {
        let ret = ""
        if (idName.length > 0) {
            ret += 'id="' + idName + '" '
        }
        return ret 
    }

    _classesHTMLString(classes) {
        let ret = ""
        if (classes.length > 0) {
            ret += 'class="'
            for (let cls of classes) {
                ret += cls + ' '}
            ret = ret.slice(0,-1) + '" '
        }
        return ret 
    }

    _stylesHTMLString(styles) {
        let ret = ""
        if (styles.length > 0) {
            ret += 'style="'
            for (let styl of styles) {
                ret += styl + ';'}
            ret += '"'
        }
        return ret
    }

    _StylesFromWidths(widths, currentStyles = []) {
        assert (widths.length>0) 
        assert (currentStyles.length == 0 || currentStyles.length == currentStyles.length)
        let ret = []
        for (let i = 0; i< widths.length; i++) {
            ret.push(['width:' + widths[i] + '%'])
        }
        if (currentStyles.length>0) {
            //to be fixed 
            for (let i = 0; i< ret; i++) {
                ret[i] = [currentStyles[i], ret[i]]
            }
        }
        return ret
    }

}
