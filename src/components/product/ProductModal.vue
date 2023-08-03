<template>
    <section :id="'product'+product.id" style="display: none;"
    @blur="hidden_modal('product'+product.id)">
        <div class="product_modal w-[320px] overflow-y-auto overflow-x-hidden" v-show="!updationable">
            <div class="pb-[16px] relative">
                <p class="font-bold text-[16px]">CHI TIẾT SẢN PHẨM</p>
                <font-awesome-icon icon="xmark" color="rgba(0,0,0,0.5)"
                class="absolute top-0 right-0 p-[2px] hover:bg-[#f0f0f1] hover:cursor-pointer"
                @click="hidden_modal('product'+product.id)"/>
            </div>
            <hr>
            <div class="text-left pt-[16px]">
                <div class="pb-[10px]">
                    <div class="pb-[4px] font-bold text-[14px]">
                        Hình ảnh
                    </div>
                    <div class="grid grid-cols-3 gap-[5px]">
                        <img :src="getImageUrl(image)" alt=""
                        class="rounded-md"
                        v-for="( image, index ) in product.images" :key="product.id">
                    </div>
                </div>
                <div>
                    <p class="font-bold pb-[4px] text-[14px]">Thông tin cơ bản</p>
                    <div>
                        Tên sản phẩm: {{product.name}}
                    </div>
                    <div>
                      Mã sản phẩm: {{product.code}}
                    </div>
                    <div class="whitespace-nowrap">Thương hiệu: {{product.brand.name}}</div>
                    <div class="whitespace-nowrap">Loại hàng: {{product.category.name}}</div>
                    <div class="">Số lượng: {{product.quantity}}</div>
                    <div class="pb-[10px]">Giá sản phẩm: {{product.price}}</div>
                </div>
                <div class="">
                    <p class="font-bold text-[14px] pb-[4px]">Mô tả sản phẩm:</p>
                    <p>{{ product.description }}</p>
                </div>
                <hr>
                <div class="pt-[16px] flex justify-end gap-[16px]">
                    <button class="px-[8px] py-[4px] rounded-md border bg-[var(--main-dark-color)]
                    text-white whitespace-nowrap" >
                        Cập nhật thông tin
                    </button>
                    <button class="px-[8px] py-[4px] rounded-md border bg-[var(--primary-red)] text-white"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>

        <div class="product_modal w-[320px] overflow-y-auto overflow-x-hidden" v-show="updationable">
            <div class="pb-[16px] relative">
                <p class="font-bold text-[16px]">CHI TIẾT SẢN PHẨM</p>
                <font-awesome-icon icon="xmark" color="rgba(0,0,0,0.5)"
                class="absolute top-0 right-0 p-[2px] hover:bg-[#f0f0f1] hover:cursor-pointer"
                @click="hidden_modal('product'+product.id)"/>
            </div>
            <hr>
            <div class="text-left pt-[16px]">
                <div class="pb-[10px]">
                    <div class="pb-[4px] font-bold text-[14px]">
                        Hình ảnh
                    </div>
                    <div class="grid grid-cols-3 gap-[5px]">
                        <img :src="getImageUrl(image)" alt=""
                        class="rounded-md"
                        v-for="( image, index ) in product.images" :key="product.id">
                    </div>
                </div>
                <div>
                    <p class="font-bold pb-[4px] text-[14px]">Thông tin cơ bản</p>
                    <div>
                        Tên sản phẩm: {{product.name}}
                    </div>
                    <div>
                      Mã sản phẩm: {{product.code}}
                    </div>
                    <div class="whitespace-nowrap">Thương hiệu: {{product.brand.name}}</div>
                    <div class="whitespace-nowrap">Loại hàng: {{product.category.name}}</div>
                    <div class="">Số lượng: {{product.quantity}}</div>
                    <div class="pb-[10px]">Giá sản phẩm: {{product.locale_price}}</div>
                </div>
                <div class="">
                    <p class="font-bold text-[14px] pb-[4px]">Mô tả sản phẩm:</p>
                    <p>{{ product.description }}</p>
                </div>
                <hr>
                <div class="pt-[16px] flex justify-end gap-[16px]">
                    <button class="px-[8px] py-[4px] rounded-md border bg-[var(--main-dark-color)]
                    text-white whitespace-nowrap" >
                        Cập nhật thông tin
                    </button>
                    <button class="px-[8px] py-[4px] rounded-md border bg-[var(--primary-red)] text-white"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import { defineComponent, onMounted, ref, reactive } from 'vue'
    import { useStore } from 'vuex'

    export default defineComponent({
        props: ['product'],

        setup(props) {
            const store = useStore();
            const updationable = ref(true);
            const new_product = reactive({
                images: [], name: '', price: 0, quantity: 0, description: '', brand_id: 1, category_id: 1
            });
            const hidden_modal = (id) => {
                var ele = document.getElementById(id);
                ele.style.display = 'none';
            };

            // const confirm_product = async (id) => {
            //     await store.dispatch('product/handleproduct', [id, 'CONFIRMED']);
            //     hidden_modal('product'+id);
            // };

            // const cancel_product = async (id) => {
            //     if (confirm('Bạn có muốn hủy đơn này không ?')) {
            //         await store.dispatch('product/handleproduct', ['CANCELLED', id]);
            //     }
            // }

            const getImageUrl = (image) => {
                return `data:${image.type};base64,${image.data}`;
            };
            const setFile = (e) => {
                new_product.images = e.target.files;
            }

            return {
                hidden_modal, getImageUrl, updationable, new_product, setFile
            }
        }
    })
</script>

<style scoped>
    .product_modal {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: 100px;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 16px;
        border-radius: 10px;
    }

    section {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,0.25);
    }
</style>
