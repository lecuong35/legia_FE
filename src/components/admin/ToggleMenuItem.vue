<template>
    <div class="flex gap-[20px] py-[10px] px-[10px]
    border-solid border-b-[1px]
    hover:bg-[rgba(255,255,255,0.5)] hover:cursor-pointer transition-all"
    @click.prevent="redirect_to(route_name)">
        <font-awesome-icon :icon="icon"  color="rgba(255,255,255,1)"/>
        <p class="text-[rgba(255,255,255,1)]">
            {{ item }}
        </p>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';
import router from '../../router';

    export default defineComponent({
        props: ['item', 'icon', 'route_name'],

        setup() {
            const redirect_to = (route_name) => {
                router.push({name: route_name})
            }

            return {
                redirect_to
            }
        }
    })
</script>
