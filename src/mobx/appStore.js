import { makeAutoObservable, configure } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { scripts } from "../config/constants";
import cssParser from 'css'
import { camelCase, replace, trim } from "lodash";
import { camelToDash, getFlexKeys, textStyleKeys } from "../utils";
import bootstrapCSS from '!!raw-loader!../libraries/bootstrap.css';
import { fetchTemplate } from "../services/TemplateService";

configure({
  enforceActions: "never",
})

const initSectionProps = {
  insertBefore: null,
  insertAfter: null,
  sectionId: null
}

const initToolbarTarget = {
  id: null,
  before: false,
  after: false
}

const initToolbarParent = {
  id: null,
  before: false,
  after: false
}

const initDragMeta = {
  before: false,
  after: false
}

const initPageDropTarget = {
  id: null,
}


class AppStore {
  constructor() {
    makeAutoObservable(this)
  }

  mouseStartX = 0
  mouseStartY = 0

  //Drag move timer that will toggle the insert point if the mouse has not been moved
  _dragMoveTimer = null
  dragIndex = 0
  //The boolean value that will be set if the drag index is calculated for the element
  displayInsert = false

  templateId = null

  currentSectionId = null
  elementLen = 0
  activeTextEditor = null

  //Toolbar drag move timer which defines if the element will be inserted before parent or not
  _toolbarMoveTimer = null
  //The element currently being moved in the toolbar
  movingElement = null
  //The toolbar element ID that is currently targeted
  toolbarDropTarget = {
    id: null,
    before: false,
    after: false
  }

  pageDropTarget = { 
    id: null
  }

  activeCSSTab = null

