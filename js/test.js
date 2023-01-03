function test() {
    test_clsData_1x1() 
    test_clsData_1x1_AddRow()
    test_clsData_1x1_RemoveRow()
    test_clsData_1x1_AddCol()
    test_clsData_1x1_RemoveCol()
    test_clsData_1x1_ColAsList()
    test_clsData_1x1_Subset()
    test_clsData_1x1__byVal()
    console.log(lastlog_count + " x " + lastlog)
    
    if (testfailed_count == 0) {
        console.log(testpassed_count + testfailed_count + " tests excecuted. All tests passed")
    } else {
    console.log(testpassed_count + testfailed_count + " tests excecuted. " + testpassed_count + " passed. " + testfailed_count +  " failed")
    }

    console.log(assertions_count + " asssertions were successfully thrown (and catched during testing).")
}

ASSERT = false
var testpassed_count = 0
var testfailed_count = 0
var assertions_count = 0
var lastlog = ""
var lastlog_count = 0
// ################################################################
// test basis functions                                           #
// ################################################################

function test_passed(fname) {
    testpassed_count += 1
    if (lastlog == "") {
        lastlog = 'OK ' + fname 
        lastlog_count = 1
        return 0
    }

    if (lastlog != 'OK ' + fname) {
        console.log(lastlog_count + " x " + lastlog)
        lastlog = 'OK ' + fname
        lastlog_count = 1
    } else {
        lastlog_count += 1
    }
    return 0
}

function test_failed(fname) {
    testfailed_count +=1
    if (ASSERT) {
        assert(false, fname)
    } else {
        console.log('Failed ' + fname)
    }
    return -1
}

function assertEqual(a,b,fname) {
    if (a == b) {
        return test_passed(fname)} 
    else {
        return test_failed(fname)}
}

function assertEqualList(a,b,fname) {
    if (!(Array.isArray(a) && Array.isArray(a))) {
        return test_failed(fname)}
    if (!(a.length == b.length)) {
        return test_failed(fname)}
    for (let i = 0; i< a.length; i++) {
        if (Array.isArray(a[i]) && Array.isArray(b[i])) {
            for (let j = 0; j< a.length; j++) {
                if (a[i][j] != b[i][j]) {
                    return test_failed(fname)}}
        } else {
            if (a[i] != b[i]) {
                return test_failed(fname)}}
        }

    return test_passed(fname)
}

function assertIncludesArray(FullText,includesArray,fname) {
    let flag = true;
    for (let i = 0; i< includesArray.length; i++){  
        if (!FullText.includes(includesArray[i])) {
            flag = false;}
        }
    if (flag) {           
        test_passed(fname)} 
    else {
        test_failed(fname)}
}

function NassertIncludesArray(FullText,includesArray,fname) {
    let flag = true;
    for (let i = 0; i< includesArray.length; i++){  
        if (FullText.includes(includesArray[i])) {
            flag = false;}
        }
    if (flag) {           
        test_passed(fname)} 
    else {
        test_failed(fname)}
}


function assertAssertions(foo, assertCalls) {
    for (let aC of assertCalls) {
        assertFlag = false
        try {
            foo(aC["a"], aC["b"], aC["c"], aC["d"])   // functions with fewer parameters also work. 
        } catch (error) {
            assertions_count += 1
            assertFlag = true
            assert(error.message == aC["ermg"], "assertion message was '" + error.message + "' instead of '" + aC["ermg"] + "'")
        } finally {
            assert(assertFlag, "no assertion error was thrown")
        }
    }
}