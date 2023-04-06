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
            "navEdit-", // prefix for parent and children of Drop Down element
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
            "navMode-", 
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
            this.XSetBGColor('navMode-dd-' + mode, rgbText(104, 187, 227))
            this.Ecsv.Print()
            this.Scsv.SetMode(mode)
            this.Scsv.Print()
            return}
    }

    XSetBGColor(divID, rgb) {
        if (divID.includes("navMode-dd-")) {
            let allMenuChildrenIDs = ElemementsWithSubStringInID(["navMode-dd-"], "id")
            for (let id of allMenuChildrenIDs) {
                if (id == divID) {
                    document.getElementById(id).style.backgroundColor = rgb
                } else {
                    document.getElementById(id).style.backgroundColor = null
                }
            }
        }
    }
}

// ################################################################
// Fill menu Input File global functions                          #
// ################################################################

// this function cant be a class member, because it is called outside its scope
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


// ###############################################################################
// Save Download Button                                                          #
// ###############################################################################

function download_saveData() {
    let text = ecsv._AsCSV()
    let filename = " .csv"
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.style.display = 'none';
    document.body.appendChild(pom);
    pom.click();
    document.body.removeChild(pom);
}