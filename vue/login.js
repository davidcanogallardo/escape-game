Vue.component('login', {
    template: //html
    `     
    <div class="page login-page">  
        <div id="forms-container" >
            <div  class="sign-up-container">
                <h2 >CREAR CUENTA</h2>
                <form id="signup" method="put" >  
                    <label for="email" required="">Email</label>
                    <input type="email" id="register_email" name="mail" v-model="signupInput.mail" required="" >
                    <label for="uname">Nombre de usuario</label>
                    <input type="text" id="lname" name="username" v-model="signupInput.username" required="" >
                    <label for="password">Contraseña</label>
                    <input type="password" id="register_password" name="password" v-model="signupInput.password" required="">
                    <label for="confirm">Repetir contraseña</label>
                    <input type="password" id="confirm" name="password_confirm" required="">

                    <div class=" form-button blue signup-link" v-on:click="signup()">CREAR CUENTA</div>
                </form>
            </div>

            <hr id="form-space" >

            <div  class="sign-up-container">
                <h2 >INICIAR SESIÓN</h2>
                <form id="login" method="post" >  
                    <label for="uname">Nombre de usuario</label>
                    <input type="text" id="login-name" name="username" v-model="loginInput.username" required="" >
                    <label for="password">Contraseña</label>
                    <input type="password" id="login_password" name="password" v-model="loginInput.password" required="">
                    <div class="recover-link link" page="recover-page">
                        <a class="recover-link link" page="recover-page" v-on:click="$emit('change-page','password-recover')">
                            <b>He olvidado mi contraseña</b>
                        </a>
                    </div>
                    <div class=" form-button blue login-link" v-on:click="login()">INICIAR SESIÓN</div>
                </form>
                <div class="error"></div>
            </div>
        </div>
    </div>
    `, 
    data() {
        return {
            loginInput: {
                username: "",
                password: ""
            },
            signupInput: {
                username: "",
                password: "",
                mail: ""
            }
        }
    },
    methods: {
        login() {
            console.log(this.loginInput);
            console.log(this.loginInput.username);
            console.log(this.loginInput.password);
            loginPetition(this.loginInput)
        },
        signup() {
            console.log(this.signupInput);
            console.log(this.signupInput.username);
            console.log(this.signupInput.password);
            console.log(this.signupInput.mail);
            signupPetition(this.signupInput)
        }
    }
})