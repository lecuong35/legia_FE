<template>
    <div class="w-full fixed top-0 left-0 z-10
    items-center justify-between px-[10px] py-[10px] bg-[rgb(0,212,255)]
    hidden mobile:flex" @click="click_toggle()">
        <div>
            <p class="title font-bold text-xl text-white">
                Lê Gia Autoparts
            </p>
        </div>
        <font-awesome-icon icon="bars" color="white" class="pr-[10px]"/>
    </div>
    <div class="border-b-[1px] content bg-[rgb(0,212,255)] mobile:hidden" id="navbar_user_toggle">
        <div class="flex items-center justify-between px-[20px] py-[10px]
        mobile:hidden sm:hidden md:flex lg:flex xl:flex">
            <div class="flex items-center justify-start gap-[10px]">
                <img src="../../../logo_no_background.png" alt="" class="w-[30px]">
                <div>
                    <p class="title text-xl">
                        Phụ tùng ô tô chính hãng Lê Gia Autoparts
                    </p>
                </div>
            </div>
            <div class="flex items-center justify-end gap-[10px]">
                <a href="https://www.google.com/maps/place/217+Ng.+281+%C4%90.+Tr%E1%BA%A7n+Kh%C3%A1t+Ch%C3%A2n,+Thanh+Nh%C3%A0n,+Hai+B%C3%A0+Tr%C6%B0ng,+H%C3%A0+N%E1%BB%99i,+Vietnam/@21.0056018,105.8541459,17z/data=!3m1!4b1!4m5!3m4!1s0x3135ac09f40eb173:0x8acc7f380bd0e014!8m2!3d21.0056019!4d105.8590168?entry=ttu"
                target="_blank" rel="noopener noreferrer">
                    <p>
                        <font-awesome-icon icon="location-dot" color="green" class="mr-[4px]"/>
                        <span>
                            Số 217 ngõ 84 Đê Nguyễn Khoái
                        </span>
                    </p>
                </a>
                <a href="tel:0379653142" class="pl-[10px] border-l-[1px]">
                    <p>
                        <font-awesome-icon icon="phone" color="green" class="mr-[4px]"/>
                        <span>0379653142</span>
                    </p>
                </a>
            </div>
        </div>
        <div class="navbar flex items-center justify-between px-[20px] border-t-[1px] mobile:px-0 z-10
        xl:flex-row lg:flex-row md:flex-row sm:flex-col mobile:flex-col">
            <div class="menu flex items-center justify-start
            xl:flex-row lg:flex-row md:flex-row sm:flex-col mobile:flex-col">
                <div class="menu_item font-bold mobile:w-full" @click="redirect_to('home')">
                    Trang chủ
                </div>
                <div class="menu_item relative">
                    <p class="category font-bold">
                        Danh mục phụ tùng
                        <font-awesome-icon icon="chevron-down" color="white" class="pl-[10px]" id="category"/>
                    </p>
                    <div class="menu_toggle category_toggle">
                        <p v-for="cate in categories" :key="cate.id"
                        @click="searchByCategory(cate.id)" class="toggle_item">
                            {{ cate.name }}
                        </p>
                    </div>
                </div>
                <div class="menu_item relative">
                    <p class="brand font-bold">
                        Phụ tùng theo hãng
                        <font-awesome-icon icon="chevron-down" color="white" class="pl-[10px]" id="brand"/>
                    </p>
                    <div class="menu_toggle brand_toggle">
                        <p v-for="brand in brands" :key="brand.id"
                        @click="searchByBrand(brand.id)" class="toggle_item">
                            {{ brand.name }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="account">
                <div v-if="logined"
                class="have_account flex items-center justify-end">
                    <div class="relative">
                        <div class="user flex gap-[4px] items-center">
                            <div class="relative">
                                <img src="../../../istockphoto-1340642632-170667a.jpg" alt="" class="w-[30px] h-[30px] rounded-[100%]">
                                <div v-if="notifications.length > 0" class="absolute top-[-10px] left-[-10px]">
                                    <font-awesome-icon icon="envelope" color="red" />
                                </div>
                            </div>
                            <p>Xin chào, <span>{{ auth_user.name }}</span></p>
                        </div>
                        <div class="absolute top-[25px] pt-[15px] right-[10px] bg-[rgba(9,9,121,0.65)] z-[9]
                        rounded-lg shadow-lg hidden user_hidden">
                            <div class="user_item" @click="redirect_to('gio_hang')">
                                <font-awesome-icon icon="shopping-cart" />
                                <p class="whitespace-nowrap">Giỏ hàng của tôi</p>
                            </div>
                            <div class="user_item" @click="redirect_to('don_hang')">
                                <font-awesome-icon icon="truck-fast" />
                                <p class="whitespace-nowrap">Đơn hàng của tôi</p>
                                <div v-if="notifications.length > 0" class="pl-[10px]">
                                    <font-awesome-icon icon="envelope" color="red" />
                                </div>
                            </div>
                            <div class="user_item" @click="redirect_to('tai_khoan')">
                                <font-awesome-icon icon="gear" />
                                <p class="whitespace-nowrap">Thông tin và mật khẩu</p>
                            </div>
                            <div class="user_item" @click="logout">
                                <font-awesome-icon icon="door-open" />
                                <p class="whitespace-nowrap">Đăng xuất</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else
                class="no_account flex items-center justify-end">
                    <div @click="redirect_to('login')" class="user_item">
                        Đăng nhập
                    </div>
                    <div class="user_item px-[16px] pl-[10px]"
                    @click="redirect_to('register')">
                        Đăng ký
                    </div>
                    <div class="user_item pl-[10px]" @click="redirect_to('gio_hang')">
                        <font-awesome-icon icon="shopping-cart" />
                        <p class="whitespace-nowrap">Giỏ hàng của tôi</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import router from '../../router';
import ls from 'localstorage-slim';
import { useToast } from 'vue-toastification';

    export default defineComponent({
        props: ['categories', 'brands', 'user'],

        setup(props) {
            const store = useStore();
            const toast = useToast();
            const user_token = ref(ls.get('token_user'));
            var auth_user = ref([]);
            var notifications = ref([]);
            const logined = ref(user_token.value != null);
            var mobile_size = ref(true);

            onBeforeMount(async () => {
                if (user_token.value != null) {
                    await store.dispatch('user/getUserInfo').then(() => {
                        notifications.value = store.getters['user/user'].unread_notifications;
                    });
                    if (notifications.value.length > 0) {
                        toast.info(notifications[0].data)
                    }
                }
            })

            auth_user.value = props.user;
            console.log(props.user.name != null);
            if (props.user.name != null) {
                logined.value = true;
            }

            const searchByBrand = (id) => {
                router.push({name: 'home'});
                store.dispatch('product/searchProduct', {brand: id});
                // mobile_size.value = false;
            }

            const searchByCategory = (id) => {
                router.push({name: 'home'});
                store.dispatch('product/searchProduct', {category: id});
                // mobile_size.value = false;
            }

            watch(() => store.getters['user/user'], () => {
                logined.value = true;
                auth_user.value = store.getters['user/user'];
                notifications.value = store.getters['user/user'].unread_notifications;
            })

            const redirect_to = (name) => {
                router.push({name: name});
            }

            const logout = () => {
                ls.remove('token_user');
                router.push({name: 'login'});
            }

            const click_toggle = () => {
                var ele = document.getElementById("navbar_user_toggle");
                var display = ele.style.display;
                console.log(display);
                if(display == "none" || display == "") {
                    ele.style.display = "block";
                }else {
                    ele.style.display = "none";
                }
            }

            return {
                logined, searchByBrand, searchByCategory, redirect_to,
                 auth_user, logout, mobile_size, notifications, click_toggle
            }
        }
    });

</script>

<style scoped>
.menu_toggle{
    position: absolute;
    top: 28px;
    left: 0px;
    background-color: rgba(9,9,121,0.5);
    z-index: 9;
    display: none;
    width: 100%;
    padding-top: 15px;
}

.category:hover ~ #category {
    transform: rotate(180deg);
}

