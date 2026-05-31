/**
 * TypeScript Console-based Task Manager
 *
 * This application demonstrates the core features of the TypeScript language,
 * including strong typing, interfaces, classes, error handling, and
 * asynchronous operations (simulated).
 *
 * To run:
 * 1. Ensure Node.js is installed.
 * 2. Run: npm install typescript ts-node prompt-sync @types/prompt-sync
 * 3. Run: npx ts-node index.ts
 */

// Import a library for synchronous user input in a console environment.
// This is used instead of the native asynchronous 'readline' module for simpler menu handling.
// NOTE: Must run 'npm install prompt-sync @types/prompt-sync'
const promptSync = require('prompt-sync')({ sigint: true });

// --- Unique Requirement 1: Interface Definition ---
/**
 * Defines the strict structure and types for a Task object.
 * This ensures type safety throughout the application.
 */
interface Task {
    // Immutable variable
    readonly id: number;
    // Immutable variable
    name: string;
    description: string;
    // Union type for the status property
    status: 'Pending' | 'Completed';
}

/**
 * Manages the collection of tasks and provides all necessary CRUD operations.
 */
class TaskManager {
    // Mutable variable: Stores the task list. Use 'private' for encapsulation.
    private tasks: Task[] = [];
    // Mutable variable: Tracks the next available ID.
    private nextId: number = 1;

    /**
     * Adds a new task to the list after validating the input.
     * @param name The name of the new task.
     * @param description A brief description of the task.
     * @returns void
     */
    public addTask(name: string, description: string): void {
        // Conditionals and Expression (arithmetic expression for nextId++)
        if (!name.trim()) {
            // Error Handling: Throw an error for invalid input
            throw new Error('Task name cannot be empty.');
        }

        const newTask: Task = {
            id: this.nextId++, // Expression: Post-increment
            name: name.trim(),
            description: description.trim() || 'No description provided.',
            status: 'Pending' // Default status
        };

        this.tasks.push(newTask);
        console.log(`\n✅ Task ${newTask.id}: '${newTask.name}' added successfully.`);
    }

    /**
     * Removes a task from the list based on its ID.
     * @param id The ID of the task to remove.
     * @returns void
     */
    public removeTask(id: number): void {
        const initialLength = this.tasks.length;
        // Conditionals: Filter out the task with the matching ID
        this.tasks = this.tasks.filter(task => task.id !== id);

        // Conditionals: Check if removal occurred
        if (this.tasks.length === initialLength) {
            // Error Handling: Throw an error if task ID not found
            throw new Error(`Task with ID ${id} not found.`);
        }
        console.log(`\n🗑️ Task ID ${id} removed.`);
    }

    /**
     * Lists all current tasks, displaying their ID, name, and status.
     * @returns void
     */
    public listTasks(): void {
        console.log('\n--- Current Tasks ---');
        if (this.tasks.length === 0) {
            console.log('Your task list is empty!');
            return;
        }

        // Loop: Use for...of loop to iterate over the array
        for (const task of this.tasks) {
            const statusIcon = task.status === 'Completed' ? '✅' : '⏳';
            // Expression: String interpolation
            console.log(`${statusIcon} [${task.id}] ${task.name} - Status: ${task.status}`);
        }
        console.log('---------------------');
    }

    /**
     * Clears all tasks from the manager.
     * @returns void
     */
    public clearTasks(): void {
        // Functions: Array mutation
        this.tasks = [];
        console.log('\n🔥 All tasks cleared.');
    }

    /**
     * Updates the status of a specific task by ID.
     * @param id The ID of the task to update.
     * @param status The new status ('Pending' or 'Completed').
     * @returns void
     */
    public updateTaskStatus(id: number, status: 'Pending' | 'Completed'): void {
        // Conditionals: Check for valid status input
        if (status !== 'Pending' && status !== 'Completed') {
            throw new Error(`Invalid status: '${status}'. Must be 'Pending' or 'Completed'.`);
        }

        const taskToUpdate = this.tasks.find(task => task.id === id);

        // Conditionals: Check if task exists
        if (!taskToUpdate) {
            // Error Handling: Throw an error if task not found
            throw new Error(`Task with ID ${id} not found for update.`);
        }

        taskToUpdate.status = status;
        console.log(`\n📝 Task ${id} status updated to: ${status}`);
    }
}

/**
 * Displays the main menu options to the user.
 */
function displayMenu(): void {
    console.log('\n--- Task Manager Menu ---');
    console.log('1. Add New Task');
    console.log('2. List All Tasks');
    console.log('3. Remove Task by ID');
    console.log('4. Update Task Status');
    console.log('5. Clear All Tasks');
    console.log('6. Exit');
    console.log('-------------------------');
}

// Instantiate the class
const manager = new TaskManager();

// --- Unique Requirement 2: Async/Await (Simulated) ---
/**
 * Main function to run the interactive console menu.
 * @returns Promise<void>
 */
async function runMenu(): Promise<void> {
    let running = true;

    // Loop: Main application loop
    while (running) {
        displayMenu();
        const choice = promptSync('Enter your choice (1-6): ');

        // Unique Requirement 3: Error Handling with try/catch
        try {
            // Handle null/undefined input
            if (!choice) {
                console.log('❌ No input received. Please try again.');
                continue;
            }

            switch (choice.trim()) {
                case '1': {
                    const name = promptSync('Task Name: ') || '';
                    const description = promptSync('Task Description (Optional): ') || '';
                    manager.addTask(name, description);
                    break;
                }
                case '2':
                    manager.listTasks();
                    break;
                case '3': {
                    const idStr = promptSync('Enter Task ID to remove: ') || '';
                    // Expression: Type casting using parseInt
                    const id = parseInt(idStr.trim());
                    if (isNaN(id)) throw new Error('Invalid ID entered.');
                    manager.removeTask(id);
                    break;
                }
                case '4': {
                    manager.listTasks();
                    const idStr = promptSync('Enter Task ID to update status: ') || '';
                    const id = parseInt(idStr.trim());
                    if (isNaN(id)) throw new Error('Invalid ID entered.');
                    const statusStr = promptSync('New Status (Pending/Completed): ') || '';
                    // Expression: Type casting for status using 'as' for type safety
                    const status = statusStr.trim() as 'Pending' | 'Completed';
                    manager.updateTaskStatus(id, status);
                    break;
                }
                case '5':
                    manager.clearTasks();
                    break;
                case '6':
                    console.log('\n👋 Exiting Task Manager. Goodbye!');
                    running = false;
                    break;
                default:
                    // Conditionals: Handle invalid menu selection
                    console.log('❌ Invalid selection. Please choose a number between 1 and 6.');
            }
            // Simulate an asynchronous process after an action is complete
            if (running) {
                console.log('\nProcessing... (Simulating Async Delay)');
                // Await a Promise with a timeout
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error: any) {
            console.log(`\n🚨 Operation Failed: ${error.message}`);
        }
    }
}

// Function call to start the application
runMenu();