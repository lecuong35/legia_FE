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
					<p class="link_item" @click="redirect_to('products')">
						<font-awesome-icon icon="arrow-left"   />
						Quay lại
					</p>
				</div>
				<form class="py-[20px] xl:px-[20px] lg:px-[20px] md:px-[20px] sm:px-[5px] mobile:px-[5px]"
				 enctype="multipart/form-data" @submit.prevent="submit">
					<div class="images shadow-lg">
						<p class="section_title text-xl">Hình ảnh sản phẩm</p>
						<div class="grid gap-[16px] items-center justify-center pt-[10px] border-t-[1px]
						xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 mobile:grid-cols-3">
								<div v-for="file in files" :key="file" class="relative h-full flex items-center justify-center">
									<img :src="file" alt="" class="rounded-md" v-if="file">
									<div class="absolute top-3 right-1" @click="deleteImages(file)" v-if="file">
										<font-awesome-icon icon="trash"   color="#c5c5c6"
										class="p-[2px] rounded-md hover:bg-[#cce9e4] hover:cursor-pointer"/>
									</div>
								</div>
						</div>
						<label for="images_input" class="section_title block">Chọn ảnh</label>
						<input type="file" multiple @change="setImages()" id="images_input">
                        <FormError v-if="errors['images']" :error="errors['images'][0]" />
					</div>

					<div class="product_infomation my-[20px] shadow-lg">
						<p class="section_title text-xl">
								Thông tin sản phẩm
						</p>
						<div class="flex flex-col gap-[20px] pt-[30px] border-t-[1px]">
							<div class="input_item">
                                <TextField :value="new_product.name" :placeholder="label.label_name" @update:value="new_product.name = $event"/>
                                <FormError v-if="errors['name']" :error="errors['name'][0]" />
                            </div>
							<div class="input_item">
                                <TextField :value="new_product.locale_price" :placeholder="label.label_price" @update:value="new_product.price = $event"/>
                                <FormError v-if="errors['price']" :error="errors['price'][0]" />
                            </div>
							<div class="input_item">
                                <TextField :value="new_product.quantity" :placeholder="label.label_quantity" @update:value="new_product.quantity = $event"/>
                                <FormError v-if="errors['quantity']" :error="errors['quantity'][0]" />
                            </div>
							<div class="input_item">
                                <TextField :value="new_product.description" :placeholder="label.label_description" @update:value="new_product.description = $event"/>
                                <FormError v-if="errors['description']" :error="errors['description'][0]" />
                            </div>
							<div class="input_item">
                                <TextField :value="new_product.code" :placeholder="label.label_code" @update:value="new_product.code = $event"/>
                                <FormError v-if="errors['code']" :error="errors['code'][0]" />
                            </div>

							<div class="input_item">
								<label :for="'category'">Loại sản phẩm</label>
								<select data-te-select-init
								name="category" :id="'category'" v-model="new_product.category">
									<option v-for="ca in categories" :key="ca.id" :value="ca.id" >
										{{ ca.name }}
									</option>
								</select>
                                <FormError v-if="errors['brand_id']" :error="errors['brand_id'][0]" />
							</div>

							<div>
								<label :for="'brand'">Thương hiệu</label>
								<select data-te-select-init
								name="brand" :id="'brand'" v-model="new_product.brand">
									<option v-for="brand in brands" :key="brand.id" :value="brand.id">
										{{ brand.name }}
									</option>
								</select>
                                <FormError v-if="errors['category_id']" :error="errors['category_id'][0]" />
							</div>

						</div>
					</div>

					<button type="submit"
					class="w-full bg-[#4bb543] px-[16px] py-[8px] rounded-lg text-white">
						Tạo mới
					</button>
				</form>
			</div>
		</div>
	</div> -->

	<AdminLayout>
        <template v-slot:content v-if="loaded">
            <div class="p-[0px]">
                <div class="p-[8px] border-[1px] rounded-md shadow-md w-fit ml-[20px] mt-[10px]">
					<p class="link_item" @click="redirect_to('products')">
						<font-awesome-icon icon="arrow-left"   />
						Quay lại
					</p>
				</div>
				<form class="py-[20px] xl:px-[20px] lg:px-[20px] md:px-[20px] sm:px-[5px] mobile:px-[5px]"
				 enctype="multipart/form-data" @submit.prevent="submit">
					<div class="images shadow-lg">
						<p class="section_title text-xl">Hình ảnh sản phẩm</p>
						<div class="grid gap-[16px] items-center justify-center pt-[10px] border-t-[1px]
						xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 mobile:grid-cols-3">
								<div v-for="file in files" :key="file" class="relative h-full flex items-center justify-center">
									<img :src="file" alt="" class="rounded-md" v-if="file">
									<div class="absolute top-3 right-1" @click="deleteImages(file)" v-if="file">
										<font-awesome-icon icon="trash"   color="#c5c5c6"
										class="p-[2px] rounded-md hover:bg-[#cce9e4] hover:cursor-pointer"/>
									</div>
								</div>
						</div>
						<label for="images_input" class="section_title block">Chọn ảnh</label>
						<input type="file" multiple @change="setImages()" id="images_input">
                        <FormError v-if="errors['images']" :error="errors['images'][0]" />
					</div>

					<div class="product_infomation my-[20px] shadow-lg">
						<p class="section_title text-xl">
								Thông tin sản phẩm
						</p>
						<div class="flex flex-col gap-[20px] pt-[30px] border-t-[1px]">
							<div class="input_item">
                                <TextField :value="new_product.name" :placeholder="label.label_name" @update:value="new_product.name = $event"/>
                                <FormError v-if="errors['name']" :error="errors['name'][0]" />
                            </div>
							<div class="input_item">
                                <TextField :value="new_product.locale_price" :placeholder="label.label_price" @update:value="new_product.price = $event"/>
                                <FormError v-if="errors['price']" :error="errors['price'][0]" />
                            </div>
							<div class="input_item">
                                <TextField :value="new_product.quantity" :placeholder="label.label_quantity" @update:value="new_product.quantity = $event"/>
                                <FormError v-if="errors['quantity']" :error="errors['quantity'][0]" />
                            </div>
							<div class="input_item">
                                <TextField :value="new_product.description" :placeholder="label.label_description" @update:value="new_product.description = $event"/>
                                <FormError v-if="errors['description']" :error="errors['description'][0]" />
                            </div>
							<div class="input_item">
                                <TextField :value="new_product.code" :placeholder="label.label_code" @update:value="new_product.code = $event"/>
                                <FormError v-if="errors['code']" :error="errors['code'][0]" />
                            </div>

							<div class="input_item">
								<label :for="'category'">Loại sản phẩm</label>
								<select data-te-select-init
								name="category" :id="'category'" v-model="new_product.category">
									<option v-for="ca in categories" :key="ca.id" :value="ca.id" >
										{{ ca.name }}
									</option>
								</select>
                                <FormError v-if="errors['brand_id']" :error="errors['brand_id'][0]" />
							</div>

							<div>
								<label :for="'brand'">Thương hiệu</label>
								<select data-te-select-init
								name="brand" :id="'brand'" v-model="new_product.brand">
									<option v-for="brand in brands" :key="brand.id" :value="brand.id">
										{{ brand.name }}
									</option>
								</select>
                                <FormError v-if="errors['category_id']" :error="errors['category_id'][0]" />
							</div>

						</div>
					</div>

					<button type="submit"
					class="w-full bg-[#4bb543] px-[16px] py-[8px] rounded-lg text-white">
						Tạo mới
					</button>
				</form>
            </div>
        </template>
    </AdminLayout>
