const clsUserInput_VALIDINPUTS = ["Click", "Hover", "Tipp"]     // just a reference, this values are actually not used. html classes must provide those interfaces 

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
                let rem = PAGE[divID].log.LastIndex() 
                PAGE[divID].Click(divElement)
                assert(PAGE[divID].log.LastIndex() > rem)

                cHIF.InterActions(PAGE[divID].log.WhatIvedDone())
            }
        }
        // Realign page to top
        setTimeout(function() {document.getElementById("navbar").scrollIntoView()},200)
        // document.body.scrollTop = document.documentElement.scrollTop = 0
        // document.getElementById("navbar").scrollIntoView()
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

    

    log(type, event, moustime) {
        if (LOGG) {
            let msg = "[clsUserInput] "
            if (event.srcElement.id == "") {
                let parentDiv = ReturnParentUntilID(event.srcElement)
                cLOG.Add(msg + event.srcElement.id + "with parent: " + parentDiv.id + ". Clicktime: " + moustime)
            } else {
                cLOG.Add(msg + event.srcElement.id + ". Clicktime: " + moustime)
            }
        }
    }
}