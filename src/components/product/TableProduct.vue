<template>
    <table class="w-full">
        <thead class="border-b-[1px] border-solid border-[#f0f0f1]
        py-[10px]">
            <th class="xl:block lg:block md:hidden sm:hidden mobile:hidden">Mã sản phẩm</th>
            <th class="mobile:hidden">Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th class="mobile:hidden">Số lượng</th>
            <th>Hành động</th>
        </thead>
        <tbody class="text-center text-[14px] leading-[20px]">
            <tr v-for="product in products" :key="product.id" class="text-center">
                <td class="xl:table-cell lg:table-cell md:hidden sm:hidden mobile:hidden text-sm">
                    <p v-if="product.code.length > 16">
                        {{product.code.slice(0,16)}}...
                    </p>
                    <p v-else>
                        {{product.code}}
                    </p>
                </td>
                <td class="mobile:hidden">
                    <img :src="getImageUrl(product.images[0])" alt=""
                    class="w-[60px] rounded-md">
                </td>
                <td>
                    <p v-if="product.name.length < 30">
                        {{ product.name }}
                    </p>
                    <p v-else>
                        {{ product.name.slice(0,30) }}...
                    </p>
                </td>
                <td>
                    {{
                        product.price.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        })
                    }}
                </td>
                <td class="mobile:hidden">{{product.quantity}}</td>
                <td>
                    <button class="px-[8px] py-[4px] rounded-md border bg-[var(--main-dark-color)]
                     text-white transition-all"
                    @click="showDetail(product.id)">
                        <font-awesome-icon icon="pen-to-square" color="rgba(#fff,0.5)"  />
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
    <div v-if="products[0] == null" class="w-full flex items-center justify-center">
        <p class="pt-[30px] text-xl font-normal">
            KHÔNG CÓ SẢN PHẨM NÀO
        </p>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import router from '../../router';
import { useRoute } from 'vue-router';

    export default defineComponent({
        props: ['products'],

        setup() {
            const store = useRoute();
            const getImageUrl = (image) => {
                return `data:${image.type};base64,${image.data}`;
            };

            const showDetail = (id) => {
                router.push({ path: 'product_details', query: { id: id }})
            };

            return {
                getImageUrl, showDetail
            }
        }
    })
</script>

<style scoped>
th {
    padding: 0px 5px 0px 5px;
    white-space: nowrap;
}

tr {
    border-bottom: solid 1px #f0f0f1;
}

td {
    padding: 5px 0px 5px 0px;
}

tr:hover {
    background-color: #f0f0f1;
}
</style>
