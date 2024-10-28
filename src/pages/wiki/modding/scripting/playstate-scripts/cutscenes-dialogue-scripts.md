---
author: Nex_isDumb
desc: This page explains how to use Cutscenes/Dialogue Scripts in your mod!
lastUpdated: 2024-10-14T16:36:06.142Z
title: Cutscenes/Dialogue Scripts
---
# Cutscenes/Dialogue Scripts

Cutscenes/Dialogue Scripts make Scripted Cutscenes/Dialogues possible!<br>
It is highly suggested to take a look at the <a href="../../cutscenes-dialogues.md">Cutscenes and Dialogues</a> page before starting here!

For the both of them: you can start them manually with also with custom prefix through other scripts using the ``startCutscene`` PlayState function or other ways that will be said down below.<br>
For more advanced users: if you even want to avoid using the ``startCutscene`` function you can play with classes like <syntax lang="haxe">VideoCutscene</syntax>, <syntax lang="haxe">ScriptedCutscene</syntax> and etc; check the source code!<br>

## <h2 id="cutscenes">Cutscenes</h2>

You can automatically start a scripted cutscene by placing the script in ``./song/YOUR SONG/cutscene.hx``.

The cutscenes code is rather simple to recreate, you can find the most simple examples in Tankman's songs and a bit of advanced ones inside Roses and Thorns: if you checked Roses you can also understand that the game automatically detects for scripts that are named as ``end-cutscene.hx`` like with any other cutscenes as it was already said in <a href="../../cutscenes-dialogues.md">Cutscenes and Dialogues</a>.

