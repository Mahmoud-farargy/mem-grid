<template>
    <header id="header" class="main--header">
        <div class="header--inner flex-row container">
            <div class="logo">
                <div class="header--logo flex-row">
                        <router-link to="/"><h1>Memo Grid</h1></router-link>
                </div>
            </div>
            <nav class="nav">
                <ul class="nav--ul">
                    <li  @click="logout"> <h5 class="logout--txt">Log Out</h5> </li>
                </ul>
            </nav>
        </div>
    </header>
</template>
<script>
import {auth} from "../Config/firebase";

    export default {
        methods:{
            logout(){
                auth.signOut();
                this.$router.push("/");
            }
        }
    }

</script>

<style scoped> 
    .main--header{
        height: 50px;
        position: fixed;
        top:0;
        width:100%;
        left:0;
        background-color: #424242;
        z-index: 200;
        box-shadow: 0  1px 10px rgba(0,0,0,0.3); 
    }
    .header--inner{
        justify-content:space-between;
        align-items:center;
    }
    #header.nav .nav--ul{
        list-style: none;
        padding:0;
        margin:0;
    }
    .header--logo{
        width:100%;
        justify-content:center;
        text-align:center;
    }
    .header--logo h1{
        align-self:start;
        font-family: var(--logo-font);
        width:103px;
        margin-bottom:15px;
        color:var(--primary-clr);
        text-decoration:none;
        font-size:31px;
        height: 25px;
        font-weight: 600;
        white-space:nowrap;
        margin-bottom:20px;
        transition: color 0.3s linear;
    }
    .logout--txt{
        cursor:pointer;
        color:#fff;
        font-size:15px;
        font-weight:600;
    }
</style>