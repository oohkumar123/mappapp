<template>
    <div id="destinations">
        <h2 draggable="true">Destinations List </h2>
        <div class="destinations-list sortable-list" ref="sortableList">
            <article class="item" :data-placeId="item.placeId" draggable="true" ref="item" v-for="(item, index) in addressesList" :key="index">
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
                            {{ item.placeId }} 
                            <br>
                            {{ item.address }} 
                            <br>
                            {{ item.latlng }} 
                        </p>
                        <p class="latlon">
                        </p>
                    </div>
                </div>
            </article>

        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { performAction, calculateValue } from '../lib/helper_functions.js';

export default {
    data() {
        return {
        };
    },
    updated () {
        console.info('%cLocation: %o', 'color: green;font-size:12px', 'updated');
        performAction();
        calculateValue();
        this.initDestinations();
    },
    mounted() {
        
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
                
                //sortableList.insertBefore(draggingItem, nextSibling);
            }
            
            sortableList.addEventListener("dragover", initSortableList); 
            sortableList.addEventListener("dragenter", e => e.preventDefault());            
        },
        
        reorderDestinationsArray () { 
            [...this.$refs.sortableList.children].forEach((el)=>{
                this.$store.commit('updatePlaceIds', el.dataset['placeid']); 
                this.$store.dispatch("processMap");
            });
        }
    },
    computed: {
        ...mapGetters(['addressesList'])
    }
};
</script>

<style lang="scss">
    #destinations {
        background-color: blue;
        width: 650px;
        margin: auto;
        text-align: center;
        
        h2 {
            color: white;
            height: auto;
            padding: 0;
            margin: 0;
            margin-top: 20px;
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
                        align-items: center;
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
                    width: 300px;
                    font-size: 16px;

                    p {margin:0; padding:0}
                }
            }
        }
    }
</style>
