<template>
    <div id="map" ref="map"></div>
    <div id="search-bar">
        <label for="typeaddress"> Type address: </label>
        <input type="text" id="address" v-model="address">
        <button @click="searchAddress(myMap)">Go</button>
        <p v-if="address">{{ address }}</p>   
    </div>
</template>
<script>
export default {
    data() {
        return {
            address: '420 Monte Vista Avenue, Mill Valley 94941',
            map:{}
        }
    },

    async mounted() {
        await this.loadMap();            
        this.addClick ();
    },

    methods: {
        
        async loadMap() {
            this.$store.commit('storeMapRef', this.$refs.map);
            await this.$store.dispatch('loadMap');
            this.map = this.$store.getters.getMap
        },
        
        addClick () {
            this.map.addListener("click", (event) => {         
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: event.latLng }, (results, status) => {
                    this.$store.dispatch('addPlaceId', {placeId: results[0].place_id});
                });
            });
        },
        
        searchAddress() {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address:this.address }, (results, status) => {
                this.$store.dispatch('addPlaceId', {placeId: results[0].place_id});
            });
        },
        
    },
    computed: {
        getMap() {
            //this.map = ;
        },
    },
}
</script>

<style lang="scss">
    #map {
        width: 100%;
        height: 600px;
        background-color: $colorD;

        .address-marker {
            width: 150px;
            background-color: $colorD;
            border-radius: 8px;
            border:2px solid $colorA;
            color: $colorA;
            font-size: 14px;
            padding: 3px 5px;
            position: relative;
            white-space:normal;
            &::after {
                content: "";
                position: absolute;
                left: 50%;
                top: 100%;
                transform: translate(-50%, 0);
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid $colorA;
            }

        }
        [class$=api-load-alpha-banner] {
            display: none;
        }

    }
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
