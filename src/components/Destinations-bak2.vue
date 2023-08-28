<template>
    <div id="destinations">
        <h2 draggable="true">Destinations List </h2>
        <div class="destinations-list sortable-list" ref="sortableList">
            <article class="item" :class="'item ' + index"  draggable="true" ref="item" v-for="(item, index) in fullName" :key="index">
                <div class="details">
                    <div
                        class="order"
                        style="background-color: blueviolet">
                        <h3>{{ index+1 }}</h3>
                    </div>
                    <div class="address">
                        <p class="street">
                            {{item.address}}
                        </p>
                        <p class="latlon">
                            Latitude: {{item.location.lat}} | Longtitude: {{item.location.lng}}
                        </p>
                    </div>
                </div>
            </article>

        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            watchLocations: []
        };
    },
    mounted() {
        this.initDestinations();
        //this.addStats();
    },
    updated(){
        this.watchLocations = 2;
    },
    watch: {
        watchLocations(newValue, oldValue) {
        console.log(`watchLocations changed from ${oldValue} to ${newValue}`);
        },
    },
    methods: {
        initDestinations() {
            let sortableList = this.$refs.sortableList;
            this.items = this.$refs.sortableList.querySelectorAll('.item')

            this.items.forEach(item => { // add an event listener to each item where when dragging starts add class 'dragging' and remove when drag ends
                
                item.addEventListener("dragstart", () => {
                    setTimeout(() => item.classList.add("dragging"), 0);
                });
                
                item.addEventListener("dragend", () => {
                    item.classList.remove("dragging");
                    this.addStats();
                });
            });

            const initSortableList = (e) => {

                e.preventDefault();
                this.removeStats();
                
                const draggingItem = document.querySelector(".dragging");
                let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];
                let nextSibling = siblings.find(sibling => {
                    let siblingPos = (parseInt(sibling.offsetTop + sibling.offsetHeight)/2); 
                    let clientPos = e.clientY
                    return clientPos <= siblingPos; //if the client has moved above the current sibling
                });

                sortableList.insertBefore(draggingItem, nextSibling);
            }

            sortableList.addEventListener("dragover", initSortableList); 
            sortableList.addEventListener("dragenter", e => e.preventDefault());            
        },
        
        addStats () {
            let sortableList = this.$refs.sortableList;
            this.items = this.$refs.sortableList.querySelectorAll('.item')

            for (let i = 0; i < this.items.length; i++) {
                sortableList.append(this.items[i]);
                let article = document.createElement('article');
                article.classList.add('stats');

                article.innerHTML = `
                    <p>Distance between destinations</p>
                    <p>Time to drive at average 60 mph</p>
                    <p>Gas fuel cost</p>
                `;

                if (this.items[i+1]) {
                    sortableList.append(article);
                }
            }
        },
        removeStats() {
            let sortableList = document.querySelector(".sortable-list");
            let stats = sortableList.querySelectorAll(".stats");
            stats.forEach(e=>e.remove())
        }
    },
    computed: {
        ...mapGetters(['locationsList']),
        fullName: function() {
            this.locationsList
            return this.locationsList
        }
    }
};
</script>

<style lang="scss">
    #destinations {
        background-color: blue;
        width: 650px;
        height: 650px;
        margin: auto;
        text-align: center;
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
            }
            article.stats {
                background-color: yellow;
                border-radius: 10px;
                margin:auto;
                padding:10px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 15px;
                color: black;
                width:auto;
                display:inline-block;

                p {margin:0; padding:0}
            }
        }
    }
</style>
