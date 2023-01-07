ONCLICKS = [
    // created by clsDropDown in main.js
    {divID : "nav-Edit", funcName : "ddToggle('nav-ddm-edit')"},
    {divID : "nav-dd-Add Row", funcName : "DDEdit('AddRow')"},
    {divID : "nav-dd-Del Row", funcName : "DDEdit('DelRow')"},
    {divID : "nav-dd-Add Col", funcName : "DDEdit('AddCol')"},
    {divID : "nav-dd-Del Col", funcName : "DDEdit('DelCol')"},

    {divID : "nav-Mode", funcName : "ddToggle('nav-ddm-mode')"},
    {divID : "nav-dd-standard", funcName : "DDMode('standard')"},
    {divID : "nav-dd-list", funcName : "DDMode('list')"},
    {divID : "nav-dd-issues", funcName : "DDMode('issues')"},

    {divID : "nav-Features", funcName : "ddToggle('nav-ddm-feature')"},
    {divID : "nav-dd-(Un-)Link", funcName : "DDFeatures('toggle link')"},
    {divID : "nav-dd-Sum", funcName : "DDFeatures('sum')"},

    {divID : "nav-Variants", funcName : "ddToggle('nav-ddm-variants')"},
    {divID : "nav-dd-memory", funcName : "SiteFeature_Memory()"},

    // created in index.html
    {divID : "download", funcName : "download_saveData()"},

    // created by _svgText_ArrowDown() in clsCSV.layout
    {divID : "a-ArrowDown-Type", funcName : "Layout_DowpDown_ShowHide('Type')"},
    {divID : "a-ArrowDown-Tags", funcName : "Layout_DowpDown_ShowHide('Tags')"},
]

function test_Click() {
    
    test_ONCLICKS_Completeness()
    test_ClickRowColCell()
    // test_ClickonClick()
}

// ################################################################
// test basis functions                                           #
// ################################################################

function assertContaintsClass(divID, classes, fname) {
    for (cl of classes) {
        if (!document.getElementById(divID).classList.contains(cl)) {
            return test_failed(fname)
        }
    }
    return test_passed(fname)  
}


// ################################################################
// testfunctions                                                  #
// ################################################################

function test_ONCLICKS_Completeness(){
    let fname = arguments.callee.name;
    let onclickDivIDs = ReturnAllElemementsWithOnClickFunctions("id")
    let ONCLICKIDs = []
    for (let ele of ONCLICKS) {
        ONCLICKIDs.push(ele["divID"])
    }
    assertEqualList(onclickDivIDs, ONCLICKIDs, fname)

    let onclickDivFunctions = ReturnAllElemementsWithOnClickFunctions("function")
    let ONCLICKFunctions = []
    for (let ele of ONCLICKS) {
        ONCLICKFunctions.push(ele["funcName"])
    }
    assertEqualList(onclickDivFunctions, ONCLICKFunctions, fname)
}

function test_ClickRowColCell() {
    let fname = arguments.callee.name;
    let div = document.getElementById("R:0C:1H:Name")

    ecsv.Click(div)
    assertEqualList(ecsv.layout.row_highlight,["row:0!", "row:0!"], fname)
    assertContaintsClass("row:0!", ["table-info"], fname)
    
    ecsv.Click(div)
    assertEqualList(ecsv.layout.row_highlight,["", ""], fname)
    assertEqualList(ecsv.layout.cellIDs_highlight[0],["R:0C:1H:Name", "R:0C:1H:Name"], fname)
    assertContaintsClass("R:0C:1H:Name", ["table-info"], fname)
    
    div = document.getElementById("ecsvDivOut")
    ecsv.Click(div)
    assertEqualList(ecsv.layout.row_highlight,["", ""], fname)
    assertEqualList(ecsv.layout.cellIDs_highlight[0],["", ""], fname)

    div = document.getElementById("header-Name") 
    ecsv.Click(div)
    assertEqualList(ecsv.layout.col_highlight,["col-Name", "col-Name"], fname)
    assertContaintsClass("header-Name", ["table-info"], fname)

    div = document.getElementById("ecsvDivOut")
    ecsv.Click(div)
    assertEqualList(ecsv.layout.row_highlight,["", ""], fname)
    assertEqualList(ecsv.layout.cellIDs_highlight[0],["", ""], fname)
}

function test_ClickonClick() {
    let fname = arguments.callee.name;
    let onclickDivs = ReturnAllElemementsWithOnClickFunctions()
    let onclickDivIDs = ReturnAllElemementsWithOnClickFunctions("id")
    let onclickFunctions = ReturnAllElemementsWithOnClickFunctions("function")
    let div = ""

    for (div of onclickDivs) {
        let divID = div.id
        let funcName = div.attributes['onclick'].value
        assert (ReturnONCLICKFunctionName(divID) == funcName)
        let a = Function(div.attributes['onclick'].value)
        a()
    }
}

function ReturnONCLICKFunctionName(divID) {
    let IDs = []; let fNs = []
    for (let ele of ONCLICKS) {
        IDs.push(ele["divID"]);fNs.push(ele["fName"])
    }
    assert(IDs.includes(divID))

    return fNs[IDs.indexOf(divID)]
}


