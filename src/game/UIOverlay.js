import * as PIXI from 'pixi.js';

const FONT = 'RetroComputer';

class UIOverlay {
    constructor(canvasWidth, name) {
        this.leaderText = new PIXI.Text(
            'Leader: ',
            UIOverlay.LeaderTextStyle
        );
        this.leaderText.anchor.set(0.5);
        this.leaderText.position.set(canvasWidth/2, 30);

        this.pingText = new PIXI.Text(
            'Ping: ',
            UIOverlay.PingTextStyle
        );
        this.pingText.anchor.set(0);
        this.pingText.position.set(7*canvasWidth/8, 30);

        this.nameText = new PIXI.Text(
            'Name: ' + name,
            UIOverlay.ScoreTextStyle
        );
        this.nameText.anchor.set(0);
        this.nameText.position.set(canvasWidth/8, 30);

        this.scoreText = new PIXI.Text(
            'Score: ',
            UIOverlay.ScoreTextStyle
        );
        this.scoreText.anchor.set(0);
        this.scoreText.position.set(canvasWidth/8, 50);

    }

    insertInto(view) {
        view.addChild(this.leaderText);
        view.addChild(this.scoreText);
        view.addChild(this.nameText);
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
    fontFamily: FONT,
    fontSize: 20,
    fill: 'white',
    align: 'center'
});

UIOverlay.ScoreTextStyle = new PIXI.TextStyle({
    fontFamily: FONT,
    fontSize: 16,
    fill: 'white',
    align: 'right'
});

UIOverlay.PingTextStyle = new PIXI.TextStyle({
    fontFamily: FONT,
    fontSize: 16,
    fill: 'white',
    align: 'right'
});

export default UIOverlay;
