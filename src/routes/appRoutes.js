require("dotenv").config();

var multer = require('multer')
const sharp = require("sharp");
const https = require('https')
const superagent = require("superagent");
const _ = require("lodash");
const string = require("lodash/string");
const express = require("express");
const router = new express.Router();


const welcomeStartingContent =
    "Find information regarding some of the latest and greatest GNU/Linux Distributions. Join the world of Free and Open Source Software by finding the perfect GNU/Linux Distribution best suites for your needs.";
const defineNewDistroContent =
    "You can now define a GNU/Linux distribution here that's not defined yet by filling out the correct information in the below form. Keep in mind that this information will be first verified by admin and then posted.";

const aboutContent =
    "GNU/Linux Distributions are various flavors of GNU/Linux Operating System. Each GNU/Linux Distribution has its own or inherited package manager, desktop environment, release type, backed community and various tools. Through this website you can find the perfect GNU/Linux distribution for your requirements.";

const url = 'http://lde-main.herokuapp.com/distros';
let distros = [];

function updateDistrosList() {
    superagent
        .get(url)
        .then((res) => {
            distros = res.body;
        })
        .catch((err) => {
            console.log(err);
        });
}
updateDistrosList();

router.get("/", async (req, res) => {
    updateDistrosList();
    res.render("home", {
        welcomeStartingContent,
        distros
    });
});
router.get("/about", (req, res) => {
    res.render("about", {
        aboutContent
    });
});

router.get("/viewDistro/:distroName", (req, res) => {
    updateDistrosList();
    distros.forEach((distro) => {
        if (req.params.distroName === distro.name) {
            res.render("viewDistro", {
                distro
            });
        }
    });
});

router.post("/searchDistro", (req, res) => {
    updateDistrosList();
    const userInput = _.lowerCase(req.body.distroName);


    distros.forEach(distro => {
        if (userInput === _.lowerCase(distro.name)) {
            return res.render("viewDistro", {
                distro
            });
        }
    });

    res.render("distroNotFound")

});

router.get("/defineDistro", (req, res) => {
    res.render("defineDistro", {
        defineNewDistroContent
    });
});

const upload = multer({
    limits: {
        fileSize: 2000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg|svg)$/)) {
            return cb(new Error("Please upload an image"));
        }
        cb(undefined, true); //means go ahead and accept the given upload
    },
});

router.post("/postData", upload.any('photos'), async (req, resp) => {

    console.log('data send here')
    // console.log(req.body)
    // console.log(req.files)

    let distroLogo = await sharp(req.files[0].buffer)
        .resize(400)
        .png()
        .toBuffer();

    req.body.logo = distroLogo

    const roundedCorners = Buffer.from(
        '<svg><rect x="0" y="0" width="200" height="200" rx="100" ry="100"/></svg>'
    );


    if (req.files[1] === undefined) {
        req.files[1] = "images/default-user"
        let userPicture = await sharp(req.files[1])
            .resize(200, 200)
            .composite([{
                input: roundedCorners,
                blend: 'dest-in'
            }])
            .png()
            .toBuffer();
        req.body.userProfilePicture = userPicture
    } else {
        let userPicture = await sharp(req.files[1].buffer)
            .resize(200, 200)
            .composite([{
                input: roundedCorners,
                blend: 'dest-in'
            }])
            .png()
            .toBuffer();
        req.body.userProfilePicture = userPicture
    }


    const data = JSON.stringify(req.body)

    let link = process.env.URL_NEW
    const options = {
        hostname: link,
        port: 443,
        path: '/distros',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const request = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)

        if (res.statusCode === 200 || res.statusCode === 201) {
            return resp.render('statusPage', {
                message: '👍 Data submitted for approval!'
            })
        }
        resp.render('statusPage', {
            message: "👎 Error occurred while submitting data! Make sure you haven't used a previously used distribution name"
        })
        request.on('data', (d) => {
            process.stdout.write(d)
        })
    })

    request.on('error', (error) => {
        console.error(error)
    })

    request.write(data)
    request.end()


}), (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
}

router.get('*', (req, res) => {
    res.render('404page')
})


module.exports = router;