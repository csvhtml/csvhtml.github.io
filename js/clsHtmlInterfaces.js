const clsHtmlInterfaces_VALIDKEYS = ["by", "action", "parameters", "divIDSource", "divIDTarget"]

class clsHtmlInterfaces {
    constructor(pageDivIDs) {
    }

    InterAction(action) {
        assert(this.IsAction(action))

            // MOHI: Extract Target DIID form divID
        if (action["action"] == "HighlightRow") {
            if (RootTargetDiv(action["divIDSource"]) == PAGE["MySidebar"].TargetDivID) {
                PAGE["MyCSV"].layout.HighlightRow(VoidTargetDiv(action["divIDTarget"]))
                PAGE["MyCSV"].Print()
                PAGE["MyCSV"].layout.ScrollToHighlight()
            }
            if (RootTargetDiv(action["divIDSource"]) == PAGE["MyCSV"].TargetDivID) {
                PAGE["MySidebar"].layout.HighlightRow(VoidTargetDiv(action["divIDTarget"]))
                PAGE["MySidebar"].Print()
            }
        }
    }

    InterActions(actions) {
        for (let action of actions) {
            this.InterAction(action)
        }
    }

    IsAction(action) {
        let VALIDKEYS = clsHtmlInterfaces_VALIDKEYS

        for (let key of Object.keys(action)) {
            if (!VALIDKEYS.includes(key)) {
                return false}
            if (key == "action") {
                if (!CLS_CSV_VALID_ACTIONS.includes(action[key])) {
                    return false}
            }
        }
        return true
    }
}