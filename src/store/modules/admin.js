import base_url from "../base_url";
import ls from 'localstorage-slim'
import router from '../../router/index'
import { useToast } from "vue-toastification";

const toast = useToast();

const state = {
    admin: [],
    token: '',
    errors: []
}

const getters = {
    admin:state => state.admin,
    token: () => ls.get('token_admin'),
    errors:state => state.errors
}

const mutations = {
    SET_ADMIN(state, admin) {
        state.admin = admin.admin;
        state.token = admin.token;
        ls.set('token_admin', admin.token, {ttl: 60*60*24});
    },
    SET_ERRORS(state, errors) {
        state.errors = errors;
    }
}

const actions = {
    getAdmin({commit}, admin) {
        base_url.adminLogin('login', admin).then((result) => {
            var admin = result.data;
            commit('SET_ADMIN', admin);
            router.push({name: 'dashboard'});
            toast.success("Đăng nhập thành công !")
        }).catch((err) => {
            commit('SET_ERRORS', err.response.data.message);
            toast.warning("Đăng nhập không thành công !");
        });
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
