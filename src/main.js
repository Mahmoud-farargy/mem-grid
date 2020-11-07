import Vue from "vue";
import App  from "./App.vue";
import VueRouter from "vue-router";
import {routes}from "./Routes";
import VueResource from "vue-resource";
import {store} from "./Store/Store";
import Vuetify from "vuetify";
import 'vuetify/dist/vuetify.min.css';

// Use Vue packages 
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuetify);

// Main Router
const router = new VueRouter({
    routes
})

//Vue Root instance
new Vue({
    el: "#App",
    store,
    router,
    vuetify: new Vuetify(),
    render: h =>h(App)
});