The parent of the script is the Scripted Cutscene's instance itself (the class is named <syntax lang="haxe">ScriptedCutscene</syntax>) which is a substate.<br>
The code has SOME functions that can be found in the substates behaviour referenced in the <a href="../script-calls.md">All of the script calls</a> page, such as ``create``, ``destroy``, ``stepHit`` and more.<br>
*(I'd recommend to actually mainly use ``destroy`` to for example destroy some eventual sprites, stop some eventual timers or such as the cutscene COULD get skipped and so end/finish prematurely)*

Important functions to use when coding the scripted cutscene:
- <syntax lang="haxe">close();</syntax> - Closes the scripted cutscene.
- <syntax lang="haxe">startVideo(path:String, ?callback:Void->Void);</syntax> - Starts a Video Cutscene and uses an optional ``callback`` whenever it ended. You can check if it's done through the boolean variable ``isVideoPlaying``.
- <syntax lang="haxe">startDialogue(path:String, ?callback:Void->Void);</syntax> - Starts a Dialogue Cutscene and uses an optional ``callback`` whenever it ended. You can check if it's done through the boolean variable ``isDialoguePlaying``.

## <h2 id="dialogues">Dialogues</h2>

*Before starting: you can check every calls (for characters and boxes aswell) in the <a href="../script-calls.md">All of the script calls</a> page!*

Dialogue Scripts behave differently than Scripted Cutscenes: the main difference is that they get initialized when a dialogue cutscene also gets started.<br>
To start one you must place a script with the same name of the dialogue's xml file (just with different extensions obliviously).

The parent of the script is the Dialogue Cutscene's instance itself (the class is named <syntax lang="haxe">DialogueCutscene</syntax>, you can also check every useable variable and function in there!) which is a substate.<br>
By default once the Dialogue Cutscene substate opens, it temporarily pauses already existing timers, tweens and such; mess with the parentDisabler variable (uses the <syntax lang="haxe">FunkinParentDisabler</syntax> class) in the script if you want them to behave differently!

A *kinda* advanced example of scripted dialogue can be found in the Week 6 Roses song where the dialogue waits 1 second before appearing to show angry senpai and play the *spooky* sound:
```haxe
function next(first:Bool) {
	if(first && canProceed) {
		canProceed = false;
		dialogueLines[0].playSound.play();
		new FlxTimer().start(1, (_) -> this.next(true));
	}
	else if(this.lastLine == null) canProceed = true;  // If its not null means the dialogue is not at the first one!  - Nex
}
```

### Dialogue Character
These scripts use a <syntax lang="haxe">DialogueCharacter</syntax> class instance as parent (so you can also check the variables and such easily!).

There's not much to say besides that the parent, and so the actual character, obliviously behaves like a <syntax lang="haxe">FunkinSprite</syntax>.

An example of scripted dialogue character can be found in Senpai where everytime it plays the <code class="hljs-string">angry-show</code> animation, it's going to cancel the hide tween and in the case of another animation it immediately completes the tween, making Senpai looks like as if it disappears instantly:
```haxe
function postHide() {
	if(curTween != null) {
		if(animation.curAnim?.name == 'angry-show') curTween.cancel();
		else curTween.percent = 1;
	}
}
```

### Dialogue Box
These scripts use a <syntax lang="haxe">DialogueBox</syntax> class instance as parent (so you can also check the variables and such easily!).

There's not much to say here too and like the dialogue characters, the parent and so the actual box, obliviously behaves like a <syntax lang="haxe">FunkinSprite</syntax>.<br>
But also it's important to remember that on every line, in the xml, it's possible to place a ``callback`` attribute on any line (like already said in the <a href="../../cutscenes-dialogues.md">Cutscenes and Dialogues</a> page) that allows to call any function inside of this dialogue box's script as soon as that specific line gets shown on screen.

A big example of scripted dialogue box can be found in Week 6 with the Hating Simulator's pixel dialogue box that makes a background fade with a pixelish tween and a moving pixel hand appear on the bottom right part of the box:
```haxe
var loopedTimah:FlxTimer;
var bgFade:FlxSprite;
var hand:FlxSprite;

function postCreate() {
	bgFade = new FlxSprite().makeSolid(FlxG.width + 100, FlxG.height + 100, 0xFFB3DFd8);
	bgFade.screenCenter();
	bgFade.scrollFactor.set();
	bgFade.alpha = 0;
	cutscene.insert(0, bgFade);

	loopedTimah = new FlxTimer().start(0.83, function(tmr:FlxTimer)
	{
		bgFade.alpha += (1 / 5) * 0.7;
		if (bgFade.alpha > 0.7)
			bgFade.alpha = 0.7;
	}, 5);

	hand = new FlxSprite(0, 600).loadGraphic(Paths.image('stages/school/ui/hand_textbox'));
	hand.scale.set(4, 4);
	hand.updateHitbox();
}

var finished:Bool = false;
function close(event) {
	if(finished) return;
	else event.cancelled = true;
	cutscene.canProceed = false;

	cutscene.curMusic?.fadeOut(1, 0);
	for(c in cutscene.charMap) c.visible = false;

	loopedTimah.cancel();
	loopedTimah = new FlxTimer().start(0.2, function(tmr:FlxTimer)
	{
		if (tmr.elapsedLoops <= 5) {
			cutscene.dialogueBox.alpha -= 1 / 5;
			cutscene.dialogueBox.text.alpha -= 1 / 5;
			bgFade.alpha -= (1 / 5) * 0.7;
			hand.alpha -= 1 / 5;
		} else {
			finished = true;
			cutscene.close();
		}
	}, 6);
}

var time:Float = 0;
function update(elapsed:Float) {
	if(hand.visible = dialogueEnded) {
		hand.x = 1060 + Math.sin((time += elapsed) * Math.PI * 2) * 12;
		hand.x -= hand.x % hand.scale.x;
		hand.y -= hand.y % hand.scale.y;
	}
}

function postPlayBubbleAnim() {
	cutscene.remove(hand);
	if(active && visible)
		cutscene.add(hand);
}
```

### Result of the two Dialogue example scripts:

<video height="500" autoplay muted loop>
  <source src="./Week 6 Dialogue.webm" type="video/webm">
  Your browser does not support the video tag.
</video>