<template>
    <section id="auth" class="auth--page--container">
            <div class="auth--page--outter flex-column">
                <div class="auth--card--inner flex-column">
                    <div class="auth--card--header">
                            <v-avatar  class="auth__avatar__inner flex-column" size="70">
                                <v-icon dark class="auth__av__icon" size="74">
                                        mdi-account-circle
                                </v-icon>
                            </v-avatar>
                    </div>
                    <div class="auth--card--body">
                            <div class="auth--logo flex-row">
                                <h1>Memo Grid</h1>
                            </div>
                            <div class="auth--btns--row flex-row">
                                <button @click="authType = 'login'">
                                    Login
                                </button>
                                <button @click="authType = 'signUp'">
                                    Sign Up
                                </button>
                            </div>
                            <!-- Login -->
                            <div v-if="authType === 'login'" class="auth--login--container">
                                <div>
                                    <v-form
                                                ref="loginForm"
                                                v-model="loginValid"
                                                lazy-validation
                                                >
                                        <v-container>
                                                    <v-row >
                                                    <v-col cols="12">
                                                        <v-text-field dark color="#ff6358"
                                                        label="E-mail*"
                                                        required
                                                        :rules="emailRules"
                                                        v-model="email"
                                                        ></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-text-field  dark color="#ff6358"
                                                        label="Password*"
                                                        type="password"
                                                        v-model="password"
                                                        :counter="10"
                                                        :rules="passRules"
                                                        required
                                                        ></v-text-field>
                                                    </v-col>
                                                    
                                                    </v-row>
                                                </v-container>
                                                <div v-if="loginErrMsg !== ''" class="alert alert-danger text-center">
                                                    <p>{{loginErrMsg}}</p>
                                                </div>
                                                <v-spacer></v-spacer>
                                        <v-card-actions align="center" class="auth--bottom-row">
                                                <v-btn class="auth__btn"
                                                    color="#ff6358" dark
                                                    :loading="loading4"
                                                    :disabled="!loginValid"
                                                @click="confirmLogin">
                                                    Login
                                                    <template v-slot:loader>
                                                        <span class="custom-loader">
                                                        <v-icon light>mdi-cached</v-icon>
                                                        </span>
                                                    </template>
                                                </v-btn>
                                                
                                        </v-card-actions>
                                    </v-form>
                                </div>
                            </div> 
                            <!-- Sign up -->
                            <div v-else>
                             <v-form
                                    ref="signUpForm"
                                    v-model="signUpValid"
                                    lazy-validation
                                    >
                                <v-container>
                                    <div class="auth--invitation--msg">
                                        <h3>Sign up now to be able to create uncountable amount of records.</h3>
                                    </div>
                                            <v-row >
                                            <v-col cols="12">
                                                <v-text-field dark color="#ff6358"
                                                label="User Name*"
                                                required
                                                :rules="nameRules"
                                                v-model="userName"
                                                ></v-text-field>
                                            </v-col>
                                             <v-col cols="12">
                                                <v-text-field dark color="#ff6358"
                                                label="E-mail*"
                                                required
                                                :rules="emailRules"
                                                v-model="email"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field  dark color="#ff6358"
                                                v-model="password"
                                                label="Password*"
                                                type="password"
                                                :counter="10"
                                                :rules="passRules"
                                                required
                                                ></v-text-field>
                                            </v-col>
                                            <!-- <v-col cols="12">
                                                <v-text-field  dark color="#ff6358"
                                                label="Re-type Password*"
                                                v-model="rePass"
                                                :rules="repassRules"
                                                type="password"
                                                required
                                                ></v-text-field>
                                            </v-col> -->
                                            
                                            </v-row>
                                        </v-container>
                                        <div v-if="signUpErrMsg !== ''" class="alert alert-danger text-center">
                                                <p>{{signUpErrMsg}}</p>
                                        </div>
                                        <v-spacer></v-spacer>
                                        <!-- <v-row> -->
                                        <v-card-actions align="center" class="auth--bottom-row">
                                        <v-btn class="auth__btn"
                                            color="#ff6358" dark
                                            @click="confirmSignUp"
                                            :disabled="!signUpValid"
                                        >
                                            Sign Up
                                            <template v-slot:loader>
                                                        <span class="custom-loader">
                                                        <v-icon light>mdi-cached</v-icon>
                                                        </span>
                                            </template>
                                        </v-btn>
                                        <!-- </v-row> -->
                                        
                                    </v-card-actions>
                                </v-form>
                            </div>
                    </div>
                    <div class="auth--card--footer">
                            <p>&copy; 2020 Mahmoud Farargy</p>
                    </div>
                </div>
            </div>
    </section>
