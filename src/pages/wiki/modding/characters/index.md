---
author: Frakits & Ne_Eo & Nex_isDumb
desc: This page explains how to create characters for your mod!
lastUpdated: 2024-09-23T07:49:54.000Z
title: Creating Characters
---
# Creating Characters

Creating characters thru the engine is not available yet, so you have to manually add the files yourself.<br>
All you need is the spritesheet and an XML file for the data.<br>
The spritesheet goes in ``./images/characters/`` and the XML file in ``./data/characters``.

Writing the XML file is pretty simple, here is what Dad's XML data looks like:
```xml
<character isPlayer="false" flipX="false" holdTime="6.1" color="#AF66CE">
    <anim name="idle" anim="Dad idle dance" fps="24" loop="false" x="0" y="0"/>
    <anim name="singUP" anim="Dad Sing note UP" fps="24" loop="false" x="-6" y="50"/>
    <anim name="singLEFT" anim="dad sing note right" fps="24" loop="false" x="-10" y="10"/>
    <anim name="singRIGHT" anim="Dad Sing Note LEFT" fps="24" loop="false" x="0" y="27"/>
    <anim name="singDOWN" anim="Dad Sing Note DOWN" fps="24" loop="false" x="0" y="-30"/>
</character>
```
There's a lot to unpack, but we'll go over the <syntax lang="xml">&lt;character&gt;</syntax> node's properties first:
- ``sprite`` determines which sprite to load, if you have a spritesheet with a different name.
- ``isPlayer`` determines whether your character is a player character or not *(for example, boyfriend is a player character)*.
- ``x`` and ``y`` determine the character's position in the stage. *(keep in mind that stages can override these values)*
- ``scale`` determines the scale of the character.
- ``camx`` and ``camy`` adjusts the character's camera point.
- ``flipX`` can be used if your sprite is facing the wrong direction.
- ``antialiasing`` determines if your sprite should use antialiasing or not.
- ``gameOverChar`` defines the separate character to be used on the Game Over screen *(for example bf-dead)*
- ``icon`` can be used if your character icon has a different name.
- ``color`` defines the color of it's Health Bar part.
- ``holdTime`` defines how many steps it should wait until resuming to it's idle.

These are about all properties you can apply to the character node.<br>
You can obviously apply more properties and access them in Scripts, see <a href="../scripting/playstate-scripts/character-stage-scripts.md">Character/Stage Scripts</a>.

As for the <syntax lang="xml">&lt;anim&gt;</syntax> nodes, they're pretty self-explanatory but here's a list of properties of them too:
- ``name`` defines the internal name of the animation *(used for scripting)*
- ``anim`` is the prefix for finding the animation in the spritesheet.
- ``indices`` indicates which frames to play from the previously found frames.
- ``type`` determines the type of the animation. either <code class="hljs-string">beat</code> or <code class="hljs-string">loop</code>.
- ``fps`` is the framerate of your animation.
- ``x`` and ``y`` are the animation offset. *(offset is only applied when the animation is played)*
- ``forced`` whether or not to force animation playback while a different one is already playing.
- ``loop`` to make your animation loop.

## <h2 id="health-icons">Health Icons</h2>

In this engine, health icons have a bit more functionality than the ordinary engine. Such as:

### Adding more than just a neutral and a losing icon.

Meaning that you can also add a winning icon *(by making the icon image 450x150 instead of 300x150)*, but it doesn't stop at just the winning icon, because you can add as many icons as you like *(for example pre winning or pre pre losing etc)*<br>
Keep in mind that the width of the icon image is determined by 150 * the amount of icons you want to have.

### Script Event for when the icon changes it's icon state.

Using this event in a Global Script to run code for when the icon changes it's state: ``onHealthIconAnimChange``.