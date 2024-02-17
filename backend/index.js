const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Stripe = require('stripe')
const bcrypt = require('bcrypt')

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
const PORT = process.env.PORT || 8080;

mongoose.set("strictQuery", false);

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    bmi: String,
    foodPreference: String,
    image: String,
});

const userModel = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.post("/signup", async (req, res) => {
    const { password, email } = req.body;

    userModel.findOne({ email: email }, async (err, result) => {
        if (result) {
            res.send({ message: "Email id is already registered", alert: false });
        } else {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                req.body.password = hashedPassword;

                const data = new userModel(req.body);
                const save = await data.save();

                res.send({ message: "Successfully sign up", alert: true });

            } catch (error) {
                console.log(error);
                res.status(500).send({ message: 'Error while saving user' });
            }
        }
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email }, async (err, result) => {
        if (result) {
            const isMatch = await bcrypt.compare(password, result.password);
            if (!isMatch) {
                return res.send({ message: "Invalid password.", alert: false });
            }

            const dataSend = {
                _id: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                image: result.image,
            };
            console.log(dataSend);
            res.send({
                message: "Login is successfully",
                alert: true,
                data: dataSend,
            });
        } else {
            res.send({
                message: "Email is not available, please sign up",
                alert: false,
            });
        }
    });
});

app.post("/userdetails", (req, res) => {
    const { bmi, foodPreference, email } = req.body;

    // Validate request body
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if (!bmi || !foodPreference) {
        return res.status(400).json({ message: "Both BMI and food preference are required" });
    }

    userModel.findOne({ email }, async (err, user) => {
        if (err) {
            console.error(`Error occurred while finding the user with email ${email}: ${err}`);
            return res.status(500).json({ message: 'Server error while finding user' });
        }

        if (!user) {
            return res.status(404).json({ message: "No user found with the provided email" });
        }

        user.bmi = bmi;
        user.foodPreference = foodPreference;

        console.log(user);

        try {
            await user.save();
            res.json({ message: "User details updated successfully!" });
        } catch (err) {
            console.error(`Error occurred while saving user details: ${err}`);
            res.status(500).json({ message: 'Error while updating user details' });
        }
    });
});

app.post("/getUserDetails", (req, res) => {
    const { email } = req.body;

    if (!email)
        return res.status(400).json({ message: "Email is required" });

    userModel.findOne({ email }, async (err, user) => {
        if (err) {
            console.error(`Error occurred while finding the user with email ${email}: ${err}`);
            return res.status(500).json({ message: 'Server error while finding user' });
        }

        if (!user) {
            return res.status(404).json({ message: "No user found with the provided email" });
        }

        const data = {
            "bmi": user.bmi,
            "foodType": user.foodPreference
        }

        res.status(200).json(data);
    })
});

const schemaProduct = mongoose.Schema({
    name: String,
    category: String,
    image: String,
    price: String,
    description: String,
});

const productModel = mongoose.model("product", schemaProduct)

app.post("/uploadProduct", async (req, res) => {
    const productData = new productModel(req.body);
    try {
        const savedProduct = await productData.save();
        res.send({ message: "Upload successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error while saving product' });
    }
});

app.get("/product", async (req, res) => {
    const data = await productModel.find({}).limit(75)
    res.send(JSON.stringify(data))
});

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
app.post("/create-checkout-session", async (req, res) => {
    try {
        const params = {
            submit_type: 'pay',
            mode: "payment",
            payment_method_types: ['card'],
            billing_address_collection: "auto",
            shipping_options: [{ shipping_rate: "shr_1N0qDnSAq8kJSdzMvlVkJdua" }],
            line_items: req.body.map((item) => {
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: item.price * 100,
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1,
                    },
                    quantity: item.qty
                };
            }),
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        };

        const session = await stripe.checkout.sessions.create(params);
        res.status(200).json(session.id);
    } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
    }
});

mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://dummyhubhai70:dummyhubhai@cluster0.eu22eny.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server is running at port : " + PORT);
        });
    })
    .catch((err) => console.log(err));
