const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const paramConfig = new ParamConfig(
  "./config.json",
  window.location.search,
  $("#cfg-outer")
);
paramConfig.addCopyToClipboardHandler("#share-btn");

window.onresize = (evt) => {
  canvas.width = $("#canvas").width();
  canvas.height = $("#canvas").height();
};
window.onresize();

const fireworks = [];
const newFirework = (x, y) =>
  new Firework(x, y, x, canvas.height / 4, 0.004, 20, 10, 17, 5, 600);

const mouse = {
  down: false,
  clicked: false,
  pos: { x: 0, y: 0 },
};
canvas.onmousemove = (ev) => {
  [mouse.pos.x, mouse.pos.y] = [ev.clientX, ev.clientY];
};
canvas.ontouchmove = (ev) => {
  [mouse.pos.x, mouse.pos.y] = [ev.touches[0].clientX, ev.touches[0].clientY];
};
canvas.onmousedown = canvas.ontouchstart = (ev) => {
  mouse.clicked = mouse.down === false;
  mouse.down = true;
  if (!isNaN(ev.clientX) && !isNaN(ev.clientY)) {
    [mouse.pos.x, mouse.pos.y] = [ev.clientX, ev.clientY];
  }
};
canvas.onmouseup = canvas.ontouchend = () => {
  mouse.clicked = false;
  mouse.down = false;
};

ctx.fillStyle = "black";
ctx.strokeStyle = "white";

fireworks.push(newFirework(canvas.width / 2, canvas.height));

function update(dt) {
  if (mouse.clicked) {
    fireworks.push(newFirework(mouse.pos.x, mouse.pos.y));
    mouse.clicked = false;
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    const firework = fireworks[i];
    firework.update(dt);
    if (firework.status === "exploded") {
      fireworks.splice(i, 1);
    }
  }
}

function draw(ctx) {
  this.fillStyle = "white";
  for (let firework of fireworks) {
    firework.draw(ctx);
  }
  this.fillStyle = "black";
}

let lastTime = Date.now();
function run() {
  const currTime = Date.now();
  const dt = currTime - lastTime;
  lastTime = currTime;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  update(dt);
  draw(ctx);

  requestAnimationFrame(run);
}

paramConfig.onLoad(run);
