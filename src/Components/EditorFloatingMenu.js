import FloatingMenu from '../Plugins/FloatingMenu'

export default {

  props: {
    editor: {
      default: null,
      type: Object,
    },
  },

  data() {
    return {
      menuList: [{pos:0, top: 0}],
    }
  },

  watch: {
    editor: {
      immediate: true,
      handler(editor) {
        if (editor) {
          this.$nextTick(() => {
            editor.registerPlugin(FloatingMenu({
              editor,
              element: this.$el,
              onUpdate: menuList => {
                this.menuList = menuList
              },
            }))
          })
        }
      },
    },
  },

  render() {
    if (!this.editor) {
      return null
    }

    return this.$scopedSlots.default({
      focused: this.editor.view.focused,
      focus: this.editor.focus,
      commands: this.editor.commands,
      isActive: this.editor.isActive,
      getMarkAttrs: this.editor.getMarkAttrs.bind(this.editor),
      menuList: this.menuList,
    })
  },

  beforeDestroy() {
    this.editor.unregisterPlugin('floating_menu')
  },

}
