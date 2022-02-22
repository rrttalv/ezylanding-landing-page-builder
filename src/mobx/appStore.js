import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { scripts } from "../config/constants";
import { camelCase, replace, trim } from "lodash";
import { getFlexKeys } from "../utils";

const initSectionProps = {
  insertBefore: null,
  insertAfter: null,
  sectionId: null
}


class AppStore {
  constructor() {
    makeAutoObservable(this)
  }

  mouseStartX = 0
  mouseStartY = 0

  dragIndex = 0
  currentSectionId = null
  elementLen = 0
  activeTextEditor = null


  activeFonts = [
    {
      name: 'arial',
      script: null,
      id: 'arial'
    }
  ]

  activeDrag = null
  activePage = null
  selectedElement = null
  selectedParentElement = null

  //Just a bool value to make the body view update once there has been a change in the components
  sizeCalcChange = false

  //Editing CSS is a bool value
  editingCSS = false
  //CSS Element is an object which contains the current element the user is editing
  cssElement = null
  //The position of the CSS editor
  cssEditorPosition = {
    x: 0,
    y: 0,
    width: 400,
    height: 500
  }

  parentElements = ['section', 'header']
  activeFramework = null
  pages = [
    {
      route: '/',
      id: uuidv4(),
      elements: [],
      elementsHeight: 500,
      style: {
        background: '#ffffff',
      },
      hideHeader: false,
      hideBody: false,
      hideFooter: false,
      customCode: ''
    }
  ]

  setActiveFramework(id){
    const script = scripts.find(({ id: sid }) => sid === id)
    if(script){
      this.activeFramework = script
    }else{
      this.activeFramework = null
    }
  }

  findElement(id){
    const elements = this.pages[0].elements
    let target = null
    elements.forEach(element => {
      if(!target){
        const found = this.findNestedChild(element.children, this.selectedElement)
        if(found){
          target = found
        }
      }
    })
    return target
  }

  

  setNestedChildrenProp(children, propName, propValue){
    children.forEach(child => {
      child[propName] = propValue
      if(child.children && child.children.length){
        this.setNestedChildrenProp(child.children, propName, propValue)
      }
    })
  }

  changeElementProp(id, elementType, propName, propValue){
    if(elementType === 'text' || elementType === 'button'){
      const { parentId } = this.activeElementMeta
      const keys = propName.split('|')
      const elements = this.pages[0].elements
      let target = null
      elements.forEach(element => {
        if(!target){
          if(element.id === id){
            target = element
          }
          if(element.id !== id && element.children){
            target = this.findNestedChild(element.children, id)
          }
        }
      })
      if(keys.length === 1 && target){
        target[keys[0]] = propValue
        this.updateInsideFrame(target, 'innerText', propValue)
      }
    }
  }

  setSelectedElement(id, parentId){
    this.selectedElement = id
    this.selectedParentElement = parentId
  }

  updateInsideFrame(element, propName, propValue, style = false){
    const { id } = element
    const frame = document.querySelector('iframe')
    if(frame){
      const doc = frame.contentWindow.document
      const el = doc.querySelector(`[data-uuid="${id}"]`)
      if(el){
        if(style){
          //update element style
        }else{
          el[propName] = propValue
        }
      }
    }
  }

  updateActivePageProp(propName, value){
    const idx = this.pages.findIndex(({ id: pageId }) => pageId === this.activePage)
    this.pages[idx][propName] = value
  }

  unsetSelectedElement(){
    this.selectedElement = null
    this.selectedParentElement = null
  }

  findNestedChild(children, id, parentElem = null){
    let target = null
    let parent = null
    if(!children){
      return null
    }
    children.forEach((element, childIdx) => {
      if(!target){
        if(element.id !== id && element.children){
          target = this.findNestedChild(element.children, id, parentElem ? element : null)
        }
        if(element.id === id){
          target = element
          if(parentElem){
            parent = parentElem
          }
        }
      }
    })
    if(parentElem){
      return { target, parent }
    }else{
      return target
    }
  }



  setActivePage(id){
    if(!id){
      this.activePage = this.pages[0].id
    }else{
      this.activePage = id
    }
  }

  getActivePage(){
    if(!this.activePage){
      return null
    }
    return this.pages.find(({ id }) => id === this.activePage)
  }

