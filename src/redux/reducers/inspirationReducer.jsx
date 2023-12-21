import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentInspiration : null,
}

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