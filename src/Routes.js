import Records from "./Pages/Records.vue";
// import Home from "./Pages/Home.vue";
import AuthPage from "./Pages/Auth.vue";
import Folders from "./Pages/Folders.vue";
import Collections from './Pages/Collections.vue';
// Main Routes
export const routes =[
    
    {path:"/", component: AuthPage}, //reversed  
    {path:"/records", component: Records},
    {path:"/browse-collections", component: Collections},
    {path:"/browse-folders", component: Folders},
]