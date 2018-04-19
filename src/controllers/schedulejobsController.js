const Schedule = require('../models/scheduledJobs');

exports.listSchedule = (req, res) => {
    let page = req.query.page || 0;
    let itemsPerPage = 10;

    Schedule.find({ ownerId: req.session.user.id })
        .sort({ createdAt: 'desc' })
        .skip(page * itemsPerPage)
        .limit(itemsPerPage)
        .then(data => res.render('schedule/index', {
            data,
            schedulePageActive: true
        }))
        .catch((err) => {
            res.status(400).json({
                error: err
            });
        });
}

exports.getSchedule = async (req, res) => {
    let id = req.params.id;

    Schedule.findOne({ _id: id }).exec()
        .then((data) => {
            res.render('schedule/edit', { schedule: data });
        })
        .catch((err) => {
            res.status(400).json({
                error: err
            });
        });
};

exports.updateSchedule = async (req, res) => {
    //TODO: Invänta sparafunktionen 
};

exports.deleteSchedule = (req, res) => {
    console.log('deleteSchedule');
    Schedule.findOneAndRemove({ _id: req.params.id }).exec()
        .then(() => {
            req.session.flash = {
                message: 'Schemaläggningen har tagits bort!',
                success: true
            };

            return res.redirect('/schedules');
        })
        .catch((err) => {
            console.log(err);
            // err.code ENOENT = No such file on disk, but removed entry removed from db.
            req.session.flash = {
                message: 'Vi kunde inte ta bort schemainställningen!',
                danger: true
            };

            return res.redirect('/');
        });
};


exports.getEditPage = (req, res) => {
    let id = req.params.id;
    res.render('schedules/edit', { id: id });
};