  toolbarDropParent = {
    id: null,
    before: false,
    after: false
  }

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
      contextMenuOpen: false,
      active: true,
      name: `main.css`,
      content: `html {\n  margin: 0;\n  padding: 0;\n  width: 100%;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\n}`,
      //content: ``
      paletteContent: ``,
      scrollPosition: 0
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
      value: '79, 70, 229',
      isEditing: false
    },
    {
      name: 'secondary',
      id: uuidv4(),
      var: '--secondary',
      value: '224, 231, 255',
      isEditing: false
    },
    {
      name: 'third',
      id: uuidv4(),
      var: '--third',
      value: '5, 169, 133',
      isEditing: false
    },
    {
      name: 'light',
      id: uuidv4(),
      var: '--light',
      value: '255, 255, 255',
      isEditing: false
    },
    {
      name: 'gray',
      id: uuidv4(),
      var: '--gray',
      value: '108, 117, 125',
      isEditing: false
    },
    {
      name: 'dark',
      id: uuidv4(),
      var: '--dark',
      value: '52, 58, 64',
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
  staticSelect = null
  saved = true

  //The ID of the component that will be loaded for every page as the last component
  footerId = null
  //The ID of the component that will be loaded for every page as the first component
  headerId = null
  customScripts = []
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
      }
    }
  ]
  templateMetadata = {
    title: 'new template',
    tags: []
  }
  //This is set when the template is first fetched. A public template doesnt get auto-generated preview images, etc
  publicTemplate = false
  
  compiled = false

  getActivePageIndex(){
    const idx = this.pages.findIndex(({ id }) => id === this.activePage)
    return idx === -1 || !idx ? 0 : idx
  }

  addCustomScript(){
    const script = {
      scriptURL: '',
      id: uuidv4()
    }
    this.customScripts.push(script)
  }

  setSaved(status){
    if(this.compiled){
      this.saved = status
    }else{
      this.saved = true
    }
  }

  setTemplateTitle(title) {
    this.templateMetadata = {
      ...this.templateMetadata,
      title
    }
  }

  removeCustomScript(id){
    this.customScripts = this.customScripts.filter(({ id: sid }) => sid !== id)
    this.handleScriptSave(id, false)
  }

  handleScriptChange(id, value){
    const script = this.customScripts.find(({ id: sid }) => sid === id)
    script.scriptURL = value
  }

  handleScriptSave(id, add = true){
    const frame = document.querySelector('iframe')
    if(frame){
      const doc = frame.contentWindow.document
      const elem = doc.querySelector(`[data-uuid="${id}"]`)
      if(add){
        const script = this.customScripts.find(({ id: sid }) => sid === id)
        if(!elem){
          const newElement = doc.createElement('script')
          newElement.src = script.scriptURL
          newElement.crossOrigin
          doc.head.appendChild(newElement)
        }else{
          elem.setAttribute('src', script.scriptURL)
        }
      }else{
        if(elem){
          elem.remove()
        }
      }
      this.setSaved(false)
    }
  }

  setStaticSelect(type){
    this.staticSelect = type
    if(type){
      if(!this.layersOpen){
        this.toggleLayerToolbar()
      }
    }
  }

  /*
  THIS SHOULD HAVE A TOGGLE THINGY IN THE FUCKIN PROJECT SETTINGS MENU

  THE TOGGLE SHOULD BE TRUE/FALSE AND IT WILL DECIDE IF THE ELEMENT WILL BE REMOVED FROM ALL PAGES WHEN UNSETTING
  */
  unsetStaticItem(type){
    const toCopy = type === 'footer' ? this.footerId : this.headerId
    //When unsetting an element the current target should be copied so conflicts wont happen if the element is deleted
    if(toCopy){
      this.pages.forEach(page => {
        if(page.id !== this.activePage){
          const { target, parent } = this.findElementFromParent(toCopy, null, page.elements)
          if(target){
            const copy = this.duplicateChildren(target)
            if(parent){
              const itemIdx = parent.children.findIndex(({ id }) => id === target.id)
              if(itemIdx > -1){
                parent.children.splice(itemIdx, 1, copy)
              }
            }else{
              const itemIdx = page.elements.findIndex(({ id }) => id === target.id)
              if(itemIdx > -1){
                page.elements.splice(itemIdx, 1, copy)
              }
            }
          }
        }
      })
    }
    if(type === 'footer'){
      this.footerId = null
    }else{
      this.headerId = null
    }
  }

  handleStaticSelect(id){
    if(this.staticSelect === 'footer'){
      this.footerId = id
    }else{
      this.headerId = id
    }
    //SHOULD CHECK IF THE ELEMENT EXISTS ON ALL OTHER PAGES, IF IT DOESNT THEN INSERT IT AS EITHER FIRST OR LAST
    this.pages.forEach(page => {
      const { target } = this.findElementFromParent(id, null, page.elements)
      const element = this.findElement(id)
      //IDK IF WE SHOULD DO THIS.DUPLICATECHILDREN - THIS SHOULD BE AN OPTION IN THE PROJECT SETTINGS
      if(!target){
        if(this.staticSelect === 'footer'){
          page.elements.push(element)
        }else{
          page.elements.splice(0, 0, element)
        }
      }
    })
    this.setStaticSelect(null)
  }

  setCSSScrollPosition(id, position){
    const tab = this.cssTabs.find(({ id: tid }) => tid === id)
    tab.scrollPosition = position
  }

  addNewPage(){
    const newPage = {
      route: `/route-${this.pages.length}`,
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
      }
    }
    if(this.headerId){
      const headerElement = this.findElement(this.headerId)
      if(headerElement){
        newPage.elements.push(headerElement)
      }
    }
    if(this.footerId){
      const footerElement = this.findElement(this.footerId)
      if(footerElement){
        newPage.elements.push(footerElement)
      }
    }
    this.pages.push(newPage)
  }

  async fetchTemplate(preload = false){
    try{
      let data = {}
      if(preload){
        const res = await fetchTemplate(preload, true)
        this.createTemplateID()
        data = res.data
        data.template.templateId = this.templateId
      }else{
        const res = await fetchTemplate(this.templateId)
        data = res.data
      }
      const { template: { pages, templateId, cssFiles, palette, framework, templateMeta }, metadata, editorInfo } = data
      this.templateId = templateId
      this.pages = pages
      this.templateMetadata = { ...metadata }
      this.publicTemplate = editorInfo.publicTemplate
      this.cssTabs = cssFiles.map(tab => {
        return {
          ...tab,
          active: true
        }
      })
      this.palette = palette
      if(templateMeta){
        const { headerId, footerId, customScripts } = templateMeta
        this.headerId = headerId
        this.footerId = footerId
        this.customScripts = customScripts
      }
      const { id: frameworkId } = framework
      this.setActiveFramework(frameworkId)
      this.setActivePage(pages[0].id)
      this.setCompiled()
    }catch(err){
      //Template not found or belongs to another user so start with a new empty template
      localStorage.removeItem('templateId')
      this.templateId = null
      this.createTemplateID()
      this.setActivePage(this.pages[0].id)
      this.setActiveFramework('bootstrap')
      this.setIframeHeight()
      this.syncPalette()
      this.setCompiled()
      console.log(err)
    }
  }

  setCompiled(){
    this.compiled = true
  }

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

  getChildIDs(element){
    const ids = [element.id]
    if(element.children && element.children.length){
      element.children.forEach(child => {
        ids.push(...this.getChildIDs(child))
      })
    }
    return ids
  }

  syncStaticElement(children, id, newElement){
    let synced = false
    children.forEach((child, index) => {
      if(child.id === id){
        children[index] = { ...newElement }
        synced = true
      }
      if(!synced && child.children){
        this.syncStaticElement(child.children, id, newElement)
      }
    })
    return synced
  }

  syncStatic(){
    const activePage = this.getActivePage()
    let header = null
    let footer = null
    if(this.headerId){
      header = this.findElement(this.headerId)
    }
    if(this.footerId){
      footer = this.findElement(this.footerId)
    }
    this.pages.forEach(page => {
      if(page.id !== this.activePage){
        if(header){
          this.syncStaticElement(page.elements, this.headerId, header)
        }
        if(footer){
          this.syncStaticElement(page.elements, this.footerId, footer)
        }
      }
    })
  }

  setMovingElement(id, x, y){
    if(!id){
      if(!this.movingElement){
        return
      }
      const { id: targetPageId } = this.pageDropTarget
      const { id: targetId, before } = this.toolbarDropTarget
      const { id: dropParentId, before: parentBefore } = this.toolbarDropParent
      const { allowBeforeParent } = this.movingElement
      //If the element will be inserted into the parent element only
      const pageIdx = this.getActivePageIndex()
      if(dropParentId || targetId){
        const element = this.findElement(this.movingElement.id)
        const parent = this.findElement(dropParentId)
        const copy = this.duplicateChildren(element)
        this.deleteElement(this.movingElement.id, true)
        const frame = document.querySelector('iframe')
        const doc = frame.contentWindow.document
        const parentDomNode = doc.querySelector(`[data-uuid="${parent.id}"]`)
        const domElem = this.compileDomElement(doc, copy, true)
        if(!targetId){
          if(allowBeforeParent){
            const higherParent = this.findParentElementByChildID(this.pages[pageIdx].elements, dropParentId)
            //Insert the element into the elements array on the page itself
            if(!higherParent){
              const parentIndex = this.pages[pageIdx].elements.findIndex(({ id: topParentId }) => topParentId === dropParentId)
              const docBody = doc.querySelector('#PAGE-BODY')
              if(this.toolbarDropParent.before){
                const parentNode = doc.querySelector(`[data-uuid="${dropParentId}"]`)
                docBody.insertBefore(domElem, parentNode)
                this.pages[pageIdx].elements.splice(parentIndex, 0, copy)
              }else{
                const nextParent = this.pages[pageIdx].elements[parentIndex + 1]
                if(nextParent){
                  const nextDomParent = doc.querySelector(`[data-uuid="${nextParent.id}"]`)
                  docBody.insertBefore(domElem, nextDomParent)
                  this.pages[pageIdx].elements.splice(parentIndex + 1, 0, copy)
                }else{
                  docBody.appendChild(domElem)
                  this.pages[pageIdx].elements.push(copy)
                }
              }
            }else{
              const parentIndex = higherParent.children.findIndex(({ id: pid }) => pid === dropParentId)
              const nextParent = higherParent.children[parentIndex + 1]
              const higherParentNode = doc.querySelector(`[data-uuid="${higherParent.id}"]`)
              if(this.toolbarDropParent.before){
                higherParent.children.splice(parentIndex, 0, copy)
                higherParentNode.insertBefore(domElem, parentDomNode)
              }else{
                //Insert before the next parent otherwise push to previous parent
                if(nextParent){
                  const nextDomParent = doc.querySelector(`[data-uuid="${nextParent.id}"]`)
                  higherParentNode.insertBefore(domElem, nextDomParent)
                  higherParent.children.splice(parentIndex + 1, 0, copy)
                }else{
                  higherParent.children.push(copy)
                  higherParentNode.appendChild(domElem)
                }
              }
            }
          }else{
            parentDomNode.appendChild(domElem)
            parent.children.push(copy)
          }
        }
        //If the element will be inserted before or after a target element
        if(targetId){
          const childIdx = parent.children.findIndex(({ id: cid }) => cid === targetId)
          if(before){
            const insertTarget = doc.querySelector(`[data-uuid="${targetId}"]`)
            parentDomNode.insertBefore(domElem, insertTarget)
            parent.children.splice(childIdx, 0, copy)
          }else{
            //Append or push after
            const nextChild = parent.children[childIdx + 1]
            if(nextChild){
              const insertTarget = doc.querySelector(`[data-uuid="${nextChild.id}"]`)
              parentDomNode.insertBefore(domElem, insertTarget)
              parent.children.splice(childIdx + 1, 0, copy)
            }else{
              parentDomNode.appendChild(domElem)
              parent.children.push(copy)
            }
          }
        }
      }
      const isPageTarget = !!targetPageId
      if(targetPageId){
        const page = this.pages.find(({ id }) => id === targetPageId)
        const element = this.findElement(this.movingElement.id)
        this.deleteElement(this.movingElement.id)
        page.elements.splice(0, 0, element)
      }
      this.pageDropTarget = { ...initPageDropTarget }
      this.toolbarDropParent = {...initToolbarParent}
      this.toolbarDropTarget = {...initToolbarTarget}
      this.movingElement = null
      this.syncStatic()
      setTimeout(() => {
        this.handleWindowResize()
        if(isPageTarget){
          //Change the active page - This should be an option in the project settings thingy
        }
      }, 100)
      this.setSaved(false)
    }else{
      const element = this.findElement(id)
      this.movingElement = { id, xPos: x, yPos: y, allowBeforeParent: false }
      this.movingElement.idList = this.getChildIDs(element)
      this.pageDropTarget = { ...initPageDropTarget }
      this.setSaved(false)
    }
    this.mouseStartX = x
    this.mouseStartY = y
  }

  handleToolbarMoveTimer(x, y, rawX, rawY){
    if(!this.movingElement){
      return
    }
    this.movingElement.allowBeforeParent = !this.movingElement.allowBeforeParent
    this.handleElementMove(x, y, rawX, rawY, true)
  }


  handleElementMove(x, y, rawX, rawY, timerCall = false){
    const dx = x - this.mouseStartX
    const dy = y - this.mouseStartY
    this.movingElement.xPos += dx
    this.movingElement.yPos += dy
    this.mouseStartX = x
    this.mouseStartY = y
    const pageIdx = this.getActivePageIndex()
    //Check the cordinates of other elements in the toolbar
    const { idList } = this.movingElement
    const posList = document.elementsFromPoint(rawX, rawY)
    let target = null
    if(timerCall){
      clearTimeout(this._toolbarMoveTimer)
    }
    if(!timerCall){
      if(this._toolbarMoveTimer){
        clearTimeout(this._toolbarMoveTimer)
      }
      this._toolbarMoveTimer = setTimeout(() => {
        this.handleToolbarMoveTimer(x, y, rawX, rawY)
      }, 1500)
    }
    let pageTarget = null
    posList.forEach((item, idx) => {
      if(!target && !pageTarget){
        const attr = item.getAttribute('data-metauuid')
        if(attr){
          target = attr
        }
        if(!target){
          const pageAttr = item.getAttribute('data-pageid')
          if(pageAttr){
            pageTarget = pageAttr
          }
        }
      }
    })
    if(pageTarget){
      this.pageDropTarget.id = pageTarget
    }else{
      this.pageDropTarget = { ...initPageDropTarget }
    }
    if(target){
      if(idList.includes(target)){
        this.toolbarDropParent = { ...initToolbarParent }
        this.toolbarDropTarget = { ...initToolbarTarget }
        return
      }
      const targetElement = this.findElement(target)
      if(targetElement.children){
        this.toolbarDropParent = { ...initToolbarParent, id: target }
        if(!this.movingElement.allowBeforeParent){
          this.toolbarDropParent = { ...initToolbarParent, id: target }
        }else{
          const { y: elemY, height } = document.querySelector(`[data-metauuid="${target}"]`).getBoundingClientRect()
          const before = (elemY + height / 2) > rawY
          this.toolbarDropParent = { ...initToolbarParent, id: target, before }
          this.toolbarDropTarget = {...initToolbarTarget}
        }
      }else{
        const parent = this.findParentElementByChildID(this.pages[pageIdx].elements, target)
        const { y: elemY, height } = document.querySelector(`[data-metauuid="${target}"]`).getBoundingClientRect()
        const before = (elemY + height / 2) > rawY
        this.toolbarDropParent = { ...initToolbarParent, id: parent.id }
        this.toolbarDropTarget = {
          before,
          after: !before,
          id: target
        }
      }
    }else{
      this.toolbarDropParent = { ...initToolbarParent }
      this.toolbarDropTarget = { ...initToolbarTarget }
    }
  }

  syncPalette(){
    const mainTab = this.cssTabs.find(({ name }) => name === 'main.css')
    const paletteStr = this.compilePaletteStr(this.palette)
    mainTab.paletteContent = paletteStr
  }

  addPaletteItem(){
    this.palette.push({
      id: uuidv4(),
      name: `color-${this.palette.length + 1}`,
      var: `--color-${this.palette.length + 1}`,
      value: `255, 255, 255`,
      isCustom: true,
      isEditingName: false,
      isEditing: false
    })
    this.editPaletteProp(null, null, null, true)
  }

  setTemplateID(id){
    localStorage.setItem('templateId', id)
    this.templateId = id
  }

  createTemplateID(){
    this.templateId = uuidv4()
    localStorage.setItem('templateId', this.templateId)
  }

  removePaletteItem(id){
    this.palette = this.palette.filter(({ id: pid }) => pid !== id)
    this.editPaletteProp(null, null, null, true)
  }

  updateIFramePalette(newValue){
    const frame = document.querySelector('iframe')
    if(frame){
      const doc = frame.contentWindow.document
      const paletteTag = doc.querySelector('#PALETTES')
      paletteTag.innerHTML = newValue
    }
  }

  editPaletteProp(id, propName, propValue, changeOnly = false){
    if(!changeOnly){
      const item = this.palette.find(({ id: pid }) => pid === id)
      item[propName] = propValue
    }
    if(this._paletteBounce){
      clearTimeout(this._paletteBounce)
    }
    this._paletteBounce = setTimeout(() => {
      const newString = this.compilePaletteStr(this.palette)
      const mainTab = this.cssTabs.find(({ name }) => name === 'main.css')
      mainTab.paletteContent = newString
      this.updateIFramePalette(newString)
    }, 250)
    this.setSaved(false)
  }

  togglePaletteEditing(id, name = false){
    this.palette.forEach(item => {
      if(item.id !== id){
        item.isEditing = false
        if(name){
          item.isEditingName = false
        }
      }
    })
    const item = this.palette.find(({ id: pid }) => pid === id)
    if(item){
      if(name){
        item.isEditingName = !item.isEditingName
      }else{
        item.isEditing = !item.isEditing
      }
    }
  }

  saveTabContent(tabId, value){
    const tab = this.cssTabs.find(({ id }) => id === tabId)
    tab.content = value
    tab.unsaved = false
    this.cssSaved = !this.cssSaved
    this.handleWindowResize()
    const codeEditor = document.querySelector('.container-code-editor__qxcy .code-editor__textarea__qxcy')
    if(codeEditor){
      codeEditor.setAttribute('maxLength', 25000)
    }
    this.setSaved(false)
  }

  changeActiveTab(tabId){
    this.activeCSSTab = tabId
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
      editingFilename: false,
      contextMenuOpen: false,
      name: `custom_${this.cssTabs.length + 1}.css`,
      content: ``
    }
    this.cssTabs.push(tab)
    this.changeActiveTab(id)
    this.setSaved(false)
  }

  deleteCSSTab(id){
    if(this.cssTabs.length === 1){
      return
    }
    const idx = this.cssTabs.findIndex(({ id: tid }) => tid === id)
    const tab = this.cssTabs[idx]
    if(!tab){
      return
    }
    if(tab && tab.name === 'main.css'){
      return
    }
    const { id: prevId } = this.cssTabs[idx - 1]
    this.changeActiveTab(prevId)
    this.cssTabs = this.cssTabs.filter(({ id: tid }) => tid !== id)
    this.cssSaved = true
    this.setSaved(false)
  }

  setEditingCSSFilename(id){
    if(this.cssTabs.length === 1){
      return
    }
    const idx = this.cssTabs.findIndex(({ id: tid }) => tid === id)
    const tab = this.cssTabs[idx]
    if(!tab || (tab && tab.name === 'main.css')){
      return
    }
    tab.editingFilename = !tab.editingFilename
  }

  editCSSFilename(id, name){
    if(this.cssTabs.length === 1){
      return
    }
    const idx = this.cssTabs.findIndex(({ id: tid }) => tid === id)
    const tab = this.cssTabs[idx]
    if(!tab || (tab && tab.name === 'main.css')){
      return
    }
    let copy = name
    if(!copy.includes('.css')){
      copy += '.css'
    }
    if(!copy.includes('css')){
      copy += 'css'
    }
    tab.name = name
    this.setSaved(false)
  }

  setCSSTabContextMenu(id, status){
    const tab = this.cssTabs.find(({ id: tid }) => tid === id)
    if(typeof(tab.contextMenuOpen) === 'undefined'){
      tab.contextMenuOpen = true
      return
    }
    if(status === null){
      tab.contextMenuOpen = !tab.contextMenuOpen
    }else{
      tab.contextMenuOpen = status
    }
  }

  createTab(type, id, name, content){
    return { 
      type,
      id,
      active: true,
      selected: true,
      unsaved: false,
      contextMenuOpen: false,
      name,
      content
    }
  }

  setActiveFramework(id){
    //This function is run when the template is fetched so we don't want to set unsaved from the get-go
    if(this.activeFramework){
      this.setSaved(false)
    }
    const script = scripts.find(({ id: sid }) => sid === id)
    if(script && script.id === 'bootstrap'){
      script.rawCSS = bootstrapCSS
    }
    if(script){
      this.activeFramework = script
    }else{
      this.activeFramework = null
    }
    const pageIdx = this.getActivePageIndex()
    setTimeout(() => {
      this.recalculateSizes(this.pages[pageIdx].elements)
      this.setIframeHeight()
      this.sizeCalcChange = !this.sizeCalcChange
    }, 1000)
  }

  handleWindowResize(){
    const pageIdx = this.getActivePageIndex()
    this.recalculateSizes(this.pages[pageIdx].elements)
    this.setIframeHeight()
    this.sizeCalcChange = !this.sizeCalcChange
  }

  findElementFromParent(elementId, parentElement, elements){
    let target = null
    let parent = null
    elements.forEach(element => {
      if(!target){
        if(element.id === elementId){
          parent = parentElement
          target = element
        }
        if(!target && element.children){
          const { target: ft, parent: fp } = {...this.findElementFromParent(elementId, element, element.children)}
          if(ft){
            target = ft
            parent = fp
          }
        }
      }
    })
    return { target, parent }
  }

  findElement(id){
    const pageIdx = this.getActivePageIndex()
    const elements = this.pages[pageIdx].elements
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
    const pageIdx = this.getActivePageIndex()
    if(elementType === 'text' || elementType === 'button' || elementType === 'link'){
      const { parentId } = this.activeElementMeta
      const keys = propName.split('|')
      const elements = this.pages[pageIdx].elements
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
      this.updateElementInsideStaticElement(id, propName, propValue)
    }
    setTimeout(() => {
      this.recalculateSizes(this.pages[pageIdx].elements)
      this.setIframeHeight()
      this.sizeCalcChange = !this.sizeCalcChange
    }, 300)
    this.setSaved(false)
  }

  setElementToolbarMenu(id, status = false){
    const element = this.findElement(id)
    element.toolbarOptionsOpen = status
  }

  checkIfElementInsideStaticElement(targetParentId, id){
    let inside = false
    if(!targetParentId){
      return { isSelf: false, inside }
    }
    const isSelf = targetParentId === id
    if(isSelf){
      return { inside: false, isSelf }
    }
    const parent = this.findElement(targetParentId)
    const target = this.findNestedChild(parent.children, id)
    if(target){
      inside = true
      return { isSelf, inside }
    }else{
      return { isSelf, inside }
    }
  }

  updateElementInsideStaticElement(id, propName, propValue){
    let insideH = false
    let isH = false

    let insideF = false
    let isF = false

    if(this.headerId){
      const { inside: insideHeader, isSelf: isHeader } = this.checkIfElementInsideStaticElement(this.headerId, id)
      insideH = insideHeader
      isH = isHeader
    }
    if(!insideH && !isH && this.footerId){
      const { inside: insideFooter, isSelf: isFooter } = this.checkIfElementInsideStaticElement(this.footerId, id)
      insideF = insideFooter
      isF = isFooter
    }
    if(insideH || isH){
      this.pages.forEach(page => {
        if(page.id !== this.activePage){
          const headerElement = this.findNestedChild(page.elements, this.headerId)
          if(isH){
            headerElement[propName] = propValue
          }
          if(insideH){
            const child = this.findNestedChild(headerElement.children, id)
            child[propName] = propValue
          }
        }
      })
    }
    if(insideF || isF){
      this.pages.forEach(page => {
        if(page.id !== this.activePage){
          const footerElement = this.findNestedChild(page.elements, this.footerId)
          if(isF){
            footerElement[propName] = propValue
          }
          if(insideF){
            const child = this.findNestedChild(footerElement.children, id)
            child[propName] = propValue
          }
        }
      })
    }
  }

  updateElementProp(id, propName, propValue){
    const element = this.findElement(id)
    const frame = document.querySelector('iframe')
    if(element && frame){
      const doc = frame.contentWindow.document
      //Remove the old element attributes
      const domElement = doc.querySelector(`[data-uuid="${id}"]`)
      if(propName === 'attributes'){
        if(element.attributes){
          element.attributes.forEach(item => {
            const [key, val] = item.split(':')
            if(!key || !val){
              return
            }
            domElement.removeAttribute(key.trim(), val.trim())
          })
        }
      }
      element[propName] = propValue
      //Custom flow for SVG elements
      if(element.tagName === 'svg'){
        if(propName === 'className'){
          domElement.setAttribute('class', propValue)
        }
        if(propName === 'domID'){
          domElement.setAttribute('id', propValue)
        }
      }else{
        if(propName === 'attributes'){
          //Set the new element attributes
          propValue.forEach(item => {
            const [key, val] = item.split(':')
            if(!key || !val){
              return
            }
            if(key.trim() === 'data-uuid'){
              return
            }
            domElement.setAttribute(key.trim(), val.trim())
          })
        }
        if(propName === 'className'){
          domElement.className = propValue
        }
        if(propName === 'domID'){
          domElement.id = propValue
        }
        if(propName === 'href'){
          element.href = propValue
        }
        if(propName === 'placeholder'){
          element.placeholder = propValue
        }
        if(propName === 'src'){
          domElement.setAttribute('src', propValue)
          setTimeout(() => {
            this.handleWindowResize()
          }, 1000)
        }
      }
      this.updateElementInsideStaticElement(id, propName, propValue)
    }
    setTimeout(() => {
      this.handleWindowResize()
    }, 400)
    this.setSaved(false)
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
    if(!element.hasOwnProperty(propName)){
      element[propName] = status
    }
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
          if(propName === 'innerText'){
            el.firstChild.textContent = propValue
          }else{
            el[propName] = propValue
          }
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

  deletePage(id){
    if(this.pages.length === 1){
      return
    }
    const idx = this.pages.findIndex(({ id: pid }) => pid === id)
    if(idx > -1){
      if(this.activePage === id){
        let toSwitch = null
        if(idx === 0){
          toSwitch = this.pages[idx + 1].id
        }else{
          toSwitch = this.pages[idx - 1].id
        }
        this.unsetSelectedElement()
        this.setActivePage(toSwitch)
      }
      this.pages = this.pages.filter(({ id: pid }) => pid !== id)
      this.setSaved(false)
    }
  }

  setActivePage(id){
    this.unsetSelectedElement()
    if(!id){
      this.activePage = this.pages[0].id
    }else{
      this.activePage = id
    }
    setTimeout(() => {
      this.handleWindowResize()
    }, 1000)
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
    const pageIdx = this.getActivePageIndex()
    const elements = this.pages[pageIdx].elements
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
        if((clientY > yMidBound && clientY < yBottomBound) || ((elements.length - 1 === idx) && (y + height) < clientY)){
          this.dragIndex = idx + 1
        }
      }
    })
    this.displayInsert = true
    if(elements.length === 0){
      this.dragIndex = 0
      return
    }
  }

  changeElementInsertType(clientX, clientY, rawX, rawY){
    if(!this.activeDrag){
      return
    }
    this.activeDrag.insertAsParent = !this.activeDrag.insertAsParent
    this.handleItemDragMove(clientX, clientY, rawX, rawY, true)
  }

  handleItemDragMove(clientX, clientY, rawX, rawY, timerCall = false){
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
    if(timerCall){
      clearTimeout(this._dragMoveTimer)
    }
    if(!timerCall){
      if(this._dragMoveTimer){
        clearTimeout(this._dragMoveTimer)
      }
      this._dragMoveTimer = setTimeout(() => {
        this.changeElementInsertType(clientX, clientY, rawX, rawY)
      }, 1250)
    }
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
      if(target && !this.activeDrag.insertAsParent){
        const pageIdx = this.getActivePageIndex()
        const isMainParent = this.pages[pageIdx].elements.find(({ id }) => id === target)
        const targetElement = this.findElement(target)
        const { tagName } = this.activeDrag
        if(targetElement.tagName === 'div'){
          if(!targetElement.children){
            targetElement.children = []
          }
          const insertable = tagName === 'div' || tagName === 'section' || tagName === 'form'
          if(this.activeDrag.parent && this.activeDrag.children && !this.activeDrag.children.length && !insertable){
            delete this.activeDrag.children
            this.activeDrag.parent = false
          }
        }else{
          if(!isMainParent){
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
          }
          const insertable = targetElement.tagName === 'div' || targetElement.tagName === 'section' || tagName === 'form'
          if(insertable && !targetElement.children){
            targetElement.children = []
          }
          /*else{
            this.activeDrag.parent = false
            if(this.activeDrag.children && !this.activeDrag.children.length){
              delete this.activeDrag.children
            }
          }*/
        }
        this.displayInsert = false
        this.dragIndex = 0
      }else{
        this.activeDrag.parent = true
        this.checkDragIndex(rawX, rawY)
        if(!this.activeDrag.children){
          this.activeDrag.children = []
        }
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
    this.dragTarget = null
    this.displayInsert = false
    this.dragIndex = 0
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
      const pageIdx = this.getActivePageIndex()
      this.recalculateSizes(this.pages[pageIdx].elements)
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
      const pageIdx = this.getActivePageIndex()
      this.recalculateSizes(this.pages[pageIdx].elements)
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
      this.setSaved(false)
    }catch(err){
      const pageIdx = this.getActivePageIndex()
      this.recalculateSizes(this.pages[pageIdx].elements)
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
        const pageIdx = this.getActivePageIndex()
        element = this.findParentElementByChildID(this.pages[pageIdx].elements, id)
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
    try{
      const parser = new DOMParser().parseFromString(comp.content, 'application/xml')
      const svg = parser.firstElementChild
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
      return parser.firstElementChild
    }catch(err){
      console.log(err)
    }
  }

  compileDomElement(doc, comp, addStyles = false){
    let domElement = doc.createElement(comp.tagName)
    if(comp.tagName === 'svg'){
      domElement = this.compileSVG(doc, comp)
      return domElement
    }
    if(comp.src){
      domElement.src = comp.src
    }
    if(comp.content){
      if(comp.tagName === 'li'){
        if(comp.children && comp.children.length){
          domElement.textContent = ''
        }else{
          domElement.textContent = comp.content
        }
      }else{
        domElement.textContent = comp.content
      }
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
        const pageIdx = this.getActivePageIndex()
        this.pages[pageIdx].elementsHeight = frameHeight
        this.frameWidth = frame.contentWindow.innerWidth
      }
    }catch(err){
      console.log(err)
      return
    }
  }

  assignStyles(comp, CSSValues){
    comp.childrenOpen = true
    comp.attributes = []
    if(comp.tagName === 'img'){
      comp.editingSrc = false
    }
    if(!comp.style){
      comp.style = {}
    }
    if(comp.type === 'input'){
      comp.editingPlaceholder = false
    }
    if(comp.type === 'link'){
      comp.editingHref = false
      comp.href = '#'
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
    /*
    if(classNames.length > 1){
      classNames.forEach(singleClass => {
        if(CSSValues.includes(singleClass)){
          classExists = true
        }
      })
    }
    */
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
      style: {},
      id: uuidv4()
    }
    const styleKeys = Object.keys(element.style)
    const styleCopy = {}
    if(styleKeys.length){
      styleKeys.forEach(key => {
        styleCopy[key] = element.style[key]
      })
      copy.style = styleCopy
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

  duplicateInsideStaticElement(staticParentId, parentId, elementId, newElement){
    const { isSelf, inside } = this.checkIfElementInsideStaticElement(staticParentId, elementId)
    if(isSelf){
      return
    }
    if(inside){
      this.pages.forEach(page => {
        if(page.id !== this.activePage){
          const targetParent = this.findNestedChild(page.elements, parentId)
          if(isSelf){
            const idx = page.elements.findIndex(({ id }) => id === targetParent.id)
            page.elements.splice(idx + 1, 0, newElement)
          }else{
            const idx = targetParent.children.findIndex(({ id }) => id === elementId)
            targetParent.children.splice(idx + 1, 0, newElement)
          }
        }
      })
    }
  }

  duplicateElement(id){
    const pageIdx = this.getActivePageIndex()
    const elements = this.pages[pageIdx].elements
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
      if(this.headerId){
        this.duplicateInsideStaticElement(this.headerId, parent.id, id, element)
      }
      if(this.footerId){
        this.duplicateInsideStaticElement(this.footerId, parent.id, id, element)
      }
      const domElement = this.compileDomElement(doc, element, true)
      if(pushToParent){
        //Insert into iframe
        if(isParent){
          doc.querySelector('#PAGE-BODY').appendChild(domElement)
          this.pages[pageIdx].elements.push(element)
        }else{
          const domParent = doc.querySelector(`[data-uuid="${parent.id}"]`)
          domParent.appendChild(domElement)
          parent.children.push(element)
        }
      }else{
        if(isParent){
          const nextSibling = this.pages[pageIdx].elements[nextSiblingIndex]
          const nextChild = doc.querySelector(`[data-uuid="${nextSibling.id}"]`)
          doc.querySelector('#PAGE-BODY').insertBefore(domElement, nextChild)
          this.pages[pageIdx].elements.splice(nextSiblingIndex, 0, element)
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
        const pageIdx = this.getActivePageIndex()
        this.recalculateSizes(this.pages[pageIdx].elements)
      }, 100)
    }, 500)
    this.setSaved(false)
  }

  deleteInsideStaticElement(staticParentId, parentId, elementId){
    const { inside } = this.checkIfElementInsideStaticElement(staticParentId, elementId)
    if(inside){
      this.pages.forEach(page => {
        if(page.id !== this.activePage){
          const parent = this.findNestedChild(page.elements, parentId)
          if(parent){
            const idx = parent.children.findIndex(({ id: eid }) => eid === elementId)
            if(idx > -1){
              parent.children.splice(idx, 1)
            }
          }
        }
      })
    }
  }

  deleteElement(id, ignoreStatic = false){
    const pageIdx = this.getActivePageIndex()
    const elements = this.pages[pageIdx].elements
    let parent = null
    let isParent = false
    if(this.footerId === id){
      this.unsetStaticItem('footer')
    }
    if(this.headerId === id){
      this.unsetStaticItem('header')
    }
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
      if(!ignoreStatic){
        if(this.footerId){
          this.deleteInsideStaticElement(this.footerId, parent.id, id)
        }
        if(this.headerId){
          this.deleteInsideStaticElement(this.headerId, parent.id, id)
        }
      }
      if(this.selectedElement === id){
        this.selectedElement = isParent ? null : parent.id
      }
      if(this.cssElement && this.cssElement === id){
        this.toggleCSSTab(id)
      }
      if(isParent){
        const idx = this.pages[pageIdx].elements.findIndex(({ id: eid }) => eid === parent.id)
        this.pages[pageIdx].elements.splice(idx, 1)
      }else{
        const childIdx = parent.children.findIndex(({ id: eid }) => eid === id)
        parent.children.splice(childIdx, 1)
      }
      //Remove the element from the IFRAME dom
      const frame = document.querySelector('iframe')
      if(frame){
        const doc = frame.contentDocument
        const el = doc.querySelector(`[data-uuid="${id}"]`)
        if(el){
          el.remove()
        }
      }
    }
    this.handleWindowResize()
    this.setSaved(false)
  }

  //In this context the inside static element means that the new element is being inserted directly into the static parent element
  insertIntoStaticElement(staticParentId, targetParentId, newElement, insertIndex){
    const { inside } = this.checkIfElementInsideStaticElement(staticParentId, targetParentId)
    const isSelf = staticParentId === targetParentId
    if(!isSelf && !inside){
      return
    }
    this.pages.forEach((page, pageIdx) => {
      if(page.id !== this.activePage){
        const parentElement = this.findNestedChild(page.elements, targetParentId)
        if(isSelf){
          const staticParentIndex = page.elements.findIndex(({ id }) => id === staticParentId)
          //Insertindex -1 means that the element should be pushed to the target parent elements array
          if(insertIndex === -1){
            parentElement.children.push(newElement)
          }else{
            parentElement.children.splice(insertIndex, 0, newElement)
          }
        }
        if(!isSelf && inside && parentElement){
          //SOME WEIRD ASS SHIT HAPPENS WITH MOBX OBSERVABLES WHEN INSERTING INTO PARENT SO DO A STUPID CHECK HEERE
          const existing = parentElement.children.find(({ id: newElemenetId }) => newElemenetId === newElement.id)
          if(existing){
            return
          }
          if(!parentElement.children){
            parentElement.children = []
          }
          if(insertIndex === -1){
            parentElement.children.push(newElement)
          }else{
            parentElement.children.splice(insertIndex, 0, newElement)
          }
        }
      }
    })
  }

  insertComponent(e){
    try{
      if(this.activeDrag){
        const pageIdx = this.getActivePageIndex()
        const { clientX, clientY } = e
        const activeArea = this.pages[pageIdx].elements
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
        let insertIndex = -1
        //If the parent element is a section
        if((this.parentElements.includes(this.activeDrag.type) && !targetParent) || this.activeDrag.insertAsParent){
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
              insertIndex = idx
              targetParent.children.splice(idx, 0, comp)
              this.insertElementIntoIframe(comp, targetParent, insertBeforeID)
            }
            if(!insertBeforeID && pushToParentElem){
              this.insertElementIntoIframe(comp, targetParent, null, true)
              targetParent.children.push(comp)
            }
            if(!pushToParentElem && insertAsFirst){
              insertIndex = 0
              targetParent.children.splice(-1, 0, comp)
              this.insertElementIntoIframe(comp, targetParent, null, false, true)
            }
            this.elementLen += 1
            this.setSelectedElement(comp.id, null)
          }else{
            this.insertElementIntoIframe(comp, null, null, null, null, true)
            this.pages[pageIdx].elements.push(comp)
            this.elementLen += 1
            this.setSelectedElement(comp.id, null)
          }
        }
        if(targetParent){
          if(this.footerId){
            this.insertIntoStaticElement(this.footerId, targetParent.id, comp, insertIndex)
          }
          if(this.headerId){
            this.insertIntoStaticElement(this.headerId, targetParent.id, comp, insertIndex) 
          }
        }
        setTimeout(() => {
          this.setIframeHeight()
          this.sizeCalcChange = !this.sizeCalcChange
          this.recalculateSizes(this.pages[pageIdx].elements)
        }, 400)
        this.setSaved(false)
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