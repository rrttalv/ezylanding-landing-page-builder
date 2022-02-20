import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { scripts } from "../config/constants";

const defaultShiftProps = {
  parentElement: null,
  parentPos: {
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0
  },
  targetElement: null,
  targetElementPos: {
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
  },
  prevSibling: null,
  prevSiblingPos: {
    xMin: 0,
    yMin: 0,
    yMax: 0,
    xMax: 0
  },
  nextSibling: null,
  nextSiblingPos: {
    xMin: 0,
    yMin: 0,
    xMax: 0,
    yMax: 0
  }
}

const initShiftBox = {
  display: false,
  targetElement: null
}

class AppStore {
  constructor() {
    makeAutoObservable(this)
  }

  mouseStartX = 0
  mouseStartY = 0

  variableMouseX = 0
  variableMouseY = 0

  dragIndex = 0
  dragSection = null
  childDragIndex = 0
  childDragSection = null
  currentSectionId = null
  elementLen = 0
  activeTextEditor = null

  bottomShiftBox = {
    display: false,
    targetElement: null,
  }

  topShiftBox = {
    display: false,
    targetElement: null
  }

  absoluteDisabled = []

  shiftingElement = null
  shiftProps = defaultShiftProps

  activeElementMeta = {}
  panPoint = null

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
  selectedElementGroup = null
  movingElement = false
  editingCSS = false
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

  setPanPoint(direction, x, y){
    this.panPoint = direction
    if(!direction){
      this.mouseStartX = 0
      this.mouseStartY = 0
    }else{
      this.mouseStartX = x
      this.mouseStartY = y
    }
  }

  childPrecentageToPx(child, parent){
    const { position, style } = child
    let pxWidth = child.style.width || child.position.width
    let pxHeight = child.style.height || child.position.height
    const parentElem = document.querySelector(`[data-uuid="${parent.id}"]`)
    if(!parentElem){
      return {
        pxWidth,
        pxHeight,
      }
    }
    if(typeof(pxWidth) === 'string' && pxWidth && pxWidth.includes('%')){
      if(parentElem){
        const { width: parentWidth } = parentElem.getBoundingClientRect()
        const precentage = Number(pxWidth.replace('%', '')) / 100
        pxWidth = parentWidth * precentage
      }
    }
    if(typeof(pxHeight) === 'string' && pxHeight && pxHeight.includes('%')){
      if(parentElem){
        const { height: parentHeight } = parentElem.getBoundingClientRect()
        const precentage = Number(pxHeight.replace('%', '')) / 100
        pxHeight = parentHeight * precentage
      }
    }
    return {
      pxWidth, pxHeight
    }
  }

  findElement(id, area){
    if(area){
      const elements = this.pages[0][area]
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
    }else{
      return null
    }
  }

  handlePan(e){
    if(!this.panPoint || !this.selectedElement || !this.selectedElementGroup){
      return
    }
    const elements = this.pages[0][this.selectedElementGroup]
    let target = null
    let parent = null
    elements.forEach(element => {
      if(!target){
        const { target: found } = this.findNestedChild(element.children, this.selectedElement, element)
        if(found.target && found.target){
          parent = found.parent
          target = found.target
        }
      }
    })
    if(!target){
      return
    }
    const { clientX, clientY } = e
    const dx = clientX - this.mouseStartX
    const dy = clientY - this.mouseStartY
    const pxWidth = target.position.width
    const pxHeight = target.position.height
    if(target.style.width && target.style.width.includes('%')){
      const { pxWidth: w } = this.childPrecentageToPx(target, parent)
      target.position.width = w
    }
    if(target.style.height && target.style.height.includes('%')){
      const { pxHeight: h } = this.childPrecentageToPx(target, parent)
      target.position.height = h
    }
    if(this.panPoint === 'right'){
      target.position.width += dx
    }
    if(this.panPoint === 'left'){
      if(dx < 0){
        target.position.width += Math.abs(dx)
        target.position.xPos += dx
        this.updateInsideFrame(target, 'xPos')
      }
      if(dx > 0){
        target.position.width -= dx
        target.position.xPos += dx
        this.updateInsideFrame(target, 'xPos')
      }
    }
    if(this.panPoint === 'bottom'){
      target.position.height += dy
    }
    if(this.panPoint === 'top'){
      if(dy < 0){
        target.position.height += Math.abs(dy)
        target.position.yPos += dy
      }
      if(dy > 0){
        target.position.height -= Math.abs(dy)
        target.position.yPos += dy
      }
    }
    this.updateInsideFrame(target, 'size')
    this.mouseStartX = clientX
    this.mouseStartY = clientY
  }

