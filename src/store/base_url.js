import router from '../router' ;
import ls from 'localstorage-slim'
// const baseUrl = 'https://68bb-2001-ee0-4001-bfa1-6df2-96d1-95e2-89b4.ngrok-free.app'
const baseUrl = 'http://localhost:8000'
const URL_user = baseUrl + '/api/user/';
const URL_admin = baseUrl + '/api/admin/';
const URL_bill = baseUrl + '/api/bills/';
const URL_product = baseUrl + '/api/products/';
const URL_brand = baseUrl + '/api/brands/';
const URL_category = baseUrl + '/api/categories/';
const URL_voucher = baseUrl + '/api/vouchers/';
const URL_cart_item = baseUrl + '/api/cart-items/';
import axios from 'axios'
import bill from './modules/bill';

export default {
    userLogin(url, user)
    {
        return axios.post(URL_user + url, user);
    },


    // admin
    getAdminHeader()
    {
        let token = ls.get('token_admin');
        if(token == null) {
            return {}
        }
        return {'Authorization': `Bearer ${token}`}
    },

    adminLogin(url, admin)
    {
        return axios.post(URL_admin + url, admin);
    },

    adminNotifications()
    {
        return axios.get(
            URL_admin + 'notifications',
            {headers: this.getAdminHeader() }
        )
    },

    // bill
    getBill(url, status, page, perPage) {
        if(perPage == null) perPage = 10;
        return axios.get(
            URL_bill + url + '?status=' + status + '&page=' + page + '&perPage=' + perPage,
            { headers: this.getAdminHeader() }
        );
    },

    handleBill(bill_id, target_status) {
        return axios.patch(
            URL_admin + 'bills',
            {'bill_id': bill_id, 'status': target_status},
            { headers: this.getAdminHeader() }
        );
    },

    adminShowBill(bill_id) {
        return axios.get(
            URL_bill + bill_id,
            {headers: this.getAdminHeader()}
        )
    },

    //product
    getProduct(page) {
        return axios.get(
            URL_product + '?page=' + page,
        );
    },

    getGoodProduct(params) {
        return axios.get(
            URL_product,
            {params: params}
        )
    },

    getDefineProduct(id) {
        return axios.get(
            URL_product + id,
        )
    },

    updateProduct(id, product) {
        return axios.post(
            URL_admin + 'products/' + id,
            product,
            { headers: this.getAdminHeader() }
        )
    },

    deleteProduct(id) {
        return axios.delete(
            URL_admin + 'products/' + id,
            { headers: this.getAdminHeader() }
        )
    },

    addProduct(product) {
        return axios.post(
            URL_admin + 'products/',
            product,
            { headers: this.getAdminHeader()}
        )
    },

    importProduct(product) {
        return axios.post(
            URL_admin + 'products/import',
            product,
            { headers: this.getAdminHeader()}
        )
    },

    searchProduct(params) {
        return axios.post(
            URL_product + 'search',
            {
                code: params.code,
                name: params.name,
                category: params.category,
                brand: params.brand,
                limit: params.limit,
                page: params.page
            }
        )
    },

    // brand
    getBrand() {
        return axios.get(
            URL_brand
        )
    },

    updateBrand(id, name) {
        return axios.patch(
            URL_admin + 'brands/' + id,
            {name: name},
            { headers: this.getAdminHeader()}
        )
    },

    deleteBrand(id) {
        return axios.delete(
            URL_admin + 'brands/' + id,
            {headers: this.getAdminHeader()}
        )
    },

    createBrand(brand) {
        return axios.post(
            URL_admin + 'brands',
            brand,
            {headers: this.getAdminHeader()}
        )
    },

    //category
    getCategory() {
        return axios.get(
            URL_category
        )
    },
    updateCategory(id, name) {
        return axios.patch(
            URL_admin + 'categories/' + id,
            {name: name},
            { headers: this.getAdminHeader()}
        )
    },

    deleteCategory(id) {
        return axios.delete(
            URL_admin + 'categories/' + id,
            {headers: this.getAdminHeader()}
        )
    },

    createCategory(category) {
        return axios.post(
            URL_admin + 'categories',
            category,
            { headers: this.getAdminHeader() }
        )
    },

    //voucher
    getVoucher(page) {
        return axios.get(
            URL_admin + 'vouchers?page=' + page,
            { headers: this.getAdminHeader() }
        )
    },

    getDefineVoucher(id) {
        return axios.get(
            URL_voucher + id
        )
    },

    updateVoucher(id, voucher) {
        return axios.patch(
            URL_admin + 'vouchers/' + id,
            voucher,
            {headers: this.getAdminHeader()}
        )
    },

    deleteVoucher(id) {
        return axios.delete(
            URL_admin + 'vouchers/' + id,
            {headers: this.getAdminHeader()}
        )
    },

    searchVoucher(name, page) {
        return axios.get(
            URL_admin + 'vouchers?name=' + name+ '&page=' + page,
            { headers: this.getAdminHeader() }
        )
    },

    addVoucher(voucher) {
        return axios.post(
            URL_admin + 'vouchers',
            voucher,
            {headers: this.getAdminHeader()}
        )
    },

    // cart_items
    getUserHeader()
    {
        let token = ls.get('token_user');
        if(token == null) {
            return {}
        }
        return {'Authorization': `Bearer ${token}`}
    },

    getCartItems() {
       return axios.get(
            URL_cart_item,
            {headers: this.getUserHeader()}
       )
    },

    addCartItem(cart_item) {
        return axios.post(
            URL_cart_item,
            cart_item,
            {headers: this.getUserHeader()}
        )
    },

    updateCartItem(id, bill_id) {
        return axios.patch(
            URL_cart_item + id ,
            {bill_id: bill_id},
            {headers: this.getUserHeader()}
        )
    },

    deleteCartItem(id) {
        return axios.delete(
            URL_user + 'cart-items/' + id +'/',
            {headers: this.getUserHeader()}
        )
    },

    // user
    getUserInfo() {
        return axios.get(
            URL_user + 'me',
            {headers: this.getUserHeader()}
        )
    },

    userGetBill(url, status, page, perPage) {
        if(perPage == null) perPage = 10;
        return axios.get(
            URL_bill + url + "?perPage=" + perPage + "&page=" + page + "&status=" + status,
            {headers: this.getUserHeader()}
        )
    },
    createBill(bill) {
        return axios.post(
            URL_bill,
            bill,
            { headers: this.getUserHeader()}
        );
    },

    userUpdateBill(bill) {
        return axios.post(
            URL_bill + 'order',
            bill,
            {headers: this.getUserHeader()}
        )
    },

    userDeleteBill(bill_id) {
        return axios.delete(
            URL_user + 'bills/' + bill_id + '/cancel',
            { headers: this.getUserHeader() }
        );
    },

    userShowBill(bill_id) {
        return axios.get(
            URL_bill + bill_id + '/',
            { headers: this.getUserHeader() }
        )
    },

    userupdateInfo(user) {
        return axios.post(
            URL_user + 'update',
            user,
            {headers: this.getUserHeader()}
        )
    },

    userResetPassword(password) {
        return axios.patch(
            URL_user + 'reset-password',
            password,
            {headers: this.getUserHeader()}
        )
    },

    userForgetPassword(email) {
        return axios.post(
            URL_user + 'forget-password',
            email
        )
    },

    userRegister(user) {
        return axios.post(
            URL_user + 'register',
            user
        )
    }
}
