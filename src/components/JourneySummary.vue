<template>
    <div id="journey-summary" v-if="destinations.length>1">
        <h2>Journey Summary </h2>
        <p>Distance: {{ totalDistance }}</p> <br>
        <p>Total time: {{ totalTime }}</p> <br>
        <p>Fuel cost: {{  fuelCost  }}</p><br>
    </div>
</template>

<script>
export default {
    name: 'JourneySummary',
    data() {
        return {
            totalTime:"",
            totalDistance:"",
            fuelCost:"",
            milesConvert: 1609.34,
            costPerGallon: 5.5,
            
        };
    },
    props: ['destinations'],
    updated (){
        this.calculateTotals ();
    },
    methods: {
        calculateTotals () {
            let totalSeconds = 0;
            let totalMeters = 0;
            this.destinations.forEach (item => {
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
    }
}
</script>
<style lang="scss">
#journey-summary {
    background-color: $colorB;
    width: 650px;
    margin: auto;
    text-align: center;
    margin-top: 20px;
    padding: 10px 20px 10px 20px;
    box-sizing: border-box;
    border-radius: 20px;;
    * {
        margin: 0;
        padding: 0;
    }
    h2 {
        color: white;
    }
    p {
        color: white;
        border-bottom: 1px dotted #ffffff;
        display: inline-block;
        text-align: center;
        line-height: 200%;
    }
    p:last-of-type {
        border-bottom: 0;
    }
}

</style>
