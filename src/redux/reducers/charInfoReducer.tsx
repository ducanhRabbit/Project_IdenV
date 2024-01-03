import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Character } from '../../shared/types';

interface CharacterState {
    currentChar: Character,
}
const initialState:CharacterState = {
  currentChar:{
    id:1,
    photo:'../src/assets/img/Gardener.png',
    portrait:'../src/assets/img/Gardener-port.png',
    fullName:'Emma Woods',
    career:'Gardener',
    backStory:"Having found 'the one,' Emma can finally focus on perfecting her gardening skills. Maybe dear Mr. Scarecrow still needs some new duds. Replace the rotten straw, throw on a new hat. Of course, appearance isn't the only thing she cares about. But, hey, what's wrong with dressing up your dream lover? As long as you have the money.",
    birth:'December 12',
    interests:'Gardening, Handicrafts',
    talents:'Gardening, Repair Works',
    likes:'Canaries',
    role:"sur"
  },
    
}

const currentChar = createSlice({
  name: "charInfo",
  initialState,
  reducers: {
    getCharInfo: (state,action:PayloadAction<Character>) =>{
      state.currentChar = action.payload
    }
  }
});

export const {getCharInfo} = currentChar.actions

export default currentChar.reducer