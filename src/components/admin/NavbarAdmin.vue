<template>
    <div class="wrapper xl:block lg:block md:block sm:flex mobile:flex justify-between items-center
    xl:h-screen lg:h-screen md:h-screen relative">
        <!-- logo -->
        <div class="flex items-center gap-[5px] px-[10px] py-[10px] hover:cursor-pointer" @click="redirect_to('home')">
            <div>
                <img src="@@/favicon_logo.png" alt="logo"
                class="xl:w-[65px] lg:w-[65px] md:w-[65px] sm:w-[30px] mobile:w-[30px]">
            </div>
            <div class="xl:block lg:block md:block sm:flex mobile:flex
            justify-center items-end">
                <p class="logo_title text-2xl font-bold text-white">
                    Lê Gia
                </p>
                <p class="logo_autoparts text-[rgba(255,255,255,0.85)] font-bold pl-[16px]">Autoparts</p>
            </div>
        </div>

        <hr class="xl:block lg:block md:block sm:hidden mobile:hidden">

        <!-- toggle list -->
        <div class="xl:block lg:block md:block sm:hidden mobile:hidden" id="toggle_list">
            <ToggleMenuItem :item="dashboard" :icon="house" id="dashboard_toggle" :route_name="route_name.dashboard"/>
            <ToggleMenuItem :item="product" :icon="product_icon" id="product_toggle" :route_name="route_name.products"/>
            <div class="relative">
                <ToggleMenuItem :item="bill" :icon="bill_icon" id="bill_toggle" :route_name="route_name.bills"/>
                <div v-if="notifications.length > 0" class="absolute top-3 right-0">
                    <font-awesome-icon icon="envelope" color="red" />
                </div>
            </div>
            <ToggleMenuItem :item="brand" :icon="brand_icon" id="brand_toggle" :route_name="route_name.brands"/>
            <ToggleMenuItem :item="category" :icon="category_icon" id="category_toggle" :route_name="route_name.categories"/>
            <ToggleMenuItem :item="voucher" :icon="voucher_icon" id="voucher_toggle" :route_name="route_name.vouchers"/>
        </div>

        <!-- toggle icon -->
        <div class="xl:hidden lg:hidden md:hidden sm:flex mobile:flex mr-[10px]
        p-[2px] hover:bg-[rgba(255,255,255,0.25)] hover:cursor-pointer"
        @click="toggle_click('toggle_list')">
            <font-awesome-icon icon="bars"  color="#fff"/>
        </div>
    </div>
</template>

<script>
    import { defineComponent, ref, onMounted, reactive, onBeforeMount } from 'vue'
    import ToggleMenuItem from './ToggleMenuItem.vue';
    import { useStore } from 'vuex';
    import router from '../../router/index';
    import { useRoute } from 'vue-router';
import base_url from '../../store/base_url';
import { useToast } from 'vue-toastification';
    export default defineComponent({
        components: { ToggleMenuItem },

        setup() {
            const dashboard = ref('Dashboard');
            const route = useRoute();
            const toast = useToast();
            const route_name = reactive({
                dashboard: 'dashboard',
                products: 'products',
                bills: 'bills',
                brands: 'brands',
                categories: 'categories',
                vouchers: 'vouchers'
            })
            const product = ref('Sản phẩm');
            const bill = ref('Đơn hàng');
            const brand = ref('Thương hiệu');
            const category = ref('Loại sản phẩm');
            const voucher = ref('Mã giảm giá');

            const house = ref('house');
            const product_icon = ref('warehouse');
            const bill_icon = ref('truck-fast');
            const brand_icon = ref('landmark');
            const category_icon = ref('list');
            const voucher_icon = ref('gift');
            var notifications = ref([]);

            const toggle_click = (toggle_list) => {
                const toggle_block = document.getElementById(toggle_list);
                if(toggle_block.style.display == 'none') {
                    toggle_block.style.display = 'block';
                    toggle_block.style.position = 'absolute';
                    toggle_block.style.top = '52px';
                    toggle_block.style.right = '0px';
                    toggle_block.style.background = 'linear-gradient(0deg, rgba(2,0,36,0.75) 0% , rgba(9,9,121,1) 0%, rgba(0,212,255,1) 100%)';
                }
                else {
                    toggle_block.style.display = 'none';
                }
            }

            onBeforeMount(async () => {
                await base_url.adminNotifications().then((result) => {
                    notifications.value = result.data;
                });
                if (notifications.value.length > 0) {
                    toast.info("Có đơn hàng mới");
                }
            })

            onMounted(() => {
                if (route.name == 'dashboard') {
                    var ele = document.getElementById("dashboard_toggle");
                    ele.style.backgroundColor = "rgba(255,255,255,0.5)";
                }
                else if (route.name.includes('product')) {
                    var ele = document.getElementById("product_toggle");
                    ele.style.backgroundColor = "rgba(255,255,255,0.5)";
                }
                else if (route.name.includes('bill')) {
                    var ele = document.getElementById("bill_toggle");
                    ele.style.backgroundColor = "rgba(255,255,255,0.5)";
                }
                else if (route.name.includes('brand')) {
                    var ele = document.getElementById("brand_toggle");
                    ele.style.backgroundColor = "rgba(255,255,255,0.5)";
                }
                else if (route.name.includes('categor')) {
                    var ele = document.getElementById("category_toggle");
                    ele.style.backgroundColor = "rgba(255,255,255,0.5)";
                }
                else if (route.name.includes('voucher')) {
                    var ele = document.getElementById("voucher_toggle");
                    ele.style.backgroundColor = "rgba(255,255,255,0.5)";
                }
            });

            const redirect_to = (name) => {
                router.push({name: name});
            }

            return {
                dashboard, product, brand, category, voucher, bill,
                house, product_icon, bill_icon, brand_icon, category_icon, voucher_icon,
                toggle_click, route_name, notifications, redirect_to
            }
        }

    })
</script>

<style scoped>
    .wrapper {
        background: linear-gradient(0deg, rgba(2,0,36,0.75) 0% , rgba(9,9,121,1) 0%, rgba(0,212,255,1) 100%);
    }

    .logo_title {
        background: -webkit-linear-gradient(270deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 60%, rgba(0,212,255,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    @media (max-width: 768px) {
        .logo_title {
            background: -webkit-linear-gradient(0deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 70%, rgba(0,212,255,1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .logo_autoparts {
            padding-left: 10px;
        }
    }
</style>
