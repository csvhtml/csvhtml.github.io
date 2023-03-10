// ################################################################
// URL parameters                                                 #
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
// Mouse and KeyBoard Events                                      #
// ################################################################
var mousedownTime = new Date().getTime()
var mouseupTime = new Date().getTime()

const MouseDown = (event) => {
    mousedownTime = new Date().getTime();
}

const MouseUp = (event) => { 
    let nextMouseupTime = new Date().getTime();
    // if (nextMouseupTime-mouseupTime <300) { // doubleclick. Currently not used. when couble clicked then three click actions are done. 1) Click, 2) Double click, 3) click
    //     console.log("Double Click", nextMouseupTime-mouseupTime , event.srcElement.id)
    // }

    mouseupTime = nextMouseupTime
    if (event.srcElement.id == "") {console.log(mouseupTime-mousedownTime, event.srcElement.id, "with parent: " + ReturnParentUntilID(event.srcElement).id)}
    else {console.log(mouseupTime-mousedownTime, event.srcElement.id)}

    // things that shall only happen at click events (quick mouseclick)
    if (mouseupTime-mousedownTime<300) {
        Click(event.srcElement)
        // ecsv.Click(event.srcElement)
        // MEM.Click(event.srcElement.id, ecsv.mode)
    }
    //things that shall onlyhappen at long clickevents
    else {
        // this is reserved for clicks that shall not trigger anything
    }

}

const MouseOver = (event) => {
    ecsv.MouseOver(event)
    }

const KeyUp = (event) => {
        SS.mySearchfilter();
        ecsv._Sum_Refresh();
        ecsv.InputFiled_AutoHeight();
        ecsv.ButtonClick(event);
    }

function Click (divElement) {
    if (!INDEX_SIDEBEAR) {
        ecsv.Click(divElement)
        return}
    let antwort = {"action":"", "divID": ""}
    if (Sidecsv.DivIsDescendant(divElement)) {
        antwort = Sidecsv.Click(divElement)
        if (antwort["action"] == "HighlightRow") {
            ecsv.layout.HighlightRow(antwort["divID"])
            ecsv.Print()
            ecsv.layout.ScrollToHighlight()
        // Scroll to View
            }
        }
    if (ecsv.DivIsDescendant(divElement)) {
        antwort = ecsv.Click(divElement)
        if (antwort["action"] == "HighlightRow") {
            Sidecsv.layout.HighlightRow(antwort["divID"])
            Sidecsv.Print()
            a = 1}
        }

    }

// ################################################################
// classes                                                        #
// ################################################################
const cReader = new FileReader();
const ecsv = new clsCSV({egoname : "ecsv", TargetDivID : "MyCSV"});
// const Sidecsv = new clsCSV({egoname : "side", TargetDivID : "MySidebar"});
const Sidecsv = new clsCSV({egoname : "side", Mode: "SIDEBAR"});
if (INDEX_SIDEBEAR) {Sidecsv.SetTargetDiv("MySidebar")}

const SS = new clsSiteSearch();
const DD = new clsDropDown();
// const MEM = new clsMemory();
const MODE = new clsModes(); // only needed for dropdown list consistency


(function () {
    window.addEventListener('mousedown', MouseDown)   // equivalent to click (with empty mouse down)
    window.addEventListener('mouseup', MouseUp)
    window.addEventListener('keyup', KeyUp)

    SS.ignore = ["ecsv-sum","dropdown-item"]

    // Add features via button in nav bar
    DD.AddDropDownToDiv(document.getElementById("nav-Edit"), "edit", "nav-", ["Add Row", "Del Row","Add Col", "Del Col"],
            ["DDEdit('AddRow')", "DDEdit('DelRow')", "DDEdit('AddCol')", "DDEdit('DelCol')"])           // 'DDEdit("AddRow")' will lead to   DDEdit(" addRow")    and not work
    DD.AddDropDownToDiv(document.getElementById("nav-Mode"), "mode", "nav-", MODE.GetModes(), MODE.GetModesOnClick())
    DD.AddDropDownToDiv(document.getElementById("nav-Features"), "feature", "nav-", ["(Un-)Link", "Sum"], ["DDFeatures('toggle link')", "DDFeatures('sum')"])
    // DD.AddDropDownToDiv(document.getElementById("nav-Variants"), "variants", "nav-", ["memory"], ['SiteFeature_Memory()'])
    DD.AddInputFileAfterDiv({"FormdivID": "form-csv", "EgoID": "File-csv", "accept":".csv", "FunctionToCall": function (a) {DDFileInput(a)}}) 
})();


// ################################################################
// File Reader to load CSV file                                   #
// ################################################################

function _ResultToCSV() {
    looper = [ecsv]
    if (INDEX_SIDEBEAR) {looper.push(Sidecsv)}
    for (ele of looper) {
        ele.ReadCSV(cReader.result);
        ele.fileLoaded = true
        ele.Print();
        ele.ToggleLink();
    }

  }
// ###############################################################################
// data Save (hidden)                                                             #
// ###############################################################################

function SaveData(antwort) {
    if (antwort["action"] == "ChangedCell") {
        // sidebar value

        ecsv._SaveCellValueToData()
        ecsv.Print()
    }
}


// ###############################################################################
// Save / Download                                                               #
// ###############################################################################

function _download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.style.display = 'none';
    document.body.appendChild(pom);
    pom.click();
    document.body.removeChild(pom);
}

function download_saveData() {
    _download(cCurrentLoadendFileName, ecsv._AsCSV())
}

// ###############################################################################
// Nav Drop Down Features                                                        #
// ###############################################################################

function DDEdit(mode) {
    if (mode == "AddCol") {ecsv.AddCol()}
    if (mode == "AddRow") {ecsv.AddRow()}
    if (mode == "DelCol") {ecsv.DelCol()}
    if (mode == "DelRow") {ecsv.DelRow()}
}

function DDMode(mode) {
    ecsv.SetMode(mode)
    ecsv.Print()
    Sidecsv.SetMode(mode)
    Sidecsv.Print()
}

function DDFeatures(mode) {
    if (mode == "toggle link") {ecsv.ToggleLink()} 
    if (mode == "sum") {ecsv.Feature_Sum()}
}

function DDFileInput(divID) {
    if (divID == "File-csv") {_ResultToCSV()} 
}

// function SiteFeature_Memory() {
//     MEM.Init(["Haus","Hase","Hund","Himmel","Hummel","Hand","Hose"])
//     let res = ecsv.SetMode("memory")
//     if (res == 0) {
//         ecsv.ReadCSV(MEM.AsCSVRepresentation());
//         ecsv.Print();
//     }

// }