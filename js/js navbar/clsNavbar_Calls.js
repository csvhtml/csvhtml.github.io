const CLS_NAVBAR_FUNCTIONCALL = "clsNavbar_Call"  // name of main function called. See last function at bottom


// ################################################################
// Page specfic nav bar properties                                #
// ################################################################

const CLS_NAVBAR_CALLS = {
    // "divID-in-html": [elements, of, the, drop, down]
    "nav-Edit":[
        "Add Row", 
        "Del Row",
        "Add Col", 
        "Del Col"],
    "nav-Mode":["sidebar/no sidebar", "table/list"], // will switch when clicked. example "no sidebar" is clicked, then the menu field changes to "sidebar"
}

function _clsNavbar_Call_Functions(key) {
    if (key == "Add_Col") {
        PAGE["MyCSV"].AddCol()
        return}

    if (key == "Add_Row") {
        PAGE["MyCSV"].AddRow()
        PAGE["MySidebar"].AddRow()
        return}

    if (key == "Del_Col") {
        this.Ecsv.DelCol()
        return}

    if (key == "Del_Row") {
        PAGE["MyCSV"].DelRow()
        PAGE["MySidebar"].DelRow()
        return}

    if (key == "sidebar") {
            }
}

    // // Mode
    // if (this.Ecsv.mode.GetModes().includes(key)) {
    //     this.Ecsv.SetMode(key)
    //     this.XSetBGColor('navMode-dd-' + key, rgbText(104, 187, 227))
    //     this.Ecsv.Print()
    //     this.Scsv.SetMode(key)
    //     this.Scsv.Print()
    //     return}

    // // Mode
    // if (key == "Start") {
    //     HTTP.GetCSV("Start", NAVcallback)
    //     console.log("Hallo Mario")
    //     // this.Ecsv.DelRow()
    //     return}


// ################################################################
// Main function called                                           #
// ################################################################

// This is the main function calleed when a nav btton is clicked.
// This function must be outside the navbar lib, to make it globally callable from the index.html (otherwise the instances name needs to be knwon)
function clsNavbar_Call(key) {
    assert(CLS_NAVBAR_FUNCTIONCALL==arguments.callee.name)
    if (NAV._IsSwitch(key)) {
        NAV.Change_Switch(key)
    }
    _clsNavbar_Call_Functions(key)
}