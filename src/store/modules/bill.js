import base_url from "../base_url";
import router from '../../router/index'
import { useToast } from "vue-toastification";

const toast  = useToast();

const state = {
    all_bills: [],
    bills: [],
    errors: [],
    recent_pending_bills: [],
    recent_approved_bills: [],
    recent_cancelled_bills: [],
    recent_done_bills: [],
    total_page: 0,
    pending_bills: [],
    approved_bills: [],
    cancelled_bills: [],
    done_bills: [],
    new_bill: [],
    recent_new_bill: [],
    detail_bill: []
}

const getters = {
    token:state => state.token,
    errors:state => state.errors,
    recent_bills:state => state.recent_bills,
    total_page:state => state.total_page,
    all_bills:state => state.all_bills,
    recent_done_bills:state => state.recent_done_bills,
    recent_pending_bills:state => state.recent_pending_bills,
    recent_approved_bills:state => state.recent_approved_bills,
    recent_cancelled_bills:state => state.recent_cancelled_bills,
    new_bill:state => state.new_bill,
    recent_new_bill:state => state.recent_new_bill,
    detail_bill:state => state.detail_bill
}

const mutations = {
    SET_DEFINE_BILLS(state, payload) {
        var recent_bills = [];
        recent_bills = payload.bills
        recent_bills.data = Object.values(recent_bills.data).map((recent_bill) => {
            const my_time = new Date();
            const bill_time = new Date(recent_bill.updated_at);

            const diffInMilliseconds = Math.abs(my_time - bill_time);
            const calculate_time = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
            recent_bill.day = recent_bill.updated_at;
            recent_bill.updated_at = calculate_time > 1 ? calculate_time + ' ngày trước' : Math.ceil(diffInMilliseconds / (1000 * 60 * 60)) + ' giờ trước';

            recent_bill.total = recent_bill.total.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
            });

            if (recent_bill.user == null) {
                recent_bill.user = {name: 'Khách lẻ'}
            }
            return recent_bill;
        });

        switch (payload.status) {
            case 'PENDING':
                state.recent_pending_bills =  recent_bills;
                break;
            case 'APPROVED':
                state.recent_approved_bills =  recent_bills;
                break;
            case 'CANCELLED':
                state.recent_cancelled_bills =  recent_bills;
                break;
            case 'DONE':
                state.recent_done_bills =  recent_bills;
                break;
            case 'NEW':
                state.recent_new_bill = recent_bills
                break;
            default:
                break;
        }
    },

    SET_ALL_BILLS(state, bills) {
       state.all_bills = bills;
       state.all_bills.data.forEach(bill => {
            switch (bill.status) {
                case 'PENDING':
                    state.pending_bills.push(bill);
                    break;
                case 'APPROVED':
                    state.approved_bills.push(bill);
                    break;
                case 'CANCELLED':
                    state.cancelled_bills.push(bill);
                    break;
                case 'DONE':
                    state.done_bills.push(bill);
                    break;
                case 'NEW':
                    state.new_bill = bill
                    break;
                default:
                    break;
            }
       });
    },

    SET_ERRORS(state, errors) {
        state.errors = errors;
    },
    UPDATE_BILLS(state, [bill, target_status]) {
        switch (target_status) {
            case 'PENDING':
                state.recent_pending_bills.push(bill);
                break;
            case 'APPROVED':
                state.recent_approved_bills.push(bill);
                break;
            case 'CANCELLED':
                state.recent_cancelled_bills.push(bill);
                break;
            case 'DONE':
                state.recent_done_bills.push(bill);
                break;
            case 'NEW':
                state.new_bill = bill
                break;
            default:
                break;
        }
    },

    ADD_BILL(state, bill) {
        state.new_bill = bill;
    },

    DELETE_BILL(state, bill_id) {
        state.recent_pending_bills.data = state.recent_pending_bills.data.filter(bill => {
            if ( bill.id != bill_id) return bill;
        });
        state.pending_bills = state.pending_bills.filter(bill => bill.id != bill_id);
    },

    SET_DETAIL_BILL(state, bill) {
        state.detail_bill = bill;

        const my_time = new Date();
        const bill_time = new Date(bill.updated_at);

        const diffInMilliseconds = Math.abs(my_time - bill_time);
        const calculate_time = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
        state.detail_bill.updated_at = calculate_time > 1 ? calculate_time + ' ngày trước' : Math.ceil(diffInMilliseconds / (1000 * 60 * 60)) + ' giờ trước';

        state.detail_bill.total = state.detail_bill.total.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });

        if (state.detail_bill.user == null) {
            state.detail_bill.user = {name: 'Khách lẻ'}
        }
    }
}

