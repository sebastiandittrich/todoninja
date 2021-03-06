<template>
    <transition name="slide-right" @after-enter="afterEnter">
        <div class="bg-white">

            <!-- Save Button -->
            <div v-show="isCreate || isEdit" @click="save({ explicit: true })" class="rounded-full bg-green-lighter text-green-darker p-2 px-4 flex flex-row items-center justify-center text-base uppercase tracking-wide fixed pin-b pin-r m-8">
                <i class="feather icon-check text-2xl mr-2"></i>
                Save
            </div>

            <!-- Header Part -->
            <div class="bg-blue-lightest p-6 relative">
                <!-- <div class="bg-blue-lightest absolute pin hidden md:block -z-10" style="transform: scaleX(2) translateX(-50%)"></div> -->
                <div class="flex flex-row items-center justify-between mb-6 text-2xl">
                    <!-- Back button -->
                    <i @click="$router.go(-1)" class="feather icon-chevron-left md:hidden"></i>
                    <div class="hidden md:block"></div>

                    <div class="flex flex-row items-center text-sm text-grey-darker cursor-pointer" @click="showModal('workspaces-picker', $event)">
                        <i class="feather icon-home mr-2 text-base"></i>
                        <span class="font-bold">{{ selectedWorkspaceName }}</span>
                        <i class="feather icon-chevron-down ml-2 text-base"></i>
                    </div>
                    <i class="feather icon-menu"></i>
                </div>
                <div class="flex flex-row items-center">
                    <!-- State -->
                    <done-indicator @change="save()" :task="task" class="text-2xl mr-6"></done-indicator>

                    <!-- Title -->
                    <inputt @press-enter="save()" ref="inputt" @input="setEdited" iclass="font-bold text-2xl border-none" v-model="task.title" placeholder="My new task" type="text" class="w-full"></inputt>

                    <!-- Today -->
                    <today-indicator @change="save()" :task="task" class="text-2xl ml-6"></today-indicator>
                </div>
            </div>

            <!-- Middle Part -->
            <div class="m-6">

                <!-- Was today -->

                <!-- State -->
                <state-presenter @change="save()" v-model="task" class="z-10 mb-6"/>
                <div class="font-bold text-sm mb-2">Description</div>
                <textarea @input="setEdited" v-model="task.description" class="-z-10 w-full font-light text-lg focus:shadow-lg rounded-lg transition focus:p-2" rows="2" placeholder="Describe your task!"></textarea>

                <div class="font-bold text-sm mb-2 mt-6">
                    Tags
                </div>

                <!-- Tags -->
                <tags-picker @input="save()" class="-mx-6 px-6 overflow-x-auto" v-model="task.tags"></tags-picker>

            </div>

            <!-- Workspace -->
            <workspaces-picker @input="save()" @hide="hideModal('workspaces-picker')" :state="modalState('workspaces-picker')" v-model="task.workspaceId"></workspaces-picker>
        </div>
    </transition>
</template>  

<script>
import Page from '@/assets/js/Page'
import hasModals from '@/assets/js/traits/hasModals'
import Vue from 'vue'

export default new Page()
    // .directive('autosave', {
    //     inserted(el) {
    //         console.log('inserted')
    //         el.setAttribute('v-on:input', 'log("test")')
    //     }
    // })
    .with('inputt', 'tags/Picker', 'state/Presenter', 'done/Indicator', 'today/Indicator')
    .use( hasModals({ 'workspaces-picker': 'workspaces/Picker' }) )

    .getters({
        getWorkspace: 'workspaces/get'
    })
    .actions({
        getTask: 'tasks/get',
        loadWorkspace: 'workspaces/get'
    })

    .data(() =>({
        mode: null,
        edited: false,
        task: new (Vue.$FeathersVuex.Task)(),
        selectedWorkspaceName: 'No workspace',
    }))
    .methods({
        setEdited() {
            this.edited = true
        },
        async updateWorkspaceName() {
            if(!this.task.workspaceId) {
                this.selectedWorkspaceName = 'No Workspace'
            } else {
                const workspace = this.getWorkspace(this.task.workspaceId) || (await this.loadWorkspace(this.task.workspaceId))
                this.selectedWorkspaceName = workspace.name
            }
        },

        async save({ explicit = false } = {}) {
            // If save is triggered by a change event on a component and 
            // task is in create mode, don't save the task, so the page 
            // will not close unexpected.
            // 
            // If the user explicitly saves the task, 
            // the page will close
            if( !(this.isCreate && !explicit) ) {

                await this.task.save()

                if(this.isCreate) {
                    this.$router.go(-1)
                } else if(this.isEdit) {
                    this.edited = false
                }

            }
        },
        afterEnter() {
            if(this.isCreate) {
                this.$refs.inputt.focus()
            }
        },

        async fetchData() {
            if(!isNaN(this.$route.params.id) && Number.isInteger(parseInt(this.$route.params.id))) {
                this.mode = 'view'
                this.task = (await this.getTask(parseInt(this.$route.params.id)))
            } else {
                this.mode = 'create'
                this.task = new this.$FeathersVuex.Task()
            }
        }
    })
    .computed({
        isView() {
            return this.mode == 'view'
        },
        isCreate() {
            return this.mode == 'create'
        },
        isEdit() {
            return this.isView ? this.edited : false
        }
    })

    .created(vue => {
        vue.fetchData()
    })
    .watch('$route', 'fetchData')
    .watch('task.workspaceId', 'updateWorkspaceName')

    .vue()
</script>