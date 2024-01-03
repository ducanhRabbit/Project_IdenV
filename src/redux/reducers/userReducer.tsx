import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../shared/types';

interface userState{
  currentUser: User | null
}

const initialState = {
    currentUser : null
}as userState

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