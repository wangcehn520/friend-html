<script lang="ts" setup>
import { onMounted } from 'vue';
import { useGlobalState } from './plugins/globalState.js';
import axios from 'axios';

const { globalVariable, setGlobalVariable } = useGlobalState();

console.log(globalVariable.value)


</script>

<template>
    <BasicLayout/>
</template>

<style scoped>

</style>
