import base_url from "../base_url";
import router from '../../router/index';
import ls from 'localstorage-slim';
import { useToast } from "vue-toastification";

const toast = useToast();

const state = {
    user: [],
    token: '',
    errors: []
}

const getters = {
    user:state => state.user,
    token:state => state.token,
    errors:state => state.errors
}

const mutations = {
    SET_USER(state, user) {
        state.user = user.user;
        if(user.token) {
            state.token = user.token;
            ls.set('token_user', user.token, {ttl: 60*60*24});
        }
    },
    SET_ERRORS(state, errors) {
        state.errors = errors;
    },
}

const actions = {
    getUser({commit}, user) {
        base_url.userLogin('login', user).then((result) => {
            var user = result.data;
            console.log(user);
            commit('SET_USER', user);
            router.push({name: 'home'});
        }).catch((err) => {
            commit('SET_ERRORS', err.response.data.message);
        });
    },

    async getUserInfo({commit}) {
        try {
            await base_url.getUserInfo().then((result) => {
                commit('SET_USER', result.data);
            })
        } catch (error) {
            commit('SET_ERRORS', error);
        }
    },

    async userUpdateInfo({commit}, user) {
       try {
            await base_url.userupdateInfo(user).then((result) => {
                commit('SET_USER', {user: result.data});
                toast.success("Cập nhật thành công!");
            })
       } catch (error) {
            commit('SET_ERRORS', error.response.data.message);
            if (error.response.data.message.name)
                toast.warning(error.response.data.message.name[0]);
            else if (error.response.data.message.location)
                toast.warning(error.response.data.message.location[0]);
       }
    },

    async userResetPassword({commit}, password) {
        try {
            await base_url.userResetPassword(password).then((result) => {
                commit('SET_USER', result.data);
                toast.success("Cập nhật mật khẩu thành công!");
            })
        } catch (error) {
            commit('SET_ERRORS', error.response);
        }
    },

    async userForgetPassword({commit}, user) {
        try {
            await base_url.userForgetPassword(user).then((result) => {
                toast.success(result.data.message);
                router.push({name: 'login'});
            })
        } catch (error) {
            toast.warning(error.response.data.message);
            console.log(error);
        }
    },

    async userRegister({commit}, user) {
        try {
            await base_url.userRegister(user).then((result) => {
                toast.success("Bạn đã đăng ký thành công");
                router.push({name: 'login'});
            })
        } catch (error) {
            commit('SET_ERRORS', error.response.data.message)
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
