// ################################################################
// Events                                                         #
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
        ecsv.Click(event.srcElement)
        MEM.Click(event.srcElement.id, ecsv.mode)
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

// ################################################################
// Init                                                           #
// ################################################################

const ecsv = new clsCSV({egoname : "ecsv"});
const SS = new clsSiteSearch();
const DD = new clsDropDown();
const MEM = new clsMemory();
const LOG = new clsLogger();


(function () {
    window.addEventListener('mousedown', MouseDown)   // equivalent to click (with empty mouse down)
    window.addEventListener('mouseup', MouseUp)
    window.addEventListener('keyup', KeyUp)

    SS.ignore = ["ecsv-sum","dropdown-item"]

    // Add features via button in nav bar
    DD.AddDropDownToDiv(document.getElementById("nav-Edit"), "edit", "nav-", ["Add Row", "Del Row","Add Col", "Del Col"],
            ["DDEdit('AddRow')", "DDEdit('DelRow')", "DDEdit('AddCol')", "DDEdit('DelCol')"])           // 'DDEdit("AddRow")' will lead to   DDEdit(" addRow")    and not work
    DD.AddDropDownToDiv(document.getElementById("nav-Mode"), "mode", "nav-", GetModes(), GetModesOnClick())
    DD.AddDropDownToDiv(document.getElementById("nav-Features"), "feature", "nav-", ["(Un-)Link", "Sum"], ["DDFeatures('toggle link')", "DDFeatures('sum')"])
    DD.AddDropDownToDiv(document.getElementById("nav-Variants"), "variants", "nav-", ["memory"], ['SiteFeature_Memory()'])
})();


// ################################################################
// File Reader to load CSV file                                   #
// ################################################################

const cReader = new FileReader();
const divFile = document.getElementById("File");
divFile.addEventListener('change', ReadFile)

function ReadFile () {
    cReader.readAsText(divFile.files[0]);
    cReader.addEventListener("loadend", _ResultToCSV);
  }
function _ResultToCSV() {
    ecsv.ReadCSV(cReader.result);
    ecsv.Print();
    ecsv.ToggleLink();
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

function download_saveAll() {
    alert("funtion not yet implemented")
}

function download_saveData() {
    let filename = divFile.value.split("\\").slice(-1)[0]
    let text = ecsv._AsCSV()
    _download(filename, text)
}

function download_saveConfig() {
    alert("funtion not yet implemented")
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
}

function DDFeatures(mode) {
    if (mode == "toggle link") {ecsv.ToggleLink()} 
    if (mode == "sum") {ecsv.Feature_Sum()}
}

function SiteFeature_Memory() {
    MEM.Init(["Haus","Hase","Hund","Himmel","Hummel","Hand","Hose"])
    ecsv.mode = "memory"
    // MEM.state = "on"s
    ecsv.ReadCSV(MEM.AsCSVRepresentation());
    ecsv.Print();
}