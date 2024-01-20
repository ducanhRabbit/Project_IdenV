import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { forwardRef, useEffect } from 'react'

function GetRefPlugin(props:any,ref:any) {
  const [editor] = useLexicalComposerContext()
  useEffect(()=>{
    ref.current = editor
    return ()=>{
      ref.current = null
    }
  },[editor,ref])

  return null
}

const forwardedMyLexical = forwardRef(GetRefPlugin)

export default forwardedMyLexical