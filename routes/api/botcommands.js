const router = require('express').Router();
const User = require('../../models/User');
const Command = require('../../models/Command');

// @route   GET /getuserlist
// @desc    Get an array of all the users
// @access  Public
router.get('/getcommand', (req, res) => {
    Command.findOne({command: "", channel: ""}, (err, commandRes)=>{
        if(!err) {
            if (commandRes) {
                res.json({
                    command: commandRes.command
                })
            }
        } else {
            console.log(err);
        }
    })
});

// @route   POST /newuser
// @desc    Register new user
// @access  Public
router.post('/addcommand', (req, res) => {
    const channelID = req.body.channel_id;
    const commandName = req.body.name;    
    const response = req.body.response;
    try {
        Command.findOne({command: commandName, channel: channelID}, (err, commandRes)=> {
            if (!err) {
                if (!commandRes) {
                    new Command({
                        channel_id: channelID,
                        name: commandName,
                        response: response,
                        cooldown: 5,
                        args: false,
                        mod_only: false,
                        vip_only: false
                    }).save().then(()=> {
                        res.status(200).send('Command added')
                    });
                } else {
                    res.status(404).send('Command Allready exists')
                }
            } 
        })
    } catch (error) {
        res.status(404).send('Error adding command.')
    }
});

// @route   POST /newuser
// @desc    Register new user
// @access  Public
router.post('/editcommand', (req, res) => {
    const channelID = req.body.channel_id;
    const commandName = req.body.name;    
    const response = req.body.response;
    try {
        Command.updateOne(
            {name: commandName, channel_id: channelID},
            { $set: {       
                response: response
            }},
            (err)=> {
              if(err) {}
            }
        ).then(()=> {
            res.status(200).send('Command added')
        })
    } catch (error) {
        res.status(404).send('Error editing command.')
    }
});

// @route   DELETE /enduser
// @desc    Delete user from Database
// @access  Public
router.delete('/delcommand', (req, res) => {
    const channelID = req.body.channel_id;
    const commandName = req.body.name;    
    try {
        Command.deleteOne({name: commandName, channel_id: channelID})
        .then(()=> {
            res.status(200).send('Command added')
        });
    } catch (error) {
        res.status(404).send('Error deleteing command.')
    }
});

module.exports = router;