1. How to run the HearMe application

1.1 Log in
When the app is opened for the first time, the user will be asked to log in with a google or facebook account. 
On a device or emulator (iOS or Android), the user will be redirected to an in-app browser to log in. On the Chrome browser, a pop up window will appear and ask the user to log in.

1.2 Main Menu
After logging in the user will be directed to the application’s main menu. The menu has 4 options.

1.3 Start Test
If the user presses start test, the hearing test will begin. 
Tapping the play button will play a random sequence of 3 digits (not zero or seven) of varying signal-to-noise ratios. 
The user can guess the digits by entering a number in each of the inputs below the play button and pressing submit. 
If the user is correct, the next sequence presented will be of a lower signal-to-noise ratio 
If the user is incorrect, the next sequence will be of a higher signal-to-noise ratio. This will continue for 24 sequences.
After the submitting a guess for the 24th sequence, the user will be taken to the result page for the test which will display their hearing threshold.
The test result will be stored in the firebase database.
The user may cancel the test at any time by tapping the home icon in the upper left corner, which will take them to the main menu.

1.4 View Past Results
If the user presses View Past Results, they will be taken to a view that shows the overall trend of all of their test results and will list each result by date.
If the user taps one of the listed results, they will be taken to the result page for that test.
The results are tied to the user’s account through firebase and will persist if the user logs out or logs in on another device.
The user can return to the main menu by tapping the home icon.

1.5 Update Information
Tapping update information will take the user to a view which contains information such as sex and birth date.
This information is tied to the user’s account through firebase and will persist if the user logs out or logs in on another device.
The user can update their information by editing the fields and pressing save.
Tapping sign out will log the user out and will redirect the user to the login page.
The user can return to the main menu by tapping the home icon.

1.6 Schedule Test
Tapping Schedule Test will take the user to a view which allows them to schedule a test for a future date.
Entering a date in the date picker and pressing Schedule Test will create an all-day event called HearMe Test on the date picked in the device’s native calendar.
Tapping Open Calendar will open the device’s native calendar to the day of the most recently scheduled test, or today if no test has been scheduled.
The user can return to the main menu by tapping the home icon.

2. Supported Devices

2.1 Devices and Emulators
The app has been tested on both iOS and Android emulators. All functionality works in both emulators. 

2.2 Browser
All functionality works in the Chrome browser except for the scheduling feature. 
Attempting to schedule a test or open the calendar in the Chrome browser will do nothing.
All functionality works on both iOS and Android emulators and devices. 

3. Firebase Storage
Digit, sentence, and noise signals and stimuli were all created using available packages in MATLAB. Audacity and Adobe Audition were utilized for further signal processing, filtering, RMS normalization, and amplification. Digit sound files were generated in the style of male and female voices. All WAV files are stored using Firebase, and not in the actual project. 

4. About the test

We are implementing a hearing in noise test. The Hearing-in-Noise Test (HINT) measures an individual’s ability to hear speech in quiet and in noise. 
HINTs are traditionally done testing both ears together as binaural hearing ability is key in noisy settings and everyday, functional hearing. 

Current HINTs use digit-triplets (digits in noise test), phonemes, or full-sentences presented with competing noise. 
Sentence tests are reported to be more efficient and provide more reliable SRT measurements than single-word tests. 
During the tests, subjects must repeat or select digits/words/sentences, typically from a closed set. 
Each stimulus is scored as either correct or incorrect and the intensity of the stimulus is adjusted using a 2-up-1-down paradigm, while the background noise in the audio is held at the same intensity.
For further reference about the test we are trying to implement, see the following website: http://www.californiaearinstitute.com/audiology-services-hint-bay-area-ca.php.

5. Updates in this version
-Added an instructions page before the test begins which also allows the user to adjust their volume after playing a test sound
-Added the ability to log in using Facebook (Note: user cannot log in with a facebook account if they have already logged in with a google account tied to the same email address)
-Changed the set up of the audio files so playback is more consistent during the test
-Fixed bugs related to storing past test results
-Fixed bug related to the scheduling feature; the event will now be scheduled interactively instead of silently



