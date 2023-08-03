<template>
    <div class="w-full p-[10px]
    border rounded-lg" v-if="loaded">
        <div class="w-full flex justify-between items-center pb-[5px]">
            <div>
                <p class="section_title text-[20px] font-bold">
                    Các mã giảm giá
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
                    text-white
                    hover:ring-[4px] hover:ring-[var(--ring-blue)] hover:border-[var(--ring-blue)]"
                    @click="redirect_to('add_voucher')">
                        <font-awesome-icon icon="plus" color="rgba(#fff,0.5)"  />
                        Tạo mới
                    </button>
                </div>
            </div>
        </div>

        <hr v-if="route.name != 'dashboard'">
        <div v-if="route.name != 'dashboard'" class="search py-[10px]">
            <div>
                <form @submit.prevent="search" class="w-full flex items-center justify-between gap-1">
                    <TextField :value="params.name" :placeholder="label_name" @update:value="params.name = $event"/>
                    <button type="submit"
                    class="whitespace-nowrap px-[10px] py-[5px] rounded-md bg-[#4bb543] text-white">
                        Tìm kiếm
                    </button>
                </form>

            </div>
        </div>

        <hr>

        <!-- table of product -->
        <div class="w-full pt-[10px]">
            <table class="w-full">
                <thead class="border-b-[1px] border-solid border-[#f0f0f1]
                py-[10px]">
                    <th class="xl:block lg:block md:hidden sm:hidden mobile:hidden">ID</th>
                    <th>Tên mã giảm giá</th>
                    <th>Chỉ số</th>
                    <th class="xl:block lg:block md:hidden sm:hidden mobile:hidden">Ngày bắt đầu</th>
                    <th class="mobile:hidden">Ngày hết hạn</th>
                    <th class="mobile:hidden">Giá trị điều kiện</th>
                    <th>Hành động</th>
                </thead>
                <tbody class="text-center text-[14px] leading-[20px]">
                    <tr v-for="voucher in vouchers" :key="voucher.id" class="text-[14px] text-center">
                        <td class="text-[14px]
                        xl:block lg:block md:hidden sm:hidden mobile:hidden">{{voucher.id}}</td>
                        <td>
                            <p v-if="voucher.name.length < 30">
                                {{ voucher.name }}
                            </p>
                            <p v-else>
                                {{ voucher.name.slice(0,30) }}...
                            </p>
                        </td>
                        <td>
                            {{ voucher.value }}
                        </td>
                        <td class="xl:block lg:block md:hidden sm:hidden mobile:hidden">
                            {{ voucher.start_date }}
                        </td>
                        <td class="mobile:hidden">{{voucher.end_date}}</td>
                        <td class="mobile:hidden">
                            {{
                                voucher.value_condition.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                })
                            }}
                        </td>
                        <td>
                            <button class="px-[8px] py-[4px] rounded-md border bg-[var(--main-dark-color)]
                             text-white w-fit transition-all"
                            @click="showDetail(voucher.id)">
                                <font-awesome-icon icon="pen-to-square" color="rgba(#fff,0.5)"  />
                            </button>
                            <button class="px-[8px] py-[4px] rounded-md border bg-[red]
                             text-white w-fit transition-all"
                            @click="deleteVoucher(voucher.id)">
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
                    <li v-if="list_page > 3" class="whitespace-nowrap" @click="set_page(1)">
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
                    <li v-if="list_page < total_page" class="whitespace-nowrap" @click="set_page(total_page)">
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
            const store = useStore();
            const route = useRoute();
            const vouchers = ref([]);
            const list_page = ref(0);
            const total_page = ref(1);
            const voucher = ref();

            const label_name = ref('Tìm kiếm mã giảm giá');

            const params = reactive({
               name: '',
               page: 1
            });

            onMounted( async () => {
                await store.dispatch('voucher/getVouchers', 1).then(() => {
                    var  response = store.getters['voucher/recent_vouchers'];
                    vouchers.value = response.data;
                    list_page.value = response.current_page;
                    total_page.value = response.last_page;
                });
            });

            const deleteVoucher = async (id) => {
                if (confirm('Bạn có muốn hủy đơn này không ?')) {
                    await store.dispatch('voucher/deleteVoucher', id).then(() => {
                        set_page(list_page.value)
                    });
                }
            };

            const set_page = async (page) => {
                await store.dispatch('voucher/getVouchers', page).then(() => {
                    var  response = store.getters['voucher/recent_vouchers'];
                    vouchers.value = response.data;
                    list_page.value = response.current_page;
                    total_page.value = response.last_page;
                });
            };

            const showDetail = (id) => {
                router.push({ path: 'voucher_details', query: { id: id }})
            };

            const redirect_to = (name) => {
                router.push({ name: name})
            };

            const search = async () => {
                await store.dispatch('voucher/searchVoucher', params).then(() => {
                    var  response = store.getters['voucher/recent_search_vouchers'];
                    vouchers.value = response.data;
                    list_page.value = response.current_page;
                    total_page.value = response.last_page;

                    params.name = '';
                });
            }

            return {
                vouchers, list_page, total_page, set_page, showDetail,
                deleteVoucher, loaded, route, redirect_to,
                params, label_name, search
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
