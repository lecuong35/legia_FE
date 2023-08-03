<template>
    <div class="pt-[30px] mobile:mt-[30px]">
        <div class="order mb-[30px] shadow-lg rounded-lg
        xl:p-[10px] lg:p-[10px] md:p-[10px] sm:p-[10px] mobile:p-[5px]
        xl:border-[1px] lg:border-[1px] md:border-[1px] sm:border-[1px] mobile:border-[0px]">
            <p class="title text-xl font-bold pb-[10px] border-b-[1px]
            mobile:text-xl">
                Giỏ hàng
            </p>
            <div class="pt-[10px]" v-if="loaded">
                <p class="title font-bold text-normal">
                    Các sản phẩm trong giỏ
                </p>
                <div v-if="items.length > 0">
                    <div v-for="item in items" :key="item"
                    class="flex items-center justify-start gap-[10px] py-[10px]">
                        <div>
                            <input type="checkbox" :value="item.selected" :checked="item.selected"  @change.prevent="changeSelected(item)">
                        </div>
                        <div class="w-full flex p-[10px] border-[1px] rounded-lg shadow-lg
                        mobile:flex-col"  @click="changeSelected(item)">
                            <img :src="getImageUrl(item.product.images[0])" alt=""
                            class="max-w-[150px] rounded-lg pr-[10px]">
                            <div>
                                <p>
                                    Tên sản phẩm: <span>{{ item.product.name.toUpperCase() }}</span>
                                </p>
                                <p> Số lượng: <span>{{ item.quantity }}</span> </p>
                                <p>
                                    Giá 1 sản phẩm:
                                    <span>
                                        {{ item.product.price.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }) }}
                                    </span>
                                </p>
                                <p>
                                    Tổng:
                                    <span>
                                        {{ (item.quantity * item.product.price).toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }) }}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div class="h-fit p-[5px] bg-[#f0f0f1] rounded-lg hover:bg-[#c5c5c6] hover:cursor-pointer"
                        @click="deleteCartItems(item)">
                            <font-awesome-icon icon="trash" color="red"/>
                        </div>
                    </div>
                    <div v-if="vouchers && vouchers.length > 0" class="py-[10px]">
                        <p class="text-md py-[5px]">
                            Chọn Mã giảm giá cho đơn hàng
                        </p>
                        <select data-te-select-init v-model="voucher_selected" @change="apply_voucher()"
                        class="outline-none border-[1px] rounded-lg shadow-lg px-[10px] py-[5px]">
                            <option v-for="voucher in vouchers" :key="voucher.id" :value="voucher.id">
                                {{ voucher.name }}
                                <span> giảm </span>
                                {{  parseInt((1 - voucher.value) * 100) }}% <span> giá trị đơn hàng</span>
                            </option>
                        </select>
                    </div>
                </div>
                <div v-else class="px-[10%] my-[30px]">
                    <p class="title text-lg font-bold text-center">
                        Chưa có sản phẩm nào được thêm
                    </p>
                    <div class="flex items-center justify-center pt-[10px]">
                        <img src="https://groceryroute.com/package/images/no-product-img.png" alt="">
                    </div>
                </div>
            </div>
            <div v-else class="my-[30px]">
                <p class="title text-lg font-bold text-center">
                    Chưa có sản phẩm nào được thêm
                </p>
                <div class="flex items-center justify-center pt-[10px]">
                    <img src="https://groceryroute.com/package/images/no-product-img.png" alt="">
                </div>
            </div>
            <div class="pt-[10px] border-t-[1px]">
                <p class="title font-bold text-normal">
                    Thông tin liên hệ
                </p>
                <form class="flex flex-col gap-[20px] pt-[20px]">
                    <div>
                        <TextField :value="bill.customer_phone" :placeholder="label.customer_phone" @update:value="bill.customer_phone = $event"/>
                        <FormError v-if="errors.customer_phone" :error="errors.customer_phone[0]"/>
                    </div>
                    <div>
                        <TextField :value="bill.address" :placeholder="label.address" @update:value="bill.address = $event"/>
                        <FormError v-if="errors.address" :error="errors.address[0]"/>
                    </div>
                    <div>
                        <p>
                            Tổng đơn: {{ new_total.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }) }}
                        </p>

                        <p v-if="voucher_selected">
                            Được giảm: {{ voucher_total.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }) }}
                        </p>
                   </div>
                </form>
            </div>
            <div v-if="loaded" class="pt-[20px]">
                <button class="btn_submit bg-[#4bb543] text-lg font-bold" @click="order()">
                    Đặt hàng
                </button>
           </div>
        </div>
    </div>
