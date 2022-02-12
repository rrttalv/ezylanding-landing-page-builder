import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { scripts } from "../config/constants";

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
  activeDrag = null
  activePage = null
  selectedElement = null
  selectedParentElement = null
  selectedElementGroup = null
  movingElement = false
  activeGroup = null
  parentElements = ['section', 'header']
  activeFramework = null
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

  setActiveFramework(id){
    const script = scripts.find(({ id: sid }) => sid === id)
    if(script){
      this.activeFramework = script
    }else{
      this.activeFramework = null
    }
  }

  setSelectedElement(id, group){
    this.selectedElement = id
    this.selectedElementGroup = group
  }

  setMovingElement(status, x, y){
    this.mouseStartX = status ? x : 0
    this.mouseStartY = status ? y : 0
    this.movingElement = status
    if(status){
      let target = null
      this.pages[0][this.selectedElementGroup].forEach((section, idx) => {
        const child = this.findNestedChild(section.children, this.selectedElement)
        if(child){
          target = child.id
        }
      })
      this.selectedParentElement = target
    }else{
      if(this.activePage && this.selectedElement && this.selectedParentElement){
        const page = this.pages.find(({ id }) => id === this.activePage)
        const { 
          newSection, 
          newParentElement, 
          newGroup
        } = this.checkIfElementMoved(page, x, y)
        this.moveElementIfNeeded(newSection, newParentElement, newGroup, page, this.selectedElement, x, y)
        this.selectedParentElement = null
        this.selectedElementGroup = null
      }
    }
  }

  moveElementIfNeeded(newSection, newParentElement, newGroup, page, elementId, x, y){
    const elems = [
      {
        sections: page.header,
        key: 'header'
      },
      {
        sections: page['body'],
        key: 'body'
      },
      {
        sections: page['footer'],
        key: 'footer'
      }
    ]
    let newSectionIdx = null
    let newParentIdx = null
    let removedChild = false
    elems.forEach(area => {
      area.sections.forEach((section, sectionIdx) => {
        if(section.id === newSection){
          newSectionIdx = sectionIdx
        }
        section.children.forEach((parentElem, parentIdx) => {
          const child = this.findNestedChild(parentElem.children, elementId)
          if(parentElem.id !== newParentElement){
            if(child){
              const idx = parentElem.children.findIndex(({ id: cid }) => cid === elementId)
              parentElem.children.splice(idx, 1)
              removedChild = {...child}
            }
          }
          if(parentElem.id === newParentElement){
            newParentIdx = parentIdx
          }
        })
      })
    })
    if(removedChild){
      //!!!!!iMPORTANT
      //NEED TO RECALCULATE THE SECTION OFFSET BASED ON X AND Y FOR THE REMOVED CHILD
      //!!!!!iMPORTANT
      const parent = page[newGroup][newSectionIdx].children[newParentIdx]
      const { id } = parent
      const { x: parentX, y: parentY } = document.querySelector(`[data-uuid="${id}"]`).getBoundingClientRect()
      removedChild.position.xPos = x - parentX
      removedChild.position.yPos = y - parentY
      removedChild.id = uuidv4()
      this.unsetSelectedElement()
      page[newGroup][newSectionIdx].children[newParentIdx].children.push(removedChild)
      this.setSelectedElement(removedChild.id, newGroup)
    }
  }

  checkIfInside(x, y, targetX, targetY, targetWidth, targetHeight){
    return targetX < x && targetX + targetWidth >= x && targetY < y && targetY + targetHeight >= y
  }

  checkIfElementMoved(page, x, y){
    let newGroup = null
    let newSection = null
    let newParentElement = null
    const elems = [
      {
        sections: page.header,
        key: 'header'
      },
      {
        sections: page['body'],
        key: 'body'
      },
      {
        sections: page['footer'],
        key: 'footer'
      }
    ]
    elems.forEach(elem => {
      elem.sections.forEach(section => {
        const { x: sectionX, y: sectionY, width: sectionW, height: sectionH } = document.querySelector(`[data-uuid="${section.id}"]`).getBoundingClientRect()
        if(this.checkIfInside(x, y, sectionX, sectionY, sectionW, sectionH)){
          newGroup = elem.key
          newSection = section.id
          section.children.forEach(element => {
            const { x: elemX, y: elemY, width: elemW, height: elemH } = document.querySelector(`[data-uuid="${element.id}"]`).getBoundingClientRect()
            if(this.checkIfInside(x, y, elemX, elemY, elemW, elemH)){
              newParentElement = element.id
            }
          })
        }
      })
    })
    return { newSection, newParentElement, newGroup }
    
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

  moveElement(clientX, clientY, offsetX, offsetY){
    if(this.selectedElement && this.selectedElementGroup){
      const page = this.getActivePage()
      let target = null
      page[this.selectedElementGroup].forEach((element, idx) => {
        if(!target){
          if(element.id === this.selectedElement){
            target = element
          }
          if(element.id !== this.selectedElement && element.children && element.children.length){
            target = this.findNestedChild(element.children, this.selectedElement)
          }
        }
      })
      const dx = (clientX - this.mouseStartX)
      const dy = (clientY - this.mouseStartY)
      //Only allow SHIFTING
      if(target.type === 'section'){

      }else{
        this.checkChildComponentDragIndex(offsetX, offsetY)
        target.position.xPos += dx
        target.position.yPos += dy
        this.mouseStartX = clientX
        this.mouseStartY = clientY
      }
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

  checkDragIndex(clientX, clientY){
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

  checkChildComponentDragIndex(clientX, clientY){
    const area = this.getActiveDragArea(clientX, clientY)
    const elements = this.pages[0][area]
    if(!area){
      return
    }
    elements.forEach((section, idx) => {
      const elem = document.querySelector(`[data-uuid="${section.id}"]`)
      if(elem){
        const { x, y, width, height } = elem.getBoundingClientRect()
        const xMax = width + x
        const yMax = height + y
        if(x < clientX && xMax > clientX && y < clientY && yMax > clientY){
          this.currentSectionId = section.id
          this.childDragSection = area
        }
      }
    })
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
    }else{
      this.checkChildComponentDragIndex(rawX, rawY)
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

  getSectionTargetDiv(clientX, clientY, page, activeArea){
    const domSection = document.querySelector(`[data-uuid="${this.currentSectionId}"] .comp-border`)
    const section = page[activeArea].find(({ id }) => id === this.currentSectionId)
    let targetDiv = null
    let posMap = {}
    if(domSection && section){
      const ids = section.children.map(child => child.id)
      domSection.childNodes.forEach((node, idx) => {
        const { width: cW, height: cH, x: cX, y: cY } = node.getBoundingClientRect()
        const xMax = cW + cX
        const yMax = cH + cY
        if(clientY > cY && clientY < yMax && clientX > cX && clientX < xMax){
          targetDiv = node.getAttribute('data-uuid')
          posMap.xPos = clientX - cX
          posMap.yPos = clientY - cY
          posMap.parentHeight = cH
          posMap.parentWidth = cW
        }
      })
    }
    return { posMap, targetDiv }
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
      if(comp.children && comp.children.length){
        comp.children = comp.children.map(child => {
          return {
            ...child,
            id: uuidv4()
          }
        })
      }
      if(this.parentElements.includes(this.activeDrag.type)){
        comp.position.xPos -= editorX
        comp.position.yPos -= editorY
        page[activeArea].splice(this.dragIndex, 0, comp)
        this.setSelectedElement(comp.id, activeArea)
        this.dragIndex = 0
        this.dragSection = null
      }else{
        //Insert the component inside of a section
        const { targetDiv, posMap } = this.getSectionTargetDiv(clientX, clientY, page, activeArea)
        const domSection = document.querySelector(`[data-uuid="${this.currentSectionId}"] .comp-border`)
        const section = page[activeArea].find(({ id }) => id === this.currentSectionId)
        if(targetDiv){
          //If there is a target div inside the section
          const childIdx = section.children.findIndex(({ id: childId }) => childId === targetDiv)
          if(comp.style.width && comp.style.height){
            let compHeight = this.convertPixelsToNumber(comp.style.height)
            let compWidth = this.convertPixelsToNumber(comp.style.width)
            //Calculate the offset of the component width and height since the clientX and clientY will always be in the center of the component
            if(compHeight){
              posMap.yPos -= (compHeight / 2)
            }
            if(!compWidth){
              let compWidth = this.convertPrecentToNumber(comp.style.width)
              posMap.xPos -= ((posMap.parentWidth * (compWidth / 100)) / 2)
            }else{
              posMap.xPos -= (compWidth / 2)
            }
            comp.xPos = posMap.xPos
            comp.yPos = posMap.yPos
            comp.position = {
              ...comp.position,
              xPos: posMap.xPos,
              yPos: posMap.yPos
            }
            section.children[childIdx].children.push(comp)
            setTimeout(() => {
              this.setSelectedElement(comp.id, activeArea)
            }, 200)
          }
        }else{
          //If there is not a target div, insert the component with position absolute inside the section element
        }
      }
    }
  }

  setActiveGroup(section, e){
    if(section){
      const { width, height, x, y } = e.target.getBoundingClientRect()
      this.activeGroup = {
        section,
        x,
        y,
        width,
        height
      }
    }else{
      this.activeGroup = null
    }
  }

  setActiveDragItem(item, x, y){
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
    }else{
      this.activeDrag = null
      this.mouseStartX = 0
      this.mouseStartY = 0
    }
  }

}

export default AppStore;