</template>
<script>
    import $ from "jquery";
    import {db, auth} from "../Config/firebase";
    export default {
        data: function(){
            return{
                authType: "login",
                loginValid: true,
                loader: null,
                loading4: false,
                signUpValid: true,
                userName: "",
                nameRules: [
                     v => !!v || 'Username is required',
                     v => (v && v.length <= 15) || 'Username must be less than 15 characters',
                ],
                loginErrMsg: "",
                signUpErrMsg: "",
                password: '',
                passRules: [
                    v => !!v || 'password is required',
                    v => (v && v.length >= 6 && v.length <= 10) || 'password must be between 6 and 10 characters',
                ],
                email: '',
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) && v.length >=7 || 'E-mail must be valid',
                ],
                // rePass: "",
                // repassRules: [
                //     v => !!v || 'Re-typing password is required',
                //     v => (v && v.length <= 10) || 'password does not match the one you typed above',
                // ]
            }
        },
        watch: {
            loader () {
                const l = this.loader
                this[l] = !this[l]

                setTimeout(() => (this[l] = false), 3000)

                this.loader = null
            },
        },
        methods:{
            confirmSignUp() { //sign up
                this.$refs.signUpForm.validate();
                if(this.signUpValid){
                    this.loader = 'loading4';
                    auth.createUserWithEmailAndPassword(this.email.trim().toLowerCase(), this.password).then(cred=>{
                        db.collection("users").doc(cred.user.uid).set({
                            userName:this.userName,
                            uid: cred.user.uid,
                            bio: "",
                            folders: []
                        })
                        
                    }).then(()=>{
                        this.resetForm();
                        alert("A new account has been created. Enjoy!");
                        this.$router.push("/browse-folders");
                    }).catch(err=>{
                        this.signUpErrMsg = err.message;
                    }); 
                }
            },
            confirmLogin(){ //login
                this.$refs.loginForm.validate();
                if(this.loginValid && this.email && this.password){
                    auth.signInWithEmailAndPassword(this.email.trim().toLowerCase(), this.password).then(res=>{
                        
                        auth.onAuthStateChanged( authUser =>{
                            if(authUser){
                                this.$store.dispatch("updateUid", authUser?.uid)
                                db.collection("users").doc(authUser?.uid).onSnapshot(data=>{
                                    this.$store.dispatch("updateReceivedData", data.data());
                                });
                                this.$store.dispatch("changeUserState", true);
                                 this.$router.push("/browse-folders"); //users gets redirected to the folders page
                                 console.log(res);
                            }else{
                                this.$store.dispatch("changeUserState", false);
                            }
                           
                        })
                    this.resetForm();
                    }).catch(err =>{
                        this.loginErrMsg = err.message;
                    })
                
                    this.loader = 'loading4'; 
                }
            },
            resetForm(){
                this.authType = "login";
                this.loginValid = true;
                this.loader = null;
                this.loading4 = false;
                this.signUpValid =true;
                this.email ="";
                this.password= "";
                this.loginErrMsg ="";
                this.signUpErrMsg ="";
                this.userName="";
            }
        },
        created(){
            $(document).ready(()=>{ //operates jQuery
                $(".auth--btns--row button").on("click", function(){
                    $(".auth--btns--row button").each((i,item) =>{
                        $(item).removeClass("active-auth");
                    })
                    $(this).addClass("active-auth");
                });
            });
        }
    }
</script>
<style scoped>
    .auth--page--container{
        width:100%;
        background: linear-gradient(120deg ,#ff6358, rgb(243, 139, 98), rgb(247, 173, 172));
        min-height:100vh;
        height:auto;
    }
    .auth--page--outter{
        min-height:100vh;
        height:auto;
        align-items:center;
        justify-content: center;
    }
    .auth--card--inner{
        transition: all 0.6s ease;
        padding:15px;
        width:350px;
        min-height:250px;
        border-radius:22px;
        background-color: rgb(20, 20, 20);
        color:#fff;
        box-shadow: 3px 5px 18px rgba(0,0,0,0.5);
    }
    .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
    @-moz-keyframes loader {
        from {
        transform: rotate(0);
        }
        to {
        transform: rotate(360deg);
        }
    }
    @-webkit-keyframes loader {
        from {
        transform: rotate(0);
        }
        to {
        transform: rotate(360deg);
        }
    }
    @-o-keyframes loader {
        from {
        transform: rotate(0);
        }
        to {
        transform: rotate(360deg);
        }
    }
    @keyframes loader {
        from {
        transform: rotate(0);
        }
        to {
        transform: rotate(360deg);
        }
    }
    .auth--card--header{
        position: relative;
        padding-top:30px;
    }
    .auth__avatar__inner{
        position: absolute;
        border-radius: 50%;
        width:100px;
        height:100px;
        align-items:center;
        justify-content:center;
        top:-10px;
        left:50%;
        transform: translate(-50%,-50%);
        background-color: rgb(20, 20, 20);
    }
    /* .auth__av__icon{
        font-size:74px;
    } */
    #auth .auth--card--body .auth--btns--row{
        justify-content:space-between;
        width:80%;
        max-width:250px;
        margin:0 auto;
    }
    #auth .auth--card--body .auth--btns--row > button{
        border:none;
        background: transparent;
        padding:4px 6px;
        color:var(--second-gray);
        font-size: 15px;
        font-weight: 600;
        border-bottom: 3px solid var(--second-gray);
    }
    #auth .auth--card--body .auth--btns--row > button:focus{
        outline:none;
    }
    #auth .auth--card--body .auth--btns--row .active-auth {
        color:#fff;
        border-bottom-color: #fff;
    }
    .auth--card--footer p{
        font-size:11px;
        font-weight:700;
        margin-top:9px;
        text-align:center;
        color: rgb(153, 152, 152); /*<<change this color*/
    }
    .auth--bottom-row{
        width:100%;
        justify-content:center;
    }
    .auth--logo{
        width:100%;
        justify-content:center;
        text-align:center;
    }
    .auth--logo h1{
        font-family: var(--logo-font);
        width:103px;
        margin-bottom:15px;
        color:var(--primary-clr);
        text-decoration:none;
        font-size:31px;
        height: 25px;
        font-weight: 600;
        white-space:nowrap;
    }
    .auth--invitation--msg h3{
        font-size:13px;
        font-weight:800;
        text-align:center;
        margin:4px auto;
        color: var(--dusty-rose);
    }
    .auth__btn{
        padding-right: 10px;
        padding-left:10px;
        font-weight:700;
        width:60%;
    }
    @media only screen and (max-width:670px){
        .auth--card--inner{
            width:90%;
        }
        .auth__btn{
            width:90%;
        }
    }
</style>