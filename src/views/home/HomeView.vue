<template>
    <HomeLayout>
        <template v-slot:content>
            <form @submit.prevent="search()"
            class="flex gap-[10px] w-full pt-[20px] pb-[10px] px-[10%]
             border-b-[1px] relative mobile:pt-[70px] mobile:px-1">
                <TextField :value="product.name" :placeholder="label_name" @update:value="product.name = $event"/>
                <div class="absolute top-[12px] right-[130px] p-[2px] rounded-md border-[1px]
                hover:bg-[#f0f0f1] hover:cursor-pointer" @click="clearInput()">
                    <!-- <font-awesome-icon icon="xmark" color="black"  /> -->
                </div>
                <button type="submit" class="btn_submit bg-[#4bb543]">
                    <font-awesome-icon icon="search" color="white"/>
                    Tìm kiếm
                </button>
            </form>
            <div class="content">
                <div class="px-[10%] pb-[30px] rounded-lg mobile:px-1">
                    <CarouselComponent />
                </div>
                <div class="px-[10%] mobile:px-1">
                    <div class="p-[10px] border-[1px] shadow-lg rounded-lg mobile:p-0 mobile:border-none">
                        <p class="title text-lg pb-[10px] border-b-[1px]">
                            Sản phẩm mới
                        </p>
                        <ProductHome :products="products.data" class="pt-[10px]"/>
                        <!-- navigation -->
                        <div class="navigate w-full flex items-center justify-between pt-[10px]">
                            <div>
                                <button class="px-[8px] py-[4px] rounded-md border bg-[#4bb543]
                                text-white text-sm whitespace-nowrap transition-all" @click="set_page(1)">
                                    <font-awesome-icon icon="rotate-right" color="rgba(#fff,0.5)"  />
                                    Làm mới
                                </button>
                            </div>
                            <ul class="flex gap-[4px]">
                                <li v-if="list_page > 3" class="whitespace-nowrap text-sm" @click="set_page(1)">
                                    Trang đầu
                                </li>
                                <p v-if="list_page > 3" class="whitespace-nowrap">
                                    ...
                                </p>
                                <li v-if="list_page > 1" @click="set_page(list_page-1)">
                                    {{ list_page - 1 }}
                                </li>
                                <li class="bg-[#f0f0f1]">
                                    {{ list_page }}
                                </li>
                                <li v-if="list_page < total_page" @click="set_page(list_page+1)">
                                    {{ list_page + 1 }}
                                </li>
                                <li v-if="list_page < total_page-2" @click="set_page(list_page+2)">
                                    {{ list_page + 2 }}
                                </li>
                                <p v-if="list_page < total_page - 2" class="whitespace-nowrap">
                                    ...
                                </p>
                                <li v-if="list_page < total_page" class="whitespace-nowrap text-sm" @click="set_page(total_page)">
                                    Trang cuối
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="px-[10%] pt-[30px] mobile:px-1">
                    <div class="p-[10px] shadow-lg rounded-lg border-[1px] mobile:p-0 mobile:border-none">
                        <p class="title text-lg pb-[10px] border-b-[1px]">
                            Sản phẩm giá tốt
                        </p>
                        <ProductHome :products="good_products" class="pt-[10px]"/>
                    </div>
                </div>
                <div class="contact fixed bottom-[20px] rounded-lg shadow-lg
                xl:right-[20px] lg:right-[20px] md:right-[20px] sm:right-[10px] mobile:right-[10px]
                mobile:hidden">
                    <p class="text-white">
                        Liên hệ
                    </p>
                    <div class="mobile:flex items-center justify-between">
                        <a href="https://www.facebook.com/le.cuong.104855" target="_blank" rel="noopener noreferrer">
                            <div class="flex items-center gap-[4px]">
                                <img src="@@/zalo.png" alt="" class="w-[70px] mobile:w-[50px]">
                            </div>
                        </a>
                        <a href="https://www.facebook.com/le.cuong.104855" target="_blank" rel="noopener noreferrer">
                            <div class="flex items-center gap-[4px]">
                                <img src="@@/facebook.png" alt="" class="w-[60px] mobile:w-[50px]">
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </template>
    </HomeLayout>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import HomeLayout from '../../layouts/HomeLayout.vue';
import ProductHome from '../../components/home/ProductHome.vue';
import TextField from '../../components/TextField.vue';
import CarouselComponent from '../../components/home/CarouselComponent.vue';
import { useStore } from 'vuex';

export default defineComponent ({
    components: { HomeLayout, ProductHome, TextField, CarouselComponent },

    setup() {
        const store = useStore();
        var products = ref([]);
        var good_products = ref([]);
        const product = reactive({
            name: '',
            page: 1
        });
        var list_page = ref();
        var total_page = ref();
        const label_name = ref('Tìm theo tên');
        var timeOutId = null;

        onMounted(async () => {
            await store.dispatch('product/getProducts', 1).then(() => {
                products.value = store.getters['product/recent_products'];
                list_page.value = products.value.current_page;
                total_page.value = products.value.last_page;
            });

            await store.dispatch('product/getGoodProducts', {page:1, option: 'good', limit:8})
            .then(() => {
                good_products.value = store.getters['product/good_products'];
            })
        })

        watch( () => store.getters['product/recent_search_products'], () => {
            products.value = store.getters['product/recent_search_products'];
            list_page.value = products.value.current_page;
            total_page.value = products.value.last_page;
        })

        watch( () => product.name, () => {
            clearTimeout(timeOutId);
            timeOutId = setTimeout( () => {
                store.dispatch('product/searchProduct', {name: product.name})
            }, 1500);
        },
        {
            immediate: false,
            deep: false,
        })

        const search = async () => {
            await store.dispatch('product/searchProduct', {name: product.name}).then(() => {
                products.value = store.getters['product/recent_search_products'];
                list_page.value = products.value.current_page;
                total_page.value = products.value.last_page;
            })
        }

        const clearInput = () => {
            product.name = '';
        }

        const set_page = async (page) => {
            await store.dispatch('product/getProducts',page).then(() => {
                var  response = store.getters['product/recent_products'];
                products.value = response;
                list_page.value = response.current_page;
                total_page.value = response.last_page;
            });
        }

        return {
            products, search, product, label_name, clearInput, set_page,
            list_page, total_page, good_products
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
    font-size:x-large;
    font-weight: 700;
}

.contact {
    background: -webkit-linear-gradient(90deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 20%, rgba(0,212,255,1) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
</style>
