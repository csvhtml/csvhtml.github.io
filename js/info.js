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