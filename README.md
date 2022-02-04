### MPG Sampler

The MPG is Goldsmiths' very own cheap rip off version of the popular
Akai MPC sampler. If you don't know what an MPC is then watch
[this](https://www.youtube.com/watch?v=QoVOiT5Qs0c) (Ignore the
chocolate bit!)

Currently the MPG is a bare template.

Apply the things you have learned so far in this module to turn this
code into an awesome DJ app.

#### Tasks

1. Controlling click. [1 mark]
   - Run the code and try it out.
   - When you press the button at the top left of the grid, you should
     hear a very fast repeating sound.
   - The pattern for this sound is stored in a `StepSeqTrack` object
     assigned to the variable `click`.
   - Find the class definition for `StepSeqTrack` and look at the
     constructor parameters and what properties are available.
   - Find where `click` is initialised in `sketch.js` and replace some
     of the 1s with 0s in the pattern array so that the click sound
     plays once every 4 beats.

2. Add a display counter visualisation. [1 mark]
   - The UI could be improved by visualising the `playhead` position.
   - The sequencer is driven by a high accuracy audio-rate clock,
     initialised in `startAudio()`. Find where this is initialised in
     `sketch.js`.
   - This clock calls `play()` at regular intervals based on the
     global beats-per-minute variable.
   - Find the definition of `play()`. Can you see how `playhead` is
     used to step through the step-sequencer pattern values?
   - Visualise `playhead` by drawing to the canvas.
   - Hint: A simple option could be use `text()` to draw the
     `playhead` number somewhere on the canvas. A more exciting
     solution could involve visualising the `playhead` position using
     shapes and colour to create an effective animation.

2. Adding the next sound [2 marks]
   - Based on the code that initialises the variable `click`, create a
     new global variable called `beep` and initialise it in `setup()`
     as a new `StepSeqTrack` object.
   - You will want to give this track a new name and new
     pattern. Connect this track to the second button by passing
     `buttons[1]` as the third parameter of the constructor.
   - Next we need to create a new `Tone.Player()` object to play back
     the beep sound. Find where `click.player` is assigned in
     `startAudio()`. Note we are assigning the new player object to a
     property of our `click` object. Copy and modify this code to
     create a `beep.player` object that loads the sample
     `assets/beep.mp3`.
   - Connect `beep.player` to your speakers.
   - Finally we need to trigger the beep sound. Look how this works
     for the `click` sound inside the `play()` function. Copy and
     adapt this code to trigger the beep sound given `beep.pattern`
     and the `playhead` position.
   - For accurate scheduling it is essential that you pass the `time`
     parameter to the `start()` method: `beep.player.start(time)`.
   - Test your `beep` sound. You should be able to turn it on and off
     using the top centre button. Try playing with the 0s and 1s in
     `beep.pattern` array to create a rhythm that you like.
   - Hint: You can even try live code by changing the array in the
     console using the global `beep` variable.

3. Add your own sound [1 marks]
   - Find a very short audio sample to work with. Perhaps a bass drum.
   - e.g. download a sample from freesounds.org and edit it in
     Audacity.
   - Follow the same process as above to add your new sound. This one
     should be turned on and off by using the top right-hand button.

4. Volume slider [1 mark]
   - The slider on the far left would make a perfect master volume
     control for the output of the MPG.
   - Create a global variable called `mainOut` and initialise it in
     `startAudio()` as a new `Tone.Volume(0)` object. Zero here means
     0 dB (unity signal gain).
   - Connect `mainOut` to your speakers.
   - Now instead of connecting your sample players directly to your
     speakers, connect them to `mainOut`.
   - Hint: Look up the definition of the `Player.connect()` method in
     the Tone.js documentation. You will need to remove the call to
     `toDestination()`.
   - Finally add a line of code to `slider_0_Moved` to assign the
     value of the slider to `mainOut.volume.value`. Don’t forget that
     volume in Tone.js assumes decibels. The slider gives you values
     between zero and one (see the console when you move it), you need
     to convert this to a reasonable decibels range.
   - Hint: Checkout the `ampToDb` function!
   - Test than when you change the slider the volume of all of your
     sounds changes.

5. Hi-hat with volume control [1 mark]
   - As before adapt the code to play the sample `hat.mp3`.
   - This time it should be controlled by the first button on the
     middle row of buttons.
   - Once the sound is working change the 0s and 1s in your hi-hat beat
     pattern to float values between 0 and 1. We will use these values
     to control the volume of the individual sounds.
   - In the `play()` function modify the hi-hat trigger `if` statement
     so that it sets the value of `hihat.player.volume` using the
     `rampTo()` method. This is essential for sample accurate
     scheduling of the volume changes.
   - `.rampTo()` takes three parameters: volume (=dB, based on the
     numbers in the pattern array), ramp duration (=0) and `startTime`
     (=`time`)
   - Check that the hi-hats now change volume throughout the pattern.

6. Be creative [3 marks] 
   - These few steps have got you started but now you need to finish
     the job. Assign samples and functions to the remaining buttons
     and sliders.

Show off as many of the techniques that you have just learnt as
possible. For example you could:

   - adjust the playback rates of the samples
   - reverse some sample playback (based on the `playhead` or
     `random()` function)
   - add a controllable delay to one of the sounds
   - make one slider adjust the tempo of the playback
   - use the `random()` or `sin()` functions to create variation

NB. Musical style and taste are up to you, but make sure that the
techniques applied are appropriate for the samples you've used.

7. Zip the whole folder to submit.
   - Make sure we can run your code with what you've
     submitted. Include the libraries and samples. Don't miss anything
     out!
   - Make sure your samples are small. The upper limit for your
     uploaded files is 100MB.
