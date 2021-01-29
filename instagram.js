const puppeteer = require("puppeteer");

const BASE_URL = "https://www.instagram.com";
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`;

const instagram = {
  browser: null,
  page: null,

  initialize: async () => {
    instagram.browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--single-process",
        "--no-zygote",
      ],
    });

    instagram.page = await instagram.browser.newPage();

    await instagram.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
    );
  },

  login: async (username, password) => {
    await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });

    await instagram.page.waitForTimeout(1000);

    // writing the username and password

    await instagram.page.waitForSelector('input[name="username"]');
    await instagram.page.type('input[name="username"]', username, {
      delay: 50,
    });

    await instagram.page.waitForSelector('input[name="password"]');

    await instagram.page.type('input[name="password"]', password, {
      delay: 50,
    });

    console.log("username and password typed");

    // let loginButton = await instagram.page.$x(
    //   '//button//div[contains(text(), "Log In")]'
    // );

    // await loginButton[0].click();
    await instagram.page.click("#loginForm > div > div:nth-child(3) > button");

    await instagram.page.waitForNavigation({ waitUntil: "networkidle2" });

    console.log("logged in");
    await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });

    // let modal = await instagram.page.$("body > div.RnEpo.Yx5HN");
    // await instagram.page.waitForSelector(modal);

    // await instagram.page.click(
    //   "body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm"
    // );


    // clicks not now button
    // await instagram.page.evaluate(() => {
    //   document
    //     .querySelector(
    //       "#react-root > section > main > div > div > div > div > button"
    //     )
    //     .click();
    // });

    await instagram.page.waitForTimeout(3000);

    // await instagram.page.waitForSelector(
    //   "#react-root > section > main > div > div > div > div > button"
    // );

    // await instagram.page.click(
    //   "#react-root > section > main > div > div > div > div > button"
    // );
    await instagram.page.click(
      "body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm"
    );

    console.log("closed modal");

    // await instagram.page.waitForNavigation({ waitUntil: "networkidle2" });

    //goes to user profile

    // await instagram.page.waitForSelector('span[role="link"]');
    // await instagram.page.evaluate(() => {
    //  document
    //    .querySelector(
    //      "#react-root > section > nav > div._8MQSO.Cx7Bp > div > div > div.ctQZg > div > div:nth-child(5) > span"
    //    )
    //    .click();
    // });

    // await instagram.page.waitForTimeout(3000);

    // await instagram.page.evaluate(() => {
    //   document
    //     .querySelector(
    //       "#react-root > section > nav > div._8MQSO.Cx7Bp > div > div > div.ctQZg > div > div:nth-child(5) > div.poA5q > div.uo5MA._2ciX.tWgj8.XWrBI > div._01UL2 > a:nth-child(1)"
    //     )
    //     .click();
    // });

    // await instagram.page.waitForNavigation({ waitUntil: "networkidle2" })
  },

  likeTagsProcess: async (tags = [], likeNum = [], comments = []) => {
    let commentsLength = comments.length;
    for (let tag of tags) {
      var i = 0;
      // nav tag page
      await instagram.page.goto(TAG_URL(tag), { waitUntil: "networkidle2" });
      await instagram.page.waitForTimeout(3000);

      let posts = await instagram.page.$$(
        'article > div:nth-child(3) img[decoding="auto"]'
      );

      await instagram.page.waitForTimeout(5000);

      for (let x = 0; x < likeNum[i]; x++) {
        let post = posts[x];

        await post.click();

        await instagram.page.waitForSelector('div[role="dialog"]');
        await instagram.page.waitForTimeout(3000);

        let isLikable = await instagram.page.$(
          'button[type="button"] > div > span > svg[aria-label="Like"]'
        );

        if (isLikable) {
          await instagram.page.click('section > span > button[type="button"]');

          var willComment = randomIntInc(0, 1);
          console.log(willComment);
          if (willComment === 1) {
            let comment = comments[randomIntInc(0, commentsLength - 1)];
            let commentBox = await instagram.page.$("form > textarea");
            if (commentBox) {
              await instagram.page.type("form > textarea", comment, {
                delay: 50,
              });
              await instagram.page.waitForTimeout(randomIntInc(2, 4) * 1000);

              let post = await instagram.page.$("form > button[type='submit']");
              post.click();
            }
          }
        }

        await instagram.page.waitForTimeout(2000);

        let closeButton = await instagram.page.$(
          'div[role="dialog"] > div > button[type="button"]'
        );

        await closeButton.click();

        await instagram.page.waitForTimeout(2000);
      }

      await instagram.page.waitForTimeout(20000);
      i++;
    }
  },
  likeAndCommentInFeed: async (comments = []) => {
    await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });

    const commentsLength = comments.length;

    let iterationNum = randomIntInc(2, 5);
    console.log("Iteration Number: " + iterationNum);

    for (var i = 0; i < iterationNum; i++) {
      await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });
      let posts = await instagram.page.$$("article");

      await instagram.page.waitForTimeout(5000);

      for (var x = 0; x < posts.length; x++) {
        await instagram.page.waitForTimeout(randomIntInc(1, 3) * 1000);

        let isLikable = await instagram.page.$(
          `article:nth-child(${
            x + 1
          }) > div > section > span > button > div > span > svg[aria-label='Like']`
        );

        var willLike = randomIntInc(0, 2);
        console.log("Will like: " + willLike);

        if (isLikable && willLike !== 0) {
          console.log("this is likeable");
          await instagram.page.waitForTimeout(1000);
          await isLikable.click();
          await instagram.page.waitForTimeout(3000);
          var willComment = randomIntInc(0, 1);
          console.log("Will comment: " + willComment);
          if (willComment === 1) {
            let comment = comments[randomIntInc(0, commentsLength - 1)];
            await instagram.page.type(
              `article:nth-child(${
                x + 1
              }) > div > section > div > form > textarea`,
              comment,
              {
                delay: 50,
              }
            );
            await instagram.page.waitForTimeout(randomIntInc(2, 4) * 1000);

            let post = await instagram.page.$(
              `article:nth-child(${
                x + 1
              }) > div > section > div > form > button[type='submit']`
            );
            post.click();
          }
        }
        await instagram.page.waitForTimeout(randomIntInc(3, 6) * 1000);
      }
    }
  },
  viewStories: async () => {
    await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });
    let story = await instagram.page.$("li > div > button");
    await instagram.page.waitForTimeout(2000);
    story.click();
    console.log("Here");
    await instagram.page.waitForSelector('div[role="dialog"]');
    for (var x = 0; x < 50; x++) {
      let rightArrow = await instagram.page.$(
        "button > div.coreSpriteRightChevron"
      );
      if (rightArrow) {
        rightArrow.click();
      }
      await instagram.page.waitForTimeout(2000);
    }
  },
};

function randomIntInc(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// await instagram.page.evaluate(() => {
//   var timesRun = 0;
//   var scroll = setInterval(() => {
//     timesRun += 1;
//     if (timesRun === 3) {
//       clearInterval(scroll);
//     }
//     window.scrollBy(0, window.innerHeight);
//   }, 2000);
// });
// await instagram.page.waitForTimeout(20000);

module.exports = instagram;
