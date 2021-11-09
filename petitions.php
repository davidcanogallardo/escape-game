<?php 
if(isset($_REQUEST['petition'])){
    if($_REQUEST['petition']=="login"){
        if(isset($_REQUEST['params'])){
            $data = loginResponse($_REQUEST['params']['user']);

            //Aunque el content-type no sea un problema en la mayoría de casos, es recomendable especificarlo
            header('Content-type: application/json; charset=utf-8');
            echo json_encode($data);
            exit();
        }
    } else if($_REQUEST['petition']=='register'){
        if(isset($_REQUEST['params'])){
            $data = registerResponse();

            header('Content-type: application/json; charset=utf-8');
            echo json_encode($data);
            exit();
        }
    } else if($_REQUEST['petition']=='recover'){
        if(isset($_REQUEST['params'])){
            $data = recoverPassword($_REQUEST['params']['user']);

            header('Content-type: application/json; charset=utf-8');
            echo json_encode($data);
            exit();
        }
    } else if($_REQUEST['petition']=='friendData'){
        if(isset($_REQUEST['params'])){
            $data = friendData($_REQUEST['params']['friendUser']);
            
            header('Content-type: application/json; charset=utf-8');
            echo json_encode($data);
            exit();
        }
    } else if($_REQUEST['petition']=='ranking'){
        $data = ranking();

        header('Content-type: application/json; charset=utf-8');
        echo json_encode($data);
        exit();
    }
}

function loginResponse($name){
    if (in_array($name, ["david", "alex", "adnan", "oscar", ])) {
        $data = [];
        $data['success'] = true;
        $data['message'] = 'Hola! El valor recibido es correcto.';
        $data['userData'] =  [
            'usuario' => $name,
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

function registerResponse(){
    $data = [];
    $data['success'] = true;
    $data['message'] = 'Usuario Creado Correctamente';

    return $data;
}

function recoverPassword(){
    $data = [];
    $data['success'] = true;
    $data['message'] = 'Todo ha ido bien.';

    return $data;
}

function friendData($user){
    $data = [];
    $data['success'] = true;
    $data['userData'] = [
        'usuario' => $user,
        'trohpys' => 6,
        'favMap' => 'PisosPicados'
    ];

    return $data;
}

function ranking(){
    $data = [];
    $data['levels'] = [
        'pisosPicados' => [
            'Alex' => '01:00:02',
            'David' => '02:36:21',
            'Oscar' => '03:01:56',
            'Adnan' => '03:10:03'
        ]
    ];

    return $data;
}

?>