// test
// import { shuffle } from "./memory_basis"

class clsCard {
    constructor (name = "", position = "") {
        this.show = "back" // or "front" or solved
        this.name = name
        this.position = position // some position str syntax
    }
}


class clsMemory {
    constructor() {
        // this.state = "off"
        this.layout = new clsCSVLayout()
        this.NamesUnique = null // unique list of elemenets the memory is made of
        this.Cards = null // elements on table in order of their appearance
    }

    ping() {
        console.log("clsMemory Ping")
    }

    Init (listElements) {
        this.NamesUnique = RemoveDuplicates(listElements)
        this.Cards = this._ReturnCards(DoubleAndShuffle(listElements))  
        this._AddMyStyleSheet()
    }

    AsCSVRepresentation() {
        return PseudoCSV(["A", "B", "C", "D", "E", "F"], 6, this._ReturnCardnames())
    }


    Click (divID, mode) {
        if (mode == "memory") {
            if (divID.includes("R:")) {
                let cardContent = document.getElementById(divID).innerHTML
                console.log(cardContent)
                this._ToFront(divID)
                this._checkPair()
            }
        }
    }


    _checkPair() {

        // let n = this.elementsState.count("front")       // count is a prototype defined in basis.js No standard javascript
        //MOHi
    }



    // -----------------------------------------------------------

    _ReturnCards(names) {
        let ret = []
        let counter = 0
        for (let name of names) {
            counter += 1
            let newCard = new clsCard(name, counter)
            ret.push(newCard)
        }

        return ret
    }

    _ReturnCardnames() {
        let ret = []
        for (let Card of this.Cards) {
            ret.push(Card.name)
        }
        return ret
    }


    _AddMyStyleSheet() {
        let head = document.getElementsByTagName("head")[0]
        head.innerHTML += '<link rel="stylesheet" type="text/css" href="features/memory/css/memory.css">'
    }

    _ToFront(divID) {
        this.Cards[CardIndex(divID,6)].show = "front"
        this._HighlightCell(divID)
    }

    _HighlightCell(divID) {
        if (divID.includes("R:") && divID.includes("C:")) {
            this.layout.cellIDs_highlight[0][0] = divID;
            this.layout.row_highlight[0] = "";
        } else {
            this.layout.cellIDs_highlight[0][0] = "";}
        // this.Print();
    }

}

