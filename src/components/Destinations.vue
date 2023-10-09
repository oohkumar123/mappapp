<template>
    <div id="destinations" v-if="myList.length">
        <div class="title">
            <div class="space">&nbsp;</div>
            <h2 @click="getMap">Destinations List </h2>
            <div class="clear-all" @click="deleteAll">Delete all</div>           
        </div> 
        <div class="destinations-list sortable-list" ref="sortableList">
            <article class="item" :data-placeId="index" draggable="true" ref="item" v-for="(item, index) in myList" :key="index">
                <div class="stats" v-if="item.stats" :style="{ background: item.stats.backgroundColor}">
                    Distance: {{ item.stats.distanceText }}
                    <br>
                    Duration: {{ item.stats.durationText }}
                </div>
                <div class="details">
                    <div class="order"><p>{{ index+1 }}</p></div>
                    <div class="address">
                        <p class="street">
                            <!-- {{ item.place_id }} <br> test me again-->
                            {{ item.formatted_address }} 
                            <br>
                            {{ item.location }} 
                        </p>
                        <p class="latlon">
                        </p>
                    </div>
                    <div class="updown">
                        <div class="up"     v-if="index > 0" @click="moveUp(index)">&uarr;</div>
                        <div class="delete" @click="deleteOne(index)">&#10026;</div>
                        <div class="down"   v-if="index != myList.length-1" @click="moveDown(index)">&darr;</div>
                    </div>
                </div>
            </article>
        </div>
    </div>
    <JourneySummary :destinations="myList" v-if="(myList.length > 0)"></JourneySummary>

</template>
<script>
import JourneySummary from './JourneySummary.vue';

export default {
    components: {
        JourneySummary
    },
    data() {
        return {
            myList: [],
            totalTime:"",
            totalDistance:"",
            fuelCost:"",
            milesConvert: 1609.34,
            costPerGallon: 5.5,

        };
    },
    watch: {
        async placeAdded (newCount, oldCount) {
            this.myList = await this.listPlaces();
        }
    },
    computed: {
        placeAdded () {
            return this.$store.getters.getPlaces.length
        }
    },
    methods: {
        deleteOne(index) {
            this.$store.commit("deleteOne", index);
        },
        deleteAll () {
            this.$store.commit('deleteAll');
        },
        async moveUp(index) {
            this.$store.commit("moveUp", index);
            this.myList = await this.listPlaces();
        },
        async moveDown(index) {
            this.$store.commit("moveDown", index);
            this.myList = await this.listPlaces();
        },
        async listPlaces() {
            const places = this.$store.getters.getPlaces;
            const lineColors = ['red','green','blue','yellow','orange','pink']
            const updatedPlaces = [];

            for (const key in places) { // change to each
                
                if (key!=='0') {
                    const origin = places[key-1].location;
                    const destination = places[key].location;
                    
                    const service = new google.maps.DistanceMatrixService();
                    const response = await service.getDistanceMatrix({
                        origins: [origin],
                        destinations: [destination],
                        travelMode: 'DRIVING',
                        unitSystem: google.maps.UnitSystem.IMPERIAL,
                    });
                    
                    const {distance: {text:distanceText, value:distanceMeters},duration:{text:durationText, value:durationSeconds}} = response.rows[0].elements[0];
                    
                    const stats = {
                        distanceText,
                        durationText,
                        distanceMeters,
                        durationSeconds,
                        backgroundColor: lineColors[key-1],
                    }

                    const placesStats = {...places[key], stats};
                    updatedPlaces.push(placesStats);

                } else {
                    updatedPlaces.push(places[key]);
                }
            }
            return updatedPlaces;
        },
        

    }
};
</script>

<style lang="scss">
    #destinations {
        background-color: $colorB;
        margin: auto;
        text-align: center;
        margin-top:15px;
        
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
                padding: 10px 0;
                font-size: 30px;
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
