// ##############################################################################################################
// #                                                                                                            #
// # IDs:                                                                                                       #
// # "mySearch": The input-form, where you can type in search items                                              #
// #                                                                                                            #
// # classes:                                                                                                   #
// # "seach-here": Searchfilter is applied to all children of the DOM element with the "search-here" class      #
// # "search-ignore": Ignores all elements to hide, i. e. this elements will not be filtered. class mus be set  #
// # for rows in tr element                                                                                     #
// #                                                                                                            #
// # Applied to:                                                                                                #                                                                                                            #                                                 #
// # <a href>, <tr>, <p>, class="img-container"                                                                 #
// # makes all items of these types invisible, when they don't contain the text that was searched               #                                                                              
// #                                                                                                            #
// ##############################################################################################################


class clsSiteSearch {
    constructor() {
        this.ignore = []

    }

    mySearchfilter() {
        //Var
        var seach_here = document.getElementsByClassName("seach-here"); // class defined in index html
        var input = document.getElementById("mySearch"); // input search field
        var filter = input.value.toUpperCase();   
    
        //Loop through all main divs:
        for (let j = 0; j < seach_here.length; j++) {
            let Tags = ["a", "p", "tr"]
            for (let tag of Tags) {
                var dom_elements = seach_here[j].getElementsByTagName(tag);
                if (dom_elements.length>0) {
                    for (let a of dom_elements) {
                        // if (a.classList.contains("search-ignore")) {'
                        if (this.containsIgnore(a.classList)) {
                            continue
                        }
                        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                            a.style.display = "";
                            for (let td of a.children) {
                                td.style.display = "";}
                        } 
                        else {
                            a.style.display = "none";
                            for (let td of a.children) {
                                td.style.display = "none";}
                        }    
                    }
                }
            }
        }
    }
    //MOHI
    containsIgnore(classList) {
        for (let className of classList) {
            for (let ignore of this.ignore) {
                if (className == ignore) {
                    return true
                }
            }
        }
        return false
    }
}