<template>
    <div class="p-6">
        <div class="grid grid-cols-3 gap-4">
            <div class="...">
                <h1 class="text-2xl font-bold mb-6">Project Details</h1>
            </div>
            <div class="..."></div>
            <div class="text-right">
                <button class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded
         transition duration-200 ease-in-out
         focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2" @click="deleteProject(project.id)">
                    Delete
                </button>

            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-gray-500">Loading project...</div>

        <!-- Not Found -->
        <div v-else-if="!project" class="text-red-600">Project not found.</div>

        <!-- Main Content -->
        <div v-else>
            <!-- Tabs -->
            <div class="text-sm font-medium text-center text-body border-b border-default mb-4">
                <ul class="flex flex-wrap -mb-px justify-center">
                    <li class="me-2" v-for="tab in tabs" :key="tab.id">
                        <button @click="activeTab = tab.id" :class="[
                            'inline-block p-4 border-b border-transparent rounded-t-base transition',
                            activeTab === tab.id
                                ? 'text-fg-brand border-brand'
                                : 'hover:text-fg-brand hover:border-brand'
                        ]">
                            {{ tab.label }}
                        </button>
                    </li>
                </ul>
            </div>

            <!-- Tab Contents -->
            <div class="space-y-6">

<!-- Project Info Tab -->
<div v-show="activeTab === 'info'" class="space-y-4">

  <!-- HERO: PROFIT -->
  <div
    class="p-6 rounded-xl shadow border text-center"
    :class="{
      'bg-green-50 border-green-200': project.profit > 0,
      'bg-red-50 border-red-200': project.profit < 0,
      'bg-gray-50 border-gray-200': project.profit === 0
    }"
  >
    <p class="text-sm text-gray-500 mb-1">Current Profit</p>
    <p
      class="text-3xl font-bold"
      :class="{
        'text-green-600': project.profit > 0,
        'text-red-600': project.profit < 0,
        'text-gray-700': project.profit === 0
      }"
    >
      {{ project.profit ?? 0 }}
    </p>

    <p
      v-if="project.profit < 0"
      class="mt-2 text-sm text-red-600 font-medium"
    >
      ⚠️ This project is losing money — fix expenses or increase revenue
    </p>

    <p
      v-else-if="project.profit > 0"
      class="mt-2 text-sm text-green-600 font-medium"
    >
      ✅ Profitable — keep momentum
    </p>
  </div>

  <!-- FINANCIAL BREAKDOWN -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div class="bg-white p-4 rounded-lg shadow border">
      <p class="text-xs text-gray-500 mb-1">Revenue</p>
      <p class="text-xl font-semibold text-green-600">
        {{ project.total_revenue ?? 0 }}
      </p>
    </div>

    <div class="bg-white p-4 rounded-lg shadow border">
      <p class="text-xs text-gray-500 mb-1">Expense</p>
      <p class="text-xl font-semibold text-red-600">
        {{ project.total_expense ?? 0 }}
      </p>
    </div>

    <div class="bg-white p-4 rounded-lg shadow border">
      <p class="text-xs text-gray-500 mb-1">Estimated Value</p>
      <p
        class="text-xl font-semibold"
        :class="project.estimated_value > project.total_expense
          ? 'text-green-600'
          : 'text-yellow-600'"
      >
        {{ project.estimated_value ?? '-' }}
      </p>
    </div>
  </div>

  <!-- PROJECT DETAILS -->
  <div class="bg-white p-4 rounded-lg shadow border space-y-2">
    <p><strong>ID:</strong> {{ project.id }}</p>
    <p><strong>Name:</strong> {{ project.name }}</p>
    <p>
      <strong>Status:</strong>
      <span class="px-2 py-0.5 rounded-full text-xs bg-gray-100">
        {{ project.status_name }}
      </span>
    </p>
    <p><strong>Description:</strong> {{ project.description || '-' }}</p>
    <p><strong>Budget:</strong> {{ project.budget ?? '-' }}</p>
  </div>

  <!-- DATES -->
  <div class="bg-white p-4 rounded-lg shadow border grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
    <div>
      <p class="text-gray-500">Start</p>
      <p>{{ project.start_date?.split('T')[0] ?? '-' }}</p>
    </div>
    <div>
      <p class="text-gray-500">End</p>
      <p>{{ project.end_date?.split('T')[0] ?? '-' }}</p>
    </div>
    <div>
      <p class="text-gray-500">Due</p>
      <p>{{ project.due_date?.split('T')[0] ?? '-' }}</p>
    </div>
  </div>

  <!-- ACTIONS -->
  <div class="flex gap-2 pt-2">
    <RouterLink
      :to="`/app/project/${project.id}/update`"
      class="px-5 py-2 rounded-lg font-medium transition"
      :class="project.profit < 0
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-blue-600 hover:bg-blue-700 text-white'"
    >
      {{ project.profit < 0 ? '🔥 Fix Project' : '✏️ Edit Project' }}
    </RouterLink>
  </div>

