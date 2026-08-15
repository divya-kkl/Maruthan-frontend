import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slice/userSlice';
import topBannerReducer from './Slice/topBannerSlice';
import headerReducer from './Slice/headerSlice';
import bannerReducer from './Slice/bannerSlice';
import topproductsReducer from './Slice/productShowcasesSlice';
import storeReducer from './Slice/storeSlice'
import storeFeaturesReducer from './Slice/storeFeaturesSlice';
import footerReducer from './Slice/footerSlice';
import FAQReducer from './Slice/FAQSlice';
import addressReducer from './Slice/addressSlice';
import cartReducer from './Slice/cartSlice';
import sizeChartReducer from './Slice/sizeChartSlice';
import categoryProductsReducer from './Slice/categoryProductsSlice';
import checkoutReducer from './Slice/checkoutSlice';
import productDetailsReducer from './Slice/productDetailsSlice';
import reviewReducer from './Slice/reviewSlice';
import tagProductsReducer from './Slice/tagProductsSlice';
import wishlistReducer from './Slice/wishlistSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    topBanner: topBannerReducer,
    category: headerReducer,
    banner: bannerReducer,
    product: topproductsReducer,
    store: storeReducer,
    storeFeatures: storeFeaturesReducer,
    footer: footerReducer,
    FAQ: FAQReducer,
    address: addressReducer,
    cart: cartReducer,
    sizeChart: sizeChartReducer,
    categoryProducts: categoryProductsReducer,
    checkout: checkoutReducer,
    productDetails: productDetailsReducer,
    reviews: reviewReducer,
    tagProducts: tagProductsReducer,
    wishlist: wishlistReducer,
  },
});
