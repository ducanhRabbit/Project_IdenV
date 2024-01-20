import { configureStore } from '@reduxjs/toolkit'
import charInfoReducer from './reducers/charInfoReducer'
import userReducer from './reducers/userReducer';
import inspirationReducer from './reducers/inspirationReducer';

const store = configureStore({
  reducer: {
    charInfo: charInfoReducer,
    user: userReducer,
    inspiration: inspirationReducer
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store