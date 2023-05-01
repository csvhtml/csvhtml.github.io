// ################################################################
// Modify HTML based on URL parameters                            #
// ################################################################
var INDEX_SIDEBEAR = true
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)

if (urlParams.has("sidebar")) {
    if (urlParams.get("sidebar") == "false") {
        INDEX_SIDEBEAR = false
        document.getElementById("MySidebar").remove()
        document.getElementById("MyCSV").classList.remove("col-10")
        document.getElementById("MyCSV").classList.add("col-12")
    }
}

// ################################################################
// HTML Classes                                                   #
// ################################################################

const cReader = new FileReader();
const ecsv = new clsCSV({egoname : "ecsv", TargetDivID : "MyCSV"});
const Sidecsv = new clsCSV({egoname : "side", Mode: "SIDEBAR"});
if (INDEX_SIDEBEAR) {Sidecsv.SetTargetDiv("MySidebar")}

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