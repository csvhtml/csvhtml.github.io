// ################################################################
// Base classes                                                   #
// ################################################################
var log = new clsLog()

// ################################################################
// Base classes                                                   #
// ################################################################
const cParameter = new clsParameter()

// ################################################################
// Modify HTML based on URL parameters                            #
// ################################################################


// ################################################################
// HTML Classes                                                   #
// ################################################################


const cURLHandler = new clsURLParameterHandler();
const cReader = new FileReader();
const ecsv = new clsCSV({egoname : "ecsv", TargetDivID : "MyCSV"});
const Sidecsv = new clsCSV({egoname : "side", Mode: "SIDEBAR"});
// if (boolSIDEBEAR) {Sidecsv.SetTargetDiv("MySidebar")}
if (cParameter.get("Sidebar")) {Sidecsv.SetTargetDiv("MySidebar")}

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