<template>
    <div class="grid grid-cols-3 text-sm mobile:grid-cols-2">
        <div v-for="product in products" :key="product.id"
        class="p-[10px] m-[10px] border-[1px] rounded-xl shadow-md
        flex flex-col justify-between">
            <div class="flex items-center justify-center">
                <img :src="getImageUrl(product.images[0])" alt="hinh anh" class="product_image">
            </div>
            <div class="py-[10px] mobile:text-lg">
                <p class="text-center font-bold text-md">
                    {{ product.name }}
                </p>
                <p class="font-bold pb-[5px] mobile:hidden">
                    Mã code: <span class="font-normal">{{ product.code }}</span>
                </p>
                <p class="font-bold pb-[5px] mobile:hidden">
                    Thương hiệu: <span class="font-normal">{{ product.brand.name }}</span>
                </p>
                <p class="font-bold pb-[5px]">
                    Loại: <span class="font-normal">{{ product.category.name.slice(9) }}</span>
                </p>
                <p class="font-bold pb-[5px]">
                    Giá: <span class="font-normal">{{ product.locale_price }}</span>
                </p>
            </div>
            <div class="flex flex-col gap-[10px] items-center justify-between mobile:text-lg">
                <button class="flex items-center justify-center gap-[4px] btn_submit bg-[var(--primary-blue)]"
                @click="showDetail(product)">
                    <font-awesome-icon icon="pen-to-square" color="white"   />
                    <p>
                        Chi tiết sản phẩm
                    </p>
                </button>
                <!-- <button class="flex items-center justify-center gap-[4px] btn_submit bg-[#4bb543]">
                    <font-awesome-icon icon="shopping-cart" color="white"   />
                    <p>
                        THêm
                    </p>
                </button> -->
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent, reactive } from 'vue';
import router from '../../router';
import { useStore } from 'vuex';

    export default defineComponent({
        props: ['products'],

        setup() {
            const store = useStore();
            const getImageUrl = (image) => {
                return `data:${image.type};base64,${image.data}`;
            };

            const showDetail = (product) => {
                router.push({ name: 'chi_tiet_san_pham', query: { id: product.id }});
                store.commit('product/GET_DIFINE_PRODUCT', product)
            };

            return {
                getImageUrl, showDetail
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

.btn_submit {
    width: 100%;
}
</style>
