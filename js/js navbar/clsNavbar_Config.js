// ################################################################
// Page specfic nav bar properties                                #
// ################################################################
// In the Drop Down part (LEFT), alsways the same function is called with different parameters
const CLS_NAVBAR_CONFIG_LEFT_FUNCTIONCALL = "clsNavbar_Call_DropDown"
const CLS_NAVBAR_CONFIG_LEFT = {
    "nav-Edit":[
        "Add Row", 
        "Del Row",
        "Add Col", 
        "Del Col"
    ],
    "nav-Mode":[
        "sidebar/no sidebar", 
        "table/list"
    ],
}

// In the Button Part (RIGHT), functions are called directly. Either via string name or via function reference
const CLS_NAVBAR__CONFIG_RIGHT = {
    "nav-input": clsNavbar_Call_Input,      // input must be reference to function
    "nav-download": "clsNavbar_Call_Download()"     // download must be string of function name
}

function clsNavbar_Config_FunctionCall(key) {
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
        cParameter.set("sidebar", true)
        main_Layout()}

    if (key == "no_sidebar") {
        cParameter.set("sidebar", false)
        main_Layout()}
}

    // // Mode
    // if (this.Ecsv.mode.GetModes().includes(key)) {   GetModes() to be replaced
    //     this.Ecsv.SetMode(key)
    //     this._XSetBGColor('navMode-dd-' + key, rgbText(104, 187, 227))
    //     this.Ecsv.Print()
    //     this.Scsv.SetMode(key)
    //     this.Scsv.Print()
    //     return}

 


// ################################################################
// Main function call                                             #
// ################################################################

// This is the main function calleed when a nav btton is clicked.
// This function must be outside the navbar lib, to make it globally callable from the index.html (otherwise the instances name needs to be knwon)

// const CLS_NAVBAR_DOWNLOADCALL = "clsNavbar_Call_Download"  // name of main function called for download button. See bottom

function clsNavbar_Call_DropDown(key) {
    assert(CLS_NAVBAR_CONFIG_LEFT_FUNCTIONCALL==arguments.callee.name)

    if (NAV.IsSwitch(key)) {
        NAV.Change_Switch(key)}

    clsNavbar_Config_FunctionCall(key)
}

function clsNavbar_Call_Download() {
    DownloadCSV(PAGE["MyCSV"]._AsCSVText())
}

function clsNavbar_Call_Input() {
    for (let X of [PAGE["MyCSV"],PAGE["MySidebar"]]) {
        X.ReadCSV(cReader.result);
        X.Print();
        X.ToggleLink();
    }
} 