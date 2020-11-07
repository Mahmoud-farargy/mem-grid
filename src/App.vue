<template>
    <main>
        <v-app>
            <Header v-if=" currRoute !=='/'" ></Header>
            <keep-alive>
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </keep-alive>
            <Footer  v-if=" currRoute !=='/'"/>
        </v-app>
    </main>
</template>

<script>

import Header from "./Components/Header.vue";
import Footer from "./Components/Footer.vue";
    export default {
        computed:{
            currRoute: function(){
                return this.$route.path;
            }
        },
        components:{
            Header,
            Footer
        }
    }
   // user email 
   // user1@gmail.com
</script>
