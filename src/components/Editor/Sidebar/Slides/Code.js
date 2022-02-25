import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import { List } from 'react-virtualized';
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another
import { camelToDash } from '../../../../utils';
import { camelCase as dashToCamel } from 'lodash'
import 'highlight.js/styles/dracula.css';
import 'react-virtualized/styles.css';
import { CodeEditorEditable } from 'react-code-editor-editable';
import 'highlight.js/styles/atelier-forest-dark.css';



const ListElement = (props) => {

  const handleInput = (e, index) => {
    const { value } = e.target
    props.handleChange(value, index)
  }

  const checkEnterKey = (e, index) => {
    if(e.keyCode === 13){
      e.preventDefault()
      e.stopPropagation()
      props.handleChange(e.target.value, index, true)
    }
  }
  
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
          <textarea
            data-index={index}
            type='text'
            className='row-input'
            onChange={e => handleInput(e, index)}
            onKeyDown={e => checkEnterKey(e, index)}
            style={{
              width: '500vw',
              height: '100%'
            }}
            value={value}
          >
          </textarea>
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
          <textarea
            data-index={index}
            type='text'
            className='row-input'
            onChange={e => handleInput(e, index)}
            onKeyDown={e => checkEnterKey(e, index)}
            style={{
              width: '500vw',
              height: '100%'
            }}
            value={value}
          >
          </textarea>
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

  const [rowStart, setRowStart] = useState(0)
  const [rowEnd, setRowEnd] = useState(100)
  const [currentScrollPos, setcurrentScrollPos] = useState(0)
  const [fullArray, setFullArray] = useState([])
  const [codeRows, setCodeRows] = useState([])

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { sidebar, app } } = getStore()

  const getValue = () => {
    if(app.activeFramework){
      switch(app.activeFramework.id){
        case 'bootstrap':
          return app.rawBootstrap
        default:
          return ''
      }
    }
  }

  const loadCodeRows = () => {
    const rows = app.rawBootstrap.split('\n')
    setCodeRows(rows)
  }

  useEffect(() => {
    loadCodeRows()
  }, [])

  const handleChange = (value, index, isNewline = false) => {
    const rows = [...codeRows]
    if(isNewline){
      const area = document.querySelector(`#css-grid textarea[data-index="${index}"]`)
      console.log(area)
      if(area){
        const selectionStart = area.selectionStart
        const selectionEnd = area.selectionEnd
        if(selectionEnd - selectionStart === 0 && selectionEnd === value.length){
          //INSERT NEW LINE
          rows.splice(index + 1, 0, `  `)
          setCodeRows(rows)
          setTimeout(() => {
            const newArea = document.querySelector(`#css-grid textarea[data-index="${index + 1}"]`)
            newArea.focus()
            newArea.setSelectionRange(area.value.length, area.value.length, 'forward')
          }, 100)
        }
      }
    }else{
      rows[index] = value
      setCodeRows(rows)
    }
  }


  return (
    <div 
      className='code-slide'
    >
      <div className='code-slide_wrapper'>
        <h6 className='code-slide_title'>Customize {app.activeFramework.id} CSS</h6>
        <div id="css-grid" className='code-slide_css-editor'>
          <ListElement
            handleChange={handleChange}
            codeValue={codeRows}
          />
        </div>
      </div>
    </div>
  )

})