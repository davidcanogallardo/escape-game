Vue.component('login', {
    template: //html
    `     
    <div class="page login-page">  
        <div id="forms-container" >
            <div  class="sign-up-container">
                <h2 >CREAR CUENTA</h2>
                <form id="signup" method="put" >  
                    <label for="email" required="">Email</label>
                    <input type="email" id="register_email" name="mail" required="" >
                    <label for="uname">Nombre de usuario</label>
                    <input type="text" id="lname" name="username" required="" >
                    <label for="password">Contraseña</label>
                    <input type="password" id="register_password" name="password" required="">
                    <label for="confirm">Repetir contraseña</label>
                    <input type="password" id="confirm" name="password_confirm" required="">

                    <div class=" form-button blue signup-link">CREAR CUENTA</div>
                </form>
            </div>

            <hr id="form-space" >

            <div  class="sign-up-container">
                <h2 >INICIAR SESIÓN</h2>
                <form id="login" method="post" >  
                    <label for="uname">Nombre de usuario</label>
                    <input type="text" id="login-name" name="username" v-model="input.username" required="" >
                    <label for="password">Contraseña</label>
                    <input type="password" id="login_password" name="password" v-model="input.password" required="">
                    <div class="recover-link link" page="recover-page">
                        <a class="recover-link link" page="recover-page">
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
            input: {
                username: "",
                password: ""
            }
        }
    },
    methods: {
        login() {
            console.log(this.input);
            console.log(this.input.username);
            console.log(this.input.password);
            loginn(this.input)
        }
    }
})