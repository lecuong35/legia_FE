import { createStore, createLogger } from 'vuex'
import admin from './modules/admin'
import product from './modules/product'
import user from './modules/user'
import bill from './modules/bill'
import brand from './modules/brand'
import category from './modules/category'
import voucher from './modules/voucher'
import cart_item from './modules/cart_item'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
    modules: {
      admin,
      product,
      user,
      bill,
      brand,
      category,
      voucher,
      cart_item
   },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
