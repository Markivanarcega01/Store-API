const Product = require('../models/models')
const getAllProductsStatic = async(req,res) =>{
    const products = await Product.find({name:'armchair'})
    res.status(200).json({products})
}

const getAllProducts = async(req,res) =>{
    const {name,featured,company,sort,fields,numericFilters} = req.query
    const queryObject = {}
    //Searching and Filtering
    if(featured){
        queryObject.featured = featured === 'true'? true : false
    }
    if(name){
        queryObject.name = {$regex:name,$options:'i'}
    }
    if(company){
        queryObject.company = company
    }
    //Filtering
    if(numericFilters){
        const operatorMap= {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx = /\b(<|<=|=|>|>=)\b/g
        let filters = numericFilters.replace(regEx,(match)=>
            `-${operatorMap[match]}-`
        )
        const options = ['price','rating']
        filters = filters.split(',').forEach((item)=>{
            const [field,operator,value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        })
    }
    //After the search and filter, object is thrown in .find() to find match data
    let getAllProducts = Product.find(queryObject)
    //Sort
    if(sort){
        const sortList = sort.split(',').join(' ')
        getAllProducts = getAllProducts.sort(sortList)
    }else{
        getAllProducts = getAllProducts.sort('createdAt')
    }
    //Select
    if(fields){
        const fieldsList = fields.split(',').join(' ')
        getAllProducts = getAllProducts.select(fieldsList)
    }
    //Pagenation
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1) * limit
    getAllProducts = getAllProducts.skip(skip).limit(limit)

    //Display
    const products = await getAllProducts
    res.status(200).json({products})
}

module.exports = {
    getAllProducts,getAllProductsStatic
}