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