  setNestedChildrenProp(children, propName, propValue){
    children.forEach(child => {
      child[propName] = propValue
      if(child.children && child.children.length){
        this.setNestedChildrenProp(child.children, propName, propValue)
      }
    })
  }

  toggleAbsolutePositioning(area, sectionId){
    const section = this.pages[0][area].find(({ id }) => id === sectionId)
    section.children.forEach(child => {
      const newValue = !child.absoluteChildren
      child.absoluteChildren = newValue
      if(child.children.length){
        this.setNestedChildrenProp(child.children, 'absolutePosition', newValue)
      }
    })
    if(this.absoluteDisabled.includes(sectionId)){
      this.absoluteDisabled = this.absoluteDisabled.filter(id => id !== sectionId)
    }else{
      this.absoluteDisabled.push(sectionId)
    }
  }

  changeElementProp(id, elementType, propName, propValue){
    if(elementType === 'text' || elementType === 'button'){
      const { parentId } = this.activeElementMeta
      const keys = propName.split('|')
      const elements = this.pages[0][this.selectedElementGroup]
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
            targetElem.position = {
              ...targetElem.position,
              width: width,
              height: height
            }
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
                targetElem.position.height = height
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

  setSelectedElement(id, group, parentId = null){
    this.selectedElement = id
    this.selectedParentElement = parentId
    this.selectedElementGroup = group
  }

  updateInsideFrame(element, propName){
    const { id } = element
    const frame = document.querySelector('iframe')
    if(frame){
      const doc = frame.contentWindow.document
      const el = doc.querySelector(`[data-uuid="${id}"]`)
      if(el){
        const { position } = element
        if(propName === 'position' && element.absolutePosition){
          el.style.transform = `translate(${position.xPos}px, ${position.yPos}px)`
          element.style.transform = `translate(${position.xPos}px, ${position.yPos}px)`
        }
        if(propName === 'content'){
          el.innerText = element.content
        }
        const posProps = ['width', 'height', 'xPos', 'yPos', 'size']
        if(posProps.includes(propName)){
          el.style.width = `${position.width}px`
          el.style.height = `${position.height}px`
          element.style.height = `${position.height}px`
          element.style.width = `${position.width}px`
          if(element.absolutePosition){
            element.style.transform = `translate(${position.xPos}px, ${position.yPos}px)`
            el.style.transform = `translate(${position.xPos}px, ${position.yPos}px)`
          }
        }
      }
    }
  }

  setMovingElement(status, x, y){
    this.mouseStartX = status ? x : 0
    this.mouseStartY = status ? y : 0
    this.variableMouseX = status ? x : 0
    this.variableMouseY = status ? y : 0
    this.movingElement = status
    let target = null
    let elem = null
    this.pages[0][this.selectedElementGroup].forEach((section, idx) => {
      if(!target){
        const child = this.findNestedChild(section.children, this.selectedElement)
        if(child){
          target = child.id
          elem = child
        }
      }
    })
    if(status){
      if(elem && !elem.absolutePosition){
        let siblings = null
        this.pages[0][this.selectedElementGroup].forEach((section, idx) => {
          if(!siblings){
            const elems = this.findNestedSiblings(section.children, this.selectedElement, section)
            if(elems.target){
              siblings = elems
              const { width: tW, height: tH, x: tX, y: tY } = document.querySelector(`[data-uuid="${elems.target.id}"]`).getBoundingClientRect()
              let props = {
                targetElement: elems.target.id,
                targetElementPos: {
                  xMin: tX,
                  xMax: tX + tH,
                  yMin: tY,
                  yMax: tY + tH,
                  height: tH,
                  width: tW
                }
              }
              if(elems.prevSibling){
                const { width, height, x, y } = document.querySelector(`[data-uuid="${elems.prevSibling.id}"]`).getBoundingClientRect()
                props = {
                  ...props,
                  prevSibling: elems.prevSibling.id,
                  prevSiblingPos: {
                    xMin: x,
                    xMax: x + width,
                    yMin: y,
                    yMax: y + height
                  }
                }
              }
              if(elems.nextSibling){
                const { width, height, x, y } = document.querySelector(`[data-uuid="${elems.nextSibling.id}"]`).getBoundingClientRect()
                props = {
                  ...props,
                  nextSibling: elems.nextSibling.id,
                  nextSiblingPos: {
                    xMin: x,
                    xMax: x + width,
                    yMin: y,
                    yMax: y + height
                  }
                }
              }
              const { width: pW, height: pH, x: pX, y: pY } = document.querySelector(`[data-uuid="${elems.parent.id}"]`).getBoundingClientRect()
              if(elems.parent){
                props = {
                  ...props,
                  parentElement: elems.parent.id,
                  parentPos: {
                    xMin: pX,
                    xMax: pX + pW,
                    yMin: pY,
                    yMax: pY + pH
                  }
                }
              }
              console.log(tY - pY)
              elems.target.shiftPosition = {
                xPos: tX - pX,
                yPos: tY - pY
              }
              this.shiftProps = props
            }
          }
        })
        this.shiftingElement = true
      }
    }else{
      if(this.shiftingElement){
        this.shiftElementIfNeeded()
        this.shiftingElement = false
        elem.shiftPosition = null
        this.shiftProps = defaultShiftProps
        this.bottomShiftBox = initShiftBox
        this.topShiftBox = initShiftBox
        return
      }
      if(this.activePage && this.selectedElement && this.selectedParentElement){
        const page = this.pages.find(({ id }) => id === this.activePage)
        const { 
          newSection, 
          newParentElement, 
          newGroup
        } = this.checkIfElementMoved(page, x, y)
        this.moveElementIfNeeded(newSection, newParentElement, newGroup, page, this.selectedElement, x, y)
        this.selectedParentElement = newSection
        this.selectedElementGroup = newGroup
      }
    }
  }

  shiftElementIfNeeded(){
    return
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
    let sectionChild = false
    let posData = {}
    if(!newGroup || !newParentElement || !newSection){
      return
    }
    elems.forEach(area => {
      area.sections.forEach((section, sectionIdx) => {
        if(section.id === elementId){
          removedChild = section
        }
        if(section.id === newSection){
          newSectionIdx = sectionIdx
        }
        section.children.forEach((parentElem, parentIdx) => {
          const child = this.findNestedChild(parentElem.children, elementId)
          if(parentElem.id !== newParentElement){
            if(child){
              const { x: elX, y: elY, width: elW, height: elH } = document.querySelector(`[data-uuid="${child.id}"]`).getBoundingClientRect()
              posData.xOffset = x - elX
              posData.yOffset = y - elY
              const idx = parentElem.children.findIndex(({ id: cid }) => cid === elementId)
              this.elementLen -= 1
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
      let parent
      if(newParentElement && newSection){
        this.selectedParentElement = newSection
        parent = page[newGroup][newSectionIdx].children[newParentIdx]
      }
      if(parent){
        const { id } = parent
        const { x: parentX, y: parentY } = document.querySelector(`[data-uuid="${id}"]`).getBoundingClientRect()
        const newX = x - parentX - posData.xOffset
        const newY = y - parentY - posData.yOffset
        removedChild.position.xPos = newX
        removedChild.position.yPos = newY
        removedChild.style.transform = `translate(${newX}px, ${newY}px)`
        removedChild.id = uuidv4()
        this.unsetSelectedElement()
        if(newParentElement && newSection){
          page[newGroup][newSectionIdx].children[newParentIdx].children.push(removedChild)
        }
        this.setSelectedElement(removedChild.id, id, newGroup)
        setTimeout(() => {
          this.elementLen += 1
        }, 200)
      }
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
          if(section.children.length){
            section.children.forEach(element => {
              const { x: elemX, y: elemY, width: elemW, height: elemH } = document.querySelector(`[data-uuid="${element.id}"]`).getBoundingClientRect()
              if(this.checkIfInside(x, y, elemX, elemY, elemW, elemH)){
                newParentElement = element.id
              }
            })
          }
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
    this.selectedParentElement = null 
    this.selectedElementGroup = null
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

  findNestedSiblings(children, id, parentElement){
    let elems = {}
    if(!children){
      return null
    }
    children.forEach((element, childIdx) => {
      if(!elems.target){
        if(element.id !== id && element.children){
          elems = {...this.findNestedSiblings(element.children, id, element)}
        }
        if(element.id === id){
          const targetIdx = childIdx
          let prevSibling = null
          let prevSiblingIndex = null
          let nextSibling = null
          let nextSiblingIndex = null
          if(childIdx > 0){
            prevSibling = children[childIdx - 1]
            prevSiblingIndex = childIdx - 1
          }
          if(childIdx + 1 <= children.length - 1){
            nextSibling = children[childIdx + 1]
            nextSiblingIndex = childIdx + 1
          }
          elems = {
            target: element,
            targetIdx,
            prevSibling,
            nextSibling,
            nextSiblingIndex,
            prevSiblingIndex,
            parent: parentElement
          }
        }
      }
    })
    return elems
  }

  shiftElement(targetElementId, nextSiblingId){
    const elements = page[this.selectedElementGroup]
    let elems = {}
    console.log('here')
    elements.forEach(element => {
      if(!element.children){
        return
      }
      if(!elems.target){
        elems = {...this.findNestedSiblings(element.children, nextSiblingId, element)}
        if(elems.target){
          if(elems.nextSibling){
            console.log(elems.parent)
          }else{
            //set nextsibling to null and add marginTop to target, increase parent height if needed
          }
        }
      }
    })
  }

  recalculateShiftProps(){
    return
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
        if(this.shiftingElement && target && !target.absolutePosition){
          target.shiftPosition.xPos += dx
          target.shiftPosition.yPos += dy
          const yDiff = (clientY - this.variableMouseY)
          if(yDiff > 0){
            if(this.shiftProps.nextSibling){
              const { yMax, yMin } = this.shiftProps.nextSiblingPos
              if(yMax < clientY){
                //shift the element
                this.shiftElement(target.id, this.shiftProps.nextSibling)
                this.variableMouseY = clientY
                this.variableMouseX = clientX
                this.bottomShiftBox = initShiftBox
              }
              if(yMin < clientY && yMax > clientY){
                //Display a box where the element should go
                this.bottomShiftBox = {
                  display: true,
                  targetElement: this.shiftProps.nextSibling
                }
              }
            }else{
              //Expand the height of the parent element and add marginTop to the target element
            }
          }
          if(yDiff < 0){
            if(this.shiftProps.prevSibling){

            }else{
              //Expand the height of the parent element and add marginBottom to the target element
            }
          }
          this.mouseStartX = clientX
          this.mouseStartY = clientY
        }else{
          this.checkChildComponentDragIndex(offsetX, offsetY)
          target.position.xPos += dx
          target.position.yPos += dy
          this.mouseStartX = clientX
          this.mouseStartY = clientY
          this.updateInsideFrame(target, 'position')
        }
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

  //Id is text ID, parentID is the parent DIV that surrounds the text
  setActiveTextEditor(id, parentId){
    this.activeTextEditor = id
    if(parentId){
      this.activeElementMeta = {
        parentId
      }
    }
  }

  toggleCSSTab(id, area){
    const target = this.findElement(id, area)
    console.log(target)
    if(target){
      const newVal = !target.cssOpen
      this.editingCSS = newVal
      target.cssOpen = newVal
    }
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
      if(this.parentElements.includes(this.activeDrag.type)){
        comp.position.xPos -= editorX
        comp.position.yPos -= editorY
        page[activeArea].splice(this.dragIndex, 0, comp)
        this.setSelectedElement(comp.id, null, activeArea)
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
          let compHeight = 0
          let compWidth = 0
          if(comp.style.width && comp.style.height){
            compHeight = this.convertPixelsToNumber(comp.style.height)
            compWidth = this.convertPixelsToNumber(comp.style.width)
          }else{
            const { clientHeight, clientWidth } = this.getItemSize(comp)
            compHeight = clientHeight
            compWidth = clientWidth
          }
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
            this.setSelectedElement(comp.id, this.currentSectionId, activeArea)
          }, 200)
        }else{
          //If there is not a target div, insert the component with position absolute inside the section element
        }
      }
      this.elementLen += 1
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