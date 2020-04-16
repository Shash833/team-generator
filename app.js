const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

//Empty array to store employee objects
const employeeList = []

//Prompt user with initial questions to provide employee details:
function promptEmployee() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Employee name: ",
        },
        {
            type: "input",
            name: "ID",
            message: "Employee ID: "
        },
        {
            type: "input",
            name: "email",
            message: "Employee email: "
        },
        {
            type: "checkbox",
            name: "role",
            message: "Employee Role: ",
            choices: ["Manager", "Engineer", "Intern"]
        },
    ])
}

//Prompt user with role specific questions:
function promptManager() {
    return inquirer.prompt([
        {
            type: "input",
            name: "officeNumber",
            message: "Manager office number: "
        }
    ])
}

function promptEngineer() {
    return inquirer.prompt([
        {
            type: "input",
            name: "github",
            message: "Git-Hub username: "
        }
    ])
}

function promptIntern() {
    return inquirer.prompt([
        {
            type: "input",
            name: "school",
            message: "Intern's school: "
        }
    ])
}


//Prompt user with choices to continue with adding more employees or to create HTML page.
function continuePrompt() {
    return inquirer.prompt([{
        type: "checkbox",
        name: "choice",
        message: "Do you want to add any more employees?",
        choices: ["Yes", "No. Generate team page."]
    }])
}

//Function to be called after employee object has been created to prompt user with how to continue: to either create new employee objects or to render HTML
async function continueOptions() {
    try {
        const proceed = await continuePrompt()
        //If user chooses yes, run employeeProfile() again to create new employee object
        if (proceed.choice == "Yes") {
            employeeProfile()
        }
        //If user chooses "no", create HTML file using array of employee objects
        else {
            const teamFile = await render(employeeList)
            fs.writeFile(outputPath, teamFile, function (error) {
                if (error) {
                    throw error
                }
                else {
                    console.log("Team page has been created in output folder")
                }
            })
        }
    }
    catch (error) { console.log(error) }
}


//To call functions which prompt the user.
//Prompt user with initial employee questions, then based on role, display role specific questions.
//With user answers, create new objects for epmloyees using role specific classes.
//After employee object is made and added to array, prompt on how to continue by calling continueOptions().
async function employeeProfile() {
    try {
        const employee = await promptEmployee()
        if (employee.role == "manager") {
            const manager = await promptManager()
            employee.name = new Manager(employee.name, employee.ID, employee.email, manager.officeNumber)
            employeeList.push(employee.name)
            continueOptions()
        }
        else if (employee.role == "engineer") {
            const engineer = await promptEngineer()
            employee.name = new Engineer(employee.name, employee.ID, employee.email, engineer.github)
            employeeList.push(employee.name)
            continueOptions()
        }
        else {
            const intern = await promptIntern()
            employee.name = new Intern(employee.name, employee.ID, employee.email, intern.school)
            employeeList.push(employee.name)
            continueOptions()
        }
    }
    catch (error) {
        console.log(error)
    }
}

employeeProfile()
