import base_url from "../base_url";
import ls from 'localstorage-slim'
import router from '../../router/index'
import { useToast } from "vue-toastification";

const toast  = useToast();

const state = {
    vouchers: [],
    defined_vouchers: [],
    recent_vouchers: [],
    errors: [],
    search_vouchers: [],
    recent_search_vouchers: [],
    voucher: []
}

const getters = {
    vouchers:state => state.vouchers,
    voucher:state => state.voucher,
    defined_vouchers:state => (id) => {
        return state.vouchers.find(cate => cate.id === id)
    },
    errors:state => state.errors,
    recent_vouchers:state => state.recent_vouchers,
    search_vouchers:state => state.search_vouchers,
    recent_search_vouchers:state => state.recent_search_vouchers,
}

const mutations = {
    SET_VOUCHERS(state, payload) {
        if (payload.vouchers != null) {
            var recent_vouchers = payload.vouchers;

            recent_vouchers.data = recent_vouchers.data.map((recent_voucher) => {
                recent_voucher.locale_condition = recent_voucher.value_condition.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                });
                return recent_voucher;
            });

            state.vouchers[`${payload.page - 1}`] = recent_vouchers;
        }
        state.recent_vouchers = state.vouchers[`${payload.page-1}`];
    },

    SEARCH_VOUCHERS(state, payload) {
        if (payload.vouchers != null) {
            var recent_vouchers = payload.vouchers;

            recent_vouchers.data = recent_vouchers.data.map((recent_voucher) => {
                recent_voucher.locale_condition = recent_voucher.value_condition.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                });
                return recent_voucher;
            });

            state.search_vouchers[`${payload.page - 1}`] = recent_vouchers;
        }
        state.recent_search_vouchers = state.search_vouchers[`${payload.page-1}`];
    },

    SET_ERRORS(state, errors) {
        state.errors = errors;
    },

    UPDATE_VOUCHER(state, new_voucher) {
        state.vouchers = state.vouchers.map(voucher => {
            if(voucher.id === new_voucher.id) {
                voucher = new_voucher;
            }

            return voucher;
        })

        state.recent_vouchers.data = state.recent_vouchers.data.map(voucher => {
            if(voucher.id === new_voucher.id) {
                voucher = new_voucher;
                voucher.locale_condition = voucher.value_condition.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                });
            }

            return voucher;
        })
    },

    GET_DIFINE_VOUCHER(state, voucher) {
        state.voucher = voucher;
    },

    DELETE_VOUCHER(state, id) {
        state.recent_vouchers.data = state.recent_vouchers.data.filter(voucher => {
            if (voucher.id != id)
                return voucher
        });
    }
}

const actions = {
    async getVouchers({commit, state}, page) {
        if (state.vouchers[page-1] == null) {
            await base_url.getVoucher(page).then((result) => {
                var vouchers = result.data;
                commit('SET_VOUCHERS', {'vouchers':vouchers, 'page':page});
            }).catch((err) => {
                commit('SET_ERRORS', err.response);
            });
        }
        else {
            commit('SET_VOUCHERS', {'vouchers':null, 'page':page});
        }
    },

    async searchVoucher({commit}, params) {
        try {
            await base_url.searchVoucher(params.name, params.page).then((result) => {
                var vouchers = result.data;
                commit('SEARCH_VOUCHERS', {'vouchers':vouchers, 'page': params.page});
            })
        } catch (error) {
            commit('SET_ERRORS', error.response.message)
        }

    },

    async updateVoucher({commit}, [id, voucher]) {
        try {
            console.log("hello");
            await base_url.updateVoucher(id, voucher)
            .then((result) => {
               commit('UPDATE_VOUCHER', result.data);
               toast.success('Cập nhật thành công', {timeout: 3000});
               router.push({name: 'vouchers'});
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

    async getDefineVoucher({commit}, id) {
        try {
            await base_url.getDefineVoucher(id)
            .then(result => {
                commit('GET_DIFINE_VOUCHER', result.data);
                console.log(result.data);
            })
        } catch (error) {
            console.log(error);
        }
    },

    async deleteVoucher({commit, state}, id) {
       try {
            await base_url.deleteVoucher(id).then((result) => {
                toast.success("Xoa thanh cong!");
                commit('DELETE_VOUCHER', id);
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

    async addVoucher({commit}, voucher) {
        console.log(voucher);
        try {
            await base_url.addVoucher(voucher)
            .then(() => {
                router.push({name: "vouchers"});
                toast.success("Thêm thành công!");
            })
        } catch (error) {
            commit('SET_ERRORS', error.response.data.message);
            toast.warning("Thực hiện không thành công!");

        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
