const express = require('express')
const router = express.Router()
const User = require('../models/Login')
const Contact = require('../models/Contact')
const jwt = require('jsonwebtoken')
const { errorMonitor } = require('nodemailer/lib/xoauth2')
const Medical = require('../models/Medical')
const SECRET_KEY = "SIGNIN_API"
var sid = 'AC811d1c0e8893abf793565f33f5ac2446'
var auth_token = 'e6dac058303168679e89f293104ac0a2'
var twilio = require('twilio')(sid, auth_token)


router.post('/signup', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    let { name, phone, password } = req.body
    console.log(req.body)
    console.log("disp  = ", req.body)
    name = name.trim()
    password = password.trim()
    phone = phone

    if (name == "" || password == "" || phone == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        });
    }
    else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name"
        });
    }
    else if (password.length < 5) {
        res.json({
            status: "FAILED",
            message: "Password too short"
        });
    }
    else {
        //checking if user already exist
        User.find({ phone }).then(result => {
            if (result.length) {
                //user already exist
                //console.log(result)
                res.json({
                    status: "FAILED",
                    message: "User already exist",
                    result
                })
            }
            else {
                //Try to create new user


                //password handling

                const newUser = new User({
                    name,
                    password,
                    phone,
                    ear:-1,
                    c_up:0,
                    m_up:0
                });
                newUser.save().then(result => {
                    res.json({
                        status: "SUCCESS",
                        message: "Sign Up Successful",
                        data: result
                    });
                })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while signing you up"
                        });
                    })
            }

        }).catch(err => {
            console.log(err)
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user"
            })
        })
    }
})

//signin
router.post('/signin', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    let { phone, password, } = req.body

    password = password.trim()
    if (phone == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty field"
        })
    } else {
        User.find({ phone })
            .then(data => {
                if (data.length) {
                    const token = jwt.sign({
                        phone: data[0].phone,
                        id: data[0]._id
                    }, SECRET_KEY)
                    if (password == data[0].password) {
                        res.json({
                            status: "SUCCESS",
                            message: "Sign-In Successful",
                            token,
                            name: data[0].name,
                            phone: data[0].phone,
                            ear: data[0].ear,
                            c_up: data[0].c_up,
                            m_up: data[0].m_up
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid password!"
                        })
                    }


                }
                else {
                    res.json({
                        status: "FAILED",
                        message: "Invalid credentials enterred!"
                    })
                }
            })
            .catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while checking for existing user!"
                })
            })
    }
})

router.post('/update-ear', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const { phone, ear } = req.body;
    User.findOneAndUpdate({ phone }, { ear }, { new: true })
        .then(updatedUser => {
            if (updatedUser) {
                res.json({
                    status: "SUCCESS",
                    message: "User's ear value updated successfully",
                    data: updatedUser
                });
            } else {
                res.json({
                    status: "FAILED",
                    message: "User not found"
                });
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occurred while updating user's ear value"
            });
        });
});

router.post('/send-msg1', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body)
})
router.post('/send-msg', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body)
    let er;
    let toNum = req.body.phone;
    let msgbody = req.body.msgbody //"+919746423919";

    twilio.messages.create({
        from: "+15075026525",
        to: toNum,
        body: msgbody
    })

        .then((response) => {
            console.log(response, 'message has sent!');
            return res.json({
                status: "SUCCESS",
                message: "Message sent successfully",
                // response: response
            });
        })
        .catch((err) => {
            console.log(err);
            return res.json({
                status: "ERROR",
                message: "Failed to send message",
                error: err
            });
        });

})

// router.post('/contact', (req, res) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     let { phone, contact_num, contact_relation, contact_name } = req.body;
    
//     console.log("disp  = ", req.body);

//     contact_name = contact_name.trim();
//     contact_relation = contact_relation.trim();

   
//     Contact.findOne({ phone }) 
//         .then(existingContact => {
//             if (existingContact) {
                
//                 existingContact.contact_num = contact_num;
//                 existingContact.contact_relation = contact_relation;
//                 existingContact.contact_name = contact_name;

//                 existingContact.save().then(updatedContact => {
//                     res.json({
//                         status: "SUCCESS",
//                         message: "Contact details updated successfully",
//                         data: updatedContact
//                     });
//                 }).catch(err => {
//                     res.json({
//                         status: "FAILED",
//                         message: "An error occurred while updating contact details"
//                     });
//                 });
//             } else {
               
