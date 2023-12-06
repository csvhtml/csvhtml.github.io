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
    "nav-Data":[
        "Template",
        "Data",
        "TestData",
    ],
}

// In the Button Part (RIGHT), functions are called directly. Either via string name or via function reference
const CLS_NAVBAR__CONFIG_RIGHT = {
    // "nav-input": clsNavbar_Call_Input,      // input must be reference to function
    "nav-download-csv": "clsNavbar_Call_Download_CSV()",     // download must be string of function name
    "nav-download-json": "clsNavbar_Call_Download_JSON()"     // download must be string of function name
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

    if (CLS_NAVBAR_CONFIG_LEFT["nav-Data"].includes(key)) {
        PAGE["MyCSV"].UpdateNavMiddleInfo(key)
        PAGE["MyCSV"].ActiveJSON = key
        PAGE["MyCSV"].ReadWrite.ReadfromJSON(key)
        PAGE["MyCSV"].Print();
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

 


