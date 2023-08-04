<template>
    <HomeLayout v-if="loaded">
        <template v-slot:content>
           <div class="px-[10%] mobile:px-1">
                <div class="p-[10px] shadow-lg rounded-lg border-[1px]">
                    <div class="mobile:pt-[40px]">
                        <CarouselProduct :carousel_images="product.images" v-if="images_loaded" />
                    </div>
                    <div class="flex mobile:block border-t-[1px]">
                        <div class="info basis-4/5 pr-[5px]
                        mobile:pb-[10px] mobile:border-b-[1px]">
                            <p class="title">
                                Thông tin sản phẩm
                            </p>
                            <div>
                                <p>
                                    Mô tả sản phẩm: <span> {{ product.description }} </span>
                                </p>

                                <p>
                                    Tên sản phẩm: <span> {{ product.name }} </span>
                                </p>
                                <p>
                                    Thương hiệu: <span> {{ product.brand.name }} </span>
                                </p>
                                <p>
                                    Phân loại: <span> {{ product.category.name }} </span>
                                </p>
                                <p>
                                    Mã sản phẩm: <span> {{ product.code }} </span>
                                </p>
                                <p>
                                    Giá 1 sản phẩm: <span> {{ product.locale_price }} </span>
                                </p>
                            </div>
                        </div>
                        <div class="add_to_cart basis-1/5 pl-[5px]">
                            <div>
                                <p class="title">
                                    Số lượng
                                </p>
                                <div class="flex gap-[5px] py-[20px]">
                                    <div @click="cart_item.quantity += 1">
                                        <font-awesome-icon icon="plus"   />
                                    </div>
                                    <input type="text" v-model="cart_item.quantity" disabled
                                    class="text-center outline-none border-[1px] rounded-lg
                                    mobile:w-full">
                                    <div @click="minus_quatity">
                                        <font-awesome-icon icon="minus"   />
                                    </div>
                                </div>
                            </div>
                            <button class="btn_submit bg-[#4bb543] w-full mobile:text-md mobile:py-[8px]" @click="addToCart()">
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
           </div>
            <div v-if="related" class="px-[10%] mobile:px-1">
                <p class="title pb-[20px]">
                    Các sản phẩm tương tự
                </p>
                <ProductHome :products="related_product"/>
            </div>
        </template>
    </HomeLayout>
</template>
<script>
import { defineComponent, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import HomeLayout from '../../layouts/HomeLayout.vue';
import ProductHome from '../../components/home/ProductHome.vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import CarouselProduct from '../../components/home/CarouselProduct.vue';
import ls from 'localstorage-slim'
import { useToast } from 'vue-toastification';
import router from '../../router';

export default defineComponent({
    components: { HomeLayout, CarouselProduct, ProductHome },

    setup() {
        const route = useRoute();
        const store = useStore();
        const loaded = ref(false);
        const images_loaded = ref(false);
        const related = ref(false);
        const id = route.query.id;
        const quantity = ref(1);
        const toast = useToast();
        var bill = reactive({
            user_id: null,
            voucher_id: null,
            customer_phone: null,
            address: null,
            total: 0,
        });
        var user = ref([]);
        var cart_items = ref([]);

        var product = ref([]);
        var related_product = ref([]);

        onBeforeMount(async () => {
            await store.dispatch('product/getDefineProduct', id).then(() => {
                product.value = store.getters['product/product'];
                loaded.value = true;
                images_loaded.value = true;
            });

            await store.dispatch('product/searchProduct', {
                category: product.value.category_id,
                brand: product.value.brand_id,
            }).then(() => {
                related_product.value = store.getters['product/recent_search_products'].data;
                console.log(related_product.value);
                related.value = true;
            })
        });

        watch(() => store.getters['product/product'], () => {
            loaded.value = false;
            images_loaded.value = false;
            product.value = store.getters['product/product'];
            cart_item.product_id = product.value.id;
            cart_item.quantity = 1;
            cart_item.product = product.value;
            loaded.value = true;
            images_loaded.value = true;
        });

        var cart_item = reactive({
            product_id: id,
            quantity: quantity.value,
            bill_id: '',
            user_id: '',
            product: '',
            selected: true,
            sum: ''
        });

        const minus_quatity = () => {
            if (cart_item.quantity < 2) {
                cart_item.quantity = 1;
            }
            else {
                cart_item.quantity -= 1;
            }
        }

        // watch(cart_item.quantity, () => {
        //     if(cart_item.quantity < 2)
        //         cart_item.quantity = 1;
        // })

        const addToCart = () => {
            user.value = store.getters['user/user'];
            if (user.value.length != 0) {
                // setNewBill();
                cart_item.user_id = user.value.id;
                store.dispatch('cart_item/addCartItem', cart_item);
            }
            else {
                if (ls.get('cart_items')) {
                    cart_items.value = ls.get('cart_items');
                    var count = ref(0);
                    cart_items.value = cart_items.value.map((item) => {
                        if (item.product_id == cart_item.product_id) {
                            item.quantity += cart_item.quantity;
                            count.value += 1;
                        }
                        return item;
                    });
                    if (count.value == 0) cart_items.value.push(cart_item);
                    ls.set('cart_items', [...cart_items.value], {ttl: 60*60*6})
                }
                else {
                    ls.set('cart_items', [cart_item], {ttl: 60*60*6})
                }
            }
            toast.success("Thêm sản phẩm vào giỏ thành công !");
            if (confirm("Bạn có muốn đặt hàng ngay không?")) {
                router.push({name: 'gio_hang'});
            }
        }

        // const setNewBill = async () => {
        //     await store.dispatch('bill/userGetBills', ['NEW', 1, 'all']).then(() => {
        //         var user_bill = store.getters['bill/recent_new_bill'];
        //         var errors = store.getters['bill/errors'];
        //         user.value = store.getters['user/user'];

        //         if (errors.length != 0){
        //             bill.address = user.value.location;
        //             bill.user_id = user.value.id;
        //             bill.customer_phone = user.value.phone;
        //             store.dispatch('bill/addBill', bill);
        //             store.commit('bill/SET_ERRORS', null);
        //         }
        //     });

        // }

        return {
            product, loaded, quantity, minus_quatity, related, related_product, images_loaded,
            cart_item, addToCart
        }
    }
})
</script>

<style scoped>
p {
    font-size: large;
    font-weight: 700;
    padding: 10px 0px;
}

span {
    font-size: medium;
    font-weight: 300;
}

.title {
    font-size: x-large;
    font-weight: 700;
    background: -webkit-linear-gradient(90deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 40%, rgba(0,212,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
