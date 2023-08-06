// ################################################################
// Config                                                         #
// ################################################################

const CLS_CSV_CELLHANDLER_TEXTAREA_DIVID = "clsCSV-Cell-TextArea"
const CLS_CSV_CELLHANDLER_INPUT_DIVID = "clsCSV-Cell-Input"
const CLS_CSV_CELLHANDLERSAVE_BUTTON_AID = "clsCSV-Cell-SaveButon"

// ################################################################
// Function                                                       #
// ################################################################
class clsCSV_Cell {
    /**
     * Active CSV Cell functions 
     */
    constructor() {
            this.CellDiv = null
            this.Active = false
        }
    
    Set(divID) {
        this.xSet(divID)}

    UnSet(divID) {
        this.xUnSet(divID)}

    ApplyEditMode(divID) {
        this.Set(divID);
        this.xApplyEditMode(divID)}


    ID() {
        return this.CellDiv.id}

    IsActive() {
        return this.Active}

    Row() {
        return this.xRow()
    }

    Col() {
        return this.xCol()
    }
    
    InputValue() {
        let ret = document.getElementById(CLS_CSV_CELLHANDLER_TEXTAREA_DIVID).value
        return this._RefineInvalidChars(ret)}

    Value() {
        let ret = document.getElementById(this.CellDiv).innerHTML
        return this._RefineInvalidChars(ret)}

// ################################################################
// Sub methods                                                    #
// ################################################################

    
    xSet(divID) {
        this.CellDiv = document.getElementById(divID)
        if (this.CellDiv == undefined) {
            this.CellDiv = null
        } else {
            this.Active = true
        }
    }

    xUnSet(divID) {
        this.CellDiv = null
        this.Active = false
    }

    xApplyEditMode(divID) {
            this._ApplyEditMode_CreateTextArea(divID)
            this._ApplyEditMode_SaveButton(divID)
            this._ApplyEditMode_CreateInput(divID)
            
            document.getElementById(CLS_CSV_CELLHANDLER_TEXTAREA_DIVID).focus();
            document.getElementById(CLS_CSV_CELLHANDLER_TEXTAREA_DIVID).select();
            
    }

    _ApplyEditMode_CreateInput(divID) {
        this._RemoveInput()
        
        let input = cINPUT.ReturnInputField({
            id:CLS_CSV_CELLHANDLER_INPUT_DIVID,
            classList: ["form-control", "libInput-NoFileRead"],
            webkitdirectory: true
        })
        this.CellDiv.append(input);
        cINPUT.LinkInputWithFunctions()
    }

    _ApplyEditMode_CreateTextArea(divID) {
        this._RemoveTextArea()

        // this.Set(divID);
        
        let input = this._TextArea()
        // ; input.rows = "5"
        // input.value = this.ActiveCellValue();
        input.value = this.CellDiv.innerHTML
        this.CellDiv.innerHTML = ""
        this.CellDiv.append(input);
        this._InputFiled_AutoHeight();
        // this.layout.div_input = input;
    }

    _ApplyEditMode_SaveButton(TargetdivID) {
        let a = document.createElement('a');
        a.id = CLS_CSV_CELLHANDLERSAVE_BUTTON_AID
        a.href = "#"
        a.setAttribute('onclick', 'SaveCellValue("' + TargetdivID + '")');
        document.getElementById(TargetdivID).append(a)
        cSVG.CreateSVG_FromDivID(CLS_CSV_CELLHANDLERSAVE_BUTTON_AID, "SquareArrowDown")
    }

    xRow() {
        let row = -1; let col = -1
        if (this.ID().includes("R:") && this.ID().includes("C:")) {
            row = parseInt(RetStringBetween(this.ID(),"R:", "C:"))
            col = parseInt(RetStringBetween(this.ID(),"C:", "H:"))
        }
        return row
    }

    xCol() {
        let row = -1; let col = -1
        if (this.ID().includes("R:") && this.ID().includes("C:")) {
            row = parseInt(RetStringBetween(this.ID(),"R:", "C:"))
            col = parseInt(RetStringBetween(this.ID(),"C:", "H:"))
        }
        return col
    }


    _RemoveTextArea() {
        let oldinput  = document.getElementById(CLS_CSV_CELLHANDLER_TEXTAREA_DIVID);
        if (oldinput != undefined) {
            oldinput.remove();}
    }

    _RemoveInput() {
        let oldinput  = document.getElementById(CLS_CSV_CELLHANDLER_INPUT_DIVID);
        if (oldinput != undefined) {
            oldinput.remove();}
    }

    _TextArea() {
        let input = document.createElement('textarea'); 
        input.cols = "50"
        // ; input.rows = "5"
        input.id = CLS_CSV_CELLHANDLER_TEXTAREA_DIVID
        input.classList.add("input-large", "form-control")
        return input
    }

    _InputField() {
    let input = document.createElement("input")
    input.id = CLS_CSV_CELLHANDLER_INPUT_DIVID
    input.type = "file"
    input.classList.add("form-control")
    input.multiple = true
    input.webkitdirectory = true
    return input
    }

    _InputFiled_AutoHeight() {
        if (this.CellDiv != null) {
            this.CellDiv.style.height = (this.CellDiv.scrollHeight)+"px";
        }
    }


    _RefineInvalidChars(val) {
        return myReplace(val, "\n", "\r")
    }

}