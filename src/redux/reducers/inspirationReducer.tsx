import { createSlice } from '@reduxjs/toolkit'
import { Inspiration, User } from '../../shared/types';

interface currentInspiration{
  currentInspiration: User
}

const initialState = {
    
}as currentInspiration

const inspirationReducer = createSlice({
  name: 'inspiration',
  initialState,
  reducers: {
    setCurrentInspiration: (state,action)=>{
        state.currentInspiration = action.payload
    }
  }
});

export const {setCurrentInspiration} = inspirationReducer.actions

export default inspirationReducer.reducer