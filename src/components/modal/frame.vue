<template>
    <div>
        <transition :name="isPositioned ? 'popup' : 'modal'" @after-enter="$emit('after-enter', $event)" @before-enter="$emit('before-enter', $event)">
            <div v-show="state.show" class="z-10">
                <div :class="isPositioned ? 'opacity-25' : 'opacity-50'" class="h-full w-full bg-black absolute pin dimmer z-10" @click="$emit('hide')"></div>
                <div ref="content" :class="isPositioned ? 'shadow-lg rounded-lg' : 'rounded-t-lg pin-x pin-b md:shadow-lg md:rounded-lg md:pin-none'" class="z-10 bg-white absolute content modalframe" :style="contentStyle">
                    <slot></slot>
                </div>
            </div>
        </transition>
        <slot name="submodals"></slot>
    </div>
</template> 

<script>
import Page from '@/assets/js/Page'

export default new Page()
    .props({
        state: Object,
        positioned: {
            type: Boolean,
            default: false
        }
    })
    .computed({
        isPositioned() {
            return !!this.positioned && (this.state.position.x != undefined && this.state.position.y != undefined)
        },
        contentStyle() {
            if(this.isPositioned) {
                return this.positionedStyle
            } else {
                return this.defaultStyle
            }
        },
        defaultStyle() {
            return {}
        },
        positionedStyle() {
            const elementdims = { width: 0, height: 0 }
            const element = $(this.$refs.content)
            if(element) {
                elementdims.width = element.actual('width')
                elementdims.height = element.actual('height')
            }
            const maxleft = window.innerWidth - elementdims.width - 5
            const maxtop = window.innerHeight - elementdims.height - 5
            const minleft = 5
            const mintop = 5
            return {
                top: Math.max(Math.min(this.state.position.y, maxtop), mintop) + 'px',
                left: Math.max(Math.min(this.state.position.x - elementdims.width/2, maxleft), minleft) + 'px'
            }
        }
    })
    .vue()
</script>