//                 const userDetails = new Contact({
//                     phone,
//                     contact_relation,
//                     contact_name,
//                     contact_num
//                 });

//                 userDetails.save().then(result => {
//                     res.json({
//                         status: "SUCCESS",
//                         message: "Contact details added successfully",
//                         data: result
//                     });
//                 }).catch(err => {
//                     res.json({
//                         status: "FAILED",
//                         message: "An error occurred while adding contact details"
//                     });
//                 });
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.json({
//                 status: "FAILED",
//                 message: "An error occurred while checking for existing user"
//             });
//         });
// });

router.post('/update-contact', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    let { phone, contact_num, contact_relation, contact_name } = req.body;
    
    console.log("disp  = ", req.body);

    contact_name = contact_name.trim();
    contact_relation = contact_relation.trim();

    Contact.findOne({ phone }) 
        .then(existingContact => {
            if (existingContact) {
                existingContact.contact_num = contact_num;
                existingContact.contact_relation = contact_relation;
                existingContact.contact_name = contact_name;

                existingContact.save().then(updatedContact => {
                    // Update c_up to 1 in the User model
                    User.findOne({ phone })
                        .then(existingUser => {
                            if (existingUser) {
                                existingUser.c_up = 1;
                                existingUser.save().then(updatedUser => {
                                    res.json({
                                        status: "SUCCESS",
                                        message: "Contact details updated successfully",
                                        data: updatedContact
                                    });
                                }).catch(err => {
                                    res.json({
                                        status: "FAILED",
                                        message: "An error occurred while updating user details"
                                    });
                                });
                            } else {
                                res.json({
                                    status: "FAILED",
                                    message: "User not found"
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while checking for existing user"
                            });
                        });
                }
                ).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while updating contact details"
                    });
                });
            } else {
                const userDetails = new Contact({
                    phone,
                    contact_relation,
                    contact_name,
                    contact_num
                });

                userDetails.save().then(result => {
                    // Update c_up to 1 in the User model
                    User.findOne({ phone })
                        .then(existingUser => {
                            if (existingUser) {
                                existingUser.c_up = 1;
                                existingUser.save().then(updatedUser => {
                                    res.json({
                                        status: "SUCCESS",
                                        message: "Contact details added successfully",
                                        data: result
                                    });
                                }).catch(err => {
                                    res.json({
                                        status: "FAILED",
                                        message: "An error occurred while updating user details"
                                    });
                                });
                            } else {
                                res.json({
                                    status: "FAILED",
                                    message: "User not found"
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while checking for existing user"
                            });
                        });
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while adding contact details"
                    });
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing contact"
            });
        });
});

router.post('/medical', (req, res) => {
    const {
        phone,
        doctorName,
        doctorNum,
        clinicName,
        bloodGroup,
        isHeartPatient,
        isDiabeticPatient,
        isBpPatient,
        allergicToMedication,
        isDialisysPatient,
        lastBloodDonation,
        otherDisease,
        regularMedication,
        surgery
    } = req.body;

    // Check if a record with the given phone number already exists
    Medical.findOne({ phone })
        .then(existingMedical => {
            if (existingMedical) {
                // If the record exists, update its fields
                existingMedical.doctorName = doctorName;
                existingMedical.doctorNum = doctorNum;
                existingMedical.clinicName = clinicName;
                existingMedical.bloodGroup = bloodGroup;
                existingMedical.isHeartPatient = isHeartPatient;
                existingMedical.isDiabeticPatient = isDiabeticPatient;
                existingMedical.isBpPatient = isBpPatient;
                existingMedical.allergicToMedication = allergicToMedication;
                existingMedical.isDialisysPatient = isDialisysPatient;
                existingMedical.lastBloodDonation = lastBloodDonation;
                existingMedical.otherDisease = otherDisease;
                existingMedical.regularMedication = regularMedication;
                existingMedical.surgery = surgery;

                // Save the updated record
                existingMedical.save()
                    .then(updatedMedical => {

                        res.json({
                            status: "SUCCESS",
                            message: "Record updated successfully",
                            data: updatedMedical
                        });
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while updating the record"
                        });
                    });
            } else {
                // If the record doesn't exist, create a new instance and save it
                const newMedical = new Medical({
                    phone,
                    doctorName,
                    doctorNum,
                    clinicName,
                    bloodGroup,
                    isHeartPatient,
                    isDiabeticPatient,
                    isBpPatient,
                    allergicToMedication,
                    isDialisysPatient,
                    lastBloodDonation,
                    otherDisease,
                    regularMedication,
                    surgery
                });

                newMedical.save()
                    .then(savedMedical => {
                        res.json({
                            status: "SUCCESS",
                            message: "Record stored successfully",
                            data: savedMedical
                        });
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while storing the record"
                        });
                    });
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing records"
            });
        });
});

