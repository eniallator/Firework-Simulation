class FireworkParticle {
  constructor(pos, angle, speed) {
    this.pos = pos;
    this.direction = Vector.ONE.copy().setAngle(angle);
    this.speed = speed;
    this.vel = Vector.ZERO.copy();
    this.angle = angle;
  }

  addForwardScalar(scalar) {
    this.direction.setMagnitude(scalar * this.speed);
    this.pos.add(this.direction);
  }

  draw(ctx) {
    const particleDim = 50;
    // ctx.fillStyle = `hsl(${(this.angle / (2 * Math.PI)) * 360}, 100%, 50%)`;
    // ctx.fillRect(
    //   this.pos.x - imgWidth / 2,
    //   this.pos.y - imgHeight / 2,
    //   imgWidth,
    //   imgHeight
    // );
    // ctx.globalCompositeOperation = "destination-in";
    // ctx.fillStyle = "black";
    // ctx.drawImage(
    //   FIREWORK_ASSETS.particle,
    //   this.pos.x - imgWidth / 2,
    //   this.pos.y - imgHeight / 2,
    //   imgWidth,
    //   imgHeight
    // );
    // ctx.globalCompositeOperation = "source-over";
    const gradient = ctx.createRadialGradient(
      this.pos.x,
      this.pos.y,
      0,
      this.pos.x,
      this.pos.y,
      particleDim / 2
    );
    gradient.addColorStop(
      0,
      `hsl(${(this.angle / (2 * Math.PI)) * 360}, 100%, 50%)`
    );
    gradient.addColorStop(1, "black");
    ctx.fillStyle = gradient;
    ctx.fillRect(
      this.pos.x - particleDim / 2,
      this.pos.y - particleDim / 2,
      particleDim,
      particleDim
    );
  }
}
