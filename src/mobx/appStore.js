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
  pages = [
    {
      route: '/',
      id: uuidv4(),
      header: [
        {
          title: '2 Part Fixed header',
          type: 'header',
          partitions: [1, 2],
          partitionStyles: {
            1: {
              display: 'flex',
              'flex-direction': 'row',
              width: '50%',
              'align-items': 'center',
              'justify-content': 'flex-start'
            },
            2: {
              display: 'flex',
              'flex-direction': 'row',
              width: '50%',
              'align-items': 'center',
              'justify-content': 'flex-end'
            }
          },
          partitionContent: {
            1: [
              {

              }
            ],
            2: [1]
          },
          style: {
            height: '50px',
            padding: '5px 20px',
            display: 'flex',
            'flex-direction': 'row',
            width: `calc(100% - 40px);`,
            position: 'absolute',
            top: 0,
            left: 0,
            background: '#ffffff',
            'border-bottom': '1px solid rgba(0,0,0,0.1)'
          }
        }
      ],
      headerHeight: '100px',
      bodyHeight: '500px',
      footerHeight: '100px',
      components: [],
      footer: [],
      style: {
        background: '#ffffff',
      },
      customCode: ''
    }
  ]

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

  setMouseDown(x, y, type){
    this.mouseStartX = x
    this.mouseStartY = y
    this.toggleActiveMouseEvent(type, true)
  }

  setActiveDragItem(item){
    this.activeDrag = item
  }

  setMouseUp(){
    this.mouseStartX = 0
    this.mouseStartY = 0
    this.toggleActiveMouseEvent(null, false)
  }

}

export default AppStore;