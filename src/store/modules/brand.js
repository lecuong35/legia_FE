import base_url from "../base_url";
import ls from 'localstorage-slim'
import router from '../../router/index'
import { useToast } from "vue-toastification";

const toast  = useToast();

const state = {
    brands: [],
    current_brands: [],
    errors: []
}

const getters = {
    brands:state => state.brands,
    current_brands:state => (id) => {
        return state.brands.find(brand => brand.id === id)
    },
    errors:state => state.errors
}

const mutations = {
    SET_BRANDS(state, brands) {
        state.brands = brands;
    },

    CREATE_BRAND(state, brand) {
        state.brands.push(brand);
    },

    SET_ERRORS(state, errors) {
        state.errors = errors;
    },

    UPDATE_BRANDS(state, id) {
        state.brands = state.brands.filter(brand => brand.id != id);
    }
}

const actions = {
    async getBrands({commit}) {
        await base_url.getBrand().then((result) => {
            const brands = result.data;
            commit('SET_BRANDS', brands);
        }).catch((err) => {
            commit('SET_ERRORS', err.response);
        })
    },

    async updateBrand({commit}, [id, name]) {
        await base_url.updateBrand(id, name).then((result) => {
            const brands = result.data;
            commit('SET_BRANDS', brands);
            toast.success("Cập nhật thành công!");
        }).catch((err) => {
            if (error.response != null){
                commit('SET_ERRORS', error.response.data.message);
                toast.error(error.response.data.message);
           }
            else {
                toast.warning("Thực hiện không thành công!");
            }
        })
    },

    async deleteBrand({commit}, [id]) {
        try {
            await base_url.deleteBrand(id).then((result) => {
                commit('UPDATE_BRANDS', id);
                toast.success("Xóa thành công!");
            })
        } catch (error) {
            if (error.response != null){
                commit('SET_ERRORS', error.response.data.message);
                toast.error(error.response.data.message);
           }
            else {
                toast.warning("Thực hiện không thành công!");
            }
        }
    },

    async createBrand({commit}, brand) {
        try {
            await base_url.createBrand(brand).then((result) => {
                console.log(result.data);
                toast.success("Thêm thành công !");
                commit('CREATE_BRAND', result.data);
            })
        } catch (error) {
            if (error.response != null){
                commit('SET_ERRORS', error.response.data.message);
                toast.error(error.response.data.message);
           }
            else {
                toast.warning("Thực hiện không thành công!");
            }
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
