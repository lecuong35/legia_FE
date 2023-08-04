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
                src="@@/logo_no_background.png"
                class="xl:w-[80%] md:w-[40%] lg:w-[70%] sm:w-[30%] mobile:w-[40%] py-[10px]"
                alt="Sample image" />
            </div>

            <!-- Right column container -->
            <div class="h-full basis-1/2 flex flex-col justify-center items-center pb-[10px]">
                <div>
                    <p class="title font-bold text-lg pb-[32px] text-white pt-[10px]">
                      QUÊN MẬT KHẨU
                    </p>
                </div>
              <form action="post" @submit.prevent="submit" class="px-[10px]">
                <p class="title pb-[10px]">
                  Hãy nhập email và số điện thoại bạn đã đăng ký để lấy lại mật khẩu
                </p>
                <!-- Email input -->
                <div class="relative mb-6" data-te-input-wrapper-init>
                  <TextField :value="user.email" :placeholder="email_label" @update:value="user.email = $event"/>
                </div>

                <!-- Phone input -->
                <div class="relative mb-6" data-te-input-wrapper-init>
                    <TextField :value="user.phone" :placeholder="phone_label" @update:value="user.phone = $event"/>
                  </div>

                <!-- Login button -->
                <div class="text-center lg:text-left">
                  <button
                    type="submit"
                    class="px-[10px] py-[5px] w-full
                    rounded-md text-white transition-all"
                   >
                    Gửi tới email của tôi
                  </button>
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

    export default defineComponent({
        components: { TextField, FormError },

        setup() {
            const store = useStore();
            const email_label = ref("Email");
            const phone_label = ref("Số điện thoại");
            const user = reactive({
                email: '',
                phone: ''
            })
            const errors = computed(() => store.getters['user/errors']);
            const submit = async () => {
                await store.dispatch("user/userForgetPassword", user);
            };
            return {
                user,
                errors,
                email_label, phone_label,
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
