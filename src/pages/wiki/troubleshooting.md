---
author: Ne_Eo
desc: This page explains how to fix common issues.
lastUpdated: 2024-10-10T18:24:22.949Z
title: Troubleshooting
---
# Troubleshooting

## <h2 id="notes-only-on-left-side" sidebar="Notes only on left side of the screen.">My notes are only appearing on the left side of the screen.</h2>

Open the strumline options and for the bf strumline set the X ratio to 0.75, and for the dad strumline set the X ratio to 0.25.

## <h2 id="character-editor-buggy">The character editor is buggy.</h2>

Please have some patience as we are working on fixing the issues that are causing this.

## <h2 id="rotating-strum-moves-notes">Rotating a strum moves the notes.</h2>

To prevent this behavior, you can do <syntax lang="haxe">strum.noteAngle = 0;</syntax>

## <h2 id="velocity-not-working" sidebar="Velocity not working">Velocity/Acceleration doesn't move my sprite</h2>

You need to set `sprite.moves = true;` to make it move, its automatically enabled if you set the property using <syntax lang="xml">&lt;property /&gt;</syntax> on `velocity.x` and `velocity.y` or `acceleration.x` and `acceleration.y` in the stage xml.

We made it turned off automatically to optimize the game since it's useless to have it running for sprites that don't use it.