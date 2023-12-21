import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser : null
}

const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state,action)=>{
        state.currentUser = action.payload
    }
  }
});

export const {setCurrentUser} = userReducer.actions

export default userReducer.reducer