<template>
    <HomeLayout v-if="loaded">
        <template v-slot:content>
            <BillModal :bill="bill" />
        </template>
    </HomeLayout>
</template>
<script>
import { defineComponent, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import HomeLayout from '../../layouts/HomeLayout.vue';
import CartItem from '../../components/user/CartItem.vue';
import TextField from '../../components/TextField.vue';
import { useStore } from 'vuex';
import ls from 'localstorage-slim';
import router from '../../router/index.js';
import { useToast } from "vue-toastification";
import BillModal from '../../components/bill/BillModal.vue';
import { useRoute } from 'vue-router';

export default defineComponent ({
    components: { HomeLayout, CartItem, TextField, BillModal },

    setup() {
        const store = useStore();
        const toast = useToast();
        const route = useRoute();
        const id = route.params.id;
        var bill = ref([]);
        const loaded = ref(false);
        var user = ref([]);

        var logged_in = ref(ls.get('token_user') == null);

        onBeforeMount(async () => {
            if (logged_in.value) {
                await store.dispatch('user/getUserInfo').then(() => {
                    user.value = store.getters['user/user'];
                    //(user.value);
                    if (user.value.length == 0) {
                        router.push({name: 'login'});
                        toast.warning("Ban chua dang nhap!");
                    }
                })
            }
            else {
                await store.dispatch('bill/userGetBill', id).then(() => {
                    bill.value = store.getters['bill/detail_bill'];
                    loaded.value = true;
                })
            }
        })

        return {
            loaded, bill
        }
    }
});

</script>

<style scoped>
li {
    padding: 2px 4px;
    border: solid 1px #c5c5c6;
    border-radius: 4px;
    font-size: small;
}

li:hover {
    background-color: #f0f0f1;
    cursor: pointer;
}
.navigate {
    padding: 0% 10%;
}

.title {
    width: 30%;
    color: white;
    background: -webkit-linear-gradient(90deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 20%, rgba(0,212,255,1) 100%);
}

.contact {
    background: -webkit-linear-gradient(90deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 20%, rgba(0,212,255,1) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
</style>
