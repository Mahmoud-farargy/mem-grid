<template>
    <section id="collections" class="collections--container">
        <div class="sticky--nav flex-row">
                <div class="nav--directions flex-row">
                    <v-icon class="nav__directions__ico" @click="changeNav(-1)">mdi-arrow-left-drop-circle</v-icon>
                    <v-icon class="nav__directions__ico" @click="changeNav(1)">mdi-arrow-right-drop-circle</v-icon>
                </div>
                <div class="coll--title">
                    <h4 class="coll__title">{{$store.state.receivedData.folders[$store.state.currFolderInfo.index].folderTitle}}</h4>
                </div>
                 <div class="drag--lock">
                    <v-icon size="25" @click="disableDragging= !disableDragging" :color="disableDragging ? 'orange' : 'green'" style="cursor:pointer; width:30px; height:30px; transition: color 0.3s linear;"> {{disableDragging ? "mdi-lock" : "mdi-lock-open-variant"}} </v-icon>
                </div>
        </div>
        <div class="main--comp"> <!--0 = false, 1 = true-->
            <ul v-if="$store.state.currFolderInfo.index || $store.state.currFolderInfo.index === 0" >
                <draggable class="collections--menu" handle=".collection--draggable--area" v-model="$store.state.receivedData.folders[$store.state.currFolderInfo.index].collections" @start="drag='true'" @end="onEnd">
                     <li  v-for="(collection, index) in $store.state.receivedData.folders[$store.state.currFolderInfo.index].collections" class="sortable" :key="index">
                        <div class="individual--collection flex-column" @click="doubleClickEffect(index, collection.id)">
                            <div class="collection--upper flex-column">
                                <v-icon v-if="disableDragging" class="collection__ico">mdi-file</v-icon>
                                    <!-- dragg icon -->
                                <div v-if="!disableDragging" class="collection--draggable--area flex-column">
                                        <v-icon class="inner__handle" color="#222" size="30">mdi-drag</v-icon>
                                </div>
                            </div>
                            <div class="collection--body">
                            <h5 class="collection--title">{{collection.collectionTitle}}</h5>
                                <div class="collection--bottom--cloud"></div>
                                <p>{{collection.description ? collection.description : "No desciption has been provided."}}</p>
                            </div>
                            <div class="collection--footer flex-row">
                                <div class="collection--footer--btns flex-row">
                                    <v-btn
                                        class="ma-2 collection__btn"
                                        outlined
                                        small
                                        color="#ff6358"
                                        @click.stop="viewRecords(index, collection.id)">
                                        <v-icon class="coll__btn">mdi-eye</v-icon>
                                        View
                                        </v-btn>
                                        <v-btn
                                        @click.stop="editCollection(index)"
                                        class="ma-2 collection__btn"
                                        outlined
                                        small
                                        color="#ff6358"
                                        >
                                        <v-icon class="coll__btn">mdi-pen</v-icon>
                                        Edit
                                        </v-btn>
                                </div>
                                
                                <p class="collection__date">{{ collection.date ? new Date(collection.date.seconds * 1000).toLocaleString(): null}}</p>
                            </div>
                        </div>
                    </li>
                    <div class="empty--folder flex-column" v-if="$store.state.receivedData.folders[$store.state.currFolderInfo.index].collections.length < 1">
                        <h4>No collections to show.<br/>You need to add Some.</h4>
                    </div>
                    <div class="create--new--collection flex-column" @click="dialog= true">
                        <div class="new--folder--el flex-column">
                                <v-icon class="new__coll__ico" size="40">mdi-plus</v-icon>
                                <h5>Add New</h5>
                        </div>
                    </div>
                </draggable>
                
            </ul>
            <!-- Create modal -->
 <template>
    <v-row justify="center">
        <v-dialog
        v-model="dialog"
        scrollable
        max-width="300px"
        >
      <v-card>
        <v-card-title>Add Collection</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
        <!-- modal body -->
                <v-text-field
                    label="Title*"
                    color="#ff6358"
                    required
                    v-model="newCollectionTitle"
                ></v-text-field>
                <v-textarea
                    label="Description"
                    color="#ff6358"
                    required
                    v-model="newCollectionDescription"
                ></v-textarea>
                <!--x modal body x-->
                </v-card-text>
                <div v-if="errorMSG" class="alert alert-danger text-center">
                    <p class="m-0">{{errorMSG}}</p>
                </div>
                <v-divider></v-divider>
                <v-card-actions>
                <v-btn
                    color="#ff6358"
                    text
                    @click="closeCreateDialog"
                >
                    Close
                </v-btn>
                <v-btn
                    color="#ff6358"
                    text
                    @click="createNewCollection"
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
                    <v-card-title>Edit Collection</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 300px;">
                    <!-- modal body -->
                    <v-text-field
                    label="Title*"
                    color="#ff6358"
                    required
                    v-model="updatedTitle"
                    ></v-text-field>
                   <v-textarea
                    label="Description"
                    color="#ff6358"
                    required
                    v-model="updatedDescription"
                    ></v-textarea>
                    <!--x modal body x-->
                    </v-card-text>
                    <div v-if="errorMSG" class="alert alert-danger text-center">
                        <p class="m-0">{{errorMSG}}</p>
                    </div>
                    <div class="folder--date">
                        <h5>Created in {{new Date(collectionDate.seconds * 1000).toLocaleString()}}</h5>
                    </div>
                    <div class="del--btn--div flex-row">
                       <v-btn color="rgb(211, 21, 21)" dark class="del__btn" @click="deleteCollection">Delete Collection</v-btn> 
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
    </section>
