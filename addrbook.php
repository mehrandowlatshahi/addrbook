<?php

require_once(dirname(__FILE__) . '/config/Config.php');
//=========================================
///methods for updating or data retrieving 
//========================================
/**
 * returns all contacts and their unique ids
 * @return boolean|array
 */
function getAllContacts() {
    $qs = "select * from addrbook.contacts as yd";
    $db = getDBConnection();
    try {
        $stmt = $db->query($qs);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $ex) {
        false;
    }
}

/*
 * returns a stateid:state name array
 */
function getAllStates() {
    $qs = "select * from addrbook.states as yd";
    $db = getDBConnection();
    try {
        $stmt = $db->query($qs);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $ex) {
        false;
    }
}

/*
 * used for test of adding contacts to the database
 */

function test1() {
    $contacts = getAllContacts();
    $jsnr = json_encode($contacts);
    echo $jsnr;
    $js = '["Mehran 5","Dowlat 5","195","walker","sub 1","3"]';
    //echo $js;
    echo addUpdateContact($js);
}

function add_contact($c) {
    $db = getDBConnection();
    $sql = "INSERT INTO contacts (
            first_name, last_name, number, street, suburb, state)
            VALUES ('"
            . $c['first_name'] . "','"
            . $c['last_name'] . "','"
            . $c['number'] . "','"
            . $c['street'] . "','"
            . $c['suburb'] . "','"
            . $c['state'] . "')";
    try {
        $db->exec($sql);
        return $db->lastInsertId();
    } catch (Exception $ex) {
        return $ex->getMessage();
    }
}

function update_contact($c) {
    $db = getDBConnection();
    $sql = "UPDATE contacts SET "
            . "first_name= '" . $c['first_name']
            . "',last_name= '" . $c['last_name']
            . "',number= '" . $c['number']
            . "',street= '" . $c['street']
            . "',suburb= '" . $c['suburb']
            . "',state= '" . $c['state']
            . "' WHERE id=" . $c['id'];
    try {
        $db->exec($sql);
        return $c['id'];
    } catch (Exception $ex) {
        return $ex->getMessage();
    }
}

function delContactRow($c) {
    $qs = "delete from addrbook.contacts where id=".$c['id'];
    $db = getDBConnection();
    try {
        $db->query($qs);
        return TRUE;        
    } catch (Exception $ex) {
        return FALSE;
    }
}
////==================================================================================
////======================================http request processing scripts=============
////==================================================================================
//&& ($_GET['initpage'])
//if (isset($_GET) && ($_GET['initpage']) ) {
if (isset($_GET) && isset($_REQUEST['load_page'])) {
    $contacts = getAllContacts();
    $states = getAllStates();
    $ja = array();
    array_push($ja, $contacts, $states);
    $jsnr = json_encode($ja);
    echo $jsnr;
    return;
}


if (isset($_POST) && isset($_REQUEST['update_contact'])) {
    $ra = $_REQUEST;
    echo json_encode(update_contact($ra));
    //echo json_encode($ra['id'].";".$ra['first_name']);
    return;
}

if (isset($_POST) && isset($_REQUEST['add_new_ontact'])) {
    $ra = $_REQUEST;
    $result=array();
    $result['id'] = add_contact($ra);
    if ($result['id'] >=0){
        $result['success'] = TRUE;
    }else{
        $result['success'] = FALSE;
    }
    echo json_encode($result);
    //echo json_encode($ra['id'].";".$ra['first_name']);
    return;
}

if (isset($_POST) && isset($_REQUEST['del_contact'])) {
    $reqa = $_REQUEST;
    $result=array();
    $result['success']=  delContactRow($reqa); 
    echo json_encode($result);
    //echo json_encode($ra['id'].";".$ra['first_name']);
    return;
}
echo json_encode('success without doing anything');
?>
