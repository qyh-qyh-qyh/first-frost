var radius = 240;
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = 320;
var imgHeight = 470;

setTimeout(init, 1000); //1.这表示在页面加载完成后1000ms执行init函数

var odrag = document.getElementById("drag-container");
var ospin = document.getElementById("spin-container");
var aImg = ospin.getElementsByTagName("img");
var aEle = [...aImg]; //获取所有aImg的元素
var ground = document.getElementById("ground");

//设置基础属性(这些似乎是在CSS中设计的，在这设计不知道有没有用，但是根据test文件中的代码似乎证明没用)
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

//定义处理函数
function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform =
      "rotateY(" +
      i * (360 / aEle.length) +
      "deg) translateZ(" +
      radius +
      "px)"; //2.注意transform的内容和表示方式
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTranform(obj) {
  if (tY > 180) {
    tY = 180;
  }
  if (tY < 0) {
    tY = 0;
  }
  obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = yes ? "running" : "paused";
}

var sX,
  sY,
  nX,
  nY,
  desX = 0,
  desY = 0,
  tX = 0,
  tY = 10;

//做完这里还没开始自动旋转
if (autoRotate) {
  var animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
  ospin.style.animation =
    "${animationName}${Math.abs(rotateSpeed)}s infinite linear";
}

//开始事件触发
document.onpointerdown = function (e) {
  //表示文档的任何一个地方有鼠标按下事件发生时
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX,
    sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
      nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function (e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};
