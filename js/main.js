const LOGG = true
// const LOGG = false

// ################################################################
// Base classes                                                   #
// ################################################################
const log = new clsLog()
const cReader = new FileReader();
const cHIF = new clsHtmlInterfaces();

// ################################################################
// Parameters (get from url)                                      #
// ################################################################
const cURLHandler = new clsURLHandler()
const cParameter = new clsParameter()
cParameter.setAll(cURLHandler.parameter())

// ################################################################
// Page Layout (based on parameters)                              #
// ################################################################
if (cParameter.get("sidebar")) {
    document.getElementById("MySidebar Header").classList.add("col-2")
    document.getElementById("MyCSV Header").classList.add("col-10")

    document.getElementById("MySidebar").classList.add("col-2")
    document.getElementById("MyCSV").classList.add("col-10")
} else {
    document.getElementById("MySidebar").remove()
    document.getElementById("MySidebar Header").remove()

    document.getElementById("MyCSV").classList.add("col-12")
    document.getElementById("MyCSV Header").classList.add("col-12")
}

// ################################################################
// Main HTML Page Div Container                                   #
// ################################################################
let defaultCols = ["No.", "Name", "Description", "url", "img", "Type [dropdown]", "Tags [dropdown]"]
const PAGE = {}
PAGE["MyCSV"] = new clsCSV({egoname: "ecsv", TargetDivID: "MyCSV", InitCols: defaultCols});
PAGE["MyCSV Header"] = new clsCSV({egoname: "ecsvH", TargetDivID: "MyCSV Header", Mode: "header", InitCols: defaultCols});
PAGE["MySidebar"] = new clsCSV({egoname: "side", TargetDivID: "MySidebar", Mode: "SIDEBAR"});
PAGE["mySearch"] = new clsSiteSearch();


// const MEM = new clsMemory();
const UIN = new clsUserInput(Object.keys(PAGE));
const NAV = new clsNavbar("NAV", PAGE["MySidebar"], PAGE["MyCSV"], PAGE["mySearch"]);   // "NAV" must be equal to variable name
// const HTTP = new clsHTTP();


// ################################################################
// HTML Set Up                                                    #
// ################################################################

(function () {
    window.addEventListener('mousedown', UIN.MouseDown)
    window.addEventListener('mouseup', UIN.MouseUp)
    window.addEventListener('keyup', UIN.KeyUp)

    PAGE["mySearch"].ignore = ["ecsv-sum","dropdown-item"]


})();


// ###############################################################################
// Div Interactions                                                              #
// ###############################################################################

function SaveData(antwort) {
    if (antwort["action"] == "ChangedCell") {
        // sidebar value
        ecsv._SaveCellValueToData()
        ecsv.Print()
    }
}



// ###############################################################################
// UML                                                                           #
// ###############################################################################
//  class diagram
//
//    main
//      |  
//      |--------clsLog()  
//      |--------FileReader()
//      |--------clsParameter()
//      |--------clsURLHandler();
//      |
//      |--------clsCSV() x3
//      |           |
//      |           |--------clsModes()
//      |           |--------clsCSV_ReadWrite()
//      |           |--------clsData_1x1() x2
//      |           
//      |--------clsSiteSearch()
//      |--------clsUserInput
//      |
//      |--------clsNavbar(clsCSV() x3)
//      |           |
//      |           |-------libDropDown()
// 
// 
// 
let main = "Pseudo UML class diagram"
let next = ""
if (next) {
    main = new clsLog()
    main = new FileReader()
    main = new clsParameter()
    main = new clsURLHandler()
}
