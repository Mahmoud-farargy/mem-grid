<template>
    <section  class="folders--container">
        <div class="sticky--nav flex-row">
                <div class="nav--directions flex-row">
                    <v-icon class="nav__directions__ico disabled" :disabled="true" @click="changeNav(-1)">mdi-arrow-left-drop-circle</v-icon>
                    <v-icon class="nav__directions__ico" @click="changeNav(1)">mdi-arrow-right-drop-circle</v-icon>
                </div>
                <div class="coll--title">
                    <h4 class="coll__title">{{greetingMSG}}</h4>
                </div>
                <div class="drag--lock">
                    <v-icon size="25" @click="disableDragging= !disableDragging" :color="disableDragging ? 'orange' : 'green'" style="cursor:pointer; width:30px; height:30px; transition: color 0.3s linear;"> {{disableDragging ? "mdi-lock" : "mdi-lock-open-variant"}} </v-icon>
                </div>
        </div>
        <div class="main--comp">
            <ul v-if="$store.state.receivedData.folders" > <!-- folders menu  -->
                <draggable  @end="onEnd"  class="folders--menu" v-model="$store.state.receivedData.folders" handle=".folders--draggable--area" ghost-class="ghost">
                    <!-- list items -->
                        <li v-for ="(folder,index) in $store.state.receivedData.folders"  :key="index + folder.folderId"  class="sortable"  @click="doubleClickEffect(index, folder.folderId)">
                            <div class="individual--folder flex-column">
                                
                            <div class="folder--upper">
                                    <v-icon :style="{color: colorOutput(folder.color)}" class="folder__icon">mdi-folder</v-icon>
                                    <div v-if="disableDragging" class="edit--icon" @click.stop="editFolder(index)"><v-icon class="edit__pen__inner">mdi-pen</v-icon></div>
                                    <div v-if="!disableDragging" class="folders--draggable--area flex-column">
                                        <v-icon color="#222" size="30">mdi-drag</v-icon>
                                    </div> 
                                </div>
                                
                                <h5 class="folder__name">{{folder.folderTitle}}</h5> 
                            </div>
                        </li>
                    <!-- extra items -->
                        <div class="empty--folder flex-column" v-if="$store.state.receivedData.folders.length <1">
                            <h4>No Folders to show.<br/>You need to add Some.</h4>
                        </div>
                        <div class="create--new--folder flex-column">
                                <div class="new--folder--el flex-column" @click="dialog = true">
                                    <v-icon class="new__fold__ico" size="40">mdi-plus</v-icon>
                                    <h5 >Add New</h5>
                                </div>
                        </div>
                </draggable>
                
                
            </ul>
            <!-- create Modal -->
            <template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="300px"
    >
      <v-card>
        <v-card-title>Add New Folder</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          
        <!-- modal body -->
        <v-text-field
        label="Title*"
        color="#ff6358"
        required
        v-model="newFolderTitle"
        ></v-text-field>
        <v-select
                :items="['Living Coral', 'Ultra Violet', 'Greenery', 'Rose Quartz' ,'Radiand Orchid','Emerald', 'Tangerine Tango','Honeysucle','Turquoise','Mimosa','Blue Izis','Chili Pepper','Tigerlily','Aqua Sky','True Red','Fuchsia Rose','Cerulean Blue','Yellow']"
                label="Color*"
                color="#ff6358"
                required
                v-model="newFolderClr"
        ></v-select>
        <!--x modal body x-->
        </v-card-text>
        <div v-if="createErrMsg" class="alert alert-danger text-center">
            <p>{{createErrMsg}}</p>
        </div>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="#ff6358"
            text
            @click="closeDialog"
          >
            Close
          </v-btn>
          <v-btn
            color="#ff6358"
            text
            @click="createNewFolder"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
            <!--x End Modal x-->
            <!-- Edit Modal -->
        <template>
            <v-row justify="center">
                <v-dialog
                v-model="editDialog"
                scrollable
                max-width="300px"
                >
                <v-card>
                    <v-card-title>Edit Folder</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 300px;">
                    <v-radio-group
                        v-model="dialogm2"
                        column
                    >
                    <!-- modal body -->
                    <v-text-field
                    label="Title*"
                    color="#ff6358"
                    required
                    v-model="updatedTitle"
                    ></v-text-field>
                    <v-select
                            :items="['Living Coral', 'Ultra Violet', 'Greenery', 'Rose Quartz' ,'Radiand Orchid','Emerald', 'Tangerine Tango','Honeysucle','Turquoise','Mimosa','Blue Izis','Chili Pepper','Tigerlily','Aqua Sky','True Red','Fuchsia Rose','Cerulean Blue','Yellow']"
                            label="Color*"
                            color="#ff6358"
                            required
                            v-model="updatedColor"
                    ></v-select>
                    <!--x modal body x-->
                    </v-radio-group>
                    </v-card-text>
                    <div v-if="createErrMsg" class="alert alert-danger text-center">
                        <p class="m-0">{{createErrMsg}}</p>
                    </div>
                    <div class="folder--date">
                        <h5>Created in {{new Date(folderDate.seconds * 1000).toLocaleString()}}</h5>
                    </div>
                    <div class="del--btn--div flex-row">
                       <v-btn color="rgb(211, 21, 21)" dark class="del__btn" @click="deleteFolder">Delete Folder</v-btn> 
                    </div>
                    
                    <v-divider></v-divider>
                    <v-card-actions>
                    <v-btn
                        color="#ff6358"
                        text
                        @click="closeEditDialog"
                    >
                        Close
                    </v-btn>
                    <v-btn
                        color="#ff6358"
                        text
                        @click="confirmChanges"
                    >
                        Save
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-row>
        </template>
            <!--x End Edit Modal x-->
        </div>
        <!-- <router-link v-else to="/"></router-link> -->
    </section>
