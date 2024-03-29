const Category = require('../../model/Category/Category')
const {appErr} = require('../../utils/appErr')

const createCategoryCtrl = async (req, res, next) => {
    const {title} = req.body;
    try {
        const category = await Category.create({title, user: req.userAuth});

        res.json({
            status: 'success',
            data: category
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}

const fetchCategoryCtrl = async (req, res, next) => {
    try {
        const categories = await Category.find();

        res.json({
            status: 'success',
            data: categories
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}

const getCategoryCtrl = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        res.json({
            status: 'success',
            data: category
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}

const deleteCategoryCtrl = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        res.json({
            status: 'success',
            data: 'category has been deleted'
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}

const updateCategoryCtrl = async (req, res, next) => {
    const {title} = req.body;
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {title},
            {new: true, runValidators: true}
        );

        res.json({
            status: 'success',
            data: 'update category route'
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}

module.exports = {
    createCategoryCtrl,
    fetchCategoryCtrl,
    getCategoryCtrl,
    deleteCategoryCtrl,
    updateCategoryCtrl
}