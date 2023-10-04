<template>
    <div id="map" ref="map"></div>
    <SearchBar @sendAddress="searchAddress"></SearchBar>

</template>
<script>
import { Loader } from "@googlemaps/js-api-loader";
import SearchBar from './SearchBar.vue';

export default {
    components: {
        SearchBar
    },
    data() {
        return {
            address: '420 Monte Vista Avenue, Mill Valley 94941',
            mapp:{},
            markers:{},
            lines:[],
            apiKey: "AIzaSyDlLrLnR2kTGVYhjtbu9ylIUm7eVTin2bk",
            count: 1
            
        }
    },
    async mounted() {
        this.loadMap();            
    },
    watch: {
        move (newCount, oldCount) {
            const keys = Object.keys(this.lines);
            keys.forEach(((k)=>{
                this.lines[k].delete();
            }));
            this.addLinesList();
        },
        deleteAll (newCount, oldCount) {
            const keys = Object.keys(this.lines);
            keys.forEach(((k)=>{
                this.lines[k].delete();
            }));
            this.lines = [];

            const keysMark = Object.keys(this.markers);
            keysMark.forEach(((m)=>{
                this.markers[m].delete();
            }));
            this.markers = [];
        },
        deleteOne (newCount, oldCount) {
            try {
                let keys = Object.keys(this.lines);
                keys.forEach(((k)=>{
                    this.lines[k].delete();
                }));
                this.lines = [];

                let keysMark = Object.keys(this.markers);
                keysMark.forEach(((m)=>{
                    this.markers[m].delete();
                }));
                this.markers = [];
                this.addLinesList();
                this.addMarkersList();
            } 
            catch (error) {
                console.error(error);
            }
        }
    },
    computed: {
        move () {
            return this.$store.getters.getMove;
        },
        deleteAll() {
            return this.$store.getters.getDeleteAll;
        },
        deleteOne() {
            return this.$store.getters.getDeleteOne;
        }
    },
    methods: {
        async loadMap() {
            const loader = new Loader({apiKey: this.apiKey, version: "weekly"});      
            const {Map} = await loader.importLibrary('maps');
            this.map = new Map(this.$refs.map, {
                center: { lat: 37.9107347, lng: -122.5640172 },
                zoom: 14,
                mapId: "4504f8b37365c3d0",
            });
        
            this.map.addListener("click", async (event) => {  
                const geocoder = new window.google.maps.Geocoder()       
                const response = await geocoder.geocode({ location: event.latLng });
                this.addPlace(response);
            });
        },
        async searchAddress(address) {
            const geocoder = new window.google.maps.Geocoder()       
            const response = await geocoder.geocode({ address });
            this.addPlace(response);
        },       
        addPlace (response) {
            const {place_id, geometry:{location:location}, formatted_address} = response.results[0];
            this.$store.commit('addPlace', {
                place_id,
                location,
                formatted_address,
            });
            this.addMarker (place_id, location, formatted_address);
            this.addLine(place_id, location);
        },
        addMarker (place_id, location, formatted_address) {
            const marker = new google.maps.Marker({ position:location, label:{text:formatted_address, className:'address-marker', map: this.map}});
            marker.setMap(this.map);
            this.markers[place_id] = {delete:()=>marker.setMap(null)}
        },
        addMarkersList () {
            const places = this.$store.getters.getPlaces;
            for (let i = 0; i < places.length; i++) {
                this.addMarker (places[i].place_id, places[i].location, places[i].formatted_address) 
            }
        },
        addLine (place_id, destination) {
            const places = this.$store.getters.getPlaces;
            const origin = places.at(-2);
            if (origin) {
                this.createLine (place_id, origin.location, destination) ;
            }
        },
        addLinesList () {
            const places = this.$store.getters.getPlaces;
            for (let i = 1; i < places.length; i++) {
                const origin = places[i-1];
                const destination = places[i];
                this.createLine (places[i].place_id, origin.location, destination.location);
            }
        },
        createLine (place_id, origin, destination) {
            const lineColors = ['red','green','blue','yellow','orange','pink'];
            const colorCount = Object.values(this.lines).length;
            
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({
                map: this.map,
                polylineOptions: {
                    strokeColor: lineColors[colorCount],
                    strokeWeight: 5,
                    strokeOpacity: 0.7
                }
            });
            const request = {origin,destination,travelMode: 'DRIVING'};
            directionsService.route(request, (result, status) => {
                if (status == 'OK') {
                    directionsRenderer.setDirections(result);
                    this.lines[place_id] = {delete:()=>{directionsRenderer.setMap(null);directionsRenderer = null;}}
                }
            }) 
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
