class clsNavbar {
    // constructor({csvtext = "", delimiter = ";", egoname = '', TargetDivID = ""}) {
    constructor(egoName, Scsv, Ecsv, SS) {
        this.egoName = egoName
        this.cDropDown = new clsDropDown();
        this.Ecsv = Ecsv
        this.Scsv = Scsv
        this.Ssearch = SS
    }

    // Create Drop Down Menus and create function call to internal DDLink function
    FillMenu() {
        let edit_elements = ["Add Row", "Del Row","Add Col", "Del Col"]
        let fkeyyEdit = []
        for (let keyy of _RemoveBlanksInList(edit_elements)) {
            fkeyyEdit.push(this.egoName + ".DDLink('" + keyy + "')")
        }
        this.cDropDown.AddDropDownToDiv(
            document.getElementById("nav-Edit"), // html element where drop down elements are created
            "edit", // postfix for parent Drop Down Elelemt
            "nav-", // prefix for parent and children of Drop Down element
            edit_elements, // html text 
            fkeyyEdit // functions called
            )  

        let mode_elements = this.Ecsv.mode.GetModes()
        let fkeyyMode = []
        for (let keyy of _RemoveBlanksInList(mode_elements)) {
            fkeyyMode.push(this.egoName + ".DDLink('" + keyy + "')")
        }
        this.cDropDown.AddDropDownToDiv(
            document.getElementById("nav-Mode"), 
            "mode", 
            "nav-", 
            mode_elements, 
            fkeyyMode
            )
    }

    // Create Link between DDLink and functions to be called
    DDLink(mode) {
        // Edit
        if (mode == "AddCol") {
            this.Ecsv.AddCol()
            return}
        if (mode == "AddRow") {
            this.Ecsv.AddRow()
            return}
        if (mode == "DelCol") {
            this.Ecsv.DelCol()
            return}
        if (mode == "DelRow") {
            this.Ecsv.DelRow()
            return}
        // Mode
        if (this.Ecsv.mode.GetModes().includes(mode)) {
            this.Ecsv.SetMode(mode)
            this.Ecsv.Print()
            this.Scsv.SetMode(mode)
            this.Scsv.Print()
            return}

        // if (mode) {
        //         if (mode == "toggle link") {ecsv.ToggleLink()} 
        //         if (mode == "sum") {ecsv.Feature_Sum()}
        //     }
    }

}

function _RemoveBlanksInList(liste) {
    let ret = []
    for (ele of liste) {
        ret.push(ele.replace(" ", ""))
    }

    return ret
}