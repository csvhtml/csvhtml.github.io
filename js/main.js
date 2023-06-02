// ################################################################
// Base classes                                                   #
// ################################################################
var log = new clsLog()

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
    document.getElementById("MySidebar").classList.add("col-2")
    document.getElementById("MyCSV").classList.add("col-10")
} else {
    document.getElementById("MySidebar").remove()
    // document.getElementById("MyCSV").classList.remove("col-10")
    document.getElementById("MyCSV").classList.add("col-12")
    
}


// ################################################################
// Modify HTML based on URL parameters                            #
// ################################################################


// ################################################################
// HTML Classes                                                   #
// ################################################################



const cReader = new FileReader();
const ecsv = new clsCSV({egoname : "ecsv", TargetDivID : "MyCSV"});
const Sidecsv = new clsCSV({egoname : "side", Mode: "SIDEBAR"});
// if (boolSIDEBEAR) {Sidecsv.SetTargetDiv("MySidebar")}
// Sidecsv.SetTargetDiv("MySidebar")
if (cParameter.get("sidebar")) {Sidecsv.SetTargetDiv("MySidebar")}

const SS = new clsSiteSearch();
// const MEM = new clsMemory();
const UIN = new clsUserInput(Sidecsv, ecsv, SS);
const NAV = new clsNavbar("NAV", Sidecsv, ecsv, SS);
const HTTP = new clsHTTP();


// ################################################################
// HTML Set Up                                                    #
// ################################################################

(function () {
    window.addEventListener('mousedown', UIN.MouseDown)
    window.addEventListener('mouseup', UIN.MouseUp)
    window.addEventListener('keyup', UIN.KeyUp)

    SS.ignore = ["ecsv-sum","dropdown-item"]

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