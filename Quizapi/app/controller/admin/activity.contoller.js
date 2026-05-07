const activitymodel = require("../../modals/activity");

// activity.controller.js


exports.getActivity = async (req, res) => {
    try {
        const adminId = req.admin?.userInfo?._id || req.admin?._id;

        if (!adminId) {
            return res.send({
                _status: false,
                _message: "Admin ID not found"
            });
        }

        const data = await activitymodel
            .find({ adminId })
            .sort({ createdAt: -1 });

        return res.send({
            _status: true,
            _data: data
        });

    } catch (error) {
        console.log(error);
        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

exports.deleteActivity = (request, response) => {
    activitymodel.deleteMany(
        {
             _id: request.body.id 
        }
    )
    .then((result) => {
        var data = {
            _status : true,
            _message : 'Delete Sucessfull'
        }
        response.send(data)
    })
    .catch((error) => {
        var data = {
          _status : false,
            _message : 'Something wentwrong'
        }
        response.send(data)  
        })
}