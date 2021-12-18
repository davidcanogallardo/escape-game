Vue.component('login', {
    template: //html
    `     
    <div class="page login-page">  
        <div id="forms-container" >
            <div  class="sign-up-container">
                <h2 >{{ $t("createaccount") }}</h2>
                <form id="signup" method="put" >  
                    <label for="email" required="">Email</label>
                    <input type="email" id="register_email" name="mail" v-model="signupInput.mail" required>
                    <label for="uname">{{ $t("username") }}</label>
                    <input type="text" id="lname" name="username" v-model="signupInput.username" required>
                    <label for="password">{{ $t("password") }}</label>
                    <input type="password" id="register_password" name="password" v-model="signupInput.password" required>
                    <label for="confirm">{{ $t("repeatpassword") }}</label>
                    <input type="password" id="confirm" name="password_confirm" v-model="signupInput.password_confirm" required>

                    <p v-if="!errorMessageIsEmpty() && this.errorType == 'register'" class="form_error">{{ signupErrorMessage }}</p>

                    <div class=" form-button blue signup-link" v-on:click="signup()">{{ $t("createaccount") }}</div>
                </form>
            </div>

            <hr id="form-space" >

            <div  class="sign-up-container">
                <h2 >{{ $t("login") }}</h2>
                <form id="login" method="post" >  
                    <label for="uname">{{ $t("username") }}</label>
                    <input type="text" id="login-name" name="username" v-model="loginInput.username" required>
                    <label for="password">{{ $t("password") }}</label>
                    <input type="password" id="login_password" name="password" v-model="loginInput.password" required>
                    <div class="recover-link link" page="recover-page">
                        <a class="recover-link link" page="recover-page" v-on:click="$emit('change-page','password-recover')">
                            <b>{{ $t("forgotpassword") }}</b>
                        </a>
                    </div>
                    <p v-if="!errorMessageIsEmpty() && this.errorType == 'login'" class="form_error">{{ loginErrorMessage }}</p>
                    <div class=" form-button blue login-link" v-on:click="login()">{{ $t("login") }}</div>
                </form>
                <div class="error"></div>
            </div>
            
        </div>
        <div class="btn red volver settings-link link" page="settings-page" v-on:click="$emit('change-page','home')">
        {{ $t("return") }}
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
                password_confirm: "",
                mail: ""
            },
            signupErrorMessage: "",
            loginErrorMessage: "",
            errorType: ""
        }
    },
    methods: {
        login() {
            console.log(this.loginInput);
            console.log(this.loginInput.username);
            console.log(this.loginInput.password);
            if(!this.loginInputisEmpty()){
                this.$root.loginPetition(this.loginInput)
            } else {
                console.log('campos vacios');
                this.errorType = "login";
                this.loginErrorMessage = "Hay campos vacios";
            }
            
        },
        signup() {
            console.log(this.signupInputEmpty());
            if(this.signupInputEmpty()==false){
                console.log('no hay campos vacios');
                if(this.signupInput.password === this.signupInput.password_confirm){
                    let testEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.signupInput.mail);
                    console.log(testEmail);
                    if(testEmail){
                        console.log("Contraseñas iguales");
                        console.log(this.signupInput);
                        console.log(this.signupInput.username);
                        console.log(this.signupInput.password);
                        console.log(this.signupInput.mail);
                        this.$root.signupPetition(this.signupInput);
                    } else {
                        this.errorType = "register";
                        this.signupErrorMessage = "Introduce un email valido";
                    }
                } else {
                    this.errorType = "register";
                    this.signupErrorMessage = "Las contraseñas no coinciden";
                }

            } else {
                this.errorType = "register";
                this.signupErrorMessage = "Hay campos vacios";
            }
        },
        loginInputisEmpty(){
            if(this.loginInput.username == "" || this.loginInput.password == ""){
                return true;
            } else {
                return false;
            }
        },
        signupInputEmpty(){
            if(this.signupInput.username == "" || this.signupInput.password == "" || this.signupInput.mail == "" || this.signupInput.password_confirm == ""){
                return true;
            } else {
                return false;
            }
        },
        errorMessageIsEmpty(){
            if(this.signupErrorMessage == "" && this.loginErrorMessage == ""){
                return true;
            } else {
                return false;
            }
        }

    }
})