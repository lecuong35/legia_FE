<template>
    <div class="w-full pb-[5px]">
        <p class="text-[12px] leading-[20px] text-[var(--primary-red)]">
            {{ error }}
        </p>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';

    export default defineComponent({
        props: ['error'],
    })
</script>
