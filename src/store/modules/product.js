import base_url from "../base_url";
import router from '../../router/index'
import { useToast } from "vue-toastification";

const toast  = useToast();

const state = {
    products: [],
    errors: [],
    recent_products: [],
    total_page: 0,
    product: [],
    search_products: [],
    recent_search_products: [],
    good_products: [],
}

const getters = {
    errors:state => state.errors,
    recent_products:state => state.recent_products,
    total_page:state => state.total_page,
    product:state => state.product,
    search_products:state => state.search_products,
    recent_search_products:state => state.recent_search_products,
    good_products:state => state.good_products,
}

const mutations = {
    SET_PRODUCTS(state, payload) {
        if (payload.products != null) {
            var recent_products = payload.products;
            state.total_page = payload.products.last_page;

            recent_products.data = recent_products.data.map((recent_product) => {
                recent_product.locale_price = recent_product.price.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                });
                recent_product.name = recent_product.name.toUpperCase();
                return recent_product;
            });

            state.products[payload.page - 1] = recent_products;
        }
        state.recent_products = state.products[payload.page-1];
    },

    SEARCH_PRODUCTS(state, payload) {
        if (payload.products != null) {
            var recent_products = payload.products;
            state.total_page = payload.products.last_page;

            recent_products.data = recent_products.data.map((recent_product) => {
                recent_product.locale_price = recent_product.price.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                });
                return recent_product;
            });

            state.search_products[`${payload.page - 1}`] = recent_products;
        }
        state.recent_search_products = state.search_products[`${payload.page-1}`];
    },

    SET_ERRORS(state, errors) {
        state.errors = errors;
    },

    UPDATE_PRODUCT(state, new_product) {
        state.products = state.products.map(product => {
            if(product.id === new_product.id) {
                product = new_product;
            }

            return product;
        })

        state.recent_products.data = state.recent_products.data.map(product => {
            if(product.id === new_product.id) {
                product = new_product;
                product.locale_price = product.price.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                });
            }

            return product;
        })
    },

    GET_DIFINE_PRODUCT(state, product) {
        state.product = product;
        state.product.locale_price = product.price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    },

    DELETE_PRODUCT(state, id) {
        state.recent_products.data = state.recent_products.data.filter(product => {
            if (product.id != id)
                return product
        });
        //(id);
    },

    SET_GOOD_PRODUCT(state, products) {
        state.good_products = products.data
        .map(product => {
            product.locale_price = product.price.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
            });
            product.name = product.name.toUpperCase();
            return product;
        });

        //(state.good_products);
    }
}

const actions = {
    async getProducts({commit, state}, page) {
        if (state.products[page-1] == null) {
            await base_url.getProduct(page).then((result) => {
                var products = result.data;
                commit('SET_PRODUCTS', {'products':products, 'page':page});
            }).catch((err) => {
                commit('SET_ERRORS', err.response);
            });
        }
        else {
            commit('SET_PRODUCTS', {'products':null, 'page':page});
        }
    },

    async searchProduct({commit}, params) {
        try {
            await base_url.searchProduct(params).then((result) => {
                var products = result.data;
                commit('SEARCH_PRODUCTS', {'products':products, 'page': params.page});
            })
        } catch (error) {
            commit('SET_ERRORS', error.response.message)
        }

    },

    async updateProduct({commit}, [id, product]) {
        try {
            await base_url.updateProduct(id, product)
            .then((result) => {
               commit('UPDATE_PRODUCT', result.data);
               toast.success('Cập nhật thành công', {timeout: 3000});
               router.push({name: 'dashboard'});
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

    async getDefineProduct({commit}, id) {
        try {
            await base_url.getDefineProduct(id)
            .then(async (result) => {
                await commit('GET_DIFINE_PRODUCT', result.data);
                //(result.data);
            })
        } catch (error) {
            //(error);
        }
    },

    async deleteProduct({commit, state}, id) {
       try {
            await base_url.deleteProduct(id).then((result) => {
                toast.success("Xóa thành công!");
                commit('DELETE_PRODUCT', id);
            })
       } catch (error) {
            if (error.response != null)
                toast.error(error.response.data.message);
            else {
                toast.warning("Thực hiện không thành công!");
            }
       }
    },

    async addProduct({commit}, product) {
        //(product);
        try {
            await base_url.addProduct(product)
            .then(() => {
                router.push({name: "products"});
                toast.success("Thêm sản phẩm thành công!");
            })
        } catch (error) {
           if (error.response != null){
                commit('SET_ERRORS', error.response.data.message);
                toast.error("Bạn điền thiếu thông tin !");
           }
            else {
                toast.warning("Thực hiện không thành công!");
            }
        }
    },

    async importProduct({commit}, product_import) {
        try {
            await base_url.importProduct(product_import)
            .then(() => {
                toast.success("Thêm thành công!");
            })
        } catch (error) {
            toast.warning("File tải lên không đúng!");
        }
    },

    async getGoodProducts({commit}, params) {
        try {
            await base_url.getGoodProduct(params).then((result) => {
                var products = result.data;
                commit('SET_GOOD_PRODUCT', products);
            })
        } catch (error) {
            commit('SET_ERROR', error.response)
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