</div>


                <!-- Tasks Tab -->
                <div v-show="activeTab === 'tasks'">
                    <RouterLink :to="`/app/project/${project.id}/task/create`"
                        class="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
                        ➕ Create Task
                    </RouterLink>

                    <div v-if="tasks.length" class="overflow-x-auto">
                        <table class="min-w-full border rounded">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-4 py-2 border">#</th>
                                    <th class="px-4 py-2 border">Name</th>
                                    <th class="px-4 py-2 border">Description</th>
                                    <th class="px-4 py-2 border">Start</th>
                                    <th class="px-4 py-2 border">End</th>
                                    <th class="px-4 py-2 border">Due</th>
                                    <th class="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(task, index) in sortedTasks" :key="task.id" class="hover:bg-gray-50">
                                    <td class="px-4 py-2 border">{{ index + 1 }}</td>
                                    <td class="px-4 py-2 border">{{ task.name }}</td>
                                    <td class="px-4 py-2 border">{{ task.description || '-' }}</td>
                                    <td class="px-4 py-2 border">{{ task.start_date ?? '-' }}</td>
                                    <td class="px-4 py-2 border">{{ task.end_date ?? '-' }}</td>
                                    <td class="px-4 py-2 border">{{ task.due_date ?? '-' }}</td>
                                    <td class="px-4 py-2 border flex gap-2">
                                        <button @click="viewTask(task.id)"
                                            class="bg-blue-500 text-white px-3 py-1 rounded">📂</button>
                                        <button @click="editTask(task.id)"
                                            class="bg-yellow-500 text-white px-3 py-1 rounded">✏️</button>
                                        <button @click="deleteTask(task.id)"
                                            class="bg-red-500 text-white px-3 py-1 rounded">🗑️</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="mt-4 text-gray-500">No tasks found.</div>
                </div>

                <!-- ⭐ BUDGET TAB -->
                <!-- <div v-show="activeTab === 'budgets'" class="bg-white p-4 rounded-lg shadow"> -->

                <!-- Add New Budget -->


                <!-- Budgets Table -->
                <!-- BUDGET TAB -->
                <div v-show="activeTab === 'budgets'" class="bg-white p-4 rounded-lg shadow">

                    <!-- Add New Budget -->
                    <div class="mb-4 p-4 bg-gray-50 border rounded">
                        <h2 class="font-bold mb-2">➕ Add Budget</h2>

                        <div class="flex gap-2 items-center">
                            <input v-model="newBudget.name" class="border px-3 py-2 rounded w-1/4" placeholder="Name" />

                            <input v-model.number="newBudget.amount_budgeted" class="border px-3 py-2 rounded w-1/4"
                                type="number" placeholder="Amount" />

                            <select v-model="newBudget.expense_category_id" class="border px-3 py-2 rounded w-1/4">
                                <option disabled value="">Select Category</option>
                                <option v-for="c in expenseCategories" :key="c.id" :value="c.id">
                                    {{ c.name }}
                                </option>
                            </select>

                            <button @click="addBudget" class="bg-green-600 text-white px-4 py-2 rounded">
                                Add
                            </button>
                        </div>
                    </div>

                    <!-- Budgets Table -->
                    <div v-if="budgets.length" class="overflow-x-auto">
                        <table class="min-w-full border rounded">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-4 py-2 border">#</th>
                                    <th class="px-4 py-2 border">Name</th>
                                    <th class="px-4 py-2 border">Category</th>
                                    <th class="px-4 py-2 border">Amount</th>
                                    <th class="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(b, index) in budgets" :key="b.id">
                                    <td class="px-4 py-2 border">{{ index + 1 }}</td>

                                    <td class="px-4 py-2 border">
                                        <input v-model="b.name" class="border px-2 py-1 rounded w-full" />
                                    </td>

                                    <td class="px-4 py-2 border">
                                        <select v-model="b.expense_category_id" class="border px-2 py-1 rounded w-full">
                                            <option disabled value="">Select Category</option>
                                            <option v-for="c in expenseCategories" :key="c.id" :value="c.id">{{ c.name
                                            }}</option>
                                        </select>
                                    </td>

                                    <td class="px-4 py-2 border">
                                        <input type="number" v-model.number="b.amount_budgeted"
                                            class="border px-2 py-1 rounded w-full" />
                                    </td>

                                    <td class="px-4 py-2 border flex gap-2">
                                        <button @click="updateBudget(b)"
                                            class="bg-blue-500 text-white px-3 py-1 rounded">💾 Save</button>

                                        <button @click="deleteBudget(b.id)"
                                            class="bg-red-500 text-white px-3 py-1 rounded">🗑️</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="mt-4 font-bold text-lg">Total: {{ totalBudget }}</div>

                        <!-- Summary per category -->
                        <div class="mt-4 font-medium">
                            <h3 class="font-bold mb-2">Summary by Category</h3>
                            <ul>
                                <li v-for="(sum, catId) in summaryByCategory" :key="catId">
                                    {{ getCategoryName(catId) }}: {{ sum }}
                                </li>
                            </ul>
                        </div>

                    </div>

                    <div v-else class="text-gray-500">No budgets yet.</div>
                </div>



                <!-- </div> -->

                <!-- Expenses -->
                <div v-show="activeTab === 'expenses'">
                    <div>
                        <h2 class="text-xl font-bold mb-4">Project Expenses</h2>

                        <!-- Add Expense Form -->
                        <div class="mb-4 bg-white p-4 rounded shadow space-y-2">
                            <h3 class="font-semibold">Add / Update Expense</h3>
                            <div class="flex gap-2 items-center">
                                <input v-model="form.name" type="text" placeholder="Expense Name"
                                    class="border p-2 rounded flex-1" />
                                <select v-model="form.expense_type_id" class="border p-2 rounded">
                                    <option value="">Select Type</option>
                                    <option v-for="cat in expenseTypes" :key="cat.id" :value="cat.id">
                                        {{ cat.name }}
                                    </option>
                                </select>

                                <select v-model="form.expense_category_id" class="border p-2 rounded">
                                    <option value="">Select Category</option>
                                    <option v-for="cat in expenseCategories" :key="cat.id" :value="cat.id">
                                        {{ cat.name }}
                                    </option>
                                </select>
                                <input v-model.number="form.amount_spent" type="number" placeholder="Amount"
                                    class="border p-2 rounded w-32" />
                                <button @click="saveExpense"
                                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                                    {{ form.id ? 'Update' : 'Add' }}
                                </button>
                                <button v-if="form.id" @click="resetForm"
                                    class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <!-- Expenses Table -->
                        <div v-if="expenses.length" class="overflow-x-auto">
                            <table class="min-w-full border rounded">
                                <thead class="bg-gray-100">
                                    <tr>
                                        <th class="px-4 py-2 border">#</th>
                                        <th class="px-4 py-2 border">Name</th>
                                        <th class="px-4 py-2 border">Category</th>
                                        <th class="px-4 py-2 border">Amount Spent</th>
                                        <th class="px-4 py-2 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(expense, index) in expenses" :key="expense.id" class="hover:bg-gray-50">
                                        <td class="px-4 py-2 border">{{ index + 1 }}</td>

                                        <!-- Editable fields -->
                                        <td class="px-4 py-2 border">
                                            <input v-if="editId === expense.id" v-model="editForm.name" type="text"
                                                class="border p-1 rounded w-full" />
                                            <span v-else>{{ expense.name }}</span>
                                        </td>

                                        <td class="px-4 py-2 border">
                                            <select v-if="editId === expense.id" v-model="editForm.expense_category_id"
                                                class="border p-1 rounded w-full">
                                                <option value="">Select Category</option>
                                                <option v-for="cat in expenseCategories" :key="cat.id" :value="cat.id">
                                                    {{ cat.name }}</option>
                                            </select>
                                            <span v-else>{{ getCategoryName(expense.expense_category_id) }}</span>
                                        </td>

                                        <td class="px-4 py-2 border">
                                            <input v-if="editId === expense.id" v-model.number="editForm.amount_spent"
                                                type="number" class="border p-1 rounded w-full" />
                                            <span v-else>{{ expense.amount_spent }}</span>
                                        </td>

                                        <!-- Actions -->
                                        <td class="px-4 py-2 border flex gap-2">
                                            <button v-if="editId === expense.id" @click="saveEdit(expense.id)"
                                                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                                                💾 Save
                                            </button>
                                            <button v-if="editId === expense.id" @click="cancelEdit"
                                                class="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded">
                                                ❌ Cancel
                                            </button>
                                            <button v-else @click="startEdit(expense)"
                                                class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                                                ✏️ Edit
                                            </button>
                                            <button v-if="editId !== expense.id" @click="deleteExpense(expense.id)"
                                                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="text-gray-500 mt-2">No expenses added yet.</div>

                        <!-- Summary -->
                        <div class="mt-4 bg-gray-50 p-4 rounded shadow">
                            <h3 class="font-semibold mb-2">Summary by Category</h3>
                            <ul>
                                <li v-for="(total, category) in summary" :key="category">
                                    {{ category }}: {{ total }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Activity Logs -->
                <div v-show="activeTab === 'activities'">
                    <h2 class="text-xl font-bold mb-4">Project Activity Logs</h2>

                    <!-- Add / Edit Form -->
                    <div class="mb-4 bg-white p-4 rounded shadow space-y-2">
                        <h3 class="font-semibold">{{ editActivityId ? 'Update Activity' : 'Add Activity' }}</h3>
                        <div class="flex flex-wrap gap-2 items-center">
                            <input v-model="activityForm.name" type="text" placeholder="Activity Name"
                                class="border p-2 rounded flex-1" />
                            <input v-model="activityForm.description" type="text" placeholder="Description"
                                class="border p-2 rounded flex-1" />
                            <input v-model="activityForm.start_date" type="datetime-local" class="border p-2 rounded" />
                            <input v-model="activityForm.end_date" type="datetime-local" class="border p-2 rounded" />
                            <input v-model.number="activityForm.timespent" type="number" placeholder="Time Spent (min)"
                                class="border p-2 rounded w-32" />

                            <button @click="saveActivity"
                                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                                {{ editActivityId ? 'Update' : 'Add' }}
                            </button>
                            <button v-if="editActivityId" @click="resetActivityForm"
                                class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>

                    <!-- Activity Logs Table -->

                    <div v-if="activities.length" class="overflow-x-auto">
                        <table class="min-w-full border rounded">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-4 py-2 border">#</th>
                                    <th class="px-4 py-2 border">Name</th>
                                    <th class="px-4 py-2 border">Description</th>
                                    <th class="px-4 py-2 border">Start Date</th>
                                    <th class="px-4 py-2 border">End Date</th>
                                    <th class="px-4 py-2 border">Time Spent</th>
                                    <th class="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(act, index) in activities" :key="act.id" class="hover:bg-gray-50">
                                    <td class="px-4 py-2 border">{{ index + 1 }}</td>
                                    <!-- Name -->
                                    <td class="px-4 py-2 border">
                                        <input v-if="editId === act.id" v-model="editRow.name"
                                            class="border p-1 rounded w-full" />
                                        <span v-else>{{ act.name }}</span>
                                    </td>

                                    <!-- Description -->
                                    <td class="px-4 py-2 border">
                                        <input v-if="editId === act.id" v-model="editRow.description"
                                            class="border p-1 rounded w-full" />
                                        <span v-else>{{ act.description }}</span>
                                    </td>

                                    <!-- Start Date -->
                                    <td class="px-4 py-2 border">
                                        <input v-if="editId === act.id" type="datetime-local"
                                            v-model="editRow.start_date" class="border p-1 rounded w-full" />
                                        <span v-else>{{ act.start_date ?? '-' }}</span>
                                    </td>

                                    <!-- End Date -->
                                    <td class="px-4 py-2 border">
                                        <input v-if="editId === act.id" type="datetime-local" v-model="editRow.end_date"
                                            class="border p-1 rounded w-full" />
                                        <span v-else>{{ act.end_date ?? '-' }}</span>
                                    </td>

                                    <!-- Time Spent -->
                                    <td class="px-4 py-2 border">
                                        <input v-if="editId === act.id" type="number" v-model.number="editRow.timespent"
                                            class="border p-1 rounded w-20" />
                                        <span v-else>{{ act.timespent ?? '-' }}</span>
                                    </td>

                                    <!-- Actions -->
                                    <td class="px-4 py-2 border flex gap-2">
                                        <button v-if="editId === act.id" @click="updateActivity(act.id)"
                                            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                                            💾 Save
                                        </button>
                                        <button v-if="editId === act.id" @click="cancelEdit"
                                            class="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded">
                                            ❌ Cancel
                                        </button>
                                        <button v-else @click="editActivity(act)"
                                            class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                                            ✏️ Edit
                                        </button>
                                        <button @click="deleteActivity(act.id)"
                                            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="text-gray-500 mt-2">No activity logs yet.</div>

                </div>


                <div v-show="activeTab === 'gantts'">
                    Gantt Chart...
                </div>

                <div v-show="activeTab === 'members'">
                    Members...
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";
import { useRoute, useRouter } from "vue-router";

import { calculateProjectbalance } from '../utility'

const route = useRoute();
const router = useRouter();

// ID
const projectId = route.params.id;

// STATE
const loading = ref(true);
const project = ref(null);
const tasks = ref([]);
const activities = ref([]);
const budgets = ref([]);

const activeTab = ref("info");

// Add Budget Form
// const newBudget = ref({
//     name: "",
//     amount_budgeted: 0
// });

// TABS
const tabs = [
    { id: "info", label: "Project Info" },
    { id: "tasks", label: "Tasks" },
    { id: "budgets", label: "Budgets" },
    { id: "expenses", label: "Expenses" },
    { id: "activities", label: "Activity Logs" },
    { id: "gantts", label: "Gantt Chart" },
    { id: "members", label: "Members" }
];

// LOAD MAIN DATA
async function loadProjectAndTasks() {
    loading.value = true;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    // Load project
    const { data: projectData } = await supabase
        .from("projects")
        .select(`
            id,
            name,
            description,
            status_id,
            project_status (name),
            total_budget,
            start_date,
            end_date,
            due_date,
            profit,
            total_expense,
            total_revenue,
            estimated_value
        `)
        .eq("id", projectId)
        .eq("owner_id", userId)
        .single();

    if (projectData) {
        projectData.status_name = projectData.project_status?.name ?? null;
        projectData.budget = projectData.total_budget ?? null;
        delete projectData.project_status;
        delete projectData.total_budget;
        project.value = projectData;
    }

    // Load tasks
    const { data: taskData } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .is("deleted_at", null)
        .order("start_date", { ascending: true });

    tasks.value = taskData ?? [];

    // Load activities
    // const { data: activityData } = await supabase
    //     .from("activity_logs")
    //     .select("*")
    //     .eq("project_id", projectId)
    //     .order("start_datetime", { ascending: false });

    // activities.value = activityData ?? [];

    // Load Budgets
    const { data: budgetData } = await supabase
        .from("project_budgets")
        .select("*")
        .eq("project_id", projectId)
        .is("deleted_at", null)
        .order("id", { ascending: true });

    budgets.value = budgetData ?? [];

    loading.value = false;
}

const expenseTypes = ref([
    { "id": 1, "name": "รายรับ" },
    { "id": 2, "name": "รายจ่าย" },
]);

const expenseCategories = ref([
    { "id": 1, "name": "บุคลากร" },
    { "id": 2, "name": "การเดินทาง" },
    { "id": 3, "name": "การฝึกอบรม" },
    { "id": 4, "name": "วัสดุอุปกรณ์" },
    { "id": 5, "name": "ค่าสถานที่" },
    { "id": 6, "name": "งานวิจัย" },
    { "id": 7, "name": "ค่าใช้จ่ายลงทุน" },
    { "id": 8, "name": "ค่าดำเนินการ" },
    { "id": 9, "name": "ค่าจ้าง" },
    { "id": 10, "name": "ขาย" },
    { "id": 8, "name": "รายได้อื่นๆ" }

]);

// New budget object
const newBudget = ref({
    name: "",
    amount_budgeted: 0,
    expense_category_id: "",
    expense_type_id: ""
});

// Update addBudget function
async function addBudget() {
    if (!newBudget.value.name || newBudget.value.amount_budgeted <= 0 || !newBudget.value.expense_category_id)
        return alert("Please fill all fields");

    console.log(-Math.abs(newBudget.value.amount_budgeted))

    const { data, error } = await supabase
        .from("project_budgets")
        .insert({
            project_id: projectId,
            name: newBudget.value.name,
            amount_budgeted: newBudget.value.amount_budgeted,
            expense_category_id: newBudget.value.expense_category_id
        })
        .select()
        .single();

    if (error) return alert(error.message);

    budgets.value.push(data);
    newBudget.value.name = "";
    newBudget.value.amount_budgeted = 0;
    newBudget.value.expense_category_id = "";
    newBudget.value.expense_type_id = "";
}

// Helper to get category name
function getCategoryName(catId) {
    // console.log("expenseCategories", expenseCategories.value)
    // console.log("catId", catId)
    expenseCategories.value.forEach(c => {
        // console.log(`ID: ${c.id}, Name: ${c.name}`);
    });

    // const catId = 3; // example
    const c = expenseCategories.value.find(c => c.id == catId);

    if (c) {
        // console.log(`Found category: ID=${c.id}, Name=${c.name}`);
    } else {
        // console.log(`Category with id ${catId} not found`);
    }
    return c ? c.name : "Unknown";
}

// Summary per category
const summaryByCategory = computed(() => {
    const summary = {};
    budgets.value.forEach(b => {
        const id = b.expense_category_id;
        if (!summary[id]) summary[id] = 0;
        summary[id] += Number(b.amount_budgeted || 0);
    });
    return summary;
});


// 💾 Update budget
async function updateBudget(budget) {
    const { error } = await supabase
        .from("project_budgets")
        .update({
            name: budget.name,
            amount_budgeted: budget.amount_budgeted,
            expense_category_id: budget.expense_category_id,
            updated_at: new Date()
        })
        .eq("id", budget.id);

    if (error) alert(error.message);
}

// 🗑️ Delete budget
async function deleteBudget(id) {
    const yes = confirm("Delete this item?");
    if (!yes) return;

    await supabase
        .from("project_budgets")
        .update({ deleted_at: new Date() })
        .eq("id", id);

    budgets.value = budgets.value.filter(b => b.id !== id);
}

// TOTAL BUDGET
const totalBudget = computed(() =>
    budgets.value.reduce((sum, b) => sum + Number(b.amount_budgeted || 0), 0)
);

// SORT TASKS
const sortKey = ref("start_date");
const ascending = ref(true);

const sortedTasks = computed(() => {
    return [...tasks.value].sort((a, b) => {
        let x = a[sortKey.value] ?? "";
        let y = b[sortKey.value] ?? "";

        if (sortKey.value.includes("date")) {
            x = x ? new Date(x) : new Date(0);
            y = y ? new Date(y) : new Date(0);
        }

        return ascending.value ? (x > y ? 1 : -1) : (x < y ? 1 : -1);
    });
});

function editTask(id) {
    router.push(`/app/project/${projectId}/task/${id}/update`);
}

function viewTask(id) {
    router.push(`/app/project/${projectId}/task/${id}`);
}

async function deleteTask(id) {
    if (!confirm("Delete task?")) return;

    await supabase
        .from("tasks")
        .update({ deleted_at: new Date() })
        .eq("id", id);

    tasks.value = tasks.value.filter(t => t.id !== id);
}

onMounted(loadProjectAndTasks);







// State
const expenses = ref([])
const form = ref({
    id: null,
    name: '',
    expense_category_id: '',
    amount_spent: 0,
    expense_type_id: 1
})

// Load categories
async function loadCategories() {
    const { data } = await supabase.from('expense_categories').select('*').order('id')
    if (data) expenseCategories.value = data
}

// Load project expenses
async function loadExpenses() {
    const { data } = await supabase
        .from('project_expenses')
        .select('*')
        .eq('project_id', projectId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
    if (data) expenses.value = data
}


// Save expense (insert or update)
async function saveExpense() {
    console.log("xxxx");
    if (!form.value.name || !form.value.expense_category_id) {
        alert('Please fill all fields')
        return
    }

    if (form.value.id) {
        // Update
        const { error } = await supabase
            .from('project_expenses')
            .update({
                name: form.value.name,
                expense_category_id: form.value.expense_category_id,
                amount_spent: (form.value.expense_type_id == 1) ? Math.abs(form.value.amount_spent) : - Math.abs(form.value.amount_spent),
                updated_at: new Date().toISOString(),
                expense_type_id: form.value.expense_type_id
            })
            .eq('id', form.value.id)

        if (error) return alert(error.message)
    } else {
        // Insert
        const { error } = await supabase.from('project_expenses').insert([
            {
                project_id: projectId,
                name: form.value.name,
                expense_category_id: form.value.expense_category_id,
                expense_type_id: form.value.expense_type_id,
                amount_spent: (form.value.expense_type_id == 1) ? Math.abs(form.value.amount_spent) : - Math.abs(form.value.amount_spent)
            }
        ])
        if (error) return alert(error.message)
    }

    await loadExpenses()

    await calculateProjectbalance(projectId)
    resetForm()
}

// Edit expense
function editExpense(expense) {
    form.value = { ...expense }
}

// Delete expense (soft delete)
async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return
    const { error } = await supabase
        .from('project_expenses')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
    if (error) return alert(error.message)
    await loadExpenses()
}

// Reset form
function resetForm() {
    form.value = {
        id: null,
        name: '',
        expense_category_id: '',
        amount_spent: 0
    }
}

// Summary by category
const summary = computed(() => {
    const result = {}
    expenses.value.forEach(exp => {
        const cat = expenseCategories.value.find(c => c.id === exp.expense_category_id)
        const name = cat ? cat.name : 'Unknown'
        if (!result[name]) result[name] = 0
        result[name] += Number(exp.amount_spent)
    })
    return result
})

// Init
onMounted(async () => {
    await loadCategories()
    await loadExpenses()
    await calculateProjectbalance(projectId)
})

const editId = ref(null)
const editForm = ref({
    name: '',
    expense_category_id: '',
    amount_spent: 0
})

// Start editing a row
function startEdit(expense) {
    editId.value = expense.id
    editForm.value = { ...expense } // copy expense data
}

// Cancel editing
function cancelEdit() {
    editId.value = null
    editForm.value = { name: '', expense_category_id: '', amount_spent: 0 }
}

// Save edited row
async function saveEdit(id) {
    if (!editForm.value.name || !editForm.value.expense_category_id) {
        alert('Please fill all fields')
        return
    }

    const { error } = await supabase
        .from('project_expenses')
        .update({
            name: editForm.value.name,
            expense_category_id: editForm.value.expense_category_id,
            amount_spent: (editForm.value.expense_type_id == 1) ? Math.abs(editForm.value.amount_spent) : -Math.abs(editForm.value.amount_spent),
            updated_at: new Date().toISOString(),
            expense_type_id: editForm.value.expense_type_id,
        })
        .eq('id', id)

    if (error) return alert(error.message)

    editId.value = null
    editForm.value = { name: '', expense_category_id: '', amount_spent: 0 }
    await loadExpenses() // reload table data
}



// acticity_logs 
// import { ref, onMounted } from 'vue'
// import { supabase } from '../lib/supabaseClient'

// const projectId = ref(1) // replace with dynamic route param if needed
// const activities = ref([])
const activityForm = ref({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    timespent: 0
})
const editActivityId = ref(null)
// import { ref, onMounted } from 'vue'
// import { supabase } from '../lib/supabaseClient'

// const projectId = ref(1) // replace with dynamic route param if needed
// const activities = ref([])

// const editId = ref(null)
const editRow = ref({})

async function loadActivities() {
    const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('project_id', projectId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
    if (error) console.error(error)
    else activities.value = data
}

async function saveActivity(){
    console.log("--->>",activityForm.value.description);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
        const { data, error } = await supabase
        .from("activity_logs")
        .insert({
            project_id: projectId,
            user_id: userId,
            name: activityForm.value.name,
            description: activityForm.value.description,
            start_date: activityForm.value.start_date,
            end_date: activityForm.value.end_date,
            timespent: activityForm.value.timespent

        })
        .select()
        .single();
}

// Start editing a row
function editActivity(row) {
    editId.value = row.id
    editRow.value = { ...row }
}

// Cancel edit
// function cancelEdit() {
//   editId.value = null
//   editRow.value = {}
// }

// Save changes
async function updateActivity(id) {
    const { error } = await supabase
        .from('activity_logs')
        .update({ ...editRow.value, updated_at: new Date().toISOString() })
        .eq('id', id)
    if (error) return alert(error.message)

    editId.value = null
    editRow.value = {}
    loadActivities()
}

// Delete activity (soft delete)
async function deleteActivity(id) {
    if (!confirm('Are you sure to delete this activity?')) return
    const { error } = await supabase
        .from('activity_logs')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
    if (error) return alert(error.message)
    loadActivities()
}

async function deleteProject(projectId) {
    console.log("--->>>>>", projectId);

    // confirm popup
    const confirmed = window.confirm(
        "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const { data, error } = await supabase
            .from('projects')
            .update({
                deleted_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', projectId);

        if (error) throw error;

        alert("Project deleted successfully");
        console.log("Deleted project:", data);

    } catch (err) {
        console.error(err);
        alert("Failed to delete project");
    }
}

onMounted(loadActivities)


</script>
