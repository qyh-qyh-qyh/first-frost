var radius = 240;
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = 320;
var imgHeight = 470;

setTimeout(init, 1000); //1.���ʾ��ҳ�������ɺ�1000msִ��init����

var odrag = document.getElementById("drag-container");
var ospin = document.getElementById("spin-container");
var aImg = ospin.getElementsByTagName("img");
var aEle = [...aImg]; //��ȡ����aImg��Ԫ��
var ground = document.getElementById("ground");

//���û�������(��Щ�ƺ�����CSS����Ƶģ�������Ʋ�֪����û���ã����Ǹ���test�ļ��еĴ����ƺ�֤��û��)
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

//���崦����
function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform =
      "rotateY(" +
      i * (360 / aEle.length) +
      "deg) translateZ(" +
      radius +
      "px)"; //2.ע��transform�����ݺͱ�ʾ��ʽ
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

//�������ﻹû��ʼ�Զ���ת
if (autoRotate) {
  var animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
  ospin.style.animation =
    "${animationName}${Math.abs(rotateSpeed)}s infinite linear";
}

//��ʼ�¼�����
document.onpointerdown = function (e) {
  //��ʾ�ĵ����κ�һ���ط�����갴���¼�����ʱ
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
