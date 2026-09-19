import { supabase } from "./lib/supabaseClient.js";
export async function calculateProjectbalance(projectId) {
    console.log("projectId",projectId)
    // Query Expense from project_expenses 
    // Query Project Budget project_budgets 
    // Query Revenue from project_expenses  
    // Profit = Revenue - Expense 

    const { data: projectBudget } = await supabase
        .from("project_budgets")
        .select(`* 
        `)
        .eq("project_id", projectId)     

    const { data: projectRevenue } = await supabase
        .from("project_expenses")
        .select(`* 
        `)
        .eq("project_id", projectId)
        .eq("expense_type_id", 1)


    const { data: projectExpenses } = await supabase
        .from("project_expenses")
        .select(`* 
        `)
        .eq("project_id", projectId)
        .eq("expense_type_id", 2)


    const expense = projectExpenses.reduce(
        (sum, item) => sum + (Number(item.amount_spent) ),
        0
    );

    const revenue = projectRevenue.reduce(
        (sum, item) => sum + (Number(item.amount_spent)),
        0
    );

    const budget = projectBudget.reduce(
        (sum, item) => sum + (Number(item.amount_budgeted)),
        0
    );


    const profit = expense + revenue 
    const { error } = await supabase
      .from('projects')
      .update({
        total_budget: budget,
        profit: profit,
        total_expense: expense,
        total_revenue: revenue
      })
      .eq('id', projectId)

}