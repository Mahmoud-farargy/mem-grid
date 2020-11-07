<template>
    <div class="flex-column con--alignment">
        <p class="display__type">{{type}}</p>
        <input type="checkbox" @change="changeState" v-model="state" >
    </div>
</template>
<script>
export default {
    data: function(){
        return{
            state: true
        }
    },
    props:{
        handleConditionalDisplay : Function,
        type: String
    },
    methods:{
        changeState(){
            this.handleConditionalDisplay(this.type, this.state);
        }
    }
    
}
</script>
<style scoped>
    .con--alignment{
        padding: 7px 5px;
        align-items:center;
        margin-right:1rem;
    }
</style>