const CLS_CSV_CELLHANDLER_INPUT_DIVID = "clsCSV-CellHandler-InputField"
const CLS_CSV_CELLHANDLERSAVE_BUTTON_AID = "clsCSV-CellHandler-SaveButon"

class clsCSV_CellHandler {
    constructor() {
            this.CellDiv = null
        }
    
    Set(divID) {
        this.CellDiv = document.getElementById(divID)
        if (this.CellDiv == undefined) {
            this.CellDiv = null
        }
    }

    ID() {
        return this.CellDiv.id
    }

    ApplyEditMode(divID) {
            this.ApplyEditMode_CreateInputField(divID)
            this.ApplyEditMode_SaveButton(divID)
            this._CreateName(divID)
            
            document.getElementById(this.name + "-input").focus();
            document.getElementById(this.name + "-input").select();
            
    }

    ApplyEditMode_CreateInputField(divID) {
        this._RemoveInputField()

        this.Set(divID);
        
        let input = this._InputField()
        // ; input.rows = "5"
        // input.value = this.ActiveCellValue();
        input.value = this.CellDiv.innerHTML
        this.CellDiv.innerHTML = ""
        this.CellDiv.append(input);
        this._InputFiled_AutoHeight();
        // this.layout.div_input = input;
    }

    ApplyEditMode_SaveButton(TargetdivID) {
        let a = document.createElement('a');
        a.id = CLS_CSV_CELLHANDLERSAVE_BUTTON_AID
        a.href = "#"
        a.setAttribute('onclick', 'SaveCellValue("' + TargetdivID + '")');
        document.getElementById(TargetdivID).append(a)
        cSVG.CreateSVG_FromDivID(CLS_CSV_CELLHANDLERSAVE_BUTTON_AID, "SquareArrowDown")
    }

    Row() {
        let row = -1; let col = -1
        if (this.ID().includes("R:") && this.ID().includes("C:")) {
            row = parseInt(RetStringBetween(this.ID(),"R:", "C:"))
            col = parseInt(RetStringBetween(this.ID(),"C:", "H:"))
        }
        return row
    }

    Col() {
        let row = -1; let col = -1
        if (this.ID().includes("R:") && this.ID().includes("C:")) {
            row = parseInt(RetStringBetween(this.ID(),"R:", "C:"))
            col = parseInt(RetStringBetween(this.ID(),"C:", "H:"))
        }
        return col
    }


    _RemoveInputField() {
        let oldinput  = document.getElementById(CLS_CSV_CELLHANDLER_INPUT_DIVID);
        if (oldinput != undefined) {
            oldinput.remove();}
        this.CellDiv = null
    }

    _InputField() {
        let input = document.createElement('textarea'); 
        input.cols = "50"
        // ; input.rows = "5"
        input.id = CLS_CSV_CELLHANDLER_INPUT_DIVID
        input.classList.add("input-large", "form-control")
        return input
    }

    _InputFiled_AutoHeight() {
        if (this.CellDiv != null) {
            this.CellDiv.style.height = (this.CellDiv.scrollHeight)+"px";
        }

    }

    InputValue() {
        let ret = document.getElementById(CLS_CSV_CELLHANDLER_INPUT_DIVID).value
        ret = this._RefineInvalidChars(ret)
        return ret
    }

    _RefineInvalidChars(val) {
        let value = val
        if (value.includes("\n")) {
            value = value.replace(new RegExp("\n", "g") , "\r")
        }
        return value
    }



}