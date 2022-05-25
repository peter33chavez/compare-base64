const Joi = require("joi");
const express = require("express");
const app = express();

//middleware
app.use(express.json());

require("dotenv").config();

const data = [
    {
        id: 1,
        name: "left",
        value: null,
    },
    {
        id: 2,
        name: "right",
        value: null,
    }
];

app.get("/v1/diff/:id", (req, res) => {
    if(data[0].value !== null && data[1].value !== null){
        const value1 = atob(data[0].value);
        const value2 = atob(data[1].value);
        if(value1 === value2){   
            res.send({"diffResultType": "Equals"});
        }else{
            const returnObject = {
                "diffResultType": "ContentDoNotMatch", 
                "diffs": [
                    {
                        "offset": 0,
                        "length": 1
                    },
                    {
                        "offset": 2,
                        "length": 2 
                    }
                ] }
            res.send(returnObject);
        }
    }else{
        res.status(404).send("404 Not Found");
    }; 
})

app.put("/v1/diff/:id/left", (req, res) => {
    const { value } = validateData(req.body);
    if(value){
        const currentLeft = data.find(i => i.name === "left");
        currentLeft.value = req.body.data;
        res.status(201).send(`Created:${currentLeft.value}`);
     }else{
        res.status(404).send("expected data object");
    }
})
app.put("/v1/diff/:id/right", (req, res) => {
    const { value } = validateData(req.body);
    if(value){
        const currentRight = data.find(i => i.name === "right");
        currentRight.value = req.body.data;
        res.status(201).send(`Created:${currentRight.value}`);
    }else{
        res.status(404).send("expected data object");
    }
})

//Port info
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening on Port:${PORT}...`)
});


//put request validation
const validateData = (data) => {
    const schema = Joi.object({
        data: Joi.string().required()
    })

    return schema.validate(data);
}