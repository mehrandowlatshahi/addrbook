<?php

require_once(dirname(__FILE__) . '/config/Config.php');

/**
 * 
 * @return boolean|array
 */
function getAllContacts_old() {
    $qs = "select * from addrbook.contacts as yd";
    $qresult = mysql_query($qs);
    if (!$qresult) {
        return false;
    }
    $nrows = mysql_num_rows($qresult);
    if (!$nrows) {
        return false;
    }
    $all_contacts = array();
    $row = NULL;
    while ($row = mysql_fetch_row($qresult)) {
        array_push($all_contacts, $row);
    }
    return $all_contacts;
}

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

/**
 * 
 * @param type $contact
 */
function addUpdateContact($json_contact) {
    $c = json_decode($json_contact);
    $sql = "SQL is empty sz=" . sizeof($c);
    $db = getDBConnection();
    if (sizeof($c) == 6) {
        $sql = "INSERT INTO contacts (
            first_name, last_name, number, street, suburb, state)
            VALUES ('" . $c[0] . "','" . $c[1] . "','" . $c[2] . "','" . $c[3] . "','" . $c[4] . "','" . $c[5] . "')";
    } elseif (sizeof($c) == 7) {

        $sql = "UPDATE contacts SET "
                . "first_name= '" . $c[1]
                . "',last_name= '" . $c[2]
                . "',number= '" . $c[3]
                . "',street= '" . $c[4]
                . "',suburb= '" . $c[5]
                . "',state= '" . $c[6]
                . "' WHERE id=" . $c[0];
    }
    try {
        $db->exec($sql);
        return $db->lastInsertId();
    } catch (Exception $ex) {
        return $ex->getMessage();
    }
}

function test1(){
    $contacts = getAllContacts();
    $jsnr = json_encode($contacts);
    echo $jsnr;
    $js = '["Mehran 5","Dowlat 5","195","walker","sub 1","3"]';
    //echo $js;
    echo addUpdateContact($js);

}

?>
