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
  pages = [
    {
      route: '/',
      id: uuidv4(),
      header: [
        {
          id: uuidv4(),
          title: '2 Part Fixed header',
          type: 'header',
          partitions: [1, 2],
          content: {
            1: {
              type: 'section',
              style: {
                display: 'flex',
                'flex-direction': 'row',
                width: '50%',
                'align-items': 'center',
                'justify-content': 'flex-start'
              },
              className: 'col-6',
              children: [
                {
                  type: 'link',
                  className: 'link',
                  style: {
                    color: '#000',
                    'font-size': '15px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    marginRight: '10px'
                  },
                  content: 'Homepage'
                },
                {
                  type: 'link',
                  className: 'link',
                  style: {
                    color: '#000',
                    'font-size': '15px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    marginRight: '10px'
                  },
                  content: 'Pricing'
                },
                {
                  type: 'link',
                  className: 'link',
                  style: {
                    color: '#000',
                    'font-size': '15px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    marginRight: '10px'
                  },
                  content: 'Demo'
                },
                {
                  type: 'link',
                  className: 'link',
                  style: {
                    color: '#000',
                    'font-size': '15px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    marginRight: '10px'
                  },
                  content: 'Contact'
                }
              ]
            },
            2: {
              type: 'section',
              className: 'col-6',
              style: {
                display: 'flex',
                'flex-direction': 'row',
                width: '50%',
                'align-items': 'center',
                'justify-content': 'flex-end'
              },
              children: [
                {
                  type: 'button',
                  className: 'btn',
                  style: {
                    padding: '0.3rem 1rem',
                    margin: '0 5px',
                    'font-size': '16px',
                    background: '#f9f9f9'
                  },
                  content: 'Log in'
                },
                {
                  type: 'button',
                  className: 'btn',
                  style: {
                    padding: '0.3rem 1rem',
                    margin: '0 5px',
                    'font-size': '16px',
                    background: '#ff8ff0'
                  },
                  content: 'Sign up'
                }
              ]
            }
          },
          style: {
            height: '50px',
            padding: '5px 20px',
            display: 'flex',
            'flex-direction': 'row',
            width: `80%`,
            position: 'absolute',
            top: 0,
            left: '10%',
            background: '#ffffff',
            'border-bottom': '1px solid rgba(0,0,0,0.1)'
          }
        }
      ],
      headerHeight: 60,
      bodyHeight: 500,
      footerHeight: 100,
      components: [],
      footer: [],
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

  unsetSelectedElement(){
    this.selectedElement = null
    this.selectedElementGroup = null
  }

  moveElement(clientX, clientY){
    if(this.selectedElementGroup && this.selectedElementGroup){

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
    this.activeDrag.dragPosition.xPos += dx
    this.activeDrag.dragPosition.yPos += dy
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
      copy.dragPosition = {
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