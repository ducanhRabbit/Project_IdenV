import { configureStore } from '@reduxjs/toolkit'
import charInfoReducer from './reducers/charInfoReducer'
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    charInfo: charInfoReducer,
    user: userReducer
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store