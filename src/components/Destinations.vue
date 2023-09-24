<template>
    <div id="destinations" v-if="listDestinations ().length">
        <div class="title">
            <div class="space">&nbsp;</div>
            <h2 @click="getMap">Destinations List </h2>
            <div class="clear-all" @click="window.location.reload()">Clear all</div>           
        </div> 
        <div class="destinations-list sortable-list" ref="sortableList">
            <article class="item" :data-placeId="item.placeId" draggable="true" ref="item" v-for="(item, index) in listDestinations ()" :key="index">
                <div class="stats" v-if="item.stats" :style="{ background: item.stats.backgroundColor}">
                    Distance: {{ item.stats.distanceText }}
                    <br>
                    Duration: {{ item.stats.durationText }}
                </div>
                <div class="details">
                    <div class="order"><p>{{ index+1 }}</p></div>
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
                    <div class="updown">
                        <div class="up"     v-if="index > 0" @click="moveUp(index)">&uarr;</div>
                        <div class="delete" @click="deleteLoc(index)">&#10026;</div>
                        <div class="down"   v-if="index != listDestinations ().length-1" @click="moveDown(index)">&darr;</div>
                    </div>
                </div>
            </article>
        </div>
    </div>
    <JourneySummary :totalTime="totalTime" :totalDistance="totalDistance" :fuelCost="fuelCost" v-if="listDestinations ().length>1"></JourneySummary>
</template>
<script>
import JourneySummary from './JourneySummary.vue';
import { mapState } from 'vuex';
export default {
    components: {
        JourneySummary
    },
    data() {
        return {
            totalTime:"",
            totalDistance:"",
            fuelCost:"",
            milesConvert: 1609.34,
            costPerGallon: 5.5,
            map:[]
            
        };
    },
    updated () {
        
    },
    mounted() {
        //this.getMap();
    },
    methods: {
        getMap(){
            this.map = this.$store.getters.getMap;
            console.info('%cmap 2: %o', 'color: red;font-size:12px', this.map);

        },
        deleteAll () {
            this.$store.dispatch('deleteAll');
        },
        deleteLoc(index) {
            this.$store.dispatch("deleteLoc", index);
        },
        moveUp(index) {
            this.$store.dispatch("moveUp", index);
        },
        
        moveDown(index) {
            this.$store.dispatch("moveDown", index);
        },
        
        listDestinations () {
            this.calculateTotals (this.$store.getters.addressesList);
            return this.$store.getters.addressesList;
        },

        calculateTotals (destinations) {
            let totalSeconds = 0;
            let totalMeters = 0;
            destinations.forEach (item => {
                if (item?.stats) {
                    totalSeconds += item.stats.durationSeconds;
                    totalMeters += item.stats.distanceMeters;
                }
            })
            this.totalTime = this.getTotalTime(totalSeconds);
            this.totalDistance = this.getTotalDistance(totalMeters);
            this.fuelCost = this.getTotalFuelCost(totalMeters)
        },
        
        getTotalTime(totalSeconds) {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            return (hours) ? hours + " hours " + minutes + " minutes": minutes + " minutes";
        },

        getTotalDistance(totalMeters) {
            const miles = totalMeters / this.milesConvert;
            return miles.toFixed(1) + " miles";
        },
        
        getTotalFuelCost(totalMeters) {
            const miles = totalMeters / this.milesConvert;
            const gallonsUsed = (miles/21);
            const cost = this.costPerGallon * gallonsUsed;
            return "$"+cost.toFixed(2) + " at $"+this.costPerGallon+" per gallon";
        }

    },
    computed: {}
};
</script>

<style lang="scss">
    #destinations {
        background-color: $colorB;
        width: 650px;
        margin: auto;
        text-align: center;
        margin-top:20px;
        
        .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .space {
                flex: 1; 
            }
            
            h2 {
                color: white;
                padding: 0;
                margin: 0;
                text-align: center;
                flex: 1;
            }
            
            .clear-all {
                padding-right: 5px;
                flex: 1;
                text-align: right;
                color:white;
                cursor: pointer;
            }
        }
        
        .destinations-list {
            width:100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            article.item {
                width:100%;
                
                .details {
                    width: 100%;
                    display: flex;
                    position: relative;

                    .updown {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        align-items: center;
                        width:20px;
                        color: $colorA;
                        
                        .up, .down, .delete {
                            width:100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            cursor: pointer;
                            background-color: $colorD;
                        }
                        
                        .delete {
                            padding-top: 1px;
                        }
                        
                    }
                    
                    .order {
                        background-color: $colorD;
                        padding: 0 4px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        p {
                            font-family: Arial, Helvetica, sans-serif;
                            font-size: 15px;
                            color: $colorA;
                        }
                    }
                    .address {
                        background-color: $colorC;
                        padding-top:10px;
                        padding-bottom: 10px;
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 20px;
                        color: $colorA;
                        display: flex;
                        flex-grow: 1;
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
                    background-color: $colorD;
                    border-radius: 10px;
                    margin:auto;
                    font-size: 15px;
                    color: $colorA;
                    width:auto;
                    width: 300px;
                    font-size: 16px;
                    padding-top:5px;
                    padding-bottom: 5px;
                    p {margin:0; padding:0}
                }
            }
        }
    }
</style>
