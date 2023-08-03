const addcommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'comments has been Created'
        })
    } catch (error) {
        res.json({
            status: 'fail',
            message: error.message
        })
    }
}

const getcommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'comments route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

const deletecommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'comments delete route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

const updatecommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'update comments route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

module.exports = {
    addcommentCtrl,
    getcommentCtrl,
    deletecommentCtrl,
    updatecommentCtrl
}