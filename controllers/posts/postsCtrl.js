const createPostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'post has been Created'
        })
    } catch (error) {
        res.json({
            status: 'fail',
            message: error.message
        })
    }
}

const postCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'post route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

const allPostsCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'all posts route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

const deletePostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'delete post route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

const updatePostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'update post route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

module.exports = {
    createPostCtrl,
    postCtrl,
    allPostsCtrl,
    deletePostCtrl,
    updatePostCtrl
}