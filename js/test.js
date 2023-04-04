function test() {
    let assertions_in_files = 0
    // console.group ('All tests');  
    console.groupCollapsed('Test Results')
    assertions_in_files += test_clsData_1x1() 
    assertions_in_files += test_Basis()
    assertions_in_files += test_clsCSV_ReadWrite()
    assertions_in_files += test_Layout()
    // assertions_in_files += test_Click()
    console.groupEnd ();
    console.log(lastlog_count + " x " + lastlog)
    
    if (testfailed_count == 0) {
        console.log(testpassed_count + testfailed_count + " tests excecuted. All tests passed")
    } else {
    console.log(testpassed_count + testfailed_count + " tests excecuted. " + testpassed_count + " passed. " + testfailed_count +  " failed")
    }

    console.log(assertions_count + " of " + assertions_in_files + " asssertions were successfully thrown (and catched during testing).")

    testpassed_count = 0
    testfailed_count = 0
    assertions_count = 0
    lastlog = ""
    lastlog_count = 0
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

function testEqual(a,b,fname) {
    if ((Array.isArray(a) || Array.isArray(b))) {
        return test_failed(fname)}
    if (a == b) {
        return test_passed(fname)} 
    else {
        return test_failed(fname)}
}

function testEqualList(a,b,fname) {
    if (!(Array.isArray(a) && Array.isArray(a))) {
        return test_failed(fname)}
    if (!(a.length == b.length)) {
        return test_failed(fname)}
    for (let i = 0; i< a.length; i++) {
        if (Array.isArray(a[i]) && Array.isArray(b[i])) {
            if (!(a[i].length == b[i].length)) {
                return test_failed(fname)}
            for (let j = 0; j< a[i].length; j++) {
                if (a[i][j] != b[i][j]) {
                    return test_failed(fname)}}
        } else {
            if (a[i] != b[i]) {
                return test_failed(fname)}}
        }

    return test_passed(fname)
}


function testAssertions(foo, assertCalls) {
    for (let aC of assertCalls) {
        assertFlag = false
        try {
            foo(aC["a"], aC["b"], aC["c"], aC["d"])   // functions with fewer parameters also work. 
        } catch (error) {
            assertions_count += 1
            assertFlag = true
            assert(error.message == aC["ermg"], "assertion message was '" + error.message + "' instead of '" + aC["ermg"] + "'")
        } finally {
            assert(assertFlag, "assertion error: '" + aC["ermg"] + "' was not thrown")
        }
    }
}