  toggleActiveMouseEvent(type, status){
    const copy = {...this.mouseEventList}
    Object.keys(copy).forEach(key => {
      if(key === type){
        copy[key] = status
      }else{
        copy[key] = false
      }
    })
    this.mouseEventList = copy
  }

  findParentByClass(targetClass, element){
    if(!element){
      return null
    }
    const stringClass = typeof(element.className) === 'string'
    if(!element.className || !stringClass){
      if(!element.parentElement){
        return null
      }
      return this.findParentByClass(targetClass, element.parentElement)
    }
    if(!element.parentElement){
      return null
    }
    if(element.className.includes(targetClass)){
      return element
    }
    if(!element.className.includes(targetClass) && element.parentElement){
      return this.findParentByClass(targetClass, element.parentElement)
    }
  }

  checkDragIndex(clientX, clientY){
    const elements = this.pages[0].elements
    elements.forEach((section, idx) => {
      const elem = document.querySelector(`[data-uuid="${section.id}"]`)
      const nextIndex = idx + 1
      const nextElem = elements.length - 1 > nextIndex ? document.querySelector(`[data-uuid="${elements[nextIndex].id}]"`) : false
      if(elem){
        const { x, y, width, height } = elem.getBoundingClientRect()
        const yTopBound = y - 60
        const yMidBound = y + (height / 2)
        const yBottomBound = y + height + 60
        if(clientY > yTopBound && clientY < yMidBound){
          this.dragIndex = idx
        }
        if(clientY > yMidBound && clientY < yBottomBound){
          this.dragIndex = idx + 1
        }
      }
    })
    if(elements.length === 0){
      this.dragIndex = 0
      return
    }
  }

  handleItemDragMove(clientX, clientY, rawX, rawY){
    if(!this.activeDrag){
      return
    }
    const dx = (clientX - this.mouseStartX)
    const dy = (clientY - this.mouseStartY)
    const { position } = this.activeDrag
    const xPos = position.xPos + dx
    const yPos = position.yPos + dy
    this.activeDrag.position = {
      ...position,
      xPos,
      yPos
    }
    this.mouseStartX = clientX
    this.mouseStartY = clientY
    if(this.parentElements.includes(this.activeDrag.type)){
      this.checkDragIndex(rawX, rawY)
    }
  }

  setMouseDown(x, y, type){
    this.mouseStartX = x
    this.mouseStartY = y
    this.toggleActiveMouseEvent(type, true)
  }

  setMouseUp(){
    this.mouseStartX = 0
    this.mouseStartY = 0
    this.toggleActiveMouseEvent(null, false)
  }

  convertPixelsToNumber(val){
    if(!val) return false
    if(val.includes('px')){
      return Number(val.replace('px', ''))
    }else{
      return false
    }
  }

  convertPrecentToNumber(val){
    if(!val) return false
    if(val.includes('%')){
      return Number(val.replace('%', ''))
    }
    return false
  }

  //Id is text ID, parentID is the parent DIV that surrounds the text
  setActiveTextEditor(id, parentId){
    this.activeTextEditor = id
    if(parentId){
      this.activeElementMeta = {
        parentId
      }
    }
    //this means the text editor is closed so all the heights of elements should be recalibrated
    if(!id){
      this.recalculateSizes(this.pages[0].elements)
      this.sizeCalcChange = !this.sizeCalcChange
    }
  }

  updateIframeAndComponentCSS(component, cssMap){
    const frame = document.querySelector('iframe')
    if(frame){
      const win = frame.contentWindow
      const doc = frame.contentWindow.document
      const el = doc.querySelector(`[data-uuid="${component.id}"]`)
      if(el){
        const computedStyle = win.getComputedStyle(el)
        Object.keys(cssMap).forEach(key => {
          if(computedStyle.hasOwnProperty(key)){
            el.style[key] = cssMap[key]
            const camelKey = camelCase(key)
            component.style[camelKey] = cssMap[key]
          }
        })
        Object.keys(el.style).forEach(styleKey => {
          if(!isNaN(Number(styleKey))){
            const key = el.style[styleKey]
            if(!cssMap[key]){
              el.style[key] = ''
            }
          }
        })
      }
      this.recalculateSizes(this.pages[0].elements)
      this.sizeCalcChange = !this.sizeCalcChange
    }
  }