</template>

<script>
    import draggable from "vuedraggable";

    export default {
        data: function(){
            return{
                clicksCount:0,
                dialog: false,
                newCollectionTitle: "",
                newCollectionDescription: "",
                errorMSG: "",
                editDialog:false,
                collectionDate: "",
                updatedTitle: "",
                updatedDescription: "",
                clickedOnCollectionIndex: "",
                disableDragging: true
            }
        },
        components:{
            draggable
        },
        methods:{
            closeCreateDialog(){
                this.dialog = false;
                this.newCollectionTitle = "";
                this.newCollectionDescription = "";
                this.errorMSG = "";
            },
            createNewCollection(){
                let foldersCopy = JSON.parse(JSON.stringify(this.$store.state.receivedData.folders)); //creates an array copy
                if(foldersCopy[this.$store.state.currFolderInfo.index].collections){
                    var collectionsCopy = foldersCopy[this.$store.state.currFolderInfo.index].collections; //targets the collections array
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
                            
                           
                        if(this.newCollectionTitle.length >=1 && this.newCollectionTitle.length <= 20){
                            if(this.newCollectionDescription.length <= 100){
                                const newCollectionArr = { //the new collection data to be added
                                    collectionTitle: this.newCollectionTitle,
                                    description: this.newCollectionDescription,
                                    date: new Date(),
                                    id: generateNewId(),
                                    records: []
                                }
                                collectionsCopy.unshift(newCollectionArr); //pushes this data into the collections array

                                if(foldersCopy){ //makes sure "foldersCopy" array is not undefined
                                    this.$store.dispatch("updateDatabase", {type:"folders", newData: foldersCopy}); //updates date on the server
                                }
                              
                                this.closeCreateDialog(); //closes dialog and resets input fields
                                this.errorMSG = "";
                            }else{
                                this.errorMSG = "The desciption has to be less than 100 characters";
                            }
                                
                        }else{
                            this.errorMSG = "The title should be between 1 and 20 characters.";
                        }
                    
                    }
                },
                viewRecords(index, id){
                    let checkIndex = this.$store.state.receivedData.folders[this.$store.state.currFolderInfo.index].collections.findIndex(el => el.id === id);
                   
                    if(checkIndex === index){
                        this.$store.dispatch("changeCurrCollectionInfo", {id , index}); //forwards the collection info to the main state to be used later
                        this.$router.push("/records"); //redirects user to the records page
                    }
                    
                },
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
                    this.viewRecords(index, id);
                }
            },
            onEnd(){
                let foldersCopy = JSON.parse(JSON.stringify(this.$store.state.receivedData.folders)); 
                this.$store.dispatch("updateDatabase", {type:"folders", newData: foldersCopy}); 
                
            },
            changeNav(direction){
                this.$router.go(direction);
            },
            closeEditDialog(){
                this.editDialog = false;
                this.errorMSG = "";
                this.collectionDate = "";
                this.updatedTitle = "";
                this.updatedDescription = "";
                this.clickedOnCollectionIndex = "";
            },
            deleteCollection(){ 
                let foldersCopy = JSON.parse(JSON.stringify(this.$store.state.receivedData.folders));
               
                 if(foldersCopy && confirm(`Are you sure you want to delete ${foldersCopy[this.$store.state.currFolderInfo.index].collections[this.clickedOnCollectionIndex].collectionTitle}?`)){
                    foldersCopy[this.$store.state.currFolderInfo.index].collections.splice(this.clickedOnCollectionIndex,1);
                   this.$store.dispatch("updateDatabase", {type:"folders", newData: foldersCopy});
                   this.closeEditDialog();
                }
            },
            editCollection(index){
                this.editDialog = true;
                this.clickedOnCollectionIndex = index;
                if(index || index ===  0){
                        let collectionArr = this.$store.state.receivedData.folders[this.$store.state.currFolderInfo.index].collections[index];
                        this.updatedTitle = collectionArr.collectionTitle;
                        this.updatedDescription = collectionArr.description;
                        this.collectionDate = collectionArr.date;
                }
            },
            confirmChanges(){
                let foldersCopy = JSON.parse(JSON.stringify(this.$store.state.receivedData.folders));
                foldersCopy[this.$store.state.currFolderInfo.index].collections[this.clickedOnCollectionIndex].collectionTitle = this.updatedTitle ? this.updatedTitle : "Collection Title";
                foldersCopy[this.$store.state.currFolderInfo.index].collections[this.clickedOnCollectionIndex].description = this.updatedDescription ? this.updatedDescription : "No description has been provided.";
                if(foldersCopy){
                   this.$store.dispatch("updateDatabase", {type:"folders", newData: foldersCopy});
                   this.closeEditDialog();
                }
            }
            
               
        }
    }
