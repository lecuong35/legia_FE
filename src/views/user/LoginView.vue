<template>
    <section class="h-screen flex justify-center">
        <div class="m-[32px] mobile:m-[10px]">
          <!-- Left column container with background-->
          <div
            class="flex xl:flex-row lg:flex-row md:flex-col sm:flex-col mobile:flex-col
            lg:h-full items-center justify-center
            border-solid border-[1px] border-[rgba(9,9,121,0.25)] rounded-lg shadow-lg">
            <div
              class="form_fill h-full shrink-1 grow-0 basis-1/2
              flex justify-center items-center">
              <img
                src="../../../logo_no_background.png"
                class="xl:w-[80%] md:w-[40%] lg:w-[70%] sm:w-[30%] mobile:w-[40%] py-[10px]"
                alt="Sample image" />
            </div>

            <!-- Right column container -->
            <div class="h-full basis-1/2 flex flex-col justify-center items-center pb-[10px]">
                <div>
                    <p class="title font-bold text-lg pb-[32px] text-white pt-[10px]">
                        ĐĂNG NHẬP VÀO PHỤ TÙNG Ô TÔ LÊ GIA
                    </p>
                </div>
              <form action="post" @submit.prevent="submit">
                <!-- Email input -->
                <div class="relative mb-6" data-te-input-wrapper-init>
                  <TextField :value="user.phone" :placeholder="phone_placeholder" @update:value="user.phone = $event"/>
                  <FormError v-if="errors['user.phone'] != null" :error="errors['user.phone']"/>
                </div>

                <!-- Password input -->
                <div class="relative mb-6" data-te-input-wrapper-init>
                    <TextPassword :value="user.password" :placeholder="password_placeholder" @update:value="user.password = $event"/>
                    <FormError v-if="errors['user.password']" :error="errors['user.password']"/>
                    <FormError v-if="errors['error']" :error="errors['error']"/>
                </div>

                <!-- Login button -->
                <div class="text-center lg:text-left">
                  <button
                    type="submit"
                    class="px-[10px] py-[5px] w-full
                    rounded-md text-white transition-all"
                   >
                    Login
                  </button>

                  <!-- Register link -->
                  <p class="mb-0 mt-2 pt-1 text-sm font-semibold">
                    Bạn chưa có tài khoản?
                    <a
                      href="../register"
                      class="text-danger transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600
                       active:text-danger-700 hover:text-[var(--primary-blue)] hover:cursor-pointer"
                      >Đăng ký tài khoản mới</a
                    >
                  </p>

                   <!-- Forget link -->
                   <p class="mb-0 mt-2 pt-1 text-sm font-semibold">
                    Bạn quên mật khẩu?
                    <a
                      href="../quen-mat-khau"
                      class="text-danger transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600
                       active:text-danger-700 hover:text-[var(--primary-blue)] hover:cursor-pointer"
                      >Quên mật khẩu</a
                    >
                  </p>

                  <!-- Forget link -->
                  <p class="mb-0 mt-2 pt-1 text-sm font-semibold">
                    <a
                      href="../"
                      class="hover:cursor-pointer"
                      >Quay lại trang chủ</a
                    >
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
    </section>
</template>

<script>
    import { useStore } from 'vuex'
    import { ref, reactive, onUpdated, computed, defineComponent } from 'vue'
    import TextField from '../../components/TextField.vue'
    import FormError from '../../components/FormError.vue'
    import TextPassword from '../../components/TextPassword.vue'

    export default defineComponent({
        components: { TextField, FormError, TextPassword },

        setup() {
            const store = useStore();
            const phone_placeholder = ref("Số điện thoại");
            const user = reactive({
                phone: '',
                password: ''
            })
            const errors = computed(() => store.getters['user/errors']);
            const password_placeholder = ref("Mật khẩu");
            const submit = () => {
                store.dispatch("user/getUser", { user });
            };
            return {
                user,
                errors,
                phone_placeholder,
                password_placeholder,
                submit,
            };
        },
    })
</script>
<style scoped>
  .form_fill {
    background: rgb(2,0,36);
    background: linear-gradient(90deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 20%, rgba(0,212,255,1) 100%);
    border-radius: 8px 0px 0px 8px;
  }

  @media (max-width:1024px) {
    .form_fill {
      border-radius: 8px 8px 0px 0px;
    }
  }

  button:hover {
    background: rgb(2,0,36);
    background: linear-gradient(180deg, rgba(2,0,36,0.75) 0% , rgba(9,9,121,1) 20%, rgba(0,212,255,1) 100%);
  }

  button {
    background: rgb(2,0,36);
    background: linear-gradient(0deg, rgba(2,0,36,0.75) 0% , rgba(9,9,121,1) 20%, rgba(0,212,255,1) 100%);
  }

  .title, a {
    background: -webkit-linear-gradient(270deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 20%, rgba(0,212,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
