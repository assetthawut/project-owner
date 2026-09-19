<template>
    <div class="max-w-2xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6">
            {{ isEdit ? 'Update Task' : 'Create Task' }}
        </h1>

        <form @submit.prevent="saveTask" class="space-y-4 bg-white p-6 rounded-lg shadow">

            <!-- Task Name -->
            <div>
                <label class="block font-medium mb-1">Task Name</label>
                <input v-model="name" type="text" class="w-full border p-2 rounded" required />
            </div>

            <!-- Upload File -->
            <div>
                <label class="block font-medium mb-1">Attachments</label>
                <input ref="fileInput" type="file" class="w-full border p-2 rounded" multiple />
            </div>
            <!-- Task Files Section -->
            <div class="mt-6 bg-white p-4 rounded-lg shadow">
                <h2 class="text-lg font-semibold mb-3">Attachments</h2>

                <!-- Loading -->
                <div v-if="loadingFiles" class="text-gray-500">Loading files...</div>

                <!-- No files -->
                <div v-else-if="files.length === 0" class="text-gray-500">No files uploaded.</div>

                <!-- File List -->
                <ul v-else class="space-y-2">
                    <li v-for="file in files" :key="file.name"
                        class="flex justify-between items-center border p-2 rounded">
                        <div>{{ file.name }}</div>

                        <div class="space-x-2">
                            <!-- Preview button -->
                            <a @click="previewFile(file.url)" class="text-blue-600 hover:underline">Preview</a>

                            <!-- Download -->
                            <a :href="file.url" target="_blank" class="text-green-600 hover:underline">
                                Download
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- Description -->
            <div>
                <label class="block font-medium mb-1">Description</label>
                <textarea v-model="description" class="w-full border p-2 rounded"></textarea>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block font-medium mb-1">Start Date</label>
                    <input v-model="start_date" type="date" class="w-full border p-2 rounded" />
                </div>

                <div>
                    <label class="block font-medium mb-1">End Date</label>
                    <input v-model="end_date" type="date" class="w-full border p-2 rounded" />
                </div>

                <div>
                    <label class="block font-medium mb-1">Due Date</label>
                    <input v-model="due_date" type="date" class="w-full border p-2 rounded" />
                </div>
            </div>

            <div>
                <label class="block text-gray-700 mb-1">Status</label>

                <select v-model="status_id" class="w-full border border-gray-300 rounded px-3 py-2
           focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option disabled value="">Select status</option>

                    <option :value="1">Not Started</option>
                    <option :value="2">In Progress</option>
                    <option :value="3">Review</option>
                    <option :value="4">Done</option>
                    <option :value="5">Blocked</option>
                    <option :value="5">Cancelled</option>
                </select>
            </div>

            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition w-full">
                {{ isEdit ? 'Update Task' : 'Save Task' }}
            </button>
        </form>
    </div>

    <!-- Preview Modal -->
    <div v-if="previewUrl" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4">
        <div class="bg-white p-4 rounded max-w-4xl w-full relative">

            <button class="absolute top-2 right-2 text-red-600 font-semibold" @click="previewUrl = null">
                Close
            </button>

            <div class="mt-6 text-center">

                <!-- Image -->
                <img v-if="isImage(previewUrl)" :src="previewUrl" class="max-h-[600px] mx-auto rounded" />

                <!-- PDF -->
                <iframe v-else-if="isPDF(previewUrl)" :src="previewUrl" class="w-full h-[600px]"></iframe>

                <!-- Video -->
                <!-- <video v-else-if="isVideo(previewUrl)" :src="previewUrl" controls -->
                <!-- class="max-h-[600px] mx-auto rounded"></video> -->

                <!-- Other file types -->
                <div v-else class="text-gray-600">
                    Preview not available.
                    <a :href="previewUrl" target="_blank" class="text-blue-600 underline ml-1">
                        Download file
                    </a>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

