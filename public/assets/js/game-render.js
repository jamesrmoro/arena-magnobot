function render() {
    stage.removeAllChildren();

    const bg = new createjs.Shape();
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            bg.graphics.beginFill((x + y) % 2 === 0 ? "#4a5d44" : "#577C51")
                .drawRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
    stage.addChild(bg);

    if (box) {
        const b = new createjs.Bitmap(boxImg);
        b.regX = boxImg.width / 2;
        b.regY = boxImg.height / 2;
        b.x = box.x * tileSize + tileSize / 2;
        b.y = box.y * tileSize + tileSize / 2;
        if (isMobile) {
            b.scaleX = tileSize / boxImg.width;
            b.scaleY = tileSize / boxImg.height;
        }
        stage.addChild(b);
    }

    if (ghost) {
        const g = new createjs.Bitmap(ghostImg);
        g.regX = ghostImg.width / 2;
        g.regY = ghostImg.height / 2;
        g.x = ghost.x * tileSize + tileSize / 2;
        g.y = ghost.y * tileSize + tileSize / 2;
        if (isMobile) {
            g.scaleX = tileSize / ghostImg.width;
            g.scaleY = tileSize / ghostImg.height;
        }
        stage.addChild(g);
    }

    if (powerUp) {
        const p = new createjs.Bitmap(powerUp.img);
        p.regX = powerUp.img.width / 2;
        p.regY = powerUp.img.height / 2;
        p.x = powerUp.x * tileSize + tileSize / 2;
        p.y = powerUp.y * tileSize + tileSize / 2;
        if (isMobile) {
            p.scaleX = tileSize / powerUp.img.width;
            p.scaleY = tileSize / powerUp.img.height;
        }
        stage.addChild(p);
    }

    snake.forEach((part, i) => {
        let img;
        if (i === 0) {
            if (robotState === "active1") img = robotActive1Img;
            else if (robotState === "active2") img = robotActive2Img;
            else img = robotImg;
        } else {
            img = boxImg;
        }

        const spr = new createjs.Bitmap(img);
        spr.regX = img.width / 2;
        spr.regY = img.height / 2;
        spr.x = part.x * tileSize + tileSize / 2;
        spr.y = part.y * tileSize + tileSize / 2;
        if (isMobile) {
            spr.scaleX = tileSize / img.width;
            spr.scaleY = tileSize / img.height;
        }
        if (i === 0) {
            spr.rotation = {
                right: 0,
                down: 90,
                left: 180,
                up: -90
            } [direction] || 0;
        }
        stage.addChild(spr);
    });

    stage.update();
}