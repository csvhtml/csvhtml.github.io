// ################################################################
// Page specfic nav bar properties                                #
// ################################################################

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

const CLS_NAVBAR__CONFIG_RIGTH = {
    "nav-input": "clsNavbar_Call_Input()",
    "nav-download": "clsNavbar_Call_Download()"
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

 


// ################################################################
// Main function call                                             #
// ################################################################

// This is the main function calleed when a nav btton is clicked.
// This function must be outside the navbar lib, to make it globally callable from the index.html (otherwise the instances name needs to be knwon)

const CLS_NAVBAR_FUNCTIONCALL = "clsNavbar_Call_DropDown"  // name of main function called. See bottom
const CLS_NAVBAR_DOWNLOADCALL = "clsNavbar_Call_Download"  // name of main function called for download button. See bottom

function clsNavbar_Call_DropDown(key) {
    assert(CLS_NAVBAR_FUNCTIONCALL==arguments.callee.name)

    if (NAV._IsSwitch(key)) {
        NAV.Change_Switch(key)}

    _clsNavbar_Call_Functions(key)
}

function clsNavbar_Call_Download() {
    NAV.DownloadCSV(PAGE["MyCSV"]._AsCSV())
}

// function clsNavbar_Call_Input() {
//     PAGE["MyCSV"].ReadCSV(cReader.result)
//     PAGE["MySidebar"].ReadCSV(cReader.result)

//     PAGE["MyCSV"].fileLoaded = true
//     PAGE["MyCSV"].Print();
//     PAGE["MyCSV"].ToggleLink();
//     PAGE["MySidebar"].fileLoaded = true
//     PAGE["MySidebar"].Print();
//     PAGE["MySidebar"].ToggleLink();
// }