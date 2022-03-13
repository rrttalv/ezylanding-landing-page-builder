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
import { ReactComponent as CursorIcon } from '../../../../svg/cursor.svg';
import { ReactComponent as Trash } from '../../../../svg/trash.svg';
import { ReactComponent as Pen } from '../../../../svg/pen.svg';
import { camelCase as dashToCamel } from 'lodash'
import { CodeEditorEditable } from 'react-code-editor-editable';
import 'highlight.js/styles/tomorrow-night-eighties.css';
import { ChromePicker } from 'react-color'
import { PropInput } from '../../BuildArea/ComponentTools/PropInput';



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

  }, [app.palette.length, palette])

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

  const handlePaletteNameChange = (id, value) => {
    app.editPaletteProp(id, 'var', value)
    app.togglePaletteEditing(id, true)
  }

  const addPalette = (e) => {
    e.preventDefault()
    e.stopPropagation()
    app.addPaletteItem()
  }

  const deletePalette = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    app.removePaletteItem(id)
  }

  const toggleEditing = (e, id, name = false) => {
    e.preventDefault()
    e.stopPropagation()
    app.togglePaletteEditing(id, name)
  }

  const handleColorChange = (color, id) => {
    const { rgb: { r, g, b } } = color
    app.editPaletteProp(id, 'value', `${r}, ${g}, ${b}`)
  }

  const getPaletteItems = () => {
    const editingItem = palette.find(({ isEditing }) => isEditing)
    return (
      <div className='palette-items'>
        {
          palette.map((item, idx) => {
            const { name, id, var: varName, value, isEditing, isCustom, isEditingName } = item
            const isFirst = idx + 1 === 1 || idx % 3 === 0
            return (
              <div key={id} className={`palette-item${isFirst ? ' first-grid-item' : ''}`}>
                <div className='palette-item_color' onClick={e => toggleEditing(e, id)} style={{ background: `rgb(${value})` }} />
                {
                  isEditing ? (
                    <ChromePicker
                      styles={{
                        wrap: {
                          width: '100%'
                        }
                      }}
                      color={`rgb(${value})`}
                      onChangeComplete={color => handleColorChange(color, id)}
                    />
                  )
                  :
                  undefined
                }
                {
                  isCustom && isEditingName ? (
                    <div className={`palette-item_name-editor${isFirst ? ' first-item' : ''}`}>
                      <PropInput 
                        value={varName}
                        save={(value) => handlePaletteNameChange(id, value)}
                        className={`palette-item_name-editor_proparea`}
                        label={'Change palette var name'}
                      />
                    </div>) : undefined
                }
                <span className='palette-item_text'>{varName}
                  {isCustom ? (
                    <>
                      <button className='btn-none palette-item_text_edit' onClick={e => toggleEditing(e, id, true)}><Pen /></button>
                      <button className='btn-none palette-item_text_edit delete' onClick={e => deletePalette(e, id)}><Trash /></button>
                    </>
                    )
                    :
                    undefined
                  }
                </span>
                <span className='palette-item_value'>{value}</span>
                {
                  isCustom ? (
                    <div />
                  )
                  :
                  undefined
                }
              </div>
            )
          })
        }
        <button onClick={e => addPalette(e)} className='btn-empty palette-items_add-item'>
          <PlusIcon />
          <span>Add color</span>
        </button>
      </div>
    )
  }

  const toggleStaticSelect = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    if(app.staticSelect){
      app.setStaticSelect(null)
    }else{
      app.setStaticSelect(type)
    }
  }

  const handleSelect = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    app.setSelectedElement(id, null)
  }

  const unsetStaticItem = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    app.unsetStaticItem(type)
  }

  const getStaticDisplay = (footer = false) => {
    const element = app.findElement(footer ? app.footerId : app.headerId)
    return (
      <div className='code-slide_static-wrapper'>
        <span className='slide-item_subtitle code-slide_static-subtitle'>This element will appear on every page as the {footer ? 'last' : 'first'} element</span>
        {
          element ? (
            <button 
              className='btn-none code-slide_static-element_meta'
              onClick={e => handleSelect(e, element.id)}
            >
              <span className='code-slide_static-tagname elem-tag'>
                {element.tagName}
              </span>
              {
                element.domID ? (
                  <span className='code-slide_static-id elem-domID'>
                    #{element.domID.split(' ').join('#')}
                  </span>
                )
                :
                undefined
              }
              {
                element.className ? (
                  <span className='code-slide_static-classname elem-class'>
                    .{element.className.split(' ').join('.')}
                  </span>
                )
                :
                undefined
              }
            </button>
          )
          :
          (
            <span className='code-slide_static-empty'>
              No static {footer ? 'footer' : 'header'} selected.
            </span>
          )
        }
        <div className='code-slide_static-btn'>
          <button 
            onClick={e => toggleStaticSelect(e, footer ? 'footer' : 'header')}
            className='btn-empty'>
            <CursorIcon />Set {footer ? 'footer' : 'header'}
          </button>
          <button 
            onClick={e => unsetStaticItem(e, footer ? 'footer' : 'header')}
            className='btn-empty unset-static'>
            <Trash />Unset {footer ? 'footer' : 'header'}
          </button>
        </div>
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
        <h6 className='code-slide_title' style={{ marginTop: '40px' }}>Choose static elements</h6>
        <div className='code-slide_static'>
          {getStaticDisplay()}
          {getStaticDisplay(true)}
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