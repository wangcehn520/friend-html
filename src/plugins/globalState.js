import { ref, readonly } from 'vue';

const globalVariable = ref(null);

export function useGlobalState() {
    function setGlobalVariable(value) {
        globalVariable.value = value;
    }

    return {
        globalVariable: readonly(globalVariable),
        setGlobalVariable,
    };
}
