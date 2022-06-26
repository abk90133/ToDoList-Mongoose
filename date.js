// we have created this page to shorter our logic page i.e. app.js and can call this by calling the modules as we call express locally


module.exports = getDate;

function getDate() {
  let today = new Date();
  let currentDay = today.getDay();


  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);

    return day;

    //above all the code is for print the day on our page.


}
