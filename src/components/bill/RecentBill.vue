<template>
    <div class="w-full p-[10px]
    border rounded-lg" v-if="loaded">
        <div class="w-full flex justify-between items-center pb-[5px]">
            <div>
                <p v-if="in_dashboard"
                class="section_title text-[20px] font-bold">
                    Đơn hàng mới
                </p>
                <p v-else
                class="section_title text-[20px] font-bold">
                    Đơn hàng
                </p>
            </div>
            <div class="flex justify-center items-center">
                <div v-if="!in_dashboard">
                    <select v-model="status_bills" @change="reload">
                        <option value="PENDING">Chưa xác nhận</option>
                        <option value="APPROVED">Chưa giao hàng</option>
                        <option value="CANCELLED">Đã bị hủy</option>
                        <option value="DONE">Đã hoàn thành</option>
                    </select>
                </div>
                <button v-else
                class="px-[10px] py-[5px] bg-[var(--main-color)]
                border-solid border-[1px] border-[#f0f0f1] rounded-md
                text-white text-sm
                hover:ring-[4px] hover:ring-[var(--ring-blue)] hover:border-[var(--ring-blue)]"
                @click="redirect_to_page('bills')">
                    <font-awesome-icon icon="plus"   color="rgba(255,255,255,1)"/>
                    Xem thêm
                </button>
            </div>
        </div>

        <hr>

        <!-- table of bill -->
        <div class="w-full pt-[10px]">
            <table class="w-full" v-if="!no_record">
                <thead class="border-b-[1px] border-solid border-[#f0f0f1]
                py-[10px]">
                    <th class="mobile:hidden">Mã đơn</th>
                    <th class="mobile:hidden">Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th class="xl:table-cell lg:table-cell md:table-cell sm:hidden mobile:hidden">Ngày đặt</th>
                    <th class="xl:table-cell lg:table-cell md:table-cell sm:hidden mobile:hidden">Trạng thái</th>
                    <th>Tổng đơn</th>
                    <th>Hành động</th>
                </thead>
                <tbody class="text-center text-[14px] leading-[18px]">
                    <tr v-for="bill in bills" :key="bill.id"
                    :id="'bill'+bill.id">
                        <td class="mobile:hidden">{{bill.id}}</td>
                        <td class="mobile:hidden">{{bill.user.name}}</td>
                        <td>
                            <p class="whitespace-nowrap">
                                {{bills[0].products[0].name.slice(0,15)}}...
                                <span class="text-[10px]">
                                   x {{ bills[0].cart_items[0].quantity }}
                                </span>
                            </p>
                            <div v-if="bill.products[1]">
                               <p class="text-[10px] whitespace-nowrap"> + {{ bill.products.length - 1 }} sản phẩm khác</p>
                            </div>
                        </td>
                        <td class="xl:table-cell lg:table-cell md:table-cell sm:hidden mobile:hidden">{{bill.updated_at}}</td>
                        <td class="text-[var(--primary-red)]
                        xl:table-cell lg:table-cell md:table-cell sm:hidden mobile:hidden">
                            <p v-if="bill.status == 'PENDING'">
                                Chưa xác nhận
                            </p>
                            <p v-if="bill.status == 'APPROVED'">
                                Chưa giao hàng
                            </p>
                            <p v-if="bill.status == 'CANCELLED'">
                                Đã bị hủy
                            </p>
                            <p v-if="bill.status == 'DONE'">
                                Đã hoàn thành
                            </p>
                        </td>
                        <td>{{bill.total}}</td>
                        <td>
                            <button class="px-[8px] py-[4px] rounded-md border bg-[var(--main-dark-color)] text-white w-fit"
                            @click="hidden_modal(bill.id)">
                                <font-awesome-icon icon="pen-to-square" color="rgba(#fff,0.5)"  />
                            </button>
                            <button v-if="bill.status == 'PENDING'"
                            class="px-[8px] py-[4px] rounded-md border bg-[var(--primary-red)] text-white w-fit"
                            @click="cancel_bill(bill.id, bill)">
                                <font-awesome-icon icon="trash" color="rgba(#fff,0.5)"  />
                            </button>
                        </td>
                        <!-- <BillModal :bill="bill"/> -->
                    </tr>
                </tbody>
            </table>

            <!-- no bills -->
            <div class="w-full my-[10px]" v-else>
                <div class="w-full flex flex-col py-4 items-center justify-center">
                    <p class="title text-lg font-bold text-center">
                        Không có đơn hàng nào
                    </p>
                    <div class="flex items-center justify-center pt-[10px]">
                        <img src="https://groceryroute.com/package/images/no-product-img.png" alt="">
                    </div>
                </div>
            </div>

            <!-- navigation -->
            <div class="w-full flex items-center justify-end pt-[10px]">
                <ul class="flex gap-[4px]">
                    <li v-if="list_page > 3" class="whitespace-nowrap" @click="set_page(1)">
                        Trang dau
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
                        Trang cuoi
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import { defineComponent, onMounted, ref, toRaw, watch } from 'vue';
    import { useStore } from 'vuex';
    import { useRoute } from 'vue-router';
    import BillModal from './BillModal.vue';
import router from '../../router';

    export default defineComponent({
        components: { BillModal },
        setup() {
            const store = useStore();
            const route = useRoute();
            const in_dashboard = ref(false);
            if (route.name == 'dashboard') {
                in_dashboard.value = true;
            }
            const bills = ref([]);
            var no_record = ref(true);
            const list_page = ref(0);
            const total_page = ref(1);
            const status_bills = ref('PENDING');
            const loaded = ref(true);

            const redirect_to_page = (name) => {
                router.push({name: name});
            }

            onMounted(() => {
                store.dispatch('bill/getBills', [status_bills.value, 1])
                .then(() =>{
                    var response = [];
                    if(status_bills.value == 'PENDING') {
                        response = store.getters['bill/recent_pending_bills'];
                    }
                    else if (status_bills.value == 'APPROVED') {
                        response = store.getters['bill/recent_approved_bills'];
                    }
                    else if (status_bills.value == 'CANCELLED') {
                        response = store.getters['bill/recent_cancelled_bills'];
                    }
                    else if (status_bills.value == 'DONE') {
                        response = store.getters['bill/recent_done_bills'];
                    }

                    if (store.getters['bill/errors'] == null) no_record.value = false;

                    bills.value = response.data;
                    list_page.value = response.current_page;
                    total_page.value = response.last_page;
                });

            });

            const hidden_modal = (id) => {
                router.push({path: '../don-hang-cua-khach/' + id});
            };

            const hidden_tr = (id) => {
                var ele = document.getElementById(id);
                ele.style.display = 'none';
            }

            const cancel_bill = async (id, bill) => {
                if (confirm('Bạn có muốn hủy đơn này không ?')) {
                    await store.dispatch('bill/handleBill', [id, bill, 'CANCELLED']);
                    hidden_tr('bill'+id)
                }
            };

            const set_page = async (page) => {
                await store.dispatch('bill/getBills', [status_bills.value, page]);
                var  response = [];
                if(status_bills.value == 'PENDING') {
                    response = store.getters['bill/recent_pending_bills'];
                    console.log(response.data[0].products[0].name);
                }
                else if (status_bills.value == 'APPROVED') {
                    response = store.getters['bill/recent_approved_bills'];
                }
                else if (status_bills.value == 'CANCELLED') {
                    response = store.getters['bill/recent_cancelled_bills'];
                }
                else if (status_bills.value == 'DONE') {
                    response = store.getters['bill/recent_done_bills'];
                }
                bills.value = response.data;
                list_page.value = response.current_page;
            };

            const reload = () => {
                loaded.value = true;
                // console.log(loaded.value);
                // console.log(loaded.value);
                // loaded.value = true;
            };

            watch(status_bills, () => {
                no_record.value = false;
                store.commit('bill/SET_ERRORS', null);
                store.dispatch('bill/getBills', [status_bills.value, 1])
                .then(() =>{
                    var response = [];
                    if(status_bills.value == 'PENDING') {
                        response = store.getters['bill/recent_pending_bills'];
                        console.log(response.data[0].products[0].name);
                    }
                    else if (status_bills.value == 'APPROVED') {
                        response = store.getters['bill/recent_approved_bills'];
                    }
                    else if (status_bills.value == 'CANCELLED') {
                        response = store.getters['bill/recent_cancelled_bills'];
                    }
                    else if (status_bills.value == 'DONE') {
                        response = store.getters['bill/recent_done_bills'];
                    }
                    bills.value = response.data;
                    list_page.value = response.current_page;
                    total_page.value = response.last_page;

                    if (store.getters['bill/errors'] != null) no_record.value = true;
                });
            })

            return {
                bills, hidden_modal, cancel_bill, list_page, total_page, no_record,
                set_page, status_bills, reload, loaded, in_dashboard, redirect_to_page
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
