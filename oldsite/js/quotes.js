window.addEventListener('load', function() {
  textOfToday();
});

function textOfToday() {

  var textOfTodayArray =
  ['"I understand it\'s available … from various file-sharing things and, y\'know, feel free to give it to people who will like it and feel obliged to guard it from people who won\'t.\"\n \t\t- Daniel Kitson, 28th February, 2006',
  '"I think everyone\'s probably in their houses, listening and recording and bootlegging and shit. It\'s some pretty seminal shit\"\n \t\t- Daniel Kitson, 28th February, 2006',
  '"If you\'re listening to this and it\'s not twenty-to-two in the morning, then fuck you. I think that\'s fair, right? And that includes time differences and people who record it.\"\n \t\t- Daniel Kitson, 2016', 
  '"There\'s basically about twelve people listening. If that. And some people—some full-on dweebs—like to record it and ferry it around the internet. Absolutely fucking pathetic. No offense, guys.\"\n \t\t- Daniel Kitson, 9th October, 2016',
  '"I quite like it; I think it\'s like when you were little and you\'d tape a song off the radio.\"\n \t\t- Daniel Kitson, 28th August, 2020'//,
  //'Daniel: They use stuff on the internet. They record them and then they share them around on forums.<br>Isy: Do they?<br>Daniel: Well, they did used to, but I\'ve stopped checking.<br>Isy: Why?<br>Daniel: Well, I don\'t care, really.<br>&nbsp;&nbsp;&nbsp;&nbsp;- Daniel Kitson, 28th August, 2020'
  ];

  document.getElementById('quote').innerHTML = textOfTodayArray[Math.floor(Math.random() * textOfTodayArray.length)];
}