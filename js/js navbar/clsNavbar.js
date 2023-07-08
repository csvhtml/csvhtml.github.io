var navEcsv
var navScsv

const CLS_NAVBAR_DOWNLOAD_APPLYFORTAGS = ["</div>", "</a>"]
// ################################################################
// Link to clsNavbar_Calls                                        #
// ################################################################
const CLS_NAV_LEFT = CLS_NAVBAR_CONFIG_LEFT
const CLS_NAV_RIGHT = CLS_NAVBAR__CONFIG_RIGTH
const NAME_NAVBAR_FUNCTIONCALLS = CLS_NAVBAR__CONFIG_LEFT_FUNCTIONCALL
// ################################################################
// Left DropDown Menu                                             #
// ################################################################

class clsNavbar {
/**
 * Handles the page navbar menu
 * Creates File Menu on left side. 
 */
    constructor(Scsv, Ecsv, SS) {
        // this.Calls = new clsNavbar_Calls()
        this.libDD = new libDropDown()
        this.menu = this._initMenu()
        this.Ecsv = Ecsv
        this.Scsv = Scsv
        this.Ssearch = SS

        navEcsv = Ecsv
        navScsv = Scsv
        this.FillMenu()
    }

    DownloadCSV(text) {
        let filename = " .csv"
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        pom.style.display = 'none';
        document.body.appendChild(pom);
        pom.click();
        document.body.removeChild(pom);
    }

    _initMenu() {
        let keys = Object.keys(CLS_NAV_LEFT ) 
        let dicct = {}
        for (let key of keys) {
            dicct[key] = []
            for (let val of CLS_NAV_LEFT [key]) {
                    dicct[key].push(val.split('/', 1)[0])
            }   
        }
        return dicct
    }

    _switchValInMenu(val) {
        let ret = ["divID", "oldVal", "newVal"]
        let keys = Object.keys(CLS_NAV_LEFT ) 
        for (let key of keys) {
            // for (let val of CLS_NAV_LEFT [key]) {
            for (let i = 0; i < CLS_NAV_LEFT [key].length;i++) {
                let valConst = CLS_NAV_LEFT [key][i]
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
        let keys = Object.keys(CLS_NAV_LEFT ) 
        for (let key of keys) {
            for (let val of CLS_NAV_LEFT [key]) {
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

    Change_Switch(key) {
        let ret = NAV._switchValInMenu(key)
        let divID = ret[0]
        let oldVal = ret[1]
        let newVal = ret[2]
        this.libDD.ChangeDropDownVal(divID, oldVal, newVal)
        oldVal = CLS_NAVBAR_FUNCTIONCALL + "('" + ret[1] + "')" 
        newVal = CLS_NAVBAR_FUNCTIONCALL + "('" + ret[2] + "')" 
        this.libDD.ChangeDropDownFunction(divID, oldVal, newVal)
    }
    
    // Create Drop Down Menus and create function call to internal DDLink function
    FillMenu() {
        let keys
        keys = Object.keys(CLS_NAV_LEFT) 
        for (let key of keys) {
            let menu_elements = this.menu[key]
            let menu_elements_FunctonName = []
            for (let key2 of _RemoveBlanksInList(menu_elements)) {
                menu_elements_FunctonName.push(NAME_NAVBAR_FUNCTIONCALLS + "('" + key2 + "')")
            }
            this.libDD.AddDropDownToDiv(
                document.getElementById(key), // html element where drop down elements are created
                menu_elements, // html text 
                menu_elements_FunctonName // functions called
                )  
            }

        keys = Object.keys(CLS_NAV_RIGHT) 
        for (let key of keys) {
            let div = document.getElementById(key)
            if (div != null) {
                if (div.id.includes("download")) {
                    this._FillMenu_InsertOnClick(key, div) 
                }
                if (div.id.includes("input")) {
                    let input2 = document.getElementById(key)
                    input2.addEventListener('change', _ddReadFile)
                    this.libDD.Input_AssignFunction(key, CLS_NAV_RIGHT[key])
                }

            }
        }
    }

    _FillMenu_InsertOnClick(key, div) {
        let divTagHTML = div.outerHTML.replace(div.innerHTML, "")
        for (let tag of CLS_NAVBAR_DOWNLOAD_APPLYFORTAGS) {
            if (divTagHTML.includes(tag)) {
                divTagHTML = divTagHTML.replace(tag, "")
                let New_divTagHTML = divTagHTML.replace(">", 'onclick="' + CLS_NAV_RIGHT[key] + '">')
                
                div.outerHTML = div.outerHTML.replace(divTagHTML, New_divTagHTML)
            }
        }
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

