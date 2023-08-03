<template>
    <HomeLayout>
        <template v-slot:content>
            <OrderItem class="px-[10%] mb-[30px] mobile:px-1"/>
        </template>
    </HomeLayout>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue';
import HomeLayout from '../../layouts/HomeLayout.vue';
import OrderItem from '../../components/user/OrderItem.vue';
import ls from 'localstorage-slim';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import router from '../../router';

export default defineComponent({
    components: {HomeLayout, OrderItem},

    setup() {
        const store = useStore();
        const toast = useToast();
        var user = ref([]);
        var logged_in = ref(ls.get('token_user') == null);

        onMounted( async () => {
            if (logged_in.value) {
                router.push({name: 'login'});
                toast.error("Bạn chưa đăng nhập !");
            }
        })
    }
})
</script>
