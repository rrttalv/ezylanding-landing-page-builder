import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useRef, useState } from 'react'
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another
import { camelToDash } from '../../../../utils';
import { ReactComponent as PlusIcon } from '../../../../svg/plus.svg';
import { ReactComponent as Check } from '../../../../svg/mint-check.svg';
import { ReactComponent as CursorIcon } from '../../../../svg/cursor.svg';
import { ReactComponent as Trash } from '../../../../svg/trash.svg';
import { ReactComponent as Pen } from '../../../../svg/pen.svg';
import { camelCase as dashToCamel } from 'lodash'
import { CodeEditorEditable } from 'react-code-editor-editable';
import 'highlight.js/styles/tomorrow-night-eighties.css';
import { ChromePicker } from 'react-color'
import { PropInput } from '../../BuildArea/ComponentTools/PropInput';

export const Code = observer((props) => {

  const [codeRows, setCodeRows] = useState('')

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { sidebar, app } } = getStore()
  
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const activeTab = app.cssTabs.find(({ active, selected }) => active && selected)

  const { palette } = app

  useEffect(() => {
  }, [app.palette.length, app.customScripts.length])

  useEffect(() => {
    const scrollSection = document.querySelector(`pre .code-editor__hlcode__qxcy`)
    if(scrollSection){
      scrollSection.addEventListener('scroll', handleScroll, false)
      return () => scrollSection.removeEventListener(scroll, handleScroll, false)
    }
  }, [])
  
  const prevTabId = usePrevious(app.activeCSSTab)

  useEffect(() => {
    setCodeRows(activeTab.content)
    const codeEditor = document.querySelector('.container-code-editor__qxcy .code-editor__textarea__qxcy')
    if(codeEditor){
      codeEditor.setAttribute('maxLength', 25000)
    }
    /*
    const scrollSection = document.querySelector(`pre .code-editor__hlcode__qxcy`)
    if(activeTab.scrollPosition && prevTabId !== app.activeCSSTab){
      console.log('scrolled' + '\n')
      scrollSection.scrollTo(0, activeTab.scrollPosition)
    }
    */
  }, [activeTab])

  const handleScroll = e => {
    const tab = app.cssTabs.find(({ active, selected }) => active && selected)
    app.setCSSScrollPosition(tab.id, e.target.scrollTop + e.target.clientHeight)
  }

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
        <div className='palette-items__add-wrapper'>
          <button onClick={e => addPalette(e)} className='btn-empty palette-items_add-item'>
            <PlusIcon />
          </button>
        </div>
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

  const handleScriptChange = e => {
    e.preventDefault()
    e.stopPropagation()
    const { value, name: id } = e.target
    app.handleScriptChange(id, value)
  }

  const addScript = e => {
    e.preventDefault()
    e.stopPropagation()
    app.addCustomScript()
  }

  const deleteScript = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    app.removeCustomScript(id)
  }

  const saveScript = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    app.handleScriptSave(id, true)
  }

  const getCustomScripts = () => {
    const { customScripts } = app
    return (
      <div className='custom-scripts'>
        {
          customScripts.length === 0 ? (
            <div className='custom-scripts_empty'>
              <span>Your custom script URLS will appear here</span>
            </div>
          )
          :
          undefined
        }
        {
          customScripts.map(item => {
            const { id, scriptURL } = item
            return (
              <div className='custom-scripts_script'>
                <input type='text' className="custom-scripts_script-input" placeholder='Custom script url e.g. https://fonts.googleapis.com' name={id} onChange={e => handleScriptChange(e)} value={scriptURL} />
                <div className='custom-scripts_buttons'>
                  <button onClick={e => saveScript(e, id)} className='btn-none'>
                    <Check />
                  </button>
                  <button onClick={e => deleteScript(e, id)} className='btn-none'>
                    <Trash className='trash' />
                  </button>
                </div>
              </div>
            )
          })
        }
        <div className='custom-scripts_footer'>
          <button onClick={e => addScript(e)} className='btn-none'>
            <span>Add custom script</span>
            <PlusIcon />
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
                <>
                  {
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
                  }
                </>
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
        <h6 className='code-slide_title' style={{ marginTop: '40px' }}>Add custom scripts</h6>
        <div className='code-slide_scripts'>
          {getCustomScripts()}
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