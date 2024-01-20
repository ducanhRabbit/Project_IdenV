import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

interface SetInitialTextPluginProps{
  state:string,
  dependencie:any
}

export default function SetInitialTextPlugin({state,dependencie}:SetInitialTextPluginProps) {

    const [editor] = useLexicalComposerContext()
    useEffect(()=>{
      if(state){
        const parde = editor.parseEditorState(JSON.parse(state))
        editor.setEditorState(parde)
      }
    },[dependencie])
 return <></>
}
