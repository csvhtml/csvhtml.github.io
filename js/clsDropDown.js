class clsDropDown {
    constructor(menu = [], events = []) {
        this.menu = menu;
        this.div = document.createElement('nav')
        this.div.classList.add("clsDD", "nav", "bg-light")
        
        for (let i = 0; i < this.menu.length; i++) {
            let a = document.createElement('a')
            a.classList.add("nav-link"); // nac-link calss from bootstrap
            a.setAttribute('href', '#');a.innerHTML = menu[i][0]; 
            if (!events == []) {
                if (!events[i][0]== '') {
                a.setAttribute('onclick',events[i][0]);}}
            this.div.append(a);
        }

    }

    Menu() {
        return this.menu;
    }

    
    AddDropDownToMenu(ddName, ddElements, ddFunctions){
        let ret = '<div class="dropdown-menu">'
        for (let element of ddElements) {
            ret += '<a id="dd-' + ddName + '" class="dropdown-item" href="#">' + ddName + '</a>'
        }
        return ret
    }

    
    AddDropDownToDiv(targetDiv, ddName, ddPrefix, ddElements, ddFunctions){
        // targetDiv.setAttribute('onclick', 'ddConsoleLog("Hallo Mario")')
        targetDiv.setAttribute('onclick', 'ddToggle("' + ddPrefix + 'ddm-' + ddName + '")')
        // let ret = '<div class="dropdown-menu">'
        let ret = '<div id="' + ddPrefix + 'ddm-' + ddName + '"' + ' class="dropdown-menu">'
        if (ddFunctions.length == 0) {
            for (let element of ddElements) {
                // MOHI: Add Function here
                ret += '<a id="' + ddPrefix + 'dd-' + element + '" class="dropdown-item" href="#">' + element + '</a>'
            }
        }
        else {
            if (ddElements.length == ddFunctions.length) {
                for (let i = 0; i < ddElements.length; i++) {
                    // MOHI: Add Function here
                    ret += '<a id="' + ddPrefix + 'dd-' + ddElements[i] + '" class="dropdown-item" href="#" onclick="' + ddFunctions[i] + '">' + ddElements[i] + '</a>'
                }
            }
        }
        targetDiv.innerHTML += ret
    }

    // function myFunction() {
    //     document.getElementById("myDropdown").classList.toggle("s    w");
    //   }
      
    //   // Close the dropdown if the user clicks outside of it
    //   window.onclick = function(event) {
    //     if (!event.target.matches('.dropbtn')) {
    //       var dropdowns = document.getElementsByClassName("dropdown-content");
    //       var i;
    //       for (i = 0; i < dropdowns.length; i++) {
    //         var openDropdown = dropdowns[i];
    //         if (openDropdown.classList.contains('show')) {
    //           openDropdown.classList.remove('show');
    //         }
    //       }
    //     }
    //   }
}

class clsButton {
    constructor(menu = [], events = []) {
        if (menu.length != events.length) {
            console.log("classButton initalized with menu and events of not equal size. Function call skipped")
            return
        }
        this.menu = menu;
        this.menu = events;
        this.div = document.createElement('a'); 
        
        // single button
        if (this.menu.length == 1 ) {
            let attributes = {
                "innerHTML": menu[0],
                "class": ["btn", "bg-light"],
                "href": "#", 
                "onclick": events[0]}
            this._A_SetAttributes(attributes)
        }

        // dropdown button
        if (this.menu.length > 1 ) {
            this.div = document.createElement('div'); this.div.classList.add("dropdown")
        }
    }


// ###############################################################################
// Helper Funcion                                                                #
// ###############################################################################

    _A_SetAttributes(dictAttributes) {
        for (let key in dictAttributes) {
            if (key == "innerHTML") {
                this.div.innerHTML = dictAttributes[key]
                continue
            }
            if (key == "class") { // attributes must be a list
                for (let cls of dictAttributes[key]) {
                    this.div.classList.add(cls)
                }
                continue
            }
           this.div.setAttribute(key, dictAttributes[key])
        }
    }
}

function ddToggle(divID) {
    var x = document.getElementById(divID);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

function ddConsoleLog(text) {
    console.log(text)
}