  changeElementCSSValue(newValue){
    //const multi = new RegExp(/((?:^\s*)([\w#.@*,:\-.:>,*\s]+)\s*{(?:[\s]*)((?:[A-Za-z\- \s]+[:]\s*['"0-9\w .,\/()\-!%]+;?)*)*\s*}(?:\s*))/, 'gi')
    //const cssString = `.${this.cssElement.className} { \n ${newValue} \n}`
    //console.log(cssString)
    //const isValid = multi.test(cssString)
    //console.log(isValid)
    const arrValues = newValue.split(';')
    const cssMap = {}
    const elemCSSValues = {}
    arrValues.forEach(cssValue => {
      const [k, v] = cssValue.split(':')
      if(!k || !v){
        return
      }
      const key = k.trim()
      const value = replace(v.trim(), '\n', '')
      cssMap[key] = value
    })
    this.updateIframeAndComponentCSS(this.cssElement, cssMap)
  }

  toggleCSSTab(id){
    const target = this.findElement(id)
    if(target){
      const newVal = !target.cssOpen
      this.editingCSS = newVal
      this.cssElement = target
      target.cssOpen = newVal
    }
  }

  setMovingCSSTab(status, x, y){
    this.movingCSSTab = status
    this.mouseStartX = x
    this.mouseStartY = y
  }

  setCSSTabPosition(x, y){
    this.cssEditorPosition = {
      x, y
    }
  }

  moveCSSTab(x, y){
    const dx = x - this.mouseStartX
    const dy = y - this.mouseStartY
    this.cssEditorPosition.x += dx
    this.cssEditorPosition.y += dy
    this.mouseStartX = x
    this.mouseStartY = y
  }

  changeStylePropInFrame(elementId, propName, propValue){

  }
  
  getMarginOffset(frameWindow, elem){
    const margins = {
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0
    }
    const keys = [
      'marginLeft', 'marginRight', 'marginTop', 'marginBottom'
    ]
    const computedStyle = frameWindow.getComputedStyle(elem)
    keys.forEach(key => {
      const value = computedStyle[key]
      const num = Number(value.replace('px', ''))
      margins[key] = num
    })
    return margins
  }

  getPaddingOffset(frameWindow, elem){
    const margins = {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0
    }
    const keys = [
      'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'
    ]
    const computedStyle = frameWindow.getComputedStyle(elem)
    keys.forEach(key => {
      const value = computedStyle[key]
      const num = Number(value.replace('px', ''))
      margins[key] = num
    })
    return margins
  }

  getFlexProps(frameWindow, elem){
    const flexProps = {}
    const computedStyle = frameWindow.getComputedStyle(elem)
    if(computedStyle.display.includes('flex') || computedStyle.alignSelf){
      flexProps.display = computedStyle.display
      const keys = getFlexKeys()
      keys.forEach(key => {
        flexProps[key] = computedStyle[key]
      })
    }
    return flexProps
  }

  calculateComponentSize(component){
    const frame = document.querySelector('iframe')
    let width = 0
    let height = 0
    let margin = 0
    let padding = 0
    let flexProps = {}
    if(frame){
      const win = frame.contentWindow
      const doc = frame.contentWindow.document
      const el = doc.querySelector(`[data-uuid="${component.id}"]`)
      if(el){
        const { x: offsetX, y: offsetY } = document.querySelector('.build-area_body').getBoundingClientRect()
        const { width: w, height: h, x, y } = el.getBoundingClientRect()
        const { marginLeft, marginRight, marginBottom, marginTop } = this.getMarginOffset(win, el)
        const { paddingLeft, paddingRight, paddingTop, paddingBottom } = this.getPaddingOffset(win, el)
        flexProps = this.getFlexProps(win, el)
        width = w
        height = h
        margin = `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`
        padding = `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`
      }
    }
    return {
      width, height, margin, padding, flexProps
    }
  }

