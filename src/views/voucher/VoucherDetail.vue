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
					<p class="link_item" @click="redirect_to('vouchers')">
						<font-awesome-icon icon="arrow-left"   />
						Quay lại
					</p>
				</div>

				<form class="py-[20px] xl:px-[20px] lg:px-[20px] md:px-[20px] sm:px-[5px] mobile:px-[5px]"
				enctype="multipart/form-data" @submit.prevent="submit()">
					<div class="product_infomation">
						<p class="section_title text-xl">
								Thông tin mã giảm giá
						</p>
						<div class="flex flex-col gap-[20px] py-[30px] border-t-[1px]">
							<div class="input_item">
								<TextField :value="new_voucher.name" :placeholder="label_name" @update:value="new_voucher.name = $event"/>
								<FormError v-if="errors['name']" :error="errors['name'][0]" />
							</div>
							<div class="input_item">
								<TextField :value="new_voucher.value" :placeholder="label_value" @update:value="new_voucher.value = $event"/>
								<FormError v-if="errors['value']" :error="errors['value'][0]" />
							</div>
							<div>
								<DatePicker :value="new_voucher.start_date" :placeholder="label_start_date" @update:value="new_voucher.start_date = $event"/>
								<FormError v-if="errors['start_date']" :error="errors['start_date'][0]" />
							</div>
							<div class="input_item">
								<DatePicker :value="new_voucher.end_date" :placeholder="label_end_date" @update:value="new_voucher.end_date = $event"/>
								<FormError v-if="errors['end_date']" :error="errors['end_date'][0]" />
							</div>
							<div class="input_item">
								<TextField :value="new_voucher.value_condition" :placeholder="label_value_condition" @update:value="new_voucher.value_condition = $event"/>
								<FormError v-if="errors['value_condition']" :error="errors['value_condition'][0]" />
							</div>
						</div>
						<button type="submit"
						class="w-full bg-[#4bb543] px-[16px] py-[8px] rounded-lg text-white">
							Cập nhật
						</button>
					</div>
				</form>
			</div>
		</div>
	</div> -->

	<AdminLayout>
        <template v-slot:content v-if="loaded">
            <div class="p-[8px] border-[1px] rounded-md shadow-md w-fit ml-[20px] mt-[10px]">
				<p class="link_item" @click="redirect_to('vouchers')">
					<font-awesome-icon icon="arrow-left"   />
					Quay lại
				</p>
			</div>

			<form class="py-[20px] xl:px-[20px] lg:px-[20px] md:px-[20px] sm:px-[5px] mobile:px-[5px]"
			enctype="multipart/form-data" @submit.prevent="submit()">
				<div class="product_infomation">
					<p class="section_title text-xl">
							Thông tin mã giảm giá
					</p>
					<div class="flex flex-col gap-[20px] py-[30px] border-t-[1px]">
						<div class="input_item">
							<TextField :value="new_voucher.name" :placeholder="label_name" @update:value="new_voucher.name = $event"/>
							<FormError v-if="errors['name']" :error="errors['name'][0]" />
						</div>
						<div class="input_item">
							<TextField :value="new_voucher.value" :placeholder="label_value" @update:value="new_voucher.value = $event"/>
							<FormError v-if="errors['value']" :error="errors['value'][0]" />
						</div>
						<div>
							<DatePicker :value="new_voucher.start_date" :placeholder="label_start_date" @update:value="new_voucher.start_date = $event"/>
							<FormError v-if="errors['start_date']" :error="errors['start_date'][0]" />
						</div>
						<div class="input_item">
							<DatePicker :value="new_voucher.end_date" :placeholder="label_end_date" @update:value="new_voucher.end_date = $event"/>
							<FormError v-if="errors['end_date']" :error="errors['end_date'][0]" />
						</div>
						<div class="input_item">
							<TextField :value="new_voucher.value_condition" :placeholder="label_value_condition" @update:value="new_voucher.value_condition = $event"/>
							<FormError v-if="errors['value_condition']" :error="errors['value_condition'][0]" />
						</div>
					</div>
					<button type="submit"
					class="w-full bg-[#4bb543] px-[16px] py-[8px] rounded-lg text-white">
						Cập nhật
					</button>
				</div>
			</form>
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
	import DatePicker from '../../components/DatePicker.vue';
	import { useRoute } from 'vue-router';
	import { Select, initTE } from "tw-elements";
	initTE({ Select });

	export default {
		components: { NavbarAdmin, ProductModal, TextField, FormError, DatePicker, AdminLayout },

		setup() {
			const store = useStore();
			const loaded = ref(false);
			const toast = useToast();
			const route = useRoute();

			const errors = computed(() => store.getters['voucher/errors'])

			var voucher = ref();

			var label_name = ref();
			var label_value = ref();
			var label_start_date = ref();
			var label_end_date = ref();
			var label_value_condition = ref();

			var new_voucher = reactive({});

			const id  = parseInt(route.query.id);

			onBeforeMount(() => {
				const admin_token = store.getters['admin/token'];

				if (admin_token == null) {
					router.push({name: 'admin_login'});
					toast.error('Bạn chưa đăng nhập !', {timeout: 2000});
				}
				else {
					store.dispatch('voucher/getVouchers', 1);
					store.dispatch('voucher/getDefineVoucher', id).then(() => {
						voucher.value = store.getters['voucher/voucher'];

						label_name.value = 'Tên mã giảm giá ' + voucher.value.id;
						label_value.value = 'Chỉ số tính giá trị đơn ' + voucher.value.id;
						label_start_date.value = 'Ngày bắt đầu' + voucher.value.id;
						label_end_date.value = 'Ngày hết hạn' + voucher.value.id;
						label_value_condition.value = 'Giá trị áp dụng' + voucher.value.id;

						new_voucher.name = voucher.value.name;
						new_voucher.value = voucher.value.value;
						new_voucher.start_date = voucher.value.start_date;
						new_voucher.end_date = voucher.value.end_date;
						new_voucher.value_condition = voucher.value.value_condition;

						loaded.value = true;
					});
				}
			});

			const submit = () => {
				store.dispatch('voucher/updateVoucher', [id, new_voucher])
			}

			const redirect_to = (name) => {
				router.push({name: name})
			}

			return {
				loaded, new_voucher,
				label_name, label_value, label_start_date, label_end_date, label_value_condition,
				submit, voucher, redirect_to, errors
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
	.product_infomation {
		border: solid 1px #f0f0f1;
		border-radius: 16px;
		padding: 20px;
	}
</style>
