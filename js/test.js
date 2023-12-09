function test() {
    let assertions_in_files = 0
    // console.group ('All tests');  
    console.groupCollapsed('Test Results')
    assertions_in_files += test_clsData_1x1() 
    assertions_in_files += test_Basis()
    assertions_in_files += test_TextFunctions()
    assertions_in_files += test_clsCSV_DataFilter()
    // assertions_in_files += test_Layout()
    assertions_in_files += test_clsCSV_Config2()
    assertions_in_files += test_CSV_Getter()
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
        return test_failed(fname + "error:testEqual-isArray")}
    if (a == b) {
        return test_passed(fname)} 
    else {
        return test_failed(fname)}
}

function testEqualList(a,b,fname) {
    if (!Array.isArray(a)) {
        return test_failed(fname + "error:testEqualList-typea")}
    if (!Array.isArray(b)) {
        return test_failed(fname + "error:testEqualList-typeb")}
    if (!(a.length == b.length)) {
        return test_failed(fname + "error:testEqualList-len")}
    if (IsEqual(a,b)== false) {
        return test_failed(fname + "error:testEqualList-IsEqual")}
    return test_passed(fname)
}

function testEqualDict(a,b,fname) {
    if (!typeof a === 'object' || Array.isArray(a)) {
        return test_failed(fname + "error:testEqualDict-typea")}
    if (!typeof b === 'object' || Array.isArray(b)) {
        return test_failed(fname + "error:testEqualDict-typeb")}
    let keys1 = Object.keys(a);
    let keys2 = Object.keys(b);
    if (keys1.length !== keys2.length) {
        return test_failed(fname + "error:testEqualDict-keylen")}
    for (let key of keys1) {
        if (!b.hasOwnProperty(key)) {
            return test_failed(fname + "error:testEqualDict-keyname-" + key)}}
    if (IsEqual(a,b)== false) {
        return test_failed(fname + "error:testEqualDict-IsEqual")}
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