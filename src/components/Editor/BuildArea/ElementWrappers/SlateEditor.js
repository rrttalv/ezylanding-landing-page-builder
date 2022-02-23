import React, { useEffect, useMemo, useState } from "react";
import { MobXProviderContext, observer } from "mobx-react";
import { createEditor, Editor, Transforms } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'

export const SlateEditor = observer((props) => {

  const initialValue = [
    {
      type: props.elem.type,
      children: [
        {
          text: props.elem.content
        }
      ]
    }
  ]

  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  useEffect(() => {
    ReactEditor.focus(editor)
    Transforms.select(editor, Editor.end(editor, []));
    app.setSelectedElement(props.elem.id, props.parentId)
  }, [])

  const { store: { app } } = getStore()

  const handleChange = (value) => {
    setValue(value)
    const stringValue = value.map(val => {
      return val.children.map(child => child.text).join('')
    }).join('\n')
    if(props.elem.content !== stringValue){
      app.changeElementProp(props.elem.id, props.elem.type, 'content', stringValue)
    }
  }

  const handleClick = e => {
    app.setSelectedElement(props.elem.id, props.parentId)
    e.stopPropagation()
  }

  return (
    <div 
      style={{...props.style, position: 'relative'}}
      onPointerDown={e => handleClick(e)}
      onClick={e => handleClick(e)}
      onDoubleClick={e => app.setActiveTextEditor(null, null)}
      className='text-editor-wrapper'
    >
      <Slate editor={editor} value={value} onChange={value => handleChange(value)}>
        <Editable placeholder="Enter some plain text..." />
      </Slate>
    </div>
  )

})