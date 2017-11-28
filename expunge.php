<?php

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'citation');
define('DB_USERNAME','root');
define('DB_PASSWORD','win2k3admin');
#define('DB_USERNAME','test');
#define('DB_PASSWORD','test');

$data = file_get_contents("php://input");

$objData = json_decode($data);

#$test = "10-0180";
#$name = "cadams";

$mysqli = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
if (mysqli_connect_errno()) {
    echo "Connect failed: %s\n", mysqli_connect_error();
    exit();
}

$result = $mysqli->query('SELECT * FROM citations WHERE Docket_Number="'. $objData->id .'"');

$rows = array();
while($row = $result->fetch_row())
{
    $rows[]=$row;
}
$result->close();
#$mysqli->close();

if(count($rows) === 0){
    echo "notfound";
    exit();
}

$exp = explode(" ", $rows[0][4]);
if ($exp[0] === "Expunged") {
    echo "expunged";
    exit();
}

$expunge = $mysqli->query("UPDATE citations SET ".
    "Citation_Image=Null, ".
    "Citation_Status=Null, ".
    "Citation_Number=Null, ".
    "Case_Number='Expunged by ". $objData->name ."', ".
    "Citation_Type=Null, ".
    "Issuing_Agency=Null, ".
    "Citation_Date='". date("Y-m-d H:i") ."', ".
    "Location=Null, ".
    "Officer_ID=Null, ".
    "Officer_Name=Null, ".
    "Interstate=Null, ".
    "Defendant_First_Name=Null, ".
    "Defendant_Middle_Name=Null, ".
    "Defendant_Last_Name=Null, ".
    "Defendant_DOB=Null, ".
    "Defendant_Address=Null, ".
    "Defendant_City=Null, ".
    "Defendant_State=Null, ".
    "Defendant_Zip=Null, ".
    "Defendant_SSN=Null, ".
    "Defendant_DL_No=Null, ".
    "Defendant_DL_State=Null, ".
    "Defendant_Sex=Null, ".
    "Defendant_Race=Null, ".
    "Defendant_Hair=Null, ".
    "Defendant_Eyes=Null, ".
    "Defendant_Height=Null, ".
    "Defendant_Weight=Null, ".
    "Vehicle_License_Number=Null, ".
    "Vehicle_License_State=Null, ".
    "Vehicle_License_Expires=Null, ".
    "Vehicle_Year=Null, ".
    "Vehicle_Color=Null, ".
    "Vehicle_Make=Null, ".
    "Vehicle_Model=Null, ".
    "Vehicle_Commerial=Null, ".
    "Vechile_Hazard=Null, ".
    "Offence_Code_1=Null, ".
    "Offence_Code_2=Null, ".
    "Offence_Code_3=Null, ".
    "Offence_Code_4=Null, ".
    "Offence_Code_5=Null, ".
    "Offence_Code_6=Null, ".
    "Offence_Code_7=Null, ".
    "Offence_Code_8=Null, ".
    "Speeding_1=Null, ".
    "Speeding_2=Null, ".
    "Top_Offset=Null, ".
    "Left_Offset=Null, ".
    "Entry_Date=Null, ".
    "Defendant_Phone=Null, ".
    "Export_Date=Null ".
"WHERE Docket_Number='". $objData->id ."'");

#$expunge->close();
$mysqli->close();
$result = 'OK';

if ($expunge) {
    $result = 'Expunged';
} else {
    $result = 'Error';
}

echo json_encode($result);

?>