router.post('/update-medical', (req, res) => {
    const {
        phone,
        doctorName,
        doctorNum,
        clinicName,
        bloodGroup,
        isHeartPatient,
        isDiabeticPatient,
        isBpPatient,
        allergicToMedication,
        isDialisysPatient,
        lastBloodDonation,
        otherDisease,
        regularMedication,
        surgery
    } = req.body;
console.log(req.body)
    // Check if a record with the given phone number already exists
    Medical.findOne({ phone })
        .then(existingMedical => {
            if (existingMedical) {
                
                existingMedical.doctorName = doctorName;
                existingMedical.doctorNum = doctorNum;
                existingMedical.clinicName = clinicName;
                existingMedical.bloodGroup = bloodGroup;
                existingMedical.isHeartPatient = isHeartPatient;
                existingMedical.isDiabeticPatient = isDiabeticPatient;
                existingMedical.isBpPatient = isBpPatient;
                existingMedical.allergicToMedication = allergicToMedication;
                existingMedical.isDialisysPatient = isDialisysPatient;
                existingMedical.lastBloodDonation = lastBloodDonation;
                existingMedical.otherDisease = otherDisease;
                existingMedical.regularMedication = regularMedication;
                existingMedical.surgery = surgery;

                // Save the updated record
                existingMedical.save()
                    .then(updatedMedical => {
                        // Update the m_up field in the User model
                        User.findOne({ phone })
                            .then(existingUser => {
                                if (existingUser) {
                                    existingUser.m_up = 1;
                                    existingUser.save()
                                        .then(updatedUser => {
                                            res.json({
                                                status: "SUCCESS",
                                                message: "Record updated successfully",
                                                data: updatedMedical
                                            });
                                        })
                                        .catch(err => {
                                            res.json({
                                                status: "FAILED",
                                                message: "An error occurred while updating the user"
                                            });
                                        });
                                } else {
                                    res.json({
                                        status: "FAILED",
                                        message: "User not found"
                                    });
                                }
                            })
                            .catch(err => {
                                res.json({
                                    status: "FAILED",
                                    message: "An error occurred while finding the user"
                                });
                            });
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while updating the record"
                        });
                    });
            } else {
                // If the record doesn't exist, create a new instance and save it
                const newMedical = new Medical({
                    phone,
                    doctorName,
                    doctorNum,
                    clinicName,
                    bloodGroup,
                    isHeartPatient,
                    isDiabeticPatient,
                    isBpPatient,
                    allergicToMedication,
                    isDialisysPatient,
                    lastBloodDonation,
                    otherDisease,
                    regularMedication,
                    surgery
                });

                newMedical.save()
                    .then(savedMedical => {
                        // Update the m_up field in the User model
                        User.findOne({ phone })
                            .then(existingUser => {
                                if (existingUser) {
                                    existingUser.m_up = 1;
                                    existingUser.save()
                                        .then(updatedUser => {
                                            res.json({
                                                status: "SUCCESS",
                                                message: "Record stored successfully",
                                                data: savedMedical
                                            });
                                        })
                                        .catch(err => {
                                            res.json({
                                                status: "FAILED",
                                                message: "An error occurred while updating the user"
                                            });
                                        });
                                } else {
                                    res.json({
                                        status: "FAILED",
                                        message: "User not found"
                                    });
                                }
                            })
                            .catch(err => {
                                res.json({
                                    status: "FAILED",
                                    message: "An error occurred while finding the user"
                                });
                            });
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while storing the record"
                        });
                    });
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing records"
            });
        });
});