</template>

<script>
	import { onBeforeMount, ref, computed, reactive, onMounted } from 'vue'
	import { useStore } from 'vuex';
	import NavbarAdmin from '../../components/admin/NavbarAdmin.vue';
	import ProductModal from '../../components/product/ProductModal.vue';
    import FormError from '../../components/FormError.vue';
	import AdminLayout from '../../layouts/AdminLayout.vue';
	import { useToast } from 'vue-toastification';
	import router from '../../router';
	import TextField from '../../components/TextField.vue';
	import { useRoute } from 'vue-router';
	import { Select, initTE } from "tw-elements";
	initTE({ Select });

	export default {
		components: { NavbarAdmin, ProductModal, TextField, FormError, AdminLayout },

		setup() {
			const store = useStore();
			const loaded = ref(false);
			const toast = useToast();
			const route = useRoute();
            const errors =  computed(() => store.getters['product/errors']);

			var brands = ref([]);
			var categories = ref([]);

			var label = reactive({
                label_name: 'Tên sản phẩm',
                label_price: 'Giá sản phẩm',
                label_description: 'Mô tả sản phẩm',
                label_brand: 'Thương hiệu',
                label_category: 'Loại sản phẩm',
                label_quantity: 'Số lượng',
                label_code: 'Code',
            });

			var images = ref();

			var new_product = reactive({
                name: '',
                price: '',
                quantity: '',
                description: '',
                category: '',
                brand: '',
                code: '',
            });

			onBeforeMount(() => {
				const admin_token = store.getters['admin/token'];

				if (admin_token == null) {
					router.push({name: 'admin_login'});
					toast.error('Bạn chưa đăng nhập !', {timeout: 2000});
				}
				else {
                    store.dispatch('brand/getBrands', 100).then(() => {
                        brands.value = store.getters['brand/brands'];
                    });
                    store.dispatch('category/getCategories', 100).then(() => {
                        categories.value = store.getters['category/categories'];
                    });
                    loaded.value = true;
				}
			});

			const files = ref([]);
			const file_uploaded = ref([]);

			const setImages = () => {
				var images = document.getElementById('images_input');
				for (var image of images.files) {
					console.log(image);
					files.value.push(URL.createObjectURL(image))
					file_uploaded.value.push(image);
				}
			}

			const deleteImages = (file) => {
				files.value = files.value.filter((url, index) => {
					if (url != file) {
						return url
					}
					else {
						file_uploaded.value.splice(index,1);
						console.log(file_uploaded.value.length);
					}
				})
			}

			const submit = () => {
				const form_data = new FormData();
				for (const file of file_uploaded.value) {
					form_data.append('images[]', file);
				}
				form_data.append("name", new_product.name)
				form_data.append("description", new_product.description)
				form_data.append("price", new_product.price)
				form_data.append("quantity", new_product.quantity)
				form_data.append("category_id", new_product.category)
				form_data.append("brand_id", new_product.brand)
				form_data.append("code", new_product.code)
				store.dispatch('product/addProduct', form_data)
			}

            const redirect_to = (name) => {
                router.push({name: name});
            }

			return {
				loaded, setImages, images,
				new_product, files, deleteImages, file_uploaded, submit,
				brands, categories, label, errors, redirect_to
			}
		}

	}
</script>

<style scoped>
	.placeholder {
		opacity: 1;
	}

    .input_item{
        padding-bottom: 20px;
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
