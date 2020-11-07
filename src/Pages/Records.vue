<template>
    <section v-if="mainData && $store.state.currFolderInfo && $store.state.currCollectionInfo">
        <div class="records--container">
            <pdfexport ref="gridPdfExport">
            <div class="sticky--nav flex-row">
                <div class="nav--directions flex-row">
                    <v-icon class="nav__directions__ico" @click="changeNav(-1)">mdi-arrow-left-drop-circle</v-icon>
                    <v-icon class="nav__directions__ico" @click="changeNav(1)">mdi-arrow-right-drop-circle</v-icon>
                </div>
                <div class="coll--title">
                    <h4 class="coll__title">{{$store.state.receivedData.folders[$store.state.currFolderInfo.index].collections[$store.state.currCollectionInfo.index].collectionTitle}}</h4>
                </div>
            </div>
                <div class="conditional--box flex-row">
                    <conditional-display :handleConditionalDisplay="handleConditionalDisplay" type="userName" ></conditional-display>
                    <conditional-display :handleConditionalDisplay="handleConditionalDisplay" type="email" ></conditional-display>
                    <conditional-display :handleConditionalDisplay="handleConditionalDisplay" type="salary"></conditional-display>
                    <conditional-display :handleConditionalDisplay="handleConditionalDisplay" type="mobile"></conditional-display>
                    <conditional-display :handleConditionalDisplay="handleConditionalDisplay" type="address"></conditional-display>
                    <conditional-display :handleConditionalDisplay="handleConditionalDisplay" type="birthDate"></conditional-display>
                    <conditional-display :handleConditionalDisplay="handleConditionalDisplay" type="rating"></conditional-display>
                    <conditional-display :handleConditionalDisplay="handleConditionalDisplay" type="ID" ></conditional-display>
                    <div class="filter--range flex-column">
                            <div>
                                <p class="flex-row display__type">Filter Salaries: <span>{{(choosenSalaryRange).toLocaleString()}}</span></p>
                                 <input type="range" min="0" :max="maxSalary" @input="filterBySalary" v-model="choosenSalaryRange" />
                            </div>
                    </div>
                </div>
                <Grid ref="grid"
                        :style="{height: '700px'}"
                        :data-items="gridData"
                        :edit-field="'inEdit'"
                        :sortable="sortable"
                        :groupable="groupable"
                        :filterable="filterable"
                        :take="take"
                        :sort="sort"
                        :filter="filter"
                        :group="group" 
                        :skip="skip"
                        :pageable="true"
                        :reorderable="reorderable"
                        :total="total"
                        @itemchange="itemChange"
                        :columns="columns"
                        @datastatechange="dataStateChange"
                        :expand-field="'expanded'"
                        @expandchange="expandChange"
                        @pageChange="pageChangeHandler"
                        @columnreorder="columnReorder"
                        >
                        <template v-slot:myTemplate="{props}">
                            <custom :data-item="props.dataItem" 
                                    @edit="edit"
                                    @save="save" 
                                    @remove="remove"
                                    @cancel="cancel"/>
                        </template>
                        <template v-slot:raringStars="{props}">
                                <custom2
                                :currRate="Number(props.dataItem.rating)"
                                />
                        </template>
                        <grid-toolbar class="toolbar--box flex-row">
                            <button title="Add new"
                                    class="k-button k-primary mb-2"
                                    @click='insert' >
                                Add new
                            </button>

                            <button
                                title="Export to Excel"
                                class="k-button k-primary mb-2"
                                @click="exportExcel"
                            >
                                Export to XLSX
                            </button>&nbsp;
                            <button class="k-button k-primary mb-2"
                                @click="exportPDF">
                                Export to PDF
                            </button>
                            <download-csv class="k-button k-primary  mb-2"
                                :data = gridData 
                                name="proCrew.csv"
                                    >
                                Export to CSV
                            </download-csv>
                            <button v-if="hasItemsInEdit"
                                    title="Cancel current changes"
                                    class="k-button"
                                    @click="cancelChanges">
                                    Cancel current changes
                            </button>
                        </grid-toolbar>
                        
                        <grid-norecords>
                            There is no data available custom
                        </grid-norecords>
                    </Grid>
            </pdfexport>
        </div>
    </section>