router.get('/hospitals', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
  
    const hospitals = [
        {
            "name":"Varma Hospital",
            "address":"Thrippunithura, Kochi",
            "lat":9.9538917,
            "long":76.2661853,
            "dist":9700,
            "link":"https://goo.gl/maps/42VX3Eu2Ko3Kev2Z7",
            "phone":8301953675
            }
            ,
            {
            "name":"P S Mission Hospital",
            "address":"Maradu, Kochi",
            "lat":9.9538917,
            "long":76.2661853,
            "dist":11900,
            "link":"https://goo.gl/maps/JTAoaboTd1XgMPhH6",
            "phone":8301953675
            },
            
            {
            "name":"VPS LAKESHORE HOSPITAL",
            "address":"Maradu, Kochi",
            "lat":9.9538917,
            "long":76.2661853,
            "dist":15100,
            "link":"https://goo.gl/maps/8sxDJV2J2bgsQDYcA",
            "phone":8301953675
            }
            ,
            {
            "name":"Medical Trust Hospital",
            "address":"Pallimukku, Kochi",
            "lat":9.9642983,
            "long":76.2115905,
            "dist":16800,
            "link":"https://goo.gl/maps/skmMWZDtfncTsnEy8",
            "phone":8301953675
            },
            {
                "name" : " The Salvation Army EB Hospital (Varikoli Hospital)" ,
                "address" : "Thrippunithura, Varikoli" ,
                "lat":9.96297,
                "long":76.339085,
                "dist": 300 ,
                "link":"https://www.google.com/maps/dir//The+Salvation+Army+EB+Hospital+(Varikoli+Hospital),+Thrippunithura,+Varikoli,+Kerala+682308/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3b0874d8baf540df:0xbe7b4a2abaaef202?sa=X&ved=2ahUKEwi4orWd34v_AhV0SmwGHbfcA8sQ48ADegQICBAK",
                "phone":8301953675
                
                }
                ,
                {
                "name" : " Lions Hospital" ,
                "address" : "Shastammugal, Thiruvaniyoor" ,
                "lat":9648523,
                "long":76.3195514,
                "dist": 3300 ,
                "link":"https://www.google.com/maps/dir/9.9648523,76.3195514/X92R%2B8HX+Lions+Hospital,+Shastammugal,+Thiruvaniyoor,+Kerala+682305/@9.9579389,76.3212886,13z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3b0874ebeef8605d:0x863771aa0f51e734!2m2!1d76.3914697!2d9.9508513",
                "phone":8301953675
                
                }
                ,
                {
                "name" : "SD TATA Hospital" ,
                "address" : "Eruveli, Chottanikkara" ,
                "lat":9.9279682,
                "long":76.321206,
                "dist":6500,
                "link":"https://www.google.com/maps/dir//W9HR%2B5FX,+Chottanikkara+Mulanthuruthy+Rd,+Eruveli,+Chottanikkara,+Kerala+682312/@9.9279682,76.321206,12z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x3b08745c17e4ba35:0xfc5131dc1af57dc8!2m2!1d76.3912466!2d9.9279755",
                "phone":8301953675
                
                }
                
                ,{"name" : "Vijaya Kumara Menon Hospital " ,
                "address" : "Vadakkekotta, Thrippunithura" ,
                "lat":9.9527953,
                "long":76.2709119,
                "dist": 10000,
                "link":"https://www.google.com/maps/dir//X83R%2B49G,+North+Fort+Gate,+Vadakkekotta,+Thrippunithura,+Ernakulam,+Kerala+682301/@9.9527953,76.2709119,12z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x3b08736b9148a203:0x8dc846355d9e5163!2m2!1d76.3409525!2d9.9528026",
                "phone":8301953675
                
                }
    ];
  
    res.json(hospitals);
  });



  router.get('/police', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
  
    const police = [{
        "name" :" Puthencruz Police Station",
        "address":" Choondi, Puthenkurish ",
        "lat":9.9702038,
        "long" :76.3660365,
        "dist": 3600,
        "link":"https://www.google.com/maps/dir//XCCP%2B3CP,+Choondi,+Kochi-Madurai-Tondi+Point+Rd,+Puthenkurish,+Kerala+682308/@9.9702038,76.3660365,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3b087548f5512cb7:0xa935e48c9ccedd1b!2m2!1d76.4360771!2d9.9702111 ",
        "phone":917012129049
        }
      ,
        
        {
        "name" :" Thripunithura Police Station" ,
        "address" : " Kannankulangara, Thrippunithura ",
        "lat" : 9.9421366,
        "long" : 76.2804338,
        "dist" : 9100,
        "link":"https://www.google.com/search?tbs=lf:1,lf_ui:2&tbm=lcl&sxsrf=APwXEdfqMeWvPgJoDVjLkY36CPyKEqIanA:1684942328111&q=police+station+near+mits+varikoli&rflfq=1&num=10&sa=X&ved=2ahUKEwiO77uno47_AhXJSWwGHU9KCSMQjGp6BAgQEAE&biw=1536&bih=754&dpr=1.25#rlfi=hd:;si:13139610576147199969,l,CiFwb2xpY2Ugc3RhdGlvbiBuZWFyIG1pdHMgdmFyaWtvbGlIi_qH6uuAgIAIWjUQABABEAMYABgBIiFwb2xpY2Ugc3RhdGlvbiBuZWFyIG1pdHMgdmFyaWtvbGkqBggDEAAQAZIBEXBvbGljZV9kZXBhcnRtZW50qgFeEAEqEiIOcG9saWNlIHN0YXRpb24oADIfEAEiG4Zy99FrL3aRS-LkfQs9c1oqyLM2WOgoqpKErzIlEAIiIXBvbGljZSBzdGF0aW9uIG5lYXIgbWl0cyB2YXJpa29saQ;mv:[[10.0319922,76.4462413],[9.8941371,76.2616043]] ",
        "phone":917012129049
        }
        ,
        {
        "name" :"Ernakulam Town South Police Station ",
        "address": "Thevara Junction, Perumanoor ",
        "lat" :9.9501886,
        "long": 76.2225416,
        "dist":1900,
        "link":"https://www.google.com/maps/dir//X72V%2B32G,+Mahatma+Gandhi+Rd,+Thevara+Junction,+Perumanoor,+Kochi,+Kerala+682015/@9.9501886,76.2225416,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3b0872951a93811f:0x1b544f4110273404!2m2!1d76.2925804!2d9.9502061 ",
        "phone":917012129049
        }
        
        ,
        {
        "name" :" Chottanikkara Police Station",
        "address": " Chottanikkara Vandippetta Rd",
        "lat" : 9.932597,
        "long":76.3206522,
        "dist": 6000,
        "link":"https://www.google.com/maps/dir//W9MR%2B27W,+Chottanikkara+Vandippetta+Rd,+Chottanikkara,+Kerala+682312/@9.932597,76.3206522,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3b08745f70334c59:0xa33e3afc91d9ec5b!2m2!1d76.3907037!2d9.9326908",
        "phone":917012129049
        }
        ,
        {
        "name" :"Circle Inspector of Police Office ",
        "address": "Kaavum Thazhum, Choondy ",
        "lat" : 9.9699081,
        "long":76.3663094,
        "dist": 9100,
        "link":"https://www.google.com/maps/dir//Kaavum+Thazhum,+Choondy,+Ernakulam,+NH-49,+Kochi+Dhanushkodi+Road,+Puthen+Cruz,+Puthen+Cruz,+Kerala+682308/@9.9699081,76.3663094,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3b0875488b92062b:0x644e4553825644b7!2m2!1d76.4363533!2d9.9699212 ",
        "phone":917012129049
        }
        ,
        {
        "name" :"Kadavanthra Police Station",
        "address": "Kadavanthra, Kochi",
        "lat" : 9.9701961,
        "long":76.1445195,
        "dist": 1600,
        "link":"https://goo.gl/maps/6Gh6VXEdaN1ZTY2L7",
        "phone":917012129049
        }
        
        ,{"name" :"Hill Palace Police Station",
        "address": "Thripunithura,Ernakulam",
        "lat" :9.9701961,
        "long":76.1445195,
        "dist": 8600,
        "link":"https://goo.gl/maps/jfP49Fok2pCfeSRn8",
        "phone":917012129049
        }]
  
    res.json(police);
  });


module.exports = router