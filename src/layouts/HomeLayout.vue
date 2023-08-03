<template>
    <div>
        <div class="header bg-white z-10 text-white
        mobile:fixed mobile:w-fit whitespace-nowrap
        mobile:right-0 mobile:top-[36px]">
            <NavbarComponent :user="user" :categories="categories" :brands="brands"/>
        </div>
        <div class="content">
            <slot name="content"></slot>
        </div>
        <div class="footer">
            <FooterComponent />
        </div>
    </div>
</template>
<script>
    import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
    import { useStore } from 'vuex';
    import FooterComponent from '../components/home/FooterComponent.vue';
    import NavbarComponent from '../components/home/NavbarComponent.vue';

    export default defineComponent({
        components: { NavbarComponent, FooterComponent },

        setup() {
            const store = useStore();
            const loaded = ref(false);
            var user = reactive({});
            var categories = ref([]);
            var brands = ref([]);
            var products = ref([]);

            onMounted(async () => {
                user = store.getters['user/user'];
                await store.dispatch('brand/getBrands').then(() => {
                    brands.value = store.getters['brand/brands'];
                });

                await store.dispatch('category/getCategories').then(() => {
                    categories.value = store.getters['category/categories'];
                });

                loaded.value = true;
            })

            return {
                user, categories, brands, loaded, products,
            }
        }
    });
</script>
<style scoped>
</style>