</template>

<script>
import {auth} from "../Config/firebase";
import draggable from "vuedraggable";
    export default {
        data: function(){
            return{
                clicksCount: 0,
                dialog: false,
                editDialog: false,
                clickedOnFolderIndex: "",
                dialogm2: "",
                newFolderTitle: "",
                newFolderClr: "",
                folderDate:"",
                updatedTitle: "",
                updatedColor: "",
                createErrMsg:"",
                isLoggedIn: false,
                disableDragging: true
            }
        },
        components:{
            draggable
        },
        computed:{
            greetingMSG:{
                get(){ //getter
                    if(this.isLoggedIn){
                        const period = new Date().getHours() >= 12 ? "Evening": "Morning";
                        return `Good ${period}, ${this.$store.getters.receivedData.userName ?  this.$store.getters.receivedData.userName : "User"}`; 
                    }else{
                        return "Please Log in first";
                    } 
                },
                set(val){ //setter
                    this.greetingMSG = val;
                }
               
            }            
        },
        methods: {
            doubleClickEffect(index, id){
                this.clicksCount +=1; //single click
                const resetClicksCount = ()=>{ 
                    this.clicksCount = 0;
                }
                setTimeout(()=>{
                        resetClicksCount();
                },1000);
                if(this.clicksCount >= 2){ //double click
                    resetClicksCount();
                    // redirects user to the collections page with the right data
                    
                    let checkIndex = this.$store.state.receivedData.folders.findIndex(folder => folder.folderId === id);
                    
                    if(checkIndex === index){
                        this.$store.dispatch("changeCurrFolderInfo", {id: id, index: index});
                    }else{
                        alert("error");
                    }
                    this.$router.push("/browse-collections");
                   
                }
            } ,
            createNewFolder(){
                const generateNewId = () =>{
                        let alphabets = ["A", "B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
                        var charRandom =()=>{
                        return Math.floor((Math.random() *25 )+1);
                        }
                        const numRandom=()=>{
                        return alphabets[charRandom()] + alphabets[charRandom()] + alphabets[charRandom()] + Math.random() *9999 +1 + alphabets[charRandom()]+ alphabets[charRandom()] + alphabets[charRandom()] ;
                        }
                        
                        return numRandom();
                    }  
                if(this.newFolderTitle.length >=1 &&  this.newFolderTitle.length <15){
                    if(this.newFolderClr !== ""){
                        if(this.$store.state.isLoggedIn){
                            let foldersCopy = JSON.parse(JSON.stringify(this.$store.state.receivedData.folders));
                            let newArr={
                                folderTitle: this.newFolderTitle,
                                color: this.newFolderClr,
                                date: new Date(),
                                collections: [],
                                folderId: generateNewId()
                            }
                            foldersCopy.unshift(newArr);
                            //updates "folders" array in database
                            if(foldersCopy){
                                this.$store.dispatch("updateDatabase", {type:"folders", newData: foldersCopy});
                            }
                            this.dialog = false;
                            this.newFolderClr ="";
                            this.newFolderTitle =""; 
                            this.createErrMsg="";
                        }
                    }else{
                        this.createErrMsg="Choosing a color is required.";
                    }
                }else{
                    this.createErrMsg="Title should be between 1 and 15 characters.";
                }
                
            },
            closeDialog(){
                this.dialog = false;
                this.createErrMsg="";
                this.newFolderClr ="";
                this.newFolderTitle =""; 
            },
            editFolder(index){
                this.clickedOnFolderIndex= index;
                const folderArr = this.$store.state.receivedData.folders[index];
                this.updatedTitle = folderArr.folderTitle;
                this.updatedColor = folderArr.color;
                this.folderDate = folderArr.date;
                this.editDialog =true;
            },
            deleteFolder(){
                let foldersCopy = JSON.parse(JSON.stringify(this.$store.state.receivedData.folders));
               
                 if(foldersCopy && confirm(`Are you sure you want to delete ${this.$store.state.receivedData.folders[this.clickedOnFolderIndex].folderTitle}?`)){
                    foldersCopy.splice(this.clickedOnFolderIndex,1);
                   this.$store.dispatch("updateDatabase", {type:"folders", newData: foldersCopy});
                   this.closeEditDialog();
                }
            },
            confirmChanges(){
                let foldersCopy = JSON.parse(JSON.stringify(this.$store.state.receivedData.folders));
                foldersCopy[this.clickedOnFolderIndex].folderTitle = this.updatedTitle ? this.updatedTitle : "Folder Title";
                foldersCopy[this.clickedOnFolderIndex].color = this.updatedColor ? this.updatedColor : "blue";
                if(foldersCopy){
                   this.$store.dispatch("updateDatabase", {type:"folders", newData: foldersCopy});
                   this.closeEditDialog();
                }
            },
            closeEditDialog(){
                this.editDialog= false;
                this.updatedTitle= "";
                this.updatedColor= "";
                this.folderDate="";
            },
            onEnd(){
                let foldersCopy = JSON.parse(JSON.stringify(this.$store.state.receivedData.folders)); 
                this.$store.dispatch("updateDatabase", {type:"folders", newData: foldersCopy});
            },
            changeNav(direction){
                this.$router.go(direction);
            },
            colorOutput(color){
                switch (color.trim()){ //interpret colors so code can understand and implement them
                    case "Living Coral": 
                        return "#FF6F61";
                    case "Ultra Violet":
                        return "#6B5B95";
                    case "Greenery":
                        return "#88B04B";
                    case "Radiand Orchid":
                        return "#B565A7";
                    case "Emerald":
                        return "#009B77";
                    case "Tangerine Tango":
                        return "#DD4124";
                    case " Honeysucle":
                        return "#D65076";
                    case "Turquoise":
                        return  "#45B8AC";
                    case "Mimosa":
                        return "#EFC050";
                    case "Blue Izis":
                        return "#5B5EA6";
                    case "Chili Pepper":
                        return "#9B2335";
                    case "Tigerlily":
                        return "#E15D44";
                    case "Aqua Sky":
                        return "#7FCDCD";
                    case "True Red":
                        return "#BC243C";
                    case "Fuchsia Rose":
                        return "#C3447A";
                    case "Cerulean Blue":
                        return " #98B4D4";
                    case "Yellow":
                        return "yellow";
                    default:
                        return "#BC243C";
                }
            }
        },
        created(){
            
            auth.onAuthStateChanged(user =>{
                this.isLoggedIn = user ? true : false;
            })
        }
    }
</script>

<style scoped>
/* #643E46FF */
    .folders--container{
        background-color:var(--light-gray);
    }
    .folder__icon{
        transition: all 0.5s ease;
        font-size: 180px !important;
    }
    .folders--menu{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap:15px;
        list-style: none;
        padding:20px 0;
        margin:0;
        user-select: none;
    }
    .individual--folder{
        
        align-items:center;
        cursor:pointer;
        transition: transform 0.2s ease;
    }
    .individual--folder:hover ,.new--folder--el:hover{
        transform: scale(1.01);
    }
    .individual--folder:hover .edit--icon{
        display: block;
        z-index:30;
    }
    .empty--folder{
        border-radius:10px;
        border: var(--main-border);
        box-shadow: 2px 5px 10px rgba(0,0,0,0.07);
        overflow: hidden auto;
        width:100%;
        cursor:pointer;
        background-color: #fff;
        justify-content:center;
        align-items:center;
        text-align:center;
    }
    .empty--folder h4{
        font-size:14px;
        font-weight: 600;
    }
    .new--folder--el:active .new__fold__ico{
        transform: rotate(360deg);
        /* font-size:40px ; */
    }
    .individual--folder .folder--upper{
        position: relative;
    }
    .edit--icon{
        display:none;
        position: absolute;
        top:47.5px;
        right:17px;
        padding:4px;
        background-color:rgb(82, 82, 82);
        border-radius: 50%;
    }
    .edit__pen__inner{
        font-size:23px !important;
        color:#fff !important;
    }
    .del--btn--div{
        justify-content:center;
    }
    .del__btn{
        margin:0 auto;
        font-size:14px;
        font-weight: 600;
    }
    .folder__name{
        color:inherit;
        text-transform: capitalize;
        font-size: 16px;
        font-weight:700;
        padding:0;
        margin:0;
        text-align:center;
    }
    .sortable{
        cursor:move;
    }
    .new--folder--el{
        align-items:center;
        justify-content: center;
        text-align:center;
        width:170px;
        height:170px;
        border: 2px solid rgb(31, 31, 31);
        border-radius:7px;
        margin:0;
        padding:0;
        cursor:pointer;
        background-color:#fff;
    }
    .create--new--folder{
        margin:4px;
        align-items: center;
        justify-content: center;
    }
    .new--folder--el h5{
        font-size:15px;
        font-weight: 600;
        margin:8px 0 0;
        text-transform: capitalize;
        color: var(--primary-clr);
    }
    .folder--date{
        width:70%;
        text-align:center;
        white-space: pre-wrap;
        color:var(--second-gray);
        margin:0 auto;
    }
    .folder--date h5{
        font-size:15px !important;
        font-weight:500;
    }
    .folders--draggable--area{
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        /* padding:45px 60px; */
        background-color: rgba(255,255,255,0.4);
        justify-content: center;
        align-items:center;
        text-align:center;
        z-index:250;
        width:84%;
        height:80%;
    }
    @media only screen and (max-width: 670px){
        .individual--folder:hover ,.new--folder--el:hover{
            transform: none;
        }
        .individual--folder .edit--icon{
            display: block !important;
        }
    }
</style>