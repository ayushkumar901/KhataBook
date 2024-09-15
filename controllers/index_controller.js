const userModel = require('../models/user-model');
const hisaabModel = require('../models/hisaab-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


module.exports.landingPageController = (req,res)=>{
    res.render("index",{message:req.flash(),loggedin:false});
}
module.exports.profilePageController = async (req,res)=>{
    // console.log(req.user);
    let user = req.user;
    try{
        if(!user){
            req.flash("error","something went wrong!");
            return res.redirect('/');
        }
        user = await userModel.findOne({ email: user.email }).populate('hisaab');
        // console.log(user);
       
        res.render("profile",{message:req.flash(),user});
    }
    catch(err){
        req.flash("error",err.message);
        // res.send(err.message)
        return res.redirect('/');
    }
}
module.exports.loginButtonController = async(req,res)=>{
    let {email,password} = req.body;
    try{
        // res.send("its working....")
        let user = await userModel.findOne({email});
        if(!user){
            // res.send("Please! Create an account first.");
            req.flash("error","User not found!");
            return res.redirect('/');
        }
        let result =await bcrypt.compare(password,user.password);
        if(!result){
            // res.send("You entered wrong password.")
            req.flash("error","Password is incorrect.")
            return res.redirect('/');
        }
        let token = jwt.sign({email:user.email, id:user._id}, process.env.JWT);
        res.cookie("token",token);
    
        res.redirect('/profile');
    }catch(err){
        // return res.send("somethig went wrong");
        req.flash("error",err.message);
        return res.redirect('/');
    }
}
module.exports.singnUpButtonController = async(req,res)=>{
    let {email,username,password,name} = req.body;

    try{
        let user = await userModel.findOne({email});
        if(user){
            // res.send("You are already signed up");
            req.flash("error","You are already signed up")
            return res.redirect('/');
        }
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password,salt);
        
        user = await userModel.create({
            email,
            username,
            name,
            password:hash
        })
        let token = jwt.sign({email:user.email, id:user._id}, process.env.JWT);
        res.cookie("token",token);
        res.redirect('/profile');
    }catch(err){
        req.flash("error",err.message);
        return res.redirect('/');
    }
}
module.exports.logoutButtonController = async (req,res)=>{
    res.cookie("token","");
    req.flash("error","You are logged Out successfully. Please visit us again.")
    res.redirect('/');
}
module.exports.renderNewHisaabController = async (req,res)=>{
    res.render("create",{message:req.flash()});
}
module.exports.createNewHisaabController = async (req,res)=>{
    let {title,description,encrypted,shareable,passcode,editPermission} = req.body;
    // let user = req.body;

    encrypted=typeof(encrypted)=="undefined"?false:true;
    shareable = typeof(shareable)=="undefined"?false:true;
    editPermission = typeof(editPermission)=="undefined"?false:true;
    
    try{
        let newHisaab;

        if(!title || !description){
            req.flash("error", "All fields are required!");
            return res.redirect('/hisaab/create'); 
        }
        if(passcode){
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(passcode,salt);
            newHisaab = await hisaabModel.create({
                user:req.user.id,
                title,
                description,
                encrypted,
                shareable,
                passcode:hash,
                editPermission
            })
            // console.log(newHisaab);
            let user = await userModel.findOne({email:req.user.email});
            user.hisaab.push(newHisaab._id);
            user.save();

            req.flash("success", "New Hisaab created successfully!"); 
            return res.redirect('/profile');
        }
        newHisaab = await hisaabModel.create({
            user:req.user.id,
            title,
            description,
            encrypted,
            shareable,
            passcode:"",
            editPermission
        })
        // console.log(newHisaab);
        let user = await userModel.findOne({email:req.user.email});
        user.hisaab.push(newHisaab._id);
        user.save();
        req.flash("success", "New Hisaab created successfully!"); 
        return res.redirect('/profile');
    }catch(err){
        req.flash("error",err.message);
        console.log(err.message)
        return res.redirect('/hisaab/create');
    }
}
module.exports.renderHisaabController = async (req,res)=>{
    const id = req.params.id;
    try{
        if(!id){
            req.flash("error","Hisaab not found!");
            console.log("Hisaab not found!");
            res.redirect('/profile');
        }
        const hisaab = await hisaabModel.findOne({_id:id});
        // console.log(hisaab.encrypted);
        if(hisaab.encrypted){
            return res.render("passcode",{message:req.flash(),id:hisaab._id})
        }
        
        res.render('hisaab',{hisaab});

    }catch(err){
        req.flash("error",err.message);
        console.log(err);
        res.redirect('/profile');
    }
}
module.exports.deleteController = async (req,res)=>{
    const id = req.params.id;
    let user = req.user;
    // console.log(id);
    try{
        const hisaab = await hisaabModel.findOne({_id:id,user:req.user.id});
        user = await userModel.findOne({email:user.email});
        
        if(!hisaab || !user){
            return res.redirect('/profile');
        }
        // Use the `pull` method to remove a specific hisaab by its ID
        user.hisaab.pull(hisaab._id); // Deleting specific hisaab from user
        await user.save(); // Save the updated user document
        await hisaabModel.deleteOne({_id:id}); // Deleting hisaab from hisaabModel
        
        // req.flash('success', 'Hisaab deleted successfully!'); // why my flash is not working properly
        return res.redirect('/profile');
    }catch(err){
        req.flash("error",err.message);
        console.log(err.message);
        res.redirect('/profile');
    }
}
module.exports.renderEditController = async (req,res)=>{
    const id = req.params.id;
    console.log(id)
    try{
        const newHisaab = await hisaabModel.findOne({_id:id});
        if(!id){
            console.log("no hisaab found!");
            res.redirect('/profile');
        }
        res.render("edit",{message:req.flash(),newHisaab});
    }catch(err){
        console.log(err.message);
        res.redirect('/profile');
    }
}
module.exports.editController = async (req,res)=>{
    // res.send("it's working...")
    const id = req.params.id;
    
    let {title,description,shareable,editPermission} = req.body;

    // console.log(id, title,description,shareable,editPermission);
    // let user = req.user;
    shareable = typeof(shareable)=="undefined"?false:true;
    editPermission = typeof(editPermission)=="undefined"?false:true;
    try{
        let updatedHisaab = await hisaabModel.findOneAndUpdate(
            {  _id: id}, 
            { 
                title, 
                description, 
                shareable, 
                editPermission 
            },
            { new: true } 
        );    
        // user = await userModel.findOne({email:user.email});
        // console.log(updatedHisaab);
        // console.log(user);

        res.redirect('/profile');
    }catch(err){
        console.log(err.message)
        res.redirect('/profile')
    }
}
module.exports.passcodeController = async (req,res)=>{
    const id = req.params.id;
    const {passcode} = req.body;
    // console.log(id);
    try{
        let hisaab = await hisaabModel.findOne({_id:id});
        console.log(hisaab);
        if(!hisaab){
            req.flash("error", "Something went wrong!");
            return res.redirect(`/profile`);
        }
        let result = await bcrypt.compare(passcode,hisaab.passcode);

        if(!result){
            req.flash("error", "Incorrect passcode!");
            return res.redirect(`/profile`);
        }
        res.render('hisaab',{message:req.flash(),hisaab});
    }catch(err){
        console.log(err.message)
        res.redirect('/profile');
    }
}