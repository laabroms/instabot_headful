const ig = require('./instagram');

function randomIntInc(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


const tags = ['photography', 'photooftheday', 'photo', 'likeforlikes', 'instadaily'];

const comments = [
      "sick shot🔥",
      "great shot🔥",
      "so cool😍",
      "amazing🤩",
      "awesome🤙",
      "love it",
      "🔥🔥🔥",
      "😍😍",
      "beautiful😍",
    ];
const commentsLength = comments.length;

// generates an array of random numbers to like that many pics of a hashtag
const likeCount = [];
for (var x = 0; x < tags.length; x++) {
    likeCount.push(randomIntInc(1, 8));
}




(async () => {
  await ig.initialize();

  await ig.login("USERNAME", "PASSWORD");

  // await ig.likeTagsProcess(tags, likeCount, comments);


  // await ig.likeAndCommentInFeed(comments);

  await ig.viewStories();

  ig.browser.close();
})(); 