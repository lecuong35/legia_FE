<template>
    <section :id="'bill'+bill.id"
    @blur="hidden_modal('bill'+bill.id)"
    class="px-[10%] my-[30px] mobile:mt-[50px] mobile:px-1">
        <div class="bill_modal  border-[1px] rounded-lg shadow-lg p-[10px]">
            <div class="pb-[16px] flex items-center gap-[80px]">
                <font-awesome-icon icon="arrow-left" color="rgba(9,9,121,0.65)" class="hidden mobile:block"
                @click="$router.go(-1)" />
                <p class="font-bold title">CHI TIẾT ĐƠN HÀNG {{bill.id}}</p>
            </div>
            <hr>
            <div class="text-left pt-[10px]">
                <div>
                    Khách hàng: {{bill.user.name}}
                </div>
                <div class="flex items-start
                xl:flex-row lg:flex-row md:flex-row sm:flex-col mobile:flex-col">
                    <div class="basis-1/2 pr-[5px]
                    sm:border-l-0 mobile:border-l-0 xl:border-r-[1px] lg:border-r-[1px] md:border-r-[1px]">
                        <div class="pb-[4px] title font-bold text-lg">
                            Các sản phẩm
                        </div>
                        <div>
                            <div v-for="( product, index ) in bill.products" :key="product.id"
                            class="flex items-center gap-[8px] pb-[10px]">
                                <img :src="getImageUrl(product.images[0])" alt=""
                                class="max-w-[160px] rounded-md">
                                <div>
                                    <p>
                                        Tên sản phẩm: <span>{{product.name.toUpperCase()}}</span>
                                    </p>
                                    <p>
                                        Giá: <span> {{ product.price.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }) }} </span>
                                    </p>
                                    <p class="whitespace-nowrap">
                                        Số lượng: <span>{{ bill.cart_items[index].quantity }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="basis-1/2 pl-[5px]">
                        <p class="title font-bold text-lg pb-[10px]">
                            Thông tin đơn hàng
                        </p>
                        <div class="whitespace-nowrap pb-[4px]">Thời gian đặt hàng: {{bill.updated_at}}</div>
                        <div class="whitespace-normal pb-[4px]">
                            <p>Địa chỉ nhận hàng:
                                <span>
                                    {{ bill.address }}
                                </span>
                            </p>
                        </div>
                        <div class="whitespace-normal pb-[4px]">
                            <p>Số điện thoại khách hàng:
                                <span>
                                    {{ bill.customer_phone }}
                                </span>
                            </p>
                        </div>
                        <div class="flex gap-[5px] whitespace-nowrap pb-[4px]">
                            <p>Tình trạng đơn hàng: </p>
                            <p class="text-[var(--primary-red)]">
                                {{ status }}
                            </p>
                        </div>

                        <div class="flex gap-[5px] pb-[4px]">
                            <p>Voucher:</p>
                            <div v-if="bill.voucher_id != null">
                                {{(100 - bill.voucher.value*100)}}%
                            </div>
                            <div v-else class="text-[var(--primary-red)]">Không áp dụng voucher</div>
                        </div>
                        <div class="pb-[10px]">Tổng đơn hàng: {{bill.total}}</div>
                    </div>
                </div>
                <hr>
                <div v-if="errors.length > 0">
                    <div v-for="error in errors">
                        <p class="text-sm text-red-500">
                            {{ error.product.name }} <span> thiếu </span> {{ error.missing_quantity }} <span> sản phẩm</span>
                        </p>
                    </div>
                    <hr class="pb-[10px]">
                </div>
                <div class="pt-[16px] flex justify-end gap-[16px]">
                    <button v-if="bill.status == 'PENDING' && admin != null" class="px-[8px] py-[4px] rounded-md border bg-[#4bb543]
                    text-white whitespace-nowrap" @click="handle_bill(bill.id, bill, 'APPROVED')">
                        <font-awesome-icon icon="check" color="rgba(#fff,0.5)"  />
                    </button>
                    <button  v-if="bill.status == 'PENDING'" class="px-[8px] py-[4px] rounded-md border bg-[var(--primary-red)] text-white"
                    @click="handle_bill(bill.id, bill, 'CANCELLED')">
                        <font-awesome-icon icon="trash" color="rgba(#fff,0.5)"  />
                    </button>
                    <button  v-if="bill.status == 'APPROVED' && admin != null" class="px-[8px] py-[4px] rounded-md border bg-[#4bb543] text-white"
                    @click="handle_bill(bill.id, bill, 'DONE')">
                        <font-awesome-icon icon="clipboard-check" color="rgba(#fff,0.5)"  />
                    </button>
                    <a :href="export_link" target="_blank" v-if="bill.status == 'APPROVED'">
                        <button class="px-[8px] py-[4px] rounded-md border bg-[var(--primary-blue)] text-white"
                            @click="export_bill()">
                                <font-awesome-icon icon="print" color="rgba(#fff,0.5)"  />
                        </button>
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import { defineComponent, onMounted, ref } from 'vue'
    import { useStore } from 'vuex'
    import base_url from '../../store/base_url';
    import ls from 'localstorage-slim';

    export default defineComponent({
        props: ['bill'],

        setup(props) {
            const store = useStore();
            var errors = ref([]);
            const status = ref();
            const export_link = ref('http://127.0.0.1:8000/api/bills/'+ props.bill.id + '/export');
            var admin = ref([]);
            admin.value = ls.get('token_admin');
            switch (props.bill.status) {
                case 'PENDING':
                    status.value = 'Chưa xác nhận'
                    break;
                case 'APPROVED':
                    status.value = 'Chưa giao hàng'
                break;
                case 'CANCELLED':
                    status.value = 'Đã bị hủy'
                break;
                case 'DONE':
                    status.value = 'Đã hoàn thành'
                break;
                default:
                    break;
            }
            const hidden_modal = (id) => {
                var ele = document.getElementById(id);
                ele.style.display = 'none';
            };

            const handle_bill = async (id, bill, target_status) => {
                //(id, bill, target_status);
                await store.dispatch('bill/handleBill', [id, bill, target_status]).then(() => {
                    errors.value = store.getters['bill/errors'];
                });
                hidden_modal(id);
            };


            const export_bill = () => {
                store.dispatch('bill/exportBill', props.bill.id);
            }

            const getImageUrl = (image) => {
                return `data:${image.type};base64,${image.data}`;
            };

            return {
                hidden_modal, handle_bill, status, export_bill, export_link, getImageUrl, errors, admin
            }
        }
    })
</script>

<style scoped>
    .title {
        background: -webkit-linear-gradient(270deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 20%, rgba(0,212,255,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>
