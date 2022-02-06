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

  handleItemDragMove(clientX, clientY){
    if(!this.activeDrag){
      return
    }
    const dx = (clientX - this.mouseStartX)
    const dy = (clientY - this.mouseStartY)
    this.activeDrag.position.xPos += dx
    this.activeDrag.position.yPos += dy
    this.mouseStartX = clientX
    this.mouseStartY = clientY
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
      comp.position.xPos -= editorX
      comp.position.yPos -= editorY
      page[activeArea].push(comp)
      this.setSelectedElement(comp.id, activeArea)
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