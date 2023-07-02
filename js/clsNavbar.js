var navEcsv
var navScsv

// ################################################################
// Left DropDown Menu                                             #
// ################################################################
const NAV_LEFT = {
    // "divID-in-html": [elements, of, the, drop, down]
    "nav-Edit":["Add Row", "Del Row","Add Col", "Del Col"],
    "nav-Mode":["sidebar/no sidebar", "table/list"], // will switch when clicked. example "no sidebar" is clicked, then the menu field changes to "sidebar"
}

class clsNavbar {
/**
 * Handles the page navbar menu
 * Creates File Menu on left side. 
 */
    constructor(egoName, Scsv, Ecsv, SS) {
        this.egoName = egoName
        this.libDD = new libDropDown();
        this.menu = this._initMenu()
        this.Ecsv = Ecsv
        this.Scsv = Scsv
        this.Ssearch = SS

        navEcsv = Ecsv
        navScsv = Scsv
        this.FillMenu()
    }

    _initMenu() {
        let keys = Object.keys(NAV_LEFT) 
        let dicct = {}
        for (let key of keys) {
            dicct[key] = []
            for (let val of NAV_LEFT[key]) {
                    dicct[key].push(val.split('/', 1)[0])
            }   
        }
        return dicct
    }

    _switchValInMenu(val) {
        let ret = ["divID", "oldVal", "newVal"]
        let keys = Object.keys(NAV_LEFT) 
        for (let key of keys) {
            // for (let val of NAV_LEFT[key]) {
            for (let i = 0; i < NAV_LEFT[key].length;i++) {
                let valConst = NAV_LEFT[key][i]
                if (valConst.includes("/")) {
                    ret[0] = key
                    let ping = valConst.split('/', 1)[0] 
                    let pong = valConst.split('/', 2)[1]
                    if (ping == val) {
                        this.menu[key][i] = pong
                        ret[1] = ping
                        ret[2] = pong
                    }
                    if (pong == val) {
                        this.menu[key][i] = ping
                        ret[1] = pong
                        ret[2] = ping
                    }
                }
            }
        }
        return ret
    } 

    _switches() {
    /**
     * Returns all menu entries with switch condition "/" as list of pairs
     */
        let ret = []
        let keys = Object.keys(NAV_LEFT) 
        for (let key of keys) {
            for (let val of NAV_LEFT[key]) {
                if (val.includes("/")) {
                    ret.push(val.split('/'))
                }
            }
        }
        return ret  
    }

    _IsSwitch(key) {
        let switches = this._switches()
        for (let pair of switches) {
            if (pair[0] == key) {
                return true
            }
            if (pair[1] == key) {
                return true
            }
        }
        return false
    }
    
    // Create Drop Down Menus and create function call to internal DDLink function
    FillMenu() {
        let keys = Object.keys(NAV_LEFT) 
        for (let key of keys) {
            let menu_elements = this.menu[key]
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

        // Right Navbar
        // File Input
        this.libDD.AddInputFileAfterDiv({"FormdivID": "form-csv", "EgoID": "File-csv", "accept":".csv", "FunctionToCall": function (a) {DDFileInput(a)}}) 
    }


    // Create Link between DDLink and functions to be called
    DDLink(key) {
        // Switch
        if (this._IsSwitch(key)) {
            let ret = this._switchValInMenu(key)
            let divID = ret[0]
            let oldVal = ret[1]
            let newVal = ret[2]
            this.libDD.ChangeDropDownVal(divID, oldVal, newVal)
        }
        // Edit
        if (key == "AddCol") {
            this.Ecsv.AddCol()
            return}
        if (key == "AddRow") {
            this.Ecsv.AddRow()
            this.Scsv.AddRow()
            return}
        if (key == "DelCol") {
            this.Ecsv.DelCol()
            return}
        if (key == "DelRow") {
            this.Ecsv.DelRow()
            this.Scsv.DelRow()
            return}
        if (key == "sidebar") {
            }

        // Mode
        if (this.Ecsv.mode.GetModes().includes(key)) {
            this.Ecsv.SetMode(key)
            this.XSetBGColor('navMode-dd-' + key, rgbText(104, 187, 227))
            this.Ecsv.Print()
            this.Scsv.SetMode(key)
            this.Scsv.Print()
            return}

        // Mode
        if (key == "Start") {
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