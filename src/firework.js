const FIREWORK_ASSETS = {
  unexploded: document.querySelector("img#firework-unexploded"),
  particle: document.querySelector("img#firework-particle"),
};

class Firework {
  constructor(
    x,
    y,
    explodeX,
    explodeY,
    speed,
    numParticles,
    numDensityIntervals,
    particleVel,
    particleMinVel,
    maxLifeTime
  ) {
    this.pos = new Vector(x, y);
    this.explodeDestination = new Vector(explodeX, explodeY);
    this.speed = speed;
    this.numParticles = numParticles;
    this.numDensityIntervals = numDensityIntervals;
    this.particleVel = particleVel;
    this.particleMinVel = particleMinVel;
    this.maxLifeTime = maxLifeTime;

    this.direction =
      (this.pos.copy().sub(this.explodeDestination).getAngle() - Math.PI / 2) %
      (Math.PI * 2);
    this.status = "travelling";
    this.oldPos = this.pos.copy();
    this.vel = Vector.ZERO.copy();
    this.particles = [];
    this.particleLifetime = 0;
  }

  #initParticles() {
    this.lastTime = Date.now();
    this.particles = new Array(this.numParticles * this.numDensityIntervals)
      .fill()
      .map(
        (_, i) =>
          new FireworkParticle(
            this.pos.copy(),
            Math.random() * ((Math.PI * 2) / this.numParticles) +
              (~~(i / this.numDensityIntervals) / this.numParticles) *
                2 *
                Math.PI,
            ((i % this.numDensityIntervals) + Math.random()) /
              this.numDensityIntervals
          )
      );
  }

  updateTravelling(dt) {
    const diff = this.explodeDestination.copy().sub(this.pos);
    const distanceToExplodeDestination = diff.getMagnitude();
    diff.setMagnitude(dt * this.speed);
    this.vel.add(diff);

    this.oldPos = this.pos.copy();
    if (
      this.vel.getSquaredMagnitude() >
      distanceToExplodeDestination * distanceToExplodeDestination
    ) {
      this.vel.setMagnitude(distanceToExplodeDestination);
    }
    this.pos.add(this.vel);

    if (this.pos.equals(this.explodeDestination)) {
      this.status = "exploding";
      this.#initParticles();
    }
  }

  drawTravelling(ctx) {
    const imgHeight = 100;
    const imgWidth =
      (FIREWORK_ASSETS.unexploded.width / FIREWORK_ASSETS.unexploded.height) *
      imgHeight;
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.direction);
    ctx.drawImage(
      FIREWORK_ASSETS.unexploded,
      -imgWidth / 2,
      -imgHeight / 2,
      imgWidth,
      imgHeight
    );
    ctx.rotate(-this.direction);
    ctx.translate(-this.pos.x, -this.pos.y);
  }

  updateExploding(dt) {
    const velPercent = 1 - this.particleLifetime / this.maxLifeTime;
    const dist =
      velPercent * (this.particleVel - this.particleMinVel) +
      this.particleMinVel;
    for (let particle of this.particles) {
      particle.addForwardScalar(dist);
    }
    const now = Date.now();
    this.particleLifetime += now - this.lastTime;
    this.lastTime = now;

    if (this.particleLifetime > this.maxLifeTime) {
      this.status = "exploded";
    }
  }

  drawExploding(ctx) {
    ctx.globalCompositeOperation = "lighten";
    for (let particle of this.particles) {
      particle.draw(ctx);
    }
    ctx.globalCompositeOperation = "source-over";
  }

  getMethodName(type) {
    return `${type}${this.status[0].toUpperCase()}${this.status.slice(1)}`;
  }

  update(dt) {
    const updateMethodName = this.getMethodName("update");
    if (this[updateMethodName]) {
      this[updateMethodName](dt);
    }
  }

  draw(ctx) {
    const drawMethodName = this.getMethodName("draw");
    if (this[drawMethodName]) {
      this[drawMethodName](ctx);
    }
  }
}
