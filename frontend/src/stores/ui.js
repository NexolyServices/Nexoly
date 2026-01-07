import { defineStore } from 'pinia'

let nextToastId = 1

export const useUiStore = defineStore('ui', {
  state: () => ({
    confirm: {
      show: false,
      title: '',
      message: '',
      _resolve: null,
      _reject: null
    },
    toasts: []
  }),
  actions: {
    confirmOpen(title, message) {
      return new Promise((resolve, reject) => {
        this.confirm.show = true
        this.confirm.title = title
        this.confirm.message = message
        this.confirm._resolve = resolve
        this.confirm._reject = reject
      })
    },
    confirmResolve(value = true) {
      if (this.confirm._resolve) this.confirm._resolve(value)
      this._resetConfirm()
    },
    confirmCancel() {
      if (this.confirm._reject) this.confirm._reject(false)
      this._resetConfirm()
    },
    _resetConfirm() {
      this.confirm.show = false
      this.confirm.title = ''
      this.confirm.message = ''
      this.confirm._resolve = null
      this.confirm._reject = null
    },
    addToast(type, message, ttl = 4000) {
      const id = nextToastId++
      this.toasts.push({ id, type, message })
      if (ttl > 0) setTimeout(() => this.removeToast(id), ttl)
    },
    addSuccess(message, ttl = 4000) {
      this.addToast('success', message, ttl)
    },
    addError(message, ttl = 6000) {
      this.addToast('error', message, ttl)
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id)
    }
  }
})
