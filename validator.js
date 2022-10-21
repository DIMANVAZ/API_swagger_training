const {number, string}  = require('yup');

const yup = require('yup');

const allSchemasDrafts = {
    phones: {
        brand: string().required(),
        model: string().required(),
        price: number().required().positive().integer(),
        sim: number().required().positive().integer(),
        condition: string().required()
    },
    laptops: {
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
    try {
        return suitableSchema.validateSync(newItem, {stripUnknown: true});
    } catch(e){
        return false;
    }
    //return suitableSchema.isValidSync(newItem);
}
