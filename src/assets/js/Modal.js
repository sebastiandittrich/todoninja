import Page from '@/assets/js/Page'

export default class Modal extends Page {
    constructor(...args) {
        super(...args)

        this
            .with('modal:modal/frame', 'headline:modal/header', 'actions:modal/actions', 'action:modal/action', 'cancel:modal/cancel-action')
            .watch('state.show', function(to, from, ...args) {
                if(to === true) {
                    this.onShow ? this.onShow(...args) : null
                } else {
                    this.onHide ? this.onHide(...args) : null
                }
            })
            .props({
                state: Object
            })
            .methods({
                hide() {
                    this.$emit('hide')
                }
            })
    }
}