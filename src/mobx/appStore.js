import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { scripts } from "../config/constants";
import cssParser from 'css'
import { camelCase, replace, trim } from "lodash";
import { camelToDash, getFlexKeys } from "../utils";

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

  frameWidth = 0

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
    setTimeout(() => {
      this.recalculateSizes(this.pages[0].elements)
      this.sizeCalcChange = !this.sizeCalcChange
    }, 1000)
  }

  handleWindowResize(){
    this.recalculateSizes(this.pages[0].elements)
    this.sizeCalcChange = !this.sizeCalcChange
    this.setIframeHeight()
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


  findNestedChild(children, id){
    let target = null
    if(!children){
      return null
    }
    children.forEach((element, childIdx) => {
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
    if(!this.parentElements.includes(this.activeDrag.type)){
      const elems = document.elementsFromPoint(rawX, rawY)
      let target = null
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
          if(idx === 0 || idx === 1){
            const id = element.getAttribute('data-uuid')
            console.log(element)
            if(id){
              target = id
            }
          }
        }
      })
      this.dragTarget = target
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
    const frame = document.querySelector('iframe').contentWindow.document
    const el = frame.querySelector(`[data-uuid="${id ? id : this.activeTextEditor}"]`)
    if(el){
      if(id){
        el.style.opacity = '0.1'
      }else{
        const component = this.findElement(this.activeTextEditor)
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
      this.sizeCalcChange = !this.sizeCalcChange
      return
    }
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

  findDragTargetInsertIndex(id, clientX, clientY){
    let element = this.findElement(id)
    let insertIndex = null
    if(element){
      if(!element.children){
        element = this.findParentElementByChildID(this.pages[0].elements, id)
      }
      if(element.children && element.children.length === 1){
        //Just check if the clientX and clientY is before or after the element
        const [child] = element.children
        const domChild = document.querySelector(`[data-uuid="${child.id}"]`)
        if(domChild){
          const { x, y, width, height } = domChild.getBoundingClientRect()
          const xMax = x + width
          const yMax = y + height
          if(clientX < x){
            insertIndex = 0
          }
          if(insertIndex === null){
            if(clientY < y){
              insertIndex = 0
            }
          }
          if(insertIndex === null){
            if(xMax < clientX){
              insertIndex = 1
            }
          }
          if(insertIndex === null){
            if(yMax < clientY){
              insertIndex = 1
            }
          }
          const isBetweenX = x < clientX && (x + width) > clientX
          if(insertIndex === null && isBetweenX){
            insertIndex = 0
          }
          const isBetweenY = y < clientY && (y + height) > clientY
          if(insertIndex === null && isBetweenY){
            insertIndex = 0
          }
        }
        return { insertIndex, element }
      }
      if(element.children && element.children.length > 1){
        let prevX = 0
        let prevY = 0
        let prevXMax = 0
        let prevYMax = 0
        element.children.forEach((child, idx) => {
          if(insertIndex === null){
            const domChild = document.querySelector(`[data-uuid="${child.id}"]`)
            if(domChild){
              const { x, y, width, height } = domChild.getBoundingClientRect()
              const xMax = x + width
              const yMax = y + height
              const isOnElementX = x < clientX && xMax > clientX
              const isOnElementY = y < clientY && yMax > clientY
              if(isOnElementX && isOnElementY && insertIndex === null){
                insertIndex = idx
              }
              if(insertIndex === null){
                if(idx === 0){
                  if(clientX < x || clientY < y){
                    insertIndex = 0
                  }
                  prevX = x
                  prevXMax = xMax
                  prevY = y
                  prevYMax = yMax
                }else{
                  //This means that the element is between the two elements horizontally
                  const betweenX = prevXMax < clientX && x > clientX
                  const betweenY = prevYMax < clientY && y > clientY
                  if((betweenX || betweenY) && insertIndex === null){
                    insertIndex = idx
                  }
                }
              }
              //If the last child is looped and there is no result, the insert index will be the current index + 1
              if(element.children.length - 1 === idx && insertIndex === null){
                insertIndex = idx + 1
              }
            }
          }
        })
      }
    }
    return { insertIndex, element }
  }

  insertElementIntoIframe(comp, targetElement, insertBefore = null){
    const frame = document.querySelector('iframe')
    if(frame){
      const doc = frame.contentWindow.document
      const parent = doc.querySelector(`[data-uuid="${targetElement.id}"]`)
      const domElement = doc.createElement(comp.tagName)
      if(comp.src){
        domElement.src = comp.src
      }
      if(comp.content){
        domElement.textContent = comp.content
      }
      if(comp.inputType){
        domElement.type = comp.inputType
      }
      domElement.className = comp.className
      domElement.setAttribute('data-uuid', comp.id)
      Object.keys(comp.style).forEach(key => {
        domElement.style[key] = comp.style[key]
      })
      if(insertBefore){
        const child = doc.querySelector(`[data-uuid="${insertBefore}"]`)
        if(child){
          parent.insertBefore(domElement, child)
        }else{
          parent.appendChild(domElement)
        }
      }
      if(!insertBefore){
        parent.appendChild(domElement)
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
    const frame = document.querySelector('iframe')
    if(frame){
      this.pages[0].elementsHeight = frame.contentWindow.outerHeight
      this.frameWidth = frame.contentWindow.innerWidth
    }
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
      let targetElement = null
      let spliceIndex = null
      if(this.dragTarget){
        //Find the targetelement to append to
        const { insertIndex, element: toInsertInto } = this.findDragTargetInsertIndex(this.dragTarget, clientX, clientY)
        if(toInsertInto){
          if(insertIndex !== null){
            spliceIndex = insertIndex
          }else{
            spliceIndex = toInsertInto.children.length - 1
          }
          targetElement = toInsertInto
        }
        this.dragTarget = null
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
        this.elementLen += 1
      }else{
        //The element is not a section or header element and should be appended to the IFRAME manually using insertbefore
        if(targetElement && spliceIndex !== null){
          const nextChild = targetElement.children[spliceIndex ]
          let insertBefore = null
          const hasChildren = targetElement.children && targetElement.children.length > 0
          if(nextChild && hasChildren){
            insertBefore = nextChild.id
          }
          if(spliceIndex === 0 && hasChildren){
            insertBefore = targetElement.children[0].id
          }
          console.log(nextChild, spliceIndex)
          if(!nextChild && hasChildren && spliceIndex > 0){
            targetElement.children.push(comp)
          }else{
            targetElement.children.splice(spliceIndex, 0, comp)
          }
          this.insertElementIntoIframe(comp, targetElement, insertBefore)
        }
      }
      setTimeout(() => {
        this.recalculateSizes(this.pages[0].elements)
        //this.setElementInitStyle(this.pages[0].elements)
        this.setIframeHeight()
        this.sizeCalcChange = !this.sizeCalcChange
      }, 100)
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
      //NEED TO FIX THIS FOR ITEMS THAT DONT HAVE A WIDTH OR HEIGHT!!
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