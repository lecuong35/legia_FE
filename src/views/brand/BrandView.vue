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
            <div class="xl:px-[20px] lg:px-[20px] md:px-[20px] sm:px-[5px] mobile:px-[5px]">
                <BrandComponent />
            </div>
        </div>
    </div> -->
    <AdminLayout>
        <template v-slot:content>
            <BrandComponent />
        </template>
    </AdminLayout>
</template>

<script>
    import { defineComponent, onBeforeMount, ref } from 'vue'
    import { useStore } from 'vuex';
    import NavbarAdmin from '../../components/admin/NavbarAdmin.vue';
    import ProductComponent from '../../components/product/ProductComponent.vue';
    import BrandComponent from '../../components/brand/BrandComponent.vue';
    import AdminLayout from '../../layouts/AdminLayout.vue';
    import router from '../../router';
    import { useToast } from 'vue-toastification';

    export default defineComponent({
        components: { NavbarAdmin, ProductComponent, BrandComponent, AdminLayout },

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
    #product_toggle {
        background-color: rgba(255,255,255,0.5);
    }
</style>
