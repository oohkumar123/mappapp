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
import { Loader } from "@googlemaps/js-api-loader";

export default {
    data() {
        return {
            address: '420 Monte Vista Avenue, Mill Valley 94941',
            map:{}
        }
    },

    async mounted() {
        await this.loadMap();            
        this.addClick();
    },

    methods: {
        async loadMap() {
            this.loader = new Loader({
                apiKey: "AIzaSyDlLrLnR2kTGVYhjtbu9ylIUm7eVTin2bk",
                version: "weekly"
            });
            let {Map} = await this.loader.importLibrary('maps');
            this.map = new Map(this.$refs.map, {
                center: { lat: 37.9107347, lng: -122.5640172 },
                zoom: 14,
                mapId: "4504f8b37365c3d0",
            });
            this.$store.commit('storeMap', this.map);
        },
        
        addClick () {
            this.map.addListener("click", (event) => {         
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: event.latLng }, (results, status) => {
                    let marker = this.addmarker (event.latLng, results[0].formatted_address);
                    console.info('%cmarker 2: %o', 'color: red;font-size:12px', marker);
                    this.$store.dispatch('addPlaceId', {placeId: results[0].place_id, marker});
                });
            });
        },
        
        searchAddress() {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address:this.address }, (results, status) => {
                let marker = this.addmarker (results[0].geometry.location, results[0].formatted_address);
                this.$store.dispatch('addPlaceId', {placeId: results[0].place_id, marker});
            });
        },
        
        addmarker (myLatlng, formatted_address) {
            var marker = new google.maps.Marker({ position:myLatlng, label:{text:formatted_address, className:'address-marker', map: this.map}});
            console.info('%cmarker 1: %o', 'color: red;font-size:12px', marker);
            marker.setMap(this.map);
            return () => marker.setMap(null);
        }
    }
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
