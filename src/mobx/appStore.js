import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { scripts } from "../config/constants";
import cssParser from 'css'
import { camelCase, replace, trim } from "lodash";
import { camelToDash, getFlexKeys, textStyleKeys } from "../utils";
import bootstrapCSS from '!!raw-loader!../libraries/bootstrap.css';

const initSectionProps = {
  insertBefore: null,
  insertAfter: null,
  sectionId: null
}

const initDragMeta = {
  before: false,
  after: false
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

  dragMetaData = {
    before: false,
    after: false
  }

  cssTabs = [
    {
      type: 'custom',
      id: uuidv4(),
      selected: true,
      unsaved: false,
      active: true,
      name: `main.css`,
      content: `html {\n  margin: 0;\n  padding: 0;\n  width: 100%;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\n}`,
      paletteContent: ``
    },
  ]
  cssSaved = false

  //Debounce the palette CSS string update
  _paletteBounce = null

  //Custom palette that is applied to the current template
  palette = [
    {
      name: 'main',
      id: uuidv4(),
      var: '--main',
      value: 'rgba(79, 70, 229, 1)',
      isEditing: false
    },
    {
      name: 'secondary',
      id: uuidv4(),
      var: '--secondary',
      value: 'rgba(224, 231, 255, 1)',
      isEditing: false
    },
    {
      name: 'third',
      id: uuidv4(),
      var: '--third',
      value: 'rgba(5, 169, 133, 1)',
      isEditing: false
    },
    {
      name: 'light',
      id: uuidv4(),
      var: '--light',
      value: 'rgba(255, 255, 255, 1)',
      isEditing: false
    },
    {
      name: 'gray',
      id: uuidv4(),
      var: '--gray',
      value: 'rgba(108, 117, 125, 1)',
      isEditing: false
    },
    {
      name: 'dark',
      id: uuidv4(),
      var: '--dark',
      value: 'rgba(52, 58, 64, 1)',
      isEditing: false
    },
  ]

  //The style keys that are used for editing text elements

  activeDrag = null
  activePage = null
  selectedElement = null
  selectedParentElement = null

  //The component id that is currently being targeted by the mouse and the activeDrag element will be appened to
  dragTarget = null

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

  layersOpen = false

  frameWidth = 0

  parentElements = ['section', 'header']
  activeFramework = null
  pages = [
    {
      route: '/',
      routeMeta: {
        metaDescription: '',
        metaTitle: '',
        metaImage: '',
        detailsOpen: false,
      },
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

  toggleLayerToolbar(){
    this.layersOpen = !this.layersOpen
  }

  compilePaletteStr(palette){
    let str = ':root {'
    palette.forEach(item => {
      str += `\n  ${item.var}: ${item.value};`
    })
    str += '\n}'
    return str
  }

  syncPalette(){
    const mainTab = this.cssTabs.find(({ name }) => name === 'main.css')
    const paletteStr = this.compilePaletteStr(this.palette)
    mainTab.paletteContent = paletteStr
  }

  addPaletteItem(){
    this.palette.push({
      name: `color-${this.palette.length + 1}`,
      var: `--color-${this.palette.length + 1}`,
      value: `rgb(255, 255, 255)`,
      isEditing: false
    })
  }

  removePaletteItem(id){
    const idx = this.palette.find(({ id: pid }) => pid === id)
    if(idx > -1){
      this.palette.splice(idx, 1)
    }
  }

  updateIFramePalette(newValue){
    const frame = document.querySelector('iframe')
    if(frame){
      const doc = frame.contentWindow.document
      const paletteTag = doc.querySelector('#PALETTES')
      paletteTag.innerHTML = newValue
    }
  }

  editPaletteProp(id, propName, propValue){
    const item = this.palette.find(({ id: pid }) => pid === id)
    item[propName] = propValue
    if(this._paletteBounce){
      clearTimeout(this._paletteBounce)
    }
    this._paletteBounce = setTimeout(() => {
      const newString = this.compilePaletteStr(this.palette)
      const mainTab = this.cssTabs.find(({ name }) => name === 'main.css')
      mainTab.paletteContent = newString
      this.updateIFramePalette(newString)
    }, 250)
  }

  togglePaletteEditing(id){
    this.palette.forEach(item => {
      if(item.id !== id){
        item.isEditing = false
      }
    })
    const item = this.palette.find(({ id: pid }) => pid === id)
    if(item){
      item.isEditing = !item.isEditing
    }
  }

  saveTabContent(tabId, value){
    const tab = this.cssTabs.find(({ id }) => id === tabId)
    tab.content = value
    tab.unsaved = false
    this.cssSaved = !this.cssSaved
    this.handleWindowResize()
  }

  changeActiveTab(tabId){
    this.cssTabs = this.cssTabs.map(tab => {
      return {
        ...tab,
        selected: false
      }
    })
    const item = this.cssTabs.find(({ id }) => id === tabId)
    if(item){
      item.selected = true
    }
  }

  setTabChanged(tabId, currentValue){
    const tab = this.cssTabs.find(({ id }) => id === tabId)
    if(tab.content === currentValue){
      tab.unsaved = false
    }else{
      tab.unsaved = true
    }
  }

  addCustomCSSTab(){
    const id = uuidv4()
    const tab = {
      type: 'custom',
      id,
      selected: false,
      unsaved: false,
      active: true,
      name: `custom_${this.cssTabs.length + 1}.css`,
      content: ``
    }
    this.cssTabs.push(tab)
    this.changeActiveTab(id)
  }

  createTab(type, id, name, content){
    return { 
      type,
      id,
      active: true,
      selected: true,
      unsaved: false,
      name,
      content
    }
  }

  setActiveFramework(id){
    const script = scripts.find(({ id: sid }) => sid === id)
    if(script && script.id === 'bootstrap'){
      script.rawCSS = bootstrapCSS
    }
    if(script){
      this.activeFramework = script
    }else{
      this.activeFramework = null
    }
    setTimeout(() => {
      this.recalculateSizes(this.pages[0].elements)
      this.setIframeHeight()
      this.sizeCalcChange = !this.sizeCalcChange
    }, 1000)
  }

  handleWindowResize(){
    this.recalculateSizes(this.pages[0].elements)
    this.setIframeHeight()
    this.sizeCalcChange = !this.sizeCalcChange
  }

  findElement(id){
    const elements = this.pages[0].elements
    let target = null
    elements.forEach(element => {
      if(!target){
        const found = this.findNestedChild(element.children, id)
        if(found){
          target = found
        }
        if(element.id === id){
          target = element
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
    setTimeout(() => {
      this.recalculateSizes(this.pages[0].elements)
      this.setIframeHeight()
      this.sizeCalcChange = !this.sizeCalcChange
    }, 300)
  }

  setElementToolbarMenu(id, status = false){
    const element = this.findElement(id)
    element.toolbarOptionsOpen = status
  }

  updateElementProp(id, propName, propValue){
    const element = this.findElement(id)
    const frame = document.querySelector('iframe')
    if(element && frame){
      const doc = frame.contentWindow.document
      element[propName] = propValue
      const domElement = doc.querySelector(`[data-uuid="${id}"]`)
      //Custom flow for SVG elements
      if(element.tagName === 'svg'){
        if(propName === 'className'){
          domElement.setAttribute('class', propValue)
        }
        if(propName === 'domID'){
          domElement.setAttribute('id', propValue)
        }
      }else{
        if(propName === 'className'){
          domElement.className = propValue
        }
        if(propName === 'domID'){
          domElement.id = propValue
        }
        if(propName === 'src'){
          domElement.setAttribute('src', propValue)
        }
      }
    }
    setTimeout(() => {
      this.recalculateSizes(this.pages[0].elements)
      this.sizeCalcChange = !this.sizeCalcChange
      this.setIframeHeight()
    }, 300)
  }

  setSelectedElement(id, parentId){
    //if(this.selectedElement && id !== this.selectedElement){
    //  this.setElementToolbarMenu(this.selectedElement, false)
    //}
    this.selectedElement = id
    this.selectedParentElement = parentId
    if(this.cssElement && id && this.cssElement.id !== id){
      this.toggleCSSTab(this.cssElement.id)
    }
  }

  toggleCompChildren(id){
    const element = this.findElement(id)
    if(element){
      element.childrenOpen = !element.childrenOpen
    }
  }

  toggleElementProp(id, propName, status){
    const element = this.findElement(id)
    if(propName === 'editingID' && status){
      element.editingClass = false
    }
    if(propName === 'editingClass' && status){
      element.editingID = false
    }
    if(element){
      element[propName] = status
    }
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


  findNestedChild(children, id){
    let target = null
    if(!children){
      return target
    }
    children.forEach(element => {
      if(!target){
        if(element.id !== id && element.children){
          target = this.findNestedChild(element.children, id)
        }
        if(element.id === id){
          target = element
        }
      }
    })
    return target
  }

  findNestedParent(element, id){
    let parent = null
    if(!element.children){
      return parent
    }
    element.children.forEach(child => {
      if(!parent){
        if(child.id === id){
          parent = element
        }
        if(child.id !== id && child.children){
          parent = this.findNestedParent(child, id)
        }
      }
    })
    return parent
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
    //The component has an active insert target parent so we should display a box
    const isSection = this.parentElements.includes(this.activeDrag.type)
    if(!isSection){
      this.dragMetaData = {
        ...initDragMeta
      }
      const elems = document.elementsFromPoint(rawX, rawY)
      let target = null
      let selfTriggered = false
      elems.forEach((element, idx) => {
        if(!target){
          const isStrClass = typeof(element.className) === 'string'
          if(!isStrClass){
            return
          }
          const isSelf = element.className === 'floating-element'
          if(isSelf){
            return
          }
          const id = element.getAttribute('data-uuid')
          if(id){
            target = id
          }
        }
      })
      let metaFound = false
      if(target){
        const { x, y, width, height } = document.querySelector(`[data-uuid="${target}"]`).getBoundingClientRect()
        const xMid = (width / 2) + x
        const yMid = (height / 2) + y
        const isBefore = x < rawX && rawX < xMid && y < rawY && rawY < yMid
        if(isBefore){
          this.dragMetaData.before = true
        }
        if(!isBefore){
          this.dragMetaData.after = true
        }
        this.activeDrag.parent = false
        delete this.activeDrag.children
      }else{
        this.activeDrag.parent = true
        this.activeDrag.children = []
        this.checkDragIndex(rawX, rawY)
      }
      this.dragTarget = target
    }else{
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
    this.dragMetaData = {...initDragMeta}
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
    if(!val.includes('%')) return false
    if(val.includes('%')){
      return Number(val.replace('%', ''))
    }
    return false
  }

  //Id is text ID, parentID is the parent DIV that surrounds the text
  setActiveTextEditor(id, parentId){
    const frame = document.querySelector('iframe')
    const win = frame.contentWindow.window
    const doc = frame.contentWindow.document
    if(id && id !== this.activeTextEditor && this.activeTextEditor !== null){
      const el = doc.querySelector(`[data-uuid="${this.activeTextEditor}"]`)
      const current = this.findElement(this.activeTextEditor)
      el.style.opacity = current.style.opacity ? current.style.opacity : '1'
    }
    const el = doc.querySelector(`[data-uuid="${id ? id : this.activeTextEditor}"]`)
    const activeStyleMap = {}
    if(el){
      if(id){
        const computed = win.getComputedStyle(el)
        const raw = {}
        Object.keys(computed).forEach(key => {
          if(!isNaN(key)){
            const realKey = computed[key]
            raw[realKey] = computed[realKey]
            if(textStyleKeys.indexOf(realKey) > - 1){
              activeStyleMap[camelCase(realKey)] = computed[realKey]
            }
          }
        })
        const comp = this.findElement(id)
        if(comp.type === 'button'){
          activeStyleMap.display = 'inline-block'
          activeStyleMap.width = 'auto'
        }
        comp.activeStyleMap = activeStyleMap
        el.style.opacity = '0.1'
      }else{
        const component = this.findElement(this.activeTextEditor)
        delete component.activeStyleMap
        el.style.opacity = component.style.opacity ? component.style.opacity : '1'
      }
    }
    this.activeTextEditor = id
    if(parentId){
      this.activeElementMeta = {
        parentId
      }
    }
    //this means the text editor is closed so all the heights of elements should be recalibrated
    if(!id){
      this.recalculateSizes(this.pages[0].elements)
      this.setIframeHeight()
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
          }
        })
        Object.keys(el.style).forEach(styleKey => {
          if(!isNaN(Number(styleKey))){
            const key = el.style[styleKey]
            const [firstPartOfKey] = key.split('-')
            let exists = false
            Object.keys(cssMap).forEach(cssMapKey => {
              const [firstPartOfCSSMapKey] = cssMapKey.split('-')
              if(firstPartOfCSSMapKey.includes(firstPartOfKey)){
                exists = true
              }
            })
            if(!cssMap[key] && !exists){
              el.style[key] = ''
            }
          }
        })
      }
      this.recalculateSizes(this.pages[0].elements)
      this.setIframeHeight()
      this.sizeCalcChange = !this.sizeCalcChange
    }
  }

  changeElementCSSValue(newValue){
    const { tagName } = this.cssElement
    const cssString = `${tagName} { \n ${newValue} \n}`
    try{
      const val = cssParser.parse(cssString, { silent: false })
      const cssMap = {}
      val.stylesheet.rules.forEach(rule => {
        rule.declarations.forEach(declaration => {
          const [trueValue] = declaration.value.split('\n')
          cssMap[declaration.property] = trueValue.trim()
        })
      })
      Object.keys(cssMap).forEach(key => {
        const camelKey = camelCase(key)
        this.cssElement.style[camelKey] = cssMap[key]
      })
      Object.keys(this.cssElement.style).forEach(elementStyleKey => {
        const dashKey = camelToDash(elementStyleKey)
        if(!cssMap[dashKey]){
          delete this.cssElement.style[elementStyleKey]
        }
      })
      this.updateIframeAndComponentCSS(this.cssElement, cssMap)
    }catch(err){
      this.recalculateSizes(this.pages[0].elements)
      this.setIframeHeight()
      this.sizeCalcChange = !this.sizeCalcChange
      return
    }
  }

  toggleCSSTab(id){
    const target = this.findElement(id)
    if(target){
      const newVal = !target.cssOpen
      this.editingCSS = newVal
      if(newVal){
        this.cssElement = target
      }else{
        this.cssElement = null
      }
      target.cssOpen = newVal
    }
  }

  toggleClassTab(id){
    const target = this.findElement(id)
    if(target){
      const newVal = !target.editingClass
      this.editingClass = newVal
      this.classElement = target
      target.editingClass = newVal
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
    let x = 0
    let y = 0
    let margin = 0
    let padding = 0
    let flexProps = {}
    if(frame){
      const win = frame.contentWindow
      const doc = frame.contentWindow.document
      const el = doc.querySelector(`[data-uuid="${component.id}"]`)
      if(el){
        const { x: offsetX, y: offsetY } = document.querySelector('.build-area_body').getBoundingClientRect()
        const { width: w, height: h, x: elX, y: elY } = el.getBoundingClientRect()
        const { marginLeft, marginRight, marginBottom, marginTop } = this.getMarginOffset(win, el)
        const { paddingLeft, paddingRight, paddingTop, paddingBottom } = this.getPaddingOffset(win, el)
        flexProps = this.getFlexProps(win, el)
        width = w
        height = h
        x =  elX
        y =  elY
        margin = `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`
        padding = `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`
      }
    }
    return {
      width, height, margin, padding, flexProps, x, y
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
      const { width, height, margin, x, y, padding, flexProps } = this.calculateComponentSize(child)
      child.position = {
        width,
        height,
        x,
        y,
        margin,
        padding,
        flexProps
      }
      if(child.children && child.children.length){
        this.recalculateSizes(child.children)
      }
    })
  }

  getElementCSSString(element){
    const keys = Object.keys(element.style)
    let str = ''
    keys.forEach((key, idx) => {
      str += `  ${camelToDash(key)}: ${element.style[key]};${idx === keys.length - 1 ? '' : '\n'}`
    })
    return str
  }

  assignChildIds(children){
    children.forEach((child) => {
      child.id = uuidv4()
      if(child.children && child.children.length){
        this.assignChildIds(child.children)
      }
    })
  }

  findParentElementByChildID(children, id, parent = null){
    let target = null
    if(!children){
      return null
    }
    children.forEach((element, childIdx) => {
      if(!target){
        if(element.id !== id && element.children){
          target = this.findParentElementByChildID(element.children, id, element)
        }
        if(element.id === id){
          target = parent
        }
      }
    })
    return target
  }

  getFullChildrenArray(element, level){
    let result = []
    if(level > 0){
      result.push(element)
    }
    if(element.children && element.children.length){
      level += 1
    }
    element.children.forEach(child => {
      if(child.children && child.children.length){
        result = [...result, ...this.getFullChildrenArray(child, level)]
      }
      result.push(child)
    })
    return result
  }

  findDragTargetInsertIndex(id, clientX, clientY){
    let element = this.findElement(id)
    const frame = document.querySelector('iframe')
    if(element && frame){
      let insertBefore = null
      let pushToParent = false
      let insertAsFirstChild = false
      let found = false
      const doc = frame.contentWindow.document
      if(!element.children){
        element = this.findParentElementByChildID(this.pages[0].elements, id)
      }
      parent = element
      if(element.children && element.children.length === 0){
        pushToParent = true
        insertAsFirstChild = true
        found = true
        return {
          insertBefore,
          parent: element,
          pushToParent,
          insertAsFirstChild,
          found
        }
      }
      if(element.children && element.children.length > 0){
        const childElements = this.getFullChildrenArray(element, 0)
        const matches = []
        const allElements = []

        let prevX = 0
        let prevY = 0
        let prevXMax = 0
        let prevYMax = 0
        
        childElements.forEach((elem, idx) => {
          const { x, y, width, height } = document.querySelector(`[data-uuid="${elem.id}"]`).getBoundingClientRect()
          const xMax = x + width
          const yMax = y + height
          const halfX = x + (width / 2)
          const halfY = y + (height / 2)

          const xMatch = x <= clientX && xMax >= clientX
          const yMatch = y <= clientY && yMax >= clientY

          const obj = {
            ...elem,
            matchMeta: {
              xMatch,
              yMatch,

              halfX,
              halfY,

              prevX,
              prevY,
              prevXMax,
              prevYMax,
              
              x,
              y,
              yMax,
              xMax,
            }
          }

          if(xMatch || yMatch){
            matches.push(obj)
          }

          allElements.push(obj)

          prevX = x
          prevY = y
          prevXMax = xMax
          prevYMax = yMax

        })

        if(matches.length > 0){
          const xMatches = matches.filter(match => match.matchMeta.xMatch)
          const yMatches = matches.filter(match => match.matchMeta.yMatch)
          matches.forEach((match, idx) => {
            if(!found){
              const { matchMeta, matchMeta: { xMatch, yMatch } } = match
              //Means that the user was hovering over the element
              if(xMatch && yMatch){
                const { x, y, xMax, yMax, halfX, halfY } = matchMeta
                const isBeforeXHalf = x <= clientX && halfX > clientX
                const isBeforeYHalf = y <= clientY && halfY > clientY
                const isAfterXHalf = halfX <= clientX && xMax > clientX
                const isAfterYHalf = halfY <= clientY && yMax > clientY
                //This means that there are more elements in the same ROW so the xCordinate should be checked for insertion data
                if(isBeforeXHalf && isBeforeYHalf && !found){
                  insertBefore = match.id
                  found = true
                }
                if((isAfterXHalf || isAfterYHalf) && !found){
                  const nextElement = childElements[idx + 1]
                  if(nextElement){
                    insertBefore = nextElement.id
                    found = true
                  }else{
                    pushToParent = true
                    found = true
                  }
                }
              }
            }
          })
          //If there was no match, then we try to determine the closes cordinates
          if(!found){
            allElements.forEach((match, idx) => {
              if(!found){
                const { matchMeta: { x, y, xMax, yMax} } = match
                //Check if the cursor was before the first element
                if(idx === 0){
                  if(x > clientX && y > clientX){
                    insertBefore = match.id
                    found = true
                  }
                }
                if(!found && idx > 0){
                  const { matchMeta: { x: prevX, prevY } } = allElements[idx - 1]
                  const rangeXMin = prevX
                  const rangeXMax = x
                  
                  const rangeYMin = prevY
                  const rangeYMax = yMax
                  const withinX = rangeXMin < clientX && rangeXMax > clientX
                  const withinY = rangeYMin < clientY && rangeYMax > clientY
                  if(withinX && withinY){
                    insertBefore = match.id
                    found = true
                  }
                }
              }
            })
          }
        }
        if(!found){
          const { x, y, width, height } = document.querySelector(`[data-uuid="${element.id}"]`).getBoundingClientRect()
          const xMax = x + width
          const yMax = y + height
          const halfX = xMax / 2
          const halfY = yMax / 2
          if(clientY >= y && clientY < halfY){
            insertAsFirstChild = true
            found = true
          }
          if(clientY > halfY && clientY < yMax){
            pushToParent = true
            found = true
          }
        }

        return { 
          insertBefore, 
          parent,
          pushToParent, 
          insertAsFirstChild, 
          found
        }
      }
    }
  }

  compileSVG(doc, comp){
    const div = doc.createElement('div')
    div.innerHTML = comp.content
    const svg = div.firstChild
    Object.keys(comp.style).forEach(key => {
      svg.style[key] = comp.style[key]
    })
    if(comp.className){
      svg.setAttribute('class', comp.className)
    }
    if(comp.domID){
      svg.setAttribute('id', comp.domID)
    }
    svg.setAttribute('data-uuid', comp.id)
    svg.setAttribute('key', comp.id)
    return div
  }

  compileDomElement(doc, comp, addStyles = false){
    let domElement = doc.createElement(comp.tagName)
    if(comp.tagName === 'svg'){
      domElement = this.compileSVG(doc, comp)
      return domElement.firstChild
    }
    if(comp.src){
      domElement.src = comp.src
    }
    if(comp.content){
      domElement.textContent = comp.content
    }
    if(comp.inputType){
      domElement.type = comp.inputType
    }
    if(comp.className){
      domElement.className = comp.className
    }
    domElement.setAttribute('data-uuid', comp.id)
    if(addStyles && comp.style){
      Object.keys(comp.style).forEach(key => {
        domElement.style[camelToDash(key)] = comp.style[key]
      })
    }
    if(comp.children && comp.children.length){
      comp.children.forEach(child => {
        const domChild = this.compileDomElement(doc, child, addStyles)
        domElement.appendChild(domChild)
      })
    }
    return domElement
  }

  insertElementIntoIframe(comp, targetElement, insertBefore = null, push = false, insertAsFirst = false, pushToBody = false){
    const frame = document.querySelector('iframe')
    if(frame){
      const doc = frame.contentWindow.document
      const domElement = this.compileDomElement(doc, comp, pushToBody)
      if(pushToBody){
        const pageBody = doc.querySelector('#PAGE-BODY')
        pageBody.appendChild(domElement)
      }else{
        const parent = doc.querySelector(`[data-uuid="${targetElement.id}"]`)
        if(insertBefore){
          const child = doc.querySelector(`[data-uuid="${insertBefore}"]`)
          if(child){
            parent.insertBefore(domElement, child)
          }else{
            parent.appendChild(domElement)
          }
        }
        if(push){
          parent.appendChild(domElement)
        }
        if(insertAsFirst){
          parent.insertBefore(domElement, parent.firstChild)
        }
      }
      const inserted = doc.querySelector(`[data-uuid="${comp.id}"]`)
      if(inserted){
        Object.keys(inserted.style).forEach(styleKey => {
          if(!isNaN(Number(styleKey))){
            const key = inserted.style[styleKey]
            const camelKey = camelCase(key)
            comp.style[camelKey] = inserted.style[key]
          }
        })
      }
    }
  }

  setIframeHeight(){
    try{
      const frame = document.querySelector('iframe')
      if(frame){
        const { outerHeight } = frame.contentWindow
        const { scrollHeight } = frame.contentWindow.document.body
        let frameHeight = scrollHeight === 0 ? outerHeight : scrollHeight
        this.pages[0].elementsHeight = frameHeight
        this.frameWidth = frame.contentWindow.innerWidth
      }
    }catch(err){
      console.log(err)
      return
    }
  }

  assignStyles(comp, CSSValues){
    comp.childrenOpen = true
    if(comp.tagName === 'img'){
      comp.editingSrc = false
    }
    if(comp.type === 'input'){
      comp.editingPlaceholder = false
    }
    let selectorPrefix = '.'
    if(!comp.className){
      comp.className = ''
    }
    if(!comp.domID){
      comp.domID = ''
    }
    let selector = comp.className.split(' ').join('.')
    if(!selector){
      selectorPrefix = '#'
      selector = comp.domID.split(' ').join('#')
    }
    if(!selector){
      selectorPrefix = ''
      selector = comp.tagName
    }
    const keys = Object.keys(comp.style)
    const classNames = comp.className.split(' ')
    let classExists = CSSValues.includes(selectorPrefix + selector)
    if(classNames.length > 1){
      classNames.forEach(singleClass => {
        if(CSSValues.includes(singleClass)){
          classExists = true
        }
      })
    }
    if(!classExists && keys.length > 0 && !comp.inlineStyles){
      const CSS = this.getElementCSSString(comp)
      this.cssTabs[0].content += `\n\n${selectorPrefix}${selector} {\n${CSS}\n}`
    }
    if(!comp.inlineStyles){
      comp.style = {}
    }
    const newValues = this.cssTabs.map(tab => tab.content).join('\n')
    if(comp.children && comp.children.length){
      comp.children.forEach(child => {
        this.assignStyles(child, newValues)
      })
    }
  }

  duplicateChildren(element){
    const copy = {
      ...element,
      id: uuidv4()
    }
    if(element.children){
      copy.children = []
    }
    if(element.children && element.children.length > 0){
      element.children.forEach(child => {
        copy.children.push(this.duplicateChildren(child))
      })
    }
    return copy
  }

  duplicateElement(id){
    const elements = this.pages[0].elements
    let parent = null
    let isParent = null
    let target = null
    elements.forEach(el => {
      if(!parent){
        parent = this.findNestedParent(el, id)
        if(el.id === id){
          isParent = true
          parent = el
          target = el
        }
      }
    })
    if(!target){
      target = this.findElement(id)
    }
    if(target && parent){
      const element = this.duplicateChildren(target)
      let pushToParent = true
      let nextSiblingIndex = 0
      let insertBefore = null
      if(!isParent){
        const targetIdx = parent.children.findIndex(({ id: elid }) => elid === id)
        if(parent.children[targetIdx + 1]){
          pushToParent = false
          insertBefore = parent.children[targetIdx + 1]
          nextSiblingIndex = targetIdx + 1
        }
      }else{
        const idx = elements.findIndex(({ id: elid }) => elid === id)
        if(elements[idx + 1]){
          pushToParent = false
          insertBefore = elements[idx + 1]
          nextSiblingIndex = idx + 1
        }
      }
      const frame = document.querySelector('iframe')
      const doc = frame.contentWindow.document
      const domElement = this.compileDomElement(doc, element, true)
      if(pushToParent){
        //Insert into iframe
        if(isParent){
          doc.querySelector('#PAGE-BODY').appendChild(domElement)
          this.pages[0].elements.push(element)
        }else{
          const domParent = doc.querySelector(`[data-uuid="${parent.id}"]`)
          domParent.appendChild(domElement)
          parent.children.push(element)
        }
      }else{
        if(isParent){
          const nextSibling = this.pages[0].elements[nextSiblingIndex]
          const nextChild = doc.querySelector(`[data-uuid="${nextSibling.id}"]`)
          doc.querySelector('#PAGE-BODY').insertBefore(domElement, nextChild)
          this.pages[0].elements.splice(nextSiblingIndex, 0, element)
        }else{
          const nextSibling = parent.children[nextSiblingIndex]
          const nextChild = doc.querySelector(`[data-uuid="${nextSibling.id}"]`)
          doc.querySelector(`[data-uuid="${parent.id}"]`).insertBefore(domElement, nextChild)
          parent.children.splice(nextSiblingIndex, 0, element)
        }
      }
    }
    setTimeout(() => {
      this.setIframeHeight()
      this.sizeCalcChange = !this.sizeCalcChange
      setTimeout(() => {
        this.recalculateSizes(this.pages[0].elements)
      }, 100)
    }, 500)
  }

  deleteElement(id){
    const elements = this.pages[0].elements
    let parent = null
    let isParent = false
    elements.forEach(el => {
      if(!parent){
        parent = this.findNestedParent(el, id)
        if(el.id === id){
          isParent = true
          parent = el
        }
      }
    })
    if(parent){
      if(this.selectedElement === id){
        this.selectedElement = isParent ? null : parent.id
      }
      if(this.cssElement && this.cssElement === id){
        this.toggleCSSTab(id)
      }
      if(isParent){
        const idx = this.pages[0].elements.findIndex(({ id: eid }) => eid === parent.id)
        this.pages[0].elements.splice(idx, 1)
      }else{
        const childIdx = parent.children.findIndex(({ id: eid }) => eid === id)
        parent.children.splice(childIdx, 1)
      }
      //Remove the element from the IFRAME dom
      const frame = document.querySelector('iframe')
      if(frame){
        const doc = frame.contentDocument
        doc.querySelector(`[data-uuid="${id}"]`).remove()
      }
    }
    this.handleWindowResize()
  }

  insertComponent(e){
    try{
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
        let targetParent = null
        let insertBeforeID = null
        let pushToParentElem = false
        let insertAsFirst = false
        let spliceIndex = null
        if(this.dragTarget){
          //Find the targetelement to append to
          const { 
            insertBefore, 
            pushToParent, 
            parent,
            insertAsFirstChild, 
            found
           } = this.findDragTargetInsertIndex(this.dragTarget, clientX, clientY)
          if(found){
            insertBeforeID = insertBefore
            insertAsFirst = insertAsFirstChild
            pushToParentElem = pushToParent
          }
          targetParent = parent
          this.dragTarget = null
        }
        const comp = {
          ...this.activeDrag,
          className: this.activeDrag.className ? this.activeDrag.className : '',
          domID: this.activeDrag.domID ? this.activeDrag.domID : '',
          cssOpen: false,
          editingClass: false,
          editingID: false,
          toolbarOptionsOpen: false,
          locked: false,
          id: uuidv4()
        }
        const stylesheetValues = this.cssTabs.map(tab => tab.content).join('\n')
        this.assignStyles(comp, stylesheetValues)
        if(comp.children && comp.children.length){
          this.assignChildIds(comp.children)
        }
        //If the parent element is a section
        if(this.parentElements.includes(this.activeDrag.type) && !targetParent){
          comp.position.xPos -= editorX
          comp.position.yPos -= editorY
          page.elements.splice(this.dragIndex, 0, comp)
          this.setSelectedElement(comp.id, null)
          this.dragIndex = 0
          this.elementLen += 1
        }else{
          //The element is not a section or header element and should be appended to the IFRAME manually using insertbefore
          //If there is no targetparent then the item should be inserted between sections if there are any
          if(targetParent){
            if(insertBeforeID){
              const idx = targetParent.children.findIndex(({ id: insertItemID }) => insertItemID === insertBeforeID)
              targetParent.children.splice(idx, 0, comp)
              this.insertElementIntoIframe(comp, targetParent, insertBeforeID)
            }
            if(!insertBeforeID && pushToParentElem){
              this.insertElementIntoIframe(comp, targetParent, null, true)
              targetParent.children.push(comp)
            }
            if(!pushToParentElem && insertAsFirst){
              targetParent.children.splice(-1, 0, comp)
              this.insertElementIntoIframe(comp, targetParent, null, false, true)
            }
            this.elementLen += 1
            this.setSelectedElement(comp.id, null)
          }else{
            this.insertElementIntoIframe(comp, null, null, null, null, true)
            this.pages[0].elements.push(comp)
            this.elementLen += 1
            this.setSelectedElement(comp.id, null)
          }
        }
        setTimeout(() => {
          this.setIframeHeight()
          this.sizeCalcChange = !this.sizeCalcChange
          this.recalculateSizes(this.pages[0].elements)
        }, 300)
      }
    }catch(err){
      this.activeDrag = null
    }finally{
      this.dragMetaData = {...initDragMeta}
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
      this.activeDrag = null
      this.unsetSelectedElement()
      const copy = {...item}
      const { rawWidth, rawHeight, width: cssWidth } = copy.dragProps
      let width = rawWidth
      let height = rawHeight
      let xOffset = rawWidth / 2
      let yOffset = rawHeight / 2
      const precentWidth = this.convertPrecentToNumber(cssWidth)
      if(precentWidth){
        const elem = document.querySelector('.build-area_page')
        const { width: pageWidth } = elem.getBoundingClientRect()
        width = pageWidth * (precentWidth / 100)
        xOffset = width / 2
      }
      //NEED TO FIX THIS FOR ITEMS THAT DONT HAVE A WIDTH OR HEIGHT!!
      if(!item.type === 'text'){
        const { clientWidth, clientHeight } = this.getItemSize(item)
        yOffset = clientHeight / 2
        xOffset = clientWidth / 2
        width = clientWidth
        height = clientHeight
      }
      copy.position = {
        xPos: x - xOffset,
        yPos: y - yOffset,
        width: width,
        height: height
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