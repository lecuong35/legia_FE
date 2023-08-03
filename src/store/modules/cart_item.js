import base_url from "../base_url";
import ls from 'localstorage-slim'
import router from '../../router/index'
import { useToast } from "vue-toastification";

const toast  = useToast();

const state = {
    cart_items: [],
    bill_id: [],
    errors: [],
}

const getters = {
    cart_items:state => state.cart_items,
    errors:state => state.errors,
    bill_id:state => state.bill_id,
    selected_items:state => state.cart_items.filter(item => item.selected == true),
    unselected_items:state => state.cart_items.filter(item => item.selected == false),
}

const mutations = {
    SET_CART_ITEM(state, cart_items) {
       var cart_item = cart_items;
       cart_item.selected = true;
       state.cart_items.push(cart_item);
    },

    SET_ERRORS(state, errors) {
        state.errors = errors;
    },

    UPDATE_SELECTED(state, id) {
        state.cart_items = state.cart_items.map(item => {
            if(item.product_id === id) {
                item.selected = !item.selected;
            }
            return item;
        })
    },

    DELETE_CART_ITEM(state, id) {
        state.cart_items = state.cart_items.filter(item => {
            if (item.id != id)
                return item
        });
    },

    UPDATE_CART_ITEM(state, cart_item) {
        state.cart_items = state.cart_items.map(item => {
            if(item.id === cart_item.id) {
                item = cart_item;
            }
            return item;
        })
    },

    GET_USER_ITEMS(state, cart_items) {
        state.cart_items = cart_items.map(item => {
            item.selected = true;
            return item;
        })
    },

    SET_BILL_ID(State, bill_id, cart_item) {
        state.cart_items = state.cart_items.map(item => {
            if(item.id === cart_item.id) {
                item.bill_id = bill_id;
            }
            return item;
        })
    }
}

const actions = {
   async addCartItem({commit},cart_item) {
        try {
            await base_url.addCartItem(cart_item).then((result) => {
                commit('SET_CART_ITEM', result.data);
            })
        } catch (error) {
            commit('SET_ERRORS', error.message);
        }
   },

   async updateCartItem({commit}, [id, bill_id]) {
        try {
            await base_url.updateCartItem(id, bill_id).then((result) => {
                commit('UPDATE_CART_ITEM', result.data);
            })
        } catch (error) {
            commit('SET_ERRORS', error.message);
        }
   },

   async getCartItems({commit}) {
        try {
            await base_url.getCartItems().then((result) => {
                commit('GET_USER_ITEMS', result.data);
            })
        } catch (error) {
            commit('SET_ERRORS', error.response);
        }
   },

   async deleteCartItem( {commit}, id) {
        try {
            await base_url.deleteCartItem(id).then((result) => {
                commit('DELETE_CART_ITEM', id);
                toast.success("Xóa thành công !");
            })
        } catch (error) {
            toast.warning("Không thể xóa !");
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
