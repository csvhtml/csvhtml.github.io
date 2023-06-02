const LOGG = true
// const LOGG = false

// ################################################################
// Base classes                                                   #
// ################################################################
var log = new clsLog()
const cReader = new FileReader();

// ################################################################
// Parameters                                                     #
// ################################################################
const cParameter = new clsParameter()
const cURLHandler = new clsURLParameterHandler(cParameter.keys());
cParameter.setAll(cURLHandler.parameters())

// ################################################################
// Page Layout                                                    #
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
// HTML Classes                                                   #
// ################################################################
let defaultCols = ["No.", "Name", "Description", "url", "img", "Type [dropdown]", "Tags [dropdown]"]
const PAGE = {}
PAGE["MyCSV"] = new clsCSV({egoname: "ecsv", TargetDivID: "MyCSV", InitCols: defaultCols});
PAGE["MyCSV Header"] = new clsCSV({egoname: "ecsvH", TargetDivID: "MyCSV Header", Mode: "header", InitCols: defaultCols});
PAGE["MySidebar"] = new clsCSV({egoname: "side", TargetDivID: "MySidebar", Mode: "SIDEBAR"});
PAGE["mySearch"] = new clsSiteSearch();

// if (boolSIDEBEAR) {Sidecsv.SetTargetDiv("MySidebar")}
// Sidecsv.SetTargetDiv("MySidebar")
// if (cParameter.get("sidebar")) {Sidecsv.SetTargetDiv("MySidebar")}

// const SS = new clsSiteSearch();
// const MEM = new clsMemory();
const UIN = new clsUserInput(Object.keys(PAGE));
const NAV = new clsNavbar("NAV", PAGE["MySidebar"], PAGE["MyCSV"], PAGE["mySearch"]);
const HTTP = new clsHTTP();


// ################################################################
// HTML Set Up                                                    #
// ################################################################

(function () {
    window.addEventListener('mousedown', UIN.MouseDown)
    window.addEventListener('mouseup', UIN.MouseUp)
    window.addEventListener('keyup', UIN.KeyUp)

    PAGE["mySearch"].ignore = ["ecsv-sum","dropdown-item"]

    NAV.FillMenu()

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