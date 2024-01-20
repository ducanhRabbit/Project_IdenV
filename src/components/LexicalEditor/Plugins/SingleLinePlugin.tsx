import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LineBreakNode } from 'lexical'
import { useEffect } from 'react'

function SingleLinePlugin() {
    const [editor] = useLexicalComposerContext()
    const latestEditorState = editor.getEditorState()
    useEffect(()=>{
        editor.registerNodeTransform(LineBreakNode,(node)=>{
            node.remove()
        })
    },[editor,latestEditorState])
  return (
    null
  )
}

export default SingleLinePlugin