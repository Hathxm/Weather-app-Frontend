import {configureStore} from '@reduxjs/toolkit'
import userBasicDetailsSliceReducer from '../Redux/UserDetails/UserDetailsSlice'


export default configureStore({
    reducer:{
        user_basic_details:userBasicDetailsSliceReducer
    }
})