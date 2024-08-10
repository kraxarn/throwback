<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{
	index: number
}>()

const iconStyle = {
	"--fa-bounce-height": "-20px",
	"--fa-animation-delay": `${props.index * 100}ms`,
	"--fa-animation-duration": "1500ms",
}

</script>

<template>
    <div class="insert-card-container">
        <div>
            <FontAwesomeIcon :icon="faCaretDown" bounce :style="iconStyle" />
        </div>
    </div>
</template>

<style scoped>

.insert-card-container {
    position: relative;
    width: 0;
    align-self: flex-start;

    > div {
        position: absolute;
        top: 40px;
        transform: translate(-50%, -100%);

        svg {
            font-size: 4em;
            color: var(--color-green-dark);
        }
    }
}

</style>