const actions = {
    async getBills({dispatch, state, commit}, [status, page, perPage]) {
        await base_url.getBill('filter', status, page, perPage).then((result) => {
            if(status == 'null' && perPage == 'all') {
                commit('SET_ALL_BILLS', result.data.data);
            }
            else {
                var bills = result.data;
                commit('SET_DEFINE_BILLS', {
                    'bills': bills,
                    'page': page,
                    'status': status,
                });
            }
        }).catch((err) => {
            commit('SET_ERRORS', err.response);
        });
    },

    async userGetBills({commit}, [status, page, perPage]) {
        try {
            await base_url.userGetBill('filter', status, page, perPage).then((result) => {
                var bills = result.data;
                commit('SET_DEFINE_BILLS', {
                    'bills': bills,
                    'page': page,
                    'status': status,
                });
            })
        } catch (err) {
            commit('SET_ERRORS', err.response.data.message);
        }
    },

    async handleBill({commit}, [bill_id, bill, target_status]) {
        try {
            await base_url.handleBill(bill_id, target_status).then((response) => {
                router.push({name: 'bills'})
                commit('UPDATE_BILLS', [bill, target_status]);
                toast.success('Cập nhật thành công', {timeout: 2000});
            })
        } catch (error) {
            if (error.response != null){
                commit('SET_ERRORS', error.response.data.missing_products);
                toast.error("Sản phẩm trong kho không đủ !");
           }
            else {
                toast.warning("Thực hiện không thành công!");
            }
        }
    },

    async addBill({commit}, bill) {
        try {
            await base_url.createBill(bill).then((result) => {
                var bill = result.data;
                commit('ADD_BILL', bill);
                toast.success("Đặt đơn hàng thành công !")
            })
        } catch (error) {
            commit('SET_ERRORS', error.response.data.message);
            if(error.response.data.message.address) {
                toast.warning(error.response.data.message.address[0])
            }
            else if(error.response.data.message.customer_phone) {
                toast.warning(error.response.data.message.customer_phone[0])
            }
            else {
                toast.warning(error.response.data.message)
            }
        }
    },

    async userUpdateBill({commit}, bill) {
        try {
            await base_url.userUpdateBill(bill);
        } catch (error) {
            console.log(error.response.data.message);
            commit('SET_ERRORS', error.response.data.message);
            toast.warning(error.response.data.message);
        }
    },

    async userDeleteBill({commit}, bill_id) {
        try {
            await base_url.userDeleteBill(bill_id).then((result) => {
                commit('DELETE_BILL', bill_id);
                toast.success("Hủy đơn thành công");
            })
        } catch (error) {
            commit('SET_ERRORS', error);
            toast.warning("Không thể xóa đơn hàng này!")
        }
    },

    async userGetBill({commit}, bill_id) {
        try {
            await base_url.userShowBill(bill_id).then((result) => {
                commit('SET_DETAIL_BILL', result.data);
            })
        } catch (error) {
            commit('SET_ERRORS', error);
        }
    },

    async userShowBill({commit}, bill_id) {
        try {
            await base_url.adminShowBill(bill_id).then((result) => {
                commit('SET_DETAIL_BILL', result.data);
            })
        } catch (error) {
            commit('SET_ERRORS', error);
        }
    },

    async adminGetBill({commit}, bill_id) {
        try {
            await base_url.adminShowBill(bill_id).then((result) => {
                commit('SET_DETAIL_BILL', result.data);
            })
        } catch (error) {
            commit('SET_ERRORS', error);
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