@media (max-width: 468px) {
    .menu_toggle {
        position: relative;
        top: 0px;
        background-color: rgba(9,9,121,0);
        text-align: start;
    }

    .menu_item {
        padding: 10px 0px;
    }
    .toggle_item:hover {
        background-color: rgba(9,9,121,0.65);
    }

    .user_hidden {
        position: relative;
        top: 0px;
        white-space: normal;
    }
}

.toggle_item {
    padding: 5px 10px;
    white-space: nowrap;
}
.toggle_item:hover {
    background-color: rgba(9,9,121,0.65);
    cursor: pointer;
}

.menu_item {
    height: 100%;
    padding: 10px 20px;
}

.menu_item:hover{
    background-color: rgba(9,9,121,0.65);
    cursor: pointer;
}
.brand:hover ~ .brand_toggle {
    display: block;
}

.category:hover ~ .category_toggle {
    display: block;
}

.brand_toggle:hover{
    display: block;
}

.category_toggle:hover {
    display: block;
}

.user_item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
    padding: 8px 16px;
}
.user_item:hover {
    background-color: rgba(9,9,121,0.65);
    cursor: pointer;
}
.user:hover ~ .user_hidden {
    display: block;
}
.user_hidden:hover {
    display: block;
}

.title {
    background: -webkit-linear-gradient(270deg, rgba(2,0,36,1) 0% , rgba(9,9,121,1) 60%, rgba(0,212,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
}
</style>
