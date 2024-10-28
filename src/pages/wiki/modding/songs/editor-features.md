---
author: Frakits
desc: How to use the chart editor.
lastUpdated: 2024-09-18T14:25:17.000Z
title: Additional Chart Editor Features
---
# Additional Chart Editor Features

while we have only covered the basic of charting in <a href="../songs/">Creating songs</a>, we will cover the additional chart editor features here, in no particular order.

## <h2 id="strumlines">Strumlines</h2>
### More than 2.
Songs in Codename Engine are more modular, in the sense that you're no longer restricted to just 2 strumlines. This means that, you can have as many strumlines and characters in the song as you like. Moreover, Girlfriend also gets her own strumline.

<img src="./Chart Editor Features.png"/>

### Moving around.

This is only an in-editor thing, but if you don't like how the Strumlines are ordered, and prefer a different order, you can reposition them easily with just this lock button.<br>
(insert a gif here)

### Hitsounds
Pretty self explanatory, but you get to choose which Strumline should play a Hitsound when you get past a Note.
(This only applies in the chart editor, not during gameplay)

<img src="./Chart Editor Features-1.png"/>

### Waveforms.
Waveforms allows for visualizing songs, and we have that too. You get 2 or more options depending on how many audio files you have in the songs.

<img src="./Chart Editor Features-2.png"/>
<img src="./Chart Editor Features-3.png"/>

### Editing Strumlines Data.
Strumlines have more options than usual, being able to do things without scripting them in.

<img src="./Chart Editor Features-4.png"/>

- **Characters**, is where you input your characters. As you can see, you can have more than one character per Strumline.
- **Type**, is where you determine the type of the strumline. Player makes the Strumline playable by a player, while Opponent and Additional makes the Strumline be handled by a CPU.
- **Stage positioning**, is where you select where the Strumline characters will be placed, pretty self-explanatory.
- **Scale and HUD position**, is where you set the scale of the strumline and the position in the HUD. *(keep in mind when setting the HUD positioning, the X axis is determined by a float, aka. 0.25 is Opponent side, 0.75 is Player side, and 0.5 is the middle point, while y axis uses actual positioning)*
- **Visible** determines whether or not your Strumline shows up in the song. If you have it disabled, your Strumline will cease to exist *(though your notes will be intact and still play)*.
- **Scroll Speed and that switch with a long name in it** determines if this Strumline should use a scroll speed, separately from the other Strumlines.
- **Vocal Suffix** is covered in this next section.

### Multi-Vocals
You can have different vocal audio files per Strumline. As seen previously, there's an option to set Vocal Suffixes on a Strumline.

For this, you have to obviously have different vocal audio files ready, with a suffix at the end *(for example ``Voices-bf.ogg`` has a ``-bf`` suffix at the end)*

<img src="./Chart Editor Features-16.png"/>
<img src="./Chart Editor Features-15.png"/>

## <h2 id="events-notetypes">Events & Notetypes</h2>
### Events
Events exist in the Chart Editor to avoid coding a lot of code for just a few events. Some of them are already built-in but you can also code your own *(see <a href="../scripting/playstate-scripts/events-notetypes-scripts.md">Events/Notetype Scripts</a>)*.

<img src="./Chart Editor Features-5.png"/>
<img src="./Chart Editor Features-6.png"/>

Each event has it's own parameters, instead of a pre-established number of parameters. <br> Events are also stackable, without having to painstakingly putting them close together.

<img src="./Chart Editor Features-8.png"/>
<img src="./Chart Editor Features-7.png"/>

Events are also movable.<br>
(insert gif of moving events)

### Notetypes

<img src="./Chart Editor Features-9.png"/>

You can code your own note types, or use the pre-existing one *(though only 2 exists currently)*. They need to first be added to the note types list before being able to use them. Afterwards you can simply select them from the dropdown here.

<img src="./Chart Editor Features-10.png"/>

You can also change the graphic of a Note type without programming, by putting the Note type's spritesheet in ``images/game/notes``.

## <h2 id="meta-data" sidebar="Changing Metadata">Changing additional chart/meta data</h2>

<img src="./Chart Editor Features-12.png"/>

If you wish to change some data regarding the chart *(scroll speed, bpm, stage etc.)*, you can do so here.

### Editing chart data.

<img src="./Chart Editor Features-13.png"/>

Editing chart data has only 2 options, and they're self explanatory.

### Editing metadata information.

<img src="./Chart Editor Features-14.png"/>

Editing metadata information, is also self-explanatory, though you can notice this menu is similar to what you've seen in <a href="../songs/">Creating songs</a>, so this should be easy to figure out. Though you might also notice there's a new option, **Custom Values**. These are extra values that let's you set certain values specifically for the song *(for example, crediting someone for a song)*. This will be covered in <a href="../scripting/playstate-scripts/gameplay-scripts.md">Gameplay Scripts</a>.

## <h2 id="saving">Saving your chart</h2>

The chart editor allows for multiple ways to save a chart. Currently, there's about 10 ways to save the information of a chart.

<img src="./Chart Editor Features-11.png"/>

We know what the first option does, but what about those other ones? Well, here's what they do:
- **Save Without Events** saves the chart without saving it's events.
- **Save Events Separately** saves the events in a separate file, which gets parsed on any difficulty chart you play on. *(Note that if you used this you have to also use **Save Without Events**, otherwise you will face issues with duplicate events)*
- **Save Meta** saves the meta into a separate file.
- **Export For FNF Legacy** saves the chart in a format that is supported by other FNF engines.
- **Export For Psych Engine** saves the chart specifically in Psych Engine's format.