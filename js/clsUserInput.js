class clsUserInput {
    constructor(pageDivIDs) {
        this.pageDivIDs = pageDivIDs
        this.mousedownTime = new Date().getTime()
        this.mouseupTime = new Date().getTime()
    }

// ################################################################
// User Events                                                    #
// ################################################################

    MouseDown = (event) => {
        this.mousedownTime = new Date().getTime();
    }

    MouseUp = (event) => {
        this.nextMouseupTime = new Date().getTime();
        let moustime = this.nextMouseupTime-this.mousedownTime
        this.log("mouseUp", event, moustime)

        if (moustime<300) {
            this.Click(event.srcElement)
        }
    } 

    MouseOver = (event) => {
        this.Hover(event)
    }

    KeyUp = (event) => {
        this.Tipp();
    }
    

// ################################################################
// User Events Inerpretation                                      #
// ################################################################

    Click (divElement) {
        for (let divID of this.pageDivIDs) {
            if (DivIsDescendantOf(divElement, divID)) {
                let antwort = PAGE[divID].Click(divElement)
                this.InterAction(antwort)
            }
        }
    }

    Hover (event) {
        if (PAGE["MyCSV"].DivIsPartOfMe(event.srcElement)) {
            PAGE["MyCSV"].MouseOver(event)
        }
        if (PAGE["MySidebar"].DivIsPartOfMe(event.srcElement)) {
            PAGE["MySidebar"].MouseOver(event)
        }
    }

    Tipp (event) {
        PAGE["mySearch"].mySearchfilter();
    }


// ################################################################
// Interactions after actions                                     #
// ################################################################

    InterAction(action) {
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

    log(type, event, moustime) {
        if (LOGG) {
            let msg = "[clsUserInput] "
            if (event.srcElement.id == "") {
                let parentDiv = ReturnParentUntilID(event.srcElement)
                log.msg(msg + event.srcElement.id + "with parent: " + parentDiv.id + ". Clicktime: " + moustime)
            } else {
                log.msg(msg + event.srcElement.id + ". Clicktime: " + moustime)
            }
        }
    }
}