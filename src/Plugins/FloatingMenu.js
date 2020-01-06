import { Plugin, PluginKey } from 'prosemirror-state'

class Menu {

  constructor({ options, editorView }) {
    this.options = {
      ...{
        resizeObserver: true,
        element: null,
        onUpdate: () => false,
      },
      ...options,
    }
    this.editorView = editorView
    this.menuList = []

    this.options.editor.on('focus', ({ view }) => {
      this.update(view)
    })

    // sometimes we have to update the position
    // because of a loaded images for example
    if (this.options.resizeObserver && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.update(this.editorView)
      })
      this.resizeObserver.observe(this.editorView.dom)
    }
  }

  update(view) {
    const { state } = view
    const parent = this.options.element.offsetParent
    this.menuList = []
    if (!parent) {
      return
    }
    const editorBoundings = parent.getBoundingClientRect()
    
    state.doc.nodesBetween(1, state.doc.nodeSize - 2, (node, pos) => {
      const cursorBoundings = view.coordsAtPos(pos)
      const top = cursorBoundings.top - editorBoundings.top
      this.menuList.push({top: top, pos: pos})
      
      return false
    })

    this.sendUpdate()
  }

  sendUpdate() {
    this.options.onUpdate(this.menuList)
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.editorView.dom)
    }
  }

}

export default function (options) {
  return new Plugin({
    key: new PluginKey('floating_menu'),
    view(editorView) {
      return new Menu({ editorView, options })
    },
  })
}
