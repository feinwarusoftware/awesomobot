// const memberInput = document.getElementById("memberInput");
// const memberList = document.getElementById("memberList");

// memberInput.onkeyup = async () => {
//   // memberList.innerText = memberList.innerText.split(new RegExp(memberInput.value, "gi")).join(`<mark>${memberInput.value}</mark>`);

//   if (memberInput.value.length < 3) {
//     console.log("less than 3 chars, ignoring");

//     memberList.innerHTML = "";
//     return;
//   }

//   // debounce(async () => {
//   //   console.log("hmmmm");

//   //   const members = fetch(`/api/vn/guilds/438701535208275978/members?query={memberInput}`)
//   //     .then(response => response.json())
//   //     .then(members => members.slice(0, 50));

//   //   memberList.innerHTML = members.map(e => `<li><a href="#">${e.user.username}</a></li>`);
//   // }, 250, false);

//   const members = await fetch(`/api/vn/guilds/438701535208275978/members?query=${memberInput.value}`)
//     .then(response => response.json())
//     .then(members => members.slice(0, 50));

//   // console.log(members[0].user.username.split(new RegExp(memberInput.value, "gi")).join("|"));

//   memberList.innerHTML = members.map(e => `<li><img src="${e.user.displayAvatarURL}" alt="ur ma"><a href="#">${e.user.username.split(new RegExp(memberInput.value, "gi")).join(`<mark>${memberInput.value}</mark>`)}${e.nickname == null ? "" : " (" + e.nickname.split(new RegExp(memberInput.value, "gi")).join(`<mark>${memberInput.value}</mark>`) + ")"}</a></li>`).join("");
// };

// function myFunction() {
//   // Declare variables
//   var input, filter, ul, li, a, i, txtValue;
//   input = document.getElementById('myInput');
//   filter = input.value.toUpperCase();
//   ul = document.getElementById("myUL");
//   li = ul.getElementsByTagName('li');

//   // Loop through all list items, and hide those who don't match the search query
//   for (i = 0; i < li.length; i++) {
//     a = li[i].getElementsByTagName("a")[0];
//     txtValue = a.textContent || a.innerText;
//     if (txtValue.toUpperCase().indexOf(filter) > -1) {
//       li[i].style.display = "";
//     } else {
//       li[i].style.display = "none";
//     }
//   }
// }

// function debounce(func, wait, immediate) {
//   var timeout;

//   return function executedFunction() {
//     var context = this;
//     var args = arguments;
	    
//     var later = function() {
//       timeout = null;
//       if (!immediate) func.apply(context, args);
//     };

//     var callNow = immediate && !timeout;
	
//     clearTimeout(timeout);

//     timeout = setTimeout(later, wait);
	
//     if (callNow) func.apply(context, args);
//   };
// };

// THE ~~GOOD~~ SOMEWHAT BETTER CODE STARTS HERE!!!

// timeout: number
// immediate: boolean
// callback: fn -> void
const debounce = (timeout, immediate, callback) => {
  let timeoutHandle;

  return function(...args) {
    const callFunc = () => {
      timeoutHandle = null;
      if (!immediate) {
        callback.apply(this, args);
      }
    };

    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(callFunc, timeout);

    if (immediate && timeout == null) {
      callback.apply(this, args);
    }
  }
}

// temp and shitty
const htmlMark = (string, highlight) => string.replace(new RegExp(highlight, "gi"), match => `<mark>${match}</mark>`);

const guildInput = document.getElementById("guildInput");
const guildList = document.getElementById("guildList");

let guilds = [];

guildInput.addEventListener("keyup", function () {
  const input = this.value;

  guildList.innerHTML = guilds.map(e => `<li>${htmlMark(e.name, input)}</li>`).join("");
});

