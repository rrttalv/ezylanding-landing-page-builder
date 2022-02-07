import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'

class AppStore {
  constructor() {
    makeAutoObservable(this)
  }

  mouseStartX = 0
  mouseStartY = 0
  mouseEventList = {
    sidebarComponentDrag: false,
    elementDrag: false,
  }
  dragIndex = 0
  dragSection = null
  activeDrag = null
  activePage = null
  selectedElement = null
  selectedElementGroup = null
  activeSection = null
  pages = [
    {
      route: '/',
      id: uuidv4(),
      header: [],
      body: [],
      footer: [],
      headerHeight: 60,
      bodyHeight: 500,
      footerHeight: 100,
      style: {
        background: '#ffffff',
      },
      hideHeader: false,
      hideBody: false,
      hideFooter: false,
      customCode: ''
    }
  ]

  setSelectedElement(id, group){
    this.selectedElement = id
    this.selectedElementGroup = group
  }

  updateActivePageProp(propName, value){
    const idx = this.pages.findIndex(({ id: pageId }) => pageId === this.activePage)
    this.pages[idx][propName] = value
  }

  unsetSelectedElement(){
    this.selectedElement = null
    this.selectedElementGroup = null
  }

  findNestedChild(children, id){
    let target = null
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

  moveElement(clientX, clientY){
    if(this.selectedElement && this.selectedElementGroup){
      const page = this.getActivePage()
      let target = null
      page[this.selectedElementGroup].forEach((element, idx) => {
        if(!target){
          if(element.id === this.selectedElement){
            target = element
          }
          if(element.id !== this.selectedElement && element.children && element.children.length){
            target = this.searchNestedChildren(element.children, this.selectedElement)
          }
        }
      })
      //Only allow SHIFTING
      if(target.type === 'section'){

      }else{

      }
      console.log(target)
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

  getActiveDragArea(clientX, clientY){
    const areas = [
      {
        section: 'header',
        selector: '.build-area_header',
      },
      {
        section: 'body',
        selector: '.build-area_body'
      }
    ]
    let activeArea = null
    areas.forEach(area => {
      const domArea = document.querySelector(area.selector)
      if(domArea){
        const { x, y, width, height } = domArea.getBoundingClientRect()
        if(clientX > x && clientX < x + width && clientY > y && clientY < y + height){
          activeArea = area.section
        }
      }
    })
    return activeArea
  }

  checkDragIndex(x, y, clientX, clientY){
    const area = this.getActiveDragArea(clientX, clientY)
    const elements = this.pages[0][area]
    if(!area){
      return
    }
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
          this.dragSection = area
        }
        if(clientY > yMidBound && clientY < yBottomBound){
          this.dragIndex = idx + 1
          this.dragSection = area
        }
      }
    })
    if(elements.length === 0){
      this.dragSection = area
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
    if(this.activeDrag.type === 'section'){
      this.checkDragIndex(xPos, yPos, rawX, rawY)
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
    if(val.includes('px')){
      return Number(val.replace('px', ''))
    }else{
      return false
    }
  }

  convertPrecentToNumber(val){
    if(val.includes('%')){
      return Number(val.replace('%', ''))
    }
    return false
  }

  insertComponent(e){
    if(this.activeDrag){
      const { clientX, clientY } = e
      const areas = [
        {
          section: 'header',
          selector: '.build-area_header',
        },
        {
          section: 'body',
          selector: '.build-area_body'
        }
      ]
      const activeArea = this.getActiveDragArea(clientX, clientY)
      const editor = document.querySelector('.editor')
      if(!activeArea || !editor){
        return
      }
      const { x: editorX, y: editorY } = editor.getBoundingClientRect()
      const page = this.getActivePage()
      const comp = {
        ...this.activeDrag,
        id: uuidv4()
      }
      if(this.activeDrag.type === 'section'){
        comp.position.xPos -= editorX
        comp.position.yPos -= editorY
        page[activeArea].splice(this.dragIndex, 0, comp)
        this.setSelectedElement(comp.id, activeArea)
        this.dragIndex = 0
        this.dragSection = null
      }else{
        //Insert the component inside of a section
      }
    }
  }

  setActiveSection(section, e){
    if(section){
      const { width, height, x, y } = e.target.getBoundingClientRect()
      this.activeSection = {
        section,
        x,
        y,
        width,
        height
      }
    }else{
      this.activeSection = null
    }
  }

  setActiveDragItem(item, x, y, type){
    if(item){
      const copy = {...item}
      let width = item.style.width
      let height = item.style.height
      const pxWidth = this.convertPixelsToNumber(width)
      const precentWidth = this.convertPrecentToNumber(width)
      const pxHeight = this.convertPixelsToNumber(height)
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
      copy.position = {
        xPos: x - xOffset,
        yPos: y - yOffset,
        width: width + 'px',
        height: pxHeight + 'px'
      }
      this.activeDrag = copy
      this.mouseStartX = x
      this.mouseStartY = y
      this.toggleActiveMouseEvent(type, true)
    }else{
      this.activeDrag = null
      this.mouseStartX = 0
      this.mouseStartY = 0
      this.toggleActiveMouseEvent(null, false)
    }
  }

}

export default AppStore;