</template>
<script>
import { Grid, GridToolbar, GridNoRecords } from '@progress/kendo-vue-grid';
import { process } from '@progress/kendo-data-query';
import "@progress/kendo-theme-default/dist/all.css";
import CommandCell from '../Components/CommandCell.vue';
// import {IntlService} from "@progress/kendo-vue-intl";
import {saveExcel} from "@progress/kendo-vue-excel-export";
import {GridPdfExport} from "@progress/kendo-vue-pdf";
import custom2 from "../Components/Stars.vue";
import ConditionalDisplay from "../Components/ConditionalDisplay/ConditionalDisplay.vue";
// import mainData from "../Assets/orders.json";
import JsonCSV from "vue-json-csv";



export default {
    components: {
        'Grid': Grid,
        'grid-toolbar': GridToolbar,
        'grid-norecords': GridNoRecords,
        'pdfexport': GridPdfExport,
        'custom': CommandCell,
        "custom2": custom2,
        "downloadCsv": JsonCSV,
        "conditional-display": ConditionalDisplay
    },
    data: function () {
        return {
            mainData: [],
            filter: null,
            sortable:{
              allowUnsort: true,
              mode: "multiple"
            },
            filterable: true,
            groupable: true,
            reorderable: true,
            sort: [
                { field: 'userName', dir: 'asce' }
            ],
            gridData: [],
            skip: 0,
            take: 10,
            total: 0,
            updatedData: [],
            group:[],
            editID: null,
            columns: [
                { field: "userName", filterable: "string", width: "200px", title: "UserName"},
                { field: "email",filterable: "string", width: "200px",title: "E-mail"},
                { field: "salary", filterable: "numeric", editor:"numeric", width: "140px", title:"Salary"},
                { field: "mobile", filterable: "numeric", width: "160px", title: "Mobile"},
                { field: "address", filterable: "string", width: "200px", title:"Address"},
                { field: "birthDate", filterable:"string", width: "200px", editor:"string", title:"Birth Date"},
                { field: "rating", cell: "raringStars" , filterable: "numeric", editor:"numeric", width:"150px",title: "Rating", name:"rating"},
                { field: "ID",filterable: "numeric", width: "140px", title:"ID", name:"ID"},
                { cell: "myTemplate", filterable: false, sortable: false , width: '210px', title: "Actions"}
                
            ],
            choosenSalaryRange: 0,
        };
    },
    computed: {
        hasItemsInEdit() {
            return this.gridData.filter(p => p.inEdit).length > 0;
        },
        maxSalary:{
            get(){
                let records = this.$store.state.receivedData.folders[this.$store.state.currFolderInfo.index].collections[this.$store.state.currCollectionInfo.index].records;
                let allSalaries = records.map(el => el.salary); 
                return Math.max(...allSalaries);
            },
            set(val){
                this.maxSalary = val;
            }
            
        }
    },
    created: function() {
        
        // var DATE_FORMAT = 'yyyy-mm-dd hh:mm:ss.SSS';
        // var intl = new IntlService();
        let records = this.$store.state.receivedData.folders[this.$store.state.currFolderInfo.index].collections[this.$store.state.currCollectionInfo.index].records;
        this.mainData = records;
    //     let allSalaries = records.map(el => el.salary); 
    //    let maxS = Math.max(...allSalaries);
       this.choosenSalaryRange = this.maxSalary;

        // const mainData = this.$store.state.receivedData.folders[this.$store.state.currFolderInfo.index].collections[this.$store.state.currCollectionInfo.index];
        this.unsubscribe = this.$store.subscribe((mutations, state)=>{  //subscribes to any changes that may happen to the main store
            
            if(mutations.type === "updateReceivedData" || mutations.type === "changeCurrCollectionInfo"){ //edit this
                if(state.receivedData.folders[state.currFolderInfo.index].collections){
                   
                    let newData =  state.receivedData.folders[state.currFolderInfo.index].collections[state.currCollectionInfo.index].records;
                    newData.forEach(o => {
                        o.salary = Number(o.salary);
                        o.mobile = Number(o.mobile);
                        // o.birthDate = o.birthDate === 'NULL' ? undefined : intl.parseDate(o.birthDate, DATE_FORMAT);
                    });
                    this.mainData = newData;
                    this.updatedData =  newData;
                    this.gridData =  newData;
                }
              
            }
        })
        this.mainData.forEach(o => {
            o.salary = Number(o.salary);
            o.mobile = Number(o.mobile);
            // o.birthDate = o.birthDate === 'NULL' ? undefined : intl.parseDate(o.birthDate, DATE_FORMAT);
        });
        this.updatedData = this.mainData;
        this.getData();
    },
    beforeDestroy(){
        this.unsubscribe(); //detaches the subscription before the component gets destroyed
    },
    methods: {
        itemChange: function (e) {
            if (e.dataItem.ID) {
              let index = this.gridData.findIndex(p => p.ID === e.dataItem.ID);
              let updated = Object.assign({},this.gridData[index], {[e.field]:e.value});
              
              this.gridData.splice(index, 1, updated);
            } else {
              e.dataItem[e.field] = e.value;
            }
        },
        insert() {
            const dataItem = { inEdit: true };
            
            this.gridData.splice(0, 0, dataItem)
        },
        edit: function (e) {
            let index = this.gridData.findIndex(p => p.ID === e.dataItem.ID);
            let updated = Object.assign({},this.gridData[index], {inEdit:true});
            this.gridData.splice(index, 1, updated);
        },
        save: function(e) {
            let index = this.gridData.findIndex(p => p.ID === e.dataItem.ID);
            let item = this.gridData[index];
            let updated = Object.assign(this.update(this.gridData.slice(), item), {inEdit:undefined});
            this.gridData.splice(index, 1, updated);
            let updateDataIndex = this.updatedData.findIndex(p => p.ID === e.dataItem.ID);
        
            this.updatedData.splice(updateDataIndex, 1, updated);
        },
        update(data, item, remove) {
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
            let updated;
            
            let index = data.findIndex(p => item.ID && p.ID === item.ID);
            let foldersCopy = JSON.parse(JSON.stringify(this.$store.state.receivedData.folders));
            let mainIndex = this.mainData.findIndex(el => item.ID && el.ID == item.ID);
            //mirror changes to the server's data
            if(mainIndex >= 0 && !remove){ //update
                updated = Object.assign({}, item, {inEdit: false }); 
                foldersCopy[this.$store.state.currFolderInfo.index].collections[this.$store.state.currCollectionInfo.index].records[mainIndex] = updated;
               
                this.$store.dispatch("updateDatabase", {type:"folders", newData: foldersCopy}); 
            }else{ //add new
                updated = Object.assign({}, item, {rating: 1 ,ID: generateNewId(), inEdit: false});
                if(!remove){
                    foldersCopy[this.$store.state.currFolderInfo.index].collections[this.$store.state.currCollectionInfo.index].records.unshift(updated);
                    this.$store.dispatch("updateDatabase", {type:"folders", newData: foldersCopy});
                }
                
                
            }   


            // if (index >= 0) {
            //     updated = Object.assign({}, item);
            //     console.log("update", updated, mainIndex);
            //     data[index] = updated;
           
            if(index < 0){  
                let id = 1;
                this.updatedData.forEach(p => { if (p.ID) { id = Math.max(p.ID + 1, id); } });
                updated = Object.assign({}, item,  {rating: 1 ,ID: generateNewId(), inEdit: false});
                
                data.unshift(updated);
                index = 0;
            }
            
            if (remove) { //remove
                // data = data.splice(index, 1);
                // if(confirm(`Delete ${foldersCopy[this.$store.state.currFolderInfo.index].collections[this.$store.state.currCollectionInfo.index].records[mainIndex].userName}?`)){
                    foldersCopy[this.$store.state.currFolderInfo.index].collections[this.$store.state.currCollectionInfo.index].records.splice(mainIndex,1);
                   
                    this.$store.dispatch("updateDatabase", {type:"folders", newData: foldersCopy});
                // }
                
            }

            return data[index];
        },
        cancel(e) {
            if (e.dataItem.ID) {
                let index = this.gridData.findIndex(p => p.ID === e.dataItem.ID);
                let updateDataIndex = this.updatedData.findIndex(p => p.ID === e.dataItem.ID);
                let updated = Object.assign(this.updatedData[updateDataIndex], {'inEdit': undefined});
                this.gridData.splice(index, 1, updated);
            } else {
              let index = this.gridData.findIndex(p => JSON.stringify(e.dataItem) === JSON.stringify(p));
               
              this.gridData.splice(index, 1);
            }
        },
        remove(e) {
            e.dataItem.inEdit = undefined;
            this.update(this.gridData, e.dataItem, true);
            this.update(this.updatedData, e.dataItem, true);
            this.gridData = this.gridData.slice();
        },
        cancelChanges () {
             let editedItems = this.updatedData.filter(p => p.inEdit === true);
             if(editedItems.length){
                editedItems.forEach(
                    item => {
                       item.inEdit = undefined;
                     });
             }
            this.getData();
        },
         getData: function () {
            this.gridData = process( 
              this.updatedData,
             {
               take: this.take,
               skip: this.skip, 
               sort: this.sort, 
               filter: this.filter
            }).data;

           this.total = process( 
              this.updatedData,
             {
               filter: this.filter
            }).total;
        },
        createAppState: function(dataState) {
            this.take = dataState.take;
            this.skip = dataState.skip;
            if (dataState.group) {
                dataState.group.map(group => group.aggregates = this.aggregates);
            }
            this.filter = dataState.filter;
            this.group = dataState.group;
            this.sort = dataState.sort;
            this.getData();
        },
        dataStateChange (event) {
            this.createAppState(event.data);
            this.dataResult = process(this.mainData, {
                skip: this.skip,
                take: this.take,
                sort: this.sort,
                filter: this.filter,
                group: this.group
            });
        },
        expandChange (event) {
             const isExpanded = event.dataItem.expanded === undefined ?
                    event.dataItem.aggregates : event.dataItem.expanded;
            event.dataItem.expanded =  !isExpanded;
        },
        exportExcel () {
            saveExcel({
                data: this.gridData ? this.gridData: this.mainData,
                fileName: "prowCrew_excel.xlsx",
                columns: this.columns
            });
        },
        exportPDF () {
            const tempSort = this.sort; 
            this.sort = null;
            this.$nextTick(()=>{
               (this.$refs.gridPdfExport).save(process(this.gridData ? this.gridData: this.mainData,
                { skip: this.skip, take: this.take }));
                this.sort = tempSort;
            })
        },
        pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
        columnReorder: function(options) {
            this.columns = options.columns;
        },
        handleConditionalDisplay(element, boolean){
            const index = this.columns.findIndex(item => item.field === element);
            let columnsCopy = JSON.parse(JSON.stringify(this.columns));
            columnsCopy[index].hidden = !boolean;
            this.columns = columnsCopy;
        },
        changeNav: function(direction){
            this.$router.go(direction);
        },
        filterBySalary(){
            this.gridData = this.mainData.filter(item => item.salary <= this.choosenSalaryRange);
        }
    }
};

</script>
<style scoped>
    .conditional--box{
        flex-wrap: wrap;
        align-items:center;
        width:100%;
        background-color: var(--light-gray);
        border: 1px solid #f3f3f3;
        padding-left:4px;
    }
    .records--container{
        padding: 50px 0;
    }
    /* .filter--range {
        width:10px;
    } */
    .filter--range p{
        margin:0;
        padding:0;
    }
    .toolbar--box{
        flex-wrap: wrap;
    }
    @media only screen and (max-width:670px){
        .conditional--box{
            flex-direction: column;
        }
    }
</style>