<template>
    <div id="journey-totals" v-if="1">
        <h2>Journey Summary </h2>
        <p>Distance: {{ totalDistance }}</p> <br>
        <p>Total time: {{ totalTime }}</p> <br>
        <p>Fuel cost: {{  fuelCost  }}</p><br>
    </div>
</template>

<script>
export default {
    name: 'JourneyTotals',
    props: ['totalTime','totalDistance','fuelCost']
}
</script>
<style lang="scss">
#journey-totals {
    background-color: green;
    width: 650px;
    margin: auto;
    text-align: center;
    margin-top: 20px;
    padding: 10px 20px 10px 20px;
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
