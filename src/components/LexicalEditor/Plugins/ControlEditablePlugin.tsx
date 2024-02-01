import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

function ControlEditablePlugin({editable=true}) {
    const [editor] = useLexicalComposerContext()
    useEffect(()=>{
        editor.setEditable(editable)
    },[editable])
  return (
    null
  )
}

export default ControlEditablePlugin