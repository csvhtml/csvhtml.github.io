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
    {divID : "nav-dd-memory", funcName : "DDMode('memory')"},

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
    test_Click_ecsv()
    test_ONCLICKS_Completeness()
    test_onClicks()

    return 0 // 0 assertions in this file
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

function test_Click_ecsv() {
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

function test_onClicks() {
    let fname = arguments.callee.name;
    let onclickDivs = ReturnAllElemementsWithOnClickFunctions()
    let flag = []

    for (div of onclickDivs) {
        if (div.id == "download") {continue}
        let a = Function(div.attributes['onclick'].value)
        try { a()
        } catch {
            flag.push(" " + div.id + ": " + div.attributes['onclick'].value)}
    }

    if (flag.length == 0) {
        assertEqual(1,1,fname)
    } else {
        assertEqual(1,0,fname + flag)
    }    
}

