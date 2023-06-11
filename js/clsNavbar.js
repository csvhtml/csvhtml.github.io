var navEcsv
var navScsv

// ################################################################
// Left DropDown Menu                                             #
// ################################################################
const NAV_LEFT = {
    // "divID-in-html": [element, of, the drop, down]
    "nav-Edit":["Add Row", "Del Row","Add Col", "Del Col"],
}

class clsNavbar {
/**
 * Handles the page navbar menu
 * Creates File Menu on left
 */
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
        let keys = Object.keys(NAV_LEFT) 
        for (let key of keys) {
            let menu_elements = NAV_LEFT[key]
            let menu_elements_FunctonName = []
            for (let key2 of _RemoveBlanksInList(menu_elements)) {
                menu_elements_FunctonName.push(this.egoName + ".DDLink('" + key2 + "')")
            }
            this.libDD.AddDropDownToDiv(
                document.getElementById(key), // html element where drop down elements are created
                menu_elements, // html text 
                menu_elements_FunctonName // functions called
                )  
            }

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
        this.XSetBGColor('navMode-dd-' + this.Ecsv.mode.activeMode, rgbText(104, 187, 227))
        
        // Feature
        let feat_elements = ["Start"]
        let fkeyyFeat = []
        for (let keyy of _RemoveBlanksInList(feat_elements)) {
            fkeyyFeat.push(this.egoName + ".DDLink('" + keyy + "')")
        }
        this.libDD.AddDropDownToDiv(
            document.getElementById("nav-Features"), // html element where drop down elements are created
            "feat", // postfix for parent Drop Down Elelemt
            "navfeature-", // prefix for parent and children of Drop Down element
            feat_elements, // html text 
            fkeyyFeat // functions called
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

        // Mode
        if (mode == "Start") {
            HTTP.GetCSV("Start", NAVcallback)
            console.log("Hallo Mario")
            // this.Ecsv.DelRow()
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

function NAVcallback(text) {
    ecsv.ReadCSV(text)
    ecsv.fileLoaded = true
    ecsv.Print();
    ecsv.ToggleLink();
}

// ################################################################
// Fill menu Input File global functions                          #
// ################################################################

// this function cant be a class member, because it is called outside its scope
function DDFileInput(divID) {
    // function DDFileInput() {
        if (divID == "File-csv") {
            looper = [navEcsv]
            if (cParameter.get("sidebar")) {looper.push(navScsv)}
            // if (boolSIDEBEAR) {looper.push(navScsv)}
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