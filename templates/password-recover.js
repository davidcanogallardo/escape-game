Vue.component('password-recover', {
    template: //html
    `             
    <div style="/*! width: 80%; */">
        <h1>RECUPERAR CONTRASEÑA</h1>
        <p>Las instrucciones de recuperacion de contraseña se enviaran al correo electronico especificado en el registro</p>
            <div id="recover-form">
                <form class="recover-form" id="form-recover" method="post">
                    <label for="email">Email</label>
                    <input type="email" id="recover_email" name="mail" v-model="mail">

                    <input type="button" class="btn blue signup-link" value="Recuperar contraseña" v-on:click="recover()">
                    <!-- <div style="width:37vw;">
                        <div class="form-button blue recover-pass" page="login-page">ENVIAR</div>
                    </div> -->
                </form>
            </div>
            <div class="btn red volver link " page="login-page" v-on:click="$emit('change-page','login')">Volver</div>
    </div>
    `, 
    data() {
        return {
            mail: ""
        }
    },
    methods:{
        recover(){
            recoverPassword(this.mail);
        }
    }
})
