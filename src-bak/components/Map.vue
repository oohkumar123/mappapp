<template>
    <div id="map" ref="map"></div>
    <div id="search-bar">
        <span @click="clearAll">clear all</span> 
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
            mapp:{},
            markers:[],
            lines:[]
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
            this.mapp = this.$store.getters.getMap
            console.info('%cthis.mapp: %o', 'color: red;font-size:12px', this.mapp);
        },
        
        addClick () {
            this.mapp.addListener("click", (event) => {         
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: event.latLng }, (results, status) => {
                    this.$store.dispatch('addPlaceId', {placeId: results[0].place_id});
                    this.addMarker (event.latLng, results[0].formatted_address);
                    this.addLines();
                });
            });
        },
        
        searchAddress() {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address:this.address }, (results, status) => {
                this.$store.dispatch('addPlaceId', {placeId: results[0].place_id});
                this.addMarker (results[0].geometry.location, results[0].formatted_address);
                this.addLines();
            });
        },

        addMarker (myLatlng, formatted_address) {
            var marker = new google.maps.Marker({ position:myLatlng, label:{text:formatted_address, className:'address-marker', map: this.mapp}});
            marker.setMap(this.mapp);
            this.markers.push(()=>marker.setMap(null));
        },
        
        async addLines () {
            let addresses = this.$store.getters.addressesList;
            let lineColors = ['red','green','blue','yellow','orange','pink']

            setTimeout(async ()=>{ 
                for (let i = 0; i < addresses.length; i++) {
                    if (addresses[i].stats){
                        let origin = addresses[i].stats.origin;
                        let destination = addresses[i].stats.destination;
                        
                        const service = new google.maps.DistanceMatrixService();
                        await service.getDistanceMatrix({
                            origins: [origin],
                            destinations: [destination],
                            travelMode: 'DRIVING',
                            unitSystem: google.maps.UnitSystem.IMPERIAL,
                        });
                        let directionsService = new google.maps.DirectionsService();
                        let directionsRenderer = new google.maps.DirectionsRenderer({
                            map: this.mapp,
                            polylineOptions: {
                                strokeColor: lineColors[i-1],
                                strokeWeight: 5,
                                strokeOpacity: 0.7
                            }
                        });
                        let request = {origin,destination,travelMode: 'DRIVING'};
                        directionsService.route(request, (result, status) => {
                            if (status == 'OK') {
                                directionsRenderer.setDirections(result);
                                this.lines.push(()=>{
                                    directionsRenderer.setMap(null);
                                    directionsRenderer = null;
                                })
                            }
                        }) 
                    }
                }
            }, 1000);
        },
        
        clearAll () {
            this.markers.forEach((m)=>m());
            this.lines.forEach((l)=>l());
            this.$store.dispatch('deleteAll');
        }
        
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
