const clsHtmlInterfaces_VALIDKEYS = ["action", "requestedBy", "divID"]

class clsHtmlInterfaces {
    constructor(pageDivIDs) {
    }

    InterAction(action) {
        assert(this.IsAction(action))

        if (action["action"] == "HighlightRow") {
            if (action["requestedBy"] == PAGE["MySidebar"].TargetDivID) {
                PAGE["MyCSV"].layout.HighlightRow(action["divID"])
                PAGE["MyCSV"].Print()
                PAGE["MyCSV"].layout.ScrollToHighlight()
            }
            if (action["requestedBy"] == PAGE["MyCSV"].TargetDivID) {
                PAGE["MySidebar"].layout.HighlightRow(action["divID"])
                PAGE["MySidebar"].Print()
            }
        }
    }

    IsAction(action) {
        let VALIDKEYS = clsHtmlInterfaces_VALIDKEYS

        for (let key of Object.keys(action)) {
            if (!VALIDKEYS.includes(key)) {
                return false
            }
        }
        return true
    }
}