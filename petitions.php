<?php 
if(isset($_REQUEST['petition'])){
    if($_REQUEST['petition']=="login"){
        if(isset($_REQUEST['params'])){
            $data = loginResponse($_REQUEST['params']['user']);

            //Aunque el content-type no sea un problema en la mayoría de casos, es recomendable especificarlo
            header('Content-type: application/json; charset=utf-8');
            // echo json_encode($data);
            echo json_encode($data);
            exit();
        }
    }
}

function loginResponse($nombre){
    if (in_array($nombre, ["david", "alex", "adnan", "oscar", ])) {
        $data = [];
        $data['success'] = true;
        $data['message'] = 'Hola! El valor recibido es correcto.';
        $data['userData'] =  [
            'usuario' => $nombre,
            'numCopas' => 5,
            'favMap' => 'pisosPicados',
            'completeLevels' => [
                'pisosPicodos' => [
                    'time' => '1:00:20', 
                    'trohpys' => [
                        'bronze' => true,
                        'silver' => true,
                        'gold' => true
                    ]
                ],
    
                'summonerRift' => [
                    'time' => '3:34:05',
                    'trophys' => [
                        'bronze' => true,
                        'silver' => true,
                        'gold' => false
                    ]
                ]
            ],
            'friendList' => ['David', 'Oscar', 'Adnan'],
            'friendsRequest' => ['Luis', 'Jose']         
        ];
    
        return $data;
    } else {
        $data = [];
        $data['success'] = false;
        $data['message'] = 'El usuario no existe';

        return $data;
    }
}

// if($_REQUEST['petition']=="login") {
    

// } elseif ($_REQUEST['petition']=="loquesea") {
//     //tiene que devolver un json o trasciende
// }
?>