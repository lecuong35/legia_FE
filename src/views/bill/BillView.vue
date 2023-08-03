<template>
    <!-- <div class="w-full flex
    xl:flex-row lg:flex-row md:flex-row sm:flex-col mobile:flex-col"
    v-if="loaded">
        <div class="basis-1/5 sticky top-0">
            <div class="sticky top-0">
                <NavbarAdmin />
            </div>
        </div>
        <div class="basis-4/5 py-[20px] overflow-y-auto">
            <div class="xl:px-[20px] lg:px-[20px] md:px-[20px] sm:px-[5px] mobile:px-[5px]">
                <RecentBill />
            </div>
        </div>
    </div> -->
    <AdminLayout>
        <template v-slot:content>
            <RecentBill />
        </template>
    </AdminLayout>

</template>

<script>
    import { defineComponent, onBeforeMount, onMounted, ref } from 'vue'
    import { useStore } from 'vuex';
    import NavbarAdmin from '../../components/admin/NavbarAdmin.vue';
    import RecentBill from '../../components/bill/RecentBill.vue';
    import AdminLayout from '../../layouts/AdminLayout.vue';
    import router from '../../router';
    import { useToast } from 'vue-toastification';

    export default defineComponent({
        components: { NavbarAdmin, RecentBill, AdminLayout },

        setup() {
            const store = useStore();
            const loaded = ref(false);
            const toast = useToast();

            const pending_bills = ref([]);
            const done_bills = ref([]);
            const approved_bills = ref([]);
            const cancelled_bills = ref([]);

            onBeforeMount(() => {
                const admin_token = store.getters['admin/token'];
                loaded.value = admin_token == null? false : true;

                if (!loaded.value) {
                    router.push({name: 'admin_login'});
                    toast.error('Bạn chưa đăng nhập !', {timeout: 2000});
                }
            });

            // onMounted(() => {
            //     store.dispatch('bill/getBills', ['null', 1, 'all']).then(() => {
            //         pending_bills.value = store.getters['bill/recent_pending_bills'];
            //         done_bills.value = store.getters['bill//recent_done_bills'];
            //         approved_bills.value = store.getters['bill//recent_approved_bills'];
            //         cancelled_bills.value = store.getters['bill//recent_cancelled_bills'];

            //         console.log(pending_bills.value);
            //     });
            // })

            return {
                loaded, pending_bills, cancelled_bills, approved_bills, done_bills,
            }

        }

    })
</script>

<style scoped>
    #product_toggle {
        background-color: rgba(255,255,255,0.5);
    }
</style>
