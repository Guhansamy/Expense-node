const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Expense } = require("./schema"); // this is the model name from schema which ic used to access the DB

const app = express();
app.use(bodyParser.json());
app.use(cors());

async function connectionToDb() {
    try {
        await mongoose.connect(
            "mongodb+srv://Guhan:Guhan@first.fg0rfcw.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=First"
        );
        // here between / and ? we had given a name which specify the model name
        console.log("Connected to DB");

        const port = process.env.PORT || 8000; // process.env.PORT is used when we deploy the backend in any cloud service

        app.listen(port, function () {
            console.log(`Listening to port ${port}....`);
        });
    } catch (e) {
        console.log("Error has occured  ");
        console.log(e);
    }
}
/* for mongo Db
username = Guhan
password = Guhan
*/
connectionToDb();

app.post("/add-expense", async function (request, response) {
    try {
        await Expense.create({
            amount: request.body.amount,
            category: request.body.category,
            date: request.body.date,
        });
        response.status(201).json({
            status: "success",
            message: "entry create",
        });
    } catch (error) {
        // console.log(error);
        // console.log("User not allowed");
        response.status(404).json({
            status: "Error",
            message: "entry not created",
        });
    }
});

app.get("/get-data", async function (req, res) {
    try {
        const expenseDetails = await Expense.find();
        res.status(200).json({
            Status: "Completed Successfully",
            Values: expenseDetails,
        });
    } catch (error) {
        res.status(404).json({
            status: "Error",
            message: "Could not fetch data",
            error: error,
        });
    }
});

// successfully deleted the values

app.delete("/delete-expense/:id", async function (request, response) {
    // console.log(request.params.id);
    try {
        const expenseEntry = await Expense.findById(request.params.id);

        if (expenseEntry) {
            await Expense.findByIdAndDelete(request.params.id);
            response.status(200).json({
                status: "sucess",
                message: "Entry deleted",
            });
        } else {
            response.status(404).json({
                "status ": "failure",
                message: "Entry not found",
            });
        }
    } catch (error) {
        response.status(404).json({
            status: "Some error has occured",
            error: error,
        });
    }
});

app.patch("/update-expense/:id", async function (request, response) {
    try {
        const expenseEntry = await Expense.findById(request.params.id);

        if (expenseEntry) {
            // await Expense.findByIdAndUpdate(request.params.id);
            await expenseEntry.updateOne({
                amount: request.body.amount,
                category: request.body.category,
                date: request.body.date,
            });
            response.status(200).json({
                status: "sucess",
                message: "Entry updated",
            });
        } else {
            response.status(404).json({
                "status ": "failure",
                message: "Entry not found",
            });
        }
    } catch (error) {
        response.status(404).json({
            status: "Some error has occured",
            error: error,
        });
    }
});
