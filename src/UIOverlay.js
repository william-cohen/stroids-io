'use strict';

class UIOverlay {
    constructor(canvasWidth, canvasHeight, mobile) {
        this.leaderText = new PIXI.Text(
            'Leader: ',
            UIOverlay.LeaderTextStyle
        );
        this.leaderText.anchor.set(0.5);
        this.leaderText.position.set(canvasWidth/2, 20);

        this.pingText = new PIXI.Text(
            'Ping: ',
            UIOverlay.PingTextStyle
        );
        this.pingText.anchor.set(0.5);
        this.pingText.position.set(canvasWidth/8, 10);

        this.scoreText = new PIXI.Text(
            'Score: ',
            UIOverlay.ScoreTextStyle
        );
        this.scoreText.anchor.set(0.5);
        this.scoreText.position.set(7*canvasWidth/8, 10);

    }

    insertInto(view) {
        view.addChild(this.leaderText);
        view.addChild(this.scoreText);
        view.addChild(this.pingText);
    }

    setLeaderText(text) {
        this.leaderText.text = text;
    }

    setPing(ping) {
        this.pingText.text = 'Ping: ' + ping;
    }

    setScore(score) {
        this.scoreText.text = 'Score: ' + score;
    }

    notifyOfDeath() {
        this.leaderText.text = 'You have died :(';
    }
}

UIOverlay.LeaderTextStyle = new PIXI.TextStyle({
    fontFamily: 'Press Start 2P',
    fontSize: 16,
    fill: 'white',
    align: 'center'
});

UIOverlay.ScoreTextStyle = new PIXI.TextStyle({
    fontFamily: 'Press Start 2P',
    fontSize: 11,
    fill: 'white',
    align: 'left'
});

UIOverlay.PingTextStyle = new PIXI.TextStyle({
    fontFamily: 'Press Start 2P',
    fontSize: 11,
    fill: 'white',
    align: 'right'
});

module.exports = UIOverlay;