</script>

<style scoped>
    .collections--container{
        background-color: var(--light-gray);
    }
    .collections--menu{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap:25px;
        list-style: none;
        padding:20px 0;
        margin:0;
        user-select: none;
    }
    .individual--collection, .create--new--collection, .empty--folder{
        border-radius:10px;
        border: var(--main-border);
        /* max-width:200px; */
        box-shadow: 2px 5px 10px rgba(0,0,0,0.07);
        overflow: hidden auto;
        width:100%;
        cursor:pointer;
        background-color: #fff;
    }
    .sortable{
        cursor:move;
    }
    .collection__ico{
        font-size:70px !important;
        color: #fff !important;
    }
    .collection--upper{
        position: relative;
        height:150px;
        align-items:center;
        justify-content:center;
        text-align:center;
        border-top-right-radius:10px;
        border-top-left-radius:10px;
        background-color:rgb(173, 172, 172);
        padding:9px;
        border-bottom:1px solid rgb(196, 194, 194);
    }
    .individual--collection:hover, .create--new--collection:hover{
        transform: scale(1.01);
    }
    .empty--folder{
        justify-content:center;
        align-items:center;
        text-align:center;
    }
    .empty--folder h4{
        font-size:14px;
        font-weight: 600;
    }
    .collection--body{
        position: relative;
        padding:16px;
        min-height:120px;
        max-height: 200px;
        text-overflow:ellipsis;
        overflow:hidden;
    }
    .collection--body p{
        color:#222;
        font-size:15px;
        font-weight:500;
    }
    .collection--bottom--cloud{
        position:absolute;
        bottom:10px;
        left:0;
        background:linear-gradient(rgba(255, 255, 255, 0) 1%,rgba(247, 247, 247, 0.9)100%);
        height:14px;
        width:100%;
        border-radius: 0 0 10px 10px;
    }
    .collection--title{
        text-transform: capitalize;
        text-align:center;
        font-size:14px;
        font-weight:600;
        margin-bottom:6px;
    }
    .collection--footer{
        padding:0 16px 10px 16px;
        justify-content:space-between;
        align-items:center;
        flex-wrap: wrap;
    }
    .create--new--collection:active .new__coll__ico{
        transform: rotate(360deg);
    }
    .collection__date{
        white-space: nowrap;
        font-size:13px;
        font-weight:600px;
        color:gray;
        margin:0;
        flex:0;
    }
    #collections .collection__btn{
        font-size:11px !important;
        padding:2px 3px !important;
        margin:0 8px 7px 0 !important;
        
    }
    .collection--footer--btns{
        white-space:nowrap;
        flex-wrap: nowrap;
        flex:1;
    }
    .create--new--collection{
        padding:17px;
        align-items: center;
        justify-content: center;
    }
    .new--folder--el{
        color: var(--primary-clr);
        align-items:center;
        justify-content: center;
        text-align:center;
        width:170px;
        height:170px;
        border-radius:7px;
        margin:0;
        padding:0;
        cursor:pointer;
        background-color:#fff;
    }
    .new--folder--el h5{
        font-size:15px;
        font-weight: 600;
        margin:8px 0 0;
        text-transform: capitalize;
    }
    .coll__btn{
        margin-right:2px;
        font-size:14px !important;   
    }
    .collection__btn:active{
        outline: none ;
    }
    .del--btn--div{
        justify-content:center;
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
    .collection--draggable--area{
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
        background-color: rgba(255,255,255,0.4);
        width:100%;
        height:100%;
        justify-content:center;
        align-items: center;
        text-align:center;
    }
    .inner__handle{
        margin:0 auto;
    }
</style>