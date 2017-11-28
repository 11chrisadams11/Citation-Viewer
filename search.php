<?php

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'citation');
define('DB_USERNAME','root');
define('DB_PASSWORD','win2k3admin');
#define('DB_USERNAME','test');
#define('DB_PASSWORD','test');

$data = file_get_contents("php://input");

$objData = json_decode($data);

$test = "09-6899";

$mysqli = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
if (mysqli_connect_errno()) {
    echo "Connect failed: %s\n", mysqli_connect_error();
    exit();
}

$result = $mysqli->query('SELECT * FROM citations WHERE '. $objData->search .'="'. $objData->data .'"');

$rows = array();
while($row = $result->fetch_row())
{
	$rows[]=$row;
}
$result->close();
$mysqli->close();

$count = 0;
$arr = array();

if(count($rows) === 0){
    echo "notfound";
    exit();
}

$exp = explode(" ", $rows[0][4]);
if ($exp[0] === "Expunged") {
    echo "expunged";
    exit();
}

$arr2[] = [$rows[0][3], $rows[0][4], $rows[0][12], $rows[0][14], $rows[0][50], $rows[0][52]];

foreach($rows as $r=>$row){
	$im = new Imagick();
	$im->readimageblob($row[1]);
	$im->setImageFormat("jpeg");
    $im->setImageCompression(Imagick::COMPRESSION_JPEG);
    $im->setImageCompressionQuality(100);
    $t = $im->getImageBlob();
    file_put_contents('citations/p'.$r.'.jpg', $t);

    $im->thumbnailImage(150, 200, true);
    $im->unsharpMaskImage(0.5 , 1 , 1 , 0.05);
    $t2 = $im->getImageBlob();
    file_put_contents('citations/p'.$r.'t.jpg', $t2);

    $arr[] = ['p'.$r.'t.jpg?'.date("Y-m-d H:i:s"), $row[0]." - (".$row[3].")"];
	$count = $count + 1;
}

$total = array();
$total[] = $arr;
$total[] = $arr2;

echo json_encode($total);

?>