<template>
    <div v-if="this.currRate && this.currRate <=5" class="star__icon flex-row">
        {{Array(this.currRate).fill().map(() => "🌟").join("")}}
        
    </div>
   
</template>
<script>
    export default {
        props:{
            currRate: Number
        }
    }

</script>
<style scoped>
    .star__icon{
        align-items:center;
        color:rgb(248, 173, 10);
    }
</style>