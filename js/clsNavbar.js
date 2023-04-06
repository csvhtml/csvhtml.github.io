var navEcsv
var navScsv

class clsNavbar {
    // constructor({csvtext = "", delimiter = ";", egoname = '', TargetDivID = ""}) {
    constructor(egoName, Scsv, Ecsv, SS) {
        this.egoName = egoName
        this.libDD = new libDropDown();
        this.Ecsv = Ecsv
        this.Scsv = Scsv
        this.Ssearch = SS

        navEcsv = Ecsv
        navScsv = Scsv
    }

    // Create Drop Down Menus and create function call to internal DDLink function
    FillMenu() {
        // Left Navbar
        // Edit
        let edit_elements = ["Add Row", "Del Row","Add Col", "Del Col"]
        let fkeyyEdit = []
        for (let keyy of _RemoveBlanksInList(edit_elements)) {
            fkeyyEdit.push(this.egoName + ".DDLink('" + keyy + "')")
        }
        this.libDD.AddDropDownToDiv(
            document.getElementById("nav-Edit"), // html element where drop down elements are created
            "edit", // postfix for parent Drop Down Elelemt
            "nav-", // prefix for parent and children of Drop Down element
            edit_elements, // html text 
            fkeyyEdit // functions called
            )  
        // Mode
        let mode_elements = this.Ecsv.mode.GetModes()
        let fkeyyMode = []
        for (let keyy of _RemoveBlanksInList(mode_elements)) {
            fkeyyMode.push(this.egoName + ".DDLink('" + keyy + "')")
        }
        this.libDD.AddDropDownToDiv(
            document.getElementById("nav-Mode"), 
            "mode", 
            "nav-", 
            mode_elements, 
            fkeyyMode
            )

        // Right Navbar
        // File Input
        this.libDD.AddInputFileAfterDiv({"FormdivID": "form-csv", "EgoID": "File-csv", "accept":".csv", "FunctionToCall": function (a) {DDFileInput(a)}}) 
    }

    // Create Link between DDLink and functions to be called
    DDLink(mode) {
        // Edit
        if (mode == "AddCol") {
            this.Ecsv.AddCol()
            return}
        if (mode == "AddRow") {
            this.Ecsv.AddRow()
            return}
        if (mode == "DelCol") {
            this.Ecsv.DelCol()
            return}
        if (mode == "DelRow") {
            this.Ecsv.DelRow()
            return}
        // Mode
        if (this.Ecsv.mode.GetModes().includes(mode)) {
            this.Ecsv.SetMode(mode)
            this.Ecsv.Print()
            this.Scsv.SetMode(mode)
            this.Scsv.Print()
            return}
    }
}

// ################################################################
// Fill menu Input File global functions                          #
// ################################################################

function DDFileInput(divID) {
    // function DDFileInput() {
        if (divID == "File-csv") {
            looper = [navEcsv]
            if (INDEX_SIDEBEAR) {looper.push(navScsv)}
            for (ele of looper) {
                ele.ReadCSV(cReader.result);
                ele.fileLoaded = true
                ele.Print();
                ele.ToggleLink();
            }
        } 
    }   