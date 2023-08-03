<template>
    <div class="w-full p-[10px]
    border rounded-lg" v-if="loaded">
        <div class="w-full flex justify-between items-center pb-[5px]">
            <div>
                <p class="section_title text-[20px] font-bold">
                    Các thương hiệu
                </p>
            </div>
            <div class="flex justify-center items-center">
                <button class="px-[10px] py-[5px] bg-[var(--main-color)]
                border-solid border-[1px] border-[#f0f0f1] rounded-md
                text-white
                hover:ring-[4px] hover:ring-[var(--ring-blue)] hover:border-[var(--ring-blue)]"
                v-if="route.name == 'dashboard'" @click="redirect_to('products')">
                    Xem thêm
                </button>
                <div v-else class="flex gap-[10px]">
                    <button class="px-[10px] py-[5px] bg-[var(--main-color)]
                    border-solid border-[1px] border-[#f0f0f1] rounded-md
                    text-white text-sm flex items-center gap-1
                    hover:ring-[4px] hover:ring-[var(--ring-blue)] hover:border-[var(--ring-blue)]"
                    @click="show_add_brand = !show_add_brand">
                        <font-awesome-icon icon="plus" color="rgba(#fff,0.5)"  />
                        <p class="mobile:hidden">
                            Thêm mới
                        </p>
                    </button>
                </div>
            </div>
        </div>
        <hr>
        <div class="py-[10px]" id="add_brand_toggle" v-if="show_add_brand">
            <form @submit.prevent="submit" class="flex items-center gap-[10px]">
                <div class="w-full">
                    <TextField :value="new_brand.name" :placeholder="label_name" @update:value="new_brand.name = $event"/>
                    <FormError v-if="errors['name']" :error="errors['name'][0]" />
                </div>

                <button class="btn_submit bg-[#4bb543]">
                    Thêm
                </button>
            </form>
        </div>

        <hr>

        <!-- table of brands -->
        <div class="w-full pt-[10px]">
            <table class="w-full">
                <thead class="border-b-[1px] border-solid border-[#f0f0f1]
                py-[10px]">
                    <th> Số thứ tự </th>
                    <th class="whitespace-nowrap">Mã thương hiệu</th>
                    <th>Tên thương hiệu</th>
                    <th>Số sản phẩm</th>
                    <th>Hành động</th>
                </thead>
                <tbody class="text-center text-[14px] leading-[20px]">
                    <tr v-for="(brand, index) in brands" :key="brand.id" class="text-center">
                        <td>{{index + 1}}</td>
                        <td>
                            BRANDS - {{ brand.id }}
                        </td>
                        <td>
                            <p v-if="brand.name.length < 30">
                                {{ brand.name }}
                            </p>
                            <p v-else>
                                {{ brand.name.slice(0,30) }}...
                            </p>
                        </td>
                        <td>
                            {{ brand.products.length }}
                        </td>
                        <td>
                            <button class="px-[8px] py-[4px] rounded-md border bg-[var(--main-dark-color)]
                             text-white w-fit transition-all" @click="showDetail(brand.id)">
                                <font-awesome-icon icon="pen-to-square" color="rgba(#fff,0.5)"  />
                            </button>
                            <button class="px-[8px] py-[4px] rounded-md border bg-[red]
                             text-white w-fit transition-all"
                            @click="deleteBrand(brand.id)">
                                <font-awesome-icon icon="trash" color="rgba(#fff,0.5)"  />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
    import { computed, defineComponent, onMounted, onUpdated, reactive, ref, watch } from 'vue'
    import router from '../../router';
    import { useStore } from 'vuex'
    import ProductDetail from '../../views/product/ProductDetail.vue';
    import TextField from '../TextField.vue';
    import FormError from '../../components/FormError.vue';
    import { RouterView, useRoute } from 'vue-router';
    import { Select, initTE } from "tw-elements";
	initTE({ Select });

    export default defineComponent({
        components: { ProductDetail, TextField, FormError },
        setup() {
            const loaded = ref(true);
            const store = useStore();
            const route = useRoute();
            const brands = ref([]);
            const errors = computed(() => store.getters['brand/errors']);
            const new_brand = reactive({
                name: '',
            });
            const label_name = ref('Tên thương hiệu')
            const show_add_brand = ref(false);

            onMounted( async () => {
                store.dispatch('brand/getBrands').then((result) => {
                    brands.value = store.getters['brand/brands'];
                });
            });

            const deleteBrand = async (id) => {
                if (confirm('Bạn có muốn hủy đơn này không ?')) {
                    // loaded.value = false;
                    await store.dispatch('brand/deleteBrand', [id]).then(() => {
                        brands.value = store.getters['brand/brands'];
                        // loaded.value = true;
                    })
                }
            };

            const showDetail = (id) => {
                router.push({ path: 'brand_details', query: { id: id }})
            };

            const submit = async () => {
                await store.dispatch('brand/createBrand', new_brand).then(() => {
                    loaded.value = false;
                    brands.value = store.getters['brand/brands'];
                    new_brand.name = '';
                    loaded.value = true;
                })
            };

            return {
                loaded, route, brands, showDetail, deleteBrand, errors,
                new_brand, submit, label_name, show_add_brand
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
</style>
