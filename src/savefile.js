var formidable = require('formidable');
var dataDir = __dirname + 'data';
var vacationPhotoDir = dataDir + '/vacation-photo';
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);
function saveContestEntry(contestName, email, year, month, photoPath) {

}
app.post('/vacation', function (req, res) {
    var form = new formidabled;
    form.parse(req, function (err, fields, files) {
        if (err) {
            return res.redirect(303, 'error');

        }
        if (err) {
            res.session.flash = {
                type: "danger",
                intro: "Oops",
                message: 'there was'
            }
            return res.redirect(303, '/contest/vacation-photo');
        }
        var photo =files.photo;
        var dir = vacationPhotoDir+'/'+Date.now();
        var path =dir+'/'+photo.name;
        fs.mkdirSync(dir);
        fs.mkdirSync(dir);
        fs.renameSync(photo.path,dir+'/'+photo.name);
        saveContestEntry('vacation-photo',fields.email,req.params.year,req.params.month,path);
        req.session.flash={
            type:"success",
            intro:"good luck",
            message:"you have entered into the contest"
        }
        return res.redirect(303,'/content/vacation-photo/entries');

    });
});