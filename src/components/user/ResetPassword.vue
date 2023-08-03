<template>
    <div class=" my-[30px] px-[10%] mobile:px-1 mobile:mt-[50px]">
        <div class="p-[10px] border-[1px] shadow-lg rounded-lg">
            <div class="pb-[10px] border-b-[1px] flex items-center">
                <font-awesome-icon icon="arrow-left" color="rgba(9,9,121,1,0.65)"
                @click="$router.go(-1)" class="pr-[120px]"/>
                <p class="title text-lg font-bold ">
                    Đổi mật khẩu
                </p>
            </div>
            <form @submit.prevent="submit" class="py-[30px]">
                <TextField :value="password.old" :placeholder="label.old_password" @update:value="password.old = $event"/>
                <TextPassword :value="password.new" :placeholder="label.new_password" @update:value="password.new = $event" class="py-[20px]"/>
                <TextPassword :value="password.confirm_password" :placeholder="label.confirm_password" @update:value="password.confirm_password = $event"/>

                <button type="submit"
                class="btn_submit mt-[20px] py-[8px] bg-[#4bb543] w-full text-md font-bold">
                    Đổi mật khẩu
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import TextField from '../../components/TextField.vue';
import TextPassword from '../TextPassword.vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

 export default defineComponent({
    components: { TextField, TextPassword },
    setup() {
        const store = useStore();
        const toast = useToast();
        var password = reactive({
            old: '',
            new: '',
            confirm_password: '',
        });

        var label = reactive({
            old_password: 'Mật khẩu hiện tại',
            new_password: 'Mật khẩu mới',
            confirm_password: 'Xác nhận mật khẩu mới',
        });

        const submit = async () => {
            if (password.new != password.confirm_password) {
                toast.error("Mat khau khong khop");
            }
            else {
                await store.dispatch('user/userResetPassword', password);
            }
        };

        return {
            password, label, submit
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
