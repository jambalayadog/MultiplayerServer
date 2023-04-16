<template>
    <!-- creating the HTML canvas -->
    <div>
        <canvas ref="game" width="640" height="360" style="border: 1px solid black">
        </canvas>
        <p>
            <button v-on:click="move('right')">Right</button>
            <button v-on:click="move('left')">Left</button>
            <button v-on:click="move('up')">Up</button>
            <button v-on:click="move('down')">Down</button>
        </p>
    </div>
</template>


<script>
    //importing the socket.io we installed
    import io from "socket.io-client"; 
    export default {
    name: "BlockGame",
    data() {
        return {
            socket: {},
            context: {},
            position: {
                x: 0,
                y: 0,
            },
        };
    },
    //the created lifecycle hook
    created() {
    //connecting to our host  
        this.socket = io("http://192.168.0.110:3000");
    },
    //the mounted lifecycle hook
    mounted() {
        //creating the 2d canvas
        this.context = this.$refs.game.getContext("2d");
        this.socket.on("position", (data) => {
            this.position = data;
            //clearing the rectangular block at intervals
            this.context.clearRect(
                0,
                0,
                this.$refs.game.width,
                this.$refs.game.height
            );
            //creating a rectangular block sized 20x20
            this.context.fillStyle = "#ff0000";
            this.context.fillRect(this.position.x, this.position.y, 20, 20);
            this.context.fillStyle = "#00ff00";
            this.context.beginPath()
            this.context.rect(20, 20, 150, 100)
            this.context.fill()
        });
    },
    //creating a method to emit the directions to the server side
    methods: {
        move(direction) {
            this.socket.emit("move", direction);
        },
    },
    
};
</script>

<style scoped>

</style>