const route = useRoute()
const router = useRouter()

const project_id = route.params.projectId
const task_id = route.params.taskId
const isEdit = computed(() => Boolean(task_id))

const name = ref('')
const status_id = ref('')
const description = ref('')
const start_date = ref('')
const end_date = ref('')
const due_date = ref('')
const fileInput = ref(null)

const files = ref([])
const loadingFiles = ref(true)
const previewUrl = ref(null)

// Load task if editing
onMounted(async () => {
    if (isEdit.value) {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', task_id)
            .single()

        if (error) return console.error(error)

        name.value = data.name
        description.value = data.description
        start_date.value = data.start_date.split('T')[0]
        end_date.value = data.end_date.split('T')[0]
        due_date.value = data.due_date.split('T')[0]
        status_id.value = data.status_id
    }
})

const saveTask = async () => {
    const payload = {
        project_id,
        name: name.value,
        description: description.value,
        start_date: start_date.value || null,
        end_date: end_date.value || null,
        due_date: due_date.value || null,
        status_id: status_id.value
    }

    let error
    let result
    if (isEdit.value) {
        result = await supabase.from('tasks').update(payload).eq('id', task_id).select().single()
    } else {
        result = await supabase.from('tasks').insert(payload).select().single()
    }
    if (error) {
        console.error(error)
        alert('Error saving task')
        return
    }

    const savedTask = result.data
    if (!savedTask) return alert('Error saving task')

    const files = fileInput.value?.files
    if (files && files.length > 0) {
        await uploadFiles(savedTask.id, files)
    }

    router.push(`/app/projects/${project_id}`)
}

async function uploadFiles(taskId, files) {
    console.log("upload.")
    for (const file of files) {
        const filePath = `${taskId}/${Date.now()}-${file.name}`

        const { error: uploadError } = await supabase.storage
            .from('task_files')
            .upload(filePath, file)

        if (uploadError) {
            console.error(uploadError)
            continue
        }

        await supabase.from('task_files').insert({
            task_id: taskId,
            file_path: filePath
        })
    }
}

function isImage(url) {
    console.log(getFileType(url))

    return (getFileType(url) == 'image') ? true : false
}

function isPDF(url) {
    return (getFileType(url) == 'pdf') ? true : false
}

function isVideo(url) {
    return (getFileType(url) == 'video') ? true : false
}


async function getFileUrl(bucketName, path) {
    // Generate signed URL valid for 1 hour
    const { data, error } = await supabase
        .storage
        .from(bucketName)
        .createSignedUrl(path, 60 * 60) // 1 hour

    if (error) {
        console.error('Error creating signed URL:', error)
        return null
    }

    return data.signedUrl
}

function getFileType(url) {
    // Get last part after "/" and before "?"
    const filename = url.split('/').pop().split('?')[0]
    const extension = filename.split('.').pop().toLowerCase()

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image'
    if (['mp4', 'webm', 'mov', 'mkv'].includes(extension)) return 'video'
    if (['pdf'].includes(extension)) return 'pdf'
    return 'other'
}

function previewFile(url) {
    console.log("url", url)
    previewUrl.value = url  // ✅ set reactive value to trigger modal
}

// Load files
async function loadFiles() {
    loadingFiles.value = true

    const { data, error } = await supabase.storage
        .from('task_files')      // CHANGE THIS if your bucket name is different
        .list(task_id + '/', { limit: 100 })

    if (error) {
        console.error(error)
        loadingFiles.value = false
        return
    }

    const filePromises = data.map(async file => {
        const path = `${task_id}/${file.name}`
        const signed = await getFileUrl('task_files', path)
        return {
            name: file.name,
            url: signed,
            type: file.type // optional, store mime type
        }
    })

    // Wait all promises to resolve
    files.value = await Promise.all(filePromises)

    loadingFiles.value = false
}

onMounted(loadFiles)

</script>
