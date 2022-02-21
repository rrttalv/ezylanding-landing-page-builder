import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { scripts } from "../config/constants";

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
  dragSection = null
  childDragIndex = 0
  childDragSection = null
  currentSectionId = null
  elementLen = 0
  activeTextEditor = null

  absoluteDisabled = []

  activeFonts = [
    {
      name: 'arial',
      script: null,
      id: 'arial'
    }
  ]

  dragSectionProps = {
    insertBefore: null,
    insertAfter: null,
    sectionId: null
  }

  activeDrag = null
  activePage = null
  selectedElement = null
  selectedParentElement = null
  movingElement = false
  editingCSS = false
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
      let targetElem = null
      elements.forEach(element => {
        //Check if the text element is outside of the divs
        if(element.id === parentId && element.children){
          const res = this.findNestedChild(element.children, id)
          if(res){
            targetElem = res
          }
        }
        if(element.id !== parentId && element.children){
          const res = this.findNestedChild(element.children, id)
          if(res){
            targetElem = res
          }
        }
      })
      if(keys.length === 1 && targetElem){
        targetElem[keys[0]] = propValue
      }
      const parentDomNode = document.querySelector(`[data-uuid="${parentId}"] [data-slate-node="text"]`)
      if(parentDomNode && targetElem){
        setTimeout(() => {
          const { width, height } = parentDomNode.getBoundingClientRect()
          if(elementType === 'text'){
            this.updateInsideFrame(targetElem, 'width')
            this.updateInsideFrame(targetElem, 'height')
          }
          if(elementType === 'button'){
            const { height: btnHeight } = targetElem.style
            if(btnHeight){
              let trueHeight = 0
              if(btnHeight.includes('px')){
                trueHeight = this.convertPixelsToNumber(btnHeight)
              }
              if(btnHeight.includes('%')){
                const precentageHeight = this.convertPrecentToNumber(btnHeight)
                const parent = document.querySelector(`[data-uuid="${parentId}"]`)
                if(parent && parent.clientHeight){
                  trueHeight = (parent.clientHeight * (precentageHeight / 100))
                }
              }
              if(height > trueHeight){
                targetElem.style.height = height + 'px'
                this.updateInsideFrame(targetElem, 'height')
              }
            }
          }
          if(keys && keys[0] === 'content'){
            this.updateInsideFrame(targetElem, 'content')
          }
        }, 10)
      }
    }
  }

  setSelectedElement(id, parentId){
    this.selectedElement = id
    this.selectedParentElement = parentId
  }

  updateInsideFrame(element, propName){
    const { id } = element
    const frame = document.querySelector('iframe')
    if(frame){
      const doc = frame.contentWindow.document
      const el = doc.querySelector(`[data-uuid="${id}"]`) 
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
  }

  toggleCSSTab(id){
    const target = this.findElement(id)
    if(target){
      const newVal = !target.cssOpen
      this.editingCSS = newVal
      target.cssOpen = newVal
    }
  }

  changeStylePropInFrame(elementId, propName, propValue){

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
      const comp = {
        ...this.activeDrag,
        cssOpen: false,
        locked: false,
        classNameOpen: false,
        id: uuidv4()
      }
      if(comp.children && comp.children.length){
        comp.children = comp.children.map(child => {
          return {
            ...child,
            id: uuidv4()
          }
        })
      }
      //If the parent element is a section
      if(this.parentElements.includes(this.activeDrag.type)){
        comp.position.xPos -= editorX
        comp.position.yPos -= editorY
        page.elements.splice(this.dragIndex, 0, comp)
        this.setSelectedElement(comp.id, null)
        this.dragIndex = 0
        this.dragSection = null
      }else{
        
      }
      this.elementLen += 1
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