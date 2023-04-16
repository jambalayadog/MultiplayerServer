<template>
    <div id="app">
        <!--<BlockGame />-->
        <div id="game">
            <GameComp />
        </div>
        <div id="border" />
        <div id="input">
            <ChatComp />
        </div>
        
    </div>
</template>

<script>
    import ChatComp from "./components/ChatComp.vue";
    import GameComp from "./components/GameComp.vue";
    //import BlockGame from "./components/BlockGame.vue";

    export default {
        name: "App",
        components: {
            ChatComp,
            GameComp,
            //BlockGame,
        },
    };
</script>

<style>
    #app {
        font-family: "Trebuchet MS";
        text-align: left;
        /*background-color: black;*/
        color: cyan;
        display: flex;
        position: relative;
    }
    #game {
        width: 100%;
        height: 100%;
    }
    #input {
        width: 25vw;
        position: absolute;
        left: 25%;
        top: 25%;
    }
    #border {
        /*border-right: 2px solid cyan;*/
    }
    @media (max-width: 1000px) {
        #app {
            /*flex-direction: column;*/
        }
        #game {
            width: 100%;
            height: 100%;
            position: relative;
        }
        #input {
            /*width: 100%;*/
            position: absolute;
            left: 25%;
            top: 25%;
        }
    }
</style>
