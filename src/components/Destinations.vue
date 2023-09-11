<template>
    <div id="destinations">
        <h2 draggable="true">Destinations List </h2>
        <div class="destinations-list sortable-list" ref="sortableList">
            <article class="item" :data-placeId="item.placeId" draggable="true" ref="item" v-for="(item, index) in listDestinations ()" :key="index">
                <div class="stats" v-if="item.stats">
                    Distance: {{ item.stats.distanceText }}
                    <br>
                    Duration: {{ item.stats.durationText }}
                </div>
                <div class="details">
                    <div
                        class="order"
                        style="background-color: blueviolet">
                        <h3>{{ index+1 }}</h3>
                    </div>
                    <div class="address">
                        <p class="street">
                            <!-- {{ item.placeId }}  
                            <br>-->
                            {{ item.address }} 
                            <br>
                            {{ item.latlng }} 
                        </p>
                        <p class="latlon">
                        </p>
                    </div>
                    <div class="updown" style="background-color: greenyellow">
                        <div class="up">&uarr;</div>
                        <div class="delete">&#10026;</div>
                        <div class="down">&darr;</div>
                    </div>
                </div>
            </article>
        </div>
    </div>
    <JourneyTotals :totalTime="totalTime" :totalDistance="totalDistance" :fuelCost="fuelCost"></JourneyTotals>
</template>
<script>
import JourneyTotals from './JourneyTotals.vue';

export default {
    components: {
        JourneyTotals
    },
    data() {
        return {
            addressListLocal: {},
            totalTime:"",
            totalDistance:"",
            fuelCost:"",
            count: 0
        };
    },
    updated () {
        
    },
    mounted() {},
    methods: {
        listDestinations () {
            this.calculateTotals (this.$store.getters.addressesList);
            
            return this.$store.getters.addressesList;
        },

        calculateTotals (destinations) {
            console.clear();
            let totalSeconds = 0;
            let totalMeters = 0;
            destinations.forEach (item => {
                if (item?.stats) {
                    totalSeconds += item.stats.durationSeconds;
                    totalMeters += item.stats.distanceMeters;
                }
            })
            
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            
            if (hours) {
                this.totalTime = hours + " hours " + minutes + " minutes";
            } else {
                this.totalTime = minutes + " minutes";
            }
            
            const miles = totalMeters / 1609.34;
            this.totalDistance = miles.toFixed(1) + " miles";

            let gallonsUsed = (miles/21);
            let cost = 5.5 * gallonsUsed;
            this.fuelCost = "$"+cost.toFixed(2) + " at $5.5 per gallon";

        }
    },
    computed: {}
};
</script>

<style lang="scss">
    #destinations {
        background-color: blue;
        width: 650px;
        margin: auto;
        text-align: center;
        margin-top:20px;
        
        h2 {
            color: white;
            height: auto;
            padding: 0;
            margin: 0;
        }
        
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

                    .updown {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        align-items: center;
                        width:20px;
                        color: white;
                        
                        .up, .down, .delete {
                            width:100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        
                        .up {
                            background-color: purple;
                        }
                        .delete {
                            background-color: #ffffff;
                            color: red;
                            padding-top: 1px;
                        }
                        
                        .down {
                            background-color: orangered;
                        }
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
                        align-items: center;
                        flex-direction: column;
                        p {
                            margin: 0;
                            &.latlon {
                                font-size: 15px;
                            }
                        }
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
                    width: 300px;
                    font-size: 16px;

                    p {margin:0; padding:0}
                }
            }
        }
    }
</style>
