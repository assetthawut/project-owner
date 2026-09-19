<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useRoute, useRouter } from 'vue-router'

const loading = ref(true)
const task = ref(null)
const subtasks = ref([])

const route = useRoute()
const router = useRouter()
const taskId = route.params.taskId

async function loadTaskAndSubTasks() {

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    const { data: taskData, error } = await supabase.from('tasks').select(` 
        id, 
        name,
        description,
        start_date,
        end_date,
        due_date,
        status_id,
        assignee_id,
        assignee:tasks_assignee_id_fkey1(id,firstname),
        created_by:tasks_created_by_fkey(id, firstname), 
        task_status:task_status(name), 
        project:projects( id, name, total_budget, project_status:project_status(name) ),
    sub_tasks:sub_tasks_task_id_fkey(
      id,
      name,
      description,
      status_id,
      start_date,
      end_date,
      assignee_id
    ),
        created_at, 
        updated_at`
    ).eq('id', taskId).single()
    console.log("taskData", taskData)
    if (!error && taskData) {
        task.value = taskData
        subtasks.value = taskData.sub_tasks || []
    }

    loading.value = false
}

onMounted(loadTaskAndSubTasks)
</script>



<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Task Details</h1>

        <!-- Loading -->
        <div v-if="loading" class="text-gray-500">Loading...</div>

        <!-- Not Found -->
        <div v-else-if="!task" class="text-red-600">Task not found.</div>

        <!-- Task Info -->
        <div v-else class="bg-white p-4 rounded-lg shadow space-y-2">

            <p><strong>Name:</strong> {{ task.name }}</p>
            <p><strong>Description:</strong> {{ task.description || '-' }}</p>
            <p><strong>Status:</strong> {{ task.task_status?.name || '-' }}</p>

            <p><strong>Assignee:</strong>
                {{ task.assignee?.firstname || '—' }} ({{ task.assignee?.email }})
            </p>

            <p><strong>Project:</strong>
                {{ task.project?.name }} (Budget: {{ task.project?.total_budget }})
            </p>

            <p><strong>Start Date:</strong> {{ task.start_date }}</p>
            <p><strong>End Date:</strong> {{ task.end_date }}</p>

            <!-- Edit Buttons -->
            <div class="pt-4 flex gap-2">
                <RouterLink :to="`/app/project/${task.project_id}/task/${task.id}/update`"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    ✏️ Edit Task
                </RouterLink>

                <RouterLink :to="`/app/project/${task.project_id}/task/${task.id}/subtask/create`"
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    ➕ Add Sub-task
                </RouterLink>
            </div>

            <!-- SUBTASK LIST -->
            <div class="mt-6" v-if="subtasks.length">
                <h2 class="text-xl font-semibold mb-2">Sub Tasks</h2>

                <ul class="space-y-2">
                    <li v-for="sub in subtasks" :key="sub.id" class="p-3 bg-gray-50 border rounded hover:bg-gray-100">

                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-medium">{{ sub.name }}</p>
                                <p class="text-sm text-gray-500">{{ sub.description || '-' }}</p>
                                <p class="text-xs text-gray-400">
                                    {{ sub.start_date }} → {{ sub.end_date }}
                                </p>
                            </div>

                            <button class="text-blue-600 underline" @click="viewSubTask(sub.id)">
                                View
                            </button>
                        </div>
                    </li>
                </ul>
            </div>

            <div v-else class="mt-4 text-gray-500">
                No sub-tasks found.
            </div>

        </div>
    </div>
</template>
