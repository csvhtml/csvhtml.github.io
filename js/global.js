// ################################################################
// Main function call                                             #
// ################################################################

// This is the main function called when a nav btton is clicked.
// This function must be outside the navbar lib, to make it globally callable from the index.html (otherwise the instances name needs to be knwon)

// const CLS_NAVBAR_DOWNLOADCALL = "clsNavbar_Call_Download"  // name of main function called for download button. See bottom

function clsNavbar_Call_DropDown(key) {
    assert(CLS_NAVBAR_CONFIG_LEFT_FUNCTIONCALL==arguments.callee.name)

    if (NAV.IsSwitch(key)) {
        NAV.Change_Switch(key)}

    clsNavbar_Config_FunctionCall(key)
}

function clsNavbar_Call_Download_CSV() {
    DownloadCSV(PAGE["MyCSV"].ReadWrite.AsCSV())
}

function clsNavbar_Call_Download_JSON() {
    DownloadCSV(PAGE["MyCSV"].ReadWrite.AsJSON(), filename = "*.json")
}

function clsNavbar_Call_Input() {
    for (let X of [PAGE["MyCSV"],PAGE["MySidebar"]]) {
        X.ReadCSV(cReaders["nav-input"].result);
        X.Print();
        X.ToggleLink();
    }
} 