  setElementInitStyle(children){
    const frame = document.querySelector('iframe')
    if(frame){
      children.forEach(child => {
        const doc = frame.contentWindow.document
        const el = doc.querySelector(`[data-uuid="${child.id}"]`)
        if(el){
          Object.keys(el.style).forEach(styleKey => {
            if(!isNaN(Number(styleKey))){
              const key = el.style[styleKey]
              const camelKey = camelCase(key)
              child.style[camelKey] = el.style[key]
            }
          })
        }
        if(child.children && child.children.length){
          this.setElementInitStyle(child.children)
        }
      })
    }
  }

  recalculateSizes(children){
    children.forEach(child => {
      const { width, height, margin, padding, flexProps } = this.calculateComponentSize(child)
      child.position = {
        width,
        height,
        margin,
        padding,
        flexProps
      }
      if(child.children && child.children.length){
        this.recalculateSizes(child.children)
      }
    })
  }

  assignChildIds(children){
    children.forEach(child => {
      if(!child.id){
        child.id = uuidv4()
      }
      if(child.children && child.children.length){
        this.assignChildIds(child.children)
      }
    })
  }

  insertComponent(e){
    if(this.activeDrag){
      const { clientX, clientY } = e
      const activeArea = this.pages[0].elements
      const editor = document.querySelector('.editor')
      if(!activeArea || !editor){
        return
      }
      const { x: editorX, y: editorY } = editor.getBoundingClientRect()
      const page = this.getActivePage()
      if(this.activeDrag.type === 'section'){
        this.activeDrag.style.height = 'fit-content'
      }
      const comp = {
        ...this.activeDrag,
        cssOpen: false,
        locked: false,
        classNameOpen: false,
        id: uuidv4()
      }
      if(comp.children && comp.children.length){
        this.assignChildIds(comp.children)
      }
      //If the parent element is a section
      if(this.parentElements.includes(this.activeDrag.type)){
        comp.position.xPos -= editorX
        comp.position.yPos -= editorY
        page.elements.splice(this.dragIndex, 0, comp)
        this.setSelectedElement(comp.id, null)
        this.dragIndex = 0
      }else{
        
      }
      this.elementLen += 1
      setTimeout(() => {
        this.recalculateSizes(this.pages[0].elements)
        this.setElementInitStyle(this.pages[0].elements)
        this.sizeCalcChange = !this.sizeCalcChange
      }, 500)
    }
  }

  getItemSize(item){
    if(item && item.type === 'text'){
      const { className, content, tagName, style } = item
      const domNode = document.createElement(tagName)
      domNode.textContent = content
      Object.keys(style).map(tag => {
        if(tag !== 'width' || tag !== 'height'){
          domNode.style[tag] = style[tag]
        }
      })
      domNode.style.opacity = '0'
      domNode.style.zIndex = '-1000000'
      domNode.style.width = 'fit-content'
      document.body.appendChild(domNode)
      const { clientWidth, clientHeight } = domNode
      domNode.remove()
      return { clientWidth, clientHeight }
    }
  }

  setActiveDragItem(item, x, y){
    if(item){
      const copy = {...item}
      let width = item.style.width
      let height = item.style.height
      let pxWidth = this.convertPixelsToNumber(width)
      const precentWidth = this.convertPrecentToNumber(width)
      let pxHeight = this.convertPixelsToNumber(height)
      let xOffset = 0
      let yOffset = 0
      if(precentWidth){
        const elem = document.querySelector('.build-area_page')
        const { width: pageWidth } = elem.getBoundingClientRect()
        width = pageWidth * (precentWidth / 100)
        xOffset = width / 2
      }
      if(pxWidth){
        width = pxWidth
        xOffset = pxWidth / 2
      }
      if(pxHeight){
        yOffset = pxHeight / 2
      }
      if(!item.style.height || !item.style.width){
        const { clientWidth, clientHeight } = this.getItemSize(item)
        yOffset = clientHeight / 2
        xOffset = clientWidth / 2
        width = clientWidth
        height = clientHeight
        pxWidth = clientWidth
        pxHeight = clientHeight
      }
      copy.position = {
        xPos: x - xOffset,
        yPos: y - yOffset,
        width: width,
        height: pxHeight
      }
      this.activeDrag = copy
      this.mouseStartX = x
      this.mouseStartY = y
    }else{
      this.activeDrag = null
      this.mouseStartX = 0
      this.mouseStartY = 0
    }
  }

}

export default AppStore;