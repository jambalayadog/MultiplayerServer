<template>
    <div :id="containerId" v-if="downloaded" />
    <div class="placeholder" v-else>
        Downloading...
    </div>
</template>

<script>
    //import io from 'socket.io-client';
    //let socket = io('http://localhost:3000');
    //let socket = io('http://192.168.0.110:3000', {
    //    withCredentials: true,
    //});

    export default {
        name: 'GameComp',
        data: function () {
            return {
                downloaded: false,
                gameInstance: null,
                containerId: 'game-container'
            }
        },
        async mounted() {
            const game = await import('@/game/game');
            this.downloaded = true;
            this.$nextTick(() => {
                this.gameInstance = game.launch(this.containerId)
            })
        },
        unmounted() {
            this.gameInstance.destroy(false);
        }
    }

</script>

<style scoped>

</style>    