// ##################################################################################################################################
// Global variables                                                                                                                 #
//                                                                                                                                  #
// Global variables shall be used by their name as specified in main in all other js                                                #
// modules, hence global variables shall never be provided as a paramters, but the key of page can be provided                      #                
// ##################################################################################################################################

// log (clsLog() )
// global Log class. all Log should run via 'log' to enhaence the standard console.log

// PAGE (dict)
// Contains html classes that are assigned to a certain div in the html page. dict key should be the same as the targetDivID

// cHIF (clsHTMLInterfaces() )
// function conainter when an function was called by a html class it may want to 'tell' the page. cHIF knows what to do with this information. cHIF does not contain any variables/internal information

// UIN (clsUserInput)
// Global User Input Class to manage user inputs via kyboard and mouse. UIN gets the global variable 'PAGE' as user inputs will trigger a certain functionality of the html classes

// NAV (clsNAV)
// dedicated html class for the navbar. UIN does not apply here (e. g. if the mosue is clicked somewhere in the navbar). it is equivalent to UIN, where the click or key input on a certain nav button
// will trigger a certain functionality of the html classes. Hence also NAV gets the global variable 'PAGE'








// ##################################################################################################################################                                                                                                                                #
// Lost                                                                                                                             #
// ##################################################################################################################################

// index.html
//
// <!-- Searchfilter on Page -->
// <form class="form-inline  my-2 mx-2" >
//     <!-- <input class="form-control" type="text" id="mySearch" onkeyup="mySearchfilter()" placeholder="Site Search"> -->
//     <input class="form-control" type="text" id="mySearch" placeholder="Site Search">
// </form>


// Layout

// _GetDropDownHeaders() {
//     let ret = []
//     for (let header of this.headers) {
//         if (header.includes("[dropdown]")) {
//             let head = header.replace(" [dropdown]", "")
//             head = head.replace("[dropdown]", "")
//             ret.push(head)
//         }
//     }
//     return ret
// }


// GetDiv_InputCell() {
//     if (this.cellIDs_highlight[0][0] != "") {
//         return document.getElementById(this.cellIDs_highlight[0][0]);
//     }
// }