guildInput.addEventListener("keyup", debounce(250, false, async function () {
  const input = this.value;

  if (input.length < 3) {
    return;
  }

  guilds = await fetch(`/api/vn/guilds?query=${input}&limit=20`)
    .then(response => response.json())

  guildList.innerHTML = guilds.map(e => `<li><a id=${e.id}>${htmlMark(e.name, input)}</a></li>`).join("");
  guilds.forEach(e => {
    const button = document.getElementById(e.id);

    button.addEventListener("click", async () => {
      await fetch("/api/vn/guilds/438701535208275978/channels/449656364097208352/messages/fetch?count=5000");
      // await new Promise((resolve, reject) => setTimeout(resolve, 10000));

      (async () => {
        const context = document.getElementById("discordMessageData").getContext("2d");
      
        // dont touch these plz
        const kGraphType = "line";
        const kSecondInMs = 1000;
        const kMinuteInMs = kSecondInMs * 60;
        const kHourInMs = kMinuteInMs * 60;
        const kDayInMs = kHourInMs * 24;
        const kWeekInMs = kDayInMs * 7;
      
        // rounds a timestamp down to midnight
        // takes timezones into account 
        const roundDate = timeStamp => {
          // subtract time from midnight
          timeStamp -= timeStamp % kDayInMs;
          // add timezone offset
          timeStamp += new Date().getTimezoneOffset() * kMinuteInMs;
      
          return new Date(timeStamp);
        };
      
        const addDays = (timeStamp, days) => {
          const newTimeStamp = new Date(timeStamp);
          newTimeStamp.setDate(newTimeStamp.getDate() + parseInt(days));
      
          return newTimeStamp;
        }
      
        // used for Date.getDay()
        // starts from sunday as getDay returns 0 for sunday
        const kWeekdays = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
      
        // temp: past n days
        const kDisplayDayCount = 56;
      
        // configurable (if implemented)
        // const kCurrentTimeFrame = "week";
      
        // temp - pasted from json, make this a web service
        const messageData = await fetch("/api/vn/guilds/438701535208275978/channels/449656364097208352/messages").then(response => response.json());
      
        // const i = kWeekday[(currentDay + 1) % kWeekdays.length];
        const currentWeekdayIndex = new Date().getDay();
        // math.max - dont go under 0 when accessing the array
        const wrappedReversedWeekdays = [ ...kWeekdays.slice(Math.min(currentWeekdayIndex + 1, kWeekdays.length - 1)), ...kWeekdays.slice(0, Math.min(currentWeekdayIndex + 1, kWeekdays.length - 1)) ];
      
        const messageDates = messageData.map(e => new Date(e.createdAt));
        // message date is after a week ago (e > a week ago)
        // we add an extra day (remove a day thats being taken away) as the rounding to midnight offsets that
        // TODO: idk how date operations in js work lel, i should probs find out
        const messageDatesInPastWeek = messageDates.filter(e => e > roundDate(new Date() - (kDayInMs * (kDisplayDayCount - 1))));
        //console.log(roundDate(new Date() - kWeekInMs + kDayInMs));
        //console.log(messageDatesInPastWeek);
        // the pre-init array is for convenience and code readibility purposes lel
        const messageFrequency = messageDatesInPastWeek.reduce((a, c) => { a[c.getDay()]++; return a; }, [ 0, 0, 0, 0, 0, 0, 0 ]);
        // const wrappedReversedMessageFrequency = [ ...messageFrequency.slice(currentWeekdayIndex), ...messageFrequency.slice(0, Math.max(currentWeekdayIndex - 1, 0)) ].reverse();
        const wrappedReversedMessageFrequency = [ ...messageFrequency.slice(Math.min(currentWeekdayIndex + 1, kWeekdays.length - 1)), ...messageFrequency.slice(0, Math.min(currentWeekdayIndex + 1, kWeekdays.length - 1)) ];
      
        // const labels = wrappedReversedWeekdays;
        // const datasets = [{
        //   label: "Test Dataset",
        //   backgroundColor: "rgb(255, 99, 132)",
        //   borderColor: "rgb(255, 99, 132)",
        //   data: wrappedReversedMessageFrequency,
        // }];
      
        // const chart = new Chart(context, {
        //     type: kGraphType,
        //     data: {
        //         labels,
        //         datasets,
        //     },
        // });
      
        const nDayLabels = [...new Array(kDisplayDayCount).keys()].reverse();
        const nDayData = messageDatesInPastWeek.reduce((a, c) => {
          // dont need to add an extra day to compensate for rounding as were not adding anythign to either c or date.now
          const daysSinceToday = (roundDate(new Date()) - roundDate(c)) / kDayInMs;
      
          a[daysSinceToday]++;
      
          return a;
        }, new Array(kDisplayDayCount).fill(0)).reverse();
      
        const labels = nDayLabels;
        const datasets = [{
          label: "Test Dataset",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: nDayData,
        }];
      
        const chart = new Chart(context, {
            type: kGraphType,
            data: {
                labels,
                datasets,
            },
        });
      })();
    });
  });
}));
