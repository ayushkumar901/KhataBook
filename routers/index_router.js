const express = require('express');
const passport = require('passport');
const router = express.Router();
const {landingPageController,profilePageController,singnUpButtonController,loginButtonController,
    logoutButtonController,renderNewHisaabController,createNewHisaabController,renderHisaabController,deleteController,renderEditController,editController,passcodeController} = 
require('../controllers/index_controller');

const {isloggedin,redirectIfLoggedin} = require('../middlewares/auth-middleware');

router.get('/',redirectIfLoggedin,landingPageController);
router.get('/profile',isloggedin,profilePageController);
router.get('/logout',logoutButtonController);
router.get('/hisaab/create',isloggedin,renderNewHisaabController);
router.get('/hisaab/view/:id',isloggedin,renderHisaabController);
router.get('/hisaab/delete/:id',isloggedin,deleteController);
router.get('/hisaab/edit/:id',isloggedin,renderEditController);


router.post('/register',singnUpButtonController);
router.post('/login',loginButtonController);
router.post('/hisaab/create',isloggedin,createNewHisaabController);
router.post('/hisaab/edit/:id',isloggedin,editController)
router.post('/hisaab/:id/verify',isloggedin,passcodeController);


module.exports = router;
