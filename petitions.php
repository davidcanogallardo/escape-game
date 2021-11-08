<?php 
$data = [];

if($_REQUEST['petition']=="login") {
    $data['success'] = true;
    $data['message'] = 'Hola! El valor recibido es correcto.';

    //Aunque el content-type no sea un problema en la mayoría de casos, es recomendable especificarlo
    header('Content-type: application/json; charset=utf-8');
    echo json_encode($data);
    exit();

} elseif ($_REQUEST['petition']=="loquesea") {
    //tiene que devolver un json o trasciende
}
?>