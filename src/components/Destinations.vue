<template>
    <div id="destinations">
        <h2 draggable="true">Destinations List </h2>
        <div class="destinations-list sortable-list" ref="sortableList">
            <article class="item"  :data-placeId="item.placeId" draggable="true" ref="item" v-for="(item, index) in locationsList" :key="index">
                <div class="details">
                    <div
                        class="order"
                        style="background-color: blueviolet">
                        <h3>{{ index+1 }}</h3>
                    </div>
                    <div class="address">
                        <p class="street">
                            {{ item.address }}
                        </p>
                        <p class="latlon">
                        </p>
                    </div>
                </div>
                <!-- <div v-if="index<locationsList.length-1" class="stats"> //change this condiitons dependent on whether stats exist -->
                    <div v-if="true" class="stats"> 
                    <p>Distance between destinations</p>
                    <p>Time to drive at average 60 mph</p>
                    <p>Gas fuel cost</p>
                </div>
            </article>

        </div>
    </div>
</template>
<script>
import { Loader } from "@googlemaps/js-api-loader";
import { resolveComponent } from "vue";
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            //watchLocations:1
        };
    },
    updated () {
        this.initDestinations();
        console.info('%c%o', 'color: red;font-size:12px', 'updated');
        
        // [...this.$refs.sortableList.children].forEach((el)=>{
        //     console.info('%cel.dataset[placeid]: %o', 'color: red;font-size:12px', el.dataset['placeid']);
        //     let stats = el.querySelector('.stats');
        //     console.info('%cstats: %o', 'color: red;font-size:12px', stats);


        // })

    },
    mounted() {
        this.initDestinations();
    },
    methods: {
        initDestinations() {

            let sortableList = this.$refs.sortableList;
            
            if (!sortableList) return;

            this.items = this.$refs.sortableList.querySelectorAll('.item');

            this.items.forEach(item => { // add an event listener to each item where when dragging starts add class 'dragging' and remove when drag ends
                
                item.addEventListener("dragstart", () => {
                    setTimeout(() => item.classList.add("dragging"), 0);
                });
                
                item.addEventListener("dragend", () => {
                    item.classList.remove("dragging");
                    this.reorderDestinationsArray();
                });
            });

            const initSortableList = (e) => {
                e.preventDefault();
                
                const draggingItem = document.querySelector(".dragging");
                let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];
                let nextSibling = siblings.find(sibling => {
                    let clientPos = e.clientY + window.scrollY;
                    let siblingPos = (sibling.offsetTop + (sibling.offsetHeight/2)); 
                    return clientPos <= siblingPos; //if the client has moved above the current sibling
                });
                
                sortableList.insertBefore(draggingItem, nextSibling);
            }
            
            sortableList.addEventListener("dragover", initSortableList); 
            sortableList.addEventListener("dragenter", e => e.preventDefault());            
        },
        reorderDestinationsArray () { 
            console.info('%c%o', 'color: red;font-size:12px', 'Here I am 2');
            let items = this.$refs.sortableList.querySelectorAll('.item');
            console.info('%citems: %o', 'color: red;font-size:12px', items);
            
            const loader = new Loader({
                apiKey: "AIzaSyDlLrLnR2kTGVYhjtbu9ylIUm7eVTin2bk",
                version: "weekly"
            });

            loader.importLibrary('maps').then(async ({Map}) => { // Study this
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker"); // can this be moved to loader?
                const map = new Map(document.getElementById("map"), {
                center: { lat: 37.4239163, lng: -122.0947209 },
                    zoom: 14,
                    mapId: "4504f8b37365c3d0",
                });
                
                // This function calculates the distance between two points
                function calculateDistance() {
                    console.info('%cLocation: %o', 'color: green;font-size:12px', 'calculateDistance');
                    var origin = new google.maps.LatLng(37.7749, -122.4194); // Example origin coordinates (San Francisco, CA)
                    var destination = new google.maps.LatLng(34.0522, -118.2437); // Example destination coordinates (Los Angeles, CA)

                    var service = new google.maps.DistanceMatrixService();

                    service.getDistanceMatrix({
                        origins: [origin],
                        destinations: [destination],
                        travelMode: 'DRIVING', // You can change the travel mode as needed
                        unitSystem: google.maps.UnitSystem.METRIC,
                    }, callback);
                }

                // Callback function to process the distance results
                function callback(response, status) {
                    if (status == 'OK') {
                        var distanceText = response.rows[0].elements[0].distance.text;
                        var durationText = response.rows[0].elements[0].duration.text;
                        
                        var result = `Distance: ${distanceText}<br>Duration: ${durationText}`;
                        console.info('%cnew items: %o', 'color: red;font-size:12px', items);
                        console.info('%cresult: %o', 'color: red;font-size:12px', result);
                        items[0].children[1].innerHTML = result;
                    } else {
                        console.log('Error:', status);
                    }
                }

                // Call the calculateDistance function when the API is loaded
                calculateDistance();

            });

        }
        
    },
    computed: {
        ...mapGetters(['locationsList'])
    }
};
</script>

<style lang="scss">
    #destinations {
        background-color: blue;
        width: 650px;
        margin: auto;
        text-align: center;
        
        h2 {color: white}
        
        .destinations-list {
            width:100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            article.item {
                width:100%;
                .details {
                    background-color: yellow;
                    width: 100%;
                    display: flex;
                    position: relative;

                    &.dragging {
                        opacity: 0.6;
                    }
                    
                    &.dragging :where(.details, i) {
                        opacity: 0;
                    }

                    .order {
                        width: 40px;
                        background-color: green;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        h3 {
                            font-family: Arial, Helvetica, sans-serif;
                            font-size: 25px;
                            color: black;
                        }
                    }
                    .address {
                        flex-grow: 1;
                        background-color: orange;
                        padding-left: 10px;
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 20px;
                        color: black;
                        display: flex;
                        justify-content: center;
                        align-items: flex-start;
                        flex-direction: column;
                        p {
                            margin: 0;
                            &.latlon {
                                font-size: 15px;
                            }
                        }
                    }
                    &:before {
                        content: "d";
                        display: block;
                        width: 20px;
                        height: 20px;
                        background-color: #ddd;
                        position: absolute;
                        left: -10px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: grab;
                    }
                }
                div.stats {
                    background-color: yellow;
                    border-radius: 10px;
                    margin:auto;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 15px;
                    color: black;
                    width:auto;
                    display: inline-flex;
                    height: 79px;
                    width: 300px;
                    flex-direction: column;
                    justify-content: center;
                    height: 79px;

                    p {margin:0; padding:0}
                }
            }
        }
    }
</style>
