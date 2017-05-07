/**
 * Created by fabianschweizer on 06.05.17.
 */

const apis = {
    audio: null,
    battery: null
};

const audioSuccess = function(localMediaStream) {
    var audioCtx = new AudioContext();
    var audioSrc = audioCtx.createMediaStreamSource(localMediaStream);
    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    audioSrc.connect(analyser);
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    var bins = [];
    frequencyData.forEach(function(e) {
        var e = document.createElement('div');
        e.classList.add('bin');
        document.getElementById('bins').appendChild(e);
        bins.push(e);
    });


    function renderFrame() {
        analyser.getByteFrequencyData(frequencyData);
        apis.audio = frequencyData;

        frequencyData.forEach(function (data, index) {
            bins[index].style.height = ((data * 100) / 256) + "%";
        });

        requestAnimationFrame(renderFrame);
    }
    renderFrame();


};

const audioFail = function() {
    console.log('Fail');
};

navigator.getUserMedia({audio: true}, function(localMediaStream) {audioSuccess(localMediaStream)}, audioFail);

// const battery = navigator.getBattery();
//
// if (battery) {
//     battery.then(
//         (batteryManager) => {
//             apis.battery = batteryManager;
//
//             const updateBattery = function(self, type) {
//                 console.log(self, type);
//             };
//
//             batteryManager.onchargingchange = function () {
//                 updateBattery(this, 'charging');
//             };
//             batteryManager.onchargingtimechange = function () {
//                 updateBattery(this, 'chargingtime');
//             };
//             batteryManager.ondischargingtimechange = function () {
//                 updateBattery(this, 'dischargingtime');
//             };
//             batteryManager.onlevelchange = function () {
//                 updateBattery(this, 'level');
//             };
//         }
//     );
// }
