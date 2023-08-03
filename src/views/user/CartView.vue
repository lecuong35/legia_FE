<template>
    <HomeLayout>
        <template v-slot:content >
            <div v-if="loaded"
            class="px-[10%] order_items mobile:px-1">
                <CartItem :cart_items="cart_items" :bill="new_bill" />
            </div>
            <div v-else class="px-[10%] my-[30px] mobile:pt-[50px]">
                <p class="title text-lg font-bold text-center">
                    Chưa có sản phẩm nào được thêm
                </p>
                <div class="flex items-center justify-center pt-[10px]">
                    <img src="https://groceryroute.com/package/images/no-product-img.png" alt="">
                </div>
            </div>
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

export default defineComponent ({
    components: { HomeLayout, CartItem, TextField },

    setup() {
        const store = useStore();
        const cart_items = ref([]);
        var user = reactive({});
        const loaded = ref(false);
        var total_bill = ref(0);
        var new_bill = reactive({
            customer_phone: '',
            user_id: '',
            total: 0,
            address: '',
            status: 'PENDING',
            voucher_id: ''
        });
        var logged_in = ref(ls.get('token_user') != null);

        const bill_label = reactive({
            customer_phone: 'Số điện thoại',
            address: 'Địa chỉ nhận hàng',
        })


        onBeforeMount(async () => {
            if (logged_in.value) {
                await store.dispatch('cart_item/getCartItems').then(() => {
                    cart_items.value = store.getters['cart_item/cart_items'];
                    cart_items.value.map(item => {
                        total_bill.value += item.quantity * item.product.price;
                    })
                });

                await store.dispatch('user/getUserInfo').then(() => {
                    user = store.getters['user/user'];
                    new_bill.address = user.location;
                    new_bill.user_id = user.id;
                    new_bill.customer_phone = user.phone;
                    new_bill.total = total_bill.value;
                });

                if (cart_items.value.length > 0) {
                    loaded.value = true;
                }
            }
            else {
                cart_items.value = ls.get('cart_items');
                if (cart_items.value != null) {
                    loaded.value = true;
                }
            }
        })

        watch(cart_items.value, () => {
            cart_items.value = store.getters['cart_item/cart_items'];
            if (logged_in.value) {
                if (cart_items.value.length > 0) {
                    loaded.value = true;
                }
            }
            else {
                if (cart_items.value != null) {
                    loaded.value = true;
                }
            }
        })

        // if (user) {
            // async () => {
            //     await store.dispatch('cart_item/getCartItems').then(() => {
            //         cart_items.value = store.getters['cart_items/cart_items'];
            //     })
            // }
        // }
        // else {
        //     cart_items.value = ls.get('cart_items');
        // }

        return {
            cart_items, loaded, new_bill, bill_label, total_bill
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
    background: -webkit-linear-gradient(90deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 40%, rgba(0,212,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.contact {
    background: -webkit-linear-gradient(90deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 20%, rgba(0,212,255,1) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
</style>
