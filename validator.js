const {date, number, string}  = require('yup');

const yup = require('yup');

const allSchemasDrafts = {
    phones: {
        brand: string().required(),
        model: string().required(),
        price: number().required().positive().integer(),
        sim: number().required().positive().integer(),
        condition: string().required()
    },
    notebooks: {
        brand: string().required(),
        model: string().required(),
        price: number().required().positive().integer(),
        diagonal: number().required().positive(),
        condition: string().required()
    }
}

module.exports = function(newItem, category) {
    const shape = allSchemasDrafts[category];
    const suitableSchema = yup.object().shape(shape);
    return suitableSchema.isValidSync(newItem);
}