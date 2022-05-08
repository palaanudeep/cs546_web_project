const {
  prepareAppointments
} = require("../helpers/apptmnt_helper");
const {
  getAppointment,
  getPatAppointments
} = require("../models/appointments");
const {
  getUser
} = require("../models/users");

const router = require("express").Router();



router.get('/apptmnts/:id', async (req, res) => {
  if (!req.session.doctor) {
    res.redirect("/doctor/login");
  } else {
    const apptmntId = req.params.id;
    const apptmnt = await getAppointment(apptmntId);
    const patApptmnts = await getPatAppointments(apptmnt.doctor_id, apptmnt.user_id, apptmnt.patient_name);
    prepareAppointments(patApptmnts);
    res.json({
      patApptmnts
    });
  }
});

router.get('/:id', async (req, res) => {
  if (!req.session.doctor) {
    res.redirect("/doctor/login");
  } else {
    const apptmntId = req.params.id;
    const apptmnt = await getAppointment(apptmntId);
    const user = await getUser(apptmnt.user_id);
    prepareAppointments([apptmnt], [{
      account_name: `${user.firstname} ${user.lastname}`
    }]);
    res.render("pages/patient", {
      script_file: "patient",
      title: "Patient",
      apptmnt
    });
  }
});


module.exports = router;