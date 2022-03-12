import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import { List } from 'react-virtualized';
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another
import { camelToDash } from '../../../../utils';
import { ReactComponent as PlusIcon } from '../../../../svg/plus.svg';
import { camelCase as dashToCamel } from 'lodash'
import { CodeEditorEditable } from 'react-code-editor-editable';
import 'highlight.js/styles/tomorrow-night-eighties.css';
import { ChromePicker } from 'react-color'



const ListElement = (props) => {
  
  useEffect(() => {

  }, [props.rows])
  
  const getValue = (value, index) => {
    let elems = null
    let set = false
    if(value.indexOf('  ') === -1 && (value.includes('}') || value.includes('{') || value.includes(','))){
      set = true
      elems = <>
          <code
            className='hljs-selector-tag'
            data-index={index}
          >
            {value}
          </code>
        </>
    }
    if(!set && (value.indexOf(';') !== -1 || value.indexOf(':') !== -1 || value.indexOf(' ') !== -1)){
      elems = <>
          <code
            className='hljs-params'
            data-index={index}
          >
            {value}
          </code>
        </>
    }
    return elems
  }

  function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) {
    const value = String(props.codeValue[index])
    return (
      <div 
        key={key} 
        style={{
          ...style, 
          whiteSpace: 'nowrap'
        }}
      >
        {
          getValue(value, index)
        }
      </div>
    );
  }

  return (
    <List
      style={{
        background: '#282a36',
        paddingTop: '10px'
      }}
      width={400}
      height={500}
      rowCount={props.codeValue.length}
      rowHeight={20}
      rowRenderer={rowRenderer}
    />
  )

}

export const Code = observer((props) => {

  const [codeRows, setCodeRows] = useState('')

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { sidebar, app } } = getStore()

  const activeTab = app.cssTabs.find(({ active, selected }) => active && selected)

  const { palette } = app

  useEffect(() => {
    setCodeRows(activeTab.content)
    const codeEditor = document.querySelector('.container-code-editor__qxcy .code-editor__textarea__qxcy')
    if(codeEditor){
      codeEditor.setAttribute('maxLength', 25000)
    }
  }, [activeTab])

  const changeActiveTab = (id) => {
    if(activeTab.unsaved){
      app.saveTabContent(activeTab.id, codeRows)
    }
    setTimeout(() => {
      app.changeActiveTab(id)
    }, 50)
  }

  const handleChange = value => {
    setCodeRows(value)
    app.setTabChanged(activeTab.id, value)
    const codeEditor = document.querySelector('.container-code-editor__qxcy .code-editor__textarea__qxcy')
    if(codeEditor){
      codeEditor.setAttribute('maxLength', 25000)
    }
  }

  const hasActiveChanges = () => {
    const list = app.cssTabs.filter(({ unsaved }) => unsaved)
    return list.length === 0
  }

  const handleSave = () => {
    app.saveTabContent(activeTab.id, codeRows)
  }

  const addNew = () => {
    app.saveTabContent(activeTab.id, codeRows)
    setTimeout(() => {
      app.addCustomCSSTab()
    }, 50)
  }

  const handlePaletteChange = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    app.editPaletteProp(id, e.target.name, e.target.value)
  }

  const toggleEditing = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    app.togglePaletteEditing(id)
  }

  const handleColorChange = (color, id) => {
    const { rgb: { r, g, b, a } } = color
    app.editPaletteProp(id, 'value', `rgba(${r}, ${g}, ${b}, ${a})`)
  }

  const getPaletteItems = () => {
    const editingItem = palette.find(({ isEditing }) => isEditing)
    return (
      <div className='palette-items' style={{ paddingBottom: editingItem ? '200px' : '25px' }}>
        {
          palette.map((item, idx) => {
            const { name, id, var: varName, value, isEditing } = item
            return (
              <div key={id} className={`palette-item${idx + 1 === 1 || (idx + 1) % 4 === 0 ? ' first-grid-item' : ''}`}>
                <div className='palette-item_color' onClick={e => toggleEditing(e, id)} style={{ background: value }} />
                {
                  isEditing ? (
                    <ChromePicker
                      styles={{
                        wrap: {
                          width: '100%'
                        }
                      }}
                      color={value}
                      onChangeComplete={color => handleColorChange(color, id)}
                    />
                  )
                  :
                  undefined
                }
                <span className='palette-item_text'>{varName}</span>
                <span className='palette-item_value'>{value}</span>
              </div>
            )
          })
        }
      </div>
    )
  }

  return (
    <div 
      className='code-slide slide-item'
    >
      <div className='code-slide_wrapper'>
        <h6 className='code-slide_title'>Customize CSS</h6>
        <div className='code-slide_tabs'>
          {
            app.cssTabs.map((tab, idx) => (
              <React.Fragment key={tab.id}>
              {
                tab.active ? (
                  tab.selected ? (
                    <div key={tab.id} className='code-slide_tab active'>
                      {
                        tab.name
                      }
                      {
                        tab.unsaved ? '*' : undefined
                      }
                    </div>
                  )
                  :
                  <div key={tab.id} className='code-slide_tab inactive' onClick={e => changeActiveTab(tab.id)} >
                    {
                      tab.name
                    }
                    {
                      tab.unsaved ? '*' : undefined
                    }
                  </div>
                )
                :
                undefined
              }
              {
                app.cssTabs.length - 1 === idx ? (
                  <div 
                    className='code-slide_add-file'
                    onClick={() => addNew()}
                  >
                    <PlusIcon />
                  </div>
                )
                :
                undefined
              }
              </React.Fragment>
            ))
          }
        </div>
        <div id="css-grid" className='code-slide_css-editor'>
          <CodeEditorEditable
            value={codeRows}
            tabSize={2}
            setValue={value => handleChange(value)}
            width='100%'
            height='450px'
            language='css'
          />
          <div className='code-slide_css-editor_save'>
            <button 
              disabled={hasActiveChanges()}
              onClick={e => handleSave()}
            >
              Save File
            </button>
          </div>
        </div>
        <h6 className='code-slide_title' style={{ marginTop: '40px' }}>Customize template palettes</h6>
        <div className='code-slide_palettes'>
          {getPaletteItems()}
        </div>
      </div>
    </div>
  )

})

/*


  const loadCodeRows = () => {
    const rows = activeTab.content.split('\n')
    setCodeRows(rows)
  }
  

  useEffect(() => {
    loadCodeRows()
  }, [app.cssTabs])

  const handleChange = (value, index, isNewline = false) => {
    const rows = [...codeRows]
    if(isNewline){
      const area = document.querySelector(`#css-grid textarea[data-index="${index}"]`)
      if(area){
        const selectionStart = area.selectionStart
        const selectionEnd = area.selectionEnd
        if(selectionEnd - selectionStart === 0 && selectionEnd === value.length){
          //INSERT NEW LINE
          console.log(rows[index + 1])
          rows.splice(index + 1, 0, `  `)
          setCodeRows(rows)
          console.log(index)
          setTimeout(() => {
            const newArea = document.querySelector(`#css-grid textarea[data-index="${index + 1}"]`)
            newArea.focus()
            newArea.setSelectionRange(area.value.length, area.value.length, 'forward')
          }, 100)
        }
      }
    }else{
      setCodeRows(rows)
    }
  }

  const handleInput = (e, index) => {
    const { value } = e.target
    handleChange(value, index)
  }

  const checkEnterKey = (e, index) => {
    if(e.keyCode === 13){
      e.preventDefault()
      e.stopPropagation()
      handleChange(e.target.value, index, true)
    }
  }

*/