<?php 
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = [];
    if(isset($_REQUEST['petition'])) {
        if($_REQUEST['petition']=="login"){
            if(isset($_REQUEST['params'])){
                $data = loginResponse($_REQUEST['params']['user']);
            }
        } else if($_REQUEST['petition']=='register') {
            if(isset($_REQUEST['params'])){
                $data = registerResponse();
            }
        } else if($_REQUEST['petition']=='recover') {
            if(isset($_REQUEST['params'])){
                parse_str(file_get_contents("php://input"),$post_vars);
                $data = recoverPassword($post_vars['params']['mail']);
            }
        } else if($_REQUEST['petition']=='friendData') {
            if(isset($_REQUEST['params'])){
                $data = friendData($_REQUEST['params']['friendUser']);
            }
        } else if($_REQUEST['petition']=='ranking'){
            $data = ranking();
        } else if($_REQUEST['petition']=='close-sesion'){
            $data = closeSession($_REQUEST['params']);
        }

        header('Content-type: application/json; charset=utf-8');
        echo json_encode($data);
        exit();
    }
} elseif($_SERVER['REQUEST_METHOD'] == 'PUT') {
    parse_str(file_get_contents("php://input"),$post_vars);

    if ($post_vars['petition'] == 'register') {
        $data = recoverPassword($post_vars['params']['email']);
    } else if($post_vars['petition']=='friend-request'){
        $data = friendRequest($post_vars['params']);
    } else if($post_vars['petition']=='send_request'){
        $data = sendRequest($post_vars['params']);
    } else if($post_vars['petition']=='ranking'){
        $data = ranking();
    }

    header('Content-type: application/json; charset=utf-8');
    echo json_encode($data);
    exit();
}

function loginResponse($name){
    if (in_array($name, ["david", "alex", "adnan", "oscar", "a"])) {
        $data = [];
        $data['success'] = true;
        $data['message'] = 'Hola! El valor recibido es correcto.';
        $data['userData'] =  [
            'username' => $name,
            'numTrophies' => 5,
            'favMap' => 'pisosPicados',
            'completedLevels' => [
                 [
                    'name' => 'pisos Picodos',
                    'time' => '1:00:20', 
                    'trophies' => [
                        'bronze' => true,
                        'silver' => true,
                        'gold' => true
                    ]
                ],
                [
                    'name' => 'summoner Rift',
                    'time' => '3:34:05',
                    'trophies' => [
                        'bronze' => true,
                        'silver' => true,
                        'gold' => false
                    ]
                ]
            ],
            'friendsList' => ['David', 'Oscar', 'Adnan'],
            'notifications' => ['Luis', 'Jose']         
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

function recoverPassword($user){
    $data = [];
    $data['success'] = true;
    $data['message'] = 'Todo ha ido bien.';
    $data['mail'] = $user;

    return $data;
}

function friendData($user){
    $data = [];
    $data['success'] = true;
    $data['userData'] = [
        'usuario' => $user,
        'numCopas' => 69,
        'favMap' => 'la grieta del rift'
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
        ],
        'tomatoTown' => [
            'Kroma0' => '01:00:02',
            'Subpole' => '02:36:21',
            'Striller' => '03:01:56',
            'Alextintor' => '03:10:03'
        ]
    ];

    return $data;
}

function friendRequest($params) {
    $data = [];
    $data['success'] = true;
    $data['message'] = 'Todo ha ido bien.';
    $data["params"] = $params;

    return $data;
}

function sendRequest($params) {
    $data = [];
    $data['success'] = true;
    $data['message'] = 'Todo ha ido bien.';
    $data["params"] = $params;

    return $data;
}

function closeSession($params) {
    $data = [];
    $data['success'] = true;
    $data['message'] = 'Todo ha ido bien.';
    $data["params"] = $params;

    return $data;
}

?>