import base_url from "../base_url";
import ls from 'localstorage-slim'
import router from '../../router/index'
import { useToast } from "vue-toastification";

const toast  = useToast();

const state = {
    categories: [],
    current_categories: [],
    errors: []
}

const getters = {
    categories:state => state.categories,
    current_categories:state => (id) => {
        return state.categories.find(cate => cate.id === id)
    },
    errors:state => state.errors
}

const mutations = {
    SET_CATEGORIES(state, categories) {
        state.categories = categories;
    },

    SET_CATEGORIES(state, categories) {
        state.categories = categories;
    },

    CREATE_CATEGORY(state, category) {
        //(category);
        state.categories.push(category);
    },

    SET_ERRORS(state, errors) {
        state.errors = errors;
    },

    UPDATE_CATEGORIES(state, id) {
        state.categories = state.categories.filter(cate => cate.id != id);
    }
}

const actions = {
    async getCategories({commit}, limit) {
        await base_url.getCategory(limit).then((result) => {
            const categories = result.data;
            commit('SET_CATEGORIES', categories);
        }).catch((err) => {
            commit('SET_ERRORS', err.response);
        })
    },
    async updateCategory({commit}, [id, name]) {
        await base_url.updateCategory(id, name).then((result) => {
            const brands = result.data;
            commit('SET_CATEGORIES', brands);
            toast.success("Cập nhật thành công!");
        }).catch((error) => {
            if (error.response != null){
                commit('SET_ERRORS', error.response.data.message);
                toast.error(error.response.data.message);
           }
            else {
                toast.warning("Thực hiện không thành công!");
            }
        })
    },

    async deleteCategory({commit}, [id]) {
        try {
            await base_url.deleteCategory(id).then((result) => {
                commit('UPDATE_CATEGORIES', id);
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

    async createCategory({commit}, category) {
        try {
            await base_url.createCategory(category).then((result) => {
                //(result.data);
                toast.success("Thêm thành công");
                commit('CREATE_CATEGORY', result.data);
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
