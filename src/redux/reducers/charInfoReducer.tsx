import { createSlice } from '@reduxjs/toolkit'
import { Character } from '../../shared/types';

interface CharacterState {
    currentInfo: Character,
    charType: String,
    charCarousel:any[]
}
const initialState = {
  currentInfo:{
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
  charType: 'sur',
  charCarousel: [],
    
} as CharacterState

const currentChar = createSlice({
  name: "charInfo",
  initialState,
  reducers: {
    getCharInfo: (state,action) =>{
      state.currentInfo = action.payload
    },
    setCharType: (state,action)=>{
      state.charType = action.payload
    },
    setCharArr: (state,action)=>{
      state.charCarousel = action.payload
    }

  }
});

export const {getCharInfo,setCharType,setCharArr} = currentChar.actions

export default currentChar.reducer