<template>
	<!-- <div class="w-full flex
    xl:flex-row lg:flex-row md:flex-row sm:flex-col mobile:flex-col">
		<div class="basis-1/5 sticky top-0">
			<div class="sticky top-0">
                <NavbarAdmin />
            </div>
		</div>
		<div class="text-start basis-4/5" v-if="loaded">
			<div class="h-[100vh] bg-[rgba(255,255,255,1)]
			overflow-y-auto overflow-x-hidden">
				<div class="p-[8px] border-[1px] rounded-md shadow-md w-fit ml-[20px] mt-[10px]">
					<p class="link_item" @click="redirect_to('brands')">
						<font-awesome-icon icon="arrow-left"   />
						Quay lại
					</p>
				</div>

				<form class="p-[20px] mt-[10px]" @submit.prevent="submit()">
					<div class="product_infomation">
						<p class="section_title text-xl">
							Thông tin thương hiệu
						</p>
						<div class="flex flex-col gap-[20px] pt-[20px] border-t-[1px]">
                            <p>
                                Mã trong kho: <span>{{new_brand.id}}</span>
                            </p>
							<div class="input_item">
                                <TextField :value="new_brand.name" :placeholder="label_name" @update:value="new_brand.name = $event"/>
                                <FormError v-if="errors['name']" :error="errors['name'][0]" />
                            </div>
						</div>
                        <button type="submit"
                        class=" bg-[#4bb543] px-[10px] py-[5px] rounded-lg
                        text-white text-sm mt-[10px]">
                            Cập nhật
                        </button>
					</div>

				</form>

                <div class="images mx-[20px]">
                    <p class="section_title text-xl border-b-[1px] mb-[20px]">
                        Các sản phẩm thuộc thương hiệu này
                    </p>
                    <TableProduct :products="products" />
                </div>
			</div>
		</div>
	</div> -->
	<AdminLayout>
        <template v-slot:content v-if="loaded">
            <div>
                <div class="p-[8px] border-[1px] rounded-md shadow-md w-fit ml-[20px] mt-[10px]">
					<p class="link_item" @click="redirect_to('brands')">
						<font-awesome-icon icon="arrow-left"   />
						Quay lại
					</p>
				</div>

				<form class="p-[20px] mt-[10px]" @submit.prevent="submit()">
					<div class="product_infomation">
						<p class="section_title text-xl">
							Thông tin thương hiệu
						</p>
						<div class="flex flex-col gap-[20px] pt-[20px] border-t-[1px]">
                            <p>
                                Mã trong kho: <span>{{new_brand.id}}</span>
                            </p>
							<div class="input_item">
                                <TextField :value="new_brand.name" :placeholder="label_name" @update:value="new_brand.name = $event"/>
                                <FormError v-if="errors['name']" :error="errors['name'][0]" />
                            </div>
						</div>
                        <button type="submit"
                        class=" bg-[#4bb543] px-[10px] py-[5px] rounded-lg
                        text-white text-sm mt-[10px]">
                            Cập nhật
                        </button>
					</div>

				</form>

                <div class="images mx-[20px]">
                    <p class="section_title text-xl border-b-[1px] mb-[20px]">
                        Các sản phẩm thuộc thương hiệu này
                    </p>
                    <TableProduct :products="products" />
                </div>
            </div>
        </template>
    </AdminLayout>
</template>

<script>
	import { onBeforeMount, ref, computed, reactive, onMounted } from 'vue'
	import { useStore } from 'vuex';
	import NavbarAdmin from '../../components/admin/NavbarAdmin.vue';
	import ProductModal from '../../components/product/ProductModal.vue';
    import TableProduct from '../../components/product/TableProduct.vue';
	import FormError from '../../components/FormError.vue';
	import AdminLayout from '../../layouts/AdminLayout.vue';
	import { useToast } from 'vue-toastification';
	import router from '../../router';
	import TextField from '../../components/TextField.vue';
	import { useRoute } from 'vue-router';
	import { Select, initTE } from "tw-elements";
	initTE({ Select });

	export default {
		components: { NavbarAdmin, ProductModal, TextField, FormError, TableProduct, AdminLayout },

		setup() {
			const store = useStore();
			const loaded = ref(false);
			const toast = useToast();
			const route = useRoute();

			const errors = computed(() => store.getters['brand/errors'])
			var brand = reactive({});
            var products = ref([]);
			var label_name = ref();
			var new_brand = reactive({});

			const id  = parseInt(route.query.id);

			onBeforeMount(() => {
				const admin_token = store.getters['admin/token'];

				if (admin_token == null) {
					router.push({name: 'admin_login'});
					toast.error('Bạn chưa đăng nhập !', {timeout: 2000});
				}
				else {
                    store.dispatch('brand/getBrands').then(() => {
                        brand = store.getters['brand/current_brands'](id);
                        new_brand.name = brand.name;
                        new_brand.id = id;
                        //(brand);

                        label_name.value = 'Tên thương hiệu ' + brand.id;
                        products.value = brand.products;
                        loaded.value = true;
                    })
				}
			});

            const getImageUrl = (image) => {
                return `data:${image.type};base64,${image.data}`;
            };

			const submit = () => {
                loaded.value = false;
                store.dispatch('brand/updateBrand', [id, new_brand.name]).then(() => {
                    loaded.value = true;
                })
			}

			const redirect_to = (name) => {
				router.push({name: name})
			}

            const showDetail = (id) => {
                router.push({ path: 'product_details', query: { id: id }})
            };

			return {
				loaded, brand,
				label_name, new_brand, submit,
				products, redirect_to, errors,
                showDetail, getImageUrl
			}
		}

	}
</script>

<style scoped>
	.placeholder {
		opacity: 1;
	}
	.link_item{
        color: rgba(0,212,255,1);
        transition: all;
    }
    .link_item:hover{
        cursor: pointer;
        transform: scale(1.05);
    }

    select {
		padding: 5px 10px;
	}

	.images, .product_infomation {
		border: solid 1px #f0f0f1;
		border-radius: 16px;
		padding: 20px;
	}
</style>
