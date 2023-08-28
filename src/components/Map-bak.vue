<template>
    <div id="map"></div>
</template>
<script>
import { Loader } from "@googlemaps/js-api-loader";
import { resolveComponent } from "vue";
import { mapState, mapMutations } from 'vuex';
export default {
    data() {
        return {
            markerList: [],
            map: {}
        };
    },
    beforeCreate() {
        //console.log("beforeCreate has been called");
    },
    created() {},
    beforeMount() {},
    mounted() {
        this.initMap();
    },
    methods: {
        initMap() {

            const loader = new Loader({
                apiKey: "AIzaSyDlLrLnR2kTGVYhjtbu9ylIUm7eVTin2bk",
                version: "weekly"
            });

            loader.importLibrary('maps').then(async ({Map}) => {
                //const { Map } = await google.maps.importLibrary("maps");
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker"); // can this be moved to loader?
                const map = new Map(document.getElementById("map"), {
                center: { lat: 37.4239163, lng: -122.0947209 },
                    zoom: 14,
                    mapId: "4504f8b37365c3d0",
                });
                
                map.addListener("click", async (event) => {
                    
                    let markerAddress = await this.getAddressDetails(event.latLng); 

                    const newMarker = document.createElement("div");
                    newMarker.className = "address-marker";
                    newMarker.textContent = markerAddress;
                    new AdvancedMarkerElement({ map, position: event.latLng, content: newMarker });
                });


            });
        },
        async getAddressDetails(location) {
            // Create a Geocoder object
            const geocoder = new google.maps.Geocoder();
            let addressMarker = '';

            // Get address details from the provided location (latitude and longitude)
            await geocoder.geocode({ location: location }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results.length > 0) {
                        console.info('%cresults: %o', 'color: red;font-size:12px', results);
                        // Extract the address components
                        const addressDetails = results[0].address_components;
                        const placeId = results[0].place_id;
                        console.info('%cplaceId: %o', 'color: blue;font-size:12px', placeId);

                        // Find the address components you want (e.g., street address, city, country)
                        let streetAddress, city, state, zip = '';
                        for (const component of addressDetails) {
                            if (component.types.includes('street_number') || component.types.includes('route')) {
                                streetAddress = component.long_name + ' ';
                            } else if (component.types.includes('locality')) {
                                city = component.long_name;
                            } else if (component.types.includes('administrative_area_level_1')) {
                                state = component.long_name;
                            } else if (component.types.includes('postal_code')) {
                                zip = component.long_name;
                            }
                        }
                        addressMarker = streetAddress.trim() + ', ' + city + ', ' + state + ', ' + zip;
                        this.updateMyArray({
                            address: addressMarker ,
                            location: {lat:location.lat(), lng:location.lng()}
                        })
                        return 2;
                    } else {
                        console.log('No results found for the provided location.');
                    }
                } else {
                    console.log('Geocoder failed due to:', status);
                }
            });
            return addressMarker;
        },
        ...mapMutations(['updateArray']),
        
        updateMyArray(newArray) {
            this.updateArray(newArray);
        },
    },
    computed: {
        ...mapState({
            newLocation: state => state.newLocation
        }),
    },
};
</script>

<style lang="scss">
    #map {
        width: 100%;
        height: 600px;
        background-color: blue;

        .address-marker {
            width: 150px;
            background-color: #4285F4;
            border-radius: 8px;
            color: #FFFFFF;
            font-size: 14px;
            padding: 3px 5px;
            position: relative;
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
                border-top: 8px solid #4285F4;
            }

        }
        [class$=api-load-alpha-banner] {
            display: none;
        }

    }
</style>
