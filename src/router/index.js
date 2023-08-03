import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '../views/user/LoginView.vue'
import UserRegister from '../views/user/RegisterView.vue'
import AdminLogin from '../views/admin/LoginView.vue'
import DashBoard from '../views/admin/DashBoard.vue'
import ProductDetail from '../views/product/ProductDetail.vue'
import ProductView from '../views/product/ProductView.vue'
import AddProduct from '../views/product/AddProduct.vue'
import BillView from '../views/bill/BillView.vue'
import BrandView from '../views/brand/BrandView.vue'
import BrandDetail from '../views/brand/BrandDetail.vue'
import CategoryView from '../views/category/CategoryView.vue'
import CategoryDetail from '../views/category/CategoryDetail.vue'
import VoucherDetail from '../views/voucher/VoucherDetail.vue'
import VoucherView from '../views/voucher/VoucherView.vue'
import AddVoucher from '../views/voucher/AddVoucher.vue'
import HomeView from '../views/home/HomeView.vue'
import ProductHomeDetail from '../views/home/ProductHomeDetail.vue'
import CartView from '../views/user/CartView.vue'
import OrderView from '../views/user/OrderView.vue'
import AccountSecure from '../views/user/AccountSecure.vue'
import ForgetPassword from '../views/user/ForgetPassword.vue'
import OrderDetail from '../views/user/OrderDetail.vue'
import UserForgetPassword from '../views/user/UserForgetPassword.vue'
import BillDetail from '../views/bill/BillDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: UserLogin
    },
    {
      path: '/register',
      name: 'register',
      component: UserRegister
    },
    {
      path: '/admin-login',
      name: 'admin_login',
      component: AdminLogin
    },
    {
      path: '/admin/dashboard',
      name: 'dashboard',
      component: DashBoard
    },
    {
      path: '/admin/product_details',
      name: 'product_details',
      component: ProductDetail,
    },
    {
      path: '/admin/products',
      name: 'products',
      component: ProductView,
    },
    {
      path: '/admin/products/new',
      name: 'add_product',
      component: AddProduct,
    },
    {
      path: '/admin/bills',
      name: 'bills',
      component: BillView,
    },
    {
      path: '/admin/brands',
      name: 'brands',
      component: BrandView,
    },
    {
      path: '/admin/brand_details',
      name: 'brand_details',
      component: BrandDetail,
    },
    {
      path: '/admin/categories',
      name: 'categories',
      component: CategoryView,
    },
    {
      path: '/admin/category_details',
      name: 'category_details',
      component: CategoryDetail,
    },

    {
      path: '/admin/voucher_details',
      name: 'voucher_details',
      component: VoucherDetail,
    },
    {
      path: '/admin/vouchers',
      name: 'vouchers',
      component: VoucherView,
    },
    {
      path: '/admin/vouchers/new',
      name: 'add_voucher',
      component: AddVoucher,
    },
    {
      path: '/san-pham',
      name: 'chi_tiet_san_pham',
      component: ProductHomeDetail
    },
    {
      path: '/gio-hang',
      name: 'gio_hang',
      component: CartView
    },
    {
      path: '/don-hang',
      name: 'don_hang',
      component: OrderView
    },
    {
      path: '/tai-khoan',
      name: 'tai_khoan',
      component: AccountSecure
    },
    {
      path: '/mat-khau',
      name: 'mat_khau',
      component: ForgetPassword
    },
    {
      path: '/don-hang/:id',
      name: 'chi_tiet_don_hang',
      component: OrderDetail
    },
    {
      path: '/quen-mat-khau',
      name: 'quen_mat_khau',
      component: UserForgetPassword
    },
    {
      path: '/don-hang-cua-khach/:id',
      name: 'don_hang_cua_khach',
      component: BillDetail
    },
  ]
})

export default router
