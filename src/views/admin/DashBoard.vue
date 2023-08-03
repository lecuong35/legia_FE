<template>
    <!-- <div v-if="loaded"
    class="w-full flex
    xl:flex-row lg:flex-row md:flex-row sm:flex-col mobile:flex-col">
        <div class="basis-1/5 sticky top-0">
            <div class="sticky top-0">
                <NavbarAdmin />
            </div>
        </div>
        <div class="basis-4/5 py-[20px] overflow-y-auto">
            <div class="px-[20px]">
                <ChartComponent/>
            </div>
            <div class="p-[20px]">
                <RecentBill />
            </div>
            <div class="px-[20px]">
                <ProductComponent />
            </div>
        </div>
    </div> -->
    <AdminLayout>
        <template v-slot:content>
            <div class="px-[20px]">
                <ChartComponent/>
            </div>
            <div class="p-[20px]">
                <RecentBill />
            </div>
            <div class="px-[20px]">
                <ProductComponent />
            </div>
        </template>
    </AdminLayout>
</template>

<script>
    import { defineComponent, onBeforeMount, onMounted, ref } from 'vue'
    import { useStore } from 'vuex';
    import NavbarAdmin from '../../components/admin/NavbarAdmin.vue';
    import RecentBill from '../../components/bill/RecentBill.vue';
    import ProductComponent from '../../components/product/ProductComponent.vue';
    import ChartComponent from '../../components/admin/ChartComponent.vue';
    import AdminLayout from '../../layouts/AdminLayout.vue';
    import router from '../../router';
    import { useToast } from 'vue-toastification';

    export default defineComponent({
        components: { NavbarAdmin, RecentBill, ProductComponent, ChartComponent, AdminLayout },

        setup() {
            const store = useStore();
            const loaded = ref(false);
            const toast = useToast();

            onBeforeMount(() => {
                const admin_token = store.getters['admin/token'];
                loaded.value = admin_token == null? false : true;

                if (!loaded.value) {
                    router.push({name: 'admin_login'});
                    toast.error('Bạn chưa đăng nhập !', {timeout: 2000});
                }
            });

            return {
                loaded,
            }

        }

    })
</script>

<style scoped>
    #dashboard_toggle {
        background-color: rgba(255,255,255,0.5);
    }
</style>