</template>
<script>
import { defineComponent, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import router from '../../router';
import ls from 'localstorage-slim';
import TextField from '../../components/TextField.vue';
import FormError from '../../components/FormError.vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import { Select, initTE } from "tw-elements";

    export default defineComponent({
        props: ['cart_items', 'bill'],
        components: { TextField, FormError },

        setup(props) {
            const store = useStore();
            const toast = useToast();
            var items = ref([]);
            var vouchers = ref([]);
            var voucher_selected = ref(1);
            var voucher = ref();
            var voucher_total = ref(0);
            var new_total = ref(0);
            var errors = ref([]);
            items.value = props.cart_items;
            var bill = reactive({});
            bill = props.bill;

            const label = reactive({
                customer_phone: 'Số điện thoại',
                address: 'Địa chỉ nhận hàng',
            });

            var loaded = ref(false);
            var logged_in = ref(false);
            var total = ref(0);
            if (ls.get('token_user') != null) logged_in.value = true;

            watch(() => store.getters['bill/errors'], () => {
                errors.value = store.getters['bill/errors'];
            })

            watch(() => store.getters['cart_item/cart_items'], () => {
                items.value =  store.getters['cart_item/cart_items'];
            })

            onBeforeMount( () => {
                if (items.value.length != 0) {
                    items.value.map((item) => {
                        if (item.selected) {
                            total.value += item.quantity * item.product.price;
                        }
                    });
                    vouchers.value = store.getters['user/user'].vouchers;
                    bill.total = total.value;
                    new_total.value = total.value;
                    initTE({ Select });
                    loaded.value = true;
                }
                else {
                    initTE({ Select });
                    loaded.value = false;
                }
            });

            const getImageUrl = (image) => {
                return `data:${image.type};base64,${image.data}`;
            };

            const showDetail = (product) => {
                router.push({ name: 'chi_tiet_san_pham', query: { id: product.id }});
                store.commit('product/GET_DIFINE_PRODUCT', product)
            };

            const changeSelected = (item) => {
                if (logged_in.value) {
                    store.commit('cart_item/UPDATE_SELECTED', item.product_id);
                }
                else {
                    item.selected = !item.selected;
                }

                if (item.selected) {
                    total.value += item.quantity * item.product.price;
                }
                else {
                    total.value -= item.quantity * item.product.price;
                }

                new_total.value = total.value
                bill.total = total.value;
            }

            const apply_voucher = () => {
                new_total.value = total.value;
                voucher.value = vouchers.value.find(item => {
                    if (item.id == voucher_selected.value)
                        return item;
                })
                bill.voucher_id = voucher.value.id;

                voucher_total.value = parseInt(total.value * (1 - voucher.value.value));
                new_total.value = total.value * voucher.value.value;
                bill.total = new_total.value;

                console.log(bill);
            }

            const deleteCartItems = async (item) => {
                var id = item.id;
               if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
                    if (item.selected) {
                        changeSelected(item);
                    }

                    if(logged_in.value) {
                        await store.dispatch('cart_item/deleteCartItem', id);
                    }
                    else {
                        items.value = items.value.filter(item1 => {
                            if (item1.id != item.id)
                                return item1;
                        });
                        ls.set('cart_items', items.value, {ttl: 60*60*6});
                    }
                }
            }


            const order = async() => {
                if (logged_in.value ) {
                    if (bill.total > 0 && bill.address != '' && bill.customer_phone != '') {
                        await store.dispatch('bill/addBill', bill).then(() => {
                            var new_bill = store.getters['bill/new_bill'];
                            total.value = 0;
                            items.value = items.value.filter(item => {
                                if(item.selected) {
                                    store.dispatch('cart_item/updateCartItem', [item.id, new_bill.id]);
                                }
                                else {
                                    total.value += item.quantity * item.product.price;
                                    return item;
                                }
                        });
                        bill.total = total.value;
                        router.push({name: 'don_hang'});
                    })
                    }
                    else {
                        toast.warning("Bạn chưa chọn sản phẩm nào để đặt !")
                    }
                }
                else {
                    var bill_id = ref([]);
                    bill.total = total.value;
                    if (bill.total > 0 && bill.address != '' && bill.customer_phone != '') {
                        await store.dispatch('bill/addBill', bill).then(() => {
                            bill_id.value = store.getters['bill/new_bill'].id;
                        });
                        items.value = items.value.filter(item => {
                            if(item.selected && bill_id.value) {
                                item.bill_id = bill_id.value;
                                store.dispatch('cart_item/addCartItem', item);
                                ls.set('cart_items', items.value, {ttl: 60*60*6});
                                router.push({name: 'home'});
                            }
                            else {
                                return item;
                            }
                        });

                    }
                    else {
                        toast.warning("Bạn chưa điền đủ thông tin !");
                    }
                }
            }

            return {
                getImageUrl, showDetail, items, loaded, total, apply_voucher, voucher_total,
                changeSelected, bill, label, order, vouchers, voucher_selected, new_total, errors, deleteCartItems
            }
        }
    });
</script>

<style scoped>
.product_image {
    width: 100%;
    height: 160px;
    border-radius: 10px;
    object-fit: cover;
}

.title {
    background: -webkit-linear-gradient(90deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 40%, rgba(0,212,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.btn_submit {
    width: 100%;
}

p {
    font-weight: 700;
}

span {
    font-size: medium;
    font-weight: 400;
}
</style>
