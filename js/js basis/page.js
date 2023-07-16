// ###############################################################################
// Basis global functions for the page                                           #
// ###############################################################################

function DownloadCSV(text) {
    let filename = " .csv"
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.style.display = 'none';
    document.body.appendChild(pom);
    pom.click();
    document.body.removeChild(pom);
}

function RootTargetDiv(divID) {
    let ret = RetStringBetween(divID,"[","]")
    if (ret == "") {
        cLOG.Add("[page.js].RootTargetDiv: divID '" + divID + "' does not have '[..]' prefix")
    }
    return ret
}

function VoidTargetDiv(divID) {
    let ret = RetStringBetween(divID,"[","]")
    if (ret == "") {
        cLOG.Add("[page.js].RootTargetDiv: divID '" + divID + "' does not have '[..]' prefix")
    }
    return divID.replace("[" + ret + "] ", "")
}