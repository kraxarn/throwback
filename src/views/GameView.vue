<script setup lang="ts">

import SmallCard from "@/components/SmallCard.vue";
import BigCard from "@/components/BigCard.vue";
import InsertCard from "@/components/InsertCard.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faPause} from "@fortawesome/free-solid-svg-icons";
</script>

<template>
    <div id="container">
        <div id="indicator"></div>
        <div id="dashboard">
            <span>
                0:00 / 0:00
            </span>
            <FontAwesomeIcon :icon="faPause"/>
        </div>

        <div id="bottom" class="hand">
            <InsertCard :index="1"/>
            <BigCard :year="2022" artist="Artist" track="Track"/>
            <InsertCard :index="2"/>
            <BigCard :year="2023" artist="Artist" track="Track"/>
            <InsertCard :index="3"/>
            <BigCard :year="2024" artist="Artist" track="Track"/>
            <InsertCard :index="4"/>
        </div>

        <div id="left" class="hand">
            <SmallCard :year="2016"/>
            <SmallCard :year="2017"/>
            <SmallCard :year="2018"/>
        </div>

        <div id="top" class="hand">
            <SmallCard :year="2019"/>
            <SmallCard :year="2020"/>
            <SmallCard :year="2021"/>
        </div>

        <div id="right" class="hand">
            <SmallCard :year="2013"/>
            <SmallCard :year="2014"/>
            <SmallCard :year="2015"/>
        </div>

    </div>
</template>

<style scoped>

#container {
    background: radial-gradient(
            var(--color-brown-darker),
            var(--color-brown-darkest)
    );

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

#dashboard {
    position: absolute;
    width: 20rem;
    height: 20rem;
    background-color: var(--color-brown-darker);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 2rem;

    span {
        font-size: 2em;
    }

    svg {
        font-size: 3em;
    }
}

#indicator {
    position: absolute;
    width: 21rem;
    height: 21rem;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(270deg);
    background: linear-gradient(to right, var(--color-blue-light) 50%, transparent 50%);
}

.hand {
    position: absolute;
    padding: 1.5rem;

    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    column-gap: 2rem;
}

#top, #bottom {
    width: 100vw;
}

#left, #right {
    width: 100vh;
}

#bottom {
    bottom: 0;
}

#top {
    top: 0;
    transform: rotate(180deg);
}

#left {
    transform-origin: top left;
    transform: rotate(90deg) translate(0, -100%);
}

#right {
    right: 0;
    transform-origin: top right;
    transform: rotate(-90deg) translate(0, -100%);
}

</style>