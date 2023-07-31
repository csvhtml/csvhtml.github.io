const LOGG = true
// const LOGG = false

// ################################################################
// Base classes                                                   #
// ################################################################
const cLOG = new clsLog()
const cReader = new FileReader();
const cHIF = new clsHtmlInterfaces();
const cSVG = new clsSVG();

// ################################################################
// Parameters (get from url)                                      #
// ################################################################
const cURLHandler = new clsURLHandler()
const cParameter = new clsParameter()
cParameter.setAll(cURLHandler.parameter())

// ################################################################
// Main HTML Page Div Container                                   #
// ################################################################
const PAGE = {}
PAGE["MyCSV"] = new clsCSV({egoname: "ecsv", TargetDivID: "MyCSV"});
PAGE["MySidebar"] = new clsCSV({egoname: "side", TargetDivID: "MySidebar", Mode: "sidebar"});
PAGE["mySearch"] = new clsSiteSearch();


// const MEM = new clsMemory();
const UIN = new clsUserInput(Object.keys(PAGE));
const NAV = new clsNavbar();   // "NAV" must be equal to variable name
// const HTTP = new clsHTTP();


// ###############################################################################
// Div Interactions                                                              #
// ###############################################################################

// function SaveData(antwort) {
//     if (antwort["action"] == "ChangedCell") {
//         // sidebar value
//         ecsv._SaveCellValueToData()
//         ecsv.Print()
//     }
// }

// ################################################################
// Page Set Up                                                    #
// ################################################################

(function () {
    main_Events()
    main_CLS()
    main_Layout()
})();

function main_Events() {
    window.addEventListener('mousedown', UIN.MouseDown)
    window.addEventListener('mouseup', UIN.MouseUp)
    window.addEventListener('keyup', UIN.KeyUp)
}

function main_CLS() {
    PAGE["mySearch"].ignore = ["ecsv-sum","dropdown-item"]
}

function main_Layout() {
    main_Layout_Init()
    if (cParameter.get("sidebar")) {
        document.getElementById("MySidebar").classList.add("col-2")
        document.getElementById("MyCSV").classList.add("col-10")
    } else {
        document.getElementById("MySidebar").style.display = 'None';  
        document.getElementById("MyCSV").classList.add("col-12")
    }
}

function main_Layout_Init() {
    document.getElementById("MySidebar").style.display = '';  
    document.getElementById("MyCSV").classList.remove("col-10", "col-12")
    document.getElementById("MySidebar").classList.remove("col-2")
}


