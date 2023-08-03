const createCategoryCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'category has been Created'
        })
    } catch (error) {
        res.json({
            status: 'fail',
            message: error.message
        })
    }
}

const getCategoryCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'category route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

const deleteCategoryCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'delete category route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

const updateCategoryCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'update category route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

module.exports = {
    createCategoryCtrl,
    getCategoryCtrl,
    deleteCategoryCtrl,
    updateCategoryCtrl
}