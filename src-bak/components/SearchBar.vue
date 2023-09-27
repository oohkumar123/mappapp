<template>
    <div id="search-bar">
        <label for="typeaddress"> Type address: </label>
        <input type="text" id="address" v-model="address">
        <button @click="searchAddress">Go</button>
        <p v-if="address">{{ address }}</p>   
    </div>

</template>
<script>
export default {
    data() {
        return {
            address: '420 Monte Vista Avenue, Mill Valley 94941'
        }
    },
    mounted() {
    },
    methods: {
        async searchAddress() {
            let payload = await this.MapApi.searchForAddress(this.address);
            this.$store.dispatch('addPlaceId', payload);
        },
    }
}
</script>
<style lang="scss">
#search-bar {
    background-color: green;
    width: 100%;
    padding: 10px 0;
    label {
        color:white;
    }
    input {
        width:400px;
        height: 30px;
        border: 0;
        border-radius: 2px;

    }
    button {
        width:30px;
        height:30px;
        border: 0;
        border-radius: 2px;
        margin-left:2px;
    }
    p {color:white}
}

</style>