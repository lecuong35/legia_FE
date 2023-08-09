<template>
    <div v-if="loaded" class="mobile:mt-[50px]">
		<div class="flex items-center pt-[20px] px-[20px]">
			<font-awesome-icon icon="arrow-left" color="rgba(9,9,121,0.65)"
			class="hidden mobile:block pr-[80px]" @click="$router.go(-1)"/>
			<p class="title font-bold text-lg whitespace-nowrap">
				Thông tin tài khoản
			</p>
			<font-awesome-icon icon="arrow-right" color="rgba(9,9,121,0.65)"
			class="pl-[100px]" @click="$router.push({name: 'mat_khau'})"/>
		</div>
        <form class="py-[20px] xl:px-[20px] lg:px-[20px] md:px-[20px] sm:px-[5px] mobile:px-[5px]"
			enctype="multipart/form-data" @submit.prevent="submit(user.id)">
				<div class="images shadow-lg">
					<p class="section_title text-xl">Avatar</p>
					<div class="grid gap-[16px] items-center justify-center pt-[10px] border-t-[1px]
					xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 mobile:grid-cols-2">

						<div class="relative">
							<img v-if="image_display" :src="getImageUrl(file_uploaded)" alt="" class="rounded-md">
							<img v-else :src="files" alt="" class="rounded-md">
							</div>
					</div>
					<label :for="'images_input'+user.id" class="section_title block">Chọn ảnh</label>
					<input type="file" @change="setImages()" :id="'images_input'+user.id">
				</div>

				<div class="product_infomation my-[20px] shadow-lg">
					<p class="section_title text-xl">
						Thông tin cá nhân
					</p>
					<div class="flex flex-col gap-[20px] pt-[30px] border-t-[1px]">
						<div class="input_item">
							<TextField :value="new_user.name" :placeholder="label.name" @update:value="new_user.name = $event"/>
							<!-- <FormError v-if="errors['name']" :error="errors['name'][0]" /> -->
						</div>
						<div class="input_item">
							<TextField :value="new_user.email" :placeholder="label.email" @update:value="new_user.email = $event" />
							<!-- <FormError v-if="errors['price']" :error="errors['price'][0]" /> -->
						</div>
						<div class="input_item">
							<TextField :value="new_user.location" :placeholder="label.location" @update:value="new_user.location = $event"/>
							<!-- <FormError v-if="errors['quantity']" :error="errors['quantity'][0]" /> -->
						</div>

						<div class="input_item">
							<TextField :value="new_user.phone" :placeholder="label.phone" @update:value="new_user.phone = $event" />
							<!-- <FormError v-if="errors['price']" :error="errors['price'][0]" /> -->
						</div>

					</div>
				</div>

				<button type="submit"
				class="w-full bg-[#4bb543] px-[16px] py-[8px] rounded-lg text-white">
					Cập nhật
				</button>
		</form>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import TextField from '../../components/TextField.vue';

    export default defineComponent({
        components: { TextField },
        setup() {
            const store = useStore();
            var user = ref([]);
            var loaded = ref(false);
            var avatar = ref();
            var files = ref([]);
            var image_display = ref(true);
			const file_uploaded = ref([]);

            var new_user = reactive({
                name: '',
                email: '',
                location: '',
				phone: '',
            });

            const label = reactive({
                name: 'Tên người dùng',
                location: 'Địa chỉ người dùng',
                email: 'Email',
                phone: 'Số điện thoại liên hệ',
            })

            onBeforeMount(async () => {
                await store.dispatch('user/getUserInfo').then(() => {
                    user.value = store.getters['user/user'];
                    new_user.name = user.value.name;
                    new_user.email = user.value.email;
                    new_user.location = user.value.location;
					new_user.phone = user.value.phone;
                    avatar.value = user.value.avatar;
                    file_uploaded.value = user.value.avatar;

                    //(files.value);

                    loaded.value = true;
                })
            });

			const getImageUrl = (image) => {
                //(image[0]);
				return `data:${image[0].type};base64,${image[0].data}`;
			};

			const setImages = () => {
                image_display.value = false;
				var image = document.getElementById('images_input' + user.value.id).files[0];
                file_uploaded.value = image;
                files.value = URL.createObjectURL(image);
			}

			const submit = (id) => {
				const form_data = new FormData();
				if (file_uploaded.value != null) {
					form_data.append('avatar[]', file_uploaded.value);
				}
				form_data.append("name", new_user.name);
				form_data.append("email", new_user.email);
				form_data.append("location", new_user.location);

				//(file_uploaded.value);


				store.dispatch('user/userUpdateInfo', form_data);
			}

			const redirect_to = (name) => {
				router.push({name: name})
			}

            return {
                user, loaded, getImageUrl, setImages, submit, redirect_to, new_user, label, file_uploaded,
                files, image_display
            }
        }
    })
</script>

<style scoped>
.title {
    background: -webkit-linear-gradient(90deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 40%, rgba(0,212,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
