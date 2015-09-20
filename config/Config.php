<?php

$GLOBALS['db_connection'] = initDBConnection();


function getDBConnection() {
    $conn = $GLOBALS['db_connection'];
    return $conn;
}


function initDBConnection() {
    $servername = 'localhost';

    $dbname = 'addrbook';
    $username = 'root';
    $password = 'admin123';

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        echo $sql . "<br>" . $e->getMessage();
        die();
    }
}

?>
