class clsUserInput {
    // constructor({csvtext = "", delimiter = ";", egoname = '', TargetDivID = ""}) {
    constructor(Scsv, Ecsv, SS) {
        this.Ecsv = Ecsv
        this.Scsv = Scsv
        this.Ssearch = SS
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

        // console log where you are
        if (event.srcElement.id == "") {
            let parentDiv = ReturnParentUntilID(event.srcElement)
            console.log(moustime, event.srcElement.id, "with parent: " + parentDiv.id)
        } else {
            console.log(moustime, event.srcElement.id)
        }

        // action
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
        // without sidebar
        if (!INDEX_SIDEBEAR) {
            if (this.Ecsv.DivIsPartOfMe(divElement)) {
                this.Ecsv.Click(divElement)
                return
            }
        }

        // with sidebar
        let antwort = {"action":"", "divID": "", "requestedBy": ""}

        if (this.Scsv.DivIsPartOfMe(divElement)) {
            antwort = this.Scsv.Click(divElement)
            this.InterAction(antwort)
        }
        if (this.Ecsv.DivIsPartOfMe(divElement)) {
            antwort = ecsv.Click(divElement)
            this.InterAction(antwort)
        }

    }

    Hover (event) {
        if (this.Ecsv.DivIsPartOfMe(event.srcElement)) {
            this.Ecsv.MouseOver(event)
        }
        if (this.Scsv.DivIsPartOfMe(event.srcElement)) {
            this.Scsv.MouseOver(event)
        }
    }

    Tipp (event) {
        this.Ssearch.mySearchfilter();
        // ecsv._Sum_Refresh();
        // ecsv.InputFiled_AutoHeight();
        // ecsv.ButtonClick(event);
    }


// ################################################################
// Interactions after actions                                     #
// ################################################################

    InterAction(action) {
        if (action["action"] == "HighlightRow") {
            if (action["requestedBy"] == this.Scsv.TargetDivID) {
                this.Ecsv.layout.HighlightRow(action["divID"])
                this.Ecsv.Print()
                this.Ecsv.layout.ScrollToHighlight()
            }
            if (action["requestedBy"] == this.Ecsv.TargetDivID) {
                this.Scsv.layout.HighlightRow(action["divID"])
                this.Scsv.Print()
            }
        }
    }

}