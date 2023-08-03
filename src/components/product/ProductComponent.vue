<template>
    <div class="w-full p-[10px]
    border rounded-lg" v-if="loaded">
        <div class="w-full flex justify-between items-center pb-[5px]">
            <div>
                <p class="section_title text-[20px] font-bold">
                    Các sản phẩm trong kho
                </p>
            </div>
            <div class="flex justify-center items-center">
                <button class="px-[10px] py-[5px] bg-[var(--main-color)]
                border-solid border-[1px] border-[#f0f0f1] rounded-md
                text-white text-sm flex gap-[4px] items-center
                hover:ring-[4px] hover:ring-[var(--ring-blue)] hover:border-[var(--ring-blue)]"
                v-if="route.name == 'dashboard'" @click="redirect_to('products')">
                    <font-awesome-icon icon="circle-info" color="rgba(#fff,0.5)"  />
                    <p class="mobile:hidden text-sm">
                        Xem thêm
                    </p>
                </button>
                <div v-else class="flex gap-[10px]">
                    <button class="px-[10px] py-[5px] bg-[var(--main-color)]
                    border-solid border-[1px] border-[#f0f0f1] rounded-md
                    text-white text-sm
                    hover:ring-[4px] hover:ring-[var(--ring-blue)] hover:border-[var(--ring-blue)]"
                    @click="redirect_to('add_product')">
                        <font-awesome-icon icon="plus" color="rgba(#fff,0.5)"  />
                        Tạo mới
                    </button>
                    <button class="px-[10px] py-[5px] bg-[var(--main-color)]
                    border-solid border-[1px] border-[#f0f0f1] rounded-md
                    text-white text-sm
                    hover:ring-[4px] hover:ring-[var(--ring-blue)] hover:border-[var(--ring-blue)]"
                    @click="import_click = !import_click">
                        <font-awesome-icon icon="file-import" color="rgba(#fff,0.5)"  />
                        Nhập hàng
                    </button>
                </div>
            </div>
        </div>
        <hr v-if="import_click">
        <div class="flex items-center justify-end py-[10px]" v-if="import_click">
            <form enctype="multipart/form-data"
            @submit.prevent="submit">
                <label for="import" class="hidden"> Chọn file </label>
                <input type="file" accept=".xls,.xlsx" id="import" @change="getFile" />
                <button type="submit" class="btn_submit bg-[#4bb543]">
                   Nhập hàng
                </button>
            </form>
        </div>

        <hr v-if="route.name != 'dashboard'">
        <div v-if="route.name != 'dashboard'" class="search py-[10px]">
            <div>
                <form @submit.prevent="search"
                class="w-full flex items-center justify-between gap-1
                xl:flex-row lg:flex-row md:flex-col sm:flex-col mobile:flex-col">
                    <TextField :value="params.code" :placeholder="label_name" @update:value="params.code = $event"/>
                    <div class="flex items-center justify-between gap-1 w-full">
                        <div class="input_item w-full">
                            <select class="text-sm"
                            name="category" v-model="params.category">
                                <option value="">Loại sản phẩm</option>
                                <option v-for="ca in categories" :key="ca.id" :value="ca.id" >
                                    {{ ca.name }}
                                </option>
                            </select>
                        </div>

                        <div class="w-full">
                            <select class="text-sm"
                            name="brand" v-model="params.brand">
                                <option value="">Thương hiệu</option>
                                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                                    {{ brand.name }}
                                </option>
                            </select>
                        </div>
                        <button type="submit"
                        class="whitespace-nowrap px-[10px] py-[5px] rounded-md bg-[#4bb543] text-white text-sm">
                            Tìm kiếm
                        </button>
                    </div>
                </form>

            </div>
        </div>

        <hr>

        <!-- table of product -->
        <div class="w-full pt-[10px]">
            <table class="w-full">
                <thead class="border-b-[1px] border-solid border-[#f0f0f1]
                py-[10px]">
                    <th class="xl:block lg:block md:hidden sm:hidden mobile:hidden">Mã sản phẩm</th>
                    <th class="mobile:hidden">Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th class="mobile:hidden">Thương hiệu</th>
                    <th class="xl:block lg:block md:hidden sm:hidden mobile:hidden">Loại hàng</th>
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
                        <td class="mobile:hidden">
                            {{ product.brand.name }}
                        </td>
                        <td class="xl:table-cell lg:table-cell md:hidden sm:hidden mobile:hidden">
                            {{ product.category.name.slice(9) }}
                        </td>
                        <td>{{product.locale_price}}</td>
                        <td class="mobile:hidden">{{product.quantity}}</td>
                        <td>
                            <button class="px-[8px] py-[4px] rounded-md border bg-[var(--main-dark-color)]
                             text-white transition-all"
                            @click="showDetail(product.id)">
                                <font-awesome-icon icon="pen-to-square" color="rgba(#fff,0.5)"  />
                            </button>
                            <button class="px-[8px] py-[4px] rounded-md border bg-[red]
                             text-white transition-all"
                            @click="deleteProduct(product.id)">
                                <font-awesome-icon icon="trash" color="rgba(#fff,0.5)"  />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- navigation -->
            <div class="w-full flex items-center justify-between pt-[10px]">
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
</template>
<script>
    import { defineComponent, onMounted, onUpdated, reactive, ref, watch } from 'vue'
    import router from '../../router';
    import { useStore } from 'vuex'
    import ProductDetail from '../../views/product/ProductDetail.vue';
    import TextField from '../TextField.vue';
    import { RouterView, useRoute } from 'vue-router';
    import { Select, initTE } from "tw-elements";
	initTE({ Select });

    export default defineComponent({
        components: { ProductDetail, TextField },
        setup() {
            const loaded = ref(true);
            const import_click = ref(false);
            const store = useStore();
            const route = useRoute();
            const products = ref([]);
            const list_page = ref(0);
            const total_page = ref(1);
            const brands = ref([]);
            const categories = ref([]);
            const product = ref();

            const label_name = ref('Tìm kiếm sản phẩm');

            const params = reactive({
                code: '',
                category: '',
                brand: '',
                page: 1,
            });

            onMounted( async () => {
                await store.dispatch('product/getProducts', 1).then(() => {
                    var  response = store.getters['product/recent_products'];
                    products.value = response.data;
                    list_page.value = response.current_page;
                    total_page.value = response.last_page;
                });
                store.dispatch('brand/getBrands', 100).then(() => {
                    brands.value = store.getters['brand/brands'];
                });
                store.dispatch('category/getCategories', 100).then(() => {
                    categories.value = store.getters['category/categories'];
                });
            });

            const hidden_modal = (id) => {
                var ele = document.getElementById(id);
                ele.style.display = 'block';
            };

            const deleteProduct = async (id) => {
                if (confirm('Bạn có muốn hủy đơn này không ?')) {
                    await store.dispatch('product/deleteProduct', id).then(() => {
                        set_page(list_page.value)
                    });
                }
            };

            const set_page = async (page) => {
                await store.dispatch('product/getProducts', page).then(() => {
                    var  response = store.getters['product/recent_products'];
                    products.value = response.data;
                    list_page.value = response.current_page;
                    total_page.value = response.last_page;
                });
            };

            const getImageUrl = (image) => {
                return `data:${image.type};base64,${image.data}`;
            };

            const showDetail = (id) => {
                router.push({ path: 'product_details', query: { id: id }})
            };

            const redirect_to = (name) => {
                router.push({ name: name})
            };

            const getFile = () => {
                var ele = document.getElementById("import");
                product.value = ele.files[0];
            };
            const submit = async () => {
				const form_data = new FormData();
				form_data.append("product", product.value);
				await store.dispatch('product/importProduct', form_data).then(() => {
                    set_page(list_page.value)
                });
			};

            const search = async () => {
                await store.dispatch('product/searchProduct', params).then(() => {
                    var  response = store.getters['product/recent_search_products'];
                    products.value = response.data;
                    list_page.value = response.current_page;
                    total_page.value = response.last_page;

                    params.code = '';
                    params.brand = '';
                    params.category = '';
                });
            }

            return {
                products, list_page, total_page, set_page, hidden_modal, getImageUrl, showDetail,
                brands, categories, deleteProduct, loaded, route, redirect_to, import_click, submit,
                getFile, params, label_name, search
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

    .section_title {
        background: -webkit-linear-gradient(270deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 20%, rgba(0,212,255,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

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

    select {
        padding: 5px 10px;
    }
</style>
