import { configureStore } from '@reduxjs/toolkit'
import charInfoReducer from './reducers/charInfoReducer'

const store = configureStore({
  reducer: {
    charInfo: charInfoReducer,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store