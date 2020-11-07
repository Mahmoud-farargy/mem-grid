import Vue from "vue";
import Vuex from "vuex";
import {db} from "../Config/firebase";
//use package
Vue.use(Vuex);

//Main App State
export const store = new Vuex.Store({
    state:{
        receivedData: [],
        isLoggedIn: false,
        isLoading: false,
        uid: "",
        currFolderInfo: {},
        currCollectionInfo: {}
    },
    getters:{
        receivedData: state =>{
            return state.receivedData;
        },
        isLoggedIn: state =>{
            return state.isLoggedIn;
        },
        uid: state=>{
            return state.uid;
        },
        currFolderInfo: state =>{
            return state.currFolderInfo;
        },
        currCollectionInfo: state =>{
            return state.currCollectionInfo;
        }
    },
    mutations: {
        updateReceivedData: (state, payload) =>{
            if(payload){
              state.receivedData = payload;  
            }
            
        },
        updateUid: (state, payload)=>{
            state.uid = payload;
        },
        updateDatabase: (state, payload)=>{
            const {type, newData} = payload;
            if(newData && state.uid){
                db.collection("users").doc(state.uid).update({
                    [type]: newData
                }).then(res =>{
                    console.log("saved", res);
                }).catch(err =>{
                    alert(err.message);
                }); 
            }else{
                alert("Please login first");
            }
        },
        changeUserState: (state, payload)=>{
            state.isLoggedIn = payload;
        },
        changeCurrFolderInfo: (state, payload)=>{
            let {id, index} = payload;
            state.currFolderInfo = {id, index};
        },
        changeCurrCollectionInfo: (state, payload)=>{
            let {id, index} = payload;
            state.currCollectionInfo = {id, index};
        }
    },
    actions: {
        updateReceivedData :({commit}, payload)=>{
            commit("updateReceivedData", payload);
        },
        updateUid: ({commit}, payload)=>{
            commit("updateUid", payload);
        },
        updateDatabase: ({commit}, payload)=>{
            commit("updateDatabase", payload);
        },
        changeUserState: ({commit}, payload)=>{
            commit("changeUserState", payload);
        },
        changeCurrFolderInfo: ({commit}, payload)=>{
            commit("changeCurrFolderInfo", payload);
        },
        changeCurrCollectionInfo: ({commit}, payload)=>{
            commit("changeCurrCollectionInfo